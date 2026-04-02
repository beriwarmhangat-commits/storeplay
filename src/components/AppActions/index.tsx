'use client'

import { useState, useEffect } from 'react'
import { Download, Loader2, Trash2, RefreshCw } from 'lucide-react'
import { recordDownloadGlobal } from './actions'

type AppActionsProps = {
  appId: string;
  apkUrl: string;
  versionName: string;
  versionCode: number;
  sizeMb: number;
}

export default function AppActions({ appId, apkUrl, versionName, versionCode, sizeMb }: AppActionsProps) {
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [installedVersionCode, setInstalledVersionCode] = useState<number | null>(null)

  // 🔄 Cek status instalasi lokal (LocalStorage) saat pertama kali buka halaman
  useEffect(() => {
    try {
      const localStore = localStorage.getItem(`installed_${appId}`);
      if (localStore) {
        setInstalledVersionCode(parseInt(localStore));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [appId]);

  const isInstalled = installedVersionCode !== null
  const needsUpdate = isInstalled && versionCode > (installedVersionCode || 0)

  const handleAction = async () => {
    setDownloading(true)
    setProgress(0)
    
    // Simulasi Progress Bar Realtime (2 Detik)
    const duration = 2000;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    let currentProgress = 0;
    const timer = setInterval(async () => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        clearInterval(timer);
        setProgress(100);
        
        // 1. Simpan record versi yang terinstall ke Browser lokal (LocalStorage)
        localStorage.setItem(`installed_${appId}`, versionCode.toString());
        setInstalledVersionCode(versionCode);
        
        // 2. Beri tahu DB (Global Counter) secara anonim
        await recordDownloadGlobal(appId);
        
        // 3. Pemicu Download File APK aslinya
        const link = document.createElement('a');
        link.href = apkUrl;
        link.setAttribute('download', '');
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setDownloading(false);
      } else {
        setProgress(Math.floor(currentProgress));
      }
    }, intervalTime);
  }

  const handleUninstall = () => {
    if (!confirm('Hapus instalasi aplikasi ini di peramban Anda (Uninstall)?')) return;
    localStorage.removeItem(`installed_${appId}`);
    setInstalledVersionCode(null);
  }

  // Tampilan "Mendownload..."
  if (downloading) {
    return (
      <button className="btn btn-primary" disabled style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', position: 'relative', overflow: 'hidden', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress}%`, backgroundColor: 'rgba(255,255,255,0.2)', transition: 'width 0.2s ease' }} />
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 1 }}>
          <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> 
          {needsUpdate ? 'Mengupdate...' : 'Menginstal...'} {progress}%
        </span>
        <span style={{ fontSize: '0.75rem', zIndex: 1, opacity: 0.8 }}>{(sizeMb * (progress / 100)).toFixed(1)} / {sizeMb.toFixed(1)} MB</span>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </button>
    )
  }

  // Tombol "Update" jika ada versi terbaru
  if (needsUpdate) {
    return (
      <button onClick={handleAction} className="btn btn-primary" style={{ backgroundColor: '#10b981', padding: '1rem 3rem', fontSize: '1.1rem', minWidth: '280px' }}>
        <RefreshCw size={20} /> Update v{versionName}
      </button>
    )
  }

  // Tombol "Uninstall" jika sudah terpasang
  if (isInstalled) {
    return (
      <button onClick={handleUninstall} className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#fee2e2', padding: '1rem 3rem', fontSize: '1.1rem', minWidth: '280px' }}>
        <Trash2 size={20} /> Uninstall
      </button>
    )
  }

  // Tombol "Install" (Sedia dari Awal)
  return (
    <button onClick={handleAction} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', minWidth: '280px', cursor: 'pointer' }}>
      <Download size={20} /> Install
    </button>
  )
}
