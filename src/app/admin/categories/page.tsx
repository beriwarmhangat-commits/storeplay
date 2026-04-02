import { createClient } from '@/lib/supabase-server'
import CategoryFormClient from './CategoryFormClient'
import CategoryTableClient from './CategoryTableClient'

export default async function CategoriesAdminPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name', { ascending: true })

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Categories Management
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0' }}>
          Kelola kategori aplikasi untuk memudahkan pengguna dalam pencarian.
        </p>
      </div>

      <CategoryFormClient />

      <CategoryTableClient categories={categories || []} />
    </div>
  )
}
