'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'white';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  href?: string;
}

export function Logo({
  variant = 'default',
  size = 'md',
  showText = true,
  className = '',
  href = '/',
}: LogoProps) {
  const isWhite = variant === 'white';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official PerpusKita Abstract Book Symbol */}
      <div className={`${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
          <g transform="translate(0, 2)">
            {/* Left Wing */}
            <path
              d="M17.5 4.5 C11 2 4.5 4 2 5.5 C1.5 5.8 1 6.3 1 7 L1 27 C1 27.6 1.4 28.1 2 28.3 C4.5 29.2 10.5 30.5 17.5 27.5 Z"
              fill={isWhite ? '#E7EDE5' : '#174C3C'}
            />
            {/* Right Wing */}
            <path
              d="M18.5 4.5 C25 2 31.5 4 34 5.5 C34.5 5.8 35 6.3 35 7 L35 27 C35 27.6 34.6 28.1 34 28.3 C31.5 29.2 25.5 30.5 18.5 27.5 Z"
              fill={isWhite ? '#E7EDE5' : '#174C3C'}
            />
            {/* Inner Pages Accent */}
            <path
              d="M17.5 7.5 C12 5.2 6.5 7 4 8.2 L4 25 C6.5 24 12 22.5 17.5 24.5 Z"
              fill={isWhite ? '#A8B9A4' : '#A8B9A4'}
              opacity={isWhite ? '0.9' : '0.85'}
            />
            <path
              d="M18.5 7.5 C24 5.2 29.5 7 32 8.2 L32 25 C29.5 24 24 22.5 18.5 24.5 Z"
              fill={isWhite ? '#A8B9A4' : '#A8B9A4'}
              opacity={isWhite ? '0.9' : '0.85'}
            />
            {/* Spine Base */}
            <path
              d="M16.5 27 C17.5 27.5 18.5 27.5 19.5 27 L18 29 Z"
              fill={isWhite ? '#DEECE6' : '#12382F'}
            />
          </g>
        </svg>
      </div>

      {/* Official Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-serif font-extrabold tracking-tight leading-none ${textSizes[size]} ${
              isWhite ? 'text-white' : 'text-[#174C3C]'
            }`}
          >
            PerpusKita
          </span>
          <span
            className={`text-[9px] uppercase tracking-widest font-semibold mt-0.5 ${
              isWhite ? 'text-[#DEECE6]/80' : 'text-[#777D77]'
            }`}
          >
            Perpustakaan Digital
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
