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
        return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'rgba(16, 185, 129, 0.2)' }
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.2)' }
      default:
        return { bg: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', border: 'rgba(244, 63, 94, 0.2)' }
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
    <div className="auth-card animate-scale-in">
      {loading && <LoadingOverlay message={isLogin ? "Authenticating..." : "Creating Account..."} />}
      
      <div className="auth-logo-box">
         <div className="auth-icon">SP</div>
         <h1 className="auth-title">StorePlay</h1>
      </div>

      <div className="auth-tabs">
         <button onClick={() => setIsLogin(true)} className={`auth-tab ${isLogin ? 'active' : ''}`}>Login</button>
         <button onClick={() => setIsLogin(false)} className={`auth-tab ${!isLogin ? 'active' : ''}`}>Register</button>
      </div>
      
      <p className="auth-subtitle">
         {isLogin ? 'Enter your credentials to access your account' : 'Start your journey with StorePlay today'}
      </p>

      {message && (
        <div style={{ padding: '0.85rem', backgroundColor: noticeStyle.bg, color: noticeStyle.color, border: `1px solid ${noticeStyle.border}`, borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600, textAlign: 'center' }}>
          {message}
        </div>
      )}

      <form action={handleSubmit} className="auth-form">
        {!isLogin && (
          <div className="input-group">
            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" name="fullName" type="text" placeholder="John Doe" required={!isLogin} />
          </div>
        )}

        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input id="email" name="email" type="email" placeholder="name@example.com" required />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="••••••••" required />
        </div>

        <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '0.5rem', padding: '1rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
          {isLogin ? 'Sign In Now' : 'Create My Account'}
        </button>
      </form>

      <div style={{ textAlign: 'center' }}>
         <a href="/" className="back-link">← Back to Home</a>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .auth-card {
           background: #ffffff;
           padding: 2.5rem 2rem;
           border-radius: 28px;
           width: 100%;
           max-width: 420px;
           box-shadow: 0 4px 12px rgba(0,0,0,0.05);
           margin: 0 auto;
           display: flex;
           flex-direction: column;
           border: 1px solid #e0e0e0;
        }
        
        .auth-logo-box { text-align: center; margin-bottom: 2rem; }
        .auth-icon { 
           width: 48px; height: 48px; background: #1a73e8;
           border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;
           color: white; font-weight: 700; font-size: 1.1rem;
           box-shadow: 0 2px 4px rgba(26, 115, 232, 0.3);
        }
        .auth-title { font-size: 1.5rem; font-weight: 500; color: #202124; margin: 0; font-family: 'Roboto', sans-serif; }
        .auth-subtitle { text-align: center; color: #5f6368; font-size: 0.95rem; margin-top: 8px; margin-bottom: 24px; }
        
        .auth-tabs { 
           display: flex; background: #f1f3f4; padding: 4px; border-radius: 50px; 
           margin-bottom: 28px; border: 1px solid #e8eaed; 
        }
        .auth-tab { 
           flex: 1; border: none; background: transparent; padding: 10px; 
           border-radius: 50px; font-weight: 500; color: #5f6368; cursor: pointer; 
           transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); font-size: 0.9rem;
        }
        .auth-tab.active { 
           background: #ffffff; color: #1a73e8; 
           box-shadow: 0 1px 3px rgba(60, 64, 67, 0.3), 0 4px 8px rgba(60, 64, 67, 0.15); 
        }
        
        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .input-group { display: flex; flex-direction: column; gap: 6px; }
        .input-group label { font-size: 0.85rem; font-weight: 500; color: #3c4043; text-align: left; padding-left: 4px; }
        .input-group input { 
           padding: 14px 16px; border-radius: 12px; border: 1px solid #dadce0; 
           background: #ffffff; color: #202124; font-size: 1rem;
           transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-group input:focus { 
           border-color: #1a73e8; outline: none; 
           box-shadow: inset 0 0 0 1px #1a73e8;
        }
        
        .btn-full { 
           width: 100%; border-radius: 50px; font-weight: 600; border: none; 
           color: white; cursor: pointer; height: 48px; font-size: 1rem;
           background: #1a73e8; transition: background 0.2s;
           box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 1px 3px rgba(60, 64, 67, 0.15);
           margin-top: 12px;
        }
        .btn-full:hover { background: #185abc; box-shadow: 0 1px 3px rgba(60, 64, 67, 0.3), 0 4px 8px rgba(60, 64, 67, 0.15); }
        .btn-full:active { background: #174ea6; box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3); transform: scale(0.98); }

        .back-link { 
           margin-top: 24px; text-align: center; 
           display: block; color: #1a73e8; text-decoration: none; 
           font-size: 0.9rem; font-weight: 500;
        }
        .back-link:hover { text-decoration: underline; }

        @media (max-width: 480px) {
           .auth-card { padding: 1.5rem; border: none; box-shadow: none; border-radius: 0; min-height: 100vh; }
        }
      `}} />
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
