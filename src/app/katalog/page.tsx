'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookCard } from '@/components/books/BookCard';
import { GoogleBookCard } from '@/components/books/GoogleBookCard';
import { ImportGoogleBookModal } from '@/components/admin/ImportGoogleBookModal';
import { useLibrary } from '@/context/LibraryContext';
import { BookCategory, GoogleBookVolume } from '@/types';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Check, 
  X, 
  Filter,
  Globe,
  BookOpen,
  Sparkles,
  AlertCircle,
  PlusCircle,
  ExternalLink
} from 'lucide-react';

const CATEGORIES: BookCategory[] = [
  'Semua',
  'Fiksi',
  'Pendidikan',
  'Teknologi',
  'Sejarah',
  'Kesehatan',
  'Psikologi',
  'Bisnis',
  'Lainnya',
];

function KatalogContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('cat') as BookCategory | null;
  const initialQueryParam = searchParams.get('q') || '';
  const initialSourceParam = searchParams.get('source') || '';

  const { books, searchQuery, setSearchQuery } = useLibrary();

  // Mode: 'lokal' (Inventaris Perpustakaan) or 'google' (Eksplorasi Google Books API)
  const [activeTab, setActiveTab] = useState<'lokal' | 'google'>(
    initialSourceParam === 'google' ? 'google' : 'lokal'
  );

  // Local Filter States
  const [activeCategory, setActiveCategory] = useState<string>(
    initialCategoryParam && CATEGORIES.includes(initialCategoryParam) ? initialCategoryParam : 'Semua'
  );
  const [searchTerm, setSearchTerm] = useState<string>(initialQueryParam || searchQuery || '');
  const [selectedStatus, setSelectedStatus] = useState<'Semua' | 'Tersedia' | 'Dipinjam'>('Semua');
  const [selectedLanguage, setSelectedLanguage] = useState<'Semua' | 'Indonesia' | 'Inggris'>('Semua');
  const [yearMin, setYearMin] = useState<number>(1970);
  const [yearMax, setYearMax] = useState<number>(2025);
  const [sortBy, setSortBy] = useState<'terbaru' | 'rating' | 'populer' | 'az'>('terbaru');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Google Books API States
  const [gSearchTerm, setGSearchTerm] = useState<string>(initialQueryParam || 'Teknologi Informasi');
  const [gResults, setGResults] = useState<GoogleBookVolume[]>([]);
  const [gLoading, setGLoading] = useState<boolean>(false);
  const [gError, setGError] = useState<string | null>(null);
  const [gQuotaExceeded, setGQuotaExceeded] = useState<boolean>(false);
  const [gTotalItems, setGTotalItems] = useState<number>(0);
  const [gStartIndex, setGStartIndex] = useState<number>(0);
  const [gOrderBy, setGOrderBy] = useState<'relevance' | 'newest'>('relevance');
  const [gLangRestrict, setGLangRestrict] = useState<string>('id');
  const [gPrintType, setGPrintType] = useState<'books' | 'all'>('books');
  const [importModalVolume, setImportModalVolume] = useState<GoogleBookVolume | null>(null);

  const gPageSize = 12;

  // Debounced search for Google Books
  useEffect(() => {
    if (activeTab !== 'google') return;
    if (!gSearchTerm.trim()) {
      setGResults([]);
      setGTotalItems(0);
      setGError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setGLoading(true);
      setGError(null);
      setGQuotaExceeded(false);

      try {
        const queryParams = new URLSearchParams({
          q: gSearchTerm.trim(),
          maxResults: gPageSize.toString(),
          startIndex: gStartIndex.toString(),
          orderBy: gOrderBy,
          printType: gPrintType,
        });

        if (gLangRestrict) {
          queryParams.set('langRestrict', gLangRestrict);
        }

        const res = await fetch(`/api/books/search?${queryParams.toString()}`);
        const data = await res.json();

        if (data.quotaExceeded) {
          setGQuotaExceeded(true);
          if (data.fallbackItems && data.fallbackItems.length > 0) {
            setGResults(data.fallbackItems);
            setGTotalItems(data.fallbackItems.length);
          } else {
            setGResults([]);
          }
        } else if (!res.ok || !data.success) {
          setGError(data.message || 'Gagal mengambil data dari Google Books.');
          setGResults([]);
        } else {
          setGResults(data.items || []);
          setGTotalItems(data.totalItems || 0);
        }
      } catch (err) {
        setGError('Gangguan jaringan saat menghubungi Google Books API.');
        setGResults([]);
      } finally {
        setGLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [activeTab, gSearchTerm, gStartIndex, gOrderBy, gLangRestrict, gPrintType]);

  const resetFilters = () => {
    setActiveCategory('Semua');
    setSearchTerm('');
    setSelectedStatus('Semua');
    setSelectedLanguage('Semua');
    setYearMin(1970);
    setYearMax(2025);
    setSortBy('terbaru');
    setCurrentPage(1);
    setSearchQuery('');
  };

  // Filtered & Sorted local books
  const filteredLocalBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Search filter
        if (searchTerm.trim() !== '') {
          const q = searchTerm.toLowerCase();
          const matchTitle = book.title.toLowerCase().includes(q);
          const matchAuthor = book.author.toLowerCase().includes(q);
          const matchCat = book.category.toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor && !matchCat) return false;
        }

        // Category filter
        if (activeCategory !== 'Semua') {
          if (activeCategory === 'Lainnya') {
            const standard = ['Fiksi', 'Pendidikan', 'Teknologi', 'Sejarah', 'Kesehatan', 'Psikologi', 'Bisnis'];
            if (standard.includes(book.category)) return false;
          } else if (book.category !== activeCategory) {
            return false;
          }
        }

        // Status filter
        if (selectedStatus !== 'Semua' && book.status !== selectedStatus) {
          return false;
        }

        // Language filter
        if (selectedLanguage !== 'Semua' && book.language !== selectedLanguage) {
          return false;
        }

        // Year filter
        if (book.publishYear < yearMin || book.publishYear > yearMax) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'populer') return b.borrowCount - a.borrowCount;
        if (sortBy === 'az') return a.title.localeCompare(b.title);
        return b.publishYear - a.publishYear;
      });
  }, [books, searchTerm, activeCategory, selectedStatus, selectedLanguage, yearMin, yearMax, sortBy]);

  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(filteredLocalBooks.length / itemsPerPage));
  const paginatedBooks = filteredLocalBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header & Source Mode Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E6DF]">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#174C3C]">
              Katalog & Penemuan Buku
            </h1>
            <p className="text-sm text-[#777D77] mt-1">
              Jelajahi koleksi fisik perpustakaan atau temukan jutaan buku dunia via Google Books API.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-white border border-[#E5E6DF] shadow-xs self-start md:self-auto">
            <button
              onClick={() => setActiveTab('lokal')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'lokal'
                  ? 'bg-[#174C3C] text-white shadow-xs'
                  : 'text-[#252925] hover:text-[#174C3C]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Koleksi Perpustakaan ({books.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('google');
                if (!gSearchTerm) setGSearchTerm('Sains dan Teknologi');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'google'
                  ? 'bg-[#174C3C] text-white shadow-xs'
                  : 'text-[#252925] hover:text-[#174C3C]'
              }`}
            >
              <Globe className="w-4 h-4 text-[#A8B9A4]" />
              <span>Eksplorasi Google Books</span>
            </button>
          </div>
        </div>

        {/* TAB 1: KOLEKSI RESMI PERPUSTAKAAN */}
        {activeTab === 'lokal' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            
            {/* DESKTOP SIDEBAR FILTER */}
            <aside className="hidden lg:block lg:col-span-3 space-y-6">
              <div className="bg-white p-5 rounded-xl border border-[#E5E6DF] shadow-card space-y-6">
                
                <div className="flex items-center justify-between border-b border-[#E5E6DF] pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#252925] flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#174C3C]" />
                    <span>Filter Rak</span>
                  </h3>
                  <button
                    onClick={resetFilters}
                    className="text-xs text-[#777D77] hover:text-[#174C3C] flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Kategori Filter */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#252925] mb-2.5">
                    Kategori
                  </label>
                  <div className="space-y-1.5">
                    {CATEGORIES.map((cat) => {
                      const isChecked = activeCategory === cat;
                      return (
                        <label
                          key={cat}
                          className="flex items-center justify-between py-1 text-xs text-[#252925] hover:text-[#174C3C] cursor-pointer group select-none"
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="category"
                              checked={isChecked}
                              onChange={() => {
                                setActiveCategory(cat);
                                setCurrentPage(1);
                              }}
                              className="rounded-full text-[#174C3C] border-[#A8B9A4] focus:ring-[#174C3C] w-3.5 h-3.5"
                            />
                            <span className={isChecked ? 'font-semibold text-[#174C3C]' : ''}>
                              {cat}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Tahun Terbit Filter */}
                <div className="border-t border-[#E5E6DF] pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#252925]">
                      Tahun Terbit
                    </label>
                    <span className="text-[11px] font-mono text-[#777D77]">
                      {yearMin} – {yearMax}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1970"
                      max="2025"
                      step="5"
                      value={yearMin}
                      onChange={(e) => {
                        setYearMin(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="w-full accent-[#174C3C] h-1.5 bg-[#E7EDE5] rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#777D77]">
                      <span>1970</span>
                      <span>2025</span>
                    </div>
                  </div>
                </div>

                {/* Status Ketersediaan */}
                <div className="border-t border-[#E5E6DF] pt-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#252925] mb-2.5">
                    Status Peminjaman
                  </label>
                  <div className="space-y-1.5 text-xs">
                    {['Semua', 'Tersedia', 'Dipinjam'].map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 py-1 text-[#252925] hover:text-[#174C3C] cursor-pointer group select-none"
                      >
                        <input
                          type="radio"
                          name="status"
                          checked={selectedStatus === status}
                          onChange={() => {
                            setSelectedStatus(status as any);
                            setCurrentPage(1);
                          }}
                          className="rounded-full text-[#174C3C] border-[#A8B9A4] focus:ring-[#174C3C] w-3.5 h-3.5"
                        />
                        <span className={selectedStatus === status ? 'font-semibold text-[#174C3C]' : ''}>
                          {status}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Bahasa */}
                <div className="border-t border-[#E5E6DF] pt-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#252925] mb-2.5">
                    Bahasa
                  </label>
                  <div className="space-y-1.5 text-xs">
                    {['Semua', 'Indonesia', 'Inggris'].map((lang) => (
                      <label
                        key={lang}
                        className="flex items-center gap-2 py-1 text-[#252925] hover:text-[#174C3C] cursor-pointer group select-none"
                      >
                        <input
                          type="radio"
                          name="language"
                          checked={selectedLanguage === lang}
                          onChange={() => {
                            setSelectedLanguage(lang as any);
                            setCurrentPage(1);
                          }}
                          className="rounded-full text-[#174C3C] border-[#A8B9A4] focus:ring-[#174C3C] w-3.5 h-3.5"
                        />
                        <span className={selectedLanguage === lang ? 'font-semibold text-[#174C3C]' : ''}>
                          {lang}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={resetFilters}
                  className="w-full py-2.5 rounded-lg border border-[#E5E6DF] bg-[#F7F6F2] text-xs font-semibold text-[#252925] hover:bg-[#E7EDE5] hover:text-[#174C3C] transition-colors"
                >
                  Reset Filter
                </button>

              </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* Search & Sort Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border border-[#E5E6DF] shadow-xs">
                
                {/* Search input */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-[#777D77] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Cari judul, pengarang, topik..."
                    className="w-full pl-9 pr-3 py-1.5 bg-[#F7F6F2] rounded-lg border border-[#E5E6DF] text-xs text-[#252925] focus:outline-none focus:border-[#174C3C]"
                  />
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                  <span className="text-[#777D77]">
                    Menampilkan <strong>{paginatedBooks.length}</strong> dari <strong>{filteredLocalBooks.length}</strong> buku
                  </span>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#F7F6F2] border border-[#E5E6DF] rounded-lg px-2.5 py-1.5 font-medium text-[#252925] focus:outline-none focus:border-[#174C3C]"
                  >
                    <option value="terbaru">Terbaru</option>
                    <option value="rating">Rating Tertinggi</option>
                    <option value="populer">Paling Populer</option>
                    <option value="az">Judul (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Book Grid */}
              {paginatedBooks.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E5E6DF] p-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#252925]">
                    Tidak Ada Buku di Rak Lokal yang Cocok
                  </h3>
                  <p className="text-xs text-[#777D77] max-w-md mx-auto leading-relaxed">
                    Buku yang Anda cari belum tersedia dalam inventaris fisik perpustakaan. Anda dapat menjelajahi Google Books API untuk mencari referensi bibliografi global.
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setGSearchTerm(searchTerm);
                        setActiveTab('google');
                      }}
                      className="px-4 py-2 bg-[#174C3C] text-white text-xs font-semibold rounded-lg hover:bg-[#12382F] flex items-center gap-1.5 shadow-xs"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Cari di Google Books API &rarr;</span>
                    </button>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 border border-[#E5E6DF] text-xs font-semibold rounded-lg hover:bg-[#F7F6F2]"
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {paginatedBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 pt-8">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="w-9 h-9 rounded-lg border border-[#E5E6DF] bg-white text-[#252925] flex items-center justify-center text-xs hover:border-[#174C3C] disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${
                        currentPage === page
                          ? 'bg-[#174C3C] text-white shadow-xs'
                          : 'bg-white border border-[#E5E6DF] text-[#252925] hover:border-[#174C3C]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="w-9 h-9 rounded-lg border border-[#E5E6DF] bg-white text-[#252925] flex items-center justify-center text-xs hover:border-[#174C3C] disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 2: EKSPLORASI GOOGLE BOOKS API */}
        {activeTab === 'google' && (
          <div className="pt-8 space-y-6">
            
            {/* Google Books Search & Parameters Bar */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E6DF] shadow-xs space-y-4">
              
              <div className="flex flex-col md:flex-row items-center gap-3">
                {/* Search input with live debouncing */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-[#777D77] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={gSearchTerm}
                    onChange={(e) => {
                      setGSearchTerm(e.target.value);
                      setGStartIndex(0);
                    }}
                    placeholder="Ketik judul, pengarang, topik, atau nomor ISBN di Google Books..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F7F6F2] rounded-xl border border-[#E5E6DF] text-xs sm:text-sm text-[#252925] placeholder:text-[#777D77] focus:outline-none focus:border-[#174C3C]"
                  />
                  {gLoading && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-[#174C3C] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* API Quick Parameters */}
                <div className="flex items-center gap-2 w-full md:w-auto text-xs overflow-x-auto pb-1 md:pb-0">
                  {/* Language */}
                  <select
                    value={gLangRestrict}
                    onChange={(e) => {
                      setGLangRestrict(e.target.value);
                      setGStartIndex(0);
                    }}
                    className="px-3 py-2 rounded-lg border border-[#E5E6DF] bg-[#F7F6F2] font-medium text-[#252925] focus:outline-none focus:border-[#174C3C]"
                  >
                    <option value="">Semua Bahasa</option>
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">Bahasa Inggris</option>
                  </select>

                  {/* Order By */}
                  <select
                    value={gOrderBy}
                    onChange={(e) => {
                      setGOrderBy(e.target.value as any);
                      setGStartIndex(0);
                    }}
                    className="px-3 py-2 rounded-lg border border-[#E5E6DF] bg-[#F7F6F2] font-medium text-[#252925] focus:outline-none focus:border-[#174C3C]"
                  >
                    <option value="relevance">Relevansi</option>
                    <option value="newest">Terbitan Terbaru</option>
                  </select>

                  {/* Print Type */}
                  <select
                    value={gPrintType}
                    onChange={(e) => {
                      setGPrintType(e.target.value as any);
                      setGStartIndex(0);
                    }}
                    className="px-3 py-2 rounded-lg border border-[#E5E6DF] bg-[#F7F6F2] font-medium text-[#252925] focus:outline-none focus:border-[#174C3C]"
                  >
                    <option value="books">Buku Saja</option>
                    <option value="all">Semua Tipe</option>
                  </select>
                </div>
              </div>

              {/* Status Indicator & Popular Keywords */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E5E6DF] text-xs text-[#777D77]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Terhubung ke Google Books API v1 (Live Discovery)</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span>Coba:</span>
                  {['Sains', 'Sejarah Indonesia', 'Artificial Intelligence', 'Filsafat', 'Pramoedya'].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setGSearchTerm(item);
                        setGStartIndex(0);
                      }}
                      className="px-2 py-0.5 rounded-md bg-[#F7F6F2] hover:bg-[#E7EDE5] text-[#252925] hover:text-[#174C3C] text-[11px] transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Quota Exceeded Friendly Banner */}
            {gQuotaExceeded && (
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/90 flex items-start gap-3 text-xs text-amber-900 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Batas Kuota Harian Publik Google Books API Tercapai</p>
                  <p className="leading-relaxed text-amber-800">
                    Layanan Google Books publik membatasi jumlah panggilan harian tanpa API key resmi. Sistem PerpusKita secara otomatis mengalihkan penelusuran ke basis data literatur terkurasi agar website tetap berfungsi dengan lancar. Anda juga dapat menambahkan <code>GOOGLE_BOOKS_API_KEY</code> di konfigurasi server untuk akses kuota tinggi tak terbatas.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {gError && !gQuotaExceeded && (
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-xs text-rose-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{gError}</span>
                </div>
                <button
                  onClick={() => setGSearchTerm(gSearchTerm)}
                  className="px-3 py-1 bg-white border border-rose-200 rounded-md font-semibold text-rose-700 hover:bg-rose-100"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {/* Loading Skeletons */}
            {gLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-[#E5E6DF] p-3.5 space-y-3 animate-pulse">
                    <div className="aspect-[3/4.2] w-full rounded-lg bg-[#EFECE3]" />
                    <div className="h-4 bg-[#EFECE3] rounded w-3/4" />
                    <div className="h-3 bg-[#EFECE3] rounded w-1/2" />
                    <div className="h-6 bg-[#EFECE3] rounded mt-2" />
                  </div>
                ))}
              </div>
            )}

            {/* Google Books Results Grid */}
            {!gLoading && gResults.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs text-[#777D77] px-1">
                  <span>
                    Ditemukan sekitar <strong>{gTotalItems.toLocaleString()}</strong> referensi buku di Google Books
                  </span>
                  <span>
                    Menampilkan indeks {gStartIndex + 1} – {gStartIndex + gResults.length}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {gResults.map((volume) => (
                    <GoogleBookCard
                      key={volume.id}
                      volume={volume}
                      onImportClick={(vol) => setImportModalVolume(vol)}
                    />
                  ))}
                </div>

                {/* Google Books Pagination */}
                <div className="flex items-center justify-center gap-3 pt-6 pb-4">
                  <button
                    disabled={gStartIndex === 0 || gLoading}
                    onClick={() => setGStartIndex((prev) => Math.max(0, prev - gPageSize))}
                    className="px-4 py-2 rounded-lg border border-[#E5E6DF] bg-white text-xs font-semibold text-[#252925] hover:border-[#174C3C] disabled:opacity-40 transition-colors flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>

                  <span className="text-xs text-[#777D77] font-mono">
                    Halaman {Math.floor(gStartIndex / gPageSize) + 1}
                  </span>

                  <button
                    disabled={gStartIndex + gPageSize >= gTotalItems || gLoading}
                    onClick={() => setGStartIndex((prev) => prev + gPageSize)}
                    className="px-4 py-2 rounded-lg border border-[#E5E6DF] bg-white text-xs font-semibold text-[#252925] hover:border-[#174C3C] disabled:opacity-40 transition-colors flex items-center gap-1.5"
                  >
                    <span>Berikutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Empty Search Prompt */}
            {!gLoading && gResults.length === 0 && !gError && !gQuotaExceeded && (
              <div className="bg-white rounded-2xl border border-[#E5E6DF] p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center mx-auto">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#252925]">
                  Eksplorasi Katalog Global Google Books
                </h3>
                <p className="text-xs text-[#777D77] max-w-md mx-auto leading-relaxed">
                  Masukkan judul buku, topik studi, atau nama penulis pada kolom di atas untuk mencari referensi literatur langsung dari Google Books API.
                </p>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Admin Import Modal */}
      <ImportGoogleBookModal
        volume={importModalVolume}
        isOpen={!!importModalVolume}
        onClose={() => setImportModalVolume(null)}
      />

      <Footer />
    </div>
  );
}

export default function KatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-[#174C3C] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#777D77]">Memuat katalog perpustakaan...</p>
          </div>
        </div>
      }
    >
      <KatalogContent />
    </Suspense>
  );
}
