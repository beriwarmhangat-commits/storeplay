'use client'

import { Loader2 } from 'lucide-react'

export default function LoadingOverlay({ message = 'Memproses...' }: { message?: string }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      color: 'white'
    }}>
      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem 3rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
        <Loader2 size={48} className="animate-spin" style={{ color: 'var(--accent)', marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
        <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>{message}</p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mohon tunggu sebentar...</p>
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
