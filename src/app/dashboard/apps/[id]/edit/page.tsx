import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Save, UploadCloud } from 'lucide-react'
import { updateApp, addAppVersion } from '@/app/dashboard/actions'
import DeleteAppForm from '@/components/DeleteAppForm'

export const revalidate = 0

type PageProps = {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ message?: string, type?: string }>
}

export default async function EditAppPage(props: { 
  params: Promise<{ id: string }>, 
  searchParams: Promise<{ message?: string, type?: string }> 
}) {
  const { id } = await props.params
  const { message, type } = await props.searchParams
  const supabase = await createClient()

  // Authenticate user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth')
  }

  // Fetch app
  const { data: appData, error: appError } = await supabase
    .from('apps')
    .select('*')
    .eq('id', id)
    .maybeSingle() // handle missing app safely

  if (appError || !appData) {
    redirect('/dashboard?message=Aplikasi tidak ditemukan atau Anda tidak memiliki akses.&type=error')
  }

  // Fetch versions
  const { data: versions } = await supabase
    .from('app_versions')
    .select('*')
    .eq('app_id', id)
    .order('version_code', { ascending: false })

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', paddingBottom: '6rem' }}>
      <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem', fontWeight: 600 }}>
        <ChevronLeft size={20} /> Back to Dashboard
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <img src={appData.icon_url} alt="Icon" style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' }} />
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Edit: {appData.title}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>{appData.package_name}</p>
          </div>
        </div>
        
        <DeleteAppForm id={id} />
      </div>

      {message && (
        <div style={{ padding: '1rem', backgroundColor: type === 'success' ? '#dcfce7' : '#fee2e2', color: type === 'success' ? '#166534' : '#991b1b', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: `1px solid ${type === 'success' ? '#bbf7d0' : '#fecaca'}` }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Kolom 1: Edit Info Aplikasi */}
        <div>
          <h2 className="section-title" style={{ marginTop: 0 }}>Informasi Dasar</h2>
          <form action={updateApp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <input type="hidden" name="app_id" value={id} />
            
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Judul Aplikasi</label>
              <input name="title" defaultValue={appData.title} required type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>URL Ikon (Logo)</label>
              <input name="icon_url" defaultValue={appData.icon_url} required type="url" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Kategori</label>
              <select name="category" defaultValue={appData.category} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                <option value="Tools">Tools</option>
                <option value="Games">Games</option>
                <option value="Social">Social</option>
                <option value="Productivity">Productivity</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Deskripsi Pendek</label>
              <textarea name="description" defaultValue={appData.description || ''} rows={5} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', marginTop: '0.5rem' }}>
              <Save size={18} /> Simpan Perubahan
            </button>
          </form>
        </div>

        {/* Kolom 2: Upload Versi Baru & Histori */}
        <div>
          <h2 className="section-title" style={{ marginTop: 0 }}>Rilis Versi Terbaru</h2>
          <form action={addAppVersion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '2rem' }}>
            <input type="hidden" name="app_id" value={id} />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>Nama Versi (Mis: 1.0.2) *</label>
                <input name="version_name" required type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>Version Code (Int) *</label>
                <input name="version_code" required type="number" placeholder="Mis: 10" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>Upload File APK *</label>
              <input name="apk_file" type="file" accept=".apk,.aab,.zip" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
            </div>
            
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>-- ATAU --</div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>Gunakan URL Download Luar</label>
              <input name="apk_url" type="url" placeholder="https:// (Opsional jika upload file)" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>Ukuran File (MB)</label>
              <input name="size_mb" type="number" step="0.01" placeholder="Mis: 15.5" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>Catatan Rilis (What&apos;s New)</label>
              <textarea name="release_notes" rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', marginTop: '0.5rem', backgroundColor: '#10b981' }}>
              <UploadCloud size={18} /> Publikasikan Update
            </button>
          </form>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Riwayat Versi Tersedia</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(!versions || versions.length === 0) ? (
              <p style={{ color: 'var(--text-secondary)' }}>Belum ada versi yang diunggah.</p>
            ) : (
              versions.map((ver: any, i: number) => (
                <div key={ver.id} style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 700 }}>v{ver.version_name} {i===0 && <span style={{ fontSize: '0.7rem', background: '#10b981', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '1rem', marginLeft: '0.5rem' }}>Latest</span>}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Code: {ver.version_code} • {(ver.size_bytes / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                  <a href={ver.apk_url} target="_blank" style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600 }}>Lihat Berkas</a>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
