'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import TwitterLayout from '@/components/layout/TwitterLayout'
import TweetItem from '@/components/tweet/TweetItem'
import { TweetProvider } from '@/contexts/TweetContext'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Tweet {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string | null
    username: string | null
    image: string | null
  }
  likes: Array<{ id: string; userId: string }>
  retweets: Array<{ id: string; userId: string }>
  replies: Array<{ id: string; userId: string }>
  _count: {
    likes: number
    retweets: number
    replies: number
  }
  images?: string[]
  location?: string
  hashtags?: string[]
  mentions?: string[]
}

function SearchContent() {
  const searchParams = useSearchParams()
  const hashtag = searchParams.get('hashtag')
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hashtag) return

    const fetchTweets = async () => {
      try {
        const response = await fetch(`/api/search/hashtag?hashtag=${encodeURIComponent(hashtag)}`)
        if (response.ok) {
          const data = await response.json()
          setTweets(data)
        }
      } catch (error) {
        console.error('Hashtag arama hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTweets()
  }, [hashtag])

  if (!hashtag) {
    return (
      <TweetProvider>
        <TwitterLayout>
          <div className="border-x-0 lg:border-x border-border min-h-screen">
            <div className="p-8 text-center">
              <h1 className="text-xl font-bold">Geçersiz arama</h1>
              <p className="text-muted mt-2">Arama parametresi bulunamadı.</p>
            </div>
          </div>
        </TwitterLayout>
      </TweetProvider>
    )
  }

  return (
    <TweetProvider>
      <TwitterLayout>
        <div className="border-x-0 lg:border-x border-border min-h-screen">
          {/* Header */}
          <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-border p-4 z-10">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="hover:bg-gray-800 p-2 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">{hashtag}</h1>
                <p className="text-muted text-sm">
                  {loading ? 'Aranıyor...' : `${tweets.length} tweet bulundu`}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            {loading ? (
              <div className="p-8 text-center">
                <p className="text-muted">Tweetler yükleniyor...</p>
              </div>
            ) : tweets.length > 0 ? (
              tweets.map((tweet) => (
                <TweetItem key={tweet.id} tweet={tweet} />
              ))
            ) : (
              <div className="p-8 text-center">
                <h2 className="text-xl font-bold mb-2">Hiç tweet bulunamadı</h2>
                <p className="text-muted">
                  <span className="font-bold">{hashtag}</span> hashtag&apos;i ile ilgili henüz tweet atılmamış.
                </p>
              </div>
            )}
          </div>
        </div>
      </TwitterLayout>
    </TweetProvider>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
