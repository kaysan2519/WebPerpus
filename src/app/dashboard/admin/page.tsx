'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useLibrary } from '@/context/LibraryContext';
import { LOAN_CHART_DATA } from '@/data/books';
import { GoogleBookVolume, BookCategory } from '@/types';
import { ImportGoogleBookModal } from '@/components/admin/ImportGoogleBookModal';
import { BookPlaceholderCover } from '@/components/books/BookPlaceholderCover';
import { 
  BookOpen, 
  Users, 
  Clock, 
  AlertCircle, 
  BarChart3, 
  Calendar, 
  Plus, 
  Filter, 
  Search, 
  ArrowUpRight, 
  CheckCircle2, 
  UserPlus, 
  PlusCircle, 
  TrendingUp, 
  FileText, 
  Settings, 
  FolderTree, 
  ShieldCheck,
  ChevronDown,
  Globe,
  X,
  Layers,
  MapPin,
  ExternalLink
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { books, loans, activities, currentUser, showToast } = useLibrary();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'buku' | 'kategori' | 'anggota' | 'peminjaman' | 'laporan' | 'pengaturan'>('dashboard');
  const [dateRange, setDateRange] = useState('1 Sep 2024 – 30 Sep 2024');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Google Books Search in Admin
  const [isGoogleSearchOpen, setIsGoogleSearchOpen] = useState(false);
  const [adminGQuery, setAdminGQuery] = useState('');
  const [adminGResults, setAdminGResults] = useState<GoogleBookVolume[]>([]);
  const [adminGLoading, setAdminGLoading] = useState(false);
  const [adminGError, setAdminGError] = useState<string | null>(null);
  const [adminGQuotaExceeded, setAdminGQuotaExceeded] = useState(false);
  const [selectedVolumeForImport, setSelectedVolumeForImport] = useState<GoogleBookVolume | null>(null);

  // Manual Add Modal
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState<BookCategory>('Teknologi');

  // Book table filter
  const [bookTableSearch, setBookTableSearch] = useState('');

  const topBorrowed = [...books].sort((a, b) => b.borrowCount - a.borrowCount).slice(0, 3);

  const handleAdminGoogleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminGQuery.trim()) return;

    setAdminGLoading(true);
    setAdminGError(null);
    setAdminGQuotaExceeded(false);

    try {
      const res = await fetch(`/api/books/search?q=${encodeURIComponent(adminGQuery.trim())}&maxResults=10`);
      const data = await res.json();

      if (data.quotaExceeded) {
        setAdminGQuotaExceeded(true);
        if (data.fallbackItems && data.fallbackItems.length > 0) {
          setAdminGResults(data.fallbackItems);
        } else {
          setAdminGResults([]);
        }
      } else if (!res.ok || !data.success) {
        setAdminGError(data.message || 'Gagal mencari di Google Books.');
        setAdminGResults([]);
      } else {
        setAdminGResults(data.items || []);
      }
    } catch (err) {
      setAdminGError('Gangguan jaringan saat menghubungi Google Books API.');
      setAdminGResults([]);
    } finally {
      setAdminGLoading(false);
    }
  };

  const handleAddManualBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    showToast(`Buku "${newTitle}" berhasil ditambahkan ke katalog perpustakaan!`, 'success');
    setIsAddBookModalOpen(false);
    setNewTitle('');
    setNewAuthor('');
  };

  const filteredBooksTable = books.filter((b) => {
    if (!bookTableSearch.trim()) return true;
    const q = bookTableSearch.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.category.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex">
      
      {/* ADMIN DEEP FOREST GREEN SIDEBAR matching mockup */}
      <aside className="w-64 bg-[#12382F] text-white hidden md:flex flex-col justify-between p-5 shrink-0">
        <div className="space-y-6">
          
          {/* Official Admin Brand Logo */}
          <div className="px-2">
            <Logo variant="white" size="sm" href="/" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#174C3C] text-white font-semibold shadow-xs'
                  : 'text-[#E7EDE5]/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-[#A8B9A4]" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('buku')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'buku'
                  ? 'bg-[#174C3C] text-white font-semibold shadow-xs'
                  : 'text-[#E7EDE5]/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#A8B9A4]" />
              <span>Manajemen Buku ({books.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('peminjaman')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'peminjaman'
                  ? 'bg-[#174C3C] text-white font-semibold'
                  : 'text-[#E7EDE5]/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4 text-[#A8B9A4]" />
              <span>Peminjaman ({loans.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('laporan')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'laporan'
                  ? 'bg-[#174C3C] text-white font-semibold'
                  : 'text-[#E7EDE5]/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-[#A8B9A4]" />
              <span>Laporan & Statistik</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Link */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors"
          >
            <span>Tampilan Siswa</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <div className="px-2 text-[11px] text-[#A8B9A4]">
            PerpusKita Engine v2.4 Enterprise
          </div>
        </div>
      </aside>

      {/* ADMIN MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header matching mockup */}
        <header className="h-16 bg-white border-b border-[#E5E6DF] px-6 sm:px-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-xl text-[#174C3C] leading-none">
              {activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'buku' ? 'Manajemen Koleksi Buku' : 'Admin Perpustakaan'}
            </h1>
            <p className="text-xs text-[#777D77] mt-0.5">
              Ringkasan aktivitas dan inventaris perpustakaan Anda
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E5E6DF] bg-[#F7F6F2] text-xs text-[#252925] font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#174C3C]" />
              <span>{dateRange}</span>
            </div>

            {/* Google Books Import Action Button */}
            <button
              onClick={() => setIsGoogleSearchOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E7EDE5] border border-[#A8B9A4]/40 text-[#174C3C] text-xs font-semibold hover:bg-[#BCD9CF] transition-colors"
              title="Cari dan impor buku dari Google Books API"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Impor Google Books</span>
            </button>

            {/* Quick Add Manual Book Button */}
            <button
              onClick={() => setIsAddBookModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#174C3C] text-white text-xs font-semibold hover:bg-[#12382F] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buku Baru</span>
            </button>

            {/* Admin Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#12382F] text-white font-semibold flex items-center justify-center text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* TAB: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <>
              {/* 4 Stat Cards matching mockup */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Stat 1: Total Buku */}
                <div className="bg-white p-5 rounded-xl border border-[#E5E6DF] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-serif text-[#174C3C]">{books.length.toLocaleString()}</div>
                    <div className="text-xs text-[#777D77] font-medium">Total Buku di Rak</div>
                  </div>
                </div>

                {/* Stat 2: Total Anggota */}
                <div className="bg-white p-5 rounded-xl border border-[#E5E6DF] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-serif text-[#252925]">3.200</div>
                    <div className="text-xs text-[#777D77] font-medium">Total Anggota</div>
                  </div>
                </div>

                {/* Stat 3: Peminjaman Aktif */}
                <div className="bg-white p-5 rounded-xl border border-[#E5E6DF] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-serif text-[#252925]">
                      {loans.filter((l) => l.status === 'Dipinjam').length + 120}
                    </div>
                    <div className="text-xs text-[#777D77] font-medium">Peminjaman Aktif</div>
                  </div>
                </div>

                {/* Stat 4: Terlambat */}
                <div className="bg-white p-5 rounded-xl border border-[#E5E6DF] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-serif text-rose-600">18</div>
                    <div className="text-xs text-[#777D77] font-medium">Terlambat</div>
                  </div>
                </div>

              </div>

              {/* STATISTIK PEMINJAMAN (CHART SECTION) */}
              <div className="bg-white p-6 rounded-2xl border border-[#E5E6DF] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                  <div>
                    <h2 className="font-serif font-bold text-base text-[#174C3C]">
                      Statistik Peminjaman
                    </h2>
                    <p className="text-xs text-[#777D77]">
                      Tren sirkulasi buku harian perpustakaan
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-[#F7F6F2] border border-[#E5E6DF] text-[#777D77] font-medium">
                      30 Hari Terakhir
                    </span>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="pt-6 pb-2">
                  <div className="relative h-48 w-full flex items-end justify-between gap-2 sm:gap-3 px-2 border-b border-[#E5E6DF]">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30 text-[10px] text-[#777D77]">
                      <div className="border-b border-[#E5E6DF] w-full flex items-center justify-end pr-1">50</div>
                      <div className="border-b border-[#E5E6DF] w-full flex items-center justify-end pr-1">40</div>
                      <div className="border-b border-[#E5E6DF] w-full flex items-center justify-end pr-1">30</div>
                      <div className="border-b border-[#E5E6DF] w-full flex items-center justify-end pr-1">20</div>
                      <div className="border-b border-[#E5E6DF] w-full flex items-center justify-end pr-1">10</div>
                    </div>

                    {LOAN_CHART_DATA.map((item, index) => {
                      const heightPercent = (item.count / 50) * 100;
                      const isHovered = hoveredBar === index;
                      return (
                        <div
                          key={item.day}
                          onMouseEnter={() => setHoveredBar(index)}
                          onMouseLeave={() => setHoveredBar(null)}
                          className="relative flex-1 flex flex-col items-center group cursor-pointer z-10"
                        >
                          {isHovered && (
                            <div className="absolute -top-10 px-2 py-1 bg-[#12382F] text-white rounded text-[11px] font-mono shadow-md whitespace-nowrap">
                              {item.day}: {item.count} peminjaman
                            </div>
                          )}

                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full max-w-[24px] rounded-t-sm transition-all duration-200 ${
                              isHovered ? 'bg-[#174C3C]' : 'bg-[#BCD9CF] hover:bg-[#A8B9A4]'
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between text-[11px] text-[#777D77] font-mono mt-2 px-1">
                    <span>1 Sep</span>
                    <span>8 Sep</span>
                    <span>15 Sep</span>
                    <span>22 Sep</span>
                    <span>30 Sep</span>
                  </div>
                </div>
              </div>

              {/* TWO COLUMNS: Buku Paling Banyak Dipinjam + Aktivitas Terbaru */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Column */}
                <div className="bg-white p-6 rounded-2xl border border-[#E5E6DF] shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E6DF]">
                    <h3 className="font-serif font-bold text-base text-[#174C3C]">
                      Buku Paling Banyak Dipinjam
                    </h3>
                    <span className="text-xs text-[#777D77]">Bulan ini</span>
                  </div>

                  <div className="space-y-4">
                    {topBorrowed.map((b, index) => (
                      <div key={b.id} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="font-serif font-bold text-sm text-[#777D77] w-4">
                            {index + 1}
                          </span>
                          <img
                            src={b.coverImage}
                            alt={b.title}
                            className="w-10 h-14 object-cover rounded shadow-xs shrink-0"
                          />
                          <div>
                            <h4 className="font-semibold text-xs text-[#252925] truncate max-w-[200px]">
                              {b.title}
                            </h4>
                            <p className="text-[11px] text-[#777D77]">{b.author}</p>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-medium text-[#777D77]">
                          {b.borrowCount} kali
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column */}
                <div className="bg-white p-6 rounded-2xl border border-[#E5E6DF] shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E6DF]">
                    <h3 className="font-serif font-bold text-base text-[#174C3C]">
                      Aktivitas Terbaru
                    </h3>
                    <span className="text-xs text-[#777D77]">Realtime audit feed</span>
                  </div>

                  <div className="space-y-4">
                    {activities.map((act) => (
                      <div key={act.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center shrink-0 mt-0.5">
                          {act.type === 'borrow' ? (
                            <BookOpen className="w-4 h-4" />
                          ) : act.type === 'return' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : act.type === 'register' ? (
                            <UserPlus className="w-4 h-4" />
                          ) : (
                            <PlusCircle className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#252925] leading-snug">
                            {act.text}
                          </p>
                          <p className="text-[11px] text-[#777D77] mt-0.5">{act.timeAgo}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}

          {/* TAB: MANAJEMEN BUKU */}
          {activeTab === 'buku' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E6DF] shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E6DF]">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#174C3C]">
                    Katalog Inventaris Resmi ({books.length} Judul)
                  </h2>
                  <p className="text-xs text-[#777D77]">
                    Kelola alokasi rak fisik, status ketersediaan, dan data bibliografi
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#777D77] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari judul atau pengarang..."
                      value={bookTableSearch}
                      onChange={(e) => setBookTableSearch(e.target.value)}
                      className="pl-9 pr-3 py-1.5 text-xs bg-[#F7F6F2] rounded-lg border border-[#E5E6DF] focus:outline-none focus:border-[#174C3C]"
                    />
                  </div>

                  <button
                    onClick={() => setIsGoogleSearchOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#E7EDE5] text-[#174C3C] text-xs font-semibold hover:bg-[#BCD9CF] flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Impor dari Google</span>
                  </button>
                </div>
              </div>

              {/* Book Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F6F2] border-y border-[#E5E6DF] text-[#777D77] uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Buku & Pengarang</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Lokasi Rak</th>
                      <th className="py-3 px-4">Stok Eksemplar</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E6DF]">
                    {filteredBooksTable.map((book) => (
                      <tr key={book.id} className="hover:bg-[#FAF9F6] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-8 h-12 object-cover rounded shadow-xs shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="font-semibold text-[#252925] truncate max-w-[220px]">
                                {book.title}
                              </h4>
                              <p className="text-[#777D77] text-[11px] truncate">{book.author}</p>
                              {book.isImportedFromGoogle && (
                                <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 font-medium">
                                  Google Books
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#252925]">
                          {book.category}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#174C3C]">
                          {book.shelfLocation}
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          {book.stockCount || 3} unit
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              book.status === 'Tersedia'
                                ? 'bg-[#E7EDE5] text-[#174C3C]'
                                : 'bg-[#FEECEB] text-[#C0392B]'
                            }`}
                          >
                            {book.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/katalog/${book.slug}`}
                            className="px-2.5 py-1 text-xs text-[#174C3C] hover:bg-[#E7EDE5] rounded font-semibold transition-colors"
                          >
                            Detail
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB: PEMINJAMAN */}
          {activeTab === 'peminjaman' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E6DF] shadow-xs space-y-4">
              <h2 className="font-serif font-bold text-lg text-[#174C3C]">
                Data Sirkulasi & Peminjaman Anggota
              </h2>
              <div className="divide-y divide-[#E5E6DF]">
                {loans.map((loan) => (
                  <div key={loan.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-[#252925]">{loan.bookTitle}</p>
                      <p className="text-[11px] text-[#777D77]">Peminjam: {loan.userName} • Batas: {loan.dueDate}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        loan.status === 'Dipinjam'
                          ? 'bg-[#E7EDE5] text-[#174C3C]'
                          : loan.status === 'Dikembalikan'
                          ? 'bg-[#F0F4EE] text-[#777D77]'
                          : 'bg-[#FEECEB] text-[#C0392B]'
                      }`}
                    >
                      {loan.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: LAPORAN */}
          {activeTab === 'laporan' && (
            <div className="bg-white p-8 rounded-2xl border border-[#E5E6DF] shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="font-serif font-bold text-lg text-[#252925]">Laporan Sirkulasi & Pengadaan Buku</h2>
              <p className="text-xs text-[#777D77] max-w-md mx-auto">
                Ekspor laporan berkala sirkulasi peminjaman, tingkat keterlambatan, dan daftar buku baru hasil impor Google Books ke format PDF atau Excel.
              </p>
              <button
                onClick={() => showToast('Laporan berhasil di-generate untuk periode September 2024.', 'success')}
                className="px-5 py-2.5 rounded-lg bg-[#174C3C] text-white text-xs font-semibold hover:bg-[#12382F]"
              >
                Unduh Rekap Laporan Bulanan
              </button>
            </div>
          )}

        </main>
      </div>

      {/* GOOGLE BOOKS IMPORT SEARCH MODAL / DRAWER FOR ADMIN */}
      {isGoogleSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-3xl bg-white rounded-2xl border border-[#E5E6DF] shadow-floating max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E6DF] bg-[#F7F6F2]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#174C3C] text-white flex items-center justify-center">
                  <Globe className="w-4 h-4 text-[#A8B9A4]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#174C3C]">
                    Pencarian & Penemuan Google Books API
                  </h3>
                  <p className="text-xs text-[#777D77]">
                    Cari katalog buku internasional dan impor ke inventaris lokal dengan satu klik
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGoogleSearchOpen(false)}
                className="p-1.5 rounded-lg text-[#777D77] hover:text-[#252925]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input Form */}
            <div className="p-6 border-b border-[#E5E6DF]">
              <form onSubmit={handleAdminGoogleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#777D77] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={adminGQuery}
                    onChange={(e) => setAdminGQuery(e.target.value)}
                    placeholder="Masukkan judul buku, penulis, topik (misal: Kecerdasan Buatan), atau ISBN..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E6DF] text-xs sm:text-sm bg-[#F7F6F2] focus:outline-none focus:border-[#174C3C]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={adminGLoading}
                  className="px-5 py-2.5 bg-[#174C3C] hover:bg-[#12382F] text-white text-xs font-semibold rounded-xl transition-colors shrink-0 disabled:opacity-50"
                >
                  {adminGLoading ? 'Mencari...' : 'Cari di Google'}
                </button>
              </form>

              {/* Status Notice */}
              {adminGQuotaExceeded && (
                <div className="mt-3 p-3 rounded-lg border border-amber-200 bg-amber-50 text-xs text-amber-800 leading-relaxed">
                  <strong>Catatan Kuota:</strong> Kuota harian publik Google Books tercapai. Menampilkan referensi buku terkurasi dari cache lokal sistem.
                </div>
              )}

              {adminGError && !adminGQuotaExceeded && (
                <div className="mt-3 p-3 rounded-lg border border-rose-200 bg-rose-50 text-xs text-rose-800">
                  {adminGError}
                </div>
              )}
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {adminGLoading ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-[#174C3C] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-[#777D77]">Menghubungi Google Books API v1...</p>
                </div>
              ) : adminGResults.length === 0 ? (
                <div className="py-12 text-center text-[#777D77] space-y-2">
                  <BookOpen className="w-8 h-8 mx-auto text-[#A8B9A4]" />
                  <p className="text-sm font-medium text-[#252925]">
                    {adminGQuery ? 'Tidak ada hasil yang ditemukan' : 'Ketik kata kunci di atas untuk mencari buku'}
                  </p>
                  <p className="text-xs max-w-sm mx-auto">
                    Anda dapat mencari berdasarkan judul lengkap, nama pengarang, topik ilmu pengetahuan, atau 13 digit nomor ISBN.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#777D77] mb-2">
                    Hasil Pencarian Google Books ({adminGResults.length} buku)
                  </p>

                  {adminGResults.map((vol) => (
                    <div
                      key={vol.id}
                      className="p-3.5 rounded-xl border border-[#E5E6DF] bg-white hover:border-[#174C3C] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-16 rounded overflow-hidden bg-[#F7F6F2] shrink-0 border border-[#E5E6DF]">
                          {vol.thumbnail ? (
                            <img src={vol.thumbnail} alt={vol.title} className="w-full h-full object-cover" />
                          ) : (
                            <BookPlaceholderCover title={vol.title} author={vol.authors[0]} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#E7EDE5] text-[#174C3C] font-semibold">
                              {vol.categories[0] || 'Umum'}
                            </span>
                            <span className="text-[11px] text-[#777D77]">{vol.publishedDate?.slice(0, 4)}</span>
                          </div>
                          <h4 className="font-semibold text-xs sm:text-sm text-[#252925] truncate mt-1">
                            {vol.title}
                          </h4>
                          <p className="text-xs text-[#777D77] truncate">{vol.authors.join(', ')}</p>
                          <p className="text-[11px] text-[#777D77] font-mono mt-0.5">
                            ISBN: {vol.isbn13 || vol.isbn10 || 'Belum terdata'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {vol.inLocalInventory ? (
                          <span className="px-3 py-1.5 rounded-lg bg-[#E7EDE5] text-[#174C3C] text-xs font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Sudah Ada di Rak</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedVolumeForImport(vol)}
                            className="px-4 py-2 rounded-lg bg-[#174C3C] hover:bg-[#12382F] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>Periksa & Impor</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[#E5E6DF] bg-[#F7F6F2] flex justify-end">
              <button
                onClick={() => setIsGoogleSearchOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#777D77] hover:text-[#252925]"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Manual Book Creation Modal */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E6DF] shadow-floating p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E6DF]">
              <h3 className="font-serif font-bold text-base text-[#174C3C]">Tambah Buku Manual</h3>
              <button onClick={() => setIsAddBookModalOpen(false)}>
                <X className="w-5 h-5 text-[#777D77]" />
              </button>
            </div>

            <form onSubmit={handleAddManualBook} className="pt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Judul Buku</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Penulis</label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Kategori</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as BookCategory)}
                  className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs bg-white focus:outline-none focus:border-[#174C3C]"
                >
                  <option value="Teknologi">Teknologi</option>
                  <option value="Fiksi">Fiksi</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Sejarah">Sejarah</option>
                  <option value="Psikologi">Psikologi</option>
                  <option value="Bisnis">Bisnis</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#E5E6DF] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#777D77]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#174C3C] text-white text-xs font-semibold rounded-lg hover:bg-[#12382F]"
                >
                  Simpan Buku
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      <ImportGoogleBookModal
        volume={selectedVolumeForImport}
        isOpen={!!selectedVolumeForImport}
        onClose={() => setSelectedVolumeForImport(null)}
        onImportSuccess={() => {
          setSelectedVolumeForImport(null);
          setIsGoogleSearchOpen(false);
          setActiveTab('buku');
        }}
      />

    </div>
  );
}
