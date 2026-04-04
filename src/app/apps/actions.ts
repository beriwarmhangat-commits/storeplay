'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function submitDeveloperReply(ratingId: string, appId: string, reply: string) {
  const supabase = await createClient()
  
  // Authenticate user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Verify ownership of the app
  const { data: appData } = await supabase
    .from('apps')
    .select('developer_id')
    .eq('id', appId)
    .single()

  // Verify if admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isOwner = appData?.developer_id === user.id
  const isAdmin = profile?.role === 'admin'

  if (!isOwner && !isAdmin) {
    throw new Error('Hanya developer aplikasi ini atau admin yang dapat membalas.')
  }

  // Update rating with reply
  const { error } = await supabase
    .from('ratings')
    .update({
      developer_reply: reply,
      replied_at: new Date().toISOString()
    })
    .eq('id', ratingId)

  if (error) throw new Error(error.message)

  revalidatePath(`/apps/${appId}`)
  return { success: true }
}

export async function deleteDeveloperReply(ratingId: string, appId: string) {
  const supabase = await createClient()
  
  // Authenticate user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Similar checks as above
  const { data: appData } = await supabase
    .from('apps')
    .select('developer_id')
    .eq('id', appId)
    .single()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (appData?.developer_id !== user.id && profile?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('ratings')
    .update({
      developer_reply: null,
      replied_at: null
    })
    .eq('id', ratingId)

  if (error) throw new Error(error.message)

  revalidatePath(`/apps/${appId}`)
  return { success: true }
}
