'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SignIn } from '@clerk/nextjs';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLibrary } from '@/context/LibraryContext';
import { motion, AnimatePresence } from 'framer-motion';
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
  Eye,
  EyeOff,
  Lock,
  Mail,
  UserCheck,
  HelpCircle,
  Clock,
  MapPin,
  Laptop
} from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const { switchUserRole, showToast } = useLibrary();

  // Mode: 'demo' | 'direct' | 'clerk'
  const [activeTab, setActiveTab] = useState<'demo' | 'direct' | 'clerk'>('demo');
  const [emailInput, setEmailInput] = useState('siswa@perpuskita.id');
  const [passwordInput, setPasswordInput] = useState('perpuskita2024');
  const [showPassword, setShowPassword] = useState(false);
  const [roleSelect, setRoleSelect] = useState<'siswa' | 'admin'>('siswa');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Persona / Demo Login
  const handleQuickDemoLogin = (role: 'siswa' | 'admin') => {
    setIsSubmitting(true);
    switchUserRole(role);
    showToast(
      role === 'admin' 
        ? 'Berhasil masuk sebagai Administrator Perpustakaan' 
        : 'Berhasil masuk sebagai Siswa Anggota Perpustakaan', 
      'success'
    );
    setTimeout(() => {
      router.push(role === 'admin' ? '/dashboard/admin' : '/dashboard');
    }, 400);
  };

  // Direct Form Login
  const handleDirectLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) {
      showToast('Harap masukkan nomor anggota/email dan kata sandi.', 'error');
      return;
    }

    setIsSubmitting(true);
    const targetRole = roleSelect;
    switchUserRole(targetRole);
    showToast(`Selamat datang kembali! Masuk sebagai ${targetRole === 'admin' ? 'Administrator' : 'Siswa'}.`, 'success');
    setTimeout(() => {
      router.push(targetRole === 'admin' ? '/dashboard/admin' : '/dashboard');
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col justify-between selection:bg-forest/15 selection:text-forest">
      
      {/* STANDARD WEBSITE NAVBAR (DESKTOP & MOBILE FULL BRAND NAVIGATION) */}
      <Navbar />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#E5E6DF]">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#777D77]">
            <Link href="/" className="hover:text-[#174C3C] transition-colors">Beranda</Link>
            <span>/</span>
            <span className="font-semibold text-[#174C3C]">Masuk Akun Anggota</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#777D77] bg-white px-3 py-1.5 rounded-full border border-[#E5E6DF] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Layanan Perpustakaan Terbuka: 08:00 – 17:00 WIB</span>
          </div>
        </div>

        {/* RESPONSIVE DUAL-COLUMN GRID (SIDE-BY-SIDE FROM MD 768px+) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* KOLOM KIRI: EDITORIAL BRAND SHOWCASE (MD: 6 COLS, LG: 7 COLS) */}
          <div className="md:col-span-6 lg:col-span-6 xl:col-span-7 space-y-6">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E7EDE5] text-[#174C3C] text-xs font-semibold border border-[#A8B9A4]/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Sistem Keanggotaan Terpadu PerpusKita</span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#174C3C] tracking-tight leading-[1.18]">
                Selamat Datang Kembali di Ruang Literasi Digital.
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#464C45] leading-relaxed max-w-xl">
                Kelola peminjaman buku, baca koleksi digital secara daring dengan <span className="font-semibold text-[#174C3C]">E-Book Reader</span>, dan dapatkan asistensi riset cerdas dari <span className="font-semibold text-[#174C3C]">Pustakawan AI</span>.
              </p>
            </div>

            {/* Featured Book Spotlight Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E6DF] shadow-editorial flex flex-col sm:flex-row gap-4 items-start sm:items-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#174C3C]/5 rounded-bl-full pointer-events-none" />
              
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80"
                alt="Atomic Habits"
                className="w-20 h-28 object-cover rounded-xl shadow-md flex-shrink-0 border border-black/5"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    Koleksi Populer Pekan Ini
                  </span>
                  <span className="flex items-center gap-0.5 text-xs text-amber-600 font-semibold">
                    <Star className="w-3 h-3 fill-current" /> 4.8
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#252925] truncate">
                  Atomic Habits
                </h3>
                <p className="text-xs text-[#777D77]">James Clear • Rak D-04 (Self-Improvement)</p>
                <p className="mt-2 text-xs italic text-[#464C45] line-clamp-2 leading-relaxed">
                  &ldquo;Perubahan kecil yang berulang akan menghasilkan lompatan besar dalam hidup.&rdquo;
                </p>
              </div>
            </div>

            {/* 3 Keunggulan Anggota */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/80 rounded-xl p-3.5 border border-[#E5E6DF] flex flex-col gap-1 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center">
                  <BookCheck className="w-4 h-4" />
                </div>
                <span className="font-semibold text-xs text-[#252925] mt-1">10.000+ Koleksi</span>
                <span className="text-[11px] text-[#777D77]">Buku fisik & digital terkurasi</span>
              </div>

              <div className="bg-white/80 rounded-xl p-3.5 border border-[#E5E6DF] flex flex-col gap-1 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center">
                  <Key className="w-4 h-4 text-amber-600" />
                </div>
                <span className="font-semibold text-xs text-[#252925] mt-1">Kunci Konsul AI</span>
                <span className="text-[11px] text-[#777D77]">Konsultasi sastra & riset</span>
              </div>

              <div className="bg-white/80 rounded-xl p-3.5 border border-[#E5E6DF] flex flex-col gap-1 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="font-semibold text-xs text-[#252925] mt-1">Akreditasi A</span>
                <span className="text-[11px] text-[#777D77]">Standar nasional perpustakaan</span>
              </div>
            </div>

            {/* Info Lokasi & Jam */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#777D77]">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#174C3C]" />
                Gedung Literasi PerpusKita Lt. 1-3
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#174C3C]" />
                Senin - Jumat 08:00 - 17:00 WIB
              </span>
            </div>

          </div>

          {/* KOLOM KANAN: AUTHENTICATION PORTAL (MD: 6 COLS, LG: 6 COLS, XL: 5 COLS) */}
          <div className="md:col-span-6 lg:col-span-6 xl:col-span-5">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E5E6DF] shadow-xl relative overflow-hidden">
              
              {/* Header Box */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1.5">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#174C3C] tracking-tight">
                    Masuk ke Akun
                  </h2>
                  <span className="text-[10px] font-mono uppercase bg-[#F7F6F2] border border-[#E5E6DF] px-2 py-1 rounded text-[#777D77]">
                    Portal Anggota
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#777D77]">
                  Pilih cara masuk yang paling nyaman bagi Anda:
                </p>
              </div>

              {/* TABS NAVIGATION */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#F7F6F2] rounded-xl border border-[#E5E6DF] mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('demo')}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all text-center ${
                    activeTab === 'demo'
                      ? 'bg-[#174C3C] text-white shadow-xs'
                      : 'text-[#464C45] hover:text-[#174C3C]'
                  }`}
                >
                  ⚡ Cepat (Demo)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('direct')}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all text-center ${
                    activeTab === 'direct'
                      ? 'bg-[#174C3C] text-white shadow-xs'
                      : 'text-[#464C45] hover:text-[#174C3C]'
                  }`}
                >
                  📋 Formulir
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('clerk')}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all text-center ${
                    activeTab === 'clerk'
                      ? 'bg-[#174C3C] text-white shadow-xs'
                      : 'text-[#464C45] hover:text-[#174C3C]'
                  }`}
                >
                  🔐 Akun Clerk
                </button>
              </div>

              {/* TAB 1: 1-KLIK DEMO ACCESS (FOR EVALUATORS / SPEED) */}
              {activeTab === 'demo' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E6DF]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#174C3C] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        Mode Uji Coba Instan
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                        Tanpa Password
                      </span>
                    </div>
                    <p className="text-xs text-[#777D77] leading-relaxed">
                      Klik salah satu peran di bawah untuk langsung membuka dashboard dan menjelajahi semua fitur perpustakaan:
                    </p>
                  </div>

                  {/* Demo Buttons */}
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('siswa')}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#A8B9A4]/60 bg-white hover:bg-[#E7EDE5]/50 hover:border-[#174C3C] transition-all group shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center font-bold text-sm">
                          SS
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold text-xs sm:text-sm text-[#252925] group-hover:text-[#174C3C]">
                            Masuk sebagai Siswa (Demo)
                          </h4>
                          <p className="text-[11px] text-[#777D77]">
                            Kaysan Faras • NISN: 0081234567 • Akses Peminjaman
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#777D77] group-hover:text-[#174C3C] group-hover:translate-x-0.5 transition-all" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('admin')}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#174C3C] bg-[#174C3C] text-white hover:bg-[#12382F] transition-all group shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-sm">
                          AD
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold text-xs sm:text-sm text-white">
                            Masuk sebagai Admin Perpustakaan (Demo)
                          </h4>
                          <p className="text-[11px] text-white/80">
                            Petugas Pustakawan • Kelola Koleksi, Denda, Anggota
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: DIRECT FORM LOGIN (REAL DESKTOP INPUTS) */}
              {activeTab === 'direct' && (
                <motion.form
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleDirectLogin}
                  className="space-y-4"
                >
                  {/* Role Switcher */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#252925]">
                      Pilih Peran Akun:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setRoleSelect('siswa');
                          setEmailInput('siswa@perpuskita.id');
                        }}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                          roleSelect === 'siswa'
                            ? 'bg-[#E7EDE5] border-[#174C3C] text-[#174C3C]'
                            : 'bg-white border-[#E5E6DF] text-[#777D77] hover:bg-[#F7F6F2]'
                        }`}
                      >
                        Siswa / Anggota
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRoleSelect('admin');
                          setEmailInput('admin@perpuskita.id');
                        }}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                          roleSelect === 'admin'
                            ? 'bg-[#174C3C] border-[#174C3C] text-white'
                            : 'bg-white border-[#E5E6DF] text-[#777D77] hover:bg-[#F7F6F2]'
                        }`}
                      >
                        Petugas / Admin
                      </button>
                    </div>
                  </div>

                  {/* Email / ID Input */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#252925]">
                      Nomor Anggota / Email Perpustakaan:
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#777D77] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Contoh: LIB-2024-001 atau siswa@perpuskita.id"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F6F2] border border-[#E5E6DF] rounded-xl focus:outline-none focus:border-[#174C3C] focus:bg-white text-[#252925] transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-[#252925]">
                        Kata Sandi:
                      </label>
                      <button
                        type="button"
                        onClick={() => showToast('Petunjuk: Anda dapat menggunakan password demo "perpuskita2024" atau 1-Klik Demo.', 'info')}
                        className="text-[11px] text-[#174C3C] hover:underline"
                      >
                        Lupa sandi?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#777D77] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Masukkan kata sandi..."
                        className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-[#F7F6F2] border border-[#E5E6DF] rounded-xl focus:outline-none focus:border-[#174C3C] focus:bg-white text-[#252925] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777D77] hover:text-[#252925]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-[#174C3C] hover:bg-[#12382F] text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>{isSubmitting ? 'Memproses Masuk...' : 'Masuk ke Perpustakaan'}</span>
                  </button>
                </motion.form>
              )}

              {/* TAB 3: CLERK AUTH FORM */}
              {activeTab === 'clerk' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <SignIn
                    routing="path"
                    path="/sign-in"
                    signUpUrl="/sign-up"
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
                        rootBox: 'w-full max-w-none',
                        cardBox: 'w-full max-w-none shadow-none border-0 p-0 m-0',
                        card: 'w-full max-w-none shadow-none border-0 p-0 m-0 bg-transparent',
                        header: 'hidden',
                        headerTitle: 'hidden',
                        headerSubtitle: 'hidden',
                        formButtonPrimary: 'w-full bg-[#174C3C] hover:bg-[#12382F] text-white font-semibold text-sm transition-all shadow-md py-3 rounded-xl mt-2',
                        formFieldInput: 'w-full border border-[#E5E6DF] focus:border-[#174C3C] focus:ring-1 focus:ring-[#174C3C] rounded-xl text-sm bg-[#F7F6F2]/70 focus:bg-white transition-all py-2.5 px-3.5',
                        socialButtonsBlockButton: 'w-full border border-[#E5E6DF] hover:bg-[#F7F6F2] hover:border-[#A8B9A4] rounded-xl text-xs font-semibold py-2.5 transition-all text-[#252925]',
                        footerActionLink: 'text-[#174C3C] font-semibold hover:underline',
                        footerActionText: 'text-xs text-[#777D77]',
                        identityPreviewText: 'text-xs text-[#252925]',
                        formFieldLabel: 'text-xs font-semibold uppercase tracking-wider text-[#252925] mb-1',
                      },
                    }}
                  />
                </motion.div>
              )}

              {/* FOOTER NOTICE */}
              <div className="mt-6 pt-5 border-t border-[#E5E6DF] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#777D77]">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#174C3C]" />
                  <span>Belum punya akun anggota?</span>
                </div>
                <Link 
                  href="/sign-up" 
                  className="font-semibold text-[#174C3C] hover:underline flex items-center gap-1"
                >
                  <span>Daftar Akun Baru</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* STANDARD WEBSITE FOOTER */}
      <Footer />

    </div>
  );
}
