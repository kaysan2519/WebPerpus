'use client';

import React from 'react';
import Link from 'next/link';
import { GoogleBookVolume } from '@/types';
import { useLibrary } from '@/context/LibraryContext';
import { BookPlaceholderCover } from './BookPlaceholderCover';
import { 
  BookOpen, 
  ExternalLink, 
  PlusCircle, 
  CheckCircle2, 
  Globe, 
  ArrowUpRight,
  Layers
} from 'lucide-react';

interface GoogleBookCardProps {
  volume: GoogleBookVolume;
  onImportClick?: (volume: GoogleBookVolume) => void;
}

export function GoogleBookCard({ volume, onImportClick }: GoogleBookCardProps) {
  const { currentUser, isBookInLocalInventory } = useLibrary();

  // Check live inventory status
  const localMatch = isBookInLocalInventory(volume.id, volume.isbn13 || volume.isbn10, volume.title);
  const isInInventory = !!localMatch || volume.inLocalInventory;

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-[#E5E6DF] p-3.5 hover:border-[#174C3C]/40 hover:shadow-card transition-all duration-200">
      
      {/* Cover Container */}
      <div className="relative aspect-[3/4.2] w-full overflow-hidden rounded-lg bg-[#EFECE3] mb-3">
        <Link href={`/katalog/gbook/${volume.id}`} className="block w-full h-full">
          {volume.thumbnail ? (
            <img
              src={volume.thumbnail}
              alt={volume.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
              onError={(e) => {
                // If Google Books image link fails to load, gracefully hide img and show fallback
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <BookPlaceholderCover
              title={volume.title}
              author={volume.authors[0]}
              category={volume.categories[0]}
            />
          )}
        </Link>

        {/* Google Books Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#12382F]/90 backdrop-blur-md text-white text-[10px] font-semibold shadow-xs">
          <Globe className="w-3 h-3 text-[#A8B9A4]" />
          <span>Google Books</span>
        </div>

        {/* Local Inventory Indicator Badge */}
        {isInInventory ? (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E7EDE5] border border-[#A8B9A4]/40 text-[#174C3C] text-[10px] font-bold shadow-xs">
            <CheckCircle2 className="w-3 h-3 text-[#174C3C]" />
            <span>Koleksi Lokal</span>
          </div>
        ) : (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/85 text-[#777D77] text-[10px] font-medium backdrop-blur-xs">
            Eksplorasi
          </div>
        )}
      </div>

      {/* Book Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#777D77] uppercase tracking-wider mb-1">
            <span className="font-semibold text-[#174C3C] truncate max-w-[120px]">
              {volume.categories[0] || 'Umum'}
            </span>
            <span>•</span>
            <span>{volume.publishedDate?.slice(0, 4) || '-'}</span>
          </div>

          <Link href={`/katalog/gbook/${volume.id}`}>
            <h3 className="font-semibold text-sm text-[#252925] group-hover:text-[#174C3C] transition-colors line-clamp-1 leading-snug">
              {volume.title}
            </h3>
          </Link>
          <p className="text-xs text-[#777D77] mt-0.5 line-clamp-1">
            {volume.authors.join(', ')}
          </p>
        </div>

        {/* Card Actions Footer */}
        <div className="mt-3 pt-2.5 border-t border-[#E5E6DF]/60 space-y-2">
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#777D77]">
              {volume.pageCount > 0 ? `${volume.pageCount} Hal` : 'Halaman -'}
            </span>
            {volume.previewLink && (
              <a
                href={volume.previewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-[#174C3C] hover:underline flex items-center gap-0.5"
                title="Buka pratinjau buku di Google Books"
              >
                <span>Pratinjau</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-1.5 pt-1">
            <Link
              href={`/katalog/gbook/${volume.id}`}
              className="flex-1 py-1.5 text-center text-xs font-semibold rounded-lg border border-[#E5E6DF] bg-[#F7F6F2] text-[#252925] hover:border-[#174C3C] hover:text-[#174C3C] transition-colors"
            >
              Lihat Detail
            </Link>

            {/* Admin Import Action */}
            {currentUser.role === 'admin' && !isInInventory && onImportClick && (
              <button
                onClick={() => onImportClick(volume)}
                className="px-2.5 py-1.5 rounded-lg bg-[#174C3C] text-white hover:bg-[#12382F] text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                title="Impor buku ini ke inventaris perpustakaan"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Impor</span>
              </button>
            )}

            {isInInventory && localMatch && (
              <Link
                href={`/katalog/${localMatch.slug}`}
                className="px-2.5 py-1.5 rounded-lg bg-[#E7EDE5] text-[#174C3C] hover:bg-[#BCD9CF] text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Lihat status fisik di rak perpustakaan"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Di Rak</span>
              </Link>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
