'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useLibrary } from '@/context/LibraryContext';
import { 
  BookOpen, 
  Clock, 
  Heart, 
  MessageSquare, 
  Bell, 
  Search, 
  Settings, 
  LogOut, 
  Compass, 
  Bookmark, 
  CheckCircle2, 
  AlertTriangle,
  RotateCw,
  QrCode,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export default function MemberDashboardPage() {
  const { 
    currentUser, 
    loans, 
    books, 
    favorites, 
    renewLoan, 
    returnLoan, 
    reviews,
    switchUserRole 
  } = useLibrary();

  const [activeNav, setActiveNav] = useState<'beranda' | 'koleksi' | 'peminjaman' | 'favorit' | 'ulasan' | 'pengaturan'>('beranda');

  // Filter user loans
  const userLoans = loans.filter((l) => l.userId === currentUser.id);
  const activeLoans = userLoans.filter((l) => l.status === 'Dipinjam');
  const overdueLoans = userLoans.filter((l) => l.status === 'Terlambat');
  const favoriteBooks = books.filter((b) => favorites.includes(b.id));

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex">
      
      {/* SIDEBAR NAVIGATION matching mockup */}
      <aside className="w-64 bg-white border-r border-[#E5E6DF] hidden md:flex flex-col justify-between p-5 shrink-0">
        <div className="space-y-6">
          
          {/* Official Brand Logo */}
          <div className="px-2">
            <Logo size="sm" href="/" />
          </div>

          {/* Nav List */}
          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => setActiveNav('beranda')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeNav === 'beranda'
                  ? 'bg-[#E7EDE5] text-[#174C3C] font-semibold'
                  : 'text-[#252925] hover:bg-[#F7F6F2]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#174C3C]" />
              <span>Beranda</span>
            </button>

            <Link
              href="/katalog"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#252925] hover:bg-[#F7F6F2] transition-colors"
            >
              <Compass className="w-4 h-4 text-[#777D77]" />
              <span>Koleksi</span>
            </Link>

            <Link
              href="/peminjaman"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#252925] hover:bg-[#F7F6F2] transition-colors"
            >
              <Clock className="w-4 h-4 text-[#777D77]" />
              <span>Peminjaman</span>
            </Link>

            <button
              onClick={() => setActiveNav('favorit')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeNav === 'favorit'
                  ? 'bg-[#E7EDE5] text-[#174C3C] font-semibold'
                  : 'text-[#252925] hover:bg-[#F7F6F2]'
              }`}
            >
              <Bookmark className="w-4 h-4 text-[#777D77]" />
              <span>Favorit</span>
              <span className="ml-auto text-[11px] px-1.5 py-0.5 rounded-full bg-[#E5E6DF] text-[#252925]">
                {favorites.length}
              </span>
            </button>

            <button
              onClick={() => setActiveNav('ulasan')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeNav === 'ulasan'
                  ? 'bg-[#E7EDE5] text-[#174C3C] font-semibold'
                  : 'text-[#252925] hover:bg-[#F7F6F2]'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-[#777D77]" />
              <span>Ulasan Saya</span>
            </button>

            <div className="pt-2 border-t border-[#E5E6DF]">
              <div className="flex items-center justify-between px-3 py-2 text-[#777D77]">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4" />
                  <span>Notifikasi</span>
                </div>
                <span className="w-5 h-5 rounded-full bg-[#174C3C] text-white text-[10px] font-bold flex items-center justify-center">
                  3
                </span>
              </div>

              <button
                onClick={() => setActiveNav('pengaturan')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  activeNav === 'pengaturan'
                    ? 'bg-[#E7EDE5] text-[#174C3C] font-semibold'
                    : 'text-[#252925] hover:bg-[#F7F6F2]'
                }`}
              >
                <Settings className="w-4 h-4 text-[#777D77]" />
                <span>Pengaturan</span>
              </button>
            </div>
          </nav>
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="pt-4 border-t border-[#E5E6DF] space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#174C3C] text-white font-semibold flex items-center justify-center text-xs">
              SS
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#252925] truncate">{currentUser.name}</p>
              <p className="text-[11px] text-[#777D77] truncate">Anggota Siswa</p>
            </div>
          </div>

          <Link
            href="/dashboard/admin"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[#A8B9A4]/40 bg-[#E7EDE5] text-[#174C3C] text-xs font-semibold hover:bg-[#BCD9CF] transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Lihat Panel Admin</span>
          </Link>
        </div>
      </aside>

      {/* MAIN DASHBOARD CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E5E6DF] px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#174C3C] text-white flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-sm text-[#174C3C]">PerpusKita</span>
            </Link>
            <span className="hidden md:inline-block text-xs font-medium text-[#777D77]">
              Dashboard Anggota / {currentUser.memberId}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/katalog"
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[#E5E6DF] hover:border-[#174C3C] text-[#174C3C] transition-colors"
            >
              + Cari Buku Baru
            </Link>
            <div className="w-8 h-8 rounded-full bg-[#174C3C] text-white font-semibold flex items-center justify-center text-xs">
              SS
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-6xl w-full mx-auto space-y-8">
          
          {/* Sapaan matching mockup */}
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#174C3C] flex items-center gap-2">
              <span>Halo, {currentUser.name.split(' ')[0]}</span>
              <span className="text-xl">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#777D77] mt-1">
              Selamat datang kembali di PerpusKita. Terus baca dan kembangkan diri!
            </p>
          </div>

          {/* 4 Stat Cards matching mockup */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Stat 1: Buku Dipinjam */}
            <div className="bg-white p-4 rounded-xl border border-[#E5E6DF] shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold font-serif text-[#174C3C]">{activeLoans.length + 1}</div>
                <div className="text-xs text-[#777D77]">Buku Dipinjam</div>
              </div>
            </div>

            {/* Stat 2: Terlambat */}
            <div className="bg-white p-4 rounded-xl border border-[#E5E6DF] shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#FEECEB] text-[#C0392B] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold font-serif text-[#C0392B]">{overdueLoans.length || 1}</div>
                <div className="text-xs text-[#777D77]">Terlambat</div>
              </div>
            </div>

            {/* Stat 3: Buku Favorit */}
            <div className="bg-white p-4 rounded-xl border border-[#E5E6DF] shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold font-serif text-[#252925]">{favorites.length + 9}</div>
                <div className="text-xs text-[#777D77]">Buku Favorit</div>
              </div>
            </div>

            {/* Stat 4: Ulasan */}
            <div className="bg-white p-4 rounded-xl border border-[#E5E6DF] shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold font-serif text-[#252925]">28</div>
                <div className="text-xs text-[#777D77]">Ulasan</div>
              </div>
            </div>

          </div>

          {/* SECTION: Buku yang Sedang Dipinjam matching mockup */}
          <div className="bg-white rounded-2xl border border-[#E5E6DF] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E6DF]">
              <h2 className="font-serif font-bold text-lg text-[#174C3C]">
                Buku yang Sedang Dipinjam
              </h2>
              <Link
                href="/peminjaman"
                className="text-xs font-semibold text-[#174C3C] hover:text-[#12382F] flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-[#E5E6DF]">
              {/* Item 1: Laut Bercerita */}
              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80"
                    alt="Laut Bercerita"
                    className="w-12 h-16 object-cover rounded-md shadow-xs shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-sm text-[#252925]">Laut Bercerita</h3>
                    <p className="text-xs text-[#777D77]">Leila S. Chudori</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                      <span className="text-[#777D77]">Dipinjam: 12 Sep 2024</span>
                      <span className="text-[#777D77]">•</span>
                      <span className="text-[#C0392B] font-medium">Jatuh tempo 26 Sep 2024</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => renewLoan('loan-1')}
                    className="px-4 py-2 rounded-lg border border-[#174C3C] text-[#174C3C] hover:bg-[#E7EDE5] text-xs font-semibold transition-colors"
                  >
                    Perpanjang
                  </button>
                  <button
                    onClick={() => returnLoan('loan-1')}
                    className="px-3 py-2 rounded-lg border border-[#E5E6DF] text-[#777D77] hover:text-[#252925] text-xs font-semibold transition-colors"
                  >
                    Kembalikan
                  </button>
                </div>
              </div>

              {/* Item 2: Python untuk Pemula */}
              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=700&q=80"
                    alt="Python untuk Pemula"
                    className="w-12 h-16 object-cover rounded-md shadow-xs shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-sm text-[#252925]">Python untuk Pemula</h3>
                    <p className="text-xs text-[#777D77]">Tim Edukasi</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                      <span className="text-[#777D77]">Dipinjam: 10 Sep 2024</span>
                      <span className="text-[#777D77]">•</span>
                      <span className="text-[#C0392B] font-medium">Jatuh tempo 24 Sep 2024</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => renewLoan('loan-2')}
                    className="px-4 py-2 rounded-lg border border-[#174C3C] text-[#174C3C] hover:bg-[#E7EDE5] text-xs font-semibold transition-colors"
                  >
                    Perpanjang
                  </button>
                  <button
                    onClick={() => returnLoan('loan-2')}
                    className="px-3 py-2 rounded-lg border border-[#E5E6DF] text-[#777D77] hover:text-[#252925] text-xs font-semibold transition-colors"
                  >
                    Kembalikan
                  </button>
                </div>
              </div>

              {/* Dynamic Loans */}
              {activeLoans
                .filter((l) => l.id !== 'loan-1' && l.id !== 'loan-2')
                .map((loan) => (
                  <div key={loan.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={loan.bookCover}
                        alt={loan.bookTitle}
                        className="w-12 h-16 object-cover rounded-md shadow-xs shrink-0"
                      />
                      <div>
                        <h3 className="font-semibold text-sm text-[#252925]">{loan.bookTitle}</h3>
                        <p className="text-xs text-[#777D77]">{loan.bookAuthor}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                          <span className="text-[#777D77]">Dipinjam: {loan.borrowDate}</span>
                          <span className="text-[#777D77]">•</span>
                          <span className="text-[#174C3C] font-medium">Jatuh tempo {loan.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => renewLoan(loan.id)}
                        className="px-4 py-2 rounded-lg border border-[#174C3C] text-[#174C3C] hover:bg-[#E7EDE5] text-xs font-semibold transition-colors"
                      >
                        Perpanjang
                      </button>
                      <button
                        onClick={() => returnLoan(loan.id)}
                        className="px-3 py-2 rounded-lg border border-[#E5E6DF] text-[#777D77] hover:text-[#252925] text-xs font-semibold transition-colors"
                      >
                        Kembalikan
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* TWO COLUMNS: Kartu Anggota Digital + Buku Favorit */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Kartu Anggota Digital */}
            <div className="bg-[#12382F] text-white p-6 rounded-2xl shadow-card relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#174C3C]/40 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#E7EDE5] text-[#12382F] flex items-center justify-center font-bold text-xs">
                      P
                    </div>
                    <span className="font-serif font-semibold tracking-wider text-sm text-[#E7EDE5]">
                      KARTU PERPUSTAKAAN DIGITAL
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-white/20 text-[#E7EDE5] font-mono">
                    VALID 2026
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-[11px] text-[#A8B9A4] uppercase tracking-wider">Nama Anggota</p>
                  <p className="font-serif text-xl font-bold tracking-wide mt-0.5">{currentUser.name}</p>
                  <p className="text-xs font-mono text-[#E7EDE5] mt-1">ID: {currentUser.memberId}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-[#A8B9A4]">
                <div>
                  <span>Status: </span>
                  <strong className="text-white">Anggota Reguler Aktif</strong>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Koleksi Favorit Saya */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E6DF] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E5E6DF]">
                  <h3 className="font-serif font-bold text-base text-[#174C3C]">
                    Buku Favorit Tersimpan ({favoriteBooks.length})
                  </h3>
                  <Link href="/katalog" className="text-xs font-semibold text-[#174C3C] hover:underline">
                    Jelajahi
                  </Link>
                </div>

                <div className="space-y-3">
                  {favoriteBooks.slice(0, 3).map((fav) => (
                    <Link
                      key={fav.id}
                      href={`/katalog/${fav.slug}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F7F6F2] transition-colors group"
                    >
                      <img
                        src={fav.coverImage}
                        alt={fav.title}
                        className="w-10 h-14 object-cover rounded shadow-xs"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-[#252925] group-hover:text-[#174C3C] truncate">
                          {fav.title}
                        </h4>
                        <p className="text-[11px] text-[#777D77] truncate">{fav.author}</p>
                        <span className="text-[10px] text-[#174C3C] bg-[#E7EDE5] px-1.5 py-0.2 rounded font-medium mt-1 inline-block">
                          {fav.category}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#A8B9A4] group-hover:text-[#174C3C]" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E6DF] mt-3">
                <Link
                  href="/katalog"
                  className="w-full block py-2 text-center text-xs font-semibold text-[#174C3C] hover:bg-[#E7EDE5] rounded-lg transition-colors"
                >
                  Tambah Buku ke Favorit
                </Link>
              </div>
            </div>

          </div>

        </main>
      </div>

    </div>
  );
}
