import { supabase, AppData } from '@/lib/supabase';
import { checkMaintenanceMode } from '@/lib/supabase-server';
import { Star, Download, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import CategorySlider from '@/components/CategorySlider';

export const revalidate = 0; // Disable caching to always get fresh data

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string, category?: string }> }) {
  // Check Maintenance
  const isMaintenance = await checkMaintenanceMode()
  if (isMaintenance) {
    redirect('/maintenance')
  }

  const params = await searchParams
  const search = params.search
  const category = params.category

  let query = supabase
    .from('apps')
    .select('*, profiles(developer_name)')

  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data: apps, error } = await query.order('downloads', { ascending: false });

  if (error) {
    console.error('Error fetching apps:', error);
  }

  // Fetch Categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      
      <div style={{ marginTop: '3rem', marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Discover the Next <span style={{ color: 'var(--accent)' }}>Big Thing</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Explore millions of apps, games, and more. Find everything you need right at your fingertips.
        </p>

        <CategorySlider categories={categories || []} />
      </div>

      <h2 className="section-title">
        {search ? `Hasil pencarian untuk "${search}"` : (category && category !== 'all' ? `Kategori: ${category}` : 'Trending Apps')}
      </h2>
      
      {(!apps || apps.length === 0) ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
          <p>{search ? 'Aplikasi yang Anda cari tidak ditemukan.' : 'Belum ada aplikasi di kategori ini.'}</p>
          {search && <Link href="/" className="btn btn-outline" style={{ marginTop: '1rem' }}>Lihat Semua Aplikasi</Link>}
        </div>
      ) : (
        <div className="app-grid">
          {apps.map((app: AppData, index: number) => (
            <Link href={`/apps/${app.id}`} key={app.id}>
              <div className="app-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <img src={app.icon_url} alt={app.title} className="app-icon" />
                <div className="app-info">
                  <div>
                    <h3 className="app-title">{app.title}</h3>
                    <p className="app-developer">{app.profiles?.developer_name || 'Unknown'}</p>
                  </div>
                  <div className="app-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      {app.rating} <Star className="star-icon" />
                    </span>
                    <span style={{ color: 'var(--border)' }}>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Download size={14} /> {(app.downloads / 1000).toFixed(1)}k
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
