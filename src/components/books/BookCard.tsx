'use client';

import React from 'react';
import Link from 'next/link';
import { Book } from '@/types';
import { useLibrary } from '@/context/LibraryContext';
import { Bookmark, Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
  showRating?: boolean;
}

export function BookCard({ book, showRating = true }: BookCardProps) {
  const { favorites, toggleFavorite } = useLibrary();
  const isFav = favorites.includes(book.id);

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-[#E5E6DF] p-3.5 hover:border-[#174C3C]/40 hover:shadow-card transition-all duration-200">
      
      {/* Cover Container */}
      <div className="relative aspect-[3/4.2] w-full overflow-hidden rounded-lg bg-[#EFECE3] mb-3">
        <Link href={`/katalog/${book.slug}`} className="block w-full h-full">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </Link>

        {/* Favorite Bookmark Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(book.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-xs ${
            isFav
              ? 'bg-[#174C3C] text-white'
              : 'bg-white/85 text-[#252925] hover:bg-white hover:text-[#174C3C]'
          }`}
          aria-label={isFav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          title={isFav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Book Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/katalog/${book.slug}`}>
            <h3 className="font-semibold text-sm text-[#252925] group-hover:text-[#174C3C] transition-colors line-clamp-1 leading-snug">
              {book.title}
            </h3>
          </Link>
          <p className="text-xs text-[#777D77] mt-0.5 line-clamp-1">
            {book.author}
          </p>
        </div>

        {/* Status Badge & Rating */}
        <div className="mt-3 pt-2.5 border-t border-[#E5E6DF]/60 flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full ${
              book.status === 'Tersedia'
                ? 'bg-[#E7EDE5] text-[#174C3C]'
                : 'bg-[#FEECEB] text-[#C0392B]'
            }`}
          >
            {book.status}
          </span>

          {showRating && (
            <div className="flex items-center gap-1 text-xs text-[#777D77] font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{book.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
