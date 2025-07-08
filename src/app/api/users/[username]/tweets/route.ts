import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Kullanıcının tweetlerini getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'tweets' // tweets, replies, media, likes

    // Önce kullanıcıyı bul
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { id: username },
        ],
      },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    let tweets: any[] = []

    switch (type) {
      case 'tweets':
        // Kullanıcının tweetleri (yanıtlar hariç)
        tweets = await prisma.tweet.findMany({
          where: { 
            userId: user.id,
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
          take: 50,
        })
        break

      case 'replies':
        // Kullanıcının yanıtları
        const userReplies = await prisma.reply.findMany({
          where: { userId: user.id },
          include: {
            tweet: {
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
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 50,
        })
        
        // Reply'leri tweet formatına çevir
        tweets = userReplies.map(reply => ({
          ...reply.tweet,
          isReply: true,
          replyContent: reply.content,
          replyCreatedAt: reply.createdAt.toISOString(),
        }))
        break

      case 'likes':
        // Kullanıcının beğendiği tweetler
        const likedTweets = await prisma.like.findMany({
          where: { userId: user.id },
          include: {
            tweet: {
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
            },
          },
          orderBy: {
            id: 'desc', // Beğenme tarihine göre
          },
          take: 50,
        })
        
        tweets = likedTweets.map(like => like.tweet)
        break

      default:
        tweets = []
    }

    // Date'leri string'e çevir
    const tweetsWithStringDates = tweets.map((tweet) => ({
      ...tweet,
      createdAt: tweet.createdAt.toISOString(),
      images: [], // Şimdilik boş
      location: null,
      hashtags: [],
      mentions: [],
    }))

    return NextResponse.json(tweetsWithStringDates)
  } catch (error) {
    console.error('Kullanıcı tweetleri getirme hatası:', error)
    return NextResponse.json(
      { error: 'Tweetler getirilemedi' },
      { status: 500 }
    )
  }
}
