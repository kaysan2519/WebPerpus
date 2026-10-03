import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_MEMBERS } from '@/data/books';
import { MemberRecord } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const role = searchParams.get('role');

  let list = [...INITIAL_MEMBERS];

  if (q && q.trim()) {
    const query = q.toLowerCase();
    list = list.filter((m) =>
      m.name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.memberId.toLowerCase().includes(query)
    );
  }

  if (role && role !== 'Semua') {
    list = list.filter((m) => m.role === role);
  }

  return NextResponse.json({
    success: true,
    total: list.length,
    data: list,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role = 'MEMBER', phone, address } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'VALIDATION_ERROR', message: 'Nama dan email wajib diisi.' },
        { status: 400 }
      );
    }

    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const joinDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    const newMember: MemberRecord = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      memberId: `PK-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phone: phone || '0812-3456-7890',
      address: address || 'Jakarta',
      status: 'Aktif',
      joinDate,
      totalLoans: 0,
      activeLoansCount: 0,
    };

    return NextResponse.json(
      {
        success: true,
        message: `Anggota ${newMember.name} berhasil didaftarkan.`,
        data: newMember,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'Gagal mendaftarkan anggota.' },
      { status: 500 }
    );
  }
}
