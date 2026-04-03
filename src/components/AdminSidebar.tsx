'use client'

import { useState, useEffect } from 'react'
import { Users, LayoutGrid, Star, ShieldAlert, Tag, Menu, ChevronLeft, LogOut, Home, LayoutDashboard, Activity, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/admin/login/actions'

export default function AdminSidebar({ currentAdminName }: { currentAdminName: string }) {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()

  // Auto-close on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsOpen(false)
      else setIsOpen(true)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const menuItems = [
    { id: 'insights', label: 'Global Insights', icon: Activity, href: '/admin/insights' },
    { id: 'users', label: 'Users Management', icon: Users, href: '/admin/users' },
    { id: 'apps', label: 'Applications', icon: LayoutGrid, href: '/admin/apps' },
    { id: 'ratings', label: 'Reviews & Ratings', icon: Star, href: '/admin/ratings' },
    { id: 'categories', label: 'Categories', icon: Tag, href: '/admin/categories' },
    { id: 'settings', label: 'System Mode', icon: Settings, href: '/admin/settings' },
  ]

  return (
    <>
      {/* Mobile Toggle Button (Hanya tampil di mobile via CSS) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-toggle"
        style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 300, padding: '0.75rem', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', boxShadow: 'var(--shadow-md)', display: 'none' }}
      >
        {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="mobile-overlay" onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 150, display: 'none' }} />
      )}

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`} style={{ 
        width: '280px',
        backgroundColor: '#111827',
        color: 'white',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        zIndex: 200,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Style tag untuk menangani responsivitas sidebar tanpa window error */}
        <style>{`
          @media (max-width: 1024px) {
            .admin-sidebar { position: fixed !important; transform: translateX(-100%); }
            .admin-sidebar.open { transform: translateX(0); }
            .mobile-toggle, .mobile-overlay { display: flex !important; }
            .sidebar-spacer { display: none !important; }
          }
        `}</style>
        {/* Header Sidebar */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(59,130,246,0.2)', borderRadius: '8px' }}>
              <ShieldAlert size={24} color="#3b82f6" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>StorePlay <span style={{ color: '#3b82f6' }}>Admin</span></span>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* User Info */}
        <div style={{ padding: '1.25rem 1.5rem', backgroundColor: 'rgba(255,255,255,0.03)' }}>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Administrator</p>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>{currentAdminName}</p>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.id} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}>
                  <item.icon size={20} />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <Link href="/admin/users" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1.25rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer' }}>
              <LayoutDashboard size={20} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Admin Dashboard</span>
            </div>
          </Link>

          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1.25rem', borderRadius: '12px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
              <Home size={20} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Back to Store</span>
            </div>
          </Link>

          <form action={logout}>
            <button type="submit" style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1.25rem', borderRadius: '12px', color: '#ef4444', cursor: 'pointer', textAlign: 'left' }}>
              <LogOut size={20} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Spacing for content */}
      {isOpen && <div style={{ minWidth: '280px', height: '100vh', transition: 'all 0.3s' }} className="sidebar-spacer" />}
      
      <style>{`
        @media (max-width: 1024px) {
          .sidebar-spacer { min-width: 0 !important; }
        }
      `}</style>
    </>
  )
}
