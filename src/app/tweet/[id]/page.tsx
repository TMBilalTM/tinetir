import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { TweetProvider } from '@/contexts/TweetContext'
import TweetPageClient from '@/components/tweet/TweetPageClient'

interface TweetPageProps {
  params: Promise<{ id: string }>
}

async function getTweet(id: string) {
  try {
    const tweet = await prisma.tweet.findUnique({
      where: { id },
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
    })

    if (!tweet) {
      return null
    }

    // JSON alanları parse et
    const tweetData = tweet as any
    
    return {
      ...tweetData,
      createdAt: tweet.createdAt.toISOString(),
      images: tweetData.images ? JSON.parse(tweetData.images) : [],
      hashtags: tweetData.hashtags ? JSON.parse(tweetData.hashtags) : [],
      mentions: tweetData.mentions ? JSON.parse(tweetData.mentions) : [],
    }
  } catch (error) {
    console.error('Tweet getirme hatası:', error)
    return null
  }
}

export default async function TweetPage({ params }: TweetPageProps) {
  const { id } = await params
  const tweet = await getTweet(id)

  if (!tweet) {
    notFound()
  }

  return (
    <TweetProvider>
      <TweetPageClient tweet={tweet} />
    </TweetProvider>
  )
}

// Metadata için
export async function generateMetadata({ params }: TweetPageProps) {
  const { id } = await params
  const tweet = await getTweet(id)

  if (!tweet) {
    return {
      title: 'Tweet bulunamadı',
    }
  }

  return {
    title: `${tweet.user.name || 'Kullanıcı'} (@${tweet.user.username || tweet.user.id.slice(0, 8)}) - Tweet`,
    description: tweet.content.slice(0, 160),
  }
}
