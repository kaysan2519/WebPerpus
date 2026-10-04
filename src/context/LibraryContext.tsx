'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Book, 
  LoanRecord, 
  ActivityItem, 
  Review, 
  ImportBookPayload,
  FineRecord,
  NotificationItem,
  MemberRecord,
  MemberStatus,
  CategoryRecord,
  LibrarySettings,
  BookCategory,
  ReservationRecord
} from '@/types';
import { 
  INITIAL_BOOKS, 
  INITIAL_LOANS, 
  INITIAL_ACTIVITIES, 
  INITIAL_REVIEWS,
  INITIAL_FINES,
  INITIAL_NOTIFICATIONS,
  INITIAL_MEMBERS,
  INITIAL_CATEGORIES,
  INITIAL_SETTINGS,
  INITIAL_RESERVATIONS
} from '@/data/books';

export type UserRole = 'siswa' | 'admin' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  memberId: string;
  phone?: string;
  address?: string;
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
  fines: FineRecord[];
  reservations: ReservationRecord[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  members: MemberRecord[];
  categories: CategoryRecord[];
  settings: LibrarySettings;
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
  reserveBook: (bookId: string) => { success: boolean; message: string; reservation?: ReservationRecord };
  cancelReservation: (reservationId: string) => { success: boolean; message: string };
  addReview: (bookId: string, rating: number, comment: string) => void;
  deleteReview: (reviewId: string) => void;
  payFine: (fineId: string) => void;
  payFineWithDetails: (fineId: string, method: string, ref: string) => { success: boolean; message: string };
  waiveFine: (fineId: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  addMember: (member: Omit<MemberRecord, 'id' | 'joinDate' | 'totalLoans' | 'activeLoansCount'>) => void;
  updateMemberStatus: (id: string, status: MemberStatus) => void;
  addCategory: (cat: Omit<CategoryRecord, 'id' | 'bookCount'>) => void;
  updateSettings: (newSettings: Partial<LibrarySettings>) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  addBookManual: (payload: Partial<Book>) => { success: boolean; message: string; book?: Book };
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
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
  const [fines, setFines] = useState<FineRecord[]>(INITIAL_FINES);
  const [reservations, setReservations] = useState<ReservationRecord[]>(INITIAL_RESERVATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [members, setMembers] = useState<MemberRecord[]>(INITIAL_MEMBERS);
  const [categories, setCategories] = useState<CategoryRecord[]>(INITIAL_CATEGORIES);
  const [settings, setSettings] = useState<LibrarySettings>(INITIAL_SETTINGS);
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
    phone: '0812-3456-7890',
    address: 'Jl. Merdeka No. 45, Jakarta Selatan',
  });

  // Try to load persisted custom books from localStorage on mount
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
        phone: '0812-9988-7766',
        address: 'Gedung Perpustakaan Pusat Lt. 2',
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
        phone: '0812-3456-7890',
        address: 'Jl. Merdeka No. 45, Jakarta Selatan',
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

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
    setMembers((prev) =>
      prev.map((m) =>
        m.id === currentUser.id
          ? {
              ...m,
              name: updates.name || m.name,
              email: updates.email || m.email,
              phone: updates.phone || m.phone,
              address: updates.address || m.address,
            }
          : m
      )
    );
    showToast('Profil keanggotaan berhasil diperbarui!', 'success');
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

    // Update member loans count
    setMembers((prev) =>
      prev.map((m) =>
        m.id === currentUser.id
          ? { ...m, totalLoans: m.totalLoans + 1, activeLoansCount: m.activeLoansCount + 1 }
          : m
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

    // Create notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Peminjaman Sukses',
      message: `Buku "${book.title}" berhasil dipinjam. Batas pengembalian: ${newLoan.dueDate}.`,
      isRead: false,
      type: 'SUCCESS',
      createdAt: 'Baru saja',
      link: '/peminjaman',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Berhasil meminjam "${book.title}". Jatuh tempo: ${newLoan.dueDate}`, 'success');
    return { success: true, message: 'Peminjaman berhasil diproses!' };
  };

  const renewLoan = (loanId: string) => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) {
      return { success: false, message: 'Catatan peminjaman tidak ditemukan' };
    }

    if (loan.renewCount >= settings.maxRenewCount) {
      showToast(`Batas perpanjangan maksimal (${settings.maxRenewCount}x) telah tercapai`, 'error');
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
              renewable: l.renewCount + 1 < settings.maxRenewCount,
            }
          : l
      )
    );

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Perpanjangan Berhasil',
      message: `Peminjaman "${loan.bookTitle}" diperpanjang hingga ${newDueDateStr}.`,
      isRead: false,
      type: 'RENEW',
      createdAt: 'Baru saja',
      link: '/peminjaman',
    };
    setNotifications((prev) => [newNotif, ...prev]);

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

    // Update active loans count for member
    setMembers((prev) =>
      prev.map((m) =>
        m.id === loan.userId
          ? { ...m, activeLoansCount: Math.max(0, m.activeLoansCount - 1) }
          : m
      )
    );

    // Add activity
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'return',
      text: `${loan.userName} mengembalikan buku ${loan.bookTitle}`,
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
      userRole: currentUser.role === 'admin' ? 'Staf Perpustakaan' : 'Anggota PerpusKita',
      rating,
      date: 'Hari ini',
      comment,
      likes: 0,
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast('Ulasan Anda berhasil diterbitkan!', 'success');
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    showToast('Ulasan berhasil dihapus', 'info');
  };

  const payFine = (fineId: string) => {
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const paidDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    setFines((prev) =>
      prev.map((f) =>
        f.id === fineId ? { ...f, status: 'Lunas', paidAt: paidDate } : f
      )
    );
    showToast('Denda keterlambatan berhasil dilunasi!', 'success');
  };

  const payFineWithDetails = (fineId: string, method: string, ref: string) => {
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const paidDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    const fineItem = fines.find((f) => f.id === fineId);

    setFines((prev) =>
      prev.map((f) =>
        f.id === fineId
          ? {
              ...f,
              status: 'Lunas',
              paidAt: paidDate,
              paymentMethod: method,
              transactionRef: ref,
            }
          : f
      )
    );

    // Create confirmation notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Pembayaran Denda Lunas',
      message: `Pembayaran denda sebesar Rp ${(fineItem?.amount || 0).toLocaleString('id-ID')} via ${method} terverifikasi. Ref: ${ref}.`,
      isRead: false,
      type: 'SUCCESS',
      createdAt: 'Baru saja',
      link: '/dashboard',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Add activity
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'return',
      text: `${currentUser.name} melunasi denda keterlambatan via ${method}`,
      timeAgo: 'Baru saja',
      iconName: 'CheckCircle2',
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast(`Pembayaran denda via ${method} berhasil diverifikasi!`, 'success');
    return { success: true, message: 'Denda berhasil dilunasi' };
  };

  const reserveBook = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) {
      return { success: false, message: 'Buku tidak ditemukan' };
    }

    // Check if already reserved by this user
    const existingActive = reservations.find(
      (r) => r.bookId === bookId && r.userId === currentUser.id && (r.status === 'Menunggu' || r.status === 'Siap Diambil')
    );
    if (existingActive) {
      showToast(`Anda sudah memiliki reservasi aktif untuk "${book.title}" (Antrean #${existingActive.queuePosition})`, 'info');
      return { success: false, message: 'Buku sudah direservasi sebelumnya' };
    }

    const activeReservationsCount = reservations.filter((r) => r.bookId === bookId && r.status === 'Menunggu').length;
    const queuePosition = activeReservationsCount + 1;

    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const resDateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
    
    // Estimate available in 7 days
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 7);
    const estDateStr = `${estDate.getDate()} ${months[estDate.getMonth()]} ${estDate.getFullYear()}`;

    const newReservation: ReservationRecord = {
      id: `res-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCover: book.coverImage,
      userId: currentUser.id,
      userName: currentUser.name,
      reservationDate: resDateStr,
      estimatedAvailableDate: estDateStr,
      queuePosition,
      status: 'Menunggu',
      notes: `Antrean ke-${queuePosition} via portal digital.`
    };

    setReservations((prev) => [newReservation, ...prev]);

    // Create notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Reservasi Berhasil',
      message: `Anda masuk antrean ke-${queuePosition} untuk buku "${book.title}". Perkiraan siap: ${estDateStr}.`,
      isRead: false,
      type: 'SUCCESS',
      createdAt: 'Baru saja',
      link: '/dashboard',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Add activity
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'borrow',
      text: `${currentUser.name} mereservasi antrean buku ${book.title}`,
      timeAgo: 'Baru saja',
      iconName: 'Clock',
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast(`Berhasil reservasi "${book.title}". Anda antrean ke-${queuePosition}.`, 'success');
    return { success: true, message: `Reservasi berhasil (Antrean #${queuePosition})`, reservation: newReservation };
  };

  const cancelReservation = (reservationId: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status: 'Dibatalkan' } : r))
    );
    showToast('Reservasi buku berhasil dibatalkan', 'info');
    return { success: true, message: 'Reservasi berhasil dibatalkan' };
  };

  const waiveFine = (fineId: string) => {
    setFines((prev) =>
      prev.map((f) =>
        f.id === fineId ? { ...f, status: 'Dibebaskan' } : f
      )
    );
    showToast('Denda berhasil dibebaskan oleh admin!', 'info');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('Semua notifikasi ditandai sudah dibaca', 'info');
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('Kotak notifikasi dibersihkan', 'info');
  };

  const addMember = (payload: Omit<MemberRecord, 'id' | 'joinDate' | 'totalLoans' | 'activeLoansCount'>) => {
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const joinDateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    const newMember: MemberRecord = {
      ...payload,
      id: `u-${Date.now()}`,
      joinDate: joinDateStr,
      totalLoans: 0,
      activeLoansCount: 0,
    };

    setMembers((prev) => [newMember, ...prev]);
    showToast(`Anggota baru "${newMember.name}" (${newMember.memberId}) berhasil didaftarkan!`, 'success');
  };

  const updateMemberStatus = (id: string, status: MemberStatus) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    showToast(`Status anggota berhasil diperbarui menjadi ${status}`, 'info');
  };

  const addCategory = (payload: Omit<CategoryRecord, 'id' | 'bookCount'>) => {
    const newCat: CategoryRecord = {
      ...payload,
      id: `cat-${Date.now()}`,
      bookCount: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Kategori "${newCat.name}" dengan prefix ${newCat.shelfPrefix} berhasil ditambahkan!`, 'success');
  };

  const updateSettings = (newSettings: Partial<LibrarySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Konfigurasi sistem perpustakaan berhasil disimpan!', 'success');
  };

  const addBookManual = (payload: Partial<Book>): { success: boolean; message: string; book?: Book } => {
    if (!payload.title || !payload.author) {
      return { success: false, message: 'Judul dan nama pengarang buku wajib diisi' };
    }

    const cleanSlug = payload.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const uniqueSlug = `${cleanSlug || 'buku'}-${Math.random().toString(36).substring(2, 6)}`;

    const newBook: Book = {
      id: `book-${Date.now()}`,
      slug: uniqueSlug,
      title: payload.title,
      author: payload.author,
      coverImage: payload.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
      category: payload.category || 'Teknologi',
      rating: 4.5,
      reviewsCount: 0,
      status: 'Tersedia',
      publisher: payload.publisher || 'Penerbit PerpusKita',
      publishYear: payload.publishYear || new Date().getFullYear(),
      pages: payload.pages || 250,
      isbn: payload.isbn || `978-602-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}-${Math.floor(1 + Math.random() * 9)}`,
      language: payload.language || 'Indonesia',
      shelfLocation: payload.shelfLocation || 'Rak Ekspedisi (Buku Baru)',
      description: payload.description || 'Buku koleksi perpustakaan yang ditambahkan melalui panel admin.',
      summaryQuote: `Buku karya ${payload.author} yang terdaftar resmi di katalog PerpusKita.`,
      borrowCount: 0,
      stockCount: payload.stockCount || 5,
    };

    setBooks((prev) => {
      const updated = [newBook, ...prev];
      try {
        localStorage.setItem('perpuskita_custom_books', JSON.stringify(updated.filter(b => b.id.startsWith('book-') || b.isImportedFromGoogle)));
      } catch (_) {}
      return updated;
    });

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'add_book',
      text: `Admin menambahkan buku "${newBook.title}" ke katalog`,
      timeAgo: 'Baru saja',
      iconName: 'PlusCircle',
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast(`Buku "${newBook.title}" berhasil ditambahkan ke inventaris!`, 'success');
    return { success: true, message: 'Buku berhasil ditambahkan', book: newBook };
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
    showToast('Data buku berhasil diperbarui!', 'success');
  };

  const deleteBook = (id: string) => {
    const book = books.find((b) => b.id === id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
    showToast(`Buku "${book?.title || 'Buku'}" berhasil dihapus dari inventaris`, 'info');
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
        const customOnly = updated.filter((b) => b.isImportedFromGoogle || b.id.startsWith('book-'));
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

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <LibraryContext.Provider
      value={{
        books,
        loans,
        favorites,
        currentUser,
        activities,
        reviews,
        fines,
        reservations,
        notifications,
        unreadNotificationsCount,
        members,
        categories,
        settings,
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
        reserveBook,
        cancelReservation,
        addReview,
        deleteReview,
        payFine,
        payFineWithDetails,
        waiveFine,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        addMember,
        updateMemberStatus,
        addCategory,
        updateSettings,
        updateUserProfile,
        addBookManual,
        updateBook,
        deleteBook,
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
