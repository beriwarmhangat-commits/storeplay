'use client'

import { Trash2 } from 'lucide-react'
import { deleteCategory } from '@/app/admin/category-actions'

export default function CategoryTableClient({ categories }: { categories: any[] }) {
  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
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
              <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>/{c.slug}</td>
              <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                <form action={deleteCategory} onSubmit={e => !confirm('Delete category?') && e.preventDefault()}>
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </form>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Belum ada kategori.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
