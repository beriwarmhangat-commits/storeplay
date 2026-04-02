import { createClient } from '@/lib/supabase-server'
import { deleteAppAdmin } from '@/app/admin/actions'
import Link from 'next/link'
import { Plus } from 'lucide-react'

import AdminAppsTableClient from './AdminAppsTableClient'

export default async function AppsAdminPage() {
  const supabase = await createClient()
  const { data: allApps } = await supabase
    .from('apps')
    .select('*, profiles(developer_name)')
    .order('created_at', { ascending: false })

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            Applications Monitoring
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0' }}>
            Takedown atau pantau seluruh aplikasi yang aktif di StorePlay.
          </p>
        </div>
        <Link href="/admin/apps/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
          <Plus size={18} /> Add Application
        </Link>
      </div>

      <AdminAppsTableClient apps={allApps || []} />
    </div>
  )
}
