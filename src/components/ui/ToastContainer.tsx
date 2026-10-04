'use client';

import React from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ToastContainer() {
  const { toasts, dismissToast } = useLibrary();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, x: 20, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border shadow-floating bg-white/95 backdrop-blur-sm ${
              toast.type === 'success'
                ? 'border-emerald-200 text-[#252925]'
                : toast.type === 'error'
                ? 'border-rose-200 text-[#252925]'
                : 'border-[#E5E6DF] text-[#252925]'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && (
                <span className="w-7 h-7 rounded-full bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#174C3C]" />
                </span>
              )}
              {toast.type === 'error' && (
                <span className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </span>
              )}
              {toast.type === 'info' && (
                <span className="w-7 h-7 rounded-full bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4" />
                </span>
              )}
              <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#777D77] hover:text-[#252925] p-1 rounded-md transition-colors"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
