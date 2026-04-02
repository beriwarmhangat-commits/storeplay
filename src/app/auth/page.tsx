'use client'

import { useState, Suspense } from 'react'
import { login, signup } from './actions'
import { useSearchParams } from 'next/navigation'
import LoadingOverlay from '@/components/LoadingOverlay'

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
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
       if (isLogin) {
         await login(formData)
       } else {
         await signup(formData)
       }
    } finally {
       setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '3rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow-md)', position: 'relative' }}>
      {loading && <LoadingOverlay message={isLogin ? "Sedang login..." : "Mendaftarkan Anda..."} />}
      <h1 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.8rem', fontWeight: 800 }}>
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h1>
      
      {message && (
        <div style={{ padding: '0.85rem', backgroundColor: noticeStyle.bg, color: noticeStyle.color, border: `1px solid ${noticeStyle.border}`, borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600, textAlign: 'center' }}>
          {message}
        </div>
      )}

      <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!isLogin && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="fullName" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Developer / Company Name</label>
            <input id="fullName" name="fullName" type="text" required style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email Address</label>
          <input id="email" name="email" type="email" required style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Password</label>
          <input id="password" name="password" type="password" required style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        {isLogin ? "Don't have a developer account? " : "Already have an account? "}
        <button 
          type="button" 
          onClick={() => setIsLogin(!isLogin)}
          style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </div>
  )
}

export default function AuthPage() {
  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthForm />
      </Suspense>
    </div>
  )
}
