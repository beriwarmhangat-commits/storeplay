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
    <form onSubmit={handleSearch} className="search-bar" style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
      {loading ? (
        <Loader2 size={18} className="animate-spin" style={{ color: 'var(--text-secondary)', position: 'absolute', left: '1rem' }} />
      ) : (
        <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem' }} />
      )}
      
      <input 
        type="text" 
        value={query}
        onChange={onChange}
        placeholder="Cari aplikasi atau game..." 
        style={{ paddingLeft: '2.8rem' }}
      />
      
      {/* Tombol enter untuk submit otomatis karena ini di dalam <form> */}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </form>
  )
}
