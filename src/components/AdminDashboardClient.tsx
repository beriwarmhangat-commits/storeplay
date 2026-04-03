'use client'

import { useState } from 'react'
import { Users, LayoutGrid, Star, ShieldAlert, Trash2, Edit2, Check, X, Tag, Plus, Menu, ChevronLeft, ChevronRight } from 'lucide-react'
import { changeUserRole, deleteAppAdmin, deleteRating, updateProfileAdmin, deleteUserAdmin, createAlert, deleteAlert, toggleAlert } from '@/app/admin/actions'
import { createCategory, deleteCategory } from '@/app/admin/category-actions'
import { AlertCircle, Bell, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

type AdminTabsProps = {
  users: any[];
  apps: any[];
  ratings: any[];
  categories: any[];
  alerts: any[];
  currentAdminId: string;
}

export default function AdminDashboardClient({ users, apps, ratings, categories, alerts, currentAdminId }: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'apps' | 'ratings' | 'categories' | 'alerts'>('users')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const handleUpdateName = async (userId: string) => {
    const formData = new FormData()
    formData.append('user_id', userId)
    formData.append('developer_name', editName)
    await updateProfileAdmin(formData)
    setEditingUserId(null)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      
      {/* 📱 SIDEBAR (LEFT) */}
      <aside style={{ 
        width: isSidebarOpen ? '280px' : '80px', 
        backgroundColor: 'var(--bg-secondary)', 
        borderRight: '1px solid var(--border)',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 100,
        overflowX: 'hidden'
      }}>
        {/* Toggle Button */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: isSidebarOpen ? 'space-between' : 'center', alignItems: 'center' }}>
          {isSidebarOpen && <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent)' }}>Admin Menu</span>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {[
            { id: 'users', label: 'Users Management', icon: Users },
            { id: 'apps', label: 'Applications', icon: LayoutGrid },
            { id: 'ratings', label: 'Reviews & Ratings', icon: Star },
            { id: 'categories', label: 'Categories', icon: Tag },
            { id: 'alerts', label: 'Site Alerts', icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1.25rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                width: '100%',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center'
              }}
            >
              <tab.icon size={22} style={{ flexShrink: 0 }} />
              {isSidebarOpen && <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{tab.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer Sidebar */}
        {isSidebarOpen && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            StorePlay Engine v2.0
          </div>
        )}
      </aside>

      {/* 🚀 MAIN CONTENT AREA (RIGHT) */}
      <main style={{ 
        flex: 1, 
        padding: '2.5rem', 
        backgroundColor: 'var(--bg-primary)',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        {/* Content Tabs */}
        <div className="animate-fade-in">
          {activeTab === 'users' && (
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: 'var(--bg-primary)' }}>
                  <tr>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Nama Developer</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Email</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Role</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Waktu</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u.id}>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                        {editingUserId === u.id ? (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input value={editName} onChange={(e) => setEditName(e.target.value)} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--accent)' }} />
                            <button onClick={() => handleUpdateName(u.id)} style={{ color: '#10b981' }}><Check size={18} /></button>
                            <button onClick={() => setEditingUserId(null)} style={{ color: '#ef4444' }}><X size={18} /></button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 600 }}>{u.developer_name}</span>
                            <button onClick={() => { setEditingUserId(u.id); setEditName(u.developer_name); }} style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={14} /></button>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <form action={changeUserRole} style={{ display: 'flex', gap: '0.5rem' }}>
                          <input type="hidden" name="user_id" value={u.id} />
                          <select name="role" defaultValue={u.role} disabled={u.id === currentAdminId} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border)' }}>
                            <option value="developer">Developer</option>
                            <option value="admin">Admin</option>
                          </select>
                          {u.id !== currentAdminId && <button type="submit" className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>Update</button>}
                        </form>
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }} suppressHydrationWarning>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                        {u.id !== currentAdminId && (
                          <form action={deleteUserAdmin} onSubmit={e => !confirm('Hapus akun permanen?') && e.preventDefault()}>
                            <input type="hidden" name="user_id" value={u.id} />
                            <button type="submit" className="btn btn-outline" style={{ fontSize: '0.7rem', borderColor: '#fee2e2', color: '#ef4444' }}>Ban</button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'apps' && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {apps.map((app) => (
                <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <img src={app.icon_url} style={{ width: '50px', height: '50px', borderRadius: '10px' }} />
                    <div>
                      <h3 style={{ margin: 0 }}>{app.title}</h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>By: <strong>{app.profiles?.developer_name}</strong> • {app.package_name}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/dashboard/apps/${app.id}/edit`} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>Edit</Link>
                    <form action={deleteAppAdmin} onSubmit={e => !confirm('Hapus aplikasi?') && e.preventDefault()}>
                      <input type="hidden" name="app_id" value={app.id} />
                      <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#ef4444', fontSize: '0.85rem' }}>Takedown</button>
                    </form>
                  </div>
                </div>
              ))}
              {apps.length === 0 && <p>No applications found.</p>}
            </div>
          )}

          {activeTab === 'ratings' && (
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: 'var(--bg-primary)' }}>
                  <tr>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>App</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>User</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Rating</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Comment</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.map((r: any) => (
                    <tr key={r.id}>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>{r.apps?.title}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>{r.profiles?.developer_name}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', color: '#eab308' }}>{r.score} ★</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>{r.review}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <form action={deleteRating} onSubmit={e => !confirm('Delete review?') && e.preventDefault()}>
                          <input type="hidden" name="rating_id" value={r.id} />
                          <button type="submit" style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '2.5rem' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 800 }}>Add New Category</h3>
                <form action={createCategory} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <input name="name" placeholder="Category Name" required style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', flex: 1, minWidth: '200px', backgroundColor: 'var(--bg-primary)' }} />
                  <select name="icon_name" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)' }}>
                    <option value="LayoutGrid">Default</option>
                    <option value="Gamepad2">Games</option>
                    <option value="Wrench">Tools</option>
                    <option value="Users">Social</option>
                    <option value="Briefcase">Productivity</option>
                  </select>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Add</button>
                </form>
              </div>
              <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <tr>
                      <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Name</th>
                      <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Slug</th>
                      <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c: any) => (
                      <tr key={c.id}>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>{c.name}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>/{c.slug}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                          <form action={deleteCategory} onSubmit={e => !confirm('Delete category?') && e.preventDefault()}>
                            <input type="hidden" name="id" value={c.id} />
                            <button type="submit" style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '2.5rem' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 800 }}>Create Site Announcement</h3>
                <form action={createAlert} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                  <input name="title" placeholder="Alert Title (e.g. Server Maintenance)" required style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)' }} />
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select name="type" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', flex: 1 }}>
                      <option value="info">Information (Blue)</option>
                      <option value="warning">Warning (Yellow)</option>
                      <option value="danger">Critical (Red)</option>
                      <option value="success">Success (Green)</option>
                    </select>
                    <select name="location" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', flex: 1 }}>
                      <option value="all">Everywhere</option>
                      <option value="home">Home Only</option>
                      <option value="app_detail">App Details Only</option>
                    </select>
                  </div>

                  <textarea name="message" placeholder="Announcement message..." required style={{ gridColumn: 'span 2', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', minHeight: '80px' }} />
                  
                  <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2', padding: '0.75rem' }}>
                     <Plus size={18} /> Create Alert
                  </button>
                </form>
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                {alerts.map((alert) => (
                  <div key={alert.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    backgroundColor: 'var(--bg-secondary)', 
                    borderLeft: `5px solid ${alert.type === 'danger' ? '#ef4444' : alert.type === 'warning' ? '#f59e0b' : '#3b82f6'}`,
                    padding: '1.25rem', 
                    borderRadius: 'var(--radius-md)',
                    opacity: alert.is_active ? 1 : 0.6
                  }}>
                    <div>
                      <div style={{ fontWeight: 800, marginBottom: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {alert.title} 
                        <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem', background: 'var(--bg-primary)', borderRadius: '10px', textTransform: 'uppercase' }}>{alert.location}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{alert.message}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <form action={toggleAlert}>
                         <input type="hidden" name="id" value={alert.id} />
                         <input type="hidden" name="is_active" value={alert.is_active.toString()} />
                         <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: alert.is_active ? '#10b981' : 'var(--text-secondary)' }}>
                            {alert.is_active ? <Eye size={20} /> : <EyeOff size={20} />}
                         </button>
                      </form>
                      <form action={deleteAlert} onSubmit={e => !confirm('Hapus pengumuman?') && e.preventDefault()}>
                        <input type="hidden" name="id" value={alert.id} />
                        <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                           <Trash2 size={20} />
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
                {alerts.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No site alerts active.</p>}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
