import { createClient } from '@/lib/supabase-server'
import { deleteRating } from '@/app/admin/actions'
import { Star, Trash2 } from 'lucide-react'

export default async function RatingsAdminPage() {
  const supabase = await createClient()
  const { data: allRatings } = await supabase.from('ratings').select('*, apps(title), profiles(developer_name)').order('created_at', { ascending: false })

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Reviews & Ratings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0' }}>
          Moderasi ulasan pengguna untuk menjaga kualitas ekosistem.
        </p>
      </div>

      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
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
            {allRatings?.map((r: any) => (
              <tr key={r.id}>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>{r.apps?.title}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>{r.profiles?.developer_name}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', color: '#eab308' }}>
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    {r.score} <Star size={14} fill="#eab308" color="#eab308" />
                  </div>
                </td>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontSize: '0.9rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.review}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                  <form action={deleteRating} onSubmit={e => !confirm('Delete review?') && e.preventDefault()}>
                    <input type="hidden" name="rating_id" value={r.id} />
                    <button type="submit" style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </form>
                </td>
              </tr>
            ))}
            {allRatings?.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Belum ada ulasan masuk.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
