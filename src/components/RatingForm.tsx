'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { submitRating } from '@/app/apps/actions'

export default function RatingForm({ appId, initialRating = 0, initialReview = '' }: { appId: string, initialRating?: number, initialReview?: string }) {
  const [rating, setRating] = useState(initialRating)
  const [hover, setHover] = useState(0)
  const [review, setReview] = useState(initialReview)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setMessage({ text: 'Silakan pilih bintang terlebih dahulu!', type: 'error' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('app_id', appId)
    formData.append('score', rating.toString())
    formData.append('review', review)

    const result = await submitRating(formData)
    
    setIsSubmitting(false)
    if (result?.error) {
      setMessage({ text: 'Gagal mengirim rating: ' + result.error, type: 'error' })
    } else {
      setMessage({ text: 'Rating berhasil dikirim! Terima kasih.', type: 'success' })
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginTop: '2rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Berikan Rating & Ulasan</h3>
      
      {message && (
        <div style={{ padding: '0.75rem', backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2', color: message.type === 'success' ? '#166534' : '#991b1b', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem', border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}` }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <Star
                size={32}
                fill={(hover || rating) >= star ? 'var(--star-active)' : 'transparent'}
                color={(hover || rating) >= star ? 'var(--star-active)' : 'var(--star-inactive)'}
              />
            </button>
          ))}
        </div>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Tulis ulasan Anda di sini (opsional)..."
          style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', marginBottom: '1rem', minHeight: '100px' }}
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
          style={{ width: '100%', opacity: isSubmitting ? 0.7 : 1 }}
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
        </button>
      </form>
    </div>
  )
}
