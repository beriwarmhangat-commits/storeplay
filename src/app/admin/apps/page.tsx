import { createClient } from '@/lib/supabase-server'
import { deleteAppAdmin } from '@/app/admin/actions'
import Link from 'next/link'

export default async function AppsAdminPage() {
  const supabase = await createClient()
  const { data: allApps } = await supabase.from('apps').select('*, profiles(developer_name)').order('created_at', { ascending: false })

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Applications Monitoring
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0' }}>
          Takedown atau pantau seluruh aplikasi yang aktif di StorePlay.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {allApps?.map((app) => (
          <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <img src={app.icon_url} style={{ width: '50px', height: '50px', borderRadius: '10px' }} alt={app.title} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>{app.title}</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>By: <strong>{app.profiles?.developer_name}</strong> • {app.package_name}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link href={`/apps/${app.id}`} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>View</Link>
              <form action={deleteAppAdmin} onSubmit={e => !confirm('Hapus aplikasi?') && e.preventDefault()}>
                <input type="hidden" name="app_id" value={app.id} />
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#ef4444', fontSize: '0.85rem', border: 'none' }}>Takedown</button>
              </form>
            </div>
          </div>
        ))}
        {allApps?.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No applications found.</p>}
      </div>
    </div>
  )
}
