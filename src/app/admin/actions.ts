'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'

// 1. Ubah Role User (Sudah ada, tapi kita perkuat)
export async function changeUserRole(formData: FormData) {
  const supabase = await createClient()
  const userId = formData.get('user_id') as string
  const role = formData.get('role') as string

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

// 2. Hapus Aplikasi (Takedown global oleh Admin)
export async function deleteAppAdmin(formData: FormData) {
  const supabase = await createClient()
  const appId = formData.get('app_id') as string

  // Hapus data (Storage cleanup bisa ditambahkan di sini jika perlu, 
  // tapi Cascade Delete di DB akan menghapus record apps & versions)
  const { error } = await supabase
    .from('apps')
    .delete()
    .eq('id', appId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

// 3. Hapus Rating (Moderasi Ulasan)
export async function deleteRating(formData: FormData) {
  const supabase = await createClient()
  const ratingId = formData.get('rating_id') as string

  const { error } = await supabase
    .from('ratings')
    .delete()
    .eq('id', ratingId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

// 4. Update Profile User (Ganti Nama Developer oleh Admin)
export async function updateProfileAdmin(formData: FormData) {
  const supabase = await createClient()
  const userId = formData.get('user_id') as string
  const developerName = formData.get('developer_name') as string

  const { error } = await supabase
    .from('profiles')
    .update({ developer_name: developerName })
    .eq('id', userId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

// 5. Hapus Akun User (Admin Only)
export async function deleteUserAdmin(formData: FormData) {
  const supabase = await createClient()
  const userId = formData.get('user_id') as string

  // Note: Ini hanya menghapus di tabel profiles, 
  // untuk benar-benar mendisable login butuh supabase.auth.admin yang butuh service role key.
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}
// 6. Update Aplikasi secara Global (Content Moderation)
export async function updateAppAdmin(formData: FormData) {
  const supabase = await createClient()
  const appId = formData.get('app_id') as string
  const title = formData.get('title') as string
  const status = formData.get('status') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const iconUrl = formData.get('icon_url') as string

  const { error } = await supabase
    .from('apps')
    .update({ 
      title, 
      status, 
      category, 
      description, 
      icon_url: iconUrl 
    })
    .eq('id', appId)

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/apps')
  revalidatePath('/admin/apps')
  revalidatePath(`/apps/${appId}`)
}

// 7. Manage Site Alerts
export async function createAlert(formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title') as string
  const message = formData.get('message') as string
  const type = formData.get('type') as string
  const location = formData.get('location') as string

  const { error } = await supabase
    .from('site_alerts')
    .insert({ title, message, type, location })

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function deleteAlert(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  const { error } = await supabase
    .from('site_alerts')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function toggleAlert(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const isActive = formData.get('is_active') === 'true'

  const { error } = await supabase
    .from('site_alerts')
    .update({ is_active: !isActive })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}
