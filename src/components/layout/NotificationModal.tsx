'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLibrary } from '@/context/LibraryContext';
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck, 
  Trash2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  BookOpen, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { NotificationType } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdropVariants, modalContentVariants } from '@/lib/motion';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const { 
    notifications, 
    unreadNotificationsCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotifications 
  } = useLibrary();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.isRead;
    return true;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'DUE_REMINDER':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'OVERDUE':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'RENEW':
        return <Sparkles className="w-4 h-4 text-[#174C3C]" />;
      default:
        return <BookOpen className="w-4 h-4 text-sky-600" />;
    }
  };

  const getBadgeStyle = (type: NotificationType) => {
    switch (type) {
      case 'DUE_REMINDER':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'OVERDUE':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'SUCCESS':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'RENEW':
        return 'bg-[#E7EDE5] text-[#174C3C] border-[#A8B9A4]/30';
      default:
        return 'bg-sky-50 text-sky-800 border-sky-200';
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
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
        >
          <motion.div 
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl border border-[#E5E6DF] shadow-floating flex flex-col overflow-hidden max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E6DF] bg-[#F7F6F2]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#174C3C] text-white flex items-center justify-center shadow-xs">
                  <Bell className="w-4 h-4 text-[#A8B9A4]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#174C3C]">
                    Pusat Notifikasi Perpustakaan
                  </h3>
                  <p className="text-xs text-[#777D77]">
                    {unreadNotificationsCount} pesan belum dibaca
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#777D77] hover:text-[#252925] hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action bar & Filters */}
            <div className="px-6 py-2.5 border-b border-[#E5E6DF] flex items-center justify-between gap-2 text-xs bg-white">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 rounded-full font-medium transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-[#174C3C] text-white'
                      : 'bg-[#F7F6F2] text-[#252925] hover:bg-[#E7EDE5]'
                  }`}
                >
                  Semua ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveFilter('unread')}
                  className={`px-3 py-1 rounded-full font-medium transition-colors ${
                    activeFilter === 'unread'
                      ? 'bg-[#174C3C] text-white'
                      : 'bg-[#F7F6F2] text-[#252925] hover:bg-[#E7EDE5]'
                  }`}
                >
                  Belum Dibaca ({unreadNotificationsCount})
                </button>
              </div>

              <div className="flex items-center gap-2">
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] font-semibold text-[#174C3C] hover:underline flex items-center gap-1"
                    title="Tandai semua sudah dibaca"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Baca Semua</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-[11px] font-semibold text-[#777D77] hover:text-rose-600 flex items-center gap-1 transition-colors"
                    title="Hapus semua notifikasi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Bersihkan</span>
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 divide-y divide-[#E5E6DF]/70">
              {filteredNotifs.length === 0 ? (
                <div className="py-12 text-center text-[#777D77] space-y-2">
                  <Bell className="w-8 h-8 text-[#A8B9A4] mx-auto" />
                  <p className="text-sm font-medium text-[#252925]">Tidak ada notifikasi</p>
                  <p className="text-xs">Semua aktivitas sirkulasi dan informasi akun Anda telah terbaca.</p>
                </div>
              ) : (
                filteredNotifs.map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`py-3.5 px-3 rounded-xl transition-all flex items-start justify-between gap-3 ${
                      notif.isRead ? 'hover:bg-[#F7F6F2]' : 'bg-[#E7EDE5]/30 hover:bg-[#E7EDE5]/50'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${getBadgeStyle(notif.type)}`}>
                        {getIcon(notif.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-xs sm:text-sm text-[#252925]">
                            {notif.title}
                          </h4>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#174C3C] shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-[#777D77] mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-[#A8B9A4]">
                          <span>{notif.createdAt}</span>
                          {notif.link && (
                            <Link
                              href={notif.link}
                              onClick={onClose}
                              className="text-[#174C3C] font-semibold hover:underline flex items-center gap-1"
                            >
                              <span>Buka halaman</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>

                    {!notif.isRead && (
                      <button
                        onClick={() => markNotificationAsRead(notif.id)}
                        className="p-1 rounded-md text-[#777D77] hover:text-[#174C3C] hover:bg-[#E7EDE5] shrink-0"
                        title="Tandai telah dibaca"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[#E5E6DF] bg-[#F7F6F2] flex justify-between items-center text-xs text-[#777D77]">
              <span>Notifikasi tersinkronisasi otomatis</span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-white border border-[#E5E6DF] text-xs font-semibold text-[#252925] hover:border-[#174C3C]"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
