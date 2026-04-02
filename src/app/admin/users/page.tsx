import { createClient } from '@/lib/supabase-server'
import { changeUserRole, updateProfileAdmin, deleteUserAdmin } from '@/app/admin/actions'
import UsersManagementClient from './UsersManagementClient'

export default async function UsersAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: allUsers } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Users Management
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0' }}>
          Kelola hak akses dan profil seluruh pengguna StorePlay.
        </p>
      </div>

      <UsersManagementClient 
        users={allUsers || []} 
        currentAdminId={user?.id || ''} 
      />
    </div>
  )
}
