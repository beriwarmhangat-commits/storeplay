'use client';

import { createAlert, deleteAlert, toggleAlert } from '@/app/admin/actions';
import { Plus, Trash2, Eye, EyeOff, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import React from 'react';

export default function AlertsManagementClient({ alerts }: { alerts: any[] }) {
  return (
    <div className="alerts-mgmt">
      {/* Create Alert Form */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '2.5rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 800 }}>Create New Site Alert</h3>
        
        <form action={createAlert} style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Alert Title</label>
            <input name="title" placeholder="e.g. Scheduled Maintenance" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Type</label>
              <select name="type" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                <option value="info">Information (Blue)</option>
                <option value="warning">Warning (Yellow)</option>
                <option value="danger">Critical (Red)</option>
                <option value="success">Success (Green)</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Location</label>
              <select name="location" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                <option value="all">Everywhere</option>
                <option value="home">Home Page Only</option>
                <option value="app_detail">App Details Only</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Message (Keep it concise)</label>
            <textarea name="message" placeholder="Inform users about important updates or issues..." required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100px', resize: 'none' }} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Deploy Announcement
          </button>
        </form>
      </div>

      {/* List Analysis */}
      <h3 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Active Announcements</h3>
      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-list-item alert-type-${alert.type}`} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            backgroundColor: 'var(--bg-secondary)', 
            border: '1px solid var(--border)',
            borderLeft: `6px solid ${getAlertColor(alert.type)}`,
            padding: '1.5rem', 
            borderRadius: 'var(--radius-xl)',
            opacity: alert.is_active ? 1 : 0.5,
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
               <div style={{ color: getAlertColor(alert.type) }}>
                  {alert.type === 'info' && <Info size={28} />}
                  {alert.type === 'warning' && <AlertTriangle size={28} />}
                  {alert.type === 'danger' && <AlertCircle size={28} />}
                  {alert.type === 'success' && <CheckCircle size={28} />}
               </div>
               <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {alert.title}
                    <span className="location-pill">{alert.location}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{alert.message}</p>
               </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <form action={toggleAlert}>
                 <input type="hidden" name="id" value={alert.id} />
                 <input type="hidden" name="is_active" value={alert.is_active.toString()} />
                 <button type="submit" className={`btn-icon ${alert.is_active ? 'active' : ''}`} title={alert.is_active ? 'Disable' : 'Enable'}>
                    {alert.is_active ? <Eye size={20} /> : <EyeOff size={20} />}
                 </button>
              </form>
              <form action={deleteAlert} onSubmit={e => !confirm('Hapus selamanya?') && e.preventDefault()}>
                <input type="hidden" name="id" value={alert.id} />
                <button type="submit" className="btn-icon delete" title="Delete Permanent">
                   <Trash2 size={20} />
                </button>
              </form>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
            <Bell size={48} style={{ marginBottom: '1rem' }} />
            <p>No announcements found.</p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .location-pill {
           font-size: 0.65rem;
           text-transform: uppercase;
           background: var(--bg-primary);
           padding: 0.2rem 0.6rem;
           border-radius: 40px;
           letter-spacing: 0.05em;
           color: var(--text-muted);
           border: 1px solid var(--border);
        }
        .btn-icon {
           background: var(--bg-primary);
           border: 1px solid var(--border);
           color: var(--text-secondary);
           width: 40px;
           height: 40px;
           border-radius: 10px;
           display: flex;
           align-items: center;
           justify-content: center;
           cursor: pointer;
           transition: all 0.2s;
        }
        .btn-icon:hover { transform: translateY(-2px); border-color: var(--accent); color: var(--accent); }
        .btn-icon.active { color: #10b981; border-color: rgba(16, 185, 129, 0.3); }
        .btn-icon.delete:hover { border-color: #ef4444; color: #ef4444; }
      `}} />
    </div>
  );
}

function getAlertColor(type: string) {
  switch (type) {
    case 'danger': return '#ef4444';
    case 'warning': return '#f59e0b';
    case 'success': return '#10b981';
    default: return '#3b82f6';
  }
}
import { Bell } from 'lucide-react';
