import { ShieldAlert } from 'lucide-react'

export default function MaintenancePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      textAlign: 'center', 
      backgroundColor: 'var(--bg-primary)', 
      padding: '2rem' 
    }}>
      <div style={{ 
        padding: '2rem', 
        backgroundColor: '#fee2e2', 
        borderRadius: '50%', 
        marginBottom: '2rem',
        boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.1)'
      }}>
        <ShieldAlert size={80} color="#ef4444" />
      </div>
      
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>
        Maintenance <span style={{ color: '#ef4444' }}>In Progress</span>
      </h1>
      
      <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', fontSize: '1.1rem', lineHeight: 1.6 }}>
        StorePlay sedang dalam peningkatan infrastruktur rutin. Kami akan kembali online secepat mungkin dengan fitur yang lebih hebat!
      </p>
      
      <div style={{ marginTop: '3rem', fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', width: '100%', maxWidth: '300px' }}>
        © {new Date().getFullYear()} <strong>StorePlay</strong> • Development Team
      </div>
    </div>
  )
}
