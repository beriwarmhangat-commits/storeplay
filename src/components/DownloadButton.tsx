'use client'

import { useState } from 'react'
import { Download, Loader2, CheckCircle2 } from 'lucide-react'

export default function DownloadButton({ apkUrl, sizeMb, versionName }: { apkUrl: string, sizeMb: number, versionName: string }) {
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState(false)

  const transformHuggingFaceUrl = (url: string) => {
    // If it's a huggingface blob link, convert to resolve link for direct download
    if (url.includes('huggingface.co') && url.includes('/blob/')) {
      return url.replace('/blob/', '/resolve/') + '?download=true'
    }
    return url
  }

  const handleDownload = () => {
    setDownloading(true)
    setProgress(0)
    
    // Simulate real-time loading effect
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setDownloading(false)
          setCompleted(true)
          
          // Use hidden iframe to trigger download without redirecting or opening new tab
          const directUrl = transformHuggingFaceUrl(apkUrl)
          const iframe = document.createElement('iframe')
          iframe.style.display = 'none'
          iframe.src = directUrl
          document.body.appendChild(iframe)
          
          // Cleanup iframe after some time
          setTimeout(() => {
            document.body.removeChild(iframe)
          }, 60000)
          
          setTimeout(() => {
            setCompleted(false)
            setProgress(0)
          }, 3000)
          return 100
        }
        return prev + Math.floor(Math.random() * 15) + 5
      })
    }, 250)
  }

  if (completed) {
    return (
      <button className="btn btn-primary" disabled style={{ backgroundColor: '#10b981', padding: '1rem 3rem', fontSize: '1.1rem', minWidth: '280px' }}>
        <CheckCircle2 size={20} /> Siap Diinstal!
      </button>
    )
  }

  if (downloading) {
    return (
      <button className="btn btn-primary" disabled style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', position: 'relative', overflow: 'hidden', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress}%`, backgroundColor: 'rgba(255,255,255,0.2)', transition: 'width 0.2s ease' }} />
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 1 }}>
          <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> 
          Mengunduh... {progress > 100 ? 100 : progress}%
        </span>
        <span style={{ fontSize: '0.75rem', zIndex: 1, opacity: 0.8 }}>{(sizeMb * (progress / 100)).toFixed(1)} / {sizeMb.toFixed(1)} MB</span>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </button>
    )
  }

  return (
    <button onClick={handleDownload} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', minWidth: '280px', cursor: 'pointer' }}>
      <Download size={20} /> Unduh v{versionName} 
    </button>
  )
}
