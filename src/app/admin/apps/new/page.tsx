import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import UploadAppClient from '@/app/dashboard/upload/UploadAppClient'

export default async function AdminNewAppPage({ searchParams }: { searchParams: Promise<{ message?: string, type?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  // Proteksi Tambahan: Hanya Admin yang boleh akses upload (Double check role)
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    redirect('/') // Tendang user biasa ke Home
  }

  const params = await searchParams
  const message = params?.message
  const type = params?.type || 'error'

  return (
    <div style={{ padding: '2rem' }}>
       <UploadAppClient message={message} type={type} />
    </div>
  )
}
