import { createClient } from '@/lib/supabase-server'
import { updateAppAdmin } from '@/app/admin/actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Save } from 'lucide-react'

export default async function AdminEditAppPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: app } = await supabase
    .from('apps')
    .select('*')
    .eq('id', id)
    .single()

  if (!app) redirect('/admin/apps')

  const { data: categories } = await supabase.from('categories').select('name').order('name')

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <Link href="/admin/apps" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem', textDecoration: 'none', fontWeight: 600 }}>
        <ChevronLeft size={20} /> Kembali ke Daftar Aplikasi
      </Link>

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Edit Application Details
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          ID: {app.id}
        </p>
      </div>

      <form action={updateAppAdmin} style={{ display: 'grid', gap: '1.5rem', backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
        <input type="hidden" name="app_id" value={app.id} />
        
        <div>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Application Status</label>
          <select name="status" defaultValue={app.status || 'pending'} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <option value="pending">Pending (Mendatang)</option>
            <option value="approved">Approved (Online)</option>
            <option value="rejected">Rejected (Ditolak)</option>
          </select>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>Hanya status 'Approved' yang akan memunculkan tombol download di Store.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>App Title</label>
            <input name="title" defaultValue={app.title} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Category</label>
            <select name="category" defaultValue={app.category} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
              {categories?.map((c: any) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Icon URL</label>
          <input name="icon_url" defaultValue={app.icon_url} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Description</label>
          <textarea name="description" defaultValue={app.description} rows={5} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', resize: 'vertical' }} />
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '1rem', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem' }}>
          <Save size={18} /> Simpan Perubahan
        </button>
      </form>
    </div>
  )
}
