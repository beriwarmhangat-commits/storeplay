import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { logout } from '@/app/auth/actions'
import { LogOut, LayoutDashboard } from 'lucide-react'

export default async function AuthNav() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <Link href="/auth" className="btn btn-primary">
        Sign In / Register
      </Link>
    )
  }

  // Optional: Check role if we want to show 'Admin Panel' vs 'Dashboard'
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  return (
    <div id="top-auth-nav" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      {isAdmin && (
        <Link href="/admin" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
          <LayoutDashboard size={18} />
          Admin Panel
        </Link>
      )}
      <form action={logout}>
        <button type="submit" className="btn btn-outline" style={{ padding: '0.5rem 1rem', border: 'none', color: '#ef4444' }}>
          <LogOut size={18} /> Sign Out
        </button>
      </form>
    </div>
  )
}
