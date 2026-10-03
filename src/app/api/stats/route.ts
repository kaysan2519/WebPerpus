import { NextResponse } from 'next/server';
import { INITIAL_BOOKS, INITIAL_LOANS, INITIAL_MEMBERS, LOAN_CHART_DATA, INITIAL_CATEGORIES } from '@/data/books';

export async function GET() {
  try {
    const activeLoans = INITIAL_LOANS.filter((l) => l.status === 'Dipinjam').length;
    const overdueLoans = INITIAL_LOANS.filter((l) => l.status === 'Terlambat').length;
    const returnedLoans = INITIAL_LOANS.filter((l) => l.status === 'Dikembalikan').length;

    const topBorrowed = [...INITIAL_BOOKS]
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 5)
      .map((b) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        borrowCount: b.borrowCount,
        category: b.category,
      }));

    return NextResponse.json({
      success: true,
      data: {
        totalBooks: INITIAL_BOOKS.length,
        totalMembers: INITIAL_MEMBERS.length + 3200,
        activeLoans,
        overdueLoans,
        returnedLoans,
        totalCategories: INITIAL_CATEGORIES.length,
        topBorrowed,
        circulationChart: LOAN_CHART_DATA,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'INTERNAL_SERVER_ERROR', message: 'Gagal mengambil statistik perpustakaan.' },
      { status: 500 }
    );
  }
}
