'use client'

import { useState, useEffect } from 'react'
import { Star, Send } from 'lucide-react'
import { submitRating } from '@/app/apps/actions'

export default function RatingForm({ appId, initialRating = 0, initialReview = '' }: { appId: string, initialRating?: number, initialReview?: string }) {
  const [rating, setRating] = useState(initialRating)
  const [hover, setHover] = useState(0)
  const [review, setReview] = useState(initialReview)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)
  const [deviceId, setDeviceId] = useState('')

  // Generate or Get Device ID from Local Storage
  useEffect(() => {
    let id = localStorage.getItem('storeplay_device_id')
    if (!id) {
      id = 'device_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      localStorage.setItem('storeplay_device_id', id)
    }
    setDeviceId(id)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if updating
    if (initialRating > 0) {
      const confirmUpdate = window.confirm('Anda sudah pernah memberikan ulasan. Apakah Anda ingin memperbarui rating Anda?')
      if (!confirmUpdate) return
    }

    if (rating === 0) {
      setMessage({ text: 'Please select a star rating first.', type: 'error' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('app_id', appId)
    formData.append('score', rating.toString())
    formData.append('review', review)
    formData.append('device_id', deviceId)

    const result = await submitRating(formData)
    
    setIsSubmitting(false)
    if (result?.error) {
      setMessage({ text: result.error, type: 'error' })
    } else {
      setMessage({ text: 'Review submitted successfully! Thank you.', type: 'success' })
    }
  }

  return (
    <div className="rating-form-container">
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        Rate this App
      </h3>
      
      {message && (
        <div style={{ padding: '1rem', backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', color: message.type === 'success' ? '#10b981' : '#f43f5e', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}` }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', justifyContent: 'center' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'transform 0.1s' }}
              className="star-btn"
            >
              <Star
                size={34}
                fill={(hover || rating) >= star ? '#fbbf24' : 'none'}
                color={(hover || rating) >= star ? '#fbbf24' : 'var(--text-muted)'}
                strokeWidth={2}
              />
            </button>
          ))}
        </div>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="What did you think about this app? (optional)"
          style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-main)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', marginBottom: '1.5rem', minHeight: '120px', fontSize: '0.95rem', resize: 'none' }}
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
          style={{ width: '100%', padding: '1rem', opacity: isSubmitting ? 0.7 : 1 }}
        >
          {isSubmitting ? 'Posting...' : <><Send size={18} /> Post Review</>}
        </button>
      </form>

      <style dangerouslySetInnerHTML={{ __html: `
        .star-btn:hover {
           transform: scale(1.2);
        }
        .rating-form-container {
           background-color: transparent;
        }
      `}} />
    </div>
  )
}
