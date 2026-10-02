import React from 'react';
import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';
import { Logo } from '@/components/ui/Logo';
import { ArrowLeft, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F7F6F2]">
      
      {/* AREA KIRI: EDITORIAL SHOWCASE (DESKTOP) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#12382F] text-white flex-col justify-between p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#174C3C]/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#174C3C]/30 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        {/* Top: Logo & Back Link */}
        <div className="relative z-10 flex items-center justify-between">
          <Logo variant="white" size="md" href="/" />
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#DEECE6] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Middle: Library Editorial Photo & Headline */}
        <div className="relative z-10 my-auto py-10 max-w-lg">
          <div className="relative rounded-2xl overflow-hidden shadow-floating border border-white/15 aspect-[16/10] mb-8 bg-[#0C241E]">
            <img
              src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80"
              alt="Perpustakaan Digital PerpusKita"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12382F]/90 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs">
              <span className="font-serif italic font-medium text-white">
                &ldquo;Ruang literasi terbuka bagi setiap insan pembelajar.&rdquo;
              </span>
            </div>
          </div>

          <span className="inline-block text-[11px] uppercase tracking-widest text-[#A8B9A4] font-semibold mb-2">
            Pendaftaran Anggota Baru
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight leading-snug">
            Bergabung dengan PerpusKita.
          </h2>
          <p className="text-sm text-[#DEECE6]/85 mt-2 leading-relaxed">
            Mulai jelajahi ribuan buku berkualitas, nikmati layanan peminjaman digital modern, dan bangun kebiasaan membaca yang bermakna.
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-[#A8B9A4]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#DEECE6]" />
            <span>Keanggotaan Digital Resmi</span>
          </div>
          <span>PerpusKita Engine v2.4</span>
        </div>
      </div>

      {/* AREA KANAN: FORM REGISTRASI CLERK */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        
        {/* Mobile Header with Logo */}
        <div className="lg:hidden flex items-center justify-between pb-6 mb-4 border-b border-[#E5E6DF]">
          <Logo size="md" href="/" />
          <Link
            href="/"
            className="text-xs font-semibold text-[#174C3C] hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
        </div>

        {/* Center: Clerk SignUp Component styled to PerpusKita Editorial System */}
        <div className="my-auto mx-auto w-full max-w-md py-6">
          <div className="mb-6 text-center sm:text-left">
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#174C3C]">
              Registrasi Anggota
            </h1>
            <p className="text-xs sm:text-sm text-[#777D77] mt-1">
              Daftarkan diri Anda untuk mendapatkan nomor keanggotaan perpustakaan digital.
            </p>
          </div>

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
                borderRadius: '0.625rem',
                fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
              },
              elements: {
                rootBox: 'w-full',
                card: 'border border-[#E5E6DF] shadow-editorial rounded-2xl bg-white p-6 sm:p-8',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                formButtonPrimary: 'bg-[#174C3C] hover:bg-[#12382F] text-white font-semibold text-sm transition-colors shadow-xs py-2.5 rounded-xl',
                formFieldInput: 'border border-[#E5E6DF] focus:border-[#174C3C] rounded-lg text-sm bg-[#F7F6F2]/60 focus:bg-white',
                footerActionLink: 'text-[#174C3C] font-semibold hover:underline',
                identityPreviewText: 'text-xs text-[#252925]',
                formFieldLabel: 'text-xs font-semibold uppercase tracking-wider text-[#252925]',
              },
            }}
          />
        </div>

        {/* Footer info */}
        <div className="pt-6 text-center text-xs text-[#777D77]">
          <span>Sudah memiliki akun anggota? </span>
          <Link href="/sign-in" className="font-semibold text-[#174C3C] hover:underline">
            Masuk ke Akun
          </Link>
        </div>

      </div>

    </div>
  );
}
