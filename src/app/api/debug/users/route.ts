import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Tüm kullanıcıları listele (test için)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
      take: 10, // İlk 10 kullanıcı
    })

    return NextResponse.json({
      count: users.length,
      users: users
    })

  } catch (error) {
    console.error('Kullanıcı listesi getirme hatası:', error)
    return NextResponse.json(
      { error: 'Kullanıcı listesi getirilemedi' },
      { status: 500 }
    )
  }
}
