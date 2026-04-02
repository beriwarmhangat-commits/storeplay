'use client'

import { useState } from 'react'
import { Check, X, Edit2 } from 'lucide-react'
import { changeUserRole, updateProfileAdmin, deleteUserAdmin } from '@/app/admin/actions'

export default function UsersManagementClient({ users, currentAdminId }: { users: any[], currentAdminId: string }) {
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
    <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: 'var(--bg-primary)' }}>
          <tr>
            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Nama Developer</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Email</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Role</th>
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
                    <button onClick={() => handleUpdateName(u.id)} style={{ color: '#10b981', border: 'none', background: 'none', cursor: 'pointer' }}><Check size={18} /></button>
                    <button onClick={() => setEditingUserId(null)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}><X size={18} /></button>
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
  )
}
