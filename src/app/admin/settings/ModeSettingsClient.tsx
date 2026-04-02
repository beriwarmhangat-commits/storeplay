'use client'

import { useState } from 'react'
import { Settings, Check, Clock, ShieldAlert, Rocket } from 'lucide-react'
import { updateSystemMode } from './actions'

export default function ModeSettingsClient({ currentMode }: { currentMode: string }) {
  const [mode, setMode] = useState(currentMode || 'production')
  const [loading, setLoading] = useState(false)

  const modes = [
    { id: 'development', label: 'Development', icon: Clock, color: '#3b82f6', desc: 'Hanya developer yang bisa melihat update terbaru.' },
    { id: 'production', label: 'Production', icon: Rocket, color: '#10b981', desc: 'Mode publik, web berjalan normal untuk semua users.' },
    { id: 'maintenance', label: 'Maintenance', icon: ShieldAlert, color: '#ef4444', desc: 'Web ditutup sementara untuk perbaikan besar.' },
  ]

  const handleUpdate = async (newMode: any) => {
    setLoading(true)
    setMode(newMode)
    await updateSystemMode(newMode)
    setLoading(false)
    alert(`Mode sistem berhasil diubah ke: ${newMode.toUpperCase()}`)
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          System Configuration
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0' }}>
          Atur status ketersediaan web pusat kontrol StorePlay.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {modes.map((m) => {
          const isActive = mode === m.id
          return (
            <div 
              key={m.id} 
              onClick={() => !loading && handleUpdate(m.id)}
              style={{
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '1.5rem', 
                backgroundColor: 'var(--bg-secondary)', 
                borderRadius: 'var(--radius-lg)', 
                border: isActive ? `2px solid ${m.color}` : '1px solid var(--border)',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: (loading && !isActive) ? 0.5 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ padding: '0.85rem', backgroundColor: `${m.color}15`, borderRadius: '12px' }}>
                  <m.icon size={24} color={m.color} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>{m.label}</h4>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{m.desc}</p>
                </div>
              </div>
              
              {isActive && (
                <div style={{ backgroundColor: m.color, color: 'white', padding: '0.4rem', borderRadius: '50%', display: 'flex' }}>
                  <Check size={16} strokeWidth={4} />
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {mode === 'maintenance' && (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '10px', color: '#991b1b', fontSize: '0.85rem', fontWeight: 600, border: '1px solid #fecaca' }}>
          ⚠ Warning: Seluruh pengguna publik akan melihat halaman Maintenance jika mode ini aktif.
        </div>
      )}
    </div>
  )
}
