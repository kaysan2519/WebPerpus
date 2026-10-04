'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useLibrary } from '@/context/LibraryContext';
import { LOAN_CHART_DATA } from '@/data/books';
import { GoogleBookVolume, BookCategory, Book, MemberRecord, MemberStatus } from '@/types';
import { ImportGoogleBookModal } from '@/components/admin/ImportGoogleBookModal';
import { BarcodeScannerModal } from '@/components/admin/BarcodeScannerModal';
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
  ExternalLink,
  Edit2,
  Trash2,
  Download,
  Printer,
  Save,
  Check,
  Ban,
  DollarSign,
  Barcode
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { 
    books, 
    loans, 
    activities, 
    currentUser, 
    showToast,
    addBookManual,
    updateBook,
    deleteBook,
    members,
    addMember,
    updateMemberStatus,
    categories,
    addCategory,
    returnLoan,
    fines,
    payFine,
    waiveFine,
    settings,
    updateSettings
  } = useLibrary();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'buku' | 'anggota' | 'kategori' | 'peminjaman' | 'laporan' | 'pengaturan'>('dashboard');
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
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);

  // Manual Add Book Modal
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState<BookCategory>('Teknologi');
  const [newPublisher, setNewPublisher] = useState('Penerbit Nasional');
  const [newPublishYear, setNewPublishYear] = useState<number>(new Date().getFullYear());
  const [newPages, setNewPages] = useState<number>(240);
  const [newIsbn, setNewIsbn] = useState('');
  const [newShelfLocation, setNewShelfLocation] = useState('Rak T-01');
  const [newStockCount, setNewStockCount] = useState<number>(5);
  const [newDescription, setNewDescription] = useState('');

  // Edit Book Modal
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editCategory, setEditCategory] = useState<BookCategory>('Teknologi');
  const [editShelfLocation, setEditShelfLocation] = useState('');
  const [editStockCount, setEditStockCount] = useState<number>(3);

  // Add Member Modal
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberId, setNewMemberId] = useState(`PK-2024-${Math.floor(1000 + Math.random() * 9000)}`);
  const [newMemberPhone, setNewMemberPhone] = useState('0812-');
  const [newMemberAddress, setNewMemberAddress] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'MEMBER' | 'LIBRARIAN'>('MEMBER');

  // Add Category Modal
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState<BookCategory>('Teknologi');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [newCategoryPrefix, setNewCategoryPrefix] = useState('Rak T');

  // Book table filter
  const [bookTableSearch, setBookTableSearch] = useState('');
  const [bookCategoryFilter, setBookCategoryFilter] = useState<string>('Semua');

  // Member table filter
  const [memberSearch, setMemberSearch] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState<string>('Semua');

  // Loan circulation filter
  const [loanStatusFilter, setLoanStatusFilter] = useState<'Semua' | 'Dipinjam' | 'Dikembalikan' | 'Terlambat'>('Semua');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(settings);

  const topBorrowed = [...books].sort((a, b) => b.borrowCount - a.borrowCount).slice(0, 4);

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
    if (!newTitle.trim() || !newAuthor.trim()) return;

    addBookManual({
      title: newTitle.trim(),
      author: newAuthor.trim(),
      category: newCategory,
      publisher: newPublisher.trim() || 'Penerbit PerpusKita',
      publishYear: Number(newPublishYear) || new Date().getFullYear(),
      pages: Number(newPages) || 200,
      isbn: newIsbn.trim() || `978-602-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}-1`,
      shelfLocation: newShelfLocation.trim() || 'Rak Ekspedisi',
      stockCount: Number(newStockCount) || 3,
      description: newDescription.trim() || 'Buku koleksi resmi perpustakaan.',
    });

    setIsAddBookModalOpen(false);
    setNewTitle('');
    setNewAuthor('');
    setNewDescription('');
  };

  const openEditBook = (book: Book) => {
    setEditingBook(book);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditCategory(book.category);
    setEditShelfLocation(book.shelfLocation);
    setEditStockCount(book.stockCount || 3);
  };

  const handleSaveEditBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    updateBook(editingBook.id, {
      title: editTitle,
      author: editAuthor,
      category: editCategory,
      shelfLocation: editShelfLocation,
      stockCount: Number(editStockCount),
    });

    setEditingBook(null);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;

    addMember({
      name: newMemberName.trim(),
      email: newMemberEmail.trim(),
      memberId: newMemberId.trim(),
      role: newMemberRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phone: newMemberPhone.trim(),
      address: newMemberAddress.trim() || 'Jakarta',
      status: 'Aktif',
    });

    setIsAddMemberModalOpen(false);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberId(`PK-2024-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryPrefix.trim()) return;

    addCategory({
      name: newCategoryName,
      description: newCategoryDesc.trim() || `Koleksi buku kategori ${newCategoryName}`,
      shelfPrefix: newCategoryPrefix.trim(),
    });

    setIsAddCategoryModalOpen(false);
    setNewCategoryDesc('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
  };

  // Real CSV Export Function
  const exportToCSV = () => {
    const headers = ['ID Peminjaman', 'Judul Buku', 'Peminjam', 'Tanggal Pinjam', 'Jatuh Tempo', 'Status', 'Denda'];
    const rows = loans.map((loan) => {
      const fine = fines.find((f) => f.loanId === loan.id);
      const fineText = fine ? `Rp ${fine.amount} (${fine.status})` : 'Rp 0';
      return [
        `"${loan.id}"`,
        `"${loan.bookTitle.replace(/"/g, '""')}"`,
        `"${loan.userName.replace(/"/g, '""')}"`,
        `"${loan.borrowDate}"`,
        `"${loan.dueDate}"`,
        `"${loan.status}"`,
        `"${fineText}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laporan-sirkulasi-perpuskita-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Laporan sirkulasi berhasil diekspor ke file CSV!', 'success');
  };

  const filteredBooksTable = books.filter((b) => {
    if (bookCategoryFilter !== 'Semua' && b.category !== bookCategoryFilter) return false;
    if (!bookTableSearch.trim()) return true;
    const q = bookTableSearch.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.shelfLocation.toLowerCase().includes(q);
  });

  const filteredMembers = members.filter((m) => {
    if (memberRoleFilter !== 'Semua' && m.role !== memberRoleFilter) return false;
    if (!memberSearch.trim()) return true;
    const q = memberSearch.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.memberId.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
  });

  const filteredLoans = loans.filter((l) => {
    if (loanStatusFilter !== 'Semua' && l.status !== loanStatusFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex">
      
      {/* ADMIN DEEP FOREST GREEN SIDEBAR */}
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
              <span>Dashboard Utama</span>
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
                  ? 'bg-[#174C3C] text-white font-semibold shadow-xs'
                  : 'text-[#E7EDE5]/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4 text-[#A8B9A4]" />
              <span>Sirkulasi & Pinjaman ({loans.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('anggota')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'anggota'
                  ? 'bg-[#174C3C] text-white font-semibold shadow-xs'
                  : 'text-[#E7EDE5]/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-[#A8B9A4]" />
              <span>Direktori Anggota ({members.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('kategori')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'kategori'
                  ? 'bg-[#174C3C] text-white font-semibold shadow-xs'
                  : 'text-[#E7EDE5]/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FolderTree className="w-4 h-4 text-[#A8B9A4]" />
              <span>Kategori & Rak ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('laporan')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'laporan'
                  ? 'bg-[#174C3C] text-white font-semibold shadow-xs'
                  : 'text-[#E7EDE5]/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-[#A8B9A4]" />
              <span>Laporan & Ekspor</span>
            </button>

            <button
              onClick={() => setActiveTab('pengaturan')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'pengaturan'
                  ? 'bg-[#174C3C] text-white font-semibold shadow-xs'
                  : 'text-[#E7EDE5]/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 text-[#A8B9A4]" />
              <span>Pengaturan Sistem</span>
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
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E5E6DF] px-6 sm:px-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-xl text-[#174C3C] leading-none capitalize">
              {activeTab === 'dashboard' ? 'Dashboard Utama' : 
               activeTab === 'buku' ? 'Manajemen Koleksi Buku' : 
               activeTab === 'anggota' ? 'Direktori Anggota Perpustakaan' :
               activeTab === 'kategori' ? 'Manajemen Kategori & Rak' :
               activeTab === 'peminjaman' ? 'Sirkulasi & Peminjaman' :
               activeTab === 'laporan' ? 'Laporan & Statistik' : 'Pengaturan Sistem'}
            </h1>
            <p className="text-xs text-[#777D77] mt-0.5">
              Panel Kendali Resmi Staf & Pustakawan PerpusKita
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E5E6DF] bg-[#F7F6F2] text-xs text-[#252925] font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#174C3C]" />
              <span>{dateRange}</span>
            </div>

            {/* Barcode & ISBN Scanner Action Button */}
            <button
              onClick={() => setIsBarcodeScannerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#174C3C] text-white text-xs font-semibold hover:bg-[#12382F] transition-all shadow-xs"
              title="Buka simulator scanner barcode / ISBN"
            >
              <Barcode className="w-3.5 h-3.5 text-[#A8B9A4]" />
              <span className="hidden sm:inline">Scanner Barcode</span>
            </button>

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
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <>
              {/* 4 Stat Cards */}
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
                    <div className="text-2xl font-bold font-serif text-[#252925]">{members.length + 3200}</div>
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
                      {loans.filter((l) => l.status === 'Dipinjam').length}
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
                    <div className="text-2xl font-bold font-serif text-rose-600">
                      {loans.filter((l) => l.status === 'Terlambat').length || 1}
                    </div>
                    <div className="text-xs text-[#777D77] font-medium">Terlambat</div>
                  </div>
                </div>

              </div>

              {/* STATISTIK PEMINJAMAN (CHART SECTION) */}
              <div className="bg-white p-6 rounded-2xl border border-[#E5E6DF] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                  <div>
                    <h2 className="font-serif font-bold text-base text-[#174C3C]">
                      Statistik Peminjaman Harian
                    </h2>
                    <p className="text-xs text-[#777D77]">
                      Tren sirkulasi buku harian perpustakaan selama bulan berjalan
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
                      Aktivitas Audit Terbaru
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

          {/* TAB 2: MANAJEMEN BUKU */}
          {activeTab === 'buku' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E6DF] shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E6DF]">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#174C3C]">
                    Katalog Inventaris Resmi ({books.length} Judul)
                  </h2>
                  <p className="text-xs text-[#777D77]">
                    Kelola alokasi rak fisik, stok eksemplar, dan data bibliografi perpustakaan
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#777D77] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari judul, penulis, rak..."
                      value={bookTableSearch}
                      onChange={(e) => setBookTableSearch(e.target.value)}
                      className="pl-9 pr-3 py-1.5 text-xs bg-[#F7F6F2] rounded-lg border border-[#E5E6DF] focus:outline-none focus:border-[#174C3C]"
                    />
                  </div>

                  <select
                    value={bookCategoryFilter}
                    onChange={(e) => setBookCategoryFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-[#F7F6F2] rounded-lg border border-[#E5E6DF] focus:outline-none focus:border-[#174C3C]"
                  >
                    <option value="Semua">Semua Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setIsAddBookModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#174C3C] text-white text-xs font-semibold hover:bg-[#12382F] flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Buku</span>
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
                              <h4 className="font-semibold text-[#252925] truncate max-w-[200px]">
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
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditBook(book)}
                              className="p-1.5 text-[#777D77] hover:text-[#174C3C] hover:bg-[#E7EDE5] rounded transition-colors"
                              title="Edit data buku"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Yakin ingin menghapus buku "${book.title}"?`)) {
                                  deleteBook(book.id);
                                }
                              }}
                              className="p-1.5 text-[#777D77] hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Hapus buku"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <Link
                              href={`/katalog/${book.slug}`}
                              className="px-2 py-1 text-xs text-[#174C3C] hover:bg-[#E7EDE5] rounded font-semibold transition-colors"
                            >
                              Detail
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: SIRKULASI & PEMINJAMAN */}
          {activeTab === 'peminjaman' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E6DF] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E6DF]">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#174C3C]">
                    Meja Sirkulasi Peminjaman & Pengembalian
                  </h2>
                  <p className="text-xs text-[#777D77]">
                    Pantau status jatuh tempo, proses pengembalian, dan penanganan denda anggota
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 text-xs">
                  {(['Semua', 'Dipinjam', 'Dikembalikan', 'Terlambat'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setLoanStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        loanStatusFilter === status
                          ? 'bg-[#174C3C] text-white shadow-xs'
                          : 'bg-[#F7F6F2] text-[#252925] hover:bg-[#E7EDE5]'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loans Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F6F2] border-y border-[#E5E6DF] text-[#777D77] uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Buku Dipinjam</th>
                      <th className="py-3 px-4">Nama Anggota</th>
                      <th className="py-3 px-4">Tanggal Pinjam</th>
                      <th className="py-3 px-4">Batas Jatuh Tempo</th>
                      <th className="py-3 px-4">Status & Denda</th>
                      <th className="py-3 px-4 text-right">Aksi Pustakawan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E6DF]">
                    {filteredLoans.map((loan) => {
                      const fine = fines.find((f) => f.loanId === loan.id);
                      return (
                        <tr key={loan.id} className="hover:bg-[#FAF9F6] transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={loan.bookCover}
                                alt={loan.bookTitle}
                                className="w-8 h-12 object-cover rounded shadow-xs shrink-0"
                              />
                              <div>
                                <h4 className="font-semibold text-[#252925] truncate max-w-[200px]">
                                  {loan.bookTitle}
                                </h4>
                                <p className="text-[#777D77] text-[11px]">{loan.bookAuthor}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-[#252925]">
                            {loan.userName}
                          </td>
                          <td className="py-3.5 px-4 text-[#777D77]">
                            {loan.borrowDate}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-[#252925]">
                            {loan.dueDate}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  loan.status === 'Dipinjam'
                                    ? 'bg-[#E7EDE5] text-[#174C3C]'
                                    : loan.status === 'Dikembalikan'
                                    ? 'bg-[#F0F4EE] text-[#777D77]'
                                    : 'bg-[#FEECEB] text-[#C0392B]'
                                }`}
                              >
                                {loan.status}
                              </span>
                              {fine && (
                                <p className="text-[10px] text-rose-600 font-medium">
                                  Denda: Rp {fine.amount.toLocaleString('id-ID')} ({fine.status})
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {loan.status === 'Dipinjam' && (
                                <button
                                  onClick={() => returnLoan(loan.id)}
                                  className="px-3 py-1 bg-[#174C3C] text-white rounded-lg text-xs font-semibold hover:bg-[#12382F] transition-colors"
                                >
                                  Proses Kembali
                                </button>
                              )}
                              {fine && fine.status === 'Belum Dibayar' && (
                                <>
                                  <button
                                    onClick={() => payFine(fine.id)}
                                    className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-semibold hover:bg-emerald-700"
                                    title="Tandai denda lunas"
                                  >
                                    Lunas
                                  </button>
                                  <button
                                    onClick={() => waiveFine(fine.id)}
                                    className="px-2.5 py-1 border border-[#E5E6DF] bg-white text-[#777D77] rounded-lg text-[11px] hover:text-[#174C3C]"
                                    title="Bebaskan denda"
                                  >
                                    Bebaskan
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: DIREKTORI ANGGOTA */}
          {activeTab === 'anggota' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E6DF] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E6DF]">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#174C3C]">
                    Direktori Anggota & Staf Perpustakaan ({members.length})
                  </h2>
                  <p className="text-xs text-[#777D77]">
                    Kelola data identitas anggota resmi, kartu perpustakaan, dan status akses
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#777D77] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama, ID, email..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="pl-9 pr-3 py-1.5 text-xs bg-[#F7F6F2] rounded-lg border border-[#E5E6DF] focus:outline-none focus:border-[#174C3C]"
                    />
                  </div>

                  <select
                    value={memberRoleFilter}
                    onChange={(e) => setMemberRoleFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-[#F7F6F2] rounded-lg border border-[#E5E6DF] focus:outline-none focus:border-[#174C3C]"
                  >
                    <option value="Semua">Semua Peran</option>
                    <option value="MEMBER">Anggota Siswa</option>
                    <option value="LIBRARIAN">Pustakawan</option>
                    <option value="ADMIN">Administrator</option>
                  </select>

                  <button
                    onClick={() => setIsAddMemberModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#174C3C] text-white text-xs font-semibold hover:bg-[#12382F] flex items-center gap-1.5 shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Daftar Anggota</span>
                  </button>
                </div>
              </div>

              {/* Members Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F6F2] border-y border-[#E5E6DF] text-[#777D77] uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Nama & Email</th>
                      <th className="py-3 px-4">ID Anggota</th>
                      <th className="py-3 px-4">Peran</th>
                      <th className="py-3 px-4">Pinjaman Aktif</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Kelola Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E6DF]">
                    {filteredMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-[#FAF9F6] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={m.avatar}
                              alt={m.name}
                              className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#E5E6DF]"
                            />
                            <div>
                              <p className="font-semibold text-[#252925]">{m.name}</p>
                              <p className="text-[11px] text-[#777D77]">{m.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-[#174C3C]">
                          {m.memberId}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            m.role === 'ADMIN' ? 'bg-amber-100 text-amber-900' :
                            m.role === 'LIBRARIAN' ? 'bg-indigo-100 text-indigo-900' :
                            'bg-[#E7EDE5] text-[#174C3C]'
                          }`}>
                            {m.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#252925]">
                          {m.activeLoansCount} buku
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            m.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700' :
                            m.status === 'Nonaktif' ? 'bg-gray-100 text-gray-700' :
                            'bg-rose-50 text-rose-700'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {m.status !== 'Aktif' ? (
                              <button
                                onClick={() => updateMemberStatus(m.id, 'Aktif')}
                                className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded hover:bg-emerald-100"
                              >
                                Aktifkan
                              </button>
                            ) : (
                              <button
                                onClick={() => updateMemberStatus(m.id, 'Nonaktif')}
                                className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 rounded hover:bg-rose-100"
                              >
                                Nonaktifkan
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: KATEGORI & RAK */}
          {activeTab === 'kategori' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E6DF] shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E6DF]">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#174C3C]">
                    Manajemen Kategori & Alokasi Rak Fisik ({categories.length})
                  </h2>
                  <p className="text-xs text-[#777D77]">
                    Pemetaan kode rak fisik perpustakaan untuk memudahkan pencarian literatur
                  </p>
                </div>

                <button
                  onClick={() => setIsAddCategoryModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#174C3C] text-white text-xs font-semibold hover:bg-[#12382F] flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Kategori Baru</span>
                </button>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-5 rounded-xl border border-[#E5E6DF] bg-[#FAF9F6] flex flex-col justify-between space-y-3 hover:border-[#174C3C] transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#174C3C] text-white">
                          {cat.shelfPrefix}
                        </span>
                        <span className="text-xs font-medium text-[#777D77]">
                          {cat.bookCount} Koleksi
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#174C3C]">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-[#777D77] mt-1 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E5E6DF] flex items-center justify-between text-xs">
                      <span className="text-[#777D77]">Prefix: <strong>{cat.shelfPrefix}-01 s/d 99</strong></span>
                      <Link
                        href={`/katalog?cat=${encodeURIComponent(cat.name)}`}
                        className="text-[#174C3C] font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>Lihat Buku</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: LAPORAN & EKSPOR */}
          {activeTab === 'laporan' && (
            <div className="space-y-6">
              
              {/* Report Header Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E6DF] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif font-bold text-xl text-[#174C3C]">
                    Laporan Rekapitulasi Sirkulasi Perpustakaan
                  </h2>
                  <p className="text-xs text-[#777D77] mt-1">
                    Periode: September 2024 • Menampilkan performa sirkulasi peminjaman, keterlambatan, dan denda
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-2 rounded-lg bg-[#174C3C] text-white text-xs font-semibold hover:bg-[#12382F] flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor CSV / Excel</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-2 rounded-lg border border-[#E5E6DF] bg-white text-[#252925] text-xs font-semibold hover:border-[#174C3C] flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Laporan</span>
                  </button>
                </div>
              </div>

              {/* Key Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-[#E5E6DF] shadow-xs">
                  <span className="text-xs text-[#777D77] uppercase font-semibold">Total Peminjaman Bulan Ini</span>
                  <div className="text-2xl font-serif font-bold text-[#174C3C] mt-1">456 Transaksi</div>
                  <span className="text-[11px] text-emerald-600 font-medium">↑ 12% dari bulan Agustus</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-[#E5E6DF] shadow-xs">
                  <span className="text-xs text-[#777D77] uppercase font-semibold">Tingkat Pengembalian Tepat Waktu</span>
                  <div className="text-2xl font-serif font-bold text-[#252925] mt-1">94.8%</div>
                  <span className="text-[11px] text-emerald-600 font-medium">Memenuhi target mutu perpustakaan (&gt;90%)</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-[#E5E6DF] shadow-xs">
                  <span className="text-xs text-[#777D77] uppercase font-semibold">Total Denda Terkumpul</span>
                  <div className="text-2xl font-serif font-bold text-rose-700 mt-1">Rp 148.000</div>
                  <span className="text-[11px] text-[#777D77]">Dialokasikan untuk perawatan buku fisik</span>
                </div>
              </div>

              {/* Circulation Table for Print/Preview */}
              <div className="bg-white p-6 rounded-2xl border border-[#E5E6DF] shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-base text-[#174C3C]">
                  Rincian Transaksi Sirkulasi Terakhir
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F6F2] border-y border-[#E5E6DF] text-[#777D77] uppercase font-semibold text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">No</th>
                        <th className="py-2.5 px-3">Judul Buku</th>
                        <th className="py-2.5 px-3">Peminjam</th>
                        <th className="py-2.5 px-3">Tanggal Pinjam</th>
                        <th className="py-2.5 px-3">Jatuh Tempo</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E6DF]">
                      {loans.slice(0, 10).map((l, index) => (
                        <tr key={l.id}>
                          <td className="py-2.5 px-3 font-mono">{index + 1}</td>
                          <td className="py-2.5 px-3 font-semibold text-[#252925]">{l.bookTitle}</td>
                          <td className="py-2.5 px-3">{l.userName}</td>
                          <td className="py-2.5 px-3 text-[#777D77]">{l.borrowDate}</td>
                          <td className="py-2.5 px-3 text-[#777D77]">{l.dueDate}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E7EDE5] text-[#174C3C]">
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: PENGATURAN SISTEM */}
          {activeTab === 'pengaturan' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E6DF] shadow-xs space-y-6">
              <div className="pb-4 border-b border-[#E5E6DF]">
                <h2 className="font-serif font-bold text-xl text-[#174C3C]">
                  Konfigurasi Kebijakan & Sistem Perpustakaan
                </h2>
                <p className="text-xs text-[#777D77] mt-0.5">
                  Atur parameter sirkulasi otomatis, denda keterlambatan, dan kontak perpustakaan
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#252925] mb-1.5">
                      Nama Resmi Perpustakaan
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.libraryName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, libraryName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E6DF] text-xs sm:text-sm focus:outline-none focus:border-[#174C3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#252925] mb-1.5">
                      Durasi Maksimal Peminjaman (Hari)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="30"
                      value={settingsForm.maxLoanDays}
                      onChange={(e) => setSettingsForm({ ...settingsForm, maxLoanDays: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E6DF] text-xs sm:text-sm focus:outline-none focus:border-[#174C3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#252925] mb-1.5">
                      Batas Maksimal Perpanjangan Mandiri
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="5"
                      value={settingsForm.maxRenewCount}
                      onChange={(e) => setSettingsForm({ ...settingsForm, maxRenewCount: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E6DF] text-xs sm:text-sm focus:outline-none focus:border-[#174C3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#252925] mb-1.5">
                      Tarif Denda Keterlambatan per Hari (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="500"
                      value={settingsForm.finePerDay}
                      onChange={(e) => setSettingsForm({ ...settingsForm, finePerDay: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E6DF] text-xs sm:text-sm focus:outline-none focus:border-[#174C3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#252925] mb-1.5">
                      Jam Pelayanan Perpustakaan
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.openingHours}
                      onChange={(e) => setSettingsForm({ ...settingsForm, openingHours: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E6DF] text-xs sm:text-sm focus:outline-none focus:border-[#174C3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#252925] mb-1.5">
                      Email Layanan Perpustakaan
                    </label>
                    <input
                      type="email"
                      required
                      value={settingsForm.contactEmail}
                      onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E6DF] text-xs sm:text-sm focus:outline-none focus:border-[#174C3C]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#252925] mb-1.5">
                      Alamat Gedung Perpustakaan
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E6DF] text-xs sm:text-sm focus:outline-none focus:border-[#174C3C]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E6DF] flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#174C3C] text-white hover:bg-[#12382F] rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Pengaturan Sistem</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* GOOGLE BOOKS IMPORT DRAWER FOR ADMIN */}
      {isGoogleSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-3xl bg-white rounded-2xl border border-[#E5E6DF] shadow-floating max-h-[90vh] flex flex-col overflow-hidden">
            
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
                </div>
              ) : (
                <div className="space-y-3">
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
                          <h4 className="font-semibold text-xs sm:text-sm text-[#252925] truncate">
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
                            <span>Sudah di Rak</span>
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
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E5E6DF] shadow-floating p-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E6DF]">
              <h3 className="font-serif font-bold text-base text-[#174C3C]">Tambah Buku Manual ke Inventaris</h3>
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
                  placeholder="Misal: Clean Code: Panduan Praktis Agile"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Nama Penulis / Pengarang</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Robert C. Martin"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as BookCategory)}
                    className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs bg-white focus:outline-none focus:border-[#174C3C]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Lokasi Rak Fisik</label>
                  <input
                    type="text"
                    required
                    value={newShelfLocation}
                    onChange={(e) => setNewShelfLocation(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs font-mono focus:outline-none focus:border-[#174C3C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Stok Eksemplar Fisik</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newStockCount}
                    onChange={(e) => setNewStockCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs focus:outline-none focus:border-[#174C3C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Nomor ISBN</label>
                  <input
                    type="text"
                    placeholder="978-602-..."
                    value={newIsbn}
                    onChange={(e) => setNewIsbn(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs font-mono focus:outline-none focus:border-[#174C3C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Ringkasan atau sinopsis buku..."
                  className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs focus:outline-none focus:border-[#174C3C]"
                />
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
                  Simpan ke Inventaris
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E6DF] shadow-floating p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E6DF]">
              <h3 className="font-serif font-bold text-base text-[#174C3C]">Edit Data Buku</h3>
              <button onClick={() => setEditingBook(null)}>
                <X className="w-5 h-5 text-[#777D77]" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBook} className="pt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Judul Buku</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Penulis</label>
                <input
                  type="text"
                  required
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Lokasi Rak</label>
                  <input
                    type="text"
                    required
                    value={editShelfLocation}
                    onChange={(e) => setEditShelfLocation(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs font-mono focus:outline-none focus:border-[#174C3C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Stok Eksemplar</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editStockCount}
                    onChange={(e) => setEditStockCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs focus:outline-none focus:border-[#174C3C]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E6DF] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="px-4 py-2 text-xs font-medium text-[#777D77]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#174C3C] text-white text-xs font-semibold rounded-lg hover:bg-[#12382F]"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E6DF] shadow-floating p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E6DF]">
              <h3 className="font-serif font-bold text-base text-[#174C3C]">Registrasi Anggota Baru</h3>
              <button onClick={() => setIsAddMemberModalOpen(false)}>
                <X className="w-5 h-5 text-[#777D77]" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="pt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Ahmad Zaki"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Email Resmi</label>
                <input
                  type="email"
                  required
                  placeholder="ahmad.zaki@perpus.sch.id"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">ID Anggota</label>
                  <input
                    type="text"
                    required
                    value={newMemberId}
                    onChange={(e) => setNewMemberId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs font-mono focus:outline-none focus:border-[#174C3C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Peran Akses</label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs bg-white focus:outline-none focus:border-[#174C3C]"
                  >
                    <option value="MEMBER">Anggota Siswa</option>
                    <option value="LIBRARIAN">Pustakawan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Nomor Telepon / WA</label>
                <input
                  type="text"
                  required
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <div className="pt-3 border-t border-[#E5E6DF] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#777D77]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#174C3C] text-white text-xs font-semibold rounded-lg hover:bg-[#12382F]"
                >
                  Daftarkan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E6DF] shadow-floating p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E6DF]">
              <h3 className="font-serif font-bold text-base text-[#174C3C]">Tambah Kategori & Rak Baru</h3>
              <button onClick={() => setIsAddCategoryModalOpen(false)}>
                <X className="w-5 h-5 text-[#777D77]" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="pt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Nama Kategori</label>
                <select
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value as BookCategory)}
                  className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs bg-white focus:outline-none focus:border-[#174C3C]"
                >
                  <option value="Teknologi">Teknologi</option>
                  <option value="Fiksi">Fiksi</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Sejarah">Sejarah</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Psikologi">Psikologi</option>
                  <option value="Bisnis">Bisnis</option>
                  <option value="Pengembangan Diri">Pengembangan Diri</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Prefix Kode Rak</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Rak T, Rak A, Rak S"
                  value={newCategoryPrefix}
                  onChange={(e) => setNewCategoryPrefix(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs font-mono focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#252925] mb-1">Deskripsi Ruang Lingkup</label>
                <textarea
                  rows={3}
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="Koleksi buku mengenai..."
                  className="w-full p-2.5 rounded-lg border border-[#E5E6DF] text-xs focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <div className="pt-3 border-t border-[#E5E6DF] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#777D77]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#174C3C] text-white text-xs font-semibold rounded-lg hover:bg-[#12382F]"
                >
                  Simpan Kategori
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

      {/* Barcode & ISBN Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isBarcodeScannerOpen}
        onClose={() => setIsBarcodeScannerOpen(false)}
        onBookSelected={(book) => {
          setIsBarcodeScannerOpen(false);
          setActiveTab('buku');
        }}
        onMemberSelected={(member) => {
          setIsBarcodeScannerOpen(false);
          setActiveTab('anggota');
        }}
      />

    </div>
  );
}
