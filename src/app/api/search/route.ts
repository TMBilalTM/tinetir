import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Genel arama (hashtag ve içerik)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')

    if (!q) {
      return NextResponse.json(
        { error: 'Arama sorgusu gerekli' },
        { status: 400 }
      )
    }

    const query = q.trim().toLowerCase()

    // Tweet'leri ara
    const results = await withRetry(async () => {
      return await prisma.tweet.findMany({
        where: {
          OR: [
            {
              content: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              hashtags: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              mentions: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              user: {
                OR: [
                  {
                    name: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                  {
                    username: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              verified: true,
              badges: true,
            },
          },
          likes: {
            select: {
              id: true,
              userId: true,
            },
          },
          retweets: {
            select: {
              id: true,
              userId: true,
            },
          },
          replies: {
            select: {
              id: true,
              userId: true,
            },
          },
          _count: {
            select: {
              likes: true,
              retweets: true,
              replies: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50, // Maksimum 50 tweet
      })
    })

    // Date'leri string'e çevir ve JSON alanları parse et
    const tweetsWithStringDates = results.map(tweet => {
      const tweetData = tweet as any
      return {
        ...tweet,
        createdAt: tweet.createdAt.toISOString(),
        images: tweetData.images ? JSON.parse(tweetData.images) : [],
        location: tweetData.location || null,
        hashtags: tweetData.hashtags ? JSON.parse(tweetData.hashtags) : [],
        mentions: tweetData.mentions ? JSON.parse(tweetData.mentions) : [],
      }
    })

    return NextResponse.json(tweetsWithStringDates)
  } catch (error) {
    console.error('Arama hatası:', error)
    
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
      { error: 'Arama yapılamadı' },
      { status: 500 }
    )
  }
}
