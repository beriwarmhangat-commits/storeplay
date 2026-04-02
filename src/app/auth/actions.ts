'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { headers } from 'next/headers'

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
  
  // 1. Dapatkan IP Address (Anti-Spam 2 Akun/IP)
  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'

  // 2. Cek apakah IP sudah mendaftarkan 2 akun
  const { count } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('registration_ip', ip)

  if (count && count >= 2) {
    return redirect(`/auth?message=Maaf, batas maksimum pendaftaran (2 akun) per IP telah tercapai.&type=error`)
  }

  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'user', // Default sekarang user, bukan developer
        registration_ip: ip
      }
    }
  })

  if (result.error) {
    return redirect(`/auth?message=${result.error.message}&type=error`)
  }

  // Registrasi berhasil (Sekarang otomatis login karena email confirm OFF)
  revalidatePath('/', 'layout')
  redirect('/auth?message=Register berhasil silahkan login&type=success')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
