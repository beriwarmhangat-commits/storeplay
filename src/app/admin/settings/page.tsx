import { createClient } from '@/lib/supabase-server'
import ModeSettingsClient from './ModeSettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  // Ambil state mode saat ini dari database
  const { data: config } = await supabase
    .from('system_config')
    .select('value')
    .eq('key', 'site_mode')
    .single()

  return (
    <ModeSettingsClient currentMode={config?.value || 'production'} />
  )
}
