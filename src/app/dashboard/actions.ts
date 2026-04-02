'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export async function createApp(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return redirect('/auth')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const package_name = formData.get('package_name') as string
  const category = formData.get('category') as string
  
  let icon_url = formData.get('icon_url') as string
  
  // Handle File Upload for Icon
  const iconFile = formData.get('icon_file') as File
  if (iconFile && iconFile.size > 0) {
    const fileExt = iconFile.name.split('.').pop()
    const filePath = `icons/${user.id}-${Date.now()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('store_assets')
      .upload(filePath, iconFile)
      
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from('store_assets').getPublicUrl(filePath)
      icon_url = publicUrl
    }
  }

  const { data, error } = await supabase
    .from('apps')
    .insert({
      title,
      description,
      icon_url: icon_url || 'https://placehold.co/512x512/2563eb/ffffff?text=APP',
      package_name,
      category,
      developer_id: user.id
    })
    .select()

  if (error) {
    return redirect(`/dashboard/upload?message=${error.message}&type=error`)
  }

  revalidatePath('/dashboard', 'layout')
  revalidatePath('/', 'layout')
  redirect(`/dashboard/apps/${data[0].id}/edit?message=Aplikasi berhasil dibuat! Sekarang Anda bisa mengunggah file APK-nya.&type=success`)
}

export async function updateApp(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('app_id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const icon_url = formData.get('icon_url') as string
  const category = formData.get('category') as string

  const { error } = await supabase
    .from('apps')
    .update({ title, description, icon_url, category })
    .eq('id', id)

  if (error) {
    return redirect(`/dashboard/apps/${id}/edit?message=Gagal menyimpan: ${error.message}&type=error`)
  }

  revalidatePath('/dashboard', 'layout')
  revalidatePath(`/apps/${id}`, 'layout')
  redirect(`/dashboard/apps/${id}/edit?message=Info Aplikasi berhasil diperbarui!&type=success`)
}

export async function addAppVersion(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/auth')

  const app_id = formData.get('app_id') as string
  const version_name = formData.get('version_name') as string
  const version_code = parseInt(formData.get('version_code') as string)
  const release_notes = formData.get('release_notes') as string
  
  let apk_url = formData.get('apk_url') as string
  let size_mb = parseFloat(formData.get('size_mb') as string) || 0
  let real_size_bytes = size_mb * 1024 * 1024

  // Handle File Upload for APK
  const apkFile = formData.get('apk_file') as File
  if (apkFile && apkFile.size > 0) {
    const fileExt = apkFile.name.split('.').pop()
    const filePath = `apks/${app_id}/v${version_name}-${Date.now()}.${fileExt}`
    
    // Convert to array buffer for upload
    const { error: uploadError } = await supabase.storage
      .from('store_assets')
      .upload(filePath, apkFile)
      
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from('store_assets').getPublicUrl(filePath)
      apk_url = publicUrl
      real_size_bytes = apkFile.size
    } else {
      return redirect(`/dashboard/apps/${app_id}/edit?message=Gagal mengupload APK: ${uploadError.message}&type=error`)
    }
  }

  const { error } = await supabase
    .from('app_versions')
    .insert({
      app_id,
      version_name,
      version_code,
      release_notes,
      apk_url,
      size_bytes: real_size_bytes
    })

  if (error) {
    return redirect(`/dashboard/apps/${app_id}/edit?message=Gagal mengupdate versi: ${error.message}&type=error`)
  }

  revalidatePath(`/apps/${app_id}`, 'layout')
  redirect(`/dashboard/apps/${app_id}/edit?message=Versi terbaru berhasil dipublikasikan!&type=success`)
}

export async function deleteApp(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('app_id') as string

  // 1. Ambil info aset aplikasi sebelum dihapus dari DB (untuk keperluan hapus file)
  const { data: app, error: fetchError } = await supabase
    .from('apps')
    .select('icon_url')
    .eq('id', id)
    .single()

  if (fetchError) {
    return redirect(`/dashboard?message=Aplikasi tidak ditemukan.&type=error`)
  }

  const iconUrl = app?.icon_url;

  // 2. Hapus data dari database TERLEBIH DAHULU (Inti Utama)
  // Cascade akan menghapus app_versions dan ratings secara otomatis
  const { error: dbError } = await supabase
    .from('apps')
    .delete()
    .eq('id', id)

  if (dbError) {
    console.error('Database Delete Error:', dbError)
    return redirect(`/dashboard/apps/${id}/edit?message=Gagal menghapus dari database: ${dbError.message}&type=error`)
  }

  // 3. Jika Database berhasil dihapus, baru kita bersihkan file fisiknya di Storage (Background Cleanup)
  try {
    // Hapus Folder APK
    const { data: apkFiles } = await supabase.storage.from('store_assets').list(`apks/${id}`)
    if (apkFiles && apkFiles.length > 0) {
      const filesToDelete = apkFiles.map(f => `apks/${id}/${f.name}`)
      await supabase.storage.from('store_assets').remove(filesToDelete)
    }

    // Hapus Icon
    if (iconUrl && iconUrl.includes('store_assets')) {
      const parts = iconUrl.split('/storage/v1/object/public/store_assets/')
      const path = parts.length > 1 ? parts[1] : null
      if (path) {
        await supabase.storage.from('store_assets').remove([path])
      }
    }
  } catch (storageError) {
    console.error('Storage Cleanup Warning:', storageError)
    // Kita tidak menghentikan proses redirect sukses karena DB sudah terhapus
  }

  // 4. Paksa refresh semua cache agar data benar-benar hilang dari layar
  revalidatePath('/', 'layout')
  revalidatePath('/dashboard', 'layout')
  revalidatePath(`/apps/${id}`, 'layout')
  
  // 5. Redirect Terakhir
  redirect(`/dashboard?message=Aplikasi berhasil dihapus total dari sistem.&type=success`)
}
