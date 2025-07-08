import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Kullanıcı profilini getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { id: username }, // ID ile de arama yapabilir
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        banner: true,
        bio: true,
        location: true,
        website: true,
        verified: true,
        badges: true,
        createdAt: true,
        _count: {
          select: {
            tweets: true,
            followers: true,
            following: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Date'i string'e çevir ve badges'ı parse et
    const userWithStringDate = {
      ...user,
      createdAt: user.createdAt.toISOString(),
      badges: user.badges ? JSON.parse(user.badges) : [],
    }

    return NextResponse.json(userWithStringDate)
  } catch (error) {
    console.error('Kullanıcı profili getirme hatası:', error)
    return NextResponse.json(
      { error: 'Kullanıcı profili getirilemedi' },
      { status: 500 }
    )
  }
}
