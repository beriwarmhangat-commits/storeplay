'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function updateSystemMode(mode: 'development' | 'production' | 'maintenance') {
  const supabase = await createClient()

  // Sederhanakan: kita simpan statenya di tabel 'system_config'
  // atau cara tercepat adalah di metadata rute atau tabel dummy
  // Mari kita asumsikan tabel system_config ada (kita buat lewat SQL)
  
  const { error } = await supabase
    .from('system_config')
    .update({ value: mode })
    .eq('key', 'site_mode')

  if (error) {
    // Jika tabel belum ada, buat record pertama (opsional tergantung DB setup)
    console.error('Update mode error:', error)
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
