'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLibrary } from '@/context/LibraryContext';
import { LoanRecord, LoanStatus } from '@/types';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCw, 
  ChevronRight, 
  ArrowLeft,
  Calendar,
  BookOpen,
  Filter,
  Search,
  DollarSign
} from 'lucide-react';

export default function RiwayatPeminjamanPage() {
  const { loans, renewLoan, returnLoan, fines, payFine, currentUser } = useLibrary();
  const [selectedFilter, setSelectedFilter] = useState<'Semua' | LoanStatus>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs: Array<'Semua' | LoanStatus> = ['Semua', 'Dipinjam', 'Dikembalikan', 'Terlambat'];

  const filteredLoans = loans.filter((loan) => {
    if (selectedFilter !== 'Semua' && loan.status !== selectedFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return loan.bookTitle.toLowerCase().includes(q) || loan.bookAuthor.toLowerCase().includes(q);
    }
    return true;
  });

  const activeCount = loans.filter((l) => l.status === 'Dipinjam').length;
  const overdueCount = loans.filter((l) => l.status === 'Terlambat').length;
  const returnedCount = loans.filter((l) => l.status === 'Dikembalikan').length;
  const pendingFines = fines.filter((f) => f.status === 'Belum Dibayar');
  const totalPendingFineAmount = pendingFines.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-[#174C3C] hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Dashboard Siswa</span>
            </Link>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#174C3C]">
            Riwayat & Status Peminjaman
          </h1>
          <p className="text-sm text-[#777D77] mt-1">
            Kelola dan pantau semua transaksi peminjaman, perpanjangan, serta denda keterlambatan buku Anda.
          </p>
        </div>

        {/* 4 Quick Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-3.5 rounded-xl border border-[#E5E6DF] shadow-2xs">
            <span className="text-[11px] text-[#777D77] block font-medium">Sedang Dipinjam</span>
            <span className="text-xl font-serif font-bold text-[#174C3C] mt-0.5 block">{activeCount} Buku</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#E5E6DF] shadow-2xs">
            <span className="text-[11px] text-[#777D77] block font-medium">Telah Dikembalikan</span>
            <span className="text-xl font-serif font-bold text-[#252925] mt-0.5 block">{returnedCount} Buku</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#E5E6DF] shadow-2xs">
            <span className="text-[11px] text-[#777D77] block font-medium">Terlambat</span>
            <span className="text-xl font-serif font-bold text-rose-600 mt-0.5 block">{overdueCount} Buku</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#E5E6DF] shadow-2xs">
            <span className="text-[11px] text-[#777D77] block font-medium">Denda Belum Lunas</span>
            <span className="text-xl font-serif font-bold text-amber-700 mt-0.5 block">Rp {totalPendingFineAmount.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedFilter(tab)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedFilter === tab
                    ? 'bg-[#174C3C] text-white shadow-xs'
                    : 'bg-white text-[#252925] border border-[#E5E6DF] hover:border-[#174C3C]/40'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-[#777D77] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari buku dalam riwayat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white rounded-lg border border-[#E5E6DF] text-xs text-[#252925] focus:outline-none focus:border-[#174C3C]"
            />
          </div>
        </div>

        {/* Loan Items List */}
        <div className="bg-white rounded-2xl border border-[#E5E6DF] shadow-xs divide-y divide-[#E5E6DF] overflow-hidden">
          {filteredLoans.length === 0 ? (
            <div className="p-12 text-center text-[#777D77]">
              <Clock className="w-8 h-8 text-[#A8B9A4] mx-auto mb-2" />
              <p className="text-sm font-medium">Tidak ada data peminjaman yang cocok.</p>
              <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau tab filter di atas.</p>
            </div>
          ) : (
            filteredLoans.map((loan) => {
              const isBorrowed = loan.status === 'Dipinjam';
              const isReturned = loan.status === 'Dikembalikan';
              const isOverdue = loan.status === 'Terlambat';
              const fine = fines.find((f) => f.loanId === loan.id);

              return (
                <div
                  key={loan.id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF9F6] transition-colors"
                >
                  {/* Left: Book Cover & Details */}
                  <div className="flex items-center gap-4">
                    <img
                      src={loan.bookCover}
                      alt={loan.bookTitle}
                      className="w-14 h-20 object-cover rounded-md shadow-xs shrink-0"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                            isBorrowed
                              ? 'bg-[#E7EDE5] text-[#174C3C]'
                              : isReturned
                              ? 'bg-[#F0F4EE] text-[#777D77]'
                              : 'bg-[#FEECEB] text-[#C0392B]'
                          }`}
                        >
                          {loan.status}
                        </span>
                        {loan.renewCount > 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FAF9F6] border border-[#E5E6DF] text-[#777D77]">
                            Diperpanjang {loan.renewCount}x
                          </span>
                        )}
                        {fine && (
                          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                            fine.status === 'Belum Dibayar'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            Denda: Rp {fine.amount.toLocaleString('id-ID')} ({fine.status})
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-base text-[#252925] leading-snug">
                        {loan.bookTitle}
                      </h3>
                      <p className="text-xs text-[#777D77]">{loan.bookAuthor}</p>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs">
                        <span className="text-[#777D77]">
                          Dipinjam: <strong className="text-[#252925] font-medium">{loan.borrowDate}</strong>
                        </span>
                        <span className="text-[#777D77]">•</span>
                        {isReturned ? (
                          <span className="text-[#174C3C]">
                            Dikembalikan: <strong className="font-medium">{loan.returnDate || 'Selesai'}</strong>
                          </span>
                        ) : (
                          <span className={isOverdue ? 'text-[#C0392B]' : 'text-[#174C3C]'}>
                            Jatuh Tempo: <strong className="font-medium">{loan.dueDate}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                    {isBorrowed && (
                      <>
                        <button
                          onClick={() => renewLoan(loan.id)}
                          disabled={!loan.renewable}
                          className="px-4 py-2 rounded-lg border border-[#174C3C] text-[#174C3C] hover:bg-[#E7EDE5] text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          Perpanjang
                        </button>
                        <button
                          onClick={() => returnLoan(loan.id)}
                          className="px-4 py-2 rounded-lg bg-[#174C3C] text-white hover:bg-[#12382F] text-xs font-semibold transition-colors shadow-xs"
                        >
                          Kembalikan
                        </button>
                      </>
                    )}

                    {fine && fine.status === 'Belum Dibayar' && (
                      <button
                        onClick={() => payFine(fine.id)}
                        className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors shadow-xs"
                      >
                        Bayar Denda
                      </button>
                    )}

                    {isReturned && (
                      <Link
                        href={`/katalog?q=${encodeURIComponent(loan.bookTitle)}`}
                        className="px-4 py-2 rounded-lg border border-[#E5E6DF] text-[#252925] hover:border-[#174C3C] hover:text-[#174C3C] text-xs font-semibold transition-colors"
                      >
                        Detail Buku
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Member Reminder Note */}
        <div className="mt-8 p-4 rounded-xl border border-[#A8B9A4]/30 bg-[#E7EDE5]/50 flex items-start gap-3 text-xs text-[#252925]/85">
          <Clock className="w-4 h-4 text-[#174C3C] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Peminjaman buku memiliki masa aktif 14 hari kalender. Anda dapat mengajukan perpanjangan sebanyak maksimal 2 kali berturut-turut asalkan buku tersebut tidak sedang dipesan oleh anggota lain. Keterlambatan dikenakan tarif Rp 1.000 per hari kalender.
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
}
