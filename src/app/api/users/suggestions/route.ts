import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, withRetry } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Takip önerisi kullanıcıları getir
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    // Şu anda takip ettiği kullanıcıları al
    const following = await withRetry(async () => {
      return await prisma.follow.findMany({
        where: { followerId: session.user.id },
        select: { followingId: true },
      })
    })

    const followingIds = following.map(f => f.followingId)
    followingIds.push(session.user.id) // Kendisini de hariç tut

    // En aktif kullanıcıları al (en çok tweet atan)
    const suggestedUsers = await withRetry(async () => {
      return await prisma.user.findMany({
        where: {
          id: {
            notIn: followingIds,
          },
        },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          _count: {
            select: {
              tweets: true,
              followers: true,
            },
          },
        },
        orderBy: [
          {
            followers: {
              _count: 'desc',
            },
          },
          {
            tweets: {
              _count: 'desc',
            },
          },
        ],
        take: 8,
      })
    })

    // Kullanıcı verilerini formatlayalım
    const formattedUsers = suggestedUsers.map(user => ({
      id: user.id,
      name: user.name || 'Adsız Kullanıcı',
      username: user.username || user.id.slice(0, 8),
      image: user.image,
      followersCount: user._count.followers,
      tweetsCount: user._count.tweets,
    }))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error('Suggested users hatası:', error)
    
    // Database connection error handling
    if (error instanceof Error && (
      error.message.includes('Database connection failed') ||
      error.message.includes('too many connections')
    )) {
      return NextResponse.json(
        { error: 'Veritabanı geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Önerilen kullanıcılar getirilemedi' },
      { status: 500 }
    )
  }
}

