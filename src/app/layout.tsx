import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ShoppingBag, Mail, MessageCircle, Home, Search, LayoutGrid, User } from 'lucide-react';
import Link from 'next/link';
import AuthNav from '@/components/AuthNav';
import SearchBar from '@/components/SearchBar';
import SecurityGuard from '@/components/SecurityGuard';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'StorePlay - Premium App Discovery',
  description: 'The premier destination for discovering, downloading, and managing your apps.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar" id="main-navbar">
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" className="brand">
              <ShoppingBag size={32} strokeWidth={2.5} />
              <span>StorePlay</span>
            </Link>
            
            <div className="desktop-only" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <SearchBar />
            </div>
            
            <AuthNav />
          </div>
        </nav>

        <main>{children}</main>

        <footer id="main-footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-grid">
                <div className="footer-brand">
                  <Link href="/" className="brand" style={{ marginBottom: '1rem' }}>
                    <ShoppingBag size={24} /> StorePlay
                  </Link>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '300px' }}>
                    Discover the next generation of applications with our curated marketplace.
                  </p>
                </div>
                
                <div className="footer-contact">
                  <h4 style={{ marginBottom: '1rem' }}>Support</h4>
                  <a href="mailto:animersevrcel@gmail.com" className="footer-link">
                    <Mail size={16} /> animersevrcel@gmail.com
                  </a>
                  <a href="https://wa.me/6288986005855" target="_blank" rel="noopener noreferrer" className="footer-link">
                    <MessageCircle size={16} /> WhatsApp Support
                  </a>
                </div>
              </div>
              
              <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} <strong>StorePlay</strong>. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Navigation */}
        <nav className="mobile-bottom-nav">
          <Link href="/" className="nav-item">
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link href="/my-apps" className="nav-item">
            <LayoutGrid size={20} />
            <span>My Apps</span>
          </Link>
          <Link href="/profile" className="nav-item">
            <User size={20} />
            <span>Profile</span>
          </Link>
        </nav>

        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 768px) {
            .desktop-only { display: none !important; }
            #main-footer { padding-bottom: 7rem; }
          }
          @media (min-width: 769px) {
            .mobile-bottom-nav { display: none !important; }
          }
          #main-footer {
            padding: 4rem 0 2rem;
            background-color: var(--bg-card);
            border-top: 1px solid var(--border-main);
            margin-top: 4rem;
          }
          .footer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
            text-align: left;
          }
          .footer-link {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: var(--text-muted);
            margin-bottom: 0.75rem;
            font-size: 0.9rem;
          }
          .footer-link:hover {
            color: var(--primary);
          }
          .footer-bottom {
            padding-top: 2rem;
            border-top: 1px solid var(--border-main);
            text-align: center;
            color: var(--text-muted);
            font-size: 0.85rem;
          }
        `}} />

        <SecurityGuard />
      </body>
    </html>
  );
}
