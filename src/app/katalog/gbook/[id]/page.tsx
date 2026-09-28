'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLibrary } from '@/context/LibraryContext';
import { GoogleBookVolume, Book } from '@/types';
import { BookPlaceholderCover } from '@/components/books/BookPlaceholderCover';
import { BorrowModal } from '@/components/books/BorrowModal';
import { ImportGoogleBookModal } from '@/components/admin/ImportGoogleBookModal';
import { 
  ChevronRight, 
  ArrowLeft, 
  ExternalLink, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  PlusCircle, 
  MapPin, 
  Layers, 
  Calendar, 
  Hash, 
  Building,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export default function GoogleBookDetailPage() {
  const params = useParams();
  const volumeId = params.id as string;

  const { isBookInLocalInventory, currentUser, books } = useLibrary();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [volume, setVolume] = useState<GoogleBookVolume | null>(null);

  // Modals
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    async function fetchBookDetail() {
      setLoading(true);
      setErrorMsg(null);
      setQuotaExceeded(false);

      try {
        const res = await fetch(`/api/books/${encodeURIComponent(volumeId)}`);
        const json = await res.json();

        if (json.quotaExceeded) {
          setQuotaExceeded(true);
          // Check if we have a local book that matches this ID or slug
          const localBook = books.find((b) => b.googleVolumeId === volumeId || b.id === volumeId);
          if (localBook) {
            setVolume({
              id: localBook.googleVolumeId || localBook.id,
              title: localBook.title,
              authors: [localBook.author],
              description: localBook.description,
              thumbnail: localBook.coverImage,
              publisher: localBook.publisher,
              publishedDate: localBook.publishYear.toString(),
              categories: [localBook.category],
              pageCount: localBook.pages,
              language: localBook.language === 'Indonesia' ? 'id' : 'en',
              isbn13: localBook.isbn,
              inLocalInventory: true,
              localBookId: localBook.id,
              localShelfLocation: localBook.shelfLocation,
              localStockCount: 3,
            });
          } else {
            setErrorMsg('Batas kuota harian publik Google Books tercapai.');
          }
        } else if (!res.ok || !json.success) {
          setErrorMsg(json.message || 'Gagal memuat detail buku dari Google Books.');
        } else {
          setVolume(json.data);
        }
      } catch (err) {
        setErrorMsg('Terjadi gangguan jaringan saat menghubungi Google Books.');
      } finally {
        setLoading(false);
      }
    }

    if (volumeId) {
      fetchBookDetail();
    }
  }, [volumeId, books]);

  // Check live local inventory state
  const localMatch: Book | undefined = volume
    ? isBookInLocalInventory(volume.id, volume.isbn13 || volume.isbn10, volume.title)
    : undefined;

  const isInLocalInventory = !!localMatch || (volume?.inLocalInventory ?? false);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
        <Navbar />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-3 border-[#174C3C] border-t-transparent rounded-full animate-spin" />
          <p className="font-serif text-base text-[#174C3C]">
            Mengambil data bibliografi dari Google Books API...
          </p>
          <p className="text-xs text-[#777D77]">Menyelaraskan metadata dan status inventaris lokal</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (errorMsg && !volume) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
        <Navbar />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#252925]">
            {quotaExceeded ? 'Batas Kuota Publik Google Books' : 'Buku Tidak Dapat Dimuat'}
          </h2>
          <p className="text-sm text-[#777D77] max-w-md mx-auto leading-relaxed">
            {errorMsg}
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link
              href="/katalog"
              className="px-5 py-2.5 rounded-lg bg-[#174C3C] text-white text-xs font-semibold hover:bg-[#12382F] transition-colors"
            >
              Kembali ke Katalog Perpustakaan
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!volume) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#777D77] pb-6">
          <Link href="/" className="hover:text-[#174C3C] transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#A8B9A4]" />
          <Link href="/katalog" className="hover:text-[#174C3C] transition-colors">
            Katalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#A8B9A4]" />
          <span className="text-[#174C3C] font-medium flex items-center gap-1">
            <Globe className="w-3 h-3 text-[#174C3C]" />
            Google Books Volume
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#A8B9A4]" />
          <span className="text-[#252925] font-semibold truncate max-w-[200px]">
            {volume.title}
          </span>
        </nav>

        {/* Quota warning banner if running in fallback mode */}
        {quotaExceeded && (
          <div className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50/90 flex items-start gap-3 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Catatan Sistem:</strong> Menampilkan data buku yang telah tersinkronisasi dalam cache lokal PerpusKita karena kuota akses Google Books publik saat ini telah tercapai.
            </div>
          </div>
        )}

        {/* Editorial Split Card */}
        <div className="bg-white rounded-2xl border border-[#E5E6DF] p-6 sm:p-10 lg:p-12 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Cover & Primary Actions */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4.4] rounded-xl overflow-hidden shadow-book border border-[#E5E6DF] bg-[#FAF9F6]">
                {volume.thumbnail ? (
                  <img
                    src={volume.thumbnail}
                    alt={volume.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookPlaceholderCover
                    title={volume.title}
                    author={volume.authors[0]}
                    category={volume.categories[0]}
                  />
                )}

                {/* Badge Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#12382F]/90 backdrop-blur-md text-white text-[11px] font-semibold">
                  <Globe className="w-3.5 h-3.5 text-[#A8B9A4]" />
                  <span>Google Books API</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full max-w-[320px] mt-6 space-y-3">
                {/* Condition: Is in Local Inventory */}
                {isInLocalInventory && localMatch ? (
                  <>
                    <button
                      onClick={() => setIsBorrowModalOpen(true)}
                      disabled={localMatch.status === 'Dipinjam'}
                      className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs ${
                        localMatch.status === 'Tersedia'
                          ? 'bg-[#174C3C] hover:bg-[#12382F] text-white'
                          : 'bg-[#E5E6DF] text-[#777D77] cursor-not-allowed'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{localMatch.status === 'Tersedia' ? 'Pinjam Buku Ini' : 'Sedang Dipinjam'}</span>
                    </button>

                    <Link
                      href={`/katalog/${localMatch.slug}`}
                      className="w-full py-2.5 px-4 rounded-xl border border-[#A8B9A4]/40 bg-[#E7EDE5] text-[#174C3C] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#BCD9CF] transition-colors"
                    >
                      <span>Lihat Halaman Koleksi Resmi</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </>
                ) : (
                  <>
                    {/* NOT IN LOCAL INVENTORY NOTICE */}
                    <div className="p-3.5 rounded-xl border border-[#E5E6DF] bg-[#F7F6F2] text-xs text-[#777D77] leading-relaxed">
                      <p className="font-semibold text-[#252925] flex items-center gap-1.5 mb-1">
                        <AlertCircle className="w-4 h-4 text-[#777D77]" />
                        <span>Belum Masuk Inventaris Lokal</span>
                      </p>
                      Buku ini merupakan referensi bibliografi global Google Books. Belum ada stok fisik di rak perpustakaan.
                    </div>

                    {/* Admin Import Trigger */}
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="w-full py-3 px-4 rounded-xl bg-[#174C3C] hover:bg-[#12382F] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Impor ke Inventaris Perpustakaan</span>
                      </button>
                    )}
                  </>
                )}

                {/* External Preview Link if provided by Google */}
                {volume.previewLink && (
                  <a
                    href={volume.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl border border-[#E5E6DF] bg-white hover:border-[#174C3C] text-[#252925] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Baca Pratinjau di Google Books</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#777D77]" />
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Complete Dual-Section Metadata */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E7EDE5] text-[#174C3C]">
                    {volume.categories[0] || 'Umum'}
                  </span>
                  
                  {isInLocalInventory ? (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E7EDE5] text-[#174C3C] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#174C3C]" />
                      <span>Koleksi Perpustakaan</span>
                    </span>
                  ) : (
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E5E6DF] text-[#777D77]">
                      Referensi Eksternal
                    </span>
                  )}
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#174C3C] tracking-tight">
                  {volume.title}
                </h1>
                <p className="text-base text-[#777D77] font-medium mt-1">
                  Karya {volume.authors.join(', ')}
                </p>
              </div>

              {/* SECTION 1: INFORMASI INVENTARIS PERPUSTAKAAN */}
              <div className="p-4 sm:p-5 rounded-xl border border-[#A8B9A4]/40 bg-[#E7EDE5]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#174C3C] flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Status Inventaris Fisik PerpusKita</span>
                  </h3>
                  <span className="text-[11px] font-mono font-medium text-[#777D77]">
                    Sistem Inventaris Terpadu
                  </span>
                </div>

                {isInLocalInventory && localMatch ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div>
                      <span className="text-[#777D77] block text-[11px]">Ketersediaan</span>
                      <strong className={`font-semibold ${localMatch.status === 'Tersedia' ? 'text-[#174C3C]' : 'text-rose-600'}`}>
                        {localMatch.status}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#777D77] block text-[11px]">Lokasi Rak</span>
                      <strong className="text-[#252925] font-semibold">{localMatch.shelfLocation}</strong>
                    </div>
                    <div>
                      <span className="text-[#777D77] block text-[11px]">Jumlah Stok</span>
                      <strong className="text-[#252925] font-semibold">{localMatch.stockCount || 3} Eksemplar</strong>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 text-xs text-[#777D77] space-y-1">
                    <p>Buku ini belum dialokasikan ke rak perpustakaan.</p>
                    <p className="text-[11px]">
                      Jika Anda membutuhkan buku ini untuk bahan riset atau perkuliahan, Anda dapat mengajukan usulan pengadaan ke petugas perpustakaan.
                    </p>
                  </div>
                )}
              </div>

              {/* SECTION 2: INFORMASI BIBLIOGRAFI (GOOGLE BOOKS) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#252925] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#174C3C]" />
                  <span>Metadata Bibliografi Resmi (Google Books)</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 py-4 border-y border-[#E5E6DF] text-xs sm:text-sm">
                  <div>
                    <span className="text-[#777D77] block text-xs">Penerbit</span>
                    <span className="font-semibold text-[#252925] mt-0.5 block">{volume.publisher}</span>
                  </div>
                  <div>
                    <span className="text-[#777D77] block text-xs">Tanggal Terbit</span>
                    <span className="font-semibold text-[#252925] mt-0.5 block">{volume.publishedDate}</span>
                  </div>
                  <div>
                    <span className="text-[#777D77] block text-xs">Jumlah Halaman</span>
                    <span className="font-semibold text-[#252925] mt-0.5 block">
                      {volume.pageCount > 0 ? `${volume.pageCount} Halaman` : 'Tidak tercatat'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#777D77] block text-xs">ISBN-13</span>
                    <span className="font-semibold text-[#252925] font-mono mt-0.5 block">
                      {volume.isbn13 || 'Tidak tersedia'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#777D77] block text-xs">ISBN-10</span>
                    <span className="font-semibold text-[#252925] font-mono mt-0.5 block">
                      {volume.isbn10 || 'Tidak tersedia'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#777D77] block text-xs">Bahasa Dokumen</span>
                    <span className="font-semibold text-[#252925] mt-0.5 block uppercase">
                      {volume.language || 'ID'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: DESKRIPSI & SINOPSIS */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#252925]">
                  Sinopsis & Gambaran Isi
                </h3>
                <p className="text-sm text-[#777D77] leading-relaxed">
                  {volume.description}
                </p>
              </div>

            </div>

          </div>
        </div>

      </main>

      <Footer />

      {/* Borrow Modal if in inventory */}
      {localMatch && (
        <BorrowModal
          book={localMatch}
          isOpen={isBorrowModalOpen}
          onClose={() => setIsBorrowModalOpen(false)}
        />
      )}

      {/* Admin Import Modal */}
      <ImportGoogleBookModal
        volume={volume}
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
}
