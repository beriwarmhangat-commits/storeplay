import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { User, Mail, Shield, Calendar, Settings, Package, PlusCircle, Star, Download, LogOut } from 'lucide-react'
import Link from 'next/link'
import { logout } from '@/app/auth/actions'

export const revalidate = 0

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  // Fetch Full Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch User's Apps
  const { data: apps } = await supabase
    .from('apps')
    .select('*')
    .eq('developer_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="profile-page">
      <section className="premium-hero" style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="profile-header animate-up">
            <div className="profile-avatar-large">
               <User size={64} color="var(--text-main)" />
            </div>
            <div className="profile-info-main">
               <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{profile?.developer_name || 'StorePlay User'}</h1>
               <div className="profile-badge-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span className="profile-badge" style={{ backgroundColor: profile?.role === 'user' ? 'rgba(107, 114, 128, 0.1)' : 'var(--primary-light)', color: profile?.role === 'user' ? '#9ca3af' : 'var(--primary)' }}>
                     <Shield size={14} /> {profile?.role?.toUpperCase() || 'USER'}
                  </span>
                  <span className="profile-email">
                     <Mail size={14} /> {user.email}
                  </span>
                  <span className="profile-joined">
                     <Calendar size={14} /> Joined {new Date(profile?.created_at).toLocaleDateString()}
                  </span>
               </div>
            </div>
            <div className="profile-actions-top">
               <form action={logout}>
                  <button type="submit" className="btn btn-outline" style={{ color: '#ef4444', border: 'none' }}>
                     <LogOut size={18} /> Sign Out
                  </button>
               </form>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
        <div className="profile-grid">
          {/* Main Content: User Apps */}
          <div className="profile-content-main">
            {profile?.role === 'user' ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <Shield size={48} style={{ marginBottom: '1.5rem', opacity: 0.3 }} color="#9ca3af" />
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Ingin Upload Aplikasi?</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
                  Saat ini Anda adalah pengguna standar. Daftar Akun Developer seharga <strong>Rp 100.000 (Permanen)</strong> untuk mulai mempublikasikan aplikasi Anda tanpa batasan.
                </p>
                <Link href="/dashboard" className="btn btn-primary">Daftar Akun Developer</Link>
              </div>
            ) : (
              <div className="glass-card">
                <div className="app-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Package size={24} className="text-primary" /> Your Applications
                  </h2>
                  <Link href={profile?.role === 'admin' ? '/admin/apps' : '/dashboard/upload'} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                    <PlusCircle size={18} /> Upload App
                  </Link>
                </div>

                {(!apps || apps.length === 0) ? (
                  <div style={{ padding: '4rem 2rem', textAlign: 'center', opacity: 0.7 }}>
                    <Package size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                    <p>You haven't uploaded any applications yet.</p>
                    <Link href={profile?.role === 'admin' ? '/admin/apps' : '/dashboard/upload'} className="text-primary" style={{ fontWeight: 600, display: 'block', marginTop: '1rem' }}>Get started now &rarr;</Link>
                  </div>
                ) : (
                  <div className="dashboard-app-list">
                    {apps.map((app) => (
                      <div key={app.id} className="dash-app-card">
                        <img src={app.icon_url} alt={app.title} className="dash-app-icon" />
                        <div className="dash-app-info">
                          <div className="dash-app-title">{app.title}</div>
                          <div className="dash-app-package">{app.package_name}</div>
                          <div className="dash-app-meta">
                            <span><Star size={12} fill="#fbbf24" color="#fbbf24" /> {app.rating}</span>
                            <span><Download size={12} /> {app.downloads} downloads</span>
                          </div>
                        </div>
                        <div className="dash-app-actions">
                          <Link href={`/apps/${app.id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>View</Link>
                          <Link href={profile?.role === 'admin' ? `/admin/apps` : `/dashboard/apps/${app.id}/edit`} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Manage</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="profile-sidebar">
            <div className="glass-card">
               <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Settings size={20} className="text-secondary" /> Account Settings
               </h3>
               <div className="settings-list">
                  <div className="settings-item">
                     <div className="settings-label">Developer Profile</div>
                     <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage your developer name and public identity.</p>
                  </div>
                  <div className="settings-item">
                     <div className="settings-label">Privacy & Security</div>
                     <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Update your password and security options.</p>
                  </div>
                  <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem' }} disabled>
                    Edit Profile (Coming Soon)
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .profile-header {
           display: flex;
           align-items: center;
           gap: 2.5rem;
        }
        .profile-avatar-large {
           width: 120px;
           height: 120px;
           background: var(--bg-card);
           border-radius: var(--radius-xl);
           display: flex;
           justify-content: center;
           align-items: center;
           border: 4px solid var(--border-main);
           box-shadow: var(--shadow-lg);
        }
        .profile-badge {
           display: inline-flex;
           align-items: center;
           gap: 0.4rem;
           padding: 0.3rem 0.8rem;
           background: var(--primary-light);
           color: var(--primary);
           border-radius: var(--radius-full);
           font-size: 0.8rem;
           font-weight: 700;
        }
        .profile-email, .profile-joined {
           display: inline-flex;
           align-items: center;
           gap: 0.4rem;
           color: var(--text-muted);
           font-size: 0.9rem;
        }
        .profile-actions-top { margin-left: auto; }

        .profile-grid { display: grid; grid-template-columns: 1fr 350px; gap: 2rem; margin-bottom: 5rem; }
        .glass-card {
           background-color: var(--bg-card);
           border: 1px solid var(--border-main);
           border-radius: var(--radius-xl);
           padding: 2rem;
           box-shadow: var(--shadow-md);
        }
        
        .dashboard-app-list { display: grid; gap: 1rem; }
        .dash-app-card {
           display: flex;
           align-items: center;
           gap: 1.25rem;
           padding: 1rem;
           background: var(--bg-main);
           border-radius: var(--radius-lg);
           border: 1px solid var(--border-main);
           transition: var(--transition-normal);
        }
        .dash-app-card:hover { border-color: var(--primary); transform: translateX(5px); }
        .dash-app-icon { width: 56px; height: 56px; border-radius: 14px; object-fit: cover; }
        .dash-app-info { flex: 1; min-width: 0; }
        .dash-app-title { font-weight: 700; font-size: 1rem; margin-bottom: 0.1rem; }
        .dash-app-package { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.4rem; }
        .dash-app-meta { display: flex; gap: 1rem; font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
        .dash-app-actions { display: flex; gap: 0.5rem; }

        .settings-list { display: grid; gap: 1.5rem; }
        .settings-item { padding-bottom: 1rem; border-bottom: 1px solid var(--border-main); }
        .settings-label { font-weight: 700; font-size: 0.95rem; margin-bottom: 0.25rem; }

        @media (max-width: 1024px) {
           .profile-grid { grid-template-columns: 1fr; }
           .profile-header { flex-direction: column; text-align: center; gap: 1.5rem; }
           .profile-actions-top { margin-left: 0; }
           .profile-info-main { display: flex; flex-direction: column; align-items: center; }
           .profile-avatar-large { width: 100px; height: 100px; }
        }

        @media (max-width: 640px) {
           .glass-card { padding: 1.25rem; }
           .dash-app-card { flex-direction: column; align-items: flex-start; gap: 1rem; }
           .dash-app-actions { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
           .dash-app-actions .btn { width: 100%; justify-content: center; }
           .profile-badge-group { flex-direction: column; gap: 0.5rem; }
           .app-header-flex { flex-direction: column; align-items: flex-start !important; gap: 1rem; }
           .app-header-flex .btn { width: 100%; }
           .dash-app-card:hover { transform: none; }
           .profile-info-main h1 { font-size: 1.75rem !important; }
        }
      `}} />
    </div>
  )
}
