import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { logout } from '@/app/auth/actions'
import { LogOut, LayoutDashboard, UserCircle } from 'lucide-react'

export default async function AuthNav() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/auth" style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none' }}>
          Sign In
        </Link>
        <Link href="/auth" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '12px', fontWeight: 800 }}>
          Get Started
        </Link>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, developer_name')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  return (
    <div id="top-auth-nav" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>
         <UserCircle size={20} className="text-secondary" />
         <span className="desktop-only">{profile?.developer_name || 'My Profile'}</span>
      </Link>
      
      {isAdmin && (
        <Link href="/admin" className="btn btn-outline desktop-only" style={{ padding: '0.5rem 1rem' }}>
          <LayoutDashboard size={18} />
          Admin
        </Link>
      )}
      
      <form action={logout}>
        <button type="submit" className="btn btn-outline" style={{ padding: '0.5rem 1rem', border: 'none', color: '#ef4444' }}>
          <LogOut size={18} /> <span className="desktop-only">Sign Out</span>
        </button>
      </form>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
        }
      `}} />
    </div>
  )
}
