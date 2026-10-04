'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  QrCode, 
  CreditCard, 
  Building2, 
  Copy, 
  Check, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Download, 
  ArrowRight,
  CheckCircle2,
  Printer,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { FineRecord } from '@/types';
import { useLibrary } from '@/context/LibraryContext';
import { modalBackdropVariants, modalContentVariants } from '@/lib/motion';

interface QRISPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  fine: FineRecord | null;
}

type PaymentTab = 'qris' | 'va';
type BankChoice = 'bca' | 'mandiri' | 'bri' | 'bni';

export function QRISPaymentModal({ isOpen, onClose, fine }: QRISPaymentModalProps) {
  const { payFineWithDetails } = useLibrary();
  const [activeTab, setActiveTab] = useState<PaymentTab>('qris');
  const [selectedBank, setSelectedBank] = useState<BankChoice>('bca');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(300); // 5 minutes
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Payment states: 'idle' | 'processing' | 'success'
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [settledRef, setSettledRef] = useState<string>('');

  // Countdown timer
  useEffect(() => {
    if (!isOpen || paymentState === 'success') return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, paymentState]);

  // Reset when fine changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setPaymentState('idle');
      setTimeLeftSeconds(300);
      setSettledRef('');
      setCopiedText(null);
    }
  }, [isOpen, fine?.id]);

  if (!fine) return null;

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const banks = {
    bca: { name: 'Bank BCA', prefix: '8801', vaNumber: `8801${fine.userId.replace(/[^0-9]/g, '') || '2024'}8841` },
    mandiri: { name: 'Bank Mandiri', prefix: '8910', vaNumber: `8910${fine.userId.replace(/[^0-9]/g, '') || '2024'}8841` },
    bri: { name: 'Bank BRI', prefix: '1280', vaNumber: `1280${fine.userId.replace(/[^0-9]/g, '') || '2024'}8841` },
    bni: { name: 'Bank BNI', prefix: '9881', vaNumber: `9881${fine.userId.replace(/[^0-9]/g, '') || '2024'}8841` },
  };

  const handleCopy = (text: string, label: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  const handleSimulatePayment = () => {
    setPaymentState('processing');
    const methodStr = activeTab === 'qris' ? 'QRIS Standar' : `Virtual Account ${banks[selectedBank].name}`;
    const generatedRef = `PAY-PK-${Date.now().toString().slice(-8)}`;

    setTimeout(() => {
      payFineWithDetails(fine.id, methodStr, generatedRef);
      setSettledRef(generatedRef);
      setPaymentState('success');
    }, 1400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-lg bg-white rounded-2xl shadow-floating border border-[#E5E6DF] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#E5E6DF] flex items-center justify-between bg-[#F7F6F2]/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#174C3C]/10 text-[#174C3C] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#174C3C]">
                    Pelunasan Denda Keterlambatan
                  </h3>
                  <p className="text-xs text-[#777D77]">Gateway Pembayaran Resmi Perpustakaan</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-[#777D77] hover:text-[#252925] hover:bg-[#E5E6DF]/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bill Summary Strip */}
            <div className="px-6 py-4 bg-[#E7EDE5]/40 border-b border-[#E5E6DF] flex items-center justify-between">
              <div>
                <p className="text-xs text-[#777D77]">Buku: <strong className="text-[#252925]">{fine.bookTitle}</strong></p>
                <p className="text-[11px] text-[#777D77] mt-0.5">
                  Terlambat {fine.daysOverdue} hari • Jatuh tempo {fine.dueDate}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#777D77]">Total Tagihan</span>
                <p className="font-serif text-xl font-bold text-[#174C3C]">
                  Rp {fine.amount.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {paymentState === 'success' ? (
                /* SUCCESS STATE VIEW */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-4 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>

                  <div>
                    <h4 className="font-serif text-xl font-bold text-[#174C3C]">
                      Pembayaran Berhasil Dilunasi!
                    </h4>
                    <p className="text-xs text-[#777D77] mt-1 max-w-sm mx-auto">
                      Denda sebesar Rp {fine.amount.toLocaleString('id-ID')} telah tercatat lunas pada sistem sirkulasi perpustakaan.
                    </p>
                  </div>

                  {/* Receipt Voucher */}
                  <div className="p-4 rounded-xl border border-[#E5E6DF] bg-[#F7F6F2] text-left text-xs space-y-2">
                    <div className="flex justify-between text-[#777D77]">
                      <span>Nomor Transaksi:</span>
                      <strong className="font-mono text-[#252925]">{settledRef}</strong>
                    </div>
                    <div className="flex justify-between text-[#777D77]">
                      <span>Metode Pembayaran:</span>
                      <strong className="text-[#252925]">{activeTab === 'qris' ? 'QRIS Standar' : `Virtual Account ${banks[selectedBank].name}`}</strong>
                    </div>
                    <div className="flex justify-between text-[#777D77]">
                      <span>Status Tagihan:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                        LUNAS
                      </span>
                    </div>
                    <div className="flex justify-between text-[#777D77]">
                      <span>Waktu Pelunasan:</span>
                      <strong className="text-[#252925]">Hari ini, Baru Saja</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2.5 rounded-xl border border-[#E5E6DF] hover:border-[#174C3C] text-[#252925] text-xs font-semibold flex items-center gap-2 transition-colors"
                    >
                      <Printer className="w-4 h-4 text-[#777D77]" />
                      <span>Cetak Kuitansi</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-xl bg-[#174C3C] hover:bg-[#12382F] text-white text-xs font-semibold transition-colors shadow-xs"
                    >
                      Selesai & Tutup
                    </button>
                  </div>
                </motion.div>
              ) : paymentState === 'processing' ? (
                /* PROCESSING STATE VIEW */
                <div className="py-12 text-center space-y-4">
                  <RefreshCw className="w-10 h-10 text-[#174C3C] animate-spin mx-auto" />
                  <h4 className="font-serif text-lg font-bold text-[#174C3C]">
                    Memverifikasi Pembayaran...
                  </h4>
                  <p className="text-xs text-[#777D77] max-w-xs mx-auto">
                    Menghubungkan ke gateway pembayaran dan memperbarui catatan denda perpustakaan...
                  </p>
                </div>
              ) : (
                /* PAYMENT SELECTION VIEW */
                <div className="space-y-5">
                  {/* Tab Selector */}
                  <div className="flex p-1 bg-[#F7F6F2] rounded-xl border border-[#E5E6DF]">
                    <button
                      onClick={() => setActiveTab('qris')}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                        activeTab === 'qris'
                          ? 'bg-white text-[#174C3C] shadow-xs'
                          : 'text-[#777D77] hover:text-[#252925]'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>QRIS (Gopay, OVO, Dana, BCA)</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('va')}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                        activeTab === 'va'
                          ? 'bg-white text-[#174C3C] shadow-xs'
                          : 'text-[#777D77] hover:text-[#252925]'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Virtual Account Bank</span>
                    </button>
                  </div>

                  {/* QRIS CONTENT */}
                  {activeTab === 'qris' ? (
                    <div className="space-y-4 text-center">
                      <div className="flex items-center justify-between text-xs text-[#777D77] px-1">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span>Berlaku hingga: <strong className="text-rose-600 font-mono">{timeFormatted}</strong></span>
                        </span>
                        <span className="text-[11px] bg-rose-50 border border-rose-200 text-rose-700 px-2 py-0.5 rounded-full font-medium">
                          Otomatis Terverifikasi
                        </span>
                      </div>

                      {/* Realistic QR Canvas Visual */}
                      <div className="p-5 rounded-2xl border-2 border-dashed border-[#A8B9A4] bg-white inline-block shadow-sm">
                        <div className="bg-[#174C3C] text-white text-[11px] font-bold tracking-widest uppercase py-1 px-4 rounded-md mb-3 flex items-center justify-center gap-1.5">
                          <QrCode className="w-3.5 h-3.5" />
                          <span>QRIS NASIONAL</span>
                        </div>

                        {/* Interactive Styled QR Visual Pattern */}
                        <div className="w-48 h-48 mx-auto bg-white p-2 border border-[#E5E6DF] rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
                          {/* Simulated SVG QR Graphic */}
                          <svg className="w-full h-full text-[#174C3C]" viewBox="0 0 100 100" fill="currentColor">
                            {/* Top Left Marker */}
                            <rect x="5" y="5" width="25" height="25" rx="3" fill="#174C3C" />
                            <rect x="10" y="10" width="15" height="15" fill="white" />
                            <rect x="13" y="13" width="9" height="9" fill="#174C3C" />

                            {/* Top Right Marker */}
                            <rect x="70" y="5" width="25" height="25" rx="3" fill="#174C3C" />
                            <rect x="75" y="10" width="15" height="15" fill="white" />
                            <rect x="78" y="13" width="9" height="9" fill="#174C3C" />

                            {/* Bottom Left Marker */}
                            <rect x="5" y="70" width="25" height="25" rx="3" fill="#174C3C" />
                            <rect x="10" y="75" width="15" height="15" fill="white" />
                            <rect x="13" y="78" width="9" height="9" fill="#174C3C" />

                            {/* Center Data Matrix Pixels */}
                            <rect x="35" y="15" width="6" height="6" />
                            <rect x="45" y="25" width="6" height="6" />
                            <rect x="55" y="15" width="6" height="6" />
                            <rect x="35" y="35" width="6" height="6" />
                            <rect x="45" y="45" width="10" height="10" rx="2" fill="#174C3C" />
                            <rect x="60" y="35" width="6" height="6" />
                            <rect x="70" y="45" width="6" height="6" />
                            <rect x="80" y="35" width="6" height="6" />
                            <rect x="35" y="60" width="6" height="6" />
                            <rect x="45" y="70" width="6" height="6" />
                            <rect x="55" y="60" width="6" height="6" />
                            <rect x="65" y="70" width="6" height="6" />
                            <rect x="75" y="60" width="6" height="6" />
                            <rect x="85" y="75" width="6" height="6" />
                            <rect x="15" y="45" width="6" height="6" />
                            <rect x="25" y="55" width="6" height="6" />
                          </svg>

                          {/* Center Brand Badge */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="w-8 h-8 rounded-full bg-white border border-[#174C3C] text-[#174C3C] text-[10px] font-bold flex items-center justify-center shadow-xs">
                              PK
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] font-semibold text-[#174C3C] mt-2">
                          NMID: ID102024987654321
                        </p>
                        <p className="text-[10px] text-[#777D77]">
                          PerpusKita Digital Library Official
                        </p>
                      </div>

                      {/* Radar Pulse Notification */}
                      <div className="flex items-center justify-center gap-2 text-xs text-[#777D77]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>Menunggu pembayaran via e-wallet atau m-banking...</span>
                      </div>
                    </div>
                  ) : (
                    /* VIRTUAL ACCOUNT CONTENT */
                    <div className="space-y-4">
                      {/* Bank Options Pills */}
                      <div className="grid grid-cols-4 gap-2">
                        {(['bca', 'mandiri', 'bri', 'bni'] as BankChoice[]).map((b) => (
                          <button
                            key={b}
                            onClick={() => setSelectedBank(b)}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              selectedBank === b
                                ? 'border-[#174C3C] bg-[#E7EDE5] text-[#174C3C] font-bold shadow-xs'
                                : 'border-[#E5E6DF] bg-white text-[#777D77] hover:border-[#174C3C]/40'
                            }`}
                          >
                            <span className="text-xs uppercase">{b}</span>
                          </button>
                        ))}
                      </div>

                      {/* VA Details Card */}
                      <div className="p-4 rounded-xl border border-[#E5E6DF] bg-[#F7F6F2] space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs text-[#777D77]">Nomor Virtual Account {banks[selectedBank].name}</span>
                            <p className="font-mono text-lg font-bold text-[#174C3C] tracking-wider mt-0.5">
                              {banks[selectedBank].vaNumber}
                            </p>
                          </div>
                          <button
                            onClick={() => handleCopy(banks[selectedBank].vaNumber, 'va')}
                            className="px-3 py-1.5 rounded-lg border border-[#A8B9A4]/40 bg-white hover:bg-[#E7EDE5] text-[#174C3C] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            {copiedText === 'va' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Tersalin!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Salin</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="pt-2 border-t border-[#E5E6DF] text-xs text-[#777D77] space-y-1">
                          <p>• Masukkan kode perusahaan / nomor VA di atas pada menu transfer m-banking.</p>
                          <p>• Total tagihan akan muncul otomatis sebesar <strong>Rp {fine.amount.toLocaleString('id-ID')}</strong>.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sandbox Instant Simulation Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleSimulatePayment}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#174C3C] hover:bg-[#12382F] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md group"
                    >
                      <Sparkles className="w-4 h-4 text-[#A8B9A4]" />
                      <span>Simulasikan Pembayaran Berhasil (Sandbox)</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-[11px] text-center text-[#777D77] mt-2">
                      Lingkungan sandbox demo: klik untuk menguji proses konfirmasi otomatis instan.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
