'use client';

import React from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, dismissToast } = useLibrary();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border shadow-floating bg-white/95 backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
            toast.type === 'success'
              ? 'border-forest-100 text-charcoal'
              : toast.type === 'error'
              ? 'border-rose-100 text-charcoal'
              : 'border-border text-charcoal'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && (
              <span className="w-7 h-7 rounded-full bg-soft-sage text-forest flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-forest" />
              </span>
            )}
            {toast.type === 'error' && (
              <span className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4" />
              </span>
            )}
            {toast.type === 'info' && (
              <span className="w-7 h-7 rounded-full bg-forest-50 text-forest flex items-center justify-center shrink-0">
                <Info className="w-4 h-4" />
              </span>
            )}
            <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-charcoal-muted hover:text-charcoal p-1 rounded-md transition-colors"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
