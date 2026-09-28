import { GoogleBookVolume, GoogleBooksSearchResponse, Book } from '@/types';

export interface SearchApiParams {
  q: string;
  maxResults?: number;
  startIndex?: number;
  orderBy?: 'relevance' | 'newest';
  filter?: 'ebooks' | 'free-ebooks' | 'full' | 'paid-ebooks' | 'partial';
  langRestrict?: string;
  printType?: 'books' | 'magazines' | 'all';
  projection?: 'lite' | 'full';
}

/**
 * Sanitize & upgrade Google Books thumbnail to HTTPS and higher resolution if possible
 */
export function sanitizeThumbnail(imageLinks?: { thumbnail?: string; smallThumbnail?: string }): string {
  if (!imageLinks) return '';
  const rawUrl = imageLinks.thumbnail || imageLinks.smallThumbnail || '';
  if (!rawUrl) return '';
  
  // Upgrade to https and remove edge=curl parameter for cleaner rectangular presentation
  let secureUrl = rawUrl.replace(/^http:\/\//i, 'https://');
  // Some zoom=1 links return tiny blurry images; zoom=2 or keeping zoom=1 with curl removed
  return secureUrl;
}

/**
 * Remove raw HTML tags often present in Google Books volume descriptions
 */
export function stripHtml(html?: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'");
}

/**
 * Map raw Google Books volume to PerpusKita GoogleBookVolume schema
 */
export function formatGoogleBook(item: any, localBooks: Book[] = []): GoogleBookVolume {
  const vi = item.volumeInfo || {};
  
  // Extract ISBN
  let isbn10 = '';
  let isbn13 = '';
  if (Array.isArray(vi.industryIdentifiers)) {
    for (const id of vi.industryIdentifiers) {
      if (id.type === 'ISBN_13') isbn13 = id.identifier;
      if (id.type === 'ISBN_10') isbn10 = id.identifier;
    }
  }

  // Cross-check against local library inventory for duplicate / existing stock detection
  const existingLocalBook = localBooks.find((lb) => {
    if (lb.googleVolumeId && lb.googleVolumeId === item.id) return true;
    if (isbn13 && lb.isbn === isbn13) return true;
    if (isbn10 && lb.isbn === isbn10) return true;
    // Normalized title match if title is distinctive
    if (lb.title.toLowerCase().trim() === (vi.title || '').toLowerCase().trim()) return true;
    return false;
  });

  return {
    id: item.id || '',
    title: vi.title || 'Tanpa Judul',
    authors: Array.isArray(vi.authors) && vi.authors.length > 0 
      ? vi.authors 
      : ['Penulis tidak dicantumkan'],
    description: stripHtml(vi.description) || 'Tidak ada deskripsi tersedia untuk buku ini.',
    thumbnail: sanitizeThumbnail(vi.imageLinks),
    publisher: vi.publisher || 'Penerbit tidak tercatat',
    publishedDate: vi.publishedDate || '-',
    categories: Array.isArray(vi.categories) && vi.categories.length > 0 
      ? vi.categories 
      : ['Umum'],
    pageCount: typeof vi.pageCount === 'number' ? vi.pageCount : 0,
    language: (vi.language || 'id').toLowerCase(),
    isbn10: isbn10 || undefined,
    isbn13: isbn13 || undefined,
    previewLink: vi.previewLink || '',
    infoLink: vi.infoLink || '',
    inLocalInventory: !!existingLocalBook,
    localBookId: existingLocalBook?.id,
    localShelfLocation: existingLocalBook?.shelfLocation,
    localStockCount: existingLocalBook?.stockCount || (existingLocalBook ? 1 : 0),
  };
}

/**
 * Call the official Google Books API with validation, timeout, and friendly error handling
 */
export async function searchGoogleBooks(
  params: SearchApiParams,
  localBooks: Book[] = []
): Promise<GoogleBooksSearchResponse> {
  const query = params.q?.trim();
  if (!query) {
    return {
      success: false,
      query: '',
      totalItems: 0,
      startIndex: 0,
      items: [],
      source: 'google_books',
      error: 'EMPTY_QUERY',
      message: 'Kata kunci pencarian tidak boleh kosong.',
    };
  }

  const url = new URL('https://www.googleapis.com/books/v1/volumes');
  url.searchParams.set('q', query);

  // Parameter validation
  const maxResults = Math.min(Math.max(params.maxResults || 20, 1), 40);
  url.searchParams.set('maxResults', maxResults.toString());

  if (params.startIndex && params.startIndex > 0) {
    url.searchParams.set('startIndex', params.startIndex.toString());
  }

  if (params.orderBy && ['relevance', 'newest'].includes(params.orderBy)) {
    url.searchParams.set('orderBy', params.orderBy);
  }

  if (params.filter && ['ebooks', 'free-ebooks', 'full', 'paid-ebooks', 'partial'].includes(params.filter)) {
    url.searchParams.set('filter', params.filter);
  }

  if (params.langRestrict && params.langRestrict.trim()) {
    url.searchParams.set('langRestrict', params.langRestrict.trim());
  }

  if (params.printType && ['books', 'magazines', 'all'].includes(params.printType)) {
    url.searchParams.set('printType', params.printType);
  }

  if (params.projection && ['lite', 'full'].includes(params.projection)) {
    url.searchParams.set('projection', params.projection);
  }

  // Server-side API key if configured
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (apiKey) {
    url.searchParams.set('key', apiKey);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
      next: { revalidate: 60 }, // Cache on server for 60 seconds
    });

    clearTimeout(timeoutId);

    // Handle Rate Limiting / Quota
    if (res.status === 429) {
      return {
        success: false,
        query,
        totalItems: 0,
        startIndex: params.startIndex || 0,
        items: [],
        source: 'google_books',
        quotaExceeded: true,
        error: 'QUOTA_EXCEEDED',
        message: 'Batas kuota harian publik Google Books API saat ini sedang tercapai. Anda dapat memasukkan GOOGLE_BOOKS_API_KEY di environment server atau tetap menjelajahi katalog lokal PerpusKita.',
      };
    }

    if (!res.ok) {
      let errDetail = 'Permintaan ke Google Books API gagal.';
      try {
        const errJson = await res.json();
        if (errJson?.error?.message) {
          errDetail = errJson.error.message;
        }
      } catch (_) {}

      return {
        success: false,
        query,
        totalItems: 0,
        startIndex: params.startIndex || 0,
        items: [],
        source: 'google_books',
        error: `HTTP_${res.status}`,
        message: `Layanan Google Books tidak dapat diakses saat ini (${res.status}). ${errDetail}`,
      };
    }

    const data = await res.json();
    const rawItems = Array.isArray(data.items) ? data.items : [];
    const formattedItems = rawItems.map((item: any) => formatGoogleBook(item, localBooks));

    return {
      success: true,
      query,
      totalItems: typeof data.totalItems === 'number' ? data.totalItems : formattedItems.length,
      startIndex: params.startIndex || 0,
      items: formattedItems,
      source: 'google_books',
    };
  } catch (err: any) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      return {
        success: false,
        query,
        totalItems: 0,
        startIndex: params.startIndex || 0,
        items: [],
        source: 'google_books',
        error: 'TIMEOUT',
        message: 'Permintaan pencarian ke Google Books melebihi batas waktu (timeout). Silakan periksa koneksi internet Anda.',
      };
    }

    return {
      success: false,
      query,
      totalItems: 0,
      startIndex: params.startIndex || 0,
      items: [],
      source: 'google_books',
      error: 'NETWORK_ERROR',
      message: 'Gagal terhubung dengan server Google Books API. Silakan coba beberapa saat lagi.',
    };
  }
}

/**
 * Fetch a single Google Books volume by its ID
 */
export async function getGoogleBookById(
  volumeId: string,
  localBooks: Book[] = []
): Promise<{ success: boolean; data?: GoogleBookVolume; message?: string; quotaExceeded?: boolean }> {
  if (!volumeId) {
    return { success: false, message: 'Volume ID tidak valid.' };
  }

  const url = new URL(`https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(volumeId)}`);
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (apiKey) {
    url.searchParams.set('key', apiKey);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
      next: { revalidate: 300 }, // Cache detail for 5 minutes
    });

    clearTimeout(timeoutId);

    if (res.status === 429) {
      return {
        success: false,
        quotaExceeded: true,
        message: 'Batas kuota harian publik Google Books API saat ini sedang tercapai.',
      };
    }

    if (res.status === 404) {
      return {
        success: false,
        message: 'Buku dengan ID volume tersebut tidak ditemukan di Google Books.',
      };
    }

    if (!res.ok) {
      return {
        success: false,
        message: `Gagal mengambil detail buku dari Google Books (${res.status}).`,
      };
    }

    const item = await res.json();
    const formatted = formatGoogleBook(item, localBooks);

    return {
      success: true,
      data: formatted,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    return {
      success: false,
      message: 'Koneksi ke Google Books terputus atau melebihi batas waktu.',
    };
  }
}
