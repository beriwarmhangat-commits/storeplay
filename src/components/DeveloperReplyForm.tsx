'use client'

import { useState } from 'react'
import { submitDeveloperReply, deleteDeveloperReply } from '@/app/apps/actions'
import { MessageCircle, Trash2, Send, Loader2 } from 'lucide-react'

export default function DeveloperReplyForm({ 
  ratingId, 
  appId, 
  initialReply = null,
  repliedAt = null
}: { 
  ratingId: string, 
  appId: string, 
  initialReply?: string | null,
  repliedAt?: string | null
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [reply, setReply] = useState(initialReply || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reply.trim()) return
    
    setLoading(true)
    setError(null)
    try {
      await submitDeveloperReply(ratingId, appId, reply)
      setIsEditing(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Hapus balasan Anda?')) return

    setLoading(true)
    try {
      await deleteDeveloperReply(ratingId, appId)
      setReply('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // If there's an existing reply and not editing, show the reply with an "Edit" button for devs
  if (initialReply && !isEditing) {
    return (
      <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', borderLeft: '3px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageCircle size={14} /> Developer Reply
            <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>
              • {repliedAt ? new Date(repliedAt).toLocaleDateString() : ''}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
             <button onClick={() => setIsEditing(true)} style={{ fontSize: '0.75rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
             <button onClick={handleDelete} disabled={loading} style={{ fontSize: '0.75rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
               {loading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} Hapus
             </button>
          </div>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>{initialReply}</p>
      </div>
    )
  }

  // If editing or adding new reply
  if (isEditing || !initialReply) {
    return (
      <div style={{ marginTop: '1rem' }}>
        {!isEditing && !initialReply && (
          <button 
            onClick={() => setIsEditing(true)}
            className="btn btn-outline" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: 'var(--radius-md)' }}
          >
            <MessageCircle size={14} /> Balas Review
          </button>
        )}

        {(isEditing || !initialReply) && isEditing && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-main)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>Balasa Anda</div>
            <textarea 
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Berikan balasan profesional ke user..."
              rows={3}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-main)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem' }}
              disabled={loading}
              required
            />
            {error && <div style={{ fontSize: '0.8rem', color: '#ef4444' }}>{error}</div>}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                disabled={loading}
                className="btn btn-outline" 
                style={{ fontSize: '0.75rem', padding: '0.4rem 1rem' }}
              >
                Batal
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary" 
                style={{ fontSize: '0.75rem', padding: '0.4rem 1rem' }}
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Kirim Balasan
              </button>
            </div>
          </form>
        )}
      </div>
    )
  }

  return null
}
