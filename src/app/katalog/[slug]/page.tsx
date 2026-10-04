'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BorrowModal } from '@/components/books/BorrowModal';
import { EBookReaderModal } from '@/components/books/EBookReaderModal';
import { BookCard } from '@/components/books/BookCard';
import { useLibrary } from '@/context/LibraryContext';
import { 
  ChevronRight, 
  Star, 
  Bookmark, 
  BookOpen, 
  Share2, 
  MapPin, 
  ThumbsUp, 
  MessageSquarePlus, 
  ArrowLeft,
  Check,
  Sparkles,
  Clock
} from 'lucide-react';

export default function DetailBukuPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { books, getBookBySlug, favorites, toggleFavorite, reviews, addReview, reservations, reserveBook, currentUser } = useLibrary();
  const [activeTab, setActiveTab] = useState<'deskripsi' | 'ulasan' | 'serupa'>('deskripsi');
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);

  // Review Form state
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  const book = getBookBySlug(slug) || books[0];

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <h2 className="font-serif text-2xl font-bold text-[#174C3C]">Buku Tidak Ditemukan</h2>
          <p className="text-sm text-[#777D77] mt-2">Buku yang Anda cari mungkin telah dipindahkan.</p>
          <Link href="/katalog" className="mt-4 px-4 py-2 bg-[#174C3C] text-white rounded-lg text-xs font-semibold">
            Kembali ke Katalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isFav = favorites.includes(book.id);
  const bookReviews = reviews.filter((r) => r.bookId === book.id);
  const relatedBooks = books.filter((b) => b.id !== book.id && (b.category === book.category || b.isEditorChoice)).slice(0, 4);
  const userReservation = reservations.find(
    (r) => r.bookId === book.id && r.userId === currentUser.id && (r.status === 'Menunggu' || r.status === 'Siap Diambil')
  );

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewComment.trim()) {
      addReview(book.id, newReviewRating, newReviewComment.trim());
      setNewReviewComment('');
      setIsReviewFormOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb matching mockup */}
        <nav className="flex items-center gap-2 text-xs text-[#777D77] pb-6">
          <Link href="/" className="hover:text-[#174C3C] transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#A8B9A4]" />
          <Link href="/katalog" className="hover:text-[#174C3C] transition-colors">
            Koleksi
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#A8B9A4]" />
          <Link href={`/katalog?cat=${encodeURIComponent(book.category)}`} className="hover:text-[#174C3C] transition-colors">
            {book.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#A8B9A4]" />
          <span className="text-[#252925] font-semibold truncate max-w-[200px]">
            {book.title}
          </span>
        </nav>

        {/* Editorial Book Detail Split Section */}
        <div className="bg-white rounded-2xl border border-[#E5E6DF] p-6 sm:p-10 lg:p-12 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Book Cover & Action Buttons */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4.4] rounded-xl overflow-hidden shadow-book border border-[#E5E6DF] bg-[#FAF9F6]">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Action Buttons matching mockup */}
              <div className="w-full max-w-[320px] mt-6 space-y-3">
                {book.status === 'Tersedia' ? (
                  <button
                    onClick={() => setIsBorrowModalOpen(true)}
                    className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs bg-[#174C3C] hover:bg-[#12382F] text-white"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Pinjam Buku Ini</span>
                  </button>
                ) : userReservation ? (
                  <div className="w-full py-3 px-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 font-bold text-amber-800">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>Telah Direservasi (Antrean #{userReservation.queuePosition})</span>
                    </div>
                    <p className="text-[11px] text-amber-700">
                      Perkiraan tersedia: {userReservation.estimatedAvailableDate}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => reserveBook(book.id)}
                    className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Reservasi & Antre Buku Ini</span>
                  </button>
                )}

                <button
                  onClick={() => setIsReaderModalOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-[#E7EDE5] hover:bg-[#D7E2D4] text-[#174C3C] border border-[#A8B9A4]/40 font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-[#174C3C]" />
                  <span>Baca Cuplikan E-Book</span>
                </button>

                <button
                  onClick={() => toggleFavorite(book.id)}
                  className={`w-full py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                    isFav
                      ? 'border-[#174C3C] bg-[#E7EDE5] text-[#174C3C]'
                      : 'border-[#E5E6DF] bg-white text-[#252925] hover:border-[#174C3C]'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  <span>{isFav ? 'Tersimpan di Favorit' : 'Tambah ke Favorit'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Book Metadata & Information */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E7EDE5] text-[#174C3C]">
                    {book.category}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      book.status === 'Tersedia'
                        ? 'bg-[#E7EDE5] text-[#174C3C]'
                        : 'bg-[#FEECEB] text-[#C0392B]'
                    }`}
                  >
                    {book.status}
                  </span>
                  <span className="text-xs text-[#777D77] flex items-center gap-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-[#174C3C]" />
                    {book.shelfLocation}
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#174C3C] tracking-tight">
                  {book.title}
                </h1>
                <p className="text-base sm:text-lg text-[#777D77] font-medium mt-1">
                  Karya {book.author}
                </p>

                {/* Rating matching mockup */}
                <div className="flex items-center gap-2 mt-3 text-sm">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="font-bold text-[#252925]">{book.rating}</span>
                  <span className="text-[#777D77]">({book.reviewsCount} ulasan)</span>
                </div>
              </div>

              {/* Key-Value Details Grid matching mockup */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 py-5 border-y border-[#E5E6DF] text-xs sm:text-sm">
                <div>
                  <span className="text-[#777D77] block text-xs">Penerbit</span>
                  <span className="font-semibold text-[#252925] mt-0.5 block">{book.publisher}</span>
                </div>
                <div>
                  <span className="text-[#777D77] block text-xs">Tahun Terbit</span>
                  <span className="font-semibold text-[#252925] mt-0.5 block">{book.publishYear}</span>
                </div>
                <div>
                  <span className="text-[#777D77] block text-xs">Jumlah Halaman</span>
                  <span className="font-semibold text-[#252925] mt-0.5 block">{book.pages} Halaman</span>
                </div>
                <div>
                  <span className="text-[#777D77] block text-xs">ISBN</span>
                  <span className="font-semibold text-[#252925] font-mono mt-0.5 block">{book.isbn}</span>
                </div>
                <div>
                  <span className="text-[#777D77] block text-xs">Bahasa</span>
                  <span className="font-semibold text-[#252925] mt-0.5 block">{book.language}</span>
                </div>
                <div>
                  <span className="text-[#777D77] block text-xs">Status Fisik</span>
                  <span className="font-semibold text-[#174C3C] mt-0.5 block">Kondisi Baik (Hardcover)</span>
                </div>
              </div>

              {/* Tabs matching mockup: Deskripsi, Ulasan (320), Buku Serupa */}
              <div className="pt-2">
                <div className="flex items-center gap-6 border-b border-[#E5E6DF]">
                  <button
                    onClick={() => setActiveTab('deskripsi')}
                    className={`pb-3 text-sm font-semibold transition-all relative ${
                      activeTab === 'deskripsi'
                        ? 'text-[#174C3C]'
                        : 'text-[#777D77] hover:text-[#252925]'
                    }`}
                  >
                    Deskripsi
                    {activeTab === 'deskripsi' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#174C3C]" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('ulasan')}
                    className={`pb-3 text-sm font-semibold transition-all relative ${
                      activeTab === 'ulasan'
                        ? 'text-[#174C3C]'
                        : 'text-[#777D77] hover:text-[#252925]'
                    }`}
                  >
                    Ulasan ({bookReviews.length + 316})
                    {activeTab === 'ulasan' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#174C3C]" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('serupa')}
                    className={`pb-3 text-sm font-semibold transition-all relative ${
                      activeTab === 'serupa'
                        ? 'text-[#174C3C]'
                        : 'text-[#777D77] hover:text-[#252925]'
                    }`}
                  >
                    Buku Serupa
                    {activeTab === 'serupa' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#174C3C]" />
                    )}
                  </button>
                </div>

                {/* Tab 1: Deskripsi */}
                {activeTab === 'deskripsi' && (
                  <div className="pt-5 space-y-4">
                    {book.summaryQuote && (
                      <blockquote className="border-l-2 border-[#174C3C] pl-4 italic text-sm text-[#252925]/90 font-serif">
                        &ldquo;{book.summaryQuote}&rdquo;
                      </blockquote>
                    )}
                    <p className="text-sm text-[#777D77] leading-relaxed">
                      {book.description}
                    </p>
                    <p className="text-xs text-[#777D77] leading-relaxed">
                      Buku ini tersedia untuk dipinjam secara langsung di rak perpustakaan atau melalui peminjaman digital dengan durasi hingga 21 hari kalender.
                    </p>
                  </div>
                )}

                {/* Tab 2: Ulasan */}
                {activeTab === 'ulasan' && (
                  <div className="pt-5 space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#777D77]">
                        Ulasan Pembaca Terverifikasi
                      </p>
                      <button
                        onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                        className="text-xs font-semibold text-[#174C3C] hover:underline flex items-center gap-1"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5" />
                        <span>Tulis Ulasan</span>
                      </button>
                    </div>

                    {/* Review Form */}
                    {isReviewFormOpen && (
                      <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E5E6DF] space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#252925] font-medium">Beri Rating:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewReviewRating(star)}
                                className="text-amber-400 p-0.5"
                              >
                                <Star className={`w-4 h-4 ${star <= newReviewRating ? 'fill-current' : 'text-[#D1D5CE]'}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <textarea
                          rows={3}
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          placeholder="Bagikan pandangan Anda tentang buku ini..."
                          className="w-full p-3 rounded-lg border border-[#E5E6DF] text-xs bg-white focus:outline-none focus:border-[#174C3C]"
                          required
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsReviewFormOpen(false)}
                            className="px-3 py-1.5 text-xs text-[#777D77]"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-[#174C3C] text-white text-xs font-semibold rounded-lg hover:bg-[#12382F]"
                          >
                            Kirim Ulasan
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {bookReviews.map((rev) => (
                        <div key={rev.id} className="p-4 rounded-xl border border-[#E5E6DF] bg-[#FAF9F6] space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-xs text-[#252925]">{rev.userName}</h4>
                              <p className="text-[11px] text-[#777D77]">{rev.userRole} • {rev.date}</p>
                            </div>
                            <div className="flex text-amber-400">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-[#252925]/85 leading-relaxed">
                            {rev.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 3: Buku Serupa */}
                {activeTab === 'serupa' && (
                  <div className="pt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {relatedBooks.map((relBook) => (
                      <BookCard key={relBook.id} book={relBook} />
                    ))}
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>

      </main>

      <Footer />

      {/* Borrow Modal Trigger */}
      <BorrowModal
        book={book}
        isOpen={isBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
      />

      {/* E-Book Reader Modal Trigger */}
      <EBookReaderModal
        book={book}
        isOpen={isReaderModalOpen}
        onClose={() => setIsReaderModalOpen(false)}
      />
    </div>
  );
}
