'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { User, Send } from 'lucide-react'
import Image from 'next/image'

interface Reply {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string | null
    username: string | null
    image: string | null
  }
}

interface ReplyComposerProps {
  tweetId: string
  onReplyAdded?: (reply: Reply) => void
  placeholder?: string
  compact?: boolean
}

export default function ReplyComposer({ 
  tweetId, 
  onReplyAdded, 
  placeholder = "Tweet'inize yanıt yazın...",
  compact = false 
}: ReplyComposerProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !session?.user?.id) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/tweets/${tweetId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content.trim() }),
      })

      if (response.ok) {
        const newReply = await response.json()
        setContent('')
        onReplyAdded?.(newReply)
      } else {
        alert('Yanıt gönderilirken hata oluştu')
      }
    } catch (error) {
      console.error('Yanıt gönderme hatası:', error)
      alert('Yanıt gönderilirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  if (!session?.user) {
    return (
      <div className={`${compact ? 'p-3' : 'p-4'} text-center text-muted border-b border-border`}>
        <p>Yanıt yapmak için giriş yapın</p>
      </div>
    )
  }

  return (
    <div className={`border-b border-border ${compact ? 'p-3' : 'p-4'}`}>
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          {/* User Avatar */}
          <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} bg-gray-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0`}>
            {session.user.image ? (
              <Image 
                src={session.user.image} 
                alt={session.user.name || 'User'} 
                width={compact ? 32 : 40}
                height={compact ? 32 : 40}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className={`${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
            )}
          </div>

          {/* Reply Input */}
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              disabled={isLoading}
              className={`w-full bg-transparent border-none outline-none resize-none text-foreground placeholder-muted ${
                compact ? 'text-sm min-h-[60px]' : 'text-base min-h-[80px]'
              }`}
              maxLength={280}
            />
            
            <div className="flex items-center justify-between mt-2">
              {/* Character Count */}
              <div className={`${compact ? 'text-xs' : 'text-sm'} ${content.length > 260 ? 'text-red-500' : 'text-muted'}`}>
                {content.length}/280
              </div>

              {/* Reply Button */}
              <button
                type="submit"
                disabled={!content.trim() || isLoading || content.length > 280}
                className={`bg-accent hover:bg-accent-hover disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-full transition-colors flex items-center space-x-2 ${
                  compact ? 'px-3 py-1 text-sm' : 'px-4 py-2'
                }`}
              >
                <Send className={`${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
                <span>{isLoading ? 'Gönderiliyor...' : 'Yanıtla'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
