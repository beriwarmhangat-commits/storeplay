'use client'

import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Gamepad2, Wrench, Users, Briefcase, PlayCircle, GraduationCap, LayoutGrid, Laugh, Cpu, Heart, Trophy } from 'lucide-react'

// Map Ikon dari Database ke Komponen Lucide
const IconMap: { [key: string]: any } = {
  Gamepad2, Wrench, Users, Briefcase, PlayCircle, GraduationCap, LayoutGrid, Laugh, Cpu, Heart, Trophy
}

type Category = {
  id: string;
  name: string;
  slug: string;
  icon_name?: string;
}

export default function CategorySlider({ categories }: { categories: Category[] }) {
  const [selected, setSelected] = useState('all')
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' ? scrollLeft - 300 : scrollLeft + 300
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <div style={{ position: 'relative', margin: '2rem 0', display: 'flex', alignItems: 'center' }}>
      {/* Tombol Navigasi Kiri */}
      <button onClick={() => scroll('left')} className="btn btn-outline" style={{ display: 'none', position: 'absolute', left: '-1rem', zIndex: 10, backgroundColor: 'white', borderRadius: '50%', width: '40px', height: '40px', padding: 0, justifyContent: 'center', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <ChevronLeft size={20} />
      </button>

      {/* Konten Slider */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          padding: '0.5rem 0',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x mandatory',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}
      >
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Tombol "All" */}
        <button
          onClick={() => setSelected('all')}
          style={{
            flex: '0 0 auto',
            scrollSnapAlign: 'start',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.9rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            border: '1.5px solid',
            borderColor: selected === 'all' ? 'var(--accent)' : 'var(--border)',
            backgroundColor: selected === 'all' ? 'var(--accent)' : 'var(--bg-secondary)',
            color: selected === 'all' ? 'white' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <LayoutGrid size={16} /> Semuanya
        </button>

        {/* Daftar Kategori */}
        {categories.map((cat) => {
          const Icon = IconMap[cat.icon_name || 'LayoutGrid'] || LayoutGrid
          return (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.slug)}
              style={{
                flex: '0 0 auto',
                scrollSnapAlign: 'start',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.9rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                border: '1.5px solid',
                borderColor: selected === cat.slug ? 'var(--accent)' : 'var(--border)',
                backgroundColor: selected === cat.slug ? 'var(--accent)' : 'var(--bg-secondary)',
                color: selected === cat.slug ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} /> {cat.name}
            </button>
          )
        })}
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
