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
  Filter
} from 'lucide-react';

export default function RiwayatPeminjamanPage() {
  const { loans, renewLoan, returnLoan, currentUser } = useLibrary();
  const [selectedFilter, setSelectedFilter] = useState<'Semua' | LoanStatus>('Semua');

  const filterTabs: Array<'Semua' | LoanStatus> = ['Semua', 'Dipinjam', 'Dikembalikan', 'Terlambat'];

  const filteredLoans = loans.filter((loan) => {
    if (selectedFilter === 'Semua') return true;
    return loan.status === selectedFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header matching mockup */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-[#174C3C] hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Dashboard</span>
            </Link>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#174C3C]">
            Riwayat Peminjaman
          </h1>
          <p className="text-sm text-[#777D77] mt-1">
            Kelola semua riwayat peminjaman buku kamu di sini.
          </p>
        </div>

        {/* Filter Pills matching mockup */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
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

        {/* Loan Items List matching mockup */}
        <div className="bg-white rounded-2xl border border-[#E5E6DF] shadow-xs divide-y divide-[#E5E6DF] overflow-hidden">
          {filteredLoans.length === 0 ? (
            <div className="p-12 text-center text-[#777D77]">
              <Clock className="w-8 h-8 text-[#A8B9A4] mx-auto mb-2" />
              <p className="text-sm font-medium">Tidak ada data peminjaman untuk status ini.</p>
            </div>
          ) : (
            filteredLoans.map((loan) => {
              const isBorrowed = loan.status === 'Dipinjam';
              const isReturned = loan.status === 'Dikembalikan';
              const isOverdue = loan.status === 'Terlambat';

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
                      <div className="flex items-center gap-2 mb-1">
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
                          <span className="text-[10px] text-[#777D77]">
                            (Diperpanjang {loan.renewCount}x)
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
                            Dikembalikan: <strong className="font-medium">{loan.returnDate || '5 Sep 2024'}</strong>
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
                  <div className="flex items-center gap-2 self-end sm:self-center">
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
                          className="px-4 py-2 rounded-lg bg-[#174C3C] text-white hover:bg-[#12382F] text-xs font-semibold transition-colors"
                        >
                          Kembalikan
                        </button>
                      </>
                    )}

                    {isReturned && (
                      <Link
                        href={`/katalog?q=${encodeURIComponent(loan.bookTitle)}`}
                        className="px-4 py-2 rounded-lg border border-[#E5E6DF] text-[#252925] hover:border-[#174C3C] hover:text-[#174C3C] text-xs font-semibold transition-colors"
                      >
                        Detail
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
            Peminjaman buku memiliki masa aktif 14 hari kalender. Anda dapat mengajukan perpanjangan sebanyak maksimal 2 kali berturut-turut asalkan buku tersebut tidak sedang dipesan oleh anggota lain.
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
}
