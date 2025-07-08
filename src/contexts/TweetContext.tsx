'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

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

interface TweetContextType {
  tweets: Tweet[]
  setTweets: (tweets: Tweet[]) => void
  addTweet: (tweet: Tweet) => void
  updateTweet: (id: string, updates: Partial<Tweet>) => void
  deleteTweet: (id: string) => void
}

const TweetContext = createContext<TweetContextType | undefined>(undefined)

export function TweetProvider({ children }: { children: ReactNode }) {
  const [tweets, setTweets] = useState<Tweet[]>([])

  const addTweet = (tweet: Tweet) => {
    setTweets(prev => [tweet, ...prev])
  }

  const updateTweet = (id: string, updates: Partial<Tweet>) => {
    setTweets(prev => 
      prev.map(tweet => 
        tweet.id === id ? { ...tweet, ...updates } : tweet
      )
    )
  }

  const deleteTweet = (id: string) => {
    setTweets(prev => prev.filter(tweet => tweet.id !== id))
  }

  return (
    <TweetContext.Provider value={{ 
      tweets, 
      setTweets, 
      addTweet, 
      updateTweet, 
      deleteTweet 
    }}>
      {children}
    </TweetContext.Provider>
  )
}

export function useTweets() {
  const context = useContext(TweetContext)
  if (!context) {
    throw new Error('useTweets must be used within TweetProvider')
  }
  return context
}
