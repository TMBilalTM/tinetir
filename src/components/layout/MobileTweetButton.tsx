'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Plus, X, User, Image as ImageIcon, Smile, Send } from 'lucide-react'
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
      {/* Modern Floating Action Button */}
      <button
        onClick={() => setShowComposer(true)}
        className="lg:hidden fixed bottom-24 right-6 z-30 bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent 
                 text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl shadow-accent/25 
                 transition-all hover:scale-110 active:scale-95 hover:shadow-accent/40"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Mobile Tweet Composer Modal */}
      {showComposer && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm">
          <div className="bg-card/95 backdrop-blur-xl h-full flex flex-col border-l border-border">
            {/* Modern Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <button
                onClick={() => setShowComposer(false)}
                className="p-3 hover:bg-surface/50 rounded-2xl transition-all hover:scale-105 active:scale-95"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              <h2 className="text-xl font-semibold text-foreground">Yeni Tweet</h2>
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || isLoading}
                className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent 
                         disabled:from-muted-foreground/20 disabled:to-muted-foreground/10 disabled:cursor-not-allowed 
                         text-white font-semibold py-3 px-6 rounded-2xl transition-all text-sm
                         hover:scale-105 active:scale-95 shadow-lg shadow-accent/25 disabled:shadow-none
                         flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Tweetle
                  </>
                )}
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="flex-1 p-6">
              <div className="flex space-x-4">
                {/* User Avatar */}
                <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-accent/20">
                  {session.user?.image ? (
                    <Image 
                      src={session.user.image} 
                      alt={session.user.name || 'User'} 
                      width={56}
                      height={56}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    <User className="w-7 h-7 text-accent" />
                  )}
                </div>

                {/* Tweet Input */}
                <div className="flex-1">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Neler oluyor?"
                    className="w-full bg-transparent text-lg text-foreground placeholder:text-muted-foreground 
                             resize-none outline-none min-h-[200px] font-medium leading-relaxed"
                    maxLength={280}
                    autoFocus
                  />
                </div>
              </div>

              {/* Actions Bar */}
              <div className="flex items-center justify-between mt-6 pl-18">
                <div className="flex items-center space-x-2">
                  <button 
                    type="button" 
                    className="p-3 hover:bg-accent/10 rounded-2xl transition-all hover:scale-105 active:scale-95 group"
                  >
                    <ImageIcon className="w-5 h-5 text-accent group-hover:text-accent/80" />
                  </button>
                  <button 
                    type="button" 
                    className="p-3 hover:bg-accent/10 rounded-2xl transition-all hover:scale-105 active:scale-95 group"
                  >
                    <Smile className="w-5 h-5 text-accent group-hover:text-accent/80" />
                  </button>
                </div>

                {/* Character Count */}
                <div className="flex items-center gap-3">
                  <div className={`text-sm font-medium ${
                    content.length > 260 ? 'text-red-500' : 
                    content.length > 240 ? 'text-yellow-500' : 
                    'text-muted-foreground'
                  }`}>
                    {content.length}/280
                  </div>
                  {content.length > 0 && (
                    <div className="w-8 h-8 relative">
                      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-surface"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={`${(content.length / 280) * 87.96} 87.96`}
                          className={
                            content.length > 260 ? 'text-red-500' :
                            content.length > 240 ? 'text-yellow-500' :
                            'text-accent'
                          }
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
