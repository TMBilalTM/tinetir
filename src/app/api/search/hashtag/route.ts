import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Hashtag ile tweet ara
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hashtag = searchParams.get('hashtag')
    
    if (!hashtag) {
      return NextResponse.json(
        { error: 'Hashtag parametresi gerekli' },
        { status: 400 }
      )
    }

    // Hashtag'i normalize et
    const normalizedHashtag = hashtag.toLowerCase()
    const hashtagWithoutHash = normalizedHashtag.startsWith('#') 
      ? normalizedHashtag.slice(1) 
      : normalizedHashtag

    // Hashtag içeren tweetleri bul - hem content hem de hashtags alanından ara
    const tweets = await prisma.tweet.findMany({
      where: {
        OR: [
          {
            content: {
              contains: `#${hashtagWithoutHash}`,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: hashtag,
              mode: 'insensitive',
            },
          },
          {
            hashtags: {
              contains: `"${hashtagWithoutHash}"`,
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
    console.error('Hashtag arama hatası:', error)
    return NextResponse.json(
      { error: 'Hashtag araması yapılamadı' },
      { status: 500 }
    )
  }
}

