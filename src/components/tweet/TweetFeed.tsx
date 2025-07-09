'use client'

import { useEffect, useState, useCallback } from 'react'
import TweetItem from './TweetItem'
import { useTweets } from '@/contexts/TweetContext'
import { MessageCircle, Heart, RefreshCw } from 'lucide-react'

export default function TweetFeed() {
  const { tweets, setTweets } = useTweets()
  const [isLoading, setIsLoading] = useState(true)

  const fetchTweets = useCallback(async () => {
    try {
      const response = await fetch('/api/tweets')
      if (response.ok) {
        const data = await response.json()
        setTweets(data)
      }
    } catch (error) {
      console.error('Tweet\'ler yüklenirken hata:', error)
    } finally {
      setIsLoading(false)
    }
  }, [setTweets])

  useEffect(() => {
    fetchTweets()
  }, [fetchTweets])

  if (isLoading) {
    return (
      <div className="p-12 text-center bg-surface/30">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-gradient-to-r from-accent to-accent/80 rounded-3xl flex items-center justify-center mx-auto">
            <RefreshCw className="w-6 h-6 text-white animate-spin" />
          </div>
          <div>
            <p className="text-foreground font-semibold text-lg">Tweetler yükleniyor...</p>
            <p className="text-muted-foreground text-sm">En son güncellemeler getiriliyor</p>
          </div>
        </div>
      </div>
    )
  }

  if (tweets.length === 0) {
    return (
      <div className="p-16 text-center bg-surface/30">
        <div className="space-y-6 max-w-md mx-auto">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-3xl flex items-center justify-center mx-auto">
              <MessageCircle className="w-10 h-10 text-accent" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-foreground">Henüz hiç tweet yok</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                İlk tweeti sen at ve konuşmayı başlat! Topluluğa katıl ve düşüncelerini paylaş.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Beğen</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span>Yanıtla</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-green-500" />
              <span>Paylaş</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background/50">
      {tweets.map((tweet) => (
        <TweetItem key={tweet.id} tweet={tweet} />
      ))}
    </div>
  )
}
