import { createClient } from '@/lib/supabase-server';
import AlertsManagementClient from './AlertsManagementClient';

export default async function AdminAlertsPage() {
  const supabase = await createClient();

  // Fetch all alerts
  const { data: alerts } = await supabase
    .from('site_alerts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Site Alerts Management
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0' }}>
          Create and manage system-wide announcements and alerts.
        </p>
      </div>

      <AlertsManagementClient alerts={alerts || []} />
    </div>
  );
}
