'use client';

import React, { useState } from 'react';
import { Book } from '@/types';
import { useLibrary } from '@/context/LibraryContext';
import { X, Calendar, BookOpen, AlertCircle, CheckCircle2, User } from 'lucide-react';

interface BorrowModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export function BorrowModal({ book, isOpen, onClose }: BorrowModalProps) {
  const { borrowBook, currentUser } = useLibrary();
  const [durationDays, setDurationDays] = useState<number>(14);
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const calculateDueDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const handleConfirm = () => {
    if (!agreed) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const res = borrowBook(book.id, durationDays);
      setIsSubmitting(false);
      if (res.success) {
        onClose();
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl border border-[#E5E6DF] shadow-floating overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E6DF] bg-[#F7F6F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#174C3C]">Formulir Peminjaman Buku</h3>
              <p className="text-xs text-[#777D77]">Konfirmasi peminjaman buku ke akun anggota</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#777D77] hover:text-[#252925] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Book Summary Card */}
          <div className="flex gap-4 p-3.5 rounded-xl bg-[#F7F6F2] border border-[#E5E6DF]">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-16 h-22 object-cover rounded-md shadow-xs shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#E7EDE5] text-[#174C3C]">
                {book.category}
              </span>
              <h4 className="font-semibold text-sm text-[#252925] mt-1 truncate">{book.title}</h4>
              <p className="text-xs text-[#777D77] truncate">{book.author}</p>
              <p className="text-[11px] text-[#777D77] mt-1.5 font-mono">
                Lokasi: {book.shelfLocation}
              </p>
            </div>
          </div>

          {/* Member Card */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-[#E5E6DF] text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#174C3C] text-white flex items-center justify-center font-semibold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-[#252925]">{currentUser.name}</p>
                <p className="text-[#777D77]">No. Anggota: {currentUser.memberId || 'PK-2024-8841'}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#E7EDE5] text-[#174C3C] font-semibold text-[11px]">
              Aktif
            </span>
          </div>

          {/* Duration Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#252925] mb-2">
              Durasi Peminjaman
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[7, 14, 21].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setDurationDays(days)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                    durationDays === days
                      ? 'border-[#174C3C] bg-[#174C3C] text-white shadow-xs'
                      : 'border-[#E5E6DF] bg-white text-[#252925] hover:border-[#A8B9A4]'
                  }`}
                >
                  <span className="block font-bold text-sm">{days} Hari</span>
                  <span className={`text-[10px] ${durationDays === days ? 'text-[#E7EDE5]' : 'text-[#777D77]'}`}>
                    {days === 14 ? 'Standar' : days === 7 ? 'Cepat' : 'Maksimal'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Return Date estimation */}
          <div className="p-3 rounded-xl bg-[#E7EDE5]/50 border border-[#A8B9A4]/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#174C3C]">
              <Calendar className="w-4 h-4" />
              <span>Batas Waktu Pengembalian:</span>
            </div>
            <span className="font-bold text-[#174C3C] text-sm">
              {calculateDueDate(durationDays)}
            </span>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded border-[#A8B9A4] text-[#174C3C] focus:ring-[#174C3C]"
            />
            <label htmlFor="terms" className="text-xs text-[#777D77] leading-tight select-none">
              Saya bersedia memelihara keutuhan buku dan mengembalikan sebelum jatuh tempo. Perpanjangan dapat dilakukan maksimal 2 kali secara mandiri.
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#E5E6DF] bg-[#F7F6F2] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#777D77] hover:text-[#252925] transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={!agreed || isSubmitting || book.status === 'Dipinjam'}
            onClick={handleConfirm}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#174C3C] hover:bg-[#12382F] rounded-lg transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <span>Memproses...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Konfirmasi Pinjam</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
