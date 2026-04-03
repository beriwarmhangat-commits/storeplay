import { createClient } from '@/lib/supabase-server';
import { Package, PlusCircle, Activity, LayoutGrid, Clock, Star, Download } from 'lucide-react';
import Link from 'next/link';
import MyAppsClient from './MyAppsClient';

export default async function MyAppsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
       <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
          <LayoutGrid size={64} style={{ marginBottom: '1.5rem', opacity: 0.1 }} />
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Library & My Apps</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Please sign in to view your applications and library.</p>
          <Link href="/auth" className="btn btn-primary">Sign In Now</Link>
       </div>
    );
  }

  // Fetch Full Profile for role
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch Uploaded Apps (if developer)
  let uploadedApps = [];
  if (profile?.role === 'developer' || profile?.role === 'admin') {
    const { data } = await supabase
      .from('apps')
      .select('*, profiles(developer_name)')
      .eq('developer_id', user.id)
      .order('created_at', { ascending: false });
    uploadedApps = data || [];
  }

  // Fetch recently downloaded apps (hypothetical)
  const { data: myLibrary } = await supabase
    .from('apps')
    .select('*, profiles(developer_name)')
    // Mocking library for now by showing trending if empty, but client will filter real library
    .limit(10);

  return (
    <div className="my-apps-page animate-fade-in">
      <section className="premium-hero" style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
             <div style={{ padding: '1rem', backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: '15px' }}>
                <Package size={32} color="#3b82f6" />
             </div>
             <div>
                <h1 style={{ fontSize: '2.5rem', margin: 0, letterSpacing: '-1px' }}>My Applications</h1>
                <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>Manage your library and developer uploads.</p>
             </div>
          </div>
        </div>
      </section>

      <MyAppsClient 
        uploadedApps={uploadedApps} 
        allApps={myLibrary || []} 
        isDeveloper={profile?.role === 'developer' || profile?.role === 'admin'} 
      />
    </div>
  );
}
