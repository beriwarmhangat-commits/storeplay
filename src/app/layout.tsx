import type { Metadata } from 'next';
import './globals.css';
import { ShoppingBag, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import AuthNav from '@/components/AuthNav';
import SearchBar from '@/components/SearchBar';

export const metadata: Metadata = {
  title: 'StorePlay - Download APPs',
  description: 'The best place to discover and update your applications.',
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
          <div className="container">
            <Link href="/" className="brand">
              <ShoppingBag size={28} />
              StorePlay
            </Link>
            <SearchBar />
            <div>
              <AuthNav />
            </div>
          </div>
        </nav>
        <main style={{ flex: 1 }}>{children}</main>
        <footer id="main-footer" style={{ marginTop: 'auto', padding: '3rem 0', borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <a href="mailto:animersevrcel@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem' }}>
                <Mail size={18} color="var(--accent)" /> animersevrcel@gmail.com
              </a>
              <a href="https://wa.me/6288986005855" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem' }}>
                <MessageCircle size={18} color="#25D366" /> 088986005855
              </a>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              &copy; {new Date().getFullYear()} <strong>StorePlay</strong>. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
