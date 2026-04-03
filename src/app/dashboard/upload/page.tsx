import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import UploadAppClient from './UploadAppClient'
import DeveloperPaywall from '@/components/DeveloperPaywall'

export default async function UploadAppPage({ searchParams }: { searchParams: Promise<{ message?: string, type?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  if (profile?.role === 'user') {
    return <DeveloperPaywall />
  }

  const params = await searchParams
  const message = params?.message
  const type = params?.type || 'error'

  return <UploadAppClient message={message} type={type} />
}
