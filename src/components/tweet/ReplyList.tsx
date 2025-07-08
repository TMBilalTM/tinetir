'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { User, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'

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

interface ReplyListProps {
  tweetId: string
  refreshTrigger?: number
}

export default function ReplyList({ tweetId, refreshTrigger }: ReplyListProps) {
  const { data: session } = useSession()
  const [replies, setReplies] = useState<Reply[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingReplyId, setDeletingReplyId] = useState<string | null>(null)

  const fetchReplies = useCallback(async () => {
    try {
      const response = await fetch(`/api/tweets/${tweetId}/replies`)
      if (response.ok) {
        const data = await response.json()
        setReplies(data)
      }
    } catch (error) {
      console.error('Yanıtlar getirme hatası:', error)
    } finally {
      setIsLoading(false)
    }
  }, [tweetId])

  useEffect(() => {
    fetchReplies()
  }, [fetchReplies, refreshTrigger])

  const handleDeleteReply = async (replyId: string) => {
    if (!confirm('Bu yanıtı silmek istediğinizden emin misiniz?')) return
    
    setDeletingReplyId(replyId)
    try {
      const response = await fetch(`/api/tweets/${tweetId}/replies/${replyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setReplies(prev => prev.filter(reply => reply.id !== replyId))
      } else {
        alert('Yanıt silinirken hata oluştu')
      }
    } catch (error) {
      console.error('Yanıt silme hatası:', error)
      alert('Yanıt silinirken hata oluştu')
    } finally {
      setDeletingReplyId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center text-muted">
        <p>Yanıtlar yükleniyor...</p>
      </div>
    )
  }

  if (replies.length === 0) {
    return (
      <div className="p-4 text-center text-muted">
        <p>Henüz yanıt yok. İlk yanıtı siz yazın!</p>
      </div>
    )
  }

  return (
    <div>
      {replies.map((reply) => (
        <div key={reply.id} className="border-b border-border p-4 hover:bg-gray-950/50 transition-colors">
          <div className="flex space-x-3">
            {/* User Avatar */}
            <Link href={`/${reply.user.username || reply.user.id.slice(0, 8)}`}>
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity">
                {reply.user.image ? (
                  <Image 
                    src={reply.user.image} 
                    alt={reply.user.name || 'User'} 
                    width={32}
                    height={32}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-3 h-3" />
                )}
              </div>
            </Link>

            {/* Reply Content */}
            <div className="flex-1 min-w-0">
              {/* User Info */}
              <div className="flex items-center space-x-2 mb-1">
                <Link 
                  href={`/${reply.user.username || reply.user.id.slice(0, 8)}`}
                  className="font-semibold text-sm truncate hover:underline"
                >
                  {reply.user.name || 'Adsız Kullanıcı'}
                </Link>
                <Link 
                  href={`/${reply.user.username || reply.user.id.slice(0, 8)}`}
                  className="text-muted text-xs truncate hover:underline"
                >
                  @{reply.user.username || reply.user.id.slice(0, 8)}
                </Link>
                <span className="text-muted text-xs">·</span>
                <span className="text-muted text-xs">
                  {formatDistanceToNow(new Date(reply.createdAt), { 
                    addSuffix: true, 
                    locale: tr 
                  })}
                </span>

                {/* Delete button for reply owner */}
                {session?.user?.id === reply.user.id && (
                  <div className="ml-auto">
                    <button
                      onClick={() => handleDeleteReply(reply.id)}
                      disabled={deletingReplyId === reply.id}
                      className="hover:bg-gray-800 p-1 rounded-full transition-colors text-red-500"
                      title="Yanıtı sil"
                    >
                      {deletingReplyId === reply.id ? (
                        <div className="w-3 h-3 border border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Reply Text */}
              <div className="mb-2">
                <p className="text-sm whitespace-pre-wrap break-words">
                  {reply.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
