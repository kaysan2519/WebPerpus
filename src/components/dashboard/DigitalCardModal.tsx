'use client';

import React from 'react';
import { UserProfile } from '@/context/LibraryContext';
import { X, Printer, QrCode, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdropVariants, modalContentVariants } from '@/lib/motion';

interface DigitalCardModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function DigitalCardModal({ user, isOpen, onClose }: DigitalCardModalProps) {
  const handlePrint = () => {
    window.print();
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
            className="w-full max-w-lg bg-white rounded-2xl border border-[#E5E6DF] shadow-floating overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E6DF] bg-[#F7F6F2]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#174C3C]" />
                <h3 className="font-serif font-bold text-base text-[#174C3C]">
                  Kartu Anggota Perpustakaan Resmi
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-[#777D77] hover:text-[#252925] hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Card Area */}
            <div className="p-6 sm:p-8 flex flex-col items-center justify-center bg-[#FAF9F6]">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', damping: 20 }}
                id="printable-member-card"
                className="w-full max-w-md bg-[#12382F] text-white rounded-2xl shadow-card p-6 relative overflow-hidden border border-[#174C3C]/60"
              >
                {/* Background Decorative Circles */}
                <div className="absolute top-0 right-0 w-56 h-56 bg-[#174C3C]/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#A8B9A4]/15 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-white/15 pb-4 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#E7EDE5] text-[#12382F] flex items-center justify-center font-bold text-sm shadow-xs">
                      P
                    </div>
                    <div>
                      <h4 className="font-serif font-bold tracking-wider text-xs text-[#E7EDE5]">
                        PERPUSKITA DIGITAL LIBRARY
                      </h4>
                      <p className="text-[10px] text-[#A8B9A4] tracking-tight">
                        Official Student & Community Card
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/15 text-[#E7EDE5] font-mono border border-white/10">
                    VALID 2026
                  </span>
                </div>

                {/* Card Body */}
                <div className="py-6 flex items-center gap-5 relative z-10">
                  <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-white/20 shadow-md shrink-0 bg-white/10">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-[#A8B9A4]">Nama Anggota</p>
                    <h3 className="font-serif text-lg font-bold tracking-tight text-white truncate">
                      {user.name}
                    </h3>
                    <p className="text-xs font-mono text-[#E7EDE5] bg-white/10 px-2 py-0.5 rounded inline-block">
                      ID: {user.memberId}
                    </p>
                    <p className="text-[11px] text-[#A8B9A4] mt-1">
                      Status: <span className="text-emerald-300 font-semibold">Anggota Siswa Aktif</span>
                    </p>
                  </div>
                </div>

                {/* Card Footer: Barcode & QR Code */}
                <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs text-[#A8B9A4] relative z-10">
                  <div className="space-y-1">
                    {/* Simulated Barcode */}
                    <div className="font-mono text-[9px] tracking-widest text-[#E7EDE5] flex items-center gap-0.5">
                      <span className="h-5 w-0.5 bg-white inline-block" />
                      <span className="h-5 w-1 bg-white inline-block" />
                      <span className="h-5 w-0.5 bg-white inline-block" />
                      <span className="h-5 w-1.5 bg-white inline-block" />
                      <span className="h-5 w-0.5 bg-white inline-block" />
                      <span className="h-5 w-1 bg-white inline-block" />
                      <span className="h-5 w-0.5 bg-white inline-block" />
                      <span className="h-5 w-1 bg-white inline-block" />
                      <span className="h-5 w-0.5 bg-white inline-block" />
                      <span className="h-5 w-1.5 bg-white inline-block" />
                      <span className="h-5 w-0.5 bg-white inline-block" />
                    </div>
                    <p className="text-[9px] font-mono text-[#A8B9A4] tracking-wider">
                      *{user.memberId}*
                    </p>
                  </div>

                  <div className="w-12 h-12 bg-white/10 rounded-lg border border-white/15 flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-white" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t border-[#E5E6DF] bg-[#F7F6F2] flex items-center justify-between">
              <p className="text-xs text-[#777D77]">
                Tunjukkan kartu ini kepada pustakawan saat meminjam buku fisik di rak.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-[#174C3C] text-white hover:bg-[#12382F] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Kartu</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-3 py-2 border border-[#E5E6DF] bg-white text-[#252925] rounded-lg text-xs font-semibold hover:border-[#174C3C]"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
