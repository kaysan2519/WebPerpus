import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_LOANS, INITIAL_BOOKS } from '@/data/books';
import { LoanRecord } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');

  let filtered = [...INITIAL_LOANS];

  if (userId) {
    filtered = filtered.filter((l) => l.userId === userId);
  }

  if (status && status !== 'Semua') {
    filtered = filtered.filter((l) => l.status === status);
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    data: filtered,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookId, userId, userName, durationDays = 14 } = body;

    if (!bookId) {
      return NextResponse.json(
        { success: false, error: 'VALIDATION_ERROR', message: 'Parameter "bookId" wajib disertakan.' },
        { status: 400 }
      );
    }

    const book = INITIAL_BOOKS.find((b) => b.id === bookId);
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'NOT_FOUND', message: 'Buku tidak ditemukan dalam katalog lokal.' },
        { status: 404 }
      );
    }

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + durationDays);

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
      dueDate: formatDate(dueDate),
      status: 'Dipinjam',
      renewable: true,
      renewCount: 0,
      userId: userId || 'u-1',
      userName: userName || 'Anggota PerpusKita',
    };

    return NextResponse.json(
      {
        success: true,
        message: `Peminjaman buku "${book.title}" berhasil diproses.`,
        data: newLoan,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'Gagal memproses peminjaman buku.' },
      { status: 500 }
    );
  }
}
