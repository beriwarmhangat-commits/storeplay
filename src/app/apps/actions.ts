'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { headers } from 'next/headers'

export async function submitRating(formData: FormData) {
  const supabase = await createClient()
  
  const appId = formData.get('app_id') as string
  const score = parseInt(formData.get('score') as string)
  const review = formData.get('review') as string
  const deviceId = formData.get('device_id') as string

  // Get current user if logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get IP as fallback metadata
  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'

  // Decide on identifying factor (Logged in user ID vs Anonymous Device ID)
  // Constraint di DB: UNIQUE(app_id, user_id) DAN UNIQUE(app_id, device_id)
  
  const ratingData: any = {
    app_id: appId,
    score: score,
    review: review,
    user_ip: ip
  }

  if (user) {
    ratingData.user_id = user.id
  } else {
    ratingData.device_id = deviceId
  }

  // Upsert Rating
  const { error } = await supabase
    .from('ratings')
    .upsert(ratingData, { 
      onConflict: user ? 'app_id,user_id' : 'app_id,device_id',
      ignoreDuplicates: false 
    })

  if (error) {
    console.error('Rating error details:', error)
    if (error.code === '23505') { // Duplicate unique constraint
      return { error: 'Anda sudah memberikan ulasan untuk aplikasi ini.' }
    }
    return { error: 'Gagal mengirim ulasan. Pastikan Anda hanya memberi satu ulasan.' }
  }

  revalidatePath(`/apps/${appId}`)
  return { success: true }
}
