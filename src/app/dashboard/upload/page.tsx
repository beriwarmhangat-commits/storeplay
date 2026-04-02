import { createApp } from '@/app/dashboard/actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function UploadAppPage({ searchParams }: { searchParams: Promise<{ message?: string, type?: string }> }) {
  const params = await searchParams
  const message = params?.message
  const type = params?.type || 'error'

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', paddingBottom: '6rem', maxWidth: '800px' }}>
      <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem', fontWeight: 600 }}>
        <ChevronLeft size={20} /> Back to Dashboard
      </Link>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Daftarkan Aplikasi Baru</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Detail awal untuk aplikasi Anda. Anda bisa mengedit ini nanti.</p>

      {message && (
        <div style={{ padding: '1rem', backgroundColor: type === 'success' ? '#dcfce7' : '#fee2e2', color: type === 'success' ? '#166534' : '#991b1b', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: `1px solid ${type === 'success' ? '#bbf7d0' : '#fecaca'}` }}>
          {message}
        </div>
      )}

      <form action={createApp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
        
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Judul Aplikasi *</label>
          <input name="title" required type="text" placeholder="Misal: StorePlay Mobile" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Package Name (Unik) *</label>
          <input name="package_name" required type="text" placeholder="Misal: com.company.appname" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Package ID tidak bisa diubah setelah dibuat.</p>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Upload File Ikon (Logo)</label>
          <input name="icon_file" type="file" accept="image/*" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
        </div>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>-- ATAU --</div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Gunakan URL Ikon Luar</label>
          <input name="icon_url" type="url" placeholder="https://..." style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Kategori</label>
          <select name="category" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <option value="Tools">Tools</option>
            <option value="Games">Games</option>
            <option value="Social">Social</option>
            <option value="Productivity">Productivity</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Deskripsi Pendek</label>
          <textarea name="description" rows={4} placeholder="Jelaskan kegunaan aplikasi Anda..." style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1rem', marginTop: '1rem' }}>
          Buat Entri Aplikasi
        </button>

      </form>
    </div>
  )
}
