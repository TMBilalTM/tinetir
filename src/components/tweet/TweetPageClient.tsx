'use client'

import { useState } from 'react'
import TweetItem from '@/components/tweet/TweetItem'
import ReplyComposer from '@/components/tweet/ReplyComposer'
import ReplyList from '@/components/tweet/ReplyList'
import TwitterLayout from '@/components/layout/TwitterLayout'
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

interface TweetPageClientProps {
  tweet: Tweet
}

export default function TweetPageClient({ tweet }: TweetPageClientProps) {
  const [replyRefresh, setReplyRefresh] = useState(0)

  return (
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
              <h1 className="text-xl font-bold">Tweet</h1>
            </div>
          </div>
        </div>

        {/* Tweet */}
        <div className="border-b border-border">
          <TweetItem tweet={tweet} />
        </div>

        {/* Yanıtlar Bölümü */}
        <div className="border-b border-border">
          <ReplyComposer 
            tweetId={tweet.id} 
            placeholder="Bu tweet'e yanıt yazın..."
            onReplyAdded={() => setReplyRefresh(prev => prev + 1)}
          />
        </div>
        
        {/* Yanıtlar Listesi */}
        <div>
          <ReplyList 
            tweetId={tweet.id} 
            refreshTrigger={replyRefresh}
          />
        </div>
      </div>
    </TwitterLayout>
  )
}
