export type BookStatus = 'Tersedia' | 'Dipinjam' | 'Dipesan';

export type BookCategory = 
  | 'Semua'
  | 'Fiksi'
  | 'Pendidikan'
  | 'Teknologi'
  | 'Sejarah'
  | 'Kesehatan'
  | 'Psikologi'
  | 'Bisnis'
  | 'Pengembangan Diri'
  | 'Lainnya';

export interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  coverImage: string;
  category: BookCategory;
  rating: number;
  reviewsCount: number;
  status: BookStatus;
  publisher: string;
  publishYear: number;
  pages: number;
  isbn: string;
  language: 'Indonesia' | 'Inggris';
  shelfLocation: string;
  description: string;
  summaryQuote?: string;
  isEditorChoice?: boolean;
  isPopular?: boolean;
  borrowCount: number;
  googleVolumeId?: string;
  stockCount?: number;
  previewLink?: string;
  infoLink?: string;
  isImportedFromGoogle?: boolean;
}

export type LoanStatus = 'Dipinjam' | 'Dikembalikan' | 'Terlambat';

export interface LoanRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  borrowDate: string; // e.g. "12 Sep 2024"
  dueDate: string;    // e.g. "26 Sep 2024"
  returnDate?: string;
  status: LoanStatus;
  renewable: boolean;
  renewCount: number;
  userId: string;
  userName: string;
}

export interface Review {
  id: string;
  bookId: string;
  userName: string;
  userRole: string;
  rating: number;
  date: string;
  comment: string;
  likes: number;
}

export interface ActivityItem {
  id: string;
  type: 'borrow' | 'return' | 'register' | 'add_book';
  text: string;
  timeAgo: string;
  iconName: string;
}

export interface LibraryStats {
  totalBooks: number;
  totalMembers: number;
  activeLoans: number;
  overdueLoans: number;
  favoriteCount: number;
  userReviewsCount: number;
}

export interface GoogleBookVolume {
  id: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  publisher: string;
  publishedDate: string;
  categories: string[];
  pageCount: number;
  language: string;
  isbn10?: string;
  isbn13?: string;
  previewLink?: string;
  infoLink?: string;
  inLocalInventory?: boolean;
  localBookId?: string;
  localShelfLocation?: string;
  localStockCount?: number;
}

export interface GoogleBooksSearchResponse {
  success: boolean;
  query: string;
  totalItems: number;
  startIndex: number;
  items: GoogleBookVolume[];
  source: 'google_books' | 'local_fallback';
  error?: string;
  message?: string;
  quotaExceeded?: boolean;
}

export interface ImportBookPayload {
  googleVolumeId?: string;
  title: string;
  author: string;
  coverImage?: string;
  category: BookCategory;
  publisher: string;
  publishYear: number;
  pages: number;
  isbn: string;
  language: 'Indonesia' | 'Inggris';
  shelfLocation: string;
  stockCount: number;
  description: string;
  previewLink?: string;
  infoLink?: string;
}
