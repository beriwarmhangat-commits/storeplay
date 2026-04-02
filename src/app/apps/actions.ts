'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'

export async function submitRating(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Anda harus login untuk memberikan rating')
  }

  const app_id = formData.get('app_id') as string
  const score = parseInt(formData.get('score') as string)
  const review = formData.get('review') as string

  const { error } = await supabase
    .from('ratings')
    .upsert({
      app_id,
      user_id: user.id,
      score,
      review
    }, { onConflict: 'app_id,user_id' })

  if (error) {
    console.error('Error submitting rating:', error)
    return { error: error.message }
  }

  revalidatePath(`/apps/${app_id}`)
  return { success: true }
}
