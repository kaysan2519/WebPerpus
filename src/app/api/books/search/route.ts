import { NextRequest, NextResponse } from 'next/server';
import { searchGoogleBooks, SearchApiParams } from '@/lib/google-books';
import { INITIAL_BOOKS } from '@/data/books';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  // 1. Validate required parameter 'q'
  if (!q || !q.trim()) {
    return NextResponse.json(
      {
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Parameter "q" (kata kunci pencarian) wajib disertakan.',
        totalItems: 0,
        startIndex: 0,
        items: [],
      },
      { status: 400 }
    );
  }

  // 2. Extract and validate optional parameters
  const maxResultsParam = searchParams.get('maxResults');
  const startIndexParam = searchParams.get('startIndex');
  const orderByParam = searchParams.get('orderBy') as 'relevance' | 'newest' | null;
  const filterParam = searchParams.get('filter') as any;
  const langRestrictParam = searchParams.get('langRestrict');
  const printTypeParam = searchParams.get('printType') as any;
  const projectionParam = searchParams.get('projection') as any;

  const maxResults = maxResultsParam ? Math.min(Math.max(parseInt(maxResultsParam, 10) || 20, 1), 40) : 20;
  const startIndex = startIndexParam ? Math.max(parseInt(startIndexParam, 10) || 0, 0) : 0;

  const apiParams: SearchApiParams = {
    q: q.trim(),
    maxResults,
    startIndex,
    orderBy: orderByParam || undefined,
    filter: filterParam || undefined,
    langRestrict: langRestrictParam || undefined,
    printType: printTypeParam || undefined,
    projection: projectionParam || undefined,
  };

  try {
    // Call Google Books API with current local inventory reference
    const result = await searchGoogleBooks(apiParams, INITIAL_BOOKS);

    // If quota exceeded, return 200 with quotaExceeded flag so the frontend can handle it with dignity
    if (result.quotaExceeded) {
      // Find matching local books as graceful fallback
      const queryLower = q.toLowerCase();
      const localMatches = INITIAL_BOOKS.filter(
        (b) =>
          b.title.toLowerCase().includes(queryLower) ||
          b.author.toLowerCase().includes(queryLower) ||
          b.category.toLowerCase().includes(queryLower)
      ).map((b) => ({
        id: b.googleVolumeId || `local-${b.id}`,
        title: b.title,
        authors: [b.author],
        description: b.description,
        thumbnail: b.coverImage,
        publisher: b.publisher,
        publishedDate: b.publishYear.toString(),
        categories: [b.category],
        pageCount: b.pages,
        language: b.language === 'Indonesia' ? 'id' : 'en',
        isbn13: b.isbn,
        inLocalInventory: true,
        localBookId: b.id,
        localShelfLocation: b.shelfLocation,
        localStockCount: 3,
      }));

      return NextResponse.json({
        ...result,
        localFallbackAvailable: true,
        fallbackItems: localMatches,
      });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'Terjadi kesalahan sistem saat memproses pencarian buku.',
        totalItems: 0,
        startIndex: 0,
        items: [],
      },
      { status: 500 }
    );
  }
}
