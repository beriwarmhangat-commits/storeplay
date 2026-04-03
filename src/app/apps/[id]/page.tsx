import { supabase, AppData, AppVersion } from '@/lib/supabase';
import { Star, ShieldCheck, ChevronLeft, User } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import RatingForm from '@/components/RatingForm';
import { createClient } from '@/lib/supabase-server';
import AppActions from '@/components/AppActions';

export const revalidate = 0;

export default async function AppDetail({ params }: { params: { id: string } }) {
  const { id } = await params;

  // Fetch App Data
  const { data: appData, error: appError } = await supabase
    .from('apps')
    .select('*, profiles(developer_name)')
    .eq('id', id)
    .single();

  if (appError || !appData) {
    console.error('Error fetching app:', appError);
    notFound();
  }

  const app = appData as AppData;

  // Fetch App Versions
  const { data: versionsData, error: versionsError } = await supabase
    .from('app_versions')
    .select('*')
    .eq('app_id', id)
    .order('version_code', { ascending: false });

  if (versionsError) {
    console.error('Error fetching versions:', versionsError);
  }

  const versions = (versionsData || []) as AppVersion[];
  const latestVersion = versions.length > 0 ? versions[0] : null;

  // Fetch Ratings
  const { data: ratingsData } = await supabase
    .from('ratings')
    .select('*, profiles(developer_name)')
    .eq('app_id', id)
    .order('created_at', { ascending: false });

  // Get current user rating if exists
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();
  
  let userRating = null;
  if (user) {
    const { data } = await supabase
      .from('ratings')
      .select('*')
      .eq('app_id', id)
      .eq('user_id', user.id)
      .single();
    userRating = data;
  }

  // Fetch User Installed Version
  let installedVersionCode = null;
  if (user) {
    const { data: installData } = await supabase
      .from('user_downloads')
      .select('last_version_code')
      .eq('app_id', id)
      .eq('user_id', user.id)
      .single();
    if (installData) installedVersionCode = installData.last_version_code;
  }

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Detail Header */}
      <div className="detail-header">
        <div className="container">
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem', fontWeight: 600 }}>
            <ChevronLeft size={20} /> Back to Discover
          </Link>

          <div className="detail-container">
            <img src={app.icon_url} alt={app.title} className="detail-icon" />
            
            <div className="detail-info">
              <h1 className="detail-title">{app.title}</h1>
              <div className="detail-developer">{app.profiles?.developer_name || 'Unknown'} • {app.category}</div>
              
              <div className="detail-stats">
                <div className="stat-item">
                  <span className="stat-value">{app.rating} <Star size={20} className="star-icon" /></span>
                  <span className="stat-label">Rating</span>
                </div>
                <div style={{ width: '1px', backgroundColor: 'var(--border)' }}></div>
                <div className="stat-item">
                  <span className="stat-value">{app.downloads || 0}</span>
                  <span className="stat-label">Downloads</span>
                </div>
                <div style={{ width: '1px', backgroundColor: 'var(--border)' }}></div>
                <div className="stat-item">
                  <span className="stat-value"><ShieldCheck size={24} color="var(--accent)" /></span>
                  <span className="stat-label">Verified Safe</span>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                {latestVersion ? (
                  <AppActions 
                    appId={id}
                    apkUrl={latestVersion.apk_url}
                    versionName={latestVersion.version_name}
                    versionCode={latestVersion.version_code}
                    sizeMb={latestVersion.size_bytes / (1024 * 1024)}
                    isLoggedIn={!!user}
                    installedVersionCode={installedVersionCode}
                  />
                ) : (
                  <button className="btn btn-primary" disabled style={{ opacity: 0.5 }}>
                    Mendatang
                  </button>
                )}
                <button className="btn btn-outline" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Description */}
        <h2 className="section-title">About this App</h2>
        <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
          {app.description || 'No description provided.'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '3rem 0 1rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Version History & Updates</h2>
          <span style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 600 }}>Active Update System</span>
        </div>
        
        <div className="version-history">
          {versions.length > 0 ? (
            versions.map((ver, idx) => (
              <div key={ver.id} className="version-item">
                <div className="version-info">
                  <h4>Version {ver.version_name} {idx === 0 && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', backgroundColor: '#10b981', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '4rem' }}>Latest</span>}</h4>
                  <p>Released on {new Date(ver.created_at).toLocaleDateString()}</p>
                  {ver.release_notes && (
                    <div className="version-notes">
                      <strong>What's New:</strong><br/>
                      {ver.release_notes}
                    </div>
                  )}
                </div>
                <div>
                  <a href={ver.apk_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.5rem 1rem' }}>
                    <span style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{(ver.size_bytes / (1024 * 1024)).toFixed(2)} MB</span>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No version history available.
            </div>
          )}
        </div>

        {/* Rating & Reviews Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '3rem', marginTop: '4rem' }}>
          <div>
            <h2 className="section-title" style={{ marginTop: 0 }}>Ulasan Pengguna</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(!ratingsData || ratingsData.length === 0) ? (
                <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', color: 'var(--text-secondary)' }}>
                  Belum ada ulasan untuk aplikasi ini. Jadilah yang pertama!
                </div>
              ) : (
                ratingsData.map((r: any) => (
                  <div key={r.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={20} color="var(--text-secondary)" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{r.profiles?.developer_name || 'User'}</div>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={12} fill={s <= r.score ? 'var(--star-active)' : 'transparent'} color={s <= r.score ? 'var(--star-active)' : 'var(--star-inactive)'} />
                          ))}
                        </div>
                      </div>
                      <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {new Date(r.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.5 }}>{r.review}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            {user ? (
              <RatingForm appId={id} initialRating={userRating?.score} initialReview={userRating?.review} />
            ) : (
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Ingin memberi ulasan?</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Silakan login terlebih dahulu untuk memberikan rating dan ulasan.</p>
                <Link href="/auth" className="btn btn-primary" style={{ width: '100%' }}>Login Sekarang</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
