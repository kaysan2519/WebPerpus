'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useLibrary } from '@/context/LibraryContext';
import { DigitalCardModal } from '@/components/dashboard/DigitalCardModal';
import { NotificationModal } from '@/components/layout/NotificationModal';
import { BorrowModal } from '@/components/books/BorrowModal';
import { Book } from '@/types';
import { 
  BookOpen, 
  Clock, 
  Heart, 
  MessageSquare, 
  Bell, 
  Search, 
  Settings, 
  Compass, 
  Bookmark, 
  CheckCircle2, 
  AlertTriangle,
  QrCode,
  ShieldCheck,
  ChevronRight,
  Printer,
  Trash2,
  ExternalLink,
  Star,
  User,
  Save,
  Check,
  CreditCard,
  Calendar,
  MapPin
} from 'lucide-react';

export default function MemberDashboardPage() {
  const { 
    currentUser, 
    loans, 
    books, 
    favorites, 
    toggleFavorite,
    renewLoan, 
    returnLoan, 
    reviews,
    deleteReview,
    fines,
    payFine,
    unreadNotificationsCount,
    updateUserProfile,
    showToast
  } = useLibrary();

  const [activeNav, setActiveNav] = useState<'beranda' | 'favorit' | 'ulasan' | 'pengaturan'>('beranda');
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [selectedBookForBorrow, setSelectedBookForBorrow] = useState<Book | null>(null);

  // Profile form state
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || '0812-3456-7890');
  const [profileAddress, setProfileAddress] = useState(currentUser.address || 'Jl. Merdeka No. 45, Jakarta Selatan');
  const [emailNotification, setEmailNotification] = useState(true);
  const [waNotification, setWaNotification] = useState(true);

  // Filter user loans
  const userLoans = loans.filter((l) => l.userId === currentUser.id);
  const activeLoans = userLoans.filter((l) => l.status === 'Dipinjam');
  const overdueLoans = userLoans.filter((l) => l.status === 'Terlambat');
  const favoriteBooks = books.filter((b) => favorites.includes(b.id));
  const userReviews = reviews.filter((r) => r.userName === currentUser.name || r.userName.includes('Kaysan') || r.userName.includes('Siswa'));
  const userFines = fines.filter((f) => f.userId === currentUser.id);
  const pendingFines = userFines.filter((f) => f.status === 'Belum Dibayar');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      address: profileAddress,
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex">
      
      {/* SIDEBAR NAVIGATION */}
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
              <span>Koleksi Perpustakaan</span>
            </Link>

            <Link
              href="/peminjaman"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#252925] hover:bg-[#F7F6F2] transition-colors"
            >
              <Clock className="w-4 h-4 text-[#777D77]" />
              <span>Peminjaman</span>
              {activeLoans.length > 0 && (
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-[#E7EDE5] text-[#174C3C] font-semibold">
                  {activeLoans.length}
                </span>
              )}
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
              <span>Buku Favorit</span>
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
              <span className="ml-auto text-[11px] px-1.5 py-0.5 rounded-full bg-[#E5E6DF] text-[#252925]">
                {userReviews.length}
              </span>
            </button>

            <div className="pt-2 border-t border-[#E5E6DF]">
              <button
                onClick={() => setIsNotifModalOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2 text-[#777D77] hover:bg-[#F7F6F2] hover:text-[#174C3C] rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4" />
                  <span>Notifikasi</span>
                </div>
                {unreadNotificationsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#174C3C] text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveNav('pengaturan')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  activeNav === 'pengaturan'
                    ? 'bg-[#E7EDE5] text-[#174C3C] font-semibold'
                    : 'text-[#252925] hover:bg-[#F7F6F2]'
                }`}
              >
                <Settings className="w-4 h-4 text-[#777D77]" />
                <span>Pengaturan Profil</span>
              </button>
            </div>
          </nav>
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="pt-4 border-t border-[#E5E6DF] space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#174C3C] text-white font-semibold flex items-center justify-center text-xs">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#252925] truncate">{currentUser.name}</p>
              <p className="text-[11px] text-[#777D77] truncate">Anggota Siswa • {currentUser.memberId}</p>
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
            <button
              onClick={() => setIsNotifModalOpen(true)}
              className="relative p-2 text-[#777D77] hover:text-[#174C3C] hover:bg-[#F7F6F2] rounded-full transition-colors"
              title="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#174C3C]" />
              )}
            </button>

            <Link
              href="/katalog"
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[#E5E6DF] hover:border-[#174C3C] text-[#174C3C] transition-colors"
            >
              + Cari Buku Baru
            </Link>

            <div className="w-8 h-8 rounded-full bg-[#174C3C] text-white font-semibold flex items-center justify-center text-xs">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-6xl w-full mx-auto space-y-8">
          
          {/* TAB 1: BERANDA */}
          {activeNav === 'beranda' && (
            <>
              {/* Sapaan */}
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#174C3C] flex items-center gap-2">
                  <span>Halo, {currentUser.name.split(' ')[0]}</span>
                  <span className="text-xl">👋</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#777D77] mt-1">
                  Selamat datang kembali di PerpusKita. Terus baca dan kembangkan diri!
                </p>
              </div>

              {/* Unpaid Fine Warning Alert */}
              {pendingFines.length > 0 && (
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-900 animate-in fade-in">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">
                        Anda Memiliki Denda Keterlambatan Belum Dibayar
                      </p>
                      <p className="text-rose-800 mt-0.5">
                        Buku &quot;{pendingFines[0].bookTitle}&quot; terlambat {pendingFines[0].daysOverdue} hari. Total denda: Rp {pendingFines[0].amount.toLocaleString('id-ID')}.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => payFine(pendingFines[0].id)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shrink-0 transition-colors shadow-xs"
                  >
                    Bayar Denda (Rp {pendingFines[0].amount.toLocaleString('id-ID')})
                  </button>
                </div>
              )}

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Stat 1: Buku Dipinjam */}
                <div className="bg-white p-4 rounded-xl border border-[#E5E6DF] shadow-xs flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold font-serif text-[#174C3C]">{activeLoans.length}</div>
                    <div className="text-xs text-[#777D77]">Buku Dipinjam</div>
                  </div>
                </div>

                {/* Stat 2: Terlambat */}
                <div className="bg-white p-4 rounded-xl border border-[#E5E6DF] shadow-xs flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#FEECEB] text-[#C0392B] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold font-serif text-[#C0392B]">{overdueLoans.length}</div>
                    <div className="text-xs text-[#777D77]">Terlambat</div>
                  </div>
                </div>

                {/* Stat 3: Buku Favorit */}
                <div className="bg-white p-4 rounded-xl border border-[#E5E6DF] shadow-xs flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold font-serif text-[#252925]">{favorites.length}</div>
                    <div className="text-xs text-[#777D77]">Buku Favorit</div>
                  </div>
                </div>

                {/* Stat 4: Ulasan */}
                <div className="bg-white p-4 rounded-xl border border-[#E5E6DF] shadow-xs flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold font-serif text-[#252925]">{userReviews.length}</div>
                    <div className="text-xs text-[#777D77]">Ulasan Ditulis</div>
                  </div>
                </div>

              </div>

              {/* SECTION: Buku yang Sedang Dipinjam */}
              <div className="bg-white rounded-2xl border border-[#E5E6DF] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E6DF]">
                  <h2 className="font-serif font-bold text-lg text-[#174C3C]">
                    Buku yang Sedang Dipinjam ({activeLoans.length})
                  </h2>
                  <Link
                    href="/peminjaman"
                    className="text-xs font-semibold text-[#174C3C] hover:text-[#12382F] flex items-center gap-1"
                  >
                    <span>Lihat Semua Riwayat</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {activeLoans.length === 0 ? (
                  <div className="py-8 text-center text-[#777D77] space-y-2">
                    <BookOpen className="w-8 h-8 text-[#A8B9A4] mx-auto" />
                    <p className="text-sm font-medium text-[#252925]">Tidak ada buku yang sedang dipinjam</p>
                    <p className="text-xs">Jelajahi katalog buku untuk meminjam bacaan baru.</p>
                    <Link
                      href="/katalog"
                      className="inline-block mt-2 px-4 py-2 bg-[#174C3C] text-white text-xs font-semibold rounded-lg hover:bg-[#12382F]"
                    >
                      Buka Katalog Koleksi
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E5E6DF]">
                    {activeLoans.map((loan) => (
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
                              {loan.renewCount > 0 && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E7EDE5] text-[#174C3C] font-semibold">
                                  Perpanjangan {loan.renewCount}x
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => renewLoan(loan.id)}
                            disabled={!loan.renewable}
                            className="px-4 py-2 rounded-lg border border-[#174C3C] text-[#174C3C] hover:bg-[#E7EDE5] text-xs font-semibold disabled:opacity-40 transition-colors"
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
                )}
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
                    <button
                      onClick={() => setIsCardModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Perbesar & Cetak Kartu"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Kartu</span>
                    </button>
                  </div>
                </div>

                {/* Koleksi Favorit Saya */}
                <div className="bg-white p-6 rounded-2xl border border-[#E5E6DF] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E5E6DF]">
                      <h3 className="font-serif font-bold text-base text-[#174C3C]">
                        Buku Favorit Tersimpan ({favoriteBooks.length})
                      </h3>
                      <button
                        onClick={() => setActiveNav('favorit')}
                        className="text-xs font-semibold text-[#174C3C] hover:underline"
                      >
                        Lihat Semua
                      </button>
                    </div>

                    <div className="space-y-3">
                      {favoriteBooks.slice(0, 3).map((fav) => (
                        <div
                          key={fav.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F7F6F2] transition-colors group"
                        >
                          <img
                            src={fav.coverImage}
                            alt={fav.title}
                            className="w-10 h-14 object-cover rounded shadow-xs shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <Link href={`/katalog/${fav.slug}`}>
                              <h4 className="text-xs font-semibold text-[#252925] group-hover:text-[#174C3C] truncate">
                                {fav.title}
                              </h4>
                            </Link>
                            <p className="text-[11px] text-[#777D77] truncate">{fav.author}</p>
                            <span className="text-[10px] text-[#174C3C] bg-[#E7EDE5] px-1.5 py-0.2 rounded font-medium mt-1 inline-block">
                              {fav.category}
                            </span>
                          </div>
                          <Link
                            href={`/katalog/${fav.slug}`}
                            className="p-1 text-[#777D77] hover:text-[#174C3C]"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E5E6DF] mt-3">
                    <button
                      onClick={() => setActiveNav('favorit')}
                      className="w-full block py-2 text-center text-xs font-semibold text-[#174C3C] hover:bg-[#E7EDE5] rounded-lg transition-colors"
                    >
                      Buka Kelola Favorit
                    </button>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* TAB 2: FAVORIT */}
          {activeNav === 'favorit' && (
            <div className="bg-white rounded-2xl border border-[#E5E6DF] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E6DF]">
                <div>
                  <h2 className="font-serif font-bold text-xl text-[#174C3C]">
                    Koleksi Buku Favorit ({favoriteBooks.length})
                  </h2>
                  <p className="text-xs text-[#777D77] mt-0.5">
                    Daftar literatur pilihan yang Anda simpan untuk dipinjam atau dibaca nanti
                  </p>
                </div>

                <Link
                  href="/katalog"
                  className="px-4 py-2 bg-[#174C3C] text-white hover:bg-[#12382F] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Jelajahi Katalog Baru</span>
                </Link>
              </div>

              {favoriteBooks.length === 0 ? (
                <div className="py-16 text-center text-[#777D77] space-y-3">
                  <Bookmark className="w-10 h-10 text-[#A8B9A4] mx-auto" />
                  <h3 className="font-serif font-bold text-base text-[#252925]">
                    Belum Ada Buku di Daftar Favorit
                  </h3>
                  <p className="text-xs max-w-sm mx-auto">
                    Simpan buku favorit Anda dari halaman katalog atau detail buku dengan menekan tombol simpan ke favorit.
                  </p>
                  <Link
                    href="/katalog"
                    className="inline-block mt-2 px-5 py-2.5 bg-[#174C3C] text-white text-xs font-semibold rounded-lg hover:bg-[#12382F]"
                  >
                    Buka Katalog Perpustakaan
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {favoriteBooks.map((book) => (
                    <div
                      key={book.id}
                      className="bg-[#FAF9F6] border border-[#E5E6DF] rounded-xl p-4 flex flex-col justify-between hover:border-[#174C3C] transition-all group"
                    >
                      <div className="flex gap-4">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-16 h-24 object-cover rounded-md shadow-xs shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E7EDE5] text-[#174C3C] font-semibold">
                            {book.category}
                          </span>
                          <Link href={`/katalog/${book.slug}`}>
                            <h3 className="font-semibold text-sm text-[#252925] group-hover:text-[#174C3C] transition-colors truncate mt-1">
                              {book.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-[#777D77] truncate">{book.author}</p>
                          <p className="text-[11px] text-[#174C3C] font-mono mt-1">
                            {book.shelfLocation}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-semibold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{book.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#E5E6DF] mt-3 flex items-center justify-between gap-2">
                        <button
                          onClick={() => toggleFavorite(book.id)}
                          className="text-xs text-[#777D77] hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/katalog/${book.slug}`}
                            className="px-3 py-1.5 border border-[#E5E6DF] bg-white text-[#252925] hover:border-[#174C3C] text-xs font-semibold rounded-lg transition-colors"
                          >
                            Detail
                          </Link>
                          {book.status === 'Tersedia' ? (
                            <button
                              onClick={() => setSelectedBookForBorrow(book)}
                              className="px-3 py-1.5 bg-[#174C3C] text-white hover:bg-[#12382F] text-xs font-semibold rounded-lg transition-colors shadow-xs"
                            >
                              Pinjam
                            </button>
                          ) : (
                            <span className="text-[11px] px-2.5 py-1 rounded bg-[#FEECEB] text-[#C0392B] font-medium">
                              Dipinjam
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ULASAN SAYA */}
          {activeNav === 'ulasan' && (
            <div className="bg-white rounded-2xl border border-[#E5E6DF] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E6DF]">
                <div>
                  <h2 className="font-serif font-bold text-xl text-[#174C3C]">
                    Ulasan & Resensi Saya ({userReviews.length})
                  </h2>
                  <p className="text-xs text-[#777D77] mt-0.5">
                    Kumpulan tanggapan dan penilaian literatur yang telah Anda terbitkan
                  </p>
                </div>
              </div>

              {userReviews.length === 0 ? (
                <div className="py-16 text-center text-[#777D77] space-y-3">
                  <MessageSquare className="w-10 h-10 text-[#A8B9A4] mx-auto" />
                  <h3 className="font-serif font-bold text-base text-[#252925]">
                    Belum Ada Ulasan Ditulis
                  </h3>
                  <p className="text-xs max-w-sm mx-auto">
                    Bagikan ulasan dan resensi Anda pada buku-buku yang telah Anda baca melalui halaman detail buku di katalog.
                  </p>
                  <Link
                    href="/katalog"
                    className="inline-block mt-2 px-5 py-2.5 bg-[#174C3C] text-white text-xs font-semibold rounded-lg hover:bg-[#12382F]"
                  >
                    Buka Katalog Perpustakaan
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-xl border border-[#E5E6DF] bg-[#FAF9F6] space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex text-amber-400">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                          <span className="text-xs text-[#777D77]">• {rev.date}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/katalog/${rev.bookId}`}
                            className="text-xs font-semibold text-[#174C3C] hover:underline flex items-center gap-1"
                          >
                            <span>Lihat Halaman Buku</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => deleteReview(rev.id)}
                            className="p-1 text-[#777D77] hover:text-rose-600 transition-colors"
                            title="Hapus ulasan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[#252925]/90 leading-relaxed bg-white p-3.5 rounded-lg border border-[#E5E6DF]">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PENGATURAN PROFIL */}
          {activeNav === 'pengaturan' && (
            <div className="bg-white rounded-2xl border border-[#E5E6DF] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="pb-4 border-b border-[#E5E6DF]">
                <h2 className="font-serif font-bold text-xl text-[#174C3C]">
                  Pengaturan Akun & Profil Anggota
                </h2>
                <p className="text-xs text-[#777D77] mt-0.5">
                  Perbarui identitas keanggotaan dan preferensi notifikasi perpustakaan Anda
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                
                {/* Profile Card Header Info */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F7F6F2] border border-[#E5E6DF]">
                  <div className="w-14 h-14 rounded-full bg-[#174C3C] text-white text-lg font-bold flex items-center justify-center shrink-0 shadow-xs">
                    {profileName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif font-bold text-base text-[#252925] truncate">
                      {profileName}
                    </h3>
                    <p className="text-xs font-mono text-[#174C3C] font-semibold">
                      Nomor Anggota: {currentUser.memberId}
                    </p>
                    <p className="text-[11px] text-[#777D77] mt-0.5">
                      Status: <span className="text-emerald-700 font-medium">Aktif • Berlaku hingga 2026</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCardModalOpen(true)}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E5E6DF] text-xs font-semibold text-[#174C3C] hover:border-[#174C3C]"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Kartu</span>
                  </button>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#252925] mb-1.5">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E6DF] text-xs sm:text-sm bg-white focus:outline-none focus:border-[#174C3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#252925] mb-1.5">
                      Email Resmi Siswa
                    </label>
                    <input
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E6DF] text-xs sm:text-sm bg-white focus:outline-none focus:border-[#174C3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#252925] mb-1.5">
                      Nomor WhatsApp / Telepon
                    </label>
                    <input
                      type="text"
                      required
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E6DF] text-xs sm:text-sm bg-white focus:outline-none focus:border-[#174C3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#252925] mb-1.5">
                      Nomor Identitas Perpustakaan (KID)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={currentUser.memberId}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E6DF] text-xs sm:text-sm bg-[#F7F6F2] text-[#777D77] cursor-not-allowed font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#252925] mb-1.5">
                      Alamat Domisili
                    </label>
                    <input
                      type="text"
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E6DF] text-xs sm:text-sm bg-white focus:outline-none focus:border-[#174C3C]"
                    />
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="pt-4 border-t border-[#E5E6DF] space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#252925]">
                    Preferensi Notifikasi Sirkulasi
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E6DF] bg-[#FAF9F6] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailNotification}
                        onChange={(e) => setEmailNotification(e.target.checked)}
                        className="rounded text-[#174C3C] focus:ring-[#174C3C] w-4 h-4"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-[#252925] block">Pengingat Jatuh Tempo via Email</span>
                        <span className="text-[#777D77]">Terima notifikasi 3 hari sebelum batas waktu pengembalian buku berakhir</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E6DF] bg-[#FAF9F6] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={waNotification}
                        onChange={(e) => setWaNotification(e.target.checked)}
                        className="rounded text-[#174C3C] focus:ring-[#174C3C] w-4 h-4"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-[#252925] block">Pemberitahuan Buku Baru & Rekomendasi</span>
                        <span className="text-[#777D77]">Dapatkan info kurasi buku terbitan baru dan koleksi populer setiap pekan</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-[#E5E6DF] flex justify-end gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#174C3C] hover:bg-[#12382F] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Profil</span>
                  </button>
                </div>

              </form>
            </div>
          )}

        </main>
      </div>

      {/* Digital Member Card Printable Modal */}
      <DigitalCardModal
        user={currentUser}
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
      />

      {/* Notification Center Modal */}
      <NotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
      />

      {/* Borrow Modal for quick borrow from favorites */}
      {selectedBookForBorrow && (
        <BorrowModal
          book={selectedBookForBorrow}
          isOpen={!!selectedBookForBorrow}
          onClose={() => setSelectedBookForBorrow(null)}
        />
      )}

    </div>
  );
}
