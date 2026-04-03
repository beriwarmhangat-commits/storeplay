'use client'

import { Crown, MessageCircle, ShieldCheck, Zap, Infinity } from 'lucide-react'

export default function DeveloperPaywall() {
  return (
    <div className="paywall-container animate-scale-in">
      <div className="paywall-card">
        <div className="p-header">
           <div className="p-icon">
              <Crown size={32} color="#ffffff" />
           </div>
           <h1 className="p-title">Unlock Developer Console</h1>
           <p className="p-subtitle">Elevate your experience and start publishing your own apps to StorePlay today!</p>
        </div>

        <div className="p-features">
           <div className="feature-item">
              <div className="f-icon"><Zap size={20} /></div>
              <div className="f-content">
                 <h4>Satu Kali Bayar (Permanen)</h4>
                 <p>Hanya Rp 100.000 untuk akses seumur hidup tanpa biaya langganan.</p>
              </div>
           </div>
           <div className="feature-item">
              <div className="f-icon"><Infinity size={20} /></div>
              <div className="f-content">
                 <h4>Tanpa Limit Aplikasi</h4>
                 <p>Upload aplikasi sebanyak yang Anda inginkan tanpa batasan jumlah.</p>
              </div>
           </div>
           <div className="feature-item">
              <div className="f-icon"><ShieldCheck size={20} /></div>
              <div className="f-content">
                 <h4>Akun Terverifikasi</h4>
                 <p>Dapatkan badge Developer dan kelola versi aplikasi Anda sendiri.</p>
              </div>
           </div>
        </div>

        <div className="p-pricing">
           <span className="price">Rp 100.000</span>
           <span className="duration">/ Seumur Hidup</span>
        </div>

        <a 
          href="https://wa.me/6288986005855?text=Halo%20Admin,%20saya%20ingin%20upgrade%20akun%20Developer%20StorePlay" 
          target="_blank" 
          className="p-cta"
        >
          <MessageCircle size={20} />
          Hubungi Admin (WhatsApp)
        </a>

        <p className="p-footer">Proses aktivasi biasanya dilakukan dalam 1-24 jam setelah pembayaran.</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .paywall-container {
           display: flex;
           justify-content: center;
           align-items: center;
           padding: 4rem 1.5rem;
           min-height: 80vh;
        }
        .paywall-card {
           background: #ffffff;
           border-radius: 32px;
           max-width: 500px;
           width: 100%;
           padding: 3rem 2.5rem;
           box-shadow: 0 40px 100px -20px rgba(0,0,0,0.15);
           border: 1px solid #eef2f6;
           text-align: center;
        }
        .p-icon {
           width: 72px; height: 72px;
           background: linear-gradient(135deg, #f59e0b, #d97706);
           border-radius: 22px;
           display: flex;
           align-items: center; justify-content: center;
           margin: 0 auto 1.5rem;
           box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.4);
        }
        .p-title { font-size: 2rem; font-weight: 850; color: #1e293b; margin-bottom: 0.75rem; letter-spacing: -0.5px; }
        .p-subtitle { color: #64748b; font-size: 1rem; line-height: 1.6; margin-bottom: 2.5rem; }
        
        .p-features { text-align: left; margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .feature-item { display: flex; gap: 1rem; align-items: flex-start; }
        .f-icon { width: 36px; height: 36px; background: #f0f9ff; color: #0ea5e9; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .f-content h4 { font-size: 0.95rem; font-weight: 700; color: #1e293b; margin-bottom: 0.2rem; }
        .f-content p { font-size: 0.85rem; color: #64748b; line-height: 1.4; }

        .p-pricing { margin-bottom: 2rem; padding: 1rem; background: #f8fafc; border-radius: 16px; border: 1px dashed #cbd5e1; }
        .price { font-size: 1.75rem; font-weight: 800; color: #1e293b; }
        .duration { font-size: 0.9rem; color: #64748b; font-weight: 600; }

        .p-cta {
           display: flex; align-items: center; justify-content: center; gap: 0.75rem;
           background: #25d366; color: white; text-decoration: none;
           padding: 1.1rem; border-radius: 18px; font-weight: 800; font-size: 1.05rem;
           transition: 0.3s;
           box-shadow: 0 10px 20px -5px rgba(37, 211, 102, 0.4);
        }
        .p-cta:hover { background: #1ebe57; transform: translateY(-2px); box-shadow: 0 15px 30px -10px rgba(37, 211, 102, 0.5); }
        .p-cta:active { transform: translateY(0); }

        .p-footer { margin-top: 1.5rem; font-size: 0.8rem; color: #94a3b8; font-weight: 500; }

        @media (max-width: 480px) {
           .paywall-card { padding: 2rem 1.5rem; border-radius: 24px; box-shadow: none; border: none; }
        }
      `}} />
    </div>
  )
}
