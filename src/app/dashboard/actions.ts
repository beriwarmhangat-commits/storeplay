'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { uploadToHuggingFace, deleteFromHuggingFace, deleteFolderFromHuggingFace } from '@/lib/huggingface/upload'

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
  
  // Handle File Upload for Icon via Hugging Face
  const iconFile = formData.get('icon_file') as File
  if (iconFile && iconFile.size > 0) {
    try {
      const fileExt = iconFile.name.split('.').pop()
      const filePath = `icons/${user.id}-${Date.now()}.${fileExt}`
      icon_url = await uploadToHuggingFace(iconFile, filePath)
    } catch (err: any) {
      console.error('HF Icon Upload Error:', err)
      // Fallback tetap jalan tapi log error
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

  // Ambil info aplikasi untuk penamaan file yang bagus
  const { data: currentApp } = await supabase.from('apps').select('title').eq('id', app_id).single()
  const cleanTitle = (currentApp?.title || 'app').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')

  // Handle File Upload for APK via Hugging Face (Unlimited Size)
  const apkFile = formData.get('apk_file') as File
  if (apkFile && apkFile.size > 0) {
    try {
      const fileExt = apkFile.name.split('.').pop()
      // Nama file cantik: NamaApp_v1.0.0.apk
      const fileName = `${cleanTitle}_v${version_name}.${fileExt}`
      const filePath = `apks/${app_id}/${fileName}`
      
      apk_url = await uploadToHuggingFace(apkFile, filePath)
      real_size_bytes = apkFile.size
    } catch (uploadError: any) {
      return redirect(`/dashboard/apps/${app_id}/edit?message=Gagal mengupload APK ke Hugging Face: ${uploadError.message}&type=error`)
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

  // 3. Bersihkan file fisiknya di Hugging Face (Background Cleanup)
  try {
    // Hapus Folder APK (Semua Versi)
    await deleteFolderFromHuggingFace(`apks/${id}`)

    // Hapus Icon (Hanya jika link-nya dari HF kita)
    if (iconUrl && iconUrl.includes('huggingface.co')) {
      const parts = iconUrl.split('resolve/main/')
      const path = parts.length > 1 ? parts[1] : null
      if (path) {
        await deleteFromHuggingFace(path)
      }
    }
  } catch (err) {
    console.warn('Storage Cleanup Warning:', err)
  }

  // 4. Paksa refresh semua cache agar data benar-benar hilang dari layar
  revalidatePath('/', 'layout')
  revalidatePath('/dashboard', 'layout')
  revalidatePath(`/apps/${id}`, 'layout')
  
  // 5. Redirect Terakhir
  redirect(`/dashboard?message=Aplikasi berhasil dihapus total dari sistem.&type=success`)
}
