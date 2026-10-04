'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  QrCode, 
  Barcode, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  User, 
  ArrowRight, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Sparkles,
  MapPin,
  Clock,
  Check
} from 'lucide-react';
import { useLibrary } from '@/context/LibraryContext';
import { Book, MemberRecord, LoanRecord } from '@/types';
import { modalBackdropVariants, modalContentVariants } from '@/lib/motion';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookSelected?: (book: Book) => void;
  onMemberSelected?: (member: MemberRecord) => void;
}

type ScanMode = 'book' | 'member';

export function BarcodeScannerModal({ 
  isOpen, 
  onClose, 
  onBookSelected, 
  onMemberSelected 
}: BarcodeScannerModalProps) {
  const { books, members, loans, returnLoan, borrowBook, showToast } = useLibrary();

  const [scanMode, setScanMode] = useState<ScanMode>('book');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isScanningActive, setIsScanningActive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scannedBook, setScannedBook] = useState<Book | null>(null);
  const [scannedMember, setScannedMember] = useState<MemberRecord | null>(null);
  const [scanSuccessAnim, setScanSuccessAnim] = useState(false);

  // Play crisp scanner beep using Web Audio API
  const playBeep = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, ctx.currentTime); // High pitch circulation beep (A6)
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (_) {}
  };

  // Perform lookup by scanned code
  const handleProcessScan = (code: string) => {
    const clean = code.trim().toLowerCase();
    if (!clean) return;

    playBeep();
    setScanSuccessAnim(true);
    setTimeout(() => setScanSuccessAnim(false), 800);

    if (scanMode === 'book') {
      // Look up book by ISBN, ID, or title
      const found = books.find((b) => 
        b.isbn.toLowerCase().includes(clean) || 
        b.id.toLowerCase() === clean || 
        b.slug.toLowerCase().includes(clean) ||
        b.title.toLowerCase().includes(clean)
      );

      if (found) {
        setScannedBook(found);
        setScannedMember(null);
        showToast(`Buku terdeteksi: "${found.title}" (${found.shelfLocation})`, 'success');
      } else {
        setScannedBook(null);
        showToast(`Barcode "${code}" tidak terdaftar dalam katalog buku`, 'error');
      }
    } else {
      // Look up member by memberId, name, or ID
      const found = members.find((m) => 
        m.memberId.toLowerCase().includes(clean) || 
        m.name.toLowerCase().includes(clean) ||
        m.id.toLowerCase() === clean
      );

      if (found) {
        setScannedMember(found);
        setScannedBook(null);
        showToast(`Anggota terdeteksi: ${found.name} (${found.memberId})`, 'success');
      } else {
        setScannedMember(null);
        showToast(`Kartu Anggota "${code}" tidak ditemukan dalam direktori`, 'error');
      }
    }
  };

  // Reset when modal closes/opens
  useEffect(() => {
    if (isOpen) {
      setBarcodeInput('');
      setScannedBook(null);
      setScannedMember(null);
      setIsScanningActive(true);
    }
  }, [isOpen]);

  // Find active loans for scanned book
  const activeBookLoan = scannedBook 
    ? loans.find((l) => l.bookId === scannedBook.id && l.status === 'Dipinjam') 
    : null;

  // Find active loans for scanned member
  const memberActiveLoans = scannedMember
    ? loans.filter((l) => l.userId === scannedMember.id && l.status === 'Dipinjam')
    : [];

  const handleReturnAction = () => {
    if (activeBookLoan) {
      returnLoan(activeBookLoan.id);
      setScannedBook((prev) => prev ? { ...prev, status: 'Tersedia' } : null);
    }
  };

  const handleQuickBorrowAction = () => {
    if (scannedBook && scannedBook.status === 'Tersedia') {
      borrowBook(scannedBook.id, 14);
      setScannedBook((prev) => prev ? { ...prev, status: 'Dipinjam' } : null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-xl bg-white rounded-2xl shadow-floating border border-[#E5E6DF] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#E5E6DF] flex items-center justify-between bg-[#F7F6F2]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#174C3C] text-white flex items-center justify-center">
                  <Barcode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#174C3C]">
                    Simulasi Scanner Barcode & ISBN Sirkulasi
                  </h3>
                  <p className="text-xs text-[#777D77]">Pustakawan Digital Desk Reader</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    soundEnabled ? 'text-[#174C3C] border-[#A8B9A4]/40 bg-[#E7EDE5]' : 'text-gray-400 border-gray-200'
                  }`}
                  title={soundEnabled ? 'Suara Scanner Aktif' : 'Mute Suara Scanner'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-[#777D77] hover:text-[#252925] hover:bg-[#E5E6DF]/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mode Tabs */}
            <div className="px-6 pt-4 pb-2 border-b border-[#E5E6DF] flex gap-2 bg-white">
              <button
                onClick={() => {
                  setScanMode('book');
                  setScannedBook(null);
                  setScannedMember(null);
                }}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                  scanMode === 'book'
                    ? 'bg-[#174C3C] text-white shadow-xs'
                    : 'bg-[#F7F6F2] text-[#777D77] hover:text-[#252925]'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Pindai Barcode / ISBN Buku</span>
              </button>
              <button
                onClick={() => {
                  setScanMode('member');
                  setScannedBook(null);
                  setScannedMember(null);
                }}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                  scanMode === 'member'
                    ? 'bg-[#174C3C] text-white shadow-xs'
                    : 'bg-[#F7F6F2] text-[#777D77] hover:text-[#252925]'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Pindai Kartu Anggota Siswa</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {/* Virtual Scanner Viewfinder */}
              <div className="relative w-full h-44 rounded-2xl bg-[#0F172A] border border-gray-700 overflow-hidden flex flex-col items-center justify-center shadow-inner">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]" />

                {/* Viewfinder Target Bracket Corners */}
                <div className="relative w-56 h-28 border-2 border-dashed border-emerald-400/60 rounded-xl flex items-center justify-center">
                  
                  {/* Laser Beam Motion Animation */}
                  {isScanningActive && (
                    <motion.div
                      animate={{ y: [-48, 48, -48] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                      className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_#ef4444]"
                    />
                  )}

                  {/* Corner Targets */}
                  <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

                  {/* Status Indicator inside Viewfinder */}
                  <div className="text-center z-10 space-y-1">
                    <Barcode className="w-8 h-8 text-white/50 mx-auto" />
                    <p className="text-[11px] font-mono text-emerald-400 tracking-wider">
                      {scanMode === 'book' ? 'ARAHKAN BARCODE BUKU' : 'ARAHKAN KARTU ANGGOTA'}
                    </p>
                  </div>

                  {/* Success flash overlay */}
                  {scanSuccessAnim && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-emerald-400 rounded-xl"
                    />
                  )}
                </div>

                {/* Live Optical Reader Status */}
                <div className="absolute bottom-2.5 flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Kamera & Sensor Sirkulasi Siap (1D / 2D / QR Ready)</span>
                </div>
              </div>

              {/* Quick Preset Barcode Chips (Instant Demo Simulator) */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[#777D77] uppercase tracking-wider block">
                  Simulasi Cepat (Klik Contoh Barcode):
                </span>
                <div className="flex flex-wrap gap-2">
                  {scanMode === 'book' ? (
                    <>
                      <button
                        onClick={() => handleProcessScan('978-602-031-258-3')}
                        className="px-2.5 py-1 text-xs rounded-full bg-[#E7EDE5] border border-[#A8B9A4]/40 text-[#174C3C] hover:bg-[#BCD9CF] transition-colors font-mono"
                      >
                        Cantik Itu Luka (978-602-031-258-3)
                      </button>
                      <button
                        onClick={() => handleProcessScan('atomic-habits')}
                        className="px-2.5 py-1 text-xs rounded-full bg-[#E7EDE5] border border-[#A8B9A4]/40 text-[#174C3C] hover:bg-[#BCD9CF] transition-colors font-mono"
                      >
                        Atomic Habits (BC-PK-001)
                      </button>
                      <button
                        onClick={() => handleProcessScan('laut-bercerita')}
                        className="px-2.5 py-1 text-xs rounded-full bg-[#E7EDE5] border border-[#A8B9A4]/40 text-[#174C3C] hover:bg-[#BCD9CF] transition-colors font-mono"
                      >
                        Laut Bercerita (Dipinjam)
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleProcessScan('PK-2024-8841')}
                        className="px-2.5 py-1 text-xs rounded-full bg-[#E7EDE5] border border-[#A8B9A4]/40 text-[#174C3C] hover:bg-[#BCD9CF] transition-colors font-mono"
                      >
                        Kaysan Rafif (PK-2024-8841)
                      </button>
                      <button
                        onClick={() => handleProcessScan('PK-2024-1002')}
                        className="px-2.5 py-1 text-xs rounded-full bg-[#E7EDE5] border border-[#A8B9A4]/40 text-[#174C3C] hover:bg-[#BCD9CF] transition-colors font-mono"
                      >
                        Budi Santoso (PK-2024-1002)
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Manual Barcode Input Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProcessScan(barcodeInput);
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder={scanMode === 'book' ? "Ketik ISBN atau judul buku..." : "Ketik ID anggota (mis. PK-2024-8841)..."}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E6DF] focus:outline-none focus:border-[#174C3C] font-mono"
                  />
                  <Search className="w-4 h-4 text-[#777D77] absolute left-3 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#174C3C] hover:bg-[#12382F] text-white text-xs font-semibold shrink-0 transition-colors shadow-xs"
                >
                  Pindai
                </button>
              </form>

              {/* Scanned Book Details Result Card */}
              {scannedBook && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl border border-[#A8B9A4] bg-[#E7EDE5]/40 space-y-3"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={scannedBook.coverImage}
                      alt={scannedBook.title}
                      className="w-14 h-20 object-cover rounded-md shadow-xs shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#174C3C] text-white font-semibold">
                          {scannedBook.category}
                        </span>
                        <span className={`text-[11px] font-semibold ${
                          scannedBook.status === 'Tersedia' ? 'text-emerald-700' : 'text-rose-600'
                        }`}>
                          {scannedBook.status}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-[#252925] truncate">
                        {scannedBook.title}
                      </h4>
                      <p className="text-xs text-[#777D77] truncate">
                        {scannedBook.author} • {scannedBook.publisher}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-[#174C3C]">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Lokasi: <strong>{scannedBook.shelfLocation}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Circulation Quick Actions */}
                  <div className="pt-2 border-t border-[#A8B9A4]/30 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-[#777D77]">
                      ISBN: {scannedBook.isbn}
                    </span>
                    <div className="flex items-center gap-2">
                      {scannedBook.status === 'Dipinjam' ? (
                        <button
                          onClick={handleReturnAction}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
                        >
                          Proses Pengembalian Cepat
                        </button>
                      ) : (
                        <button
                          onClick={handleQuickBorrowAction}
                          className="px-3 py-1.5 rounded-lg bg-[#174C3C] hover:bg-[#12382F] text-white text-xs font-semibold transition-colors shadow-xs"
                        >
                          Pinjamkan Langsung
                        </button>
                      )}
                      {onBookSelected && (
                        <button
                          onClick={() => {
                            onBookSelected(scannedBook);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg border border-[#A8B9A4] bg-white text-[#174C3C] text-xs font-semibold hover:bg-[#E7EDE5] transition-colors"
                        >
                          Pilih
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Scanned Member Details Result Card */}
              {scannedMember && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl border border-[#A8B9A4] bg-[#E7EDE5]/40 space-y-3"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={scannedMember.avatar}
                      alt={scannedMember.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#174C3C] text-white font-semibold">
                          {scannedMember.role}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700">
                          {scannedMember.status}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-[#252925] truncate mt-0.5">
                        {scannedMember.name}
                      </h4>
                      <p className="text-xs font-mono text-[#777D77]">
                        ID: {scannedMember.memberId} • Pinjaman Aktif: {memberActiveLoans.length}
                      </p>
                    </div>
                  </div>

                  {/* Active Loans Preview */}
                  {memberActiveLoans.length > 0 && (
                    <div className="pt-2 border-t border-[#A8B9A4]/30 space-y-1.5">
                      <p className="text-[11px] font-semibold text-[#174C3C]">
                        Buku Sedang Dipinjam ({memberActiveLoans.length}):
                      </p>
                      {memberActiveLoans.map((l) => (
                        <div key={l.id} className="text-xs flex justify-between bg-white/70 p-2 rounded-lg">
                          <span className="truncate font-medium">{l.bookTitle}</span>
                          <span className="text-[#777D77] shrink-0 font-mono">Tempo: {l.dueDate}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {onMemberSelected && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          onMemberSelected(scannedMember);
                          onClose();
                        }}
                        className="px-4 py-1.5 rounded-lg bg-[#174C3C] text-white text-xs font-semibold hover:bg-[#12382F] transition-colors shadow-xs"
                      >
                        Buka Profil Sirkulasi Anggota
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
