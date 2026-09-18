import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { BookOpen, MapPin, Clock, Mail, Phone, ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5E6DF] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Manifesto & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" href="/" />
            <p className="text-sm text-[#777D77] leading-relaxed max-w-sm">
              Perpustakaan digital dengan pendekatan editorial modern. Menyediakan akses buku pilihan, kurasi literatur bermutu, dan ruang bertumbuh bagi setiap pembelajar.
            </p>
            <div className="pt-2 text-xs text-[#777D77] space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#174C3C]" />
                <span>Gedung Literasi PerpusKita, Jl. Cendekia No. 18, Jakarta</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#174C3C]" />
                <span>Senin – Jumat: 08.00 – 17.00 WIB | Sabtu: 09.00 – 15.00 WIB</span>
              </div>
            </div>
          </div>

          {/* Col 3: Navigasi Koleksi */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#252925]">
              Koleksi & Kategori
            </h4>
            <ul className="space-y-2 text-sm text-[#777D77]">
              <li>
                <Link href="/katalog?cat=Fiksi" className="hover:text-[#174C3C] transition-colors">
                  Fiksi & Sastra
                </Link>
              </li>
              <li>
                <Link href="/katalog?cat=Pengembangan%20Diri" className="hover:text-[#174C3C] transition-colors">
                  Pengembangan Diri
                </Link>
              </li>
              <li>
                <Link href="/katalog?cat=Teknologi" className="hover:text-[#174C3C] transition-colors">
                  Teknologi & IT
                </Link>
              </li>
              <li>
                <Link href="/katalog?cat=Sejarah" className="hover:text-[#174C3C] transition-colors">
                  Sejarah & Sosial
                </Link>
              </li>
              <li>
                <Link href="/katalog?cat=Psikologi" className="hover:text-[#174C3C] transition-colors">
                  Psikologi & Filsafat
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Layanan Anggota */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#252925]">
              Layanan Anggota
            </h4>
            <ul className="space-y-2 text-sm text-[#777D77]">
              <li>
                <Link href="/dashboard" className="hover:text-[#174C3C] transition-colors">
                  Dashboard Anggota
                </Link>
              </li>
              <li>
                <Link href="/peminjaman" className="hover:text-[#174C3C] transition-colors">
                  Riwayat Peminjaman
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-[#174C3C] transition-colors">
                  Peminjaman Online
                </Link>
              </li>
              <li>
                <Link href="/dashboard/admin" className="hover:text-[#174C3C] transition-colors flex items-center gap-1">
                  <span>Panel Pengelola</span>
                  <ArrowUpRight className="w-3 h-3 text-[#A8B9A4]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Kontak & Bantuan */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#252925]">
              Bantuan & Kontak
            </h4>
            <p className="text-xs text-[#777D77] leading-relaxed">
              Membutuhkan bantuan peminjaman atau reservasi buku? Hubungi pustakawan kami.
            </p>
            <div className="space-y-2 pt-1">
              <a
                href="mailto:layanan@perpuskita.id"
                className="flex items-center gap-2 text-xs text-[#252925] hover:text-[#174C3C] font-medium"
              >
                <Mail className="w-3.5 h-3.5 text-[#174C3C]" />
                <span>layanan@perpuskita.id</span>
              </a>
              <a
                href="tel:+62215550198"
                className="flex items-center gap-2 text-xs text-[#252925] hover:text-[#174C3C] font-medium"
              >
                <Phone className="w-3.5 h-3.5 text-[#174C3C]" />
                <span>(021) 555-0198</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#E5E6DF] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777D77]">
          <p>© {new Date().getFullYear()} PerpusKita. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#174C3C] cursor-pointer">Panduan Pengguna</span>
            <span className="hover:text-[#174C3C] cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-[#174C3C] cursor-pointer">Ketentuan Layanan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
