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
      <div className="border-x-0 lg:border-x border-gray-200 dark:border-gray-700 min-h-screen bg-white dark:bg-gray-900">
        {/* Modern Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 p-6 z-10">
          <div className="flex items-center space-x-4">
            <Link 
              href="/"
              className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Tweet</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Detaylar ve yanıtlar</p>
            </div>
          </div>
        </div>

        {/* Tweet - Enhanced styling */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <TweetItem tweet={tweet} />
        </div>

        {/* Reply Section */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <ReplyComposer 
            tweetId={tweet.id} 
            placeholder="Bu tweet'e yanıt yazın..."
            onReplyAdded={() => setReplyRefresh(prev => prev + 1)}
          />
        </div>
        
        {/* Replies List */}
        <div className="bg-white dark:bg-gray-900">
          <ReplyList 
            tweetId={tweet.id} 
            refreshTrigger={replyRefresh}
          />
        </div>
      </div>
    </TwitterLayout>
  )
}
