'use client';

import { useEffect, useState } from 'react';
import { Package, Download, Star, ExternalLink, Settings, History, Info, ChevronRight, LayoutGrid, Clock, Trash2 } from 'lucide-react';
import Link from 'next/link';

type AppData = {
  id: string;
  title: string;
  package_name: string;
  icon_url: string;
  rating: number;
  downloads: number;
  profiles: { developer_name: string };
};

export default function MyAppsClient({ uploadedApps, allApps, isDeveloper }: { 
  uploadedApps: any[], 
  allApps: any[], 
  isDeveloper: boolean 
}) {
  const [activeTab, setActiveTab] = useState<'library' | 'uploads'>(isDeveloper ? 'uploads' : 'library');
  const [libraryIds, setLibraryIds] = useState<string[]>([]);
  const [installedApps, setInstalledApps] = useState<any[]>([]);

  // 📂 Scan LocalStorage for installed apps
  useEffect(() => {
    try {
      const keys = Object.keys(localStorage);
      const ids = keys
        .filter(k => k.startsWith('installed_'))
        .map(k => k.replace('installed_', ''));
      setLibraryIds(ids);

      // Filter allApps to find matches for library
      // In real scenario, we'd fetch these specifically, but we have a pool here
      const library = allApps.filter(app => ids.includes(app.id));
      setInstalledApps(library);
    } catch (e) {
      console.warn('Library access error:', e);
    }
  }, [allApps]);

  const removeAppFromLibrary = (id: string) => {
    if (confirm('Hapus aplikasi ini dari pustaka Anda?')) {
      localStorage.removeItem(`installed_${id}`);
      setLibraryIds(prev => prev.filter(item => item !== id));
      setInstalledApps(prev => prev.filter(app => app.id !== id));
    }
  };

  return (
    <div className="container" style={{ marginTop: '-2rem', position: 'relative', zIndex: 10, paddingBottom: '8rem' }}>
      {/* Tabs Layout */}
      <div className="glass-card" style={{ padding: '0.5rem', borderRadius: '20px', marginBottom: '2.5rem', display: 'inline-flex', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-main)' }}>
        <button 
           onClick={() => setActiveTab('library')}
           className={`tab-btn ${activeTab === 'library' ? 'active' : ''}`}
        >
          <LayoutGrid size={18} /> Library ({installedApps.length})
        </button>
        {isDeveloper && (
          <button 
             onClick={() => setActiveTab('uploads')}
             className={`tab-btn ${activeTab === 'uploads' ? 'active' : ''}`}
          >
            <Settings size={18} /> My Uploads ({uploadedApps.length})
          </button>
        )}
      </div>

      {activeTab === 'uploads' && (
        <div className="animate-slide-up">
           <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <Settings size={24} className="text-secondary" /> Developer Console
              </h2>
              <Link href="/admin/apps" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
                 Upload New App
              </Link>
           </div>
           
           <div className="app-grid-dedicated">
              {uploadedApps.length === 0 ? (
                 <div className="empty-state">
                    <Package size={48} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                    <p>No apps uploaded yet. Become a creator today!</p>
                 </div>
              ) : (
                uploadedApps.map((app) => (
                   <AppListCard key={app.id} app={app} isManager={true} />
                ))
              )}
           </div>
        </div>
      )}

      {activeTab === 'library' && (
        <div className="animate-slide-up">
           <div className="section-header" style={{ marginBottom: '2rem' }}>
              <h2 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <Clock size={24} className="text-primary" /> Download Library
              </h2>
           </div>

           <div className="app-grid-dedicated">
              {installedApps.length === 0 ? (
                 <div className="empty-state" style={{ padding: '6rem 2rem' }}>
                    <LayoutGrid size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                       Your library is currently empty. Apps you install will appear here.
                    </p>
                    <Link href="/" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>Start Exploring Apps</Link>
                 </div>
              ) : (
                installedApps.map((app) => (
                   <AppListCard key={app.id} app={app} isManager={false} onRemove={() => removeAppFromLibrary(app.id)} />
                ))
              )}
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .tab-btn {
           padding: 0.75rem 1.75rem;
           border: none;
           background: transparent;
           color: var(--text-muted);
           font-weight: 700;
           font-size: 0.95rem;
           cursor: pointer;
           border-radius: 15px;
           transition: all 0.3s ease;
           display: flex;
           align-items: center;
           gap: 0.5rem;
           letter-spacing: -0.2px;
        }
        .tab-btn:hover { background-color: rgba(255,255,255,0.03); color: var(--text-main); }
        .tab-btn.active {
           background-color: var(--primary);
           color: white;
           box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }

        .app-grid-dedicated { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); }
        
        .empty-state { text-align: center; padding: 4rem; background: var(--bg-card); border-radius: 20px; border: 1px dashed var(--border-main); }
        
        .list-card {
           background: var(--bg-card);
           border: 1px solid var(--border-main);
           border-radius: 20px;
           padding: 1.25rem;
           display: flex;
           align-items: center;
           gap: 1.5rem;
           transition: all 0.3s ease;
           position: relative;
           overflow: hidden;
        }
        .list-card:hover { border-color: var(--primary); transform: translateY(-3px); box-shadow: var(--shadow-lg); }
        
        .list-icon { width: 72px; height: 72px; border-radius: 18px; object-fit: cover; box-shadow: var(--shadow-sm); }
        
        .list-content { flex: 1; min-width: 0; }
        .list-title { font-weight: 800; font-size: 1.15rem; margin-bottom: 0.1rem; letter-spacing: -0.4px; }
        .list-dev { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; }
        .list-meta { display: flex; gap: 1.25rem; font-size: 0.8rem; color: var(--text-muted); font-weight: 700; }
        
        .list-actions { display: flex; gap: 0.5rem; flex-direction: column; }
        .action-link { 
           width: 40px; height: 40px; border-radius: 12px; border: 1px solid var(--border-main); 
           display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: 0.2s;
        }
        .action-link:hover { background: var(--bg-elevated); color: var(--primary); border-color: var(--primary); }
        .action-link.delete:hover { color: #ef4444; border-color: #ef4444; background: rgba(239, 68, 68, 0.05); }

        @media (max-width: 640px) {
           .app-grid-dedicated { grid-template-columns: 1fr; }
           .list-card { gap: 1rem; padding: 1rem; }
           .list-icon { width: 60px; height: 60px; }
           .list-actions { flex-direction: row; margin-top: 1rem; width: 100%; border-top: 1px solid var(--border-main); padding-top: 1rem; }
           .list-actions .action-link { flex: 1; }
           .list-card { flex-wrap: wrap; }
        }
      `}} />
    </div>
  );
}

function AppListCard({ app, isManager, onRemove }: { app: any, isManager: boolean, onRemove?: () => void }) {
  return (
    <div className="list-card animate-up">
       <img src={app.icon_url} alt={app.title} className="list-icon" />
       <div className="list-content">
          <div className="list-title">{app.title}</div>
          <div className="list-dev">by {app.profiles?.developer_name || 'Standard Developer'}</div>
          <div className="list-meta">
             <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}>
                <Star size={12} fill="#fbbf24" /> {Number(app.rating || 0).toFixed(1)}
             </span>
             <span style={{ opacity: 0.2 }}>•</span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Download size={12} /> {app.downloads >= 1000 ? `${(app.downloads / 1000).toFixed(1)}k` : app.downloads} downloads
             </span>
          </div>
       </div>
       <div className="list-actions">
          <Link href={`/apps/${app.id}`} className="action-link" title="Buka Detail">
             <ExternalLink size={18} />
          </Link>
          {isManager ? (
             <Link href={`/admin/apps`} className="action-link" title="Kelola Aplikasi">
                <Settings size={18} />
             </Link>
          ) : (
             <button onClick={onRemove} className="action-link delete" title="Hapus dari Pustaka">
                <Trash2 size={18} />
             </button>
          )}
       </div>
    </div>
  );
}
