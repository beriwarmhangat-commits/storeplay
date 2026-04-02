'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'

// 1. Tambah Kategori Baru
export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const slug = name.toLowerCase().replace(/\s+/g, '-')
  const icon_name = formData.get('icon_name') as string

  const { error } = await supabase
    .from('categories')
    .insert([{ name, slug, icon_name }])

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

// 2. Hapus Kategori
export async function deleteCategory(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}
