import { createClient } from '@/lib/supabase-server'
import { ShieldAlert, Users, LayoutGrid, Star, Tag, Activity } from 'lucide-react'
import Link from 'next/link'

export default async function AdminInsightPage() {
  const supabase = await createClient()

  // Ambil total stats
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: appCount } = await supabase.from('apps').select('*', { count: 'exact', head: true })
  const { count: reviewCount } = await supabase.from('ratings').select('*', { count: 'exact', head: true })
  const { count: categoryCount } = await supabase.from('categories').select('*', { count: 'exact', head: true })

  // Ambil apps terbaru
  const { data: recentApps } = await supabase
    .from('apps')
    .select('title, created_at, icon_url')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Total Users', value: userCount || 0, icon: Users, color: '#3b82f6', href: '/admin/users' },
    { label: 'Apps Online', value: appCount || 0, icon: LayoutGrid, color: '#10b981', href: '/admin/apps' },
    { label: 'Reviews', value: reviewCount || 0, icon: Star, color: '#f59e0b', href: '/admin/ratings' },
    { label: 'Categories', value: categoryCount || 0, icon: Tag, color: '#8b5cf6', href: '/admin/categories' },
  ]

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '0.5rem', backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: '10px' }}>
          <Activity size={24} color="#3b82f6" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            Admin Insights & Analytics
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Ringkasan data StorePlay dalam waktu nyata.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, idx) => (
          <Link key={idx} href={stat.href} style={{ textDecoration: 'none' }}>
            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              padding: '1.5rem', 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer'
            }}
            className="stat-card"
            >
              <div style={{ padding: '1rem', backgroundColor: `${stat.color}15`, borderRadius: '12px' }}>
                <stat.icon size={24} color={stat.color} />
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>{stat.label}</p>
                <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <h3 style={{ marginTop: 0, fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} /> Recently Added Apps
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentApps?.map((app, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '0.75rem', borderBottom: i === 4 ? 'none' : '1px solid var(--border)' }}>
                <img src={app.icon_url} style={{ width: '32px', height: '32px', borderRadius: '6px' }} alt="" />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>{app.title}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Diupload: {new Date(app.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <ShieldAlert size={48} color="var(--accent)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h4 style={{ margin: 0, fontWeight: 800 }}>System Status: Healthy</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '300px', marginTop: '0.5rem' }}>Monitoring Supabase RLS policies and server health continuously.</p>
        </div>
      </div>

      <style>{`
        .stat-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-md); }
      `}</style>
    </div>
  )
}
