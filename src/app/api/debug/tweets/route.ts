import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Tüm tweetleri listele (debug amaçlı)
export async function GET() {
  try {
    const tweets = await prisma.tweet.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })

    const formattedTweets = tweets.map(tweet => ({
      id: tweet.id,
      content: tweet.content,
      createdAt: tweet.createdAt.toISOString(),
      user: tweet.user,
      hashtags: (tweet as any).hashtags,
      mentions: (tweet as any).mentions,
    }))

    return NextResponse.json(formattedTweets)
  } catch (error) {
    console.error('Debug tweets hatası:', error)
    return NextResponse.json(
      { error: 'Tweets listelenemedi' },
      { status: 500 }
    )
  }
}
