import { NextResponse } from 'next/server';
import { INITIAL_CATEGORIES } from '@/data/books';

export async function GET() {
  return NextResponse.json({
    success: true,
    total: INITIAL_CATEGORIES.length,
    data: INITIAL_CATEGORIES,
  });
}
