'use client'

import { deleteApp } from '@/app/dashboard/actions'
import { Trash2 } from 'lucide-react'

export default function DeleteAppForm({ id }: { id: string }) {
  return (
    <form action={deleteApp} onSubmit={(e) => { if(!confirm('Yakin ingin menghapus seluruh aplikasi ini?')) e.preventDefault() }}>
      <input type="hidden" name="app_id" value={id} />
      <button type="submit" className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#fee2e2' }}>
        <Trash2 size={18} /> Hapus App
      </button>
    </form>
  )
}
