'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, LoanRecord, ActivityItem, Review, ImportBookPayload } from '@/types';
import { INITIAL_BOOKS, INITIAL_LOANS, INITIAL_ACTIVITIES, INITIAL_REVIEWS } from '@/data/books';

export type UserRole = 'siswa' | 'admin' | 'guest';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  memberId: string;
}

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface LibraryContextType {
  books: Book[];
  loans: LoanRecord[];
  favorites: string[];
  currentUser: UserProfile;
  activities: ActivityItem[];
  reviews: Review[];
  searchQuery: string;
  selectedCategory: string;
  toasts: ToastInfo[];
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string) => void;
  switchUserRole: (role: UserRole) => void;
  toggleFavorite: (bookId: string) => void;
  borrowBook: (bookId: string, durationDays?: number) => { success: boolean; message: string };
  renewLoan: (loanId: string) => { success: boolean; message: string };
  returnLoan: (loanId: string) => { success: boolean; message: string };
  addReview: (bookId: string, rating: number, comment: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
  getBookById: (id: string) => Book | undefined;
  getBookBySlug: (slug: string) => Book | undefined;
  isBookInLocalInventory: (googleVolumeId?: string, isbn?: string, title?: string) => Book | undefined;
  importBookFromGoogle: (payload: ImportBookPayload) => { success: boolean; message: string; book?: Book };
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [loans, setLoans] = useState<LoanRecord[]>(INITIAL_LOANS);
  const [favorites, setFavorites] = useState<string[]>(['b-1', 'b-3', 'b-4']);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'u-1',
    name: 'Kaysan Rafif',
    email: 'kaysan.rafif@perpus.sch.id',
    role: 'siswa',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    memberId: 'PK-2024-8841',
  });

  // Try to load persisted imported books from localStorage on mount
  useEffect(() => {
    try {
      const savedBooks = localStorage.getItem('perpuskita_custom_books');
      if (savedBooks) {
        const parsed = JSON.parse(savedBooks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBooks((prev) => {
            const existingIds = new Set(prev.map((b) => b.id));
            const fresh = parsed.filter((b) => !existingIds.has(b.id));
            return [...fresh, ...prev];
          });
        }
      }
    } catch (_) {}
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchUserRole = (role: UserRole) => {
    if (role === 'admin') {
      setCurrentUser({
        id: 'u-admin',
        name: 'Admin Perpustakaan',
        email: 'admin@perpuskita.id',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        memberId: 'ADM-001',
      });
      showToast('Beralih ke mode Admin Panel', 'info');
    } else if (role === 'siswa') {
      setCurrentUser({
        id: 'u-1',
        name: 'Kaysan Rafif',
        email: 'kaysan.rafif@perpus.sch.id',
        role: 'siswa',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        memberId: 'PK-2024-8841',
      });
      showToast('Beralih ke mode Anggota / Siswa', 'info');
    } else {
      setCurrentUser({
        id: 'u-guest',
        name: 'Pengunjung',
        email: '',
        role: 'guest',
        avatar: '',
        memberId: '',
      });
      showToast('Beralih ke mode Pengunjung (Tamu)', 'info');
    }
  };

  const toggleFavorite = (bookId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(bookId);
      const book = books.find((b) => b.id === bookId);
      const title = book ? `"${book.title}"` : 'Buku';
      if (exists) {
        showToast(`${title} dihapus dari daftar favorit`, 'info');
        return prev.filter((id) => id !== bookId);
      } else {
        showToast(`${title} ditambahkan ke daftar favorit`, 'success');
        return [...prev, bookId];
      }
    });
  };

  const borrowBook = (bookId: string, durationDays: number = 14) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) {
      return { success: false, message: 'Buku tidak ditemukan di inventaris lokal' };
    }
    if (book.status === 'Dipinjam') {
      return { success: false, message: 'Buku saat ini sedang dipinjam oleh anggota lain' };
    }

    const today = new Date();
    const dueDateObj = new Date();
    dueDateObj.setDate(today.getDate() + durationDays);

    const formatDate = (date: Date) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const newLoan: LoanRecord = {
      id: `loan-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCover: book.coverImage,
      borrowDate: formatDate(today),
      dueDate: formatDate(dueDateObj),
      status: 'Dipinjam',
      renewable: true,
      renewCount: 0,
      userId: currentUser.id,
      userName: currentUser.name,
    };

    setLoans((prev) => [newLoan, ...prev]);

    // Update book status
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? { ...b, status: 'Dipinjam', borrowCount: b.borrowCount + 1 }
          : b
      )
    );

    // Add activity
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'borrow',
      text: `${currentUser.name} meminjam buku ${book.title}`,
      timeAgo: 'Baru saja',
      iconName: 'BookOpen',
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast(`Berhasil meminjam "${book.title}". Jatuh tempo: ${newLoan.dueDate}`, 'success');
    return { success: true, message: 'Peminjaman berhasil diproses!' };
  };

  const renewLoan = (loanId: string) => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) {
      return { success: false, message: 'Catatan peminjaman tidak ditemukan' };
    }

    if (loan.renewCount >= 2) {
      showToast('Batas perpanjangan maksimal (2x) telah tercapai', 'error');
      return { success: false, message: 'Batas perpanjangan telah tercapai' };
    }

    const currentDue = new Date();
    currentDue.setDate(currentDue.getDate() + 7);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const newDueDateStr = `${currentDue.getDate()} ${months[currentDue.getMonth()]} ${currentDue.getFullYear()}`;

    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? {
              ...l,
              dueDate: newDueDateStr,
              renewCount: l.renewCount + 1,
              renewable: l.renewCount + 1 < 2,
            }
          : l
      )
    );

    showToast(`Peminjaman "${loan.bookTitle}" diperpanjang hingga ${newDueDateStr}`, 'success');
    return { success: true, message: `Berhasil diperpanjang hingga ${newDueDateStr}` };
  };

  const returnLoan = (loanId: string) => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) {
      return { success: false, message: 'Catatan peminjaman tidak ditemukan' };
    }

    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const returnDateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? {
              ...l,
              status: 'Dikembalikan',
              returnDate: returnDateStr,
              renewable: false,
            }
          : l
      )
    );

    // Update book status back to Tersedia
    setBooks((prev) =>
      prev.map((b) =>
        b.id === loan.bookId ? { ...b, status: 'Tersedia' } : b
      )
    );

    // Add activity
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'return',
      text: `${currentUser.name} mengembalikan buku ${loan.bookTitle}`,
      timeAgo: 'Baru saja',
      iconName: 'CheckCircle2',
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast(`Buku "${loan.bookTitle}" berhasil dikembalikan. Terima kasih!`, 'success');
    return { success: true, message: 'Buku berhasil dikembalikan' };
  };

  const addReview = (bookId: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      bookId,
      userName: currentUser.name,
      userRole: 'Anggota PerpusKita',
      rating,
      date: 'Hari ini',
      comment,
      likes: 0,
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast('Ulasan Anda berhasil diterbitkan!', 'success');
  };

  const getBookById = (id: string) => books.find((b) => b.id === id);
  const getBookBySlug = (slug: string) => books.find((b) => b.slug === slug || b.id === slug);

  const isBookInLocalInventory = (googleVolumeId?: string, isbn?: string, title?: string): Book | undefined => {
    return books.find((b) => {
      if (googleVolumeId && b.googleVolumeId === googleVolumeId) return true;
      if (isbn && b.isbn) {
        const cleanIsbn = isbn.replace(/[^0-9X]/gi, '');
        const cleanBookIsbn = b.isbn.replace(/[^0-9X]/gi, '');
        if (cleanIsbn && cleanBookIsbn && cleanIsbn === cleanBookIsbn) return true;
      }
      if (title && b.title.trim().toLowerCase() === title.trim().toLowerCase()) return true;
      return false;
    });
  };

  const importBookFromGoogle = (payload: ImportBookPayload): { success: boolean; message: string; book?: Book } => {
    // Check for duplicates
    const existing = isBookInLocalInventory(payload.googleVolumeId, payload.isbn, payload.title);
    if (existing) {
      const msg = `Buku "${existing.title}" sudah terdaftar di inventaris lokal (Lokasi: ${existing.shelfLocation})`;
      showToast(msg, 'error');
      return { success: false, message: msg, book: existing };
    }

    const cleanSlug = payload.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const uniqueSlug = `${cleanSlug || 'buku'}-${Math.random().toString(36).substring(2, 6)}`;

    const newBook: Book = {
      id: `imported-${Date.now()}`,
      slug: uniqueSlug,
      title: payload.title,
      author: payload.author,
      coverImage: payload.coverImage || '',
      category: payload.category || 'Teknologi',
      rating: 4.8,
      reviewsCount: 1,
      status: 'Tersedia',
      publisher: payload.publisher || 'Penerbit Tidak Tercatat',
      publishYear: payload.publishYear || new Date().getFullYear(),
      pages: payload.pages || 200,
      isbn: payload.isbn || 'ISBN Belum Terdata',
      language: payload.language || 'Indonesia',
      shelfLocation: payload.shelfLocation || 'Rak Ekspedisi (Buku Baru)',
      description: payload.description || 'Tidak ada deskripsi tersedia.',
      summaryQuote: `Buku karya ${payload.author} yang diimpor ke koleksi resmi PerpusKita via Google Books API.`,
      borrowCount: 0,
      googleVolumeId: payload.googleVolumeId,
      stockCount: payload.stockCount || 3,
      previewLink: payload.previewLink,
      infoLink: payload.infoLink,
      isImportedFromGoogle: true,
    };

    setBooks((prev) => {
      const updated = [newBook, ...prev];
      try {
        const customOnly = updated.filter((b) => b.isImportedFromGoogle);
        localStorage.setItem('perpuskita_custom_books', JSON.stringify(customOnly));
      } catch (_) {}
      return updated;
    });

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'add_book',
      text: `Admin mengimpor buku "${newBook.title}" ke rak perpustakaan`,
      timeAgo: 'Baru saja',
      iconName: 'PlusCircle',
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast(`Buku "${newBook.title}" berhasil diimpor ke ${newBook.shelfLocation}!`, 'success');
    return { success: true, message: 'Buku berhasil diimpor', book: newBook };
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        loans,
        favorites,
        currentUser,
        activities,
        reviews,
        searchQuery,
        selectedCategory,
        toasts,
        setSearchQuery,
        setSelectedCategory,
        switchUserRole,
        toggleFavorite,
        borrowBook,
        renewLoan,
        returnLoan,
        addReview,
        showToast,
        dismissToast,
        getBookById,
        getBookBySlug,
        isBookInLocalInventory,
        importBookFromGoogle,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}
