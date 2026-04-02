'use client'

import { deleteAppAdmin } from '@/app/admin/actions'
import { Trash2 } from 'lucide-react'

export default function TakedownAppForm({ appId }: { appId: string }) {
  return (
    <form action={deleteAppAdmin} onSubmit={(e) => { 
      if(!confirm('HAPUS TOTAL APLIKASI BESERTA ISI FILE-NYA DARI SERVER? TINDAKAN INI TIDAK BISA DIBATALKAN!')) {
        e.preventDefault() 
      }
    }}>
      <input type="hidden" name="app_id" value={appId} />
      <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#ef4444' }}>
        <Trash2 size={18} /> Takedown
      </button>
    </form>
  )
}
