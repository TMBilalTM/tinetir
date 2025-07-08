'use client'

import { useEffect, useState, useCallback } from 'react'
import TweetItem from './TweetItem'
import { useTweets } from '@/contexts/TweetContext'

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
      <div className="p-8 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full mx-auto"></div>
        <p className="text-muted mt-2">Tweetler yükleniyor...</p>
      </div>
    )
  }

  if (tweets.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted">Henüz hiç tweet yok. İlk tweeti sen at!</p>
      </div>
    )
  }

  return (
    <div>
      {tweets.map((tweet) => (
        <TweetItem key={tweet.id} tweet={tweet} />
      ))}
    </div>
  )
}
