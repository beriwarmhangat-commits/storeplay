'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return redirect('/auth?message=Email belum dikonfirmasi. Silakan cek inbox Anda!&type=warning')
    }
    return redirect('/auth?message=Gagal login. Periksa kembali email dan password Anda.&type=error')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard?message=Login berhasil! Selamat datang kembali.&type=success')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'developer'
      }
    }
  })

  if (result.error) {
    return redirect(`/auth?message=${result.error.message}&type=error`)
  }

  // Registrasi berhasil, tapi biasanya butuh konfirmasi email
  revalidatePath('/', 'layout')
  redirect('/auth?message=Registrasi berhasil! Silakan cek email Anda untuk konfirmasi sebelum bisa login.&type=success')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
