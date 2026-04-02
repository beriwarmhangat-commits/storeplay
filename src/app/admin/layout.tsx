import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient()

  // 1. Verifikasi Superuser / Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    notFound()
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', position: 'relative' }}>
      <style>{`
        #main-navbar, #main-footer, #top-auth-nav, .search-bar { display: none !important; }
        body { padding-top: 0 !important; margin: 0 !important; overflow-x: hidden; }
      `}</style>
      {/* Sidebar tetap di kiri layar penuh */}
      <AdminSidebar currentAdminName={profile.developer_name} />
      
      {/* Konten Utama */}
      <main style={{ 
        flex: 1, 
        padding: '2.5rem', 
        width: '100%', 
        overflowX: 'auto',
        maxWidth: '100vw'
      }}>
        {children}
      </main>
    </div>
  )
}
