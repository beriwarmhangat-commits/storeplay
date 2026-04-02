'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { headers } from 'next/headers'

export async function submitRating(formData: FormData) {
  const supabase = await createClient()
  
  // Dapatkan IP Address untuk sistem rating tanpa login
  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'

  const appId = formData.get('app_id') as string
  const score = parseInt(formData.get('score') as string)
  const review = formData.get('review') as string

  // Simpan rating berbasis IP
  // Jika kolom 'user_ip' belum ada, gunakan fallback insert sederhana
  const { error } = await supabase
    .from('ratings')
    .upsert({
      app_id: appId,
      user_id: null,
      user_ip: ip,
      score: score,
      review: review
    }, { onConflict: 'app_id,user_ip' })

  if (error) {
    // Fallback jika database belum diupdate kolomnya
    const { error: fallbackError } = await supabase
      .from('ratings')
      .insert({
        app_id: appId,
        score: score,
        review: review,
        user_id: null
      })
    
    if (fallbackError) {
      console.error('Error submitting rating:', fallbackError)
      return { error: 'Gagal mengirim rating (Database Sync Required)' }
    }
  }

  revalidatePath(`/apps/${appId}`)
  return { success: true }
}
