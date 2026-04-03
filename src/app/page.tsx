import { createClient, checkMaintenanceMode } from '@/lib/supabase-server';
import { AppData } from '@/lib/supabase';
import { Star, Download, TrendingUp, Sparkles, Clock } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import CategorySlider from '@/components/CategorySlider';
import SiteAlerts from '@/components/SiteAlerts';
import SearchBar from '@/components/SearchBar';

export const revalidate = 0;

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string, category?: string, focus?: string }> }) {
  const isMaintenance = await checkMaintenanceMode()
  if (isMaintenance) redirect('/maintenance')
  
  const supabase = await createClient();

  const params = await searchParams
  const search = params.search
  const category = params.category
  let query = supabase
    .from('apps')
    .select('*, developer:profiles!developer_id(developer_name)')

  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data: rawApps, error } = await query.order('downloads', { ascending: false });
  const apps = (rawApps || []).map(app => ({
     ...app,
     profiles: (app as any).developer
  }));

  if (error) console.error('Error fetching apps:', error);

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  return (
    <div className="home-container">
      <div className="container" style={{ paddingTop: '2rem' }}>
        <SiteAlerts location="home" />
      </div>
      {/* Premium Hero Section */}
      {!search && !category && (
        <section className="premium-hero">
          <div className="container">
            <div className="hero-content animate-up">
              <div className="detail-badge" style={{ marginBottom: '1.5rem' }}>
                <Sparkles size={14} style={{ marginRight: '0.5rem' }} /> New Experience
              </div>
              <h1 className="hero-title" style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                Discover Your Next <br />
                <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Digital Adventure</span>
              </h1>
              <p className="hero-subtitle" style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '600px' }}>
                The most curated marketplace for apps and games. Speed, security, and inspiration, right at your fingertips.
              </p>
              <div className="hero-search" style={{ width: '100%', maxWidth: '600px', marginBottom: '2.5rem' }}>
                <SearchBar />
              </div>
              <div className="hero-actions" style={{ display: 'flex', gap: '1rem' }}>
                <Link href="#trending" className="btn btn-primary">
                  <TrendingUp size={18} /> Start Exploring
                </Link>
                <Link href="/auth/register" className="btn btn-outline">
                  Join Community
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container" style={{ marginTop: (!search && !category) ? '0' : '4rem' }}>
        {(search || category) && (
          <div style={{ marginBottom: '2rem', maxWidth: '600px' }}>
             <SearchBar />
          </div>
        )}
        <div style={{ marginTop: '2rem', marginBottom: '3rem' }}>
          <CategorySlider categories={categories || []} />
        </div>

        <div id="trending" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock className="text-primary" />
            {search ? `Searching: "${search}"` : (category && category !== 'all' ? `Category: ${category}` : 'Trending Now')}
          </h2>
        </div>
        
        {(!apps || apps.length === 0) ? (
          <div className="empty-state">
            <Sparkles size={48} color="var(--primary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              We couldn't find what you're looking for.
            </p>
            <Link href="/" className="btn btn-primary">Browse All Apps</Link>
          </div>
        ) : (
          <div className="app-grid">
            {apps.map((app: AppData, index: number) => (
              <Link href={`/apps/${app.id}`} key={app.id} className="animate-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="app-card">
                  <img src={app.icon_url} alt={app.title} className="app-icon" />
                  <div className="app-info">
                    <h3 className="app-title">{app.title}</h3>
                    <p className="app-developer">{app.profiles?.developer_name || 'Unknown'}</p>
                    <div className="app-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24', fontWeight: 800 }}>
                        <Star size={12} fill="#fbbf24" /> {Number(app.rating || 0).toFixed(1)} 
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>({app.rating_count || 0})</span>
                      </span>
                      <span style={{ opacity: 0.2 }}>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--text-muted)' }}>
                        <Download size={12} /> {app.downloads >= 1000 ? `${(app.downloads / 1000).toFixed(1)}k` : app.downloads} downloads
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .empty-state {
          padding: 6rem 2rem;
          text-align: center;
          background: var(--bg-card);
          border: 1px solid var(--border-main);
          border-radius: var(--radius-xl);
          margin-bottom: 4rem;
        }
        .hero-title br {
          display: block;
        }
        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem !important; }
          .hero-subtitle { font-size: 1rem !important; }
          .hero-actions { flex-direction: column; }
          .hero-title br { display: none; }
        }
      `}} />
    </div>
  );
}
