import { NextRequest, NextResponse } from 'next/server';
import { getGoogleBookById } from '@/lib/google-books';
import { INITIAL_BOOKS } from '@/data/books';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const volumeId = params.id;

  if (!volumeId) {
    return NextResponse.json(
      { success: false, message: 'ID buku tidak valid' },
      { status: 400 }
    );
  }

  try {
    const result = await getGoogleBookById(volumeId, INITIAL_BOOKS);
    if (!result.success) {
      return NextResponse.json(result, { status: result.quotaExceeded ? 429 : 404 });
    }
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem saat memproses detail buku.' },
      { status: 500 }
    );
  }
}
