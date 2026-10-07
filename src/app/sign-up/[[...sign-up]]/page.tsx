'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SignUp } from '@clerk/nextjs';
import { Logo } from '@/components/ui/Logo';
import { useLibrary } from '@/context/LibraryContext';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Star, 
  Key, 
  Users, 
  BookCheck,
  ChevronRight,
  HelpCircle,
  GraduationCap
} from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { switchUserRole, showToast } = useLibrary();
  const [quickLoginLoading, setQuickLoginLoading] = useState<string | null>(null);

  // Quick Persona / Demo Login for evaluators & guests
  const handleQuickDemoLogin = (role: 'siswa' | 'admin') => {
    setQuickLoginLoading(role);
    switchUserRole(role);
    showToast(
      role === 'admin' 
        ? 'Masuk dalam mode Demo Administrator' 
        : 'Masuk dalam mode Demo Anggota Siswa', 
      'success'
    );
    setTimeout(() => {
      router.push(role === 'admin' ? '/dashboard/admin' : '/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col justify-between selection:bg-forest/15 selection:text-forest">
      
      {/* GLOBAL TOP NAVIGATION FOR DESKTOP & MOBILE */}
      <header className="w-full border-b border-[#E5E6DF] bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <Logo size="md" href="/" />
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#777D77] pl-4 border-l border-[#E5E6DF]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Pendaftaran Anggota Baru Terbuka</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/katalog"
              className="hidden md:flex items-center gap-1.5 text-xs font-medium text-[#252925] hover:text-[#174C3C] px-3 py-1.5 rounded-full hover:bg-[#F7F6F2] transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#174C3C]" />
              <span>Jelajah Katalog</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#174C3C] bg-[#E7EDE5] hover:bg-[#174C3C] hover:text-white px-3.5 py-1.5 rounded-full transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER: RESPONSIVE TWO-COLUMN GRID */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* KOLOM KIRI: EDITORIAL BRAND SHOWCASE (DESKTOP / TABLET EXPANDED) */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center space-y-6 lg:pr-4">
            
            {/* Top Pill */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E7EDE5] text-[#174C3C] text-xs font-semibold w-fit border border-[#A8B9A4]/30"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
              <span>Keanggotaan Digital Resmi PerpusKita</span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <h1 className="font-serif text-3xl sm:text-4xl xl:text-5xl font-bold text-[#174C3C] tracking-tight leading-[1.15]">
                Bergabung Bersama Ribuan Insan Pembelajar.
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#464C45] leading-relaxed max-w-xl">
                Daftarkan akun perpustakaan Anda secara gratis. Nikmati akses tanpa batas ke katalog editorial, reservasi buku favorit, dan rekomendasi AI personal.
              </p>
            </motion.div>

            {/* Interactive Featured Book Showcase Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E6DF] shadow-editorial flex flex-col sm:flex-row gap-4 items-start sm:items-center relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#174C3C]/5 rounded-bl-full pointer-events-none" />
              
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80"
                alt="Laut Bercerita"
                className="w-20 h-28 object-cover rounded-xl shadow-md flex-shrink-0 border border-black/5"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Karya Sastra Terpopuler
                  </span>
                  <span className="flex items-center gap-0.5 text-xs text-amber-600 font-semibold">
                    <Star className="w-3 h-3 fill-current" /> 4.7
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#252925] truncate">
                  Laut Bercerita
                </h3>
                <p className="text-xs text-[#777D77]">Leila S. Chudori • Rak A-12 (Sastra Indonesia)</p>
                <p className="mt-2 text-xs italic text-[#464C45] line-clamp-2 leading-relaxed">
                  &ldquo;Sebuah kisah tentang mereka yang dihilangkan dan keluarga yang tak pernah lelah mencari.&rdquo;
                </p>
              </div>
            </motion.div>

            {/* 3 Key Pillar Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/70 backdrop-blur-xs rounded-xl p-3 border border-[#E5E6DF] flex flex-col gap-1">
                <div className="w-7 h-7 rounded-lg bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="font-semibold text-xs text-[#252925]">Pinjam 3 Buku</span>
                <span className="text-[11px] text-[#777D77]">Durasi 14 hari per periode</span>
              </div>

              <div className="bg-white/70 backdrop-blur-xs rounded-xl p-3 border border-[#E5E6DF] flex flex-col gap-1">
                <div className="w-7 h-7 rounded-lg bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center">
                  <Key className="w-4 h-4 text-amber-600" />
                </div>
                <span className="font-semibold text-xs text-[#252925]">Kunci Konsul AI</span>
                <span className="text-[11px] text-[#777D77]">Diskusi literasi cerdas</span>
              </div>

              <div className="bg-white/70 backdrop-blur-xs rounded-xl p-3 border border-[#E5E6DF] flex flex-col gap-1">
                <div className="w-7 h-7 rounded-lg bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center">
                  <BookCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="font-semibold text-xs text-[#252925]">E-Book Reader</span>
                <span className="text-[11px] text-[#777D77]">Akses baca langsung di web</span>
              </div>
            </div>

            {/* Trust Footer Badges */}
            <div className="pt-2 flex items-center gap-4 text-xs text-[#777D77]">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#174C3C]" />
                Akreditasi Perpustakaan A Nasional
              </span>
              <span>•</span>
              <span>PerpusKita Engine v2.6</span>
            </div>

          </div>

          {/* KOLOM KANAN: AUTHENTICATION PORTAL (FULL DESKTOP COMFORT WIDTH) */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E5E6DF] shadow-2xl relative overflow-hidden">
              
              {/* Header Box */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#174C3C] tracking-tight">
                    Registrasi Anggota
                  </h2>
                  <span className="text-[10px] font-mono uppercase bg-[#F7F6F2] border border-[#E5E6DF] px-2 py-1 rounded text-[#777D77]">
                    Akun Baru
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#777D77] leading-relaxed">
                  Lengkapi data pendaftaran Anda untuk mendapatkan nomor keanggotaan digital.
                </p>
              </div>

              {/* QUICK DEMO LOGIN SHORTCUT (IDEAL FOR EVALUATORS & FAST TESTING) */}
              <div className="mb-6 p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E6DF]">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-[#174C3C] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Ingin Mencoba Langsung?
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                    Mode Uji Coba
                  </span>
                </div>
                <p className="text-[11px] text-[#777D77] mb-3 leading-relaxed">
                  Gunakan akses instan mode demo untuk menguji seluruh fitur tanpa mendaftar:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('siswa')}
                    disabled={quickLoginLoading !== null}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-[#A8B9A4]/60 hover:border-[#174C3C] hover:bg-[#E7EDE5]/50 text-[#174C3C] text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{quickLoginLoading === 'siswa' ? 'Memuat...' : 'Demo Siswa'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin')}
                    disabled={quickLoginLoading !== null}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#174C3C] hover:bg-[#12382F] text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{quickLoginLoading === 'admin' ? 'Memuat...' : 'Demo Admin'}</span>
                  </button>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5E6DF]" />
                </div>
                <span className="relative bg-white px-3 text-xs text-[#777D77] uppercase tracking-wider font-medium">
                  Atau Daftar dengan Clerk
                </span>
              </div>

              {/* CLERK SIGN UP FORM WITH POLISHED DESKTOP SIZING */}
              <div className="w-full">
                <SignUp
                  routing="path"
                  path="/sign-up"
                  signInUrl="/sign-in"
                  fallbackRedirectUrl="/dashboard"
                  appearance={{
                    variables: {
                      colorPrimary: '#174C3C',
                      colorText: '#252925',
                      colorBackground: '#FFFFFF',
                      colorInputBackground: '#F7F6F2',
                      colorInputText: '#252925',
                      borderRadius: '0.75rem',
                      fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
                    },
                    elements: {
                      rootBox: 'w-full',
                      card: 'w-full shadow-none border-0 p-0 m-0 bg-transparent',
                      cardBox: 'w-full shadow-none border-0',
                      header: 'hidden',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      formButtonPrimary: 'w-full bg-[#174C3C] hover:bg-[#12382F] text-white font-semibold text-sm transition-all shadow-md py-3 rounded-xl mt-2',
                      formFieldInput: 'border border-[#E5E6DF] focus:border-[#174C3C] focus:ring-1 focus:ring-[#174C3C] rounded-xl text-sm bg-[#F7F6F2]/70 focus:bg-white transition-all py-2.5 px-3.5',
                      socialButtonsBlockButton: 'border border-[#E5E6DF] hover:bg-[#F7F6F2] hover:border-[#A8B9A4] rounded-xl text-xs font-semibold py-2.5 transition-all text-[#252925]',
                      footerActionLink: 'text-[#174C3C] font-semibold hover:underline',
                      footerActionText: 'text-xs text-[#777D77]',
                      identityPreviewText: 'text-xs text-[#252925]',
                      formFieldLabel: 'text-xs font-semibold uppercase tracking-wider text-[#252925] mb-1',
                    },
                  }}
                />
              </div>

              {/* FOOTER NOTICE */}
              <div className="mt-6 pt-5 border-t border-[#E5E6DF] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#777D77]">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#174C3C]" />
                  <span>Sudah memiliki akun anggota?</span>
                </div>
                <Link 
                  href="/sign-in" 
                  className="font-semibold text-[#174C3C] hover:underline flex items-center gap-1"
                >
                  <span>Masuk ke Akun</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="w-full border-t border-[#E5E6DF] py-4 bg-white/50 text-center text-xs text-[#777D77]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} PerpusKita Editorial System. Hak Cipta Dilindungi.</span>
          <div className="flex items-center gap-4">
            <a href="mailto:layanan@perpuskita.id" className="hover:text-[#174C3C] transition-colors">
              Pusat Bantuan
            </a>
            <span>•</span>
            <Link href="/katalog" className="hover:text-[#174C3C] transition-colors">
              Katalog Publik
            </Link>
            <span>•</span>
            <span className="font-mono text-[11px] text-[#174C3C]">v2.6.0-stable</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
