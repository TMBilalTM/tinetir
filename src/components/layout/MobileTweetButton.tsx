'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Plus, X, User, Image as ImageIcon, Smile } from 'lucide-react'
import Image from 'next/image'
import { useTweets } from '@/contexts/TweetContext'

export default function MobileTweetButton() {
  const { data: session } = useSession()
  const { addTweet } = useTweets()
  const [showComposer, setShowComposer] = useState(false)
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        const newTweet = await response.json()
        addTweet(newTweet)
        setContent('')
        setShowComposer(false)
      }
    } catch (error) {
      console.error('Tweet oluşturulurken hata:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) return null

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setShowComposer(true)}
        className="lg:hidden fixed bottom-20 right-4 z-30 bg-accent hover:bg-accent-hover text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Mobile Tweet Composer Modal */}
      {showComposer && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50">
          <div className="bg-black h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <button
                onClick={() => setShowComposer(false)}
                className="p-2 hover:bg-gray-900 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold">Yeni Tweet</h2>
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || isLoading}
                className="bg-accent hover:bg-accent-hover disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-full transition-colors text-sm"
              >
                {isLoading ? 'Gönderiliyor...' : 'Tweetle'}
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="flex-1 p-4">
              <div className="flex space-x-3">
                {/* User Avatar */}
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                  {session.user?.image ? (
                    <Image 
                      src={session.user.image} 
                      alt={session.user.name || 'User'} 
                      width={48}
                      height={48}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </div>

                {/* Tweet Input */}
                <div className="flex-1">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Neler oluyor?"
                    className="w-full bg-transparent text-lg placeholder-muted resize-none outline-none min-h-[150px]"
                    maxLength={280}
                    autoFocus
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pl-15">
                <div className="flex items-center space-x-4 text-accent">
                  <button type="button" className="hover:bg-accent/10 p-2 rounded-full transition-colors">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button type="button" className="hover:bg-accent/10 p-2 rounded-full transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>

                {/* Character Count */}
                <div className="text-muted text-sm">
                  {content.length}/280
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
