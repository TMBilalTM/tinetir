import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'all' // 'users', 'tweets', 'all'

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        users: [],
        tweets: [],
        hashtags: [],
      })
    }

    const searchTerm = query.trim()

    let users: any[] = []
    let tweets: any[] = []
    let hashtags: any[] = []

    // Search users
    if (type === 'all' || type === 'users') {
      users = await prisma.user.findMany({
        where: {
          OR: [
            {
              username: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        },
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
          verified: true,
          bio: true,
          _count: {
            select: {
              followers: true,
            },
          },
        },
        take: 10,
      })
    }

    // Search tweets
    if (type === 'all' || type === 'tweets') {
      tweets = await prisma.tweet.findMany({
        where: {
          content: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
              verified: true,
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
        take: 20,
      })
    }

    // Search hashtags (extract from tweet content)
    if (type === 'all' || type === 'hashtags') {
      const hashtagRegex = /#[\w\u00C0-\u1FFF\u2C00-\uD7FF]+/gi
      const hashtagMatches = searchTerm.match(hashtagRegex)
      
      if (hashtagMatches) {
        const hashtagTweets = await prisma.tweet.findMany({
          where: {
            content: {
              contains: hashtagMatches[0],
              mode: 'insensitive',
            },
          },
          select: {
            content: true,
          },
          take: 100,
        })

        const hashtagCounts = new Map()
        hashtagTweets.forEach(tweet => {
          const tweetHashtags = tweet.content.match(hashtagRegex) || []
          tweetHashtags.forEach(hashtag => {
            const normalizedHashtag = hashtag.toLowerCase()
            if (normalizedHashtag.includes(searchTerm.toLowerCase())) {
              hashtagCounts.set(normalizedHashtag, (hashtagCounts.get(normalizedHashtag) || 0) + 1)
            }
          })
        })

        hashtags = Array.from(hashtagCounts.entries())
          .map(([hashtag, count]) => ({ hashtag, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
      }
    }

    return NextResponse.json({
      users,
      tweets,
      hashtags,
      query: searchTerm,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      {
        error: 'Search failed',
        users: [],
        tweets: [],
        hashtags: [],
      },
      { status: 500 }
    )
  }
}