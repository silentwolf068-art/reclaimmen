import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header, MobileBottomNav } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SupabaseBanner } from '@/components/SupabaseBanner';

export const metadata: Metadata = {
  title: 'RECLAIM MEN — Take Back Control | Winter Arc 2026',
  description: 'Discipline and accountability platform for men. 92 days of focus, habit mastery, and community support.',
  keywords: ['discipline', 'winter arc', 'accountability', 'mens focus', 'habit tracker', 'no doom scrolling'],
  authors: [{ name: 'RECLAIM MEN Protocol' }]
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#08090d'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#08090d] text-zinc-100 min-h-screen flex flex-col antialiased">
        <SupabaseBanner />
        <Header />
        <main className="flex-1 pb-20 md:pb-12">
          {children}
        </main>
        <MobileBottomNav />
        <Footer />
      </body>
    </html>
  );
}
