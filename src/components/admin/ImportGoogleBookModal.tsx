'use client';

import React, { useState } from 'react';
import { GoogleBookVolume, BookCategory } from '@/types';
import { useLibrary } from '@/context/LibraryContext';
import { BookPlaceholderCover } from '../books/BookPlaceholderCover';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  MapPin, 
  Layers, 
  Sparkles,
  Building,
  Calendar,
  Hash
} from 'lucide-react';

interface ImportGoogleBookModalProps {
  volume: GoogleBookVolume | null;
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
}

const CATEGORIES: BookCategory[] = [
  'Teknologi',
  'Fiksi',
  'Pendidikan',
  'Pengembangan Diri',
  'Sejarah',
  'Kesehatan',
  'Psikologi',
  'Bisnis',
  'Lainnya',
];

export function ImportGoogleBookModal({
  volume,
  isOpen,
  onClose,
  onImportSuccess,
}: ImportGoogleBookModalProps) {
  const { importBookFromGoogle, isBookInLocalInventory } = useLibrary();

  if (!isOpen || !volume) return null;

  // Initial form values pre-filled from Google Books metadata
  const [title, setTitle] = useState(volume.title);
  const [author, setAuthor] = useState(volume.authors.join(', '));
  const [publisher, setPublisher] = useState(volume.publisher !== 'Penerbit tidak tercatat' ? volume.publisher : '');
  const [publishYear, setPublishYear] = useState<number>(
    parseInt(volume.publishedDate?.slice(0, 4) || '2024', 10) || new Date().getFullYear()
  );
  const [pages, setPages] = useState<number>(volume.pageCount || 200);
  const [isbn, setIsbn] = useState(volume.isbn13 || volume.isbn10 || '');
  const [category, setCategory] = useState<BookCategory>('Teknologi');
  const [shelfLocation, setShelfLocation] = useState('Rak T-01 (Koleksi Baru)');
  const [stockCount, setStockCount] = useState<number>(3);
  const [description, setDescription] = useState(volume.description);

  // Check duplicate
  const existingDuplicate = isBookInLocalInventory(volume.id, isbn || volume.isbn13 || volume.isbn10, title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const result = importBookFromGoogle({
      googleVolumeId: volume.id,
      title: title.trim(),
      author: author.trim() || 'Penulis Tidak Dicantumkan',
      coverImage: volume.thumbnail,
      category,
      publisher: publisher.trim() || 'Penerbit Tidak Tercatat',
      publishYear: publishYear || new Date().getFullYear(),
      pages: pages || 1,
      isbn: isbn.trim() || 'ISBN Belum Terdata',
      language: volume.language === 'id' ? 'Indonesia' : 'Inggris',
      shelfLocation: shelfLocation.trim() || 'Rak Koleksi Umum',
      stockCount: Math.max(1, stockCount),
      description: description.trim() || 'Tidak ada deskripsi.',
      previewLink: volume.previewLink,
      infoLink: volume.infoLink,
    });

    if (result.success) {
      if (onImportSuccess) onImportSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl border border-[#E5E6DF] shadow-floating max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E6DF] bg-[#F7F6F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E7EDE5] text-[#174C3C] flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#174C3C]">
                Pemeriksaan Metadata & Impor Buku
              </h3>
              <p className="text-xs text-[#777D77]">
                Verifikasi informasi sebelum memasukkan buku ke inventaris resmi perpustakaan
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Duplicate warning alert if detected */}
          {existingDuplicate && (
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/80 flex items-start gap-3 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Buku ini telah terdaftar di inventaris perpustakaan!</p>
                <p className="text-amber-800 mt-0.5">
                  Terdaftar sebagai: <strong>&ldquo;{existingDuplicate.title}&rdquo;</strong> di <strong>{existingDuplicate.shelfLocation}</strong>. Mengimpor kembali dapat menimbulkan duplikasi data.
                </p>
              </div>
            </div>
          )}

          {/* Book Header Preview (Thumb + Google info) */}
          <div className="flex gap-4 p-4 rounded-xl bg-[#F7F6F2] border border-[#E5E6DF]">
            <div className="w-16 h-22 rounded-md overflow-hidden bg-white shadow-xs shrink-0">
              {volume.thumbnail ? (
                <img
                  src={volume.thumbnail}
                  alt={volume.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookPlaceholderCover title={volume.title} author={volume.authors[0]} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#174C3C] border border-[#E5E6DF]">
                  ID: {volume.id}
                </span>
                <span className="text-[11px] text-[#777D77]">Sumber: Google Books API</span>
              </div>
              <p className="text-xs text-[#777D77] mt-1 line-clamp-2">
                {volume.description}
              </p>
            </div>
          </div>

          {/* Edit Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Judul Buku */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#252925] mb-1">
                Judul Buku (Koleksi Resmi) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E6DF] bg-white focus:outline-none focus:border-[#174C3C]"
              />
            </div>

            {/* Penulis */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#252925] mb-1">
                Penulis / Pengarang *
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E6DF] bg-white focus:outline-none focus:border-[#174C3C]"
              />
            </div>

            {/* Kategori Perpustakaan */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#252925] mb-1">
                Kategori Perpustakaan *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BookCategory)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E6DF] bg-white focus:outline-none focus:border-[#174C3C]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Penerbit */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#252925] mb-1">
                Penerbit
              </label>
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="Contoh: Penguin Random House"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E6DF] bg-white focus:outline-none focus:border-[#174C3C]"
              />
            </div>

            {/* Tahun Terbit */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#252925] mb-1">
                Tahun Terbit
              </label>
              <input
                type="number"
                value={publishYear}
                onChange={(e) => setPublishYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E6DF] bg-white focus:outline-none focus:border-[#174C3C]"
              />
            </div>

            {/* ISBN */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#252925] mb-1">
                Nomor ISBN
              </label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="978-xxxxxxxxxx"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[#E5E6DF] bg-white focus:outline-none focus:border-[#174C3C]"
              />
            </div>

            {/* Jumlah Halaman */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#252925] mb-1">
                Jumlah Halaman
              </label>
              <input
                type="number"
                value={pages}
                onChange={(e) => setPages(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E6DF] bg-white focus:outline-none focus:border-[#174C3C]"
              />
            </div>

            {/* Lokasi Rak Perpustakaan (Inventaris Lokal) */}
            <div className="p-3 rounded-xl bg-[#E7EDE5]/50 border border-[#A8B9A4]/30 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#174C3C] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Alokasi Rak Perpustakaan *</span>
              </label>
              <input
                type="text"
                required
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                placeholder="Contoh: Rak T-04 (Teknologi & Sains)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#A8B9A4]/50 bg-white focus:outline-none focus:border-[#174C3C]"
              />
            </div>

            {/* Jumlah Eksemplar / Stok Fisik */}
            <div className="p-3 rounded-xl bg-[#E7EDE5]/50 border border-[#A8B9A4]/30 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#174C3C] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Jumlah Stok Eksemplar Fisik *</span>
              </label>
              <input
                type="number"
                min="1"
                max="50"
                required
                value={stockCount}
                onChange={(e) => setStockCount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#A8B9A4]/50 bg-white focus:outline-none focus:border-[#174C3C]"
              />
            </div>

            {/* Deskripsi */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#252925] mb-1">
                Deskripsi / Sinopsis Buku
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E6DF] bg-white focus:outline-none focus:border-[#174C3C]"
              />
            </div>

          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-[#E5E6DF] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#777D77] hover:text-[#252925] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!!existingDuplicate}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#174C3C] hover:bg-[#12382F] rounded-lg transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan ke Inventaris Perpustakaan</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
