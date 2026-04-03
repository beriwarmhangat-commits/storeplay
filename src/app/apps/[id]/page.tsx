import { supabase, AppData, AppVersion } from '@/lib/supabase';
import { Star, ShieldCheck, ChevronLeft, User, Download, Calendar, Info, History, MessageSquare, Share2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import RatingForm from '@/components/RatingForm';
import { createClient } from '@/lib/supabase-server';
import AppActions from '@/components/AppActions';
import RichText from '@/components/RichText';

import ShareButton from '@/components/ShareButton';
import SiteAlerts from '@/components/SiteAlerts';

export const revalidate = 0;

export default async function AppDetail({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch App Data
  const { data: appData, error: appError } = await supabase
    .from('apps')
    .select('*, developer:profiles!developer_id(developer_name)')
    .eq('id', id)
    .single();

  if (appError || !appData) {
    console.error('Error fetching app:', appError);
    notFound();
  }

  const app = appData as any;
  // Map developer name for easier access if alias used
  if (app.developer) app.profiles = app.developer;

  // Fetch App Versions
  const { data: versionsData, error: versionsError } = await supabase
    .from('app_versions')
    .select('*')
    .eq('app_id', id)
    .order('version_code', { ascending: false });

  if (versionsError) console.error('Error fetching versions:', versionsError);

  const versions = (versionsData || []) as any[];
  const latestVersion = versions.length > 0 ? versions[0] : null;

  // Fetch Ratings
  const { data: ratingsData, error: ratingsError } = await supabase
    .from('ratings')
    .select('*, reviewer:profiles!user_id(developer_name)')
    .eq('app_id', id)
    .order('created_at', { ascending: false });

  if (ratingsError) console.error('Error fetching ratings:', ratingsError);
  
  // Normalize ratings data to maintain component compatibility
  const normalizedRatings = (ratingsData || []).map(r => ({
     ...r,
     profiles: r.reviewer
  }));

  // Get current user rating if exists
  const { data: { user } } = await supabase.auth.getUser();
  
  let userRating = null;
  if (user) {
    const { data } = await supabase
      .from('ratings')
      .select('*')
      .eq('app_id', id)
      .eq('user_id', user.id)
      .maybeSingle(); // handle missing rating safely
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
    <div className="app-detail-page">
      <div className="container" style={{ paddingTop: '2rem' }}>
        <SiteAlerts location="app_detail" />
      </div>

      {/* Detail Header */}
      <section className="premium-hero" style={{ padding: '0 0 5rem' }}>
        <div className="container">
          <Link href="/" className="btn btn-outline" style={{ marginBottom: '2rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
            <ChevronLeft size={18} /> Back to discover
          </Link>

          <div className="detail-header-card animate-up">
            <img src={app.icon_url} alt={app.title} className="detail-icon-large" />
            
            <div className="detail-info">
              <div className="detail-badge">{app.category}</div>
              <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', lineHeight: 1.1 }}>{app.title}</h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '2rem' }}>
                {app.profiles?.developer_name || 'Standard Developer'}
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="stat-pill">
                  <div className="stat-pill-label">Rating</div>
                  <div className="stat-pill-value" style={{ color: '#fbbf24' }}>
                    <Star size={18} fill="#fbbf24" color="#fbbf24" /> {Number(app.rating || 0).toFixed(1)}
                  </div>
                </div>
                <div className="stat-pill">
                  <div className="stat-pill-label">Downloads</div>
                  <div className="stat-pill-value">
                     {app.downloads >= 1000 ? `${(app.downloads / 1000).toFixed(1)}k` : app.downloads || 0}
                  </div>
                </div>
                <div className="stat-pill">
                  <div className="stat-pill-label">Security</div>
                  <div className="stat-pill-value" style={{ color: '#10b981' }}>Verified <ShieldCheck size={16} /></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
                    Upcoming
                  </button>
                )}
                <ShareButton 
                  title={app.title} 
                  text={`Dapatkan aplikasi ${app.title} secara aman di StorePlay - Platform Aplikasi Premium.`} 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
        <div className="detail-grid">
          <div className="detail-main">
            {/* Description Card */}
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
              <h2 className="section-title" style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Info size={24} className="text-secondary" /> About this App
              </h2>
              <RichText 
                text={app.description || 'This developer hasn\'t provided a description for this application yet.'} 
                className="description-content"
              />
            </div>

            {/* Version History Card */}
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
              <h2 className="section-title" style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <History size={24} className="text-secondary" /> Version History
              </h2>
              <div className="version-list">
                {versions.length > 0 ? (
                  versions.map((ver, idx) => (
                    <div key={ver.id} className="version-card">
                      <div className="ver-header">
                        <div className="ver-name">
                          v{ver.version_name} {idx === 0 && <span className="latest-tag">Latest</span>}
                        </div>
                        <div className="ver-date">
                          <Calendar size={12} /> {new Date(ver.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      {ver.release_notes && (
                        <RichText text={ver.release_notes} className="ver-notes" />
                      )}
                      <div className="ver-footer">
                        <span className="ver-size">{(ver.size_bytes / (1024 * 1024)).toFixed(1)} MB</span>
                        <a href={ver.apk_url} className="ver-link">Get APK</a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No version history found.</p>
                )}
              </div>
            </div>

            {/* User Reviews */}
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MessageSquare size={24} className="text-secondary" /> Ratings & Reviews
                </h2>
              </div>

              {/* Rating Summary Card */}
              {normalizedRatings.length > 0 && (
                <div className="rating-summary-card">
                   <div className="rating-total-box">
                      <div className="big-rating">{Number(app.rating || 0).toFixed(1)}</div>
                      <div className="stars-row">
                         {[1, 2, 3, 4, 5].map(s => (
                           <Star key={s} size={14} fill={s <= Math.round(app.rating || 0) ? '#fbbf24' : 'none'} color={s <= Math.round(app.rating || 0) ? '#fbbf24' : 'var(--text-muted)'} />
                         ))}
                      </div>
                      <div className="total-reviews-label">{app.rating_count || 0} reviews</div>
                   </div>
                   
                   <div className="rating-bars-column">
                      {[5, 4, 3, 2, 1].map(score => {
                        const count = normalizedRatings.filter(r => r.score === score).length;
                        const percent = (count / normalizedRatings.length) * 100;
                        return (
                          <div key={score} className="bar-row">
                             <span className="bar-label">{score}</span>
                             <div className="bar-bg">
                                <div className="bar-fill" style={{ width: `${percent}%` }}></div>
                             </div>
                             <span className="bar-count">{count}</span>
                          </div>
                        )
                      })}
                   </div>
                </div>
              )}

              <div className="reviews-list">
                {normalizedRatings.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No reviews yet. Be the first to share your thoughts!</p>
                ) : (
                  normalizedRatings.map((r: any) => (
                    <div key={r.id} className="review-item">
                      <div className="review-header">
                         <div className="user-avatar"><User size={18} /></div>
                         <div className="user-info">
                            <div className="user-name">{r.profiles?.developer_name || 'Anonymous User'}</div>
                            <div className="user-stars">
                               {[1, 2, 3, 4, 5].map(s => (
                                 <Star key={s} size={10} fill={s <= r.score ? '#fbbf24' : 'none'} color={s <= r.score ? '#fbbf24' : 'var(--text-muted)'} />
                               ))}
                            </div>
                         </div>
                         <div className="review-date">{new Date(r.created_at).toLocaleDateString()}</div>
                      </div>
                      {r.review && <p className="review-text">{r.review}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="detail-sidebar">
            <div className="glass-card sticky-sidebar">
              <RatingForm appId={id} initialRating={userRating?.score} initialReview={userRating?.review} />
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
        }
        .glass-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border-main);
          border-radius: var(--radius-xl);
          padding: 2rem;
          box-shadow: var(--shadow-md);
        }
        .stat-pill {
          background: var(--bg-elevated);
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-main);
          min-width: 120px;
        }
        .stat-pill-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
        .stat-pill-value { font-size: 1.25rem; font-weight: 700; display: flex; alignItems: center; gap: 0.5rem; }
        
        .version-list { display: grid; gap: 1rem; }
        .version-card { padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-main); background: var(--bg-main); }
        .ver-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .ver-name { font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 0.5rem; }
        .latest-tag { background: #10b981; color: white; padding: 0.1rem 0.6rem; border-radius: 4rem; font-size: 0.65rem; }
        .ver-date { font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.25rem; }
        .ver-notes { font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem; }
        .ver-footer { display: flex; justify-content: space-between; align-items: center; }
        .ver-link { color: var(--primary); font-weight: 600; font-size: 0.9rem; }
        .ver-size { font-size: 0.8rem; color: var(--text-muted); }

        .reviews-list { display: grid; gap: 1.5rem; }
        .review-item { padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-main); }
        .review-item:last-child { border-bottom: none; }
        .review-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem; }
        .user-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--bg-elevated); display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
        .user-name { font-weight: 700; font-size: 0.9rem; }
        .user-stars { display: flex; gap: 0.1rem; }
        .review-date { margin-left: auto; font-size: 0.75rem; color: var(--text-muted); }
        .review-text { font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; }

        .rating-summary-card {
           display: flex;
           gap: 3rem;
           padding: 2rem;
           background: var(--bg-main);
           border-radius: var(--radius-xl);
           border: 1px solid var(--border-main);
           margin-bottom: 3rem;
        }
        .rating-total-box { text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .big-rating { font-size: 4rem; font-weight: 900; line-height: 1; margin-bottom: 0.5rem; letter-spacing: -2px; }
        .stars-row { display: flex; gap: 0.2rem; margin-bottom: 0.5rem; }
        .total-reviews-label { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }
        
        .rating-bars-column { flex: 1; display: grid; gap: 0.5rem; }
        .bar-row { display: flex; align-items: center; gap: 1rem; }
        .bar-label { font-size: 0.85rem; font-weight: 700; width: 10px; }
        .bar-bg { flex: 1; height: 8px; background: var(--bg-elevated); border-radius: 4px; overflow: hidden; position: relative; }
        .bar-fill { position: absolute; left: 0; top: 0; bottom: 0; background: var(--primary); border-radius: 4px; }
        .bar-count { font-size: 0.75rem; color: var(--text-muted); width: 30px; text-align: right; }

        @media (max-width: 640px) {
           .rating-summary-card { flex-direction: column; gap: 2rem; padding: 1.5rem; align-items: center; text-align: center; }
           .rating-bars-column { width: 100%; }
        }
        .review-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem; }
        .user-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--bg-elevated); display: flex; justify-content: center; align-items: center; }
        .user-name { font-weight: 700; font-size: 0.95rem; }
        .review-date { margin-left: auto; font-size: 0.75rem; color: var(--text-muted); }
        .review-text { font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; }

        .sticky-sidebar { position: sticky; top: 6rem; }

        @media (max-width: 1024px) {
          .detail-grid { grid-template-columns: 1fr; }
          .detail-sidebar { order: -1; }
          .sticky-sidebar { position: relative; top: 0; }
        }
      `}} />
    </div>
  );
}
