'use client'

import { useState, Suspense } from 'react'
import { login } from './actions'
import { useSearchParams } from 'next/navigation'
import LoadingOverlay from '@/components/LoadingOverlay'

function AdminAuthForm() {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const type = searchParams.get('type') || 'error'

  const getNoticeStyle = () => {
    switch (type) {
      case 'success':
        return { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' }
      case 'warning':
        return { bg: '#fef9c3', color: '#854d0e', border: '#fef08a' }
      default:
        return { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' }
    }
  }

  const noticeStyle = getNoticeStyle()

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      await login(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '3rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow-md)', position: 'relative' }}>
      {loading && <LoadingOverlay message="Sedang login admin..." />}
      <h1 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.8rem', fontWeight: 800 }}>
        Admin Login
      </h1>
      
      {message && (
        <div style={{ padding: '0.85rem', backgroundColor: noticeStyle.bg, color: noticeStyle.color, border: `1px solid ${noticeStyle.border}`, borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600, textAlign: 'center' }}>
          {message}
        </div>
      )}

      <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Admin Email</label>
          <input id="email" name="email" type="email" required style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Password</label>
          <input id="password" name="password" type="password" required style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
          Sign In to Admin
        </button>
      </form>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <Suspense fallback={<div>Loading...</div>}>
        <AdminAuthForm />
      </Suspense>
    </div>
  )
}
