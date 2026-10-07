'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Key, 
  CheckCircle2, 
  BookOpen, 
  ExternalLink, 
  RotateCcw, 
  Minimize2, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Compass, 
  MapPin, 
  Star,
  Copy,
  Info
} from 'lucide-react';
import { Book } from '@/types';
import { useLibrary } from '@/context/LibraryContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  matchedBooks?: Book[];
  isKeyPrompt?: boolean;
}

const STORAGE_KEY = 'perpus_consultation_key';
const DEMO_CONSULTATION_KEY = 'PERPUSKITA-KONSUL-2024';

export function AILibrarianChatbot() {
  const { books, borrowBook } = useLibrary();
  const [isOpen, setIsOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [consultationKey, setConsultationKey] = useState<string>('');
  const [keyInput, setKeyInput] = useState<string>('');
  const [showKeyPassword, setShowKeyPassword] = useState(false);
  const [keySavedToast, setKeySavedToast] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewBadge, setHasNewBadge] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-initial',
      sender: 'assistant',
      text: 'Halo! Saya **Pustakawan AI PerpusKita**. 🏛️\n\nSaya siap membantu Anda mencari letak rak buku, rekomendasi literatur, dan aturan perpustakaan.\n\n✨ **Fitur Spesial:** Ketik **`konsul`** untuk mengaktifkan sesi konsultasi literasi mendalam menggunakan **Kunci Konsultasi (Consultation Key)**.',
      timestamp: 'Baru saja'
    }
  ]);

  // Load consultation key from localStorage on mount
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem(STORAGE_KEY);
      if (savedKey) {
        setConsultationKey(savedKey);
        setKeyInput(savedKey);
      }
    } catch {
      // LocalStorage access fallback
    }

    const handleOpenChat = () => setIsOpen(true);
    const handleOpenKeyModal = () => {
      setIsOpen(true);
      setIsKeyModalOpen(true);
    };

    window.addEventListener('open-perpus-ai-chat', handleOpenChat);
    window.addEventListener('open-perpus-ai-key-modal', handleOpenKeyModal);

    return () => {
      window.removeEventListener('open-perpus-ai-chat', handleOpenChat);
      window.removeEventListener('open-perpus-ai-key-modal', handleOpenKeyModal);
    };
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasNewBadge(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const saveKey = (newKey: string) => {
    const trimmed = newKey.trim();
    if (!trimmed) return;
    setConsultationKey(trimmed);
    try {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } catch {
      // safe fallback
    }
    setKeySavedToast(true);
    setTimeout(() => {
      setKeySavedToast(false);
      setIsKeyModalOpen(false);
    }, 1200);

    // Append confirmation in chat
    const confirmMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `🔑 **Kunci Konsultasi Berhasil Diaktifkan!**\n\nKunci Anda: \`${trimmed}\` sekarang aktif. Mode **Konsultasi Sastra & Riset Akademis** telah terbuka. Silakan ketik topik buku atau skripsi yang ingin Anda diskusikan!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, confirmMsg]);
  };

  const removeKey = () => {
    setConsultationKey('');
    setKeyInput('');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // safe fallback
    }
    setIsKeyModalOpen(false);

    const removeMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: '🔒 Kunci Konsultasi telah dinonaktifkan. Anda kini berada dalam mode pencarian katalog reguler. Ketik **`konsul`** kapan saja untuk mengaktifkan kembali!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, removeMsg]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputValue).trim();
    if (!messageContent || isLoading) return;

    setInputValue('');

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Check if user is typing "konsul" and whether key is present
    const isKonsulCommand = /^(konsul|konsultasi|\/konsul|kunci|key|\/key)\b/i.test(messageContent.toLowerCase()) || 
      messageContent.toLowerCase().trim() === 'konsul';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          consultationKey: consultationKey || undefined,
          history: messages.slice(-5).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi server');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Maaf, saya tidak dapat memproses permintaan tersebut saat ini.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedBooks: data.matchedBooks || [],
        isKeyPrompt: isKonsulCommand && !consultationKey
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If user typed konsul and doesn't have a key yet, subtly open or highlight key modal
      if (isKonsulCommand && !consultationKey) {
        setTimeout(() => {
          setIsKeyModalOpen(true);
        }, 800);
      }
    } catch {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: '⚠️ Maaf, terjadi gangguan jaringan saat menghubungi Pustakawan AI. Namun jangan khawatir, Anda tetap dapat menelusuri katalog di menu Koleksi!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'Percakapan telah diatur ulang. Ada judul buku atau topik riset yang ingin Anda tanyakan?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Helper for rendering markdown formatting
  const renderFormattedText = (raw: string) => {
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Format bold (**bold**) and inline code (`code`)
      const formattedParts = line.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g).map((chunk, i) => {
        if (chunk.startsWith('**') && chunk.endsWith('**')) {
          return <strong key={i} className="font-semibold text-forest dark:text-emerald-300">{chunk.slice(2, -2)}</strong>;
        }
        if (chunk.startsWith('`') && chunk.endsWith('`')) {
          return (
            <code key={i} className="px-1.5 py-0.5 rounded bg-black/5 text-[#174C3C] font-mono text-xs border border-black/10">
              {chunk.slice(1, -1)}
            </code>
          );
        }
        if (chunk.startsWith('*') && chunk.endsWith('*')) {
          return <em key={i} className="italic text-[#464C45]">{chunk.slice(1, -1)}</em>;
        }
        return chunk;
      });

      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-forest font-bold leading-none mt-1.5">•</span>
            <div className="flex-1 leading-relaxed">{formattedParts.slice(1)}</div>
          </div>
        );
      }

      return (
        <p key={idx} className="leading-relaxed my-1">
          {formattedParts}
        </p>
      );
    });
  };

  const quickChips = [
    { label: '🔑 Ketik "konsul"', query: 'konsul' },
    { label: '📚 Rekomendasi Populer', query: 'rekomendasi buku populer' },
    { label: '📍 Letak Rak Atomic Habits', query: 'di mana letak rak buku Atomic Habits?' },
    { label: '📋 Aturan Pinjam & Denda', query: 'apa syarat peminjaman dan denda?' }
  ];

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto">
        {/* Subtle Welcome Teaser Pill when closed */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ delay: 0.8 }}
              onClick={() => setIsOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E5E6DF] shadow-md text-xs font-medium text-[#252925] cursor-pointer hover:border-[#174C3C] transition-all group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#174C3C] animate-pulse" />
              <span>
                {consultationKey ? '🔑 Kunci Konsul Aktif' : 'Tanya Pustakawan AI'}
              </span>
              <span className="text-[10px] text-[#777D77] group-hover:text-[#174C3C] font-mono">
                {consultationKey ? 'Online' : 'Ketik "konsul"'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Trigger Circle Button */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#174C3C]/20 ${
            isOpen 
              ? 'bg-[#252925] text-white rotate-90' 
              : 'bg-[#174C3C] text-white hover:bg-[#12382F]'
          }`}
          aria-label={isOpen ? 'Tutup Pustakawan AI' : 'Buka Pustakawan AI'}
          title="Buka Pustakawan AI PerpusKita"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6" />
              {/* Consultation Key active indicator */}
              {consultationKey ? (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-stone-900 border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-sm" title="Kunci Konsultasi Aktif">
                  🔑
                </span>
              ) : hasNewBadge ? (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white animate-ping" />
              ) : null}
            </>
          )}
        </motion.button>
      </div>

      {/* Floating Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 z-40 w-[calc(100vw-32px)] sm:w-[420px] h-[600px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-[#E5E6DF] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#174C3C] to-[#1F5F4B] text-white px-4 py-3.5 flex items-center justify-between shadow-sm relative">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white font-serif font-bold text-lg shadow-inner">
                    🏛️
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#174C3C]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-sm leading-none tracking-tight">Pustakawan AI</h3>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded bg-white/20 text-white/90">
                      Editorial
                    </span>
                  </div>
                  <p className="text-[11px] text-white/75 mt-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Asisten Literasi & Riset 24/7
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {/* Key Consultation Pill Button */}
                <button
                  onClick={() => setIsKeyModalOpen(true)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${
                    consultationKey
                      ? 'bg-amber-400/20 border-amber-300/40 text-amber-200 hover:bg-amber-400/30'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                  title={consultationKey ? 'Kunci Konsultasi Aktif' : 'Masukkan Kunci Konsultasi'}
                >
                  <Key className="w-3 h-3 text-amber-300" />
                  <span className="hidden xs:inline">
                    {consultationKey ? 'Key Aktif' : 'Key'}
                  </span>
                </button>

                {/* Reset button */}
                <button
                  onClick={resetChat}
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  title="Mulai Ulang Percakapan"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Minimize button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  title="Tutup Obrolan"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Key Status Alert Bar if Key is Active */}
            {consultationKey && (
              <div className="bg-amber-50 border-b border-amber-200/80 px-3.5 py-1.5 flex items-center justify-between text-xs text-amber-900 font-medium">
                <div className="flex items-center gap-1.5 truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">
                    Mode Konsul Aktif: <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-300 text-[10px]">{consultationKey}</code>
                  </span>
                </div>
                <button
                  onClick={() => setIsKeyModalOpen(true)}
                  className="text-[11px] underline text-amber-800 hover:text-amber-950 font-semibold flex-shrink-0 ml-2"
                >
                  Ubah
                </button>
              </div>
            )}

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF9F5] text-xs sm:text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm text-left break-words ${
                      msg.sender === 'user'
                        ? 'bg-[#174C3C] text-white rounded-br-xs'
                        : 'bg-white text-[#252925] border border-[#E5E6DF] rounded-bl-xs'
                    }`}
                  >
                    <div className="text-[12px] sm:text-[13px] leading-relaxed">
                      {renderFormattedText(msg.text)}
                    </div>

                    {/* If message prompts for key, render quick trigger button */}
                    {msg.isKeyPrompt && !consultationKey && (
                      <div className="mt-2.5 pt-2 border-t border-black/5 flex flex-col gap-1.5">
                        <button
                          onClick={() => {
                            saveKey(DEMO_CONSULTATION_KEY);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#174C3C] text-white text-xs font-semibold hover:bg-[#12382F] transition-all shadow-sm"
                        >
                          <Key className="w-3.5 h-3.5 text-amber-300" />
                          <span>Aktifkan Kunci Demo Sekarang</span>
                        </button>
                        <button
                          onClick={() => setIsKeyModalOpen(true)}
                          className="w-full py-1 text-[11px] text-[#777D77] hover:text-[#174C3C] text-center font-medium underline"
                        >
                          Punya Kunci Pribadi? Masukkan di sini
                        </button>
                      </div>
                    )}

                    <div
                      className={`text-[9px] mt-1.5 flex justify-end ${
                        msg.sender === 'user' ? 'text-white/60' : 'text-[#777D77]'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* Render Matched Book Cards if present */}
                  {msg.matchedBooks && msg.matchedBooks.length > 0 && (
                    <div className="mt-2 w-full max-w-[92%] space-y-2">
                      <p className="text-[10px] font-semibold text-[#777D77] uppercase tracking-wider flex items-center gap-1 pl-1">
                        <BookOpen className="w-3 h-3 text-[#174C3C]" />
                        Buku Rekomendasi Terkait:
                      </p>
                      {msg.matchedBooks.map((book) => (
                        <div
                          key={book.id}
                          className="bg-white rounded-xl p-2.5 border border-[#E5E6DF] shadow-sm hover:border-[#174C3C]/50 transition-all flex gap-3 items-center group"
                        >
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded-md flex-shrink-0 shadow-xs border border-black/5"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-xs text-[#252925] truncate group-hover:text-[#174C3C] transition-colors">
                              {book.title}
                            </h4>
                            <p className="text-[11px] text-[#777D77] truncate">{book.author}</p>
                            
                            <div className="flex items-center gap-2 mt-1 text-[10px]">
                              <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                                <Star className="w-2.5 h-2.5 fill-current" /> {book.rating}
                              </span>
                              <span className="flex items-center gap-0.5 text-[#777D77] truncate">
                                <MapPin className="w-2.5 h-2.5 text-[#174C3C]" /> {book.shelfLocation}
                              </span>
                            </div>

                            <div className="mt-1.5 flex items-center gap-2">
                              <Link
                                href={`/buku/${book.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-0.5 text-[10px] text-[#174C3C] font-semibold hover:underline"
                              >
                                Detail Buku <ExternalLink className="w-2.5 h-2.5" />
                              </Link>
                              {book.status === 'Tersedia' && (
                                <button
                                  onClick={() => {
                                    const res = borrowBook(book.id);
                                    if (res.success) {
                                      handleSendMessage(`Saya baru saja meminjam buku "${book.title}". Apa tips membaca buku ini?`);
                                    }
                                  }}
                                  className="text-[10px] bg-[#E7EDE5] text-[#174C3C] hover:bg-[#174C3C] hover:text-white px-2 py-0.5 rounded font-medium transition-colors"
                                >
                                  Pinjam
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="bg-white border border-[#E5E6DF] rounded-2xl px-3.5 py-2.5 shadow-sm rounded-bl-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#174C3C] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#174C3C] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#174C3C] animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[11px] text-[#777D77] ml-1">Pustakawan AI sedang mengetik...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Chips Carousel */}
            <div className="bg-white px-3 py-1.5 border-t border-[#E5E6DF]/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.query)}
                  className="flex-shrink-0 px-2.5 py-1 rounded-full bg-[#F7F6F2] hover:bg-[#E7EDE5] text-[#252925] hover:text-[#174C3C] text-[11px] font-medium border border-[#E5E6DF] transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-[#E5E6DF] flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    consultationKey
                      ? 'Tanyakan buku, riset, atau analisis...'
                      : 'Ketik pesan atau ketik "konsul"...'
                  }
                  className="w-full pl-3.5 pr-8 py-2 text-xs sm:text-sm bg-[#F7F6F2] border border-[#E5E6DF] rounded-full focus:outline-none focus:border-[#174C3C] focus:bg-white text-[#252925] placeholder-[#777D77] transition-all"
                />
                <button
                  onClick={() => setIsKeyModalOpen(true)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#777D77] hover:text-amber-600 transition-colors"
                  title="Kelola Kunci Konsultasi"
                >
                  <Key className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="w-9 h-9 rounded-full bg-[#174C3C] text-white flex items-center justify-center hover:bg-[#12382F] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex-shrink-0"
                aria-label="Kirim Pesan"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Consultation Key Modal Dialog */}
      <AnimatePresence>
        {isKeyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsKeyModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />

            {/* Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5E6DF] p-6 z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#252925] leading-tight">
                      Kunci Konsultasi AI
                    </h3>
                    <p className="text-xs text-[#777D77]">
                      Akses Pustakawan AI & Analisis Literatur
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsKeyModalOpen(false)}
                  className="p-1 rounded-full text-[#777D77] hover:text-[#252925] hover:bg-black/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-[#464C45] leading-relaxed mb-4">
                Ketik <code className="px-1.5 py-0.5 rounded bg-black/5 font-mono text-forest">konsul</code> di ruang obrolan untuk mengaktifkan sesi konsultasi. Masukkan kunci akses di bawah ini untuk membuka fitur rekomendasi personal dan asistensi riset.
              </p>

              {/* Demo Key Quick Button */}
              <div className="bg-[#FAF9F5] border border-[#E5E6DF] rounded-xl p-3 mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-[#174C3C] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Kunci Demo Resmi Perpustakaan
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-medium">
                    Gratis
                  </span>
                </div>
                <p className="text-[11px] text-[#777D77] mb-2">
                  Belum punya kunci? Klik tombol di bawah untuk langsung menggunakan kunci uji coba:
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white border border-[#E5E6DF] px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold text-[#252925] truncate">
                    {DEMO_CONSULTATION_KEY}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      setKeyInput(DEMO_CONSULTATION_KEY);
                      saveKey(DEMO_CONSULTATION_KEY);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#174C3C] hover:bg-[#12382F] text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors flex-shrink-0"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Gunakan
                  </button>
                </div>
              </div>

              {/* Key Input Form */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-[#252925]">
                  Masukkan Kunci Akses / Gemini API Key:
                </label>
                <div className="relative">
                  <input
                    type={showKeyPassword ? 'text' : 'password'}
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="Contoh: PERPUSKITA-KONSUL-2024 atau AIzaSy..."
                    className="w-full pl-3.5 pr-10 py-2.5 text-xs font-mono bg-white border border-[#E5E6DF] rounded-xl focus:outline-none focus:border-[#174C3C] focus:ring-1 focus:ring-[#174C3C] text-[#252925]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeyPassword(!showKeyPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777D77] hover:text-[#252925]"
                  >
                    {showKeyPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {keySavedToast && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Kunci Konsultasi berhasil disimpan & diaktifkan!</span>
                  </motion.div>
                )}

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-2 gap-2">
                  {consultationKey ? (
                    <button
                      type="button"
                      onClick={removeKey}
                      className="px-3 py-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                      Hapus Kunci
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsKeyModalOpen(false)}
                      className="px-3.5 py-2 text-xs text-[#777D77] hover:text-[#252925] rounded-lg transition-colors"
                    >
                      Tutup
                    </button>
                    <button
                      type="button"
                      onClick={() => saveKey(keyInput)}
                      disabled={!keyInput.trim()}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#174C3C] text-white hover:bg-[#12382F] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Simpan Kunci
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
