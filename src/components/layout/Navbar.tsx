'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLibrary, UserRole } from '@/context/LibraryContext';
import { Logo } from '@/components/ui/Logo';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { 
  Search, 
  Menu, 
  X, 
  BookOpen, 
  User, 
  ShieldCheck, 
  Clock, 
  Heart, 
  LogOut, 
  ChevronDown,
  Sparkles,
  Bell
} from 'lucide-react';
import { NotificationModal } from '@/components/layout/NotificationModal';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdropVariants, modalContentVariants } from '@/lib/motion';

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, switchUserRole, setSearchQuery, books, unreadNotificationsCount } = useLibrary();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [navSearchInput, setNavSearchInput] = useState('');


  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Koleksi', href: '/katalog' },
    { label: 'Layanan', href: '/#layanan' },
    { label: 'Tentang', href: '/#tentang' },
    { label: 'Kontak', href: '/#kontak' },
  ];

  const searchResults = navSearchInput.trim() === '' 
    ? [] 
    : books.filter(b => 
        b.title.toLowerCase().includes(navSearchInput.toLowerCase()) ||
        b.author.toLowerCase().includes(navSearchInput.toLowerCase()) ||
        b.category.toLowerCase().includes(navSearchInput.toLowerCase())
      ).slice(0, 5);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F7F6F2]/90 backdrop-blur-md border-b border-[#E5E6DF] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between gap-4">
          
          {/* Official Brand Logo */}
          <Logo size="md" href="/" />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    active
                      ? 'text-[#174C3C] font-semibold bg-[#E7EDE5]/70 border border-[#A8B9A4]/30'
                      : 'text-[#252925]/80 hover:text-[#174C3C] hover:bg-black/[0.03]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Role Access */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Trigger */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 text-[#777D77] hover:text-[#174C3C] hover:bg-[#E7EDE5]/60 rounded-full transition-colors"
              aria-label="Cari buku"
              title="Cari judul, penulis, topik (Ctrl + K)"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Notification Bell Button */}
            <button
              onClick={() => setNotificationModalOpen(true)}
              className="relative p-2 text-[#777D77] hover:text-[#174C3C] hover:bg-[#E7EDE5]/60 rounded-full transition-colors"
              aria-label="Notifikasi"
              title="Pusat Notifikasi"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#174C3C] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>


            {/* Quick Persona Switcher for Evaluation */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white border border-[#E5E6DF] hover:border-[#A8B9A4] transition-all shadow-sm group"
              >
                <div className="w-7 h-7 rounded-full bg-[#174C3C] text-white text-xs font-semibold flex items-center justify-center">
                  {currentUser.role === 'admin' ? 'AD' : currentUser.role === 'siswa' ? 'SS' : 'TG'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-medium text-[#252925] leading-tight">
                    {currentUser.role === 'admin' ? 'Admin Panel' : currentUser.role === 'siswa' ? 'Siswa' : 'Tamu'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#777D77] group-hover:text-[#174C3C] transition-transform" />
              </button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-[#E5E6DF] shadow-floating p-2 z-50"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-[#E5E6DF]/70 mb-1">
                      <p className="text-xs text-[#777D77]">Masuk sebagai</p>
                      <p className="text-sm font-semibold text-[#174C3C] truncate">{currentUser.name}</p>
                      <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-[#E7EDE5] text-[#174C3C] font-medium">
                        Role: {currentUser.role === 'admin' ? 'Administrator' : currentUser.role === 'siswa' ? 'Anggota Siswa' : 'Pengunjung Tamu'}
                      </span>
                    </div>

                    {/* Navigation based on role */}
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#252925] hover:bg-[#F7F6F2] hover:text-[#174C3C] rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4 text-[#777D77]" />
                        Dashboard Anggota
                      </Link>
                      <Link
                        href="/peminjaman"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#252925] hover:bg-[#F7F6F2] hover:text-[#174C3C] rounded-lg transition-colors"
                      >
                        <Clock className="w-4 h-4 text-[#777D77]" />
                        Riwayat Peminjaman
                      </Link>
                      <Link
                        href="/dashboard/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#252925] hover:bg-[#F7F6F2] hover:text-[#174C3C] rounded-lg transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#174C3C]" />
                        Dashboard Admin
                      </Link>
                    </div>

                    {/* Switch Persona */}
                    <div className="pt-2 border-t border-[#E5E6DF] mt-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#777D77] px-3 py-1">
                        Ganti Tampilan Peran
                      </p>
                      <div className="grid grid-cols-2 gap-1 px-1">
                        <button
                          onClick={() => {
                            switchUserRole('siswa');
                            setUserDropdownOpen(false);
                          }}
                          className={`px-2.5 py-1.5 text-xs rounded-md font-medium text-center transition-colors ${
                            currentUser.role === 'siswa'
                              ? 'bg-[#174C3C] text-white'
                              : 'bg-[#F7F6F2] text-[#252925] hover:bg-[#E7EDE5]'
                          }`}
                        >
                          Siswa
                        </button>
                        <button
                          onClick={() => {
                            switchUserRole('admin');
                            setUserDropdownOpen(false);
                          }}
                          className={`px-2.5 py-1.5 text-xs rounded-md font-medium text-center transition-colors ${
                            currentUser.role === 'admin'
                              ? 'bg-[#174C3C] text-white'
                              : 'bg-[#F7F6F2] text-[#252925] hover:bg-[#E7EDE5]'
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Clerk Authentication Controls matching Section 16 */}
            <div className="hidden sm:flex items-center gap-2">
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-full border border-[#E5E6DF] text-[#252925] hover:border-[#174C3C] hover:text-[#174C3C] transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-1.5 text-xs font-semibold rounded-full bg-[#174C3C] text-white hover:bg-[#12382F] transition-colors shadow-sm"
                >
                  Daftar
                </Link>
              </SignedOut>

              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: 'w-8 h-8 rounded-full border border-[#A8B9A4]/50',
                    },
                  }}
                />
              </SignedIn>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#252925] hover:bg-[#E7EDE5]/60 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden md:hidden border-t border-[#E5E6DF] bg-[#F7F6F2] px-4 pt-3 pb-6"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-[#E7EDE5] text-[#174C3C] font-semibold'
                        : 'text-[#252925] hover:bg-[#ECEEE8]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-[#E5E6DF] my-2" />
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#174C3C] bg-white border border-[#E5E6DF] flex items-center justify-between"
                >
                  <span>Dashboard Siswa</span>
                  <span className="text-xs bg-[#E7EDE5] px-2 py-0.5 rounded text-[#174C3C]">Buka</span>
                </Link>
                <Link
                  href="/dashboard/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[#174C3C] flex items-center justify-between"
                >
                  <span>Dashboard Admin</span>
                  <ShieldCheck className="w-4 h-4 text-[#A8B9A4]" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Search Modal (Search Dialog) */}
      <AnimatePresence>
        {searchModalOpen && (
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSearchModalOpen(false)}
          >
            <motion.div 
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-2xl bg-white rounded-2xl shadow-floating border border-[#E5E6DF] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E5E6DF]">
                <Search className="w-5 h-5 text-[#777D77]" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Cari judul buku, penulis, kategori, atau topik..."
                  value={navSearchInput}
                  onChange={(e) => setNavSearchInput(e.target.value)}
                  className="w-full text-base bg-transparent text-[#252925] placeholder:text-[#777D77] focus:outline-none"
                />
                <button
                  onClick={() => {
                    setSearchModalOpen(false);
                    setNavSearchInput('');
                  }}
                  className="p-1 rounded-md text-[#777D77] hover:text-[#252925] hover:bg-[#F7F6F2]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Results */}
              <div className="max-h-96 overflow-y-auto p-4 bg-[#F7F6F2]/30">
                {navSearchInput.trim() === '' ? (
                  <div className="py-6 text-center text-[#777D77]">
                    <p className="text-sm">Ketik kata kunci untuk mencari di antara koleksi perpustakaan</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-3">
                      {['Atomic Habits', 'Laut Bercerita', 'Bumi Manusia', 'Psikologi', 'Teknologi'].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setNavSearchInput(tag)}
                          className="text-xs px-2.5 py-1 rounded-full bg-white border border-[#E5E6DF] hover:border-[#174C3C] text-[#252925] transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="py-8 text-center text-[#777D77]">
                    <p className="text-sm">Tidak ditemukan buku yang cocok dengan &quot;{navSearchInput}&quot;</p>
                    <Link
                      href={`/katalog?q=${encodeURIComponent(navSearchInput)}`}
                      onClick={() => setSearchModalOpen(false)}
                      className="inline-block mt-3 text-xs font-semibold text-[#174C3C] underline"
                    >
                      Buka katalog lengkap untuk pencarian lebih mendalam
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#777D77] px-2">
                      Hasil Pencarian ({searchResults.length})
                    </p>
                    {searchResults.map((book) => (
                      <Link
                        key={book.id}
                        href={`/katalog/${book.slug}`}
                        onClick={() => setSearchModalOpen(false)}
                        className="flex items-center gap-4 p-3 rounded-xl bg-white border border-[#E5E6DF] hover:border-[#174C3C] hover:shadow-sm transition-all group"
                      >
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded-md shadow-xs shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E7EDE5] text-[#174C3C] font-medium">
                              {book.category}
                            </span>
                            <span className={`text-[11px] font-medium ${book.status === 'Tersedia' ? 'text-[#174C3C]' : 'text-rose-600'}`}>
                              {book.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-[#252925] group-hover:text-[#174C3C] transition-colors truncate mt-1">
                            {book.title}
                          </h4>
                          <p className="text-xs text-[#777D77] truncate">{book.author}</p>
                        </div>
                        <div className="text-xs text-[#777D77] shrink-0 font-medium">
                          ⭐ {book.rating}
                        </div>
                      </Link>
                    ))}
                    <div className="pt-2 flex items-center justify-center gap-4 text-xs font-semibold">
                      <Link
                        href={`/katalog?q=${encodeURIComponent(navSearchInput)}`}
                        onClick={() => setSearchModalOpen(false)}
                        className="text-[#174C3C] hover:underline"
                      >
                        Katalog Perpustakaan →
                      </Link>
                      <span className="text-[#A8B9A4]">•</span>
                      <Link
                        href={`/katalog?q=${encodeURIComponent(navSearchInput)}&source=google`}
                        onClick={() => setSearchModalOpen(false)}
                        className="text-[#174C3C] hover:underline flex items-center gap-1"
                      >
                        <span>Cari di Google Books API</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E7EDE5] text-[#174C3C]">Global</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
      />
    </>
  );
}

