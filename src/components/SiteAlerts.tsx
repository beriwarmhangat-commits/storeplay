import { createClient } from '@/lib/supabase-server';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import React from 'react';

export default async function SiteAlerts({ location = 'all' }: { location?: 'all' | 'home' | 'app_detail' }) {
  const supabase = await createClient();

  // Fetch active alerts for this location or 'all'
  const { data: alerts } = await supabase
    .from('site_alerts')
    .select('*')
    .eq('is_active', true)
    .or(`location.eq.${location},location.eq.all`)
    .order('created_at', { ascending: false });

  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="site-alerts-container container">
      {alerts.map((alert) => (
        <div key={alert.id} className={`alert-card alert-${alert.type} animate-up`}>
          <div className="alert-icon">
            {alert.type === 'info' && <Info size={20} />}
            {alert.type === 'warning' && <AlertTriangle size={20} />}
            {alert.type === 'danger' && <AlertCircle size={20} />}
            {alert.type === 'success' && <CheckCircle size={20} />}
          </div>
          <div className="alert-content">
            <div className="alert-title">{alert.title}</div>
            <div className="alert-message">{alert.message}</div>
          </div>
        </div>
      ))}

      <style dangerouslySetInnerHTML={{ __html: `
        .site-alerts-container {
           margin-top: 1rem;
           margin-bottom: 2rem;
           display: flex;
           flex-direction: column;
           gap: 1rem;
        }
        .alert-card {
           display: flex;
           gap: 1rem;
           padding: 1.25rem;
           border-radius: var(--radius-lg);
           border: 1px solid transparent;
           box-shadow: var(--shadow-sm);
        }
        .alert-icon { flex-shrink: 0; margin-top: 0.15rem; }
        .alert-title { font-weight: 800; font-size: 1rem; margin-bottom: 0.25rem; }
        .alert-message { font-size: 0.9rem; line-height: 1.6; opacity: 0.9; }

        .alert-info { 
           background: rgba(59, 130, 246, 0.1); 
           border-color: rgba(59, 130, 246, 0.2); 
           color: #60a5fa;
        }
        .alert-warning { 
           background: rgba(245, 158, 11, 0.1); 
           border-color: rgba(245, 158, 11, 0.2); 
           color: #fbbf24;
        }
        .alert-danger { 
           background: rgba(239, 68, 68, 0.1); 
           border-color: rgba(239, 68, 68, 0.2); 
           color: #f87171;
        }
        .alert-success { 
           background: rgba(16, 185, 129, 0.1); 
           border-color: rgba(16, 185, 129, 0.2); 
           color: #34d399;
        }
      `}} />
    </div>
  );
}
