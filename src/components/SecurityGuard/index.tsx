'use client'

import { useEffect } from 'react'

/**
 * SecurityGuard: Komponen pelindung sisi depan (Client-side Protection).
 * Mencegah Klik Kanan, Inspect Element, Shortcuts Keyboard DevTools, 
 * dan Drag-and-drop kode/aset.
 */
export default function SecurityGuard() {
  useEffect(() => {
    // 1. Mencegah Klik Kanan (Context Menu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Mencegah Shortcuts Keyboard (F12, Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+C)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl + Shift + I (Inspect)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }

      // Ctrl + Shift + J (Console)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
      }

      // Ctrl + U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }

      // Ctrl + Shift + C (Inspect Mobile)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl + S (Save Page)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        return false;
      }
    };

    // 3. Mencegah Drag-and-drop Image/Text
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // 4. Deteksi DevTools Terbuka (Heuristic)
    const checkDevTools = setInterval(() => {
       const threshold = 160;
       if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
          // Jika DevTools terbuka, kita bisa lakukan tindakan (opsional: pengalihan rute)
          // console.clear();
       }
    }, 1000);

    // Pasang Event Listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    // Cleanup saat unmount
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      clearInterval(checkDevTools);
    };
  }, []);

  return (
    <style>{`
      /* Mencegah pemilihan teks (Text Selection) */
      * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }
      
      /* Mengizinkan seleksi di input agar user tetap bisa mengetik */
      input, textarea {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }

      /* Mencegah drag image */
      img {
        pointer-events: none;
        -webkit-user-drag: none;
      }
    `}</style>
  );
}
