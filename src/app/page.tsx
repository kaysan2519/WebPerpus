'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookCard } from '@/components/books/BookCard';
import { useLibrary } from '@/context/LibraryContext';
import { BookCategory } from '@/types';
import { 
  Search, 
  BookOpen, 
  Users, 
  Layers, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  BookMarked, 
  CheckCircle,
  Award
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { books, setSearchQuery } = useLibrary();
  const [heroSearch, setHeroSearch] = useState('');
  const [selectedPill, setSelectedPill] = useState<string>('Semua');

  const categories = ['Semua', 'Fiksi', 'Pendidikan', 'Teknologi', 'Sejarah', 'Kesehatan'];

  const filteredPilihan = books.filter((b) => {
    if (selectedPill === 'Semua') return true;
    if (selectedPill === 'Fiksi') return b.category === 'Fiksi';
    if (selectedPill === 'Pendidikan') return b.category === 'Pendidikan';
    if (selectedPill === 'Teknologi') return b.category === 'Teknologi';
    if (selectedPill === 'Sejarah') return b.category === 'Sejarah';
    if (selectedPill === 'Kesehatan') return b.category === 'Kesehatan';
    return true;
  }).slice(0, 5);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      setSearchQuery(heroSearch.trim());
      router.push(`/katalog?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      router.push('/katalog');
    }
  };

  const handlePillClick = (tag: string) => {
    setSearchQuery(tag);
    router.push(`/katalog?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-[#E5E6DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left Column: Editorial Headline & Search */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7EDE5] border border-[#A8B9A4]/40 text-[#174C3C] text-xs font-semibold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#174C3C] animate-pulse"></span>
                  Perpustakaan Digital
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#174C3C] tracking-tight leading-[1.15]">
                  Temukan Dunia Baru di Setiap Buku.
                </h1>

                <p className="text-base sm:text-lg text-[#777D77] max-w-xl font-normal leading-relaxed">
                  Ribuan koleksi buku, akses mudah, dan layanan modern untuk mendukung perjalanan belajarmu.
                </p>

                {/* Search Bar matching mockup */}
                <form
                  onSubmit={handleHeroSearchSubmit}
                  className="p-1.5 bg-white rounded-2xl border border-[#E5E6DF] shadow-editorial flex items-center gap-2 max-w-xl transition-all focus-within:border-[#174C3C] focus-within:ring-2 focus-within:ring-[#174C3C]/10"
                >
                  <div className="pl-3 text-[#777D77]">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Cari judul buku, penulis, atau kategori..."
                    className="w-full text-sm sm:text-base bg-transparent text-[#252925] placeholder:text-[#777D77]/80 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-[#174C3C] hover:bg-[#12382F] text-white text-sm font-semibold transition-colors flex items-center justify-center shrink-0 shadow-sm"
                  >
                    <Search className="w-4 h-4 sm:hidden" />
                    <span className="hidden sm:inline">Cari Buku</span>
                  </button>
                </form>

                {/* Popular Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#777D77]">
                  <span className="font-medium text-[#252925]">Populer:</span>
                  {['Teknologi', 'Pendidikan', 'Novel', 'Sejarah', 'Psikologi'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handlePillClick(item)}
                      className="px-3 py-1 rounded-full bg-white border border-[#E5E6DF] text-[#777D77] hover:text-[#174C3C] hover:border-[#174C3C]/60 hover:bg-[#E7EDE5]/40 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Library Photo with Natural Lighting */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Decorative subtle border frame */}
                  <div className="relative rounded-2xl overflow-hidden shadow-floating border border-[#E5E6DF] aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/4.5]">
                    <img
                      src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80"
                      alt="Suasana Perpustakaan Digital PerpusKita"
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Gradient overlay for text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    {/* Tag badge on image matching mockup */}
                    <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white">
                      <p className="font-serif italic text-lg sm:text-xl font-medium tracking-tight">
                        &ldquo;Baca. Pinjam. Kembangkan Diri.&rdquo;
                      </p>
                      <p className="text-xs text-white/80 mt-1">
                        Koleksi literatur terkurasi oleh pustakawan berpengalaman.
                      </p>
                    </div>
                  </div>

                  {/* Floating Mini Badge */}
                  <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E5E6DF] shadow-card text-xs font-semibold text-[#174C3C]">
                    <Award className="w-4 h-4 text-[#174C3C]" />
                    <span>Kurasi Mingguan</span>
                  </div>
                </div>
              </div>

            </div>

            {/* 4 Stats Cards matching mockup */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16">
              <div className="bg-white rounded-xl border border-[#E5E6DF] p-4 sm:p-5 flex items-center gap-3.5 shadow-card hover:border-[#174C3C]/40 transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-[#174C3C] font-serif">12.500+</div>
                  <div className="text-xs text-[#777D77] font-medium">Koleksi Buku</div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E6DF] p-4 sm:p-5 flex items-center gap-3.5 shadow-card hover:border-[#174C3C]/40 transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-[#174C3C] font-serif">3.200+</div>
                  <div className="text-xs text-[#777D77] font-medium">Anggota Aktif</div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E6DF] p-4 sm:p-5 flex items-center gap-3.5 shadow-card hover:border-[#174C3C]/40 transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-[#174C3C] font-serif">8</div>
                  <div className="text-xs text-[#777D77] font-medium">Kategori Utama</div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E6DF] p-4 sm:p-5 flex items-center gap-3.5 shadow-card hover:border-[#174C3C]/40 transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-[#174C3C] font-serif">24/7</div>
                  <div className="text-xs text-[#777D77] font-medium">Akses Online</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* KOLEKSI PILIHAN SECTION */}
        <section className="py-16 border-b border-[#E5E6DF] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header & Subtext */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#174C3C]">
                  Koleksi Pilihan
                </h2>
                <p className="text-sm text-[#777D77] mt-1">
                  Buku terbaik untuk menemani perjalanan belajarmu.
                </p>
              </div>

              <Link
                href="/katalog"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#174C3C] hover:text-[#12382F] group"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedPill(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedPill === cat
                      ? 'bg-[#174C3C] text-white shadow-xs'
                      : 'bg-[#F7F6F2] text-[#252925] border border-[#E5E6DF] hover:border-[#174C3C]/40 hover:bg-[#E7EDE5]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 5 Book Cards Grid matching the mockup */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {filteredPilihan.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

          </div>
        </section>

        {/* PILIHAN PUSTAKAWAN (EDITORIAL SPOTLIGHT) */}
        <section id="layanan" className="py-16 bg-[#F7F6F2] border-b border-[#E5E6DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-[#E5E6DF] p-6 sm:p-10 lg:p-12 shadow-editorial">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Book Cover */}
                <div className="lg:col-span-4 flex justify-center">
                  <div className="relative w-48 sm:w-56 aspect-[3/4.4] rounded-xl overflow-hidden shadow-book border border-[#E5E6DF]">
                    <img
                      src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80"
                      alt="Atomic Habits by James Clear"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#174C3C] text-white text-[11px] font-semibold">
                      Pilihan Pustakawan
                    </div>
                  </div>
                </div>

                {/* Editorial Content */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E7EDE5] text-[#174C3C]">
                      Pengembangan Diri
                    </span>
                    <span className="text-xs text-[#777D77]">• Edisi September 2024</span>
                  </div>

                  <h3 className="font-serif text-3xl font-bold text-[#174C3C]">
                    Atomic Habits: Fondasi Perubahan Berkelanjutan
                  </h3>

                  <blockquote className="border-l-2 border-[#174C3C] pl-4 italic text-sm text-[#252925]/90 font-serif leading-relaxed">
                    &ldquo;Perubahan kecil yang berulang akan menghasilkan lompatan besar dalam hidup. Anda tidak naik ke tingkat sasaran Anda; Anda jatuh ke tingkat sistem Anda.&rdquo;
                  </blockquote>

                  <p className="text-sm text-[#777D77] leading-relaxed">
                    Buku karya James Clear ini terpilih sebagai bacaan esensial karena menawarkan metodologi yang sangat aplikatif bagi pelajar dan profesional. Bukan sekadar motivasi semu, melainkan sains pembentukan tabiat manusia.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link
                      href="/katalog/atomic-habits"
                      className="px-6 py-2.5 rounded-lg bg-[#174C3C] hover:bg-[#12382F] text-white text-xs font-semibold transition-colors shadow-xs"
                    >
                      Baca Ulasan & Pinjam
                    </Link>
                    <Link
                      href="/katalog?cat=Pengembangan%20Diri"
                      className="px-4 py-2.5 rounded-lg border border-[#E5E6DF] hover:border-[#174C3C] text-[#252925] text-xs font-semibold transition-colors"
                    >
                      Jelajahi Topik Sejenis
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* LAYANAN PERPUSTAKAAN */}
        <section id="tentang" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#174C3C]">
                Layanan & Fasilitas
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#252925] mt-1">
                Kenyamanan Akses Ilmu Pengetahuan
              </h2>
              <p className="text-sm text-[#777D77] mt-2">
                Dirancang untuk memudahkan eksplorasi literasi bagi civitas akademika dan masyarakat luas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl border border-[#E5E6DF] bg-[#F7F6F2]/50 hover:bg-white hover:shadow-editorial transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-base text-[#174C3C]">Peminjaman Mandiri</h3>
                <p className="text-xs sm:text-sm text-[#777D77] mt-2 leading-relaxed">
                  Pinjam buku fisik atau reservasi judul favorit hanya dengan beberapa ketukan dari perangkat Anda.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[#E5E6DF] bg-[#F7F6F2]/50 hover:bg-white hover:shadow-editorial transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center mb-4">
                  <BookMarked className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-base text-[#174C3C]">Ruang Baca & Arsip Terbuka</h3>
                <p className="text-xs sm:text-sm text-[#777D77] mt-2 leading-relaxed">
                  Akses ruang baca hening dengan pencahayaan alami, koneksi serat optik, dan rak literatur terbuka.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[#E5E6DF] bg-[#F7F6F2]/50 hover:bg-white hover:shadow-editorial transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-base text-[#174C3C]">Diskusi & Klub Baca</h3>
                <p className="text-xs sm:text-sm text-[#777D77] mt-2 leading-relaxed">
                  Temu wicara buku bulanan, bedah karya penulis nasional, dan komunitas literasi yang saling menginspirasi.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
