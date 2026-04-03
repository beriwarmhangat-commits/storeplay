'use client'

import { useState, useCallback } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    setLoading(true)
    // Arahkan ke halaman hasil pencarian
    router.push(`/?search=${encodeURIComponent(query.trim())}`)
    setLoading(false)
  }

  // Update query saat ditekik (untuk real-time filter jika diinginkan nanti)
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {loading ? (
          <Loader2 size={18} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
        ) : (
          <Search size={18} color="var(--text-muted)" />
        )}
        
        <input 
          type="text" 
          value={query}
          onChange={onChange}
          placeholder="Search for apps, games, and more..." 
        />
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}} />
    </form>
  )
}
