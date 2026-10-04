'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Bookmark, 
  BookOpen, 
  List, 
  Type, 
  Sun, 
  Moon, 
  BookMarked,
  Share2,
  Check,
  Sparkles
} from 'lucide-react';
import { Book } from '@/types';
import { modalBackdropVariants } from '@/lib/motion';

interface EBookReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    id: string;
    title: string;
    author: string;
    coverImage?: string;
    category?: string;
    pages?: number;
    description?: string;
    publisher?: string;
    publishYear?: number;
    previewLink?: string;
  };
}

type ReaderTheme = 'ivory' | 'sepia' | 'dark' | 'clean';
type FontSize = 'sm' | 'md' | 'lg' | 'xl';
type FontFamily = 'serif' | 'sans' | 'mono';

interface ReaderPage {
  chapterTitle: string;
  subTitle?: string;
  content: string[];
  quote?: string;
  keyTakeaway?: string;
}

export function EBookReaderModal({ isOpen, onClose, book }: EBookReaderModalProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = next, -1 = prev
  const [theme, setTheme] = useState<ReaderTheme>('ivory');
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [fontFamily, setFontFamily] = useState<FontFamily>('serif');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate engaging, context-aware sample pages for this book
  const pages: ReaderPage[] = React.useMemo(() => {
    const desc = book.description || 'Karya literatur berbobot yang menginspirasi pembaca.';
    const sentences = desc.split('. ').filter(Boolean);

    return [
      {
        chapterTitle: 'Prolog & Sambutan Pustakawan',
        subTitle: 'Pengantar Membaca E-Book Digital Perpustakaan',
        content: [
          `Selamat datang di pratinjau digital untuk "${book.title}". Koleksi ini didigitalkan khusus untuk civitas perpustakaan guna memfasilitasi penjelajahan literasi mandiri secara cepat dan nyaman sebelum meminjam edisi fisik.`,
          sentences.slice(0, 2).join('. ') + (sentences.length > 0 ? '.' : ''),
          `Membaca bukan sekadar memindai kata-kata demi kata, melainkan dialog hening antara benak pembaca dengan gagasan sang penulis, ${book.author}. Melalui bab-bab terpilih berikut, Anda diajak menyelami intisari dari gagasan yang ingin diutarakan.`
        ],
        quote: `"${book.title}" adalah salah satu karya penting dalam kategori ${book.category || 'Literatur'}.`,
        keyTakeaway: 'Pratinjau digital ini mencakup intisari bab utama dan kutipan esensial dari buku.'
      },
      {
        chapterTitle: 'Bab 1: Menemukan Landasan & Konsep Awal',
        subTitle: 'Mengapa Topik Ini Menjadi Begitu Signifikan',
        content: [
          sentences.slice(2, 4).join('. ') || `Karya ini menyoroti bagaimana pola pikir dan kebiasaan manusia bekerja di bawah pengaruh lingkungan modern yang serba cepat. Setiap prinsip dibangun atas fondasi riset dan pengalaman langsung yang teruji.`,
          `Ketika kita memulai proses pembelajaran baru, sering kali rintangan terbesar bukanlah ketiadaan bakat atau waktu, melainkan ketiadaan kerangka kerja yang jelas dan bertahap. Penulis menekankan bahwa perubahan berkelanjutan lahir dari komitmen kecil yang dieksekusi secara konsisten tanpa henti.`,
          `Perhatikan bagaimana konsep dasar ini menghubungkan pengalaman individu dengan tujuan jangka panjang yang ingin dicapai. Dalam bab ini kita diajak mengidentifikasi apa yang sebenarnya menjadi penggerak utama keputusan kita.`
        ],
        quote: 'Perubahan besar selalu diawali dengan keputusan kecil yang berulang secara tekun.',
        keyTakeaway: 'Fokus pada pembangunan sistem dan lingkungan yang mendukung, bukan hanya tujuan akhir.'
      },
      {
        chapterTitle: 'Bab 2: Intisari Analisis & Eksplorasi Mendalam',
        subTitle: 'Membedah Dinamika dan Pendekatan Metodologis',
        content: [
          sentences.slice(4, 6).join('. ') || `Penulis menguraikan babak demi babak dengan ketajaman narasi yang menarik. Data historis dipadukan dengan studi kasus aktual, memberikan perspektif yang segar dan tidak menggurui.`,
          `Salah satu argumen kunci yang disajikan di sini adalah bahwa pemahaman kita terhadap suatu fenomena sering kali terdistorsi oleh ilusi kepastian. Dengan membedah lapisan-lapisan asumsi tersebut, kita belajar melihat realitas dengan kejernihan baru.`,
          `Buku ini tidak sekadar memberikan resep instan, melainkan mengajak pembaca melakukan refleksi kritis terhadap praktik sehari-hari, cara berkomunikasi, dan cara memecahkan persoalan yang kompleks.`
        ],
        quote: 'Kejelasan berpikir adalah buah dari keberanian untuk menguji asumsi yang telah lama diyakini.',
        keyTakeaway: 'Setiap argumen didukung oleh studi empiris dan telaah komparatif yang mendalam.'
      },
      {
        chapterTitle: 'Bab 3: Implementasi Praktis & Relevansi Masa Kini',
        subTitle: 'Menerjemahkan Wawasan Teoretis ke dalam Tindakan Nyata',
        content: [
          `Bagaimana pembaca dapat menerapkan gagasan dalam "${book.title}" ke dalam rutinitas kerja, studi, dan kehidupan personal? Di bab ini dipaparkan panduan langkah demi langkah yang dapat langsung diaplikasikan.`,
          `Pertama, mulailah dengan audit kebiasaan sederhana. Catat apa yang memberi energi dan apa yang menguras daya konsentrasi. Kedua, ciptakan pemicu visual yang mempermudah tindakan positif terjadi secara spontan.`,
          `Ketiga, jangan pernah meremehkan kekuatan umpan balik segera. Belajar dari kegagalan kecil sebelum menjadi kekeliruan fatal adalah tanda kebijaksanaan seorang pembelajar sejati.`
        ],
        quote: 'Ilmu tanpa tindakan hanyalah pengetahuan yang membeku; tindakan dengan ilmu adalah transformasi.',
        keyTakeaway: 'Terapkan konsep secara bertahap mulai dari skala mikro sebelum mengekspansinya.'
      },
      {
        chapterTitle: 'Epilog: Refleksi & Ajakan Membaca Lengkap',
        subTitle: 'Koleksi Lengkap Tersedia di Rak Perpustakaan',
        content: [
          `Pratinjau digital untuk "${book.title}" berakhir di halaman ini. Namun, petualangan literasi Anda sesungguhnya baru saja dimulai!`,
          `Koleksi fisik lengkap setebal ${book.pages || 250} halaman telah tersedia di rak layanan perpustakaan kami. Anda dapat langsung menekan tombol "Pinjam Buku" pada halaman katalog untuk mengambil buku fisiknya di meja sirkulasi atau melakukan reservasi jika unit sedang dipinjam.`,
          `Terima kasih telah memanfaatkan fasilitas e-reader perpustakaan digital PerpusKita. Selamat melanjutkan perjalanan membaca Anda!`
        ],
        quote: 'Buku adalah jendela yang menunggu dibuka oleh mereka yang rindu akan pengetahuan.',
        keyTakeaway: 'Pinjam buku edisi lengkap melalui sistem peminjaman sirkulasi perpustakaan kami.'
      }
    ];
  }, [book]);

  const totalPages = pages.length;

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPage();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNextPage, handlePrevPage, onClose]);

  // Reset page when opening new book
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(0);
      setDirection(0);
      setIsTocOpen(false);
    }
  }, [isOpen, book.id]);

  const toggleBookmark = () => {
    if (bookmarkedPages.includes(currentPage)) {
      setBookmarkedPages(bookmarkedPages.filter((p) => p !== currentPage));
    } else {
      setBookmarkedPages([...bookmarkedPages, currentPage]);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Theme styling rules
  const themeStyles = {
    ivory: {
      bg: 'bg-[#FBF8F1]',
      text: 'text-[#2D2926]',
      subtext: 'text-[#696560]',
      border: 'border-[#E7E2D4]',
      cardBg: 'bg-[#F5F0E5]/70',
      accent: 'text-[#174C3C]',
      accentBg: 'bg-[#174C3C]',
      headerBg: 'bg-[#F4EFE6]/95 border-b border-[#E7E2D4]'
    },
    sepia: {
      bg: 'bg-[#F4ECD8]',
      text: 'text-[#433422]',
      subtext: 'text-[#7D6B56]',
      border: 'border-[#E2D5BA]',
      cardBg: 'bg-[#ECE2C9]/80',
      accent: 'text-[#6C4B24]',
      accentBg: 'bg-[#6C4B24]',
      headerBg: 'bg-[#EFE5CE]/95 border-b border-[#E2D5BA]'
    },
    dark: {
      bg: 'bg-[#191A1C]',
      text: 'text-[#E2E4E8]',
      subtext: 'text-[#9CA3AF]',
      border: 'border-[#2D3139]',
      cardBg: 'bg-[#222429]',
      accent: 'text-[#5EEAD4]',
      accentBg: 'bg-[#14B8A6]',
      headerBg: 'bg-[#1E2024]/95 border-b border-[#2D3139]'
    },
    clean: {
      bg: 'bg-white',
      text: 'text-[#1F2937]',
      subtext: 'text-[#6B7280]',
      border: 'border-[#E5E7EB]',
      cardBg: 'bg-[#F9FAFB]',
      accent: 'text-[#174C3C]',
      accentBg: 'bg-[#174C3C]',
      headerBg: 'bg-white/95 border-b border-[#E5E7EB]'
    }
  }[theme];

  const fontClasses = {
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono'
  }[fontFamily];

  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed sm:leading-loose',
    md: 'text-base leading-relaxed sm:leading-loose',
    lg: 'text-lg leading-relaxed sm:leading-loose',
    xl: 'text-xl leading-relaxed sm:leading-loose'
  }[fontSize];

  const pageVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : dir < 0 ? -60 : 0,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 30 },
        opacity: { duration: 0.25 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  const isCurrentBookmarked = bookmarkedPages.includes(currentPage);
  const activePageData = pages[currentPage];
  const progressPercent = Math.round(((currentPage + 1) / totalPages) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md"
        >
          {/* Reader Canvas Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={`w-full h-full sm:h-[94vh] sm:max-w-5xl rounded-none sm:rounded-2xl shadow-floating flex flex-col overflow-hidden transition-colors duration-300 ${themeStyles.bg} ${themeStyles.border} border`}
          >
            {/* Top Toolbar */}
            <header className={`px-4 sm:px-6 py-3 shrink-0 flex items-center justify-between transition-colors duration-300 ${themeStyles.headerBg} backdrop-blur-md z-20`}>
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setIsTocOpen(!isTocOpen)}
                  className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isTocOpen 
                      ? 'bg-[#174C3C] text-white border-[#174C3C]' 
                      : `${themeStyles.text} ${themeStyles.border} hover:opacity-80`
                  }`}
                  title="Daftar Isi Bab"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">Daftar Isi</span>
                </button>

                <div className="min-w-0">
                  <h3 className={`text-sm font-semibold truncate ${themeStyles.text}`}>
                    {book.title}
                  </h3>
                  <p className={`text-xs truncate ${themeStyles.subtext}`}>
                    {book.author} • Bab {currentPage + 1} dari {totalPages}
                  </p>
                </div>
              </div>

              {/* Toolbar Controls Right */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Font Size & Family Dropdown Controls */}
                <div className="hidden md:flex items-center gap-1 border rounded-lg p-0.5 border-current/20">
                  {(['serif', 'sans', 'mono'] as FontFamily[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFontFamily(f)}
                      className={`px-2 py-1 text-xs rounded uppercase font-semibold transition-colors ${
                        fontFamily === f 
                          ? 'bg-[#174C3C] text-white' 
                          : `${themeStyles.text} opacity-70 hover:opacity-100`
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-0.5 border rounded-lg p-0.5 border-current/20">
                  <button
                    onClick={() => {
                      if (fontSize === 'xl') setFontSize('lg');
                      else if (fontSize === 'lg') setFontSize('md');
                      else if (fontSize === 'md') setFontSize('sm');
                    }}
                    disabled={fontSize === 'sm'}
                    className={`px-2 py-1 text-xs font-bold rounded ${themeStyles.text} hover:opacity-80 disabled:opacity-30`}
                    title="Perkecil Font"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => {
                      if (fontSize === 'sm') setFontSize('md');
                      else if (fontSize === 'md') setFontSize('lg');
                      else if (fontSize === 'lg') setFontSize('xl');
                    }}
                    disabled={fontSize === 'xl'}
                    className={`px-2 py-1 text-xs font-bold rounded ${themeStyles.text} hover:opacity-80 disabled:opacity-30`}
                    title="Perbesar Font"
                  >
                    A+
                  </button>
                </div>

                {/* Theme Palette Buttons */}
                <div className="flex items-center gap-1 border rounded-lg p-1 border-current/20">
                  <button
                    onClick={() => setTheme('ivory')}
                    className={`w-5 h-5 rounded-full border bg-[#FBF8F1] transition-transform ${
                      theme === 'ivory' ? 'scale-110 ring-2 ring-[#174C3C]' : 'opacity-70 hover:opacity-100'
                    }`}
                    title="Tema Gading (Warm Ivory)"
                  />
                  <button
                    onClick={() => setTheme('sepia')}
                    className={`w-5 h-5 rounded-full border bg-[#F4ECD8] transition-transform ${
                      theme === 'sepia' ? 'scale-110 ring-2 ring-[#6C4B24]' : 'opacity-70 hover:opacity-100'
                    }`}
                    title="Tema Sepia"
                  />
                  <button
                    onClick={() => setTheme('dark')}
                    className={`w-5 h-5 rounded-full border bg-[#191A1C] transition-transform ${
                      theme === 'dark' ? 'scale-110 ring-2 ring-[#5EEAD4]' : 'opacity-70 hover:opacity-100'
                    }`}
                    title="Tema Malam (Night Mode)"
                  />
                  <button
                    onClick={() => setTheme('clean')}
                    className={`w-5 h-5 rounded-full border bg-white transition-transform ${
                      theme === 'clean' ? 'scale-110 ring-2 ring-gray-400' : 'opacity-70 hover:opacity-100'
                    }`}
                    title="Tema Putih"
                  />
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={toggleBookmark}
                  className={`p-2 rounded-lg border text-xs font-semibold transition-colors ${
                    isCurrentBookmarked
                      ? 'bg-amber-500 text-white border-amber-500'
                      : `${themeStyles.text} ${themeStyles.border} hover:opacity-80`
                  }`}
                  title={isCurrentBookmarked ? 'Hapus Pembatas Buku' : 'Tandai Halaman Ini'}
                >
                  <Bookmark className={`w-4 h-4 ${isCurrentBookmarked ? 'fill-current' : ''}`} />
                </button>

                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className={`hidden sm:flex p-2 rounded-lg border ${themeStyles.text} ${themeStyles.border} hover:opacity-80 transition-colors`}
                  title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
                  title="Tutup Pembaca (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Reading Progress Line */}
            <div className="w-full h-1 bg-current/10 relative overflow-hidden">
              <motion.div
                className={`h-full ${theme === 'dark' ? 'bg-[#14B8A6]' : 'bg-[#174C3C]'}`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Main Reading Workspace with Sidebar Drawer */}
            <div className="relative flex-1 flex overflow-hidden">
              
              {/* Table of Contents Drawer */}
              <AnimatePresence>
                {isTocOpen && (
                  <motion.aside
                    initial={{ x: -280, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -280, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className={`absolute inset-y-0 left-0 w-72 z-30 shadow-2xl p-4 overflow-y-auto ${themeStyles.cardBg} backdrop-blur-xl border-r ${themeStyles.border}`}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-current/10 mb-3">
                      <div className="flex items-center gap-2">
                        <BookMarked className="w-4 h-4 text-[#174C3C]" />
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${themeStyles.text}`}>
                          Daftar Bab & Halaman
                        </h4>
                      </div>
                      <button
                        onClick={() => setIsTocOpen(false)}
                        className={`p-1 rounded ${themeStyles.text} hover:opacity-70`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {pages.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setDirection(idx > currentPage ? 1 : -1);
                            setCurrentPage(idx);
                            setIsTocOpen(false);
                          }}
                          className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                            currentPage === idx
                              ? `${themeStyles.accentBg} text-white font-semibold shadow-xs`
                              : `${themeStyles.text} hover:bg-black/5`
                          }`}
                        >
                          <span className="shrink-0 font-mono text-[11px] opacity-75">
                            0{idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{p.chapterTitle}</p>
                            {p.subTitle && (
                              <p className="text-[10px] opacity-70 truncate mt-0.5">{p.subTitle}</p>
                            )}
                          </div>
                          {bookmarkedPages.includes(idx) && (
                            <Bookmark className="w-3.5 h-3.5 shrink-0 fill-current text-amber-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.aside>
                )}
              </AnimatePresence>

              {/* Book Page Content Canvas */}
              <div className="flex-1 overflow-y-auto px-6 sm:px-16 py-8 sm:py-12 flex justify-center">
                <div className="w-full max-w-2xl relative">
                  
                  {/* Floating Bookmark Ribbon if page is bookmarked */}
                  {isCurrentBookmarked && (
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="absolute -top-6 right-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold shadow-md"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                      <span>Halaman Ditandai</span>
                    </motion.div>
                  )}

                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.article
                      key={currentPage}
                      custom={direction}
                      variants={pageVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className={`space-y-6 ${fontClasses}`}
                    >
                      {/* Chapter Title Header */}
                      <header className="pb-4 border-b border-current/15">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold uppercase tracking-widest ${themeStyles.accent}`}>
                            Bab {currentPage + 1} • {progressPercent}% Selesai
                          </span>
                          <span className="text-xs opacity-50">•</span>
                          <span className={`text-xs ${themeStyles.subtext}`}>
                            {book.category || 'Literatur'}
                          </span>
                        </div>
                        <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${themeStyles.text}`}>
                          {activePageData.chapterTitle}
                        </h1>
                        {activePageData.subTitle && (
                          <h2 className={`text-sm sm:text-base font-normal mt-1.5 italic ${themeStyles.subtext}`}>
                            {activePageData.subTitle}
                          </h2>
                        )}
                      </header>

                      {/* Pull Quote Spotlight if available */}
                      {activePageData.quote && (
                        <blockquote className={`p-4 rounded-xl border-l-4 border-[#174C3C] ${themeStyles.cardBg} italic text-sm sm:text-base ${themeStyles.text}`}>
                          &ldquo;{activePageData.quote}&rdquo;
                        </blockquote>
                      )}

                      {/* Page Paragraphs */}
                      <div className={`space-y-4 text-justify ${fontSizeClasses} ${themeStyles.text}`}>
                        {activePageData.content.map((para, i) => (
                          <p key={i}>
                            {i === 0 ? (
                              <span className="float-left text-4xl sm:text-5xl font-bold font-serif leading-none pr-3 pt-1 text-[#174C3C]">
                                {para.charAt(0)}
                              </span>
                            ) : null}
                            {i === 0 ? para.slice(1) : para}
                          </p>
                        ))}
                      </div>

                      {/* Key Takeaway Card */}
                      {activePageData.keyTakeaway && (
                        <div className={`p-4 rounded-xl border ${themeStyles.border} ${themeStyles.cardBg} flex items-start gap-3 mt-8`}>
                          <div className="w-8 h-8 rounded-lg bg-[#174C3C]/10 text-[#174C3C] flex items-center justify-center shrink-0 mt-0.5">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className={`text-xs font-bold uppercase tracking-wider ${themeStyles.accent}`}>
                              Poin Kunci Halaman Ini
                            </h4>
                            <p className={`text-xs sm:text-sm mt-1 ${themeStyles.subtext}`}>
                              {activePageData.keyTakeaway}
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.article>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Bottom Navigation Bar */}
            <footer className={`px-4 sm:px-6 py-3 shrink-0 flex items-center justify-between border-t transition-colors duration-300 ${themeStyles.border} ${themeStyles.headerBg}`}>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  currentPage === 0
                    ? 'opacity-40 cursor-not-allowed border-transparent'
                    : `${themeStyles.text} ${themeStyles.border} hover:bg-black/5`
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Halaman Sebelumnya</span>
                <span className="sm:hidden">Sebelum</span>
              </button>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${themeStyles.subtext}`}>
                  Halaman <strong className={themeStyles.text}>{currentPage + 1}</strong> dari {totalPages}
                </span>
                <div className="hidden sm:flex items-center gap-1 text-[11px] opacity-60">
                  <span className="px-1.5 py-0.5 rounded bg-current/10 font-mono">←</span>
                  <span>/</span>
                  <span className="px-1.5 py-0.5 rounded bg-current/10 font-mono">→</span>
                  <span>Gunakan Panah</span>
                </div>
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  currentPage === totalPages - 1
                    ? 'opacity-40 cursor-not-allowed border-transparent'
                    : 'bg-[#174C3C] text-white hover:bg-[#12382F] border-transparent shadow-xs'
                }`}
              >
                <span className="hidden sm:inline">Halaman Selanjutnya</span>
                <span className="sm:hidden">Lanjut</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </footer>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
