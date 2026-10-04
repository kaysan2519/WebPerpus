'use client';

import React, { useState } from 'react';
import { Book } from '@/types';
import { useLibrary } from '@/context/LibraryContext';
import { X, Calendar, BookOpen, AlertCircle, CheckCircle2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdropVariants, modalContentVariants } from '@/lib/motion';

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        >
          <motion.div
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl border border-[#E5E6DF] shadow-floating overflow-hidden"
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

            {/* Content Body */}
            <div className="p-6 space-y-5">
              {/* Book Summary Card */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl border border-[#E5E6DF] bg-[#FAF9F6]">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-14 h-20 object-cover rounded-md shadow-xs shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#E7EDE5] text-[#174C3C]">
                    {book.category}
                  </span>
                  <h4 className="font-semibold text-sm text-[#252925] truncate mt-1">
                    {book.title}
                  </h4>
                  <p className="text-xs text-[#777D77]">{book.author}</p>
                  <p className="text-[11px] font-mono text-[#174C3C] mt-1">
                    Lokasi: {book.shelfLocation}
                  </p>
                </div>
              </div>

              {/* Borrower Profile */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#E5E6DF] text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#174C3C] text-white flex items-center justify-center font-semibold text-[10px]">
                    SS
                  </div>
                  <div>
                    <span className="font-semibold text-[#252925] block">{currentUser.name}</span>
                    <span className="text-[#777D77]">{currentUser.memberId} • Anggota Siswa</span>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                  Akun Aktif
                </span>
              </div>

              {/* Duration Options */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#252925] mb-2">
                  Pilih Durasi Masa Pinjam
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[7, 14, 21].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setDurationDays(days)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        durationDays === days
                          ? 'border-[#174C3C] bg-[#E7EDE5] text-[#174C3C]'
                          : 'border-[#E5E6DF] bg-white text-[#252925] hover:border-[#A8B9A4]'
                      }`}
                    >
                      {days} Hari
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date Indicator */}
              <div className="p-3.5 rounded-xl border border-[#A8B9A4]/40 bg-[#E7EDE5]/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#174C3C]">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">Tanggal Batas Pengembalian:</span>
                </div>
                <span className="font-bold text-[#174C3C] font-mono">
                  {calculateDueDate(durationDays)}
                </span>
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="agree-rules"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-[#174C3C] focus:ring-[#174C3C]"
                />
                <label htmlFor="agree-rules" className="text-[11px] text-[#777D77] leading-relaxed cursor-pointer select-none">
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
