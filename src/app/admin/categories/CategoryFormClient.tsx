'use client'

import { Plus } from 'lucide-react'
import { createCategory } from '@/app/admin/category-actions'

export default function CategoryFormClient() {
  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
      <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 800, fontSize: '1rem' }}>Add New Category</h3>
      <form action={createCategory} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input name="name" placeholder="Category Name (ex: Games)" required style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', flex: 1, minWidth: '200px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
        <select name="icon_name" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
          <option value="LayoutGrid">Default (Grid)</option>
          <option value="Gamepad2">Gamepad (Games)</option>
          <option value="Wrench">Wrench (Tools)</option>
          <option value="Users">Users (Social)</option>
          <option value="Briefcase">Briefcase (Productivity)</option>
          <option value="PlayCircle">Play (Entertainment)</option>
          <option value="GraduationCap">Cap (Education)</option>
        </select>
        <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.75rem 2rem', border: 'none' }}>
          <Plus size={20} /> Save
        </button>
      </form>
    </div>
  )
}
