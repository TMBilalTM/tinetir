import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    // Hashtag içeren tweetleri bul
    const tweets = await prisma.tweet.findMany({
      where: {
        content: {
          contains: `#${hashtagWithoutHash}`,
        },
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

    // Date'leri string'e çevir
    const tweetsWithStringDates = tweets.map(tweet => ({
      ...tweet,
      createdAt: tweet.createdAt.toISOString(),
      images: [], // Şimdilik boş array
      location: null,
      hashtags: [],
      mentions: [],
    }))

    return NextResponse.json(tweetsWithStringDates)
  } catch (error) {
    console.error('Hashtag arama hatası:', error)
    return NextResponse.json(
      { error: 'Hashtag araması yapılamadı' },
      { status: 500 }
    )
  }
}
