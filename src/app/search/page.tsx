'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import TwitterLayout from '@/components/layout/TwitterLayout'
import TweetItem from '@/components/tweet/TweetItem'
import { TweetProvider } from '@/contexts/TweetContext'
import { ArrowLeft, Search, Hash, TrendingUp } from 'lucide-react'
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
          <div className="border-x-0 lg:border-x border-border/50 min-h-screen bg-background/50">
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-accent" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3">Geçersiz arama</h1>
              <p className="text-muted-foreground text-lg">Arama parametresi bulunamadı.</p>
            </div>
          </div>
        </TwitterLayout>
      </TweetProvider>
    )
  }

  return (
    <TweetProvider>
      <TwitterLayout>
        <div className="border-x-0 lg:border-x border-border/50 min-h-screen bg-background/50">
          {/* Modern Header */}
          <div className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border/50 z-10">
            <div className="flex items-center space-x-4 p-6">
              <Link 
                href="/"
                className="hover:bg-surface/50 p-3 rounded-2xl transition-all hover:scale-105 active:scale-95"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-2xl">
                  <Hash className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{hashtag}</h1>
                  <p className="text-muted-foreground text-sm font-medium">
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
                        Aranıyor...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        {tweets.length.toLocaleString()} tweet bulundu
                      </div>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            {loading ? (
              <div className="p-12 text-center bg-surface/30">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent to-accent/80 rounded-3xl flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold text-lg">Hashtag aranıyor...</p>
                    <p className="text-muted-foreground text-sm">İlgili tweetler getiriliyor</p>
                  </div>
                </div>
              </div>
            ) : tweets.length > 0 ? (
              <div className="bg-background/50">
                {tweets.map((tweet) => (
                  <TweetItem key={tweet.id} tweet={tweet} />
                ))}
              </div>
            ) : (
              <div className="p-16 text-center bg-surface/30">
                <div className="space-y-6 max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-3xl flex items-center justify-center mx-auto">
                    <Hash className="w-10 h-10 text-accent" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-foreground">Hiç tweet bulunamadı</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      <span className="font-semibold text-accent">{hashtag}</span> hashtag&apos;i ile ilgili henüz tweet atılmamış.
                      İlk tweeti sen at!
                    </p>
                  </div>
                  <Link 
                    href="/"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent 
                             text-white font-semibold py-3 px-6 rounded-2xl transition-all hover:scale-105 active:scale-95 
                             shadow-lg shadow-accent/25"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Ana Sayfaya Dön
                  </Link>
                </div>
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
