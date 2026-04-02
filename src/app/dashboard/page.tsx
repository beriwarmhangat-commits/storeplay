import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, Edit3, Settings } from 'lucide-react'

export const revalidate = 0

type PageProps = {
  searchParams: Promise<{ message?: string, [key: string]: string | string[] | undefined }>
}

export default async function Dashboard({ searchParams }: PageProps) {
  const params = await searchParams
  const message = params.message

  const supabase = await createClient()
  
  // Authenticate user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth')
  }

  // Get user profile & role
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'
  
  if (!isAdmin) {
    redirect('/')
  }

  // Fetch apps
  // If admin: view all apps. If developer: view only own apps.
  let appQuery = supabase.from('apps').select('*').order('created_at', { ascending: false })
  
  if (!isAdmin) {
    appQuery = appQuery.eq('developer_id', user.id)
  }

  const { data: apps, error } = await appQuery

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', paddingBottom: '6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            {isAdmin ? 'Admin Dashboard' : 'Developer Console'}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Welcome back, {profile?.developer_name || user.email}
          </p>
        </div>
        
        {isAdmin && (
          <Link href="/admin/apps/new" className="btn btn-primary">
            <PlusCircle size={20} /> Upload New App
          </Link>
        )}
      </div>

      {message && (
        <div style={{ padding: '1rem', backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', marginBottom: '2rem', fontSize: '1rem', fontWeight: 600 }}>
          {message}
        </div>
      )}

      <h2 className="section-title">Your Applications</h2>
      
      {(!apps || apps.length === 0) ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <p>{isAdmin ? "Anda belum mengupload aplikasi apa pun." : "Hanya administrator yang dapat mengupload aplikasi publik."}</p>
          {isAdmin && (
            <Link href="/admin/apps/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Upload Sekarang
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr' }}>
          {apps.map(app => (
            <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <img src={app.icon_url} alt={app.title} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{app.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {app.package_name} • {(app.downloads / 1000).toFixed(1)}k DLs
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href={`/apps/${app.id}`} className="btn btn-outline" target="_blank">
                  View Store
                </Link>
                <Link href={`/dashboard/apps/${app.id}/edit`} className="btn btn-outline" style={{ color: '#10b981', borderColor: 'var(--border)' }}>
                  <Edit3 size={18} /> Update
                </Link>
                <Link href={`/dashboard/apps/${app.id}/edit`} className="btn btn-outline">
                  <Settings size={18} /> Settings
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
