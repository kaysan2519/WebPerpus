'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';

interface BookPlaceholderCoverProps {
  title: string;
  author?: string;
  category?: string;
  className?: string;
}

export function BookPlaceholderCover({
  title,
  author,
  category,
  className = '',
}: BookPlaceholderCoverProps) {
  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between p-4 bg-[#E7EDE5] border border-[#A8B9A4]/40 select-none overflow-hidden book-spine-shadow ${className}`}
      style={{
        backgroundImage: 'radial-gradient(rgba(23, 76, 60, 0.12) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }}
    >
      {/* Decorative Spine Edge on the left */}
      <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-[#12382F]/15 border-r border-[#12382F]/10" />

      {/* Top Header */}
      <div className="pl-2 flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#174C3C]/80">
          PerpusKita
        </span>
        <div className="w-5 h-5 rounded-full bg-[#174C3C]/10 flex items-center justify-center text-[#174C3C]">
          <BookOpen className="w-3 h-3" />
        </div>
      </div>

      {/* Middle: Title & Author in Editorial Typography */}
      <div className="pl-2 my-auto py-2">
        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#12382F] leading-snug line-clamp-3">
          {title}
        </h4>
        {author && (
          <p className="text-[11px] text-[#777D77] font-medium mt-1 line-clamp-1">
            {author}
          </p>
        )}
      </div>

      {/* Bottom Category Tag */}
      <div className="pl-2 pt-1 border-t border-[#A8B9A4]/30 flex items-center justify-between">
        <span className="text-[9px] font-mono text-[#174C3C] uppercase tracking-wider font-semibold truncate">
          {category || 'Edisi Digital'}
        </span>
        <span className="text-[9px] text-[#777D77]">Ref. ID</span>
      </div>
    </div>
  );
}
