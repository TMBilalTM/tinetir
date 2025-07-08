'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import TwitterLayout from '@/components/layout/TwitterLayout'
import TweetItem from '@/components/tweet/TweetItem'
import { TweetProvider } from '@/contexts/TweetContext'
import { BadgeList } from '@/components/ui/Badge'
import BadgeManager from '@/components/admin/BadgeManager'
import FollowModal from '@/components/user/FollowModal'
import { ArrowLeft, Calendar, MapPin, Link as LinkIcon, MoreHorizontal, Settings, Shield } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import Link from 'next/link'
import Image from 'next/image'

interface User {
  id: string
  name: string | null
  username: string | null
  email?: string | null
  image: string | null
  banner?: string | null
  bio: string | null
  location: string | null
  website: string | null
  verified: boolean
  badges?: string[]
  createdAt: string
  _count: {
    tweets: number
    followers: number
    following: number
  }
}

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
  isReply?: boolean
  replyContent?: string
  replyCreatedAt?: string
}

interface ProfilePageClientProps {
  username: string
}

export default function ProfilePageClient({ username }: ProfilePageClientProps) {
  const { data: session } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(true)
  const [tweetsLoading, setTweetsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'tweets' | 'replies' | 'likes'>('tweets')
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [showAdminMenu, setShowAdminMenu] = useState(false)
  const [showBadgeManager, setShowBadgeManager] = useState(false)
  const [showFollowModal, setShowFollowModal] = useState(false)
  const [followModalType, setFollowModalType] = useState<'followers' | 'following'>('followers')

  // Takip durumunu kontrol et
  const checkFollowStatus = useCallback(async () => {
    if (!user || !session?.user?.id || user.id === session.user.id) return
    
    try {
      const response = await fetch(`/api/users/${username}/follow`)
      if (response.ok) {
        const data = await response.json()
        setIsFollowing(data.isFollowing)
      }
    } catch (error) {
      console.error('Takip durumu kontrol hatası:', error)
    }
  }, [user, session?.user?.id, username])

  // Kullanıcı bilgilerini yükle
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${username}`)
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          console.error('Kullanıcı bulunamadı')
        }
      } catch (error) {
        console.error('Kullanıcı yükleme hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [username])

  // Kullanıcı ve session değiştiğinde takip durumunu kontrol et
  useEffect(() => {
    if (user && session?.user?.id && user.id !== session.user.id) {
      checkFollowStatus()
    }
  }, [user, session?.user?.id, checkFollowStatus])

  // Tweetleri yükle
  useEffect(() => {
    const fetchTweets = async () => {
      if (!user) return
      
      setTweetsLoading(true)
      try {
        const response = await fetch(`/api/users/${username}/tweets?type=${activeTab}`)
        if (response.ok) {
          const tweetsData = await response.json()
          setTweets(tweetsData)
        }
      } catch (error) {
        console.error('Tweetler yükleme hatası:', error)
      } finally {
        setTweetsLoading(false)
      }
    }

    fetchTweets()
  }, [username, user, activeTab])

  // Takip et/bırak
  const handleFollowToggle = async () => {
    if (!user || !session?.user?.id || user.id === session.user.id) return
    
    setFollowLoading(true)
    try {
      const response = await fetch(`/api/users/${username}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
      })
      
      if (response.ok) {
        const newFollowState = !isFollowing
        setIsFollowing(newFollowState)
        
        // Takipçi sayısını güncelle
        if (user) {
          setUser({
            ...user,
            _count: {
              ...user._count,
              followers: newFollowState 
                ? user._count.followers + 1 
                : user._count.followers - 1
            }
          })
        }
      } else {
        const errorData = await response.json()
        console.error('Takip işlemi başarısız:', errorData)
      }
    } catch (error) {
      console.error('Takip işlemi hatası:', error)
    } finally {
      setFollowLoading(false)
    }
  }

  // Rozet güncelleme fonksiyonu
  const handleBadgeUpdate = (badges: string[]) => {
    if (user) {
      setUser({
        ...user,
        badges: badges,
        verified: badges.includes('verified') || user.verified
      })
    }
  }

  if (loading) {
    return (
      <TweetProvider>
        <TwitterLayout>
          <div className="border-x-0 lg:border-x border-border min-h-screen">
            <div className="p-8 text-center">
              <p className="text-muted">Profil yükleniyor...</p>
            </div>
          </div>
        </TwitterLayout>
      </TweetProvider>
    )
  }

  if (!user) {
    return (
      <TweetProvider>
        <TwitterLayout>
          <div className="border-x-0 lg:border-x border-border min-h-screen">
            <div className="p-8 text-center">
              <h1 className="text-xl font-bold mb-2">Kullanıcı bulunamadı</h1>
              <p className="text-muted">Bu kullanıcı mevcut değil.</p>
            </div>
          </div>
        </TwitterLayout>
      </TweetProvider>
    )
  }

  const isOwnProfile = session?.user?.id === user.id

  return (
    <TweetProvider>
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
              <div className="flex-1">
                <h1 className="text-xl font-bold">{user.name || 'Adsız Kullanıcı'}</h1>
                <p className="text-muted text-sm">{user._count.tweets} Tweet</p>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  className="hover:bg-gray-800 p-2 rounded-full transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                
                {showAdminMenu && session?.user?.isAdmin && (
                  <div className="absolute right-0 top-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg w-48 z-20">
                    <button
                      onClick={() => {
                        setShowBadgeManager(true)
                        setShowAdminMenu(false)
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Rozetleri Yönet</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Header */}
          <div className="relative">
            {/* Cover Photo / Banner */}
            <div className="h-48 relative">
              {user.banner ? (
                <Image
                  src={user.banner}
                  alt="Profile banner"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
              )}
            </div>
            
            {/* Profile Info */}
            <div className="px-4 pb-4">
              {/* Avatar */}
              <div className="relative -mt-16 mb-4">
                <div className="w-32 h-32 bg-gray-600 rounded-full border-4 border-black flex items-center justify-center overflow-hidden">
                  {user.image ? (
                    <Image 
                      src={user.image} 
                      alt={user.name || 'User'}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold">
                      {(user.name || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end mb-4">
                {isOwnProfile ? (
                  <Link 
                    href="/settings/profile"
                    className="border border-gray-600 px-4 py-2 rounded-full font-bold hover:bg-gray-900 transition-colors inline-flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Profili düzenle
                  </Link>
                ) : (
                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`px-4 py-2 rounded-full font-bold transition-colors ${
                      isFollowing
                        ? 'border border-gray-600 hover:bg-red-500/10 hover:border-red-500 hover:text-red-500'
                        : 'bg-white text-black hover:bg-gray-200'
                    }`}
                  >
                    {followLoading ? 'Yükleniyor...' : isFollowing ? 'Takibi Bırak' : 'Takip Et'}
                  </button>
                )}
              </div>

              {/* User Info */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-bold flex items-center space-x-2">
                    <span>{user.name || 'Adsız Kullanıcı'}</span>
                    {user.badges && user.badges.length > 0 && (
                      <BadgeList badges={user.badges} size="md" />
                    )}
                    {user.verified && !user.badges?.includes('verified') && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </h2>
                  <p className="text-muted">@{user.username || user.id.slice(0, 8)}</p>
                </div>

                {user.bio && (
                  <p className="whitespace-pre-wrap">{user.bio}</p>
                )}

                <div className="flex flex-wrap items-center space-x-4 text-muted text-sm">
                  {user.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center space-x-1">
                      <LinkIcon className="w-4 h-4" />
                      <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                        {user.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: tr })} katıldı
                    </span>
                  </div>
                </div>

                <div className="flex space-x-4 text-sm">
                  <button
                    onClick={() => {
                      console.log('Takip edilenler modal açılıyor - user:', {
                        id: user.id,
                        username: user.username,
                        selectedId: user.username || user.id
                      })
                      setFollowModalType('following')
                      setShowFollowModal(true)
                    }}
                    className="hover:bg-gray-900 p-2 rounded-lg transition-colors"
                  >
                    <span className="font-bold">{user._count.following}</span>
                    <span className="text-muted ml-1">Takip edilen</span>
                  </button>
                  <button
                    onClick={() => {
                      console.log('Takipçiler modal açılıyor - user:', {
                        id: user.id,
                        username: user.username,
                        selectedId: user.username || user.id
                      })
                      setFollowModalType('followers')
                      setShowFollowModal(true)
                    }}
                    className="hover:bg-gray-900 p-2 rounded-lg transition-colors"
                  >
                    <span className="font-bold">{user._count.followers}</span>
                    <span className="text-muted ml-1">Takipçi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex">
              {['tweets', 'replies', 'likes'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as 'tweets' | 'replies' | 'likes')}
                  className={`flex-1 py-4 px-4 text-center font-medium transition-colors relative ${
                    activeTab === tab
                      ? 'text-white'
                      : 'text-muted hover:bg-gray-900'
                  }`}
                >
                  {tab === 'tweets' && 'Tweetler'}
                  {tab === 'replies' && 'Yanıtlar'}
                  {tab === 'likes' && 'Beğeniler'}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tweets */}
          <div>
            {tweetsLoading ? (
              <div className="p-8 text-center">
                <p className="text-muted">Tweetler yükleniyor...</p>
              </div>
            ) : tweets.length > 0 ? (
              tweets.map((tweet) => (
                <TweetItem key={tweet.id} tweet={tweet} />
              ))
            ) : (
              <div className="p-8 text-center">
                <h2 className="text-xl font-bold mb-2">Henüz hiç tweet yok</h2>
                <p className="text-muted">
                  {activeTab === 'tweets' && 'Bu kullanıcı henüz tweet atmamış.'}
                  {activeTab === 'replies' && 'Bu kullanıcı henüz yanıt yapmamış.'}
                  {activeTab === 'likes' && 'Bu kullanıcı henüz hiçbir tweeti beğenmemiş.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Badge Manager Modal */}
        {showBadgeManager && user && (
          <BadgeManager
            userId={user.id}
            currentBadges={user.badges || []}
            onBadgeUpdate={handleBadgeUpdate}
            onClose={() => setShowBadgeManager(false)}
          />
        )}

        {/* Follow Modal */}
        {showFollowModal && user && (
          <FollowModal
            isOpen={showFollowModal}
            onClose={() => setShowFollowModal(false)}
            userId={user.username || user.id}
            type={followModalType}
            title={followModalType === 'followers' ? 'Takipçiler' : 'Takip Edilenler'}
          />
        )}
      </TwitterLayout>
    </TweetProvider>
  )
}
