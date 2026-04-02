import Link from 'next/link'
import { FileQuestion, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      textAlign: 'center',
      padding: '2rem',
      backgroundColor: 'var(--bg-primary)'
    }}>
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <FileQuestion size={120} color="var(--border)" strokeWidth={1} />
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          fontSize: '4rem', 
          fontWeight: 900, 
          color: 'var(--accent)',
          opacity: 0.8
        }}>
          404
        </div>
      </div>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>
        Halaman Tidak Ditemukan
      </h1>
      
      <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
        Ups! Sepertinya Anda tersesat. Halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>

      <Link href="/" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', display: 'flex', gap: '0.75rem' }}>
        <Home size={20} /> Kembali ke Beranda
      </Link>

      <div style={{ marginTop: '4rem', color: 'var(--border)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>
        StorePlay Security System
      </div>
    </div>
  )
}
