'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'

export async function recordDownloadGlobal(appId: string) {
  const supabase = await createClient()
  
  // Mencatat download ke tabel apps (Global Counter)
  // Kita gunakan RPC increment_downloads yang sudah kita buat tadi di SQL Editor
  const { error } = await supabase.rpc('increment_downloads', { row_id: appId })

  if (error) {
    // Fallback jika RPC belum dipasang: Update manual sederhana
    const { data: currentApp } = await supabase.from('apps').select('downloads').eq('id', appId).single()
    if (currentApp) {
      await supabase.from('apps').update({ downloads: (currentApp.downloads || 0) + 1 }).eq('id', appId)
    }
  }

  revalidatePath(`/apps/${appId}`)
  revalidatePath('/')
  return { success: true }
}
