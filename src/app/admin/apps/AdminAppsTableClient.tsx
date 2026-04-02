import { Trash2, ExternalLink, Settings } from 'lucide-react'
import Link from 'next/link'
import { deleteAppAdmin } from '@/app/admin/actions'

export default function AdminAppsTableClient({ apps }: { apps: any[] }) {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {apps.map((app) => (
        <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <img src={app.icon_url} style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} alt={app.title} />
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{app.title}</h3>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                By: <strong>{app.profiles?.developer_name || 'System'}</strong> • {app.package_name}
              </p>
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ 
                  fontSize: '0.7rem', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '5px', 
                  backgroundColor: app.status === 'approved' ? '#dcfce7' : '#fee2e2', 
                  color: app.status === 'approved' ? '#166534' : '#991b1b',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {app.status || 'pending'}
                </span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href={`/admin/apps/${app.id}/edit`} className="btn btn-outline" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', borderColor: 'var(--border)' }}>
              <Settings size={14} /> Edit
            </Link>
            
            <form action={deleteAppAdmin} onSubmit={e => !confirm('Apakah Anda yakin ingin menghapus aplikasi ini secara permanen?') && e.preventDefault()}>
              <input type="hidden" name="app_id" value={app.id} />
              <button type="submit" style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Trash2 size={14} /> Takedown
              </button>
            </form>
          </div>
        </div>
      ))}
      {apps.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
          No applications found.
        </div>
      )}
    </div>
  )
}
