import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Genel arama (tweet içeriği, kullanıcı adı, hashtag)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    
    if (!q || q.trim().length === 0) {
      return NextResponse.json(
        { error: 'Arama sorgusu gerekli' },
        { status: 400 }
      )
    }

    const query = q.trim().toLowerCase()

    // Timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Search timeout')), 8000)
    })

    // Tweet'leri ara
    const queryPromise = prisma.tweet.findMany({
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

    const tweets = await Promise.race([queryPromise, timeoutPromise]) as any[]

    // Date'leri string'e çevir ve JSON alanları parse et
    const tweetsWithStringDates = tweets.map(tweet => {
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
    
    // Connection error handling
    if (error instanceof Error && error.message.includes('too many connections')) {
      return NextResponse.json(
        { error: 'Veritabanı meşgul, lütfen birkaç saniye sonra tekrar deneyin' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Arama yapılamadı' },
      { status: 500 }
    )
  }
}
