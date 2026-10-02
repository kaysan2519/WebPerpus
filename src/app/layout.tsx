import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter, Manrope, Playfair_Display } from 'next/font/google';
import './globals.css';
import { LibraryProvider } from '@/context/LibraryContext';
import { ToastContainer } from '@/components/ui/ToastContainer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const editorialSerif = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PerpusKita — Perpustakaan Digital Modern & Editorial',
  description: 'Temukan Dunia Baru di Setiap Buku. Ribuan koleksi buku berkualitas, akses mudah, dan layanan modern untuk mendukung perjalanan belajarmu.',
  keywords: ['perpustakaan digital', 'buku online', 'pinjam buku', 'PerpusKita', 'katalog buku', 'literasi digital'],
  authors: [{ name: 'PerpusKita Editorial' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${manrope.variable} ${editorialSerif.variable}`}>
      <body className="min-h-screen bg-[#F7F6F2] text-[#252925] flex flex-col font-sans selection:bg-forest/15 selection:text-forest">
        <ClerkProvider>
          <LibraryProvider>
          {children}
          <ToastContainer />
          </LibraryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}