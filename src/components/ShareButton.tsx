'use client'

import { Share2, Link as LinkIcon, Check } from 'lucide-react'
import { useState } from 'react'

export default function ShareButton({ title, text }: { title: string, text: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareData = {
      title: title,
      text: text,
      url: window.location.href,
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.error('Share failed:', err)
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button 
      onClick={handleShare} 
      className="btn btn-outline share-btn" 
      style={{ 
        padding: '0 1.5rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        minWidth: '60px',
        justifyContent: 'center',
        position: 'relative'
      }}
      title="Share app"
    >
      {copied ? <Check size={20} color="#10b981" /> : <Share2 size={20} />}
      
      {copied && (
        <span style={{ 
          position: 'absolute', 
          bottom: '120%', 
          left: '50%', 
          transform: 'translateX(-50%)',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '0.4rem 0.8rem',
          borderRadius: '8px',
          fontSize: '0.75rem',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
        }}>
          Link Copied!
        </span>
      )}
    </button>
  )
}
