'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, User, MapPin, ChevronLeft, ChevronRight, Trash2, Copy, Flag } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import { BadgeList } from '@/components/ui/Badge'
import { useTweets } from '@/contexts/TweetContext'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import ReplyComposer from './ReplyComposer'
import ReplyList from './ReplyList'

// Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface Tweet {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string | null
    username: string | null
    image: string | null
    verified?: boolean
    badges?: string[]
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

interface TweetItemProps {
  tweet: Tweet
}

export default function TweetItem({ tweet }: TweetItemProps) {
  const { data: session } = useSession()
  const { updateTweet, deleteTweet } = useTweets()
  const [isLiked, setIsLiked] = useState(
    tweet.likes.some(like => like.userId === session?.user?.id)
  )
  const [isRetweeted, setIsRetweeted] = useState(
    tweet.retweets.some(retweet => retweet.userId === session?.user?.id)
  )
  const [likeCount, setLikeCount] = useState(tweet._count.likes)
  const [retweetCount, setRetweetCount] = useState(tweet._count.retweets)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [replyRefresh, setReplyRefresh] = useState(0)

  // Tweet sahibi kontrolü
  const isOwner = session?.user?.id === tweet.user.id

  const handleDeleteTweet = async () => {
    if (!confirm('Bu tweet\'i silmek istediğinizden emin misiniz?')) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/tweets/${tweet.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        deleteTweet(tweet.id)
        setShowDropdown(false)
      } else {
        alert('Tweet silinirken hata oluştu')
      }
    } catch (error) {
      console.error('Tweet silme hatası:', error)
      alert('Tweet silinirken hata oluştu')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleLike = async () => {
    if (!session) {
      alert('Beğenmek için giriş yapmanız gerekiyor.')
      return
    }

    try {
      const response = await fetch(`/api/tweets/${tweet.id}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      })

      if (response.ok) {
        const newIsLiked = !isLiked
        const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1
        
        setIsLiked(newIsLiked)
        setLikeCount(newLikeCount)
        
        // Context'i güncelle
        updateTweet(tweet.id, {
          _count: { ...tweet._count, likes: newLikeCount }
        })
      }
    } catch (error) {
      console.error('Beğeni işlemi başarısız:', error)
    }
  }

  const handleRetweet = async () => {
    if (!session) {
      alert('Retweet yapmak için giriş yapmanız gerekiyor.')
      return
    }

    try {
      const response = await fetch(`/api/tweets/${tweet.id}/retweet`, {
        method: isRetweeted ? 'DELETE' : 'POST',
      })

      if (response.ok) {
        const newIsRetweeted = !isRetweeted
        const newRetweetCount = isRetweeted ? retweetCount - 1 : retweetCount + 1
        
        setIsRetweeted(newIsRetweeted)
        setRetweetCount(newRetweetCount)
        
        // Context'i güncelle
        updateTweet(tweet.id, {
          _count: { ...tweet._count, retweets: newRetweetCount }
        })
      }
    } catch (error) {
      console.error('Retweet işlemi başarısız:', error)
    }
  }

  const handleShare = async () => {
    const tweetUrl = `${window.location.origin}/tweet/${tweet.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tweet.user.name || 'Kullanıcı'}'nin Tweet'i`,
          text: tweet.content,
          url: tweetUrl,
        })
      } catch {
        // Kullanıcı paylaşımı iptal etti, sessizce devam et
      }
    } else {
      // Fallback: URL'yi clipboard'a kopyala
      try {
        await navigator.clipboard.writeText(tweetUrl)
        alert('Tweet linki kopyalandı!')
      } catch (error) {
        console.error('Kopyalama hatası:', error)
        alert('Link kopyalanamadı')
      }
    }
    setShowDropdown(false)
  }

  const handleCopyLink = async () => {
    const tweetUrl = `${window.location.origin}/tweet/${tweet.id}`
    try {
      await navigator.clipboard.writeText(tweetUrl)
      alert('Tweet linki kopyalandı!')
    } catch (error) {
      console.error('Kopyalama hatası:', error)
      alert('Link kopyalanamadı')
    }
    setShowDropdown(false)
  }

  const handleReport = () => {
    alert('Şikayet özelliği henüz geliştirilmemiştir.')
    setShowDropdown(false)
  }

  // Custom styles for Swiper
  const swiperCustomStyles = `
    .tweet-carousel .swiper {
      width: 100% !important;
      height: auto !important;
      aspect-ratio: 16 / 9 !important;
      max-height: 400px !important;
    }
    .tweet-carousel .swiper-slide {
      width: 100% !important;
      height: 100% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    .tweet-carousel .swiper-slide > div {
      width: 100% !important;
      height: 100% !important;
    }
    .swiper-pagination {
      bottom: 8px !important;
    }
    .swiper-pagination-bullet {
      background-color: rgba(255, 255, 255, 0.6) !important;
      opacity: 1 !important;
      width: 8px !important;
      height: 8px !important;
      margin: 0 3px !important;
    }
    .swiper-pagination-bullet-active {
      background-color: #1d9bf0 !important;
    }
    .swiper-button-next, .swiper-button-prev {
      display: none !important;
    }
    .group:hover .swiper-button-prev-custom,
    .group:hover .swiper-button-next-custom {
      opacity: 1 !important;
    }
    .swiper-button-prev-custom, .swiper-button-next-custom {
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: swiperCustomStyles }} />
      <div className="border-b border-border/50 p-6 hover:bg-surface/30 transition-all cursor-pointer group">
        <div className="flex space-x-4">
          {/* User Avatar */}
          <Link href={`/${tweet.user.username || tweet.user.id.slice(0, 8)}`}>
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 hover:opacity-80 transition-all hover:scale-105 ring-2 ring-accent/20">
              {tweet.user.image ? (
                <Image 
                  src={tweet.user.image} 
                  alt={tweet.user.name || 'User'} 
                  width={56}
                  height={56}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <User className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
              )}
            </div>
          </Link>

          {/* Tweet Content */}
          <div className="flex-1 min-w-0">
            {/* User Info */}
            <div className="flex items-center space-x-2 mb-2">
              <Link 
                href={`/${tweet.user.username || tweet.user.id.slice(0, 8)}`}
                className="font-semibold hover:underline text-sm sm:text-base text-foreground truncate hover:text-accent transition-colors"
              >
                {tweet.user.name || 'Adsız Kullanıcı'}
              </Link>
              {tweet.user.badges && tweet.user.badges.length > 0 && (
                <BadgeList badges={tweet.user.badges} size="sm" />
              )}
              {tweet.user.verified && !tweet.user.badges?.includes('verified') && (
                <div className="w-5 h-5 bg-accent rounded-xl flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
              <Link 
                href={`/${tweet.user.username || tweet.user.id.slice(0, 8)}`}
                className="text-muted-foreground text-sm truncate hover:underline hover:text-accent transition-colors"
              >
                @{tweet.user.username || tweet.user.id.slice(0, 8)}
              </Link>
              <span className="text-muted-foreground hidden sm:inline">·</span>
              <span className="text-muted-foreground text-sm hidden sm:inline">
                {formatDistanceToNow(new Date(tweet.createdAt), { 
                  addSuffix: true, 
                  locale: tr 
                })}
              </span>
              <div className="ml-auto relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="hover:bg-surface/50 p-2 rounded-2xl transition-all hover:scale-105 active:scale-95"
                >
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
                
                {/* Dropdown Menu */}
                {showDropdown && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowDropdown(false)}
                    />
                    
                    {/* Menu */}
                    <div className="absolute right-0 top-full mt-1 bg-black border border-border rounded-xl shadow-lg py-2 min-w-48 z-20">
                      {isOwner && (
                        <button
                          onClick={handleDeleteTweet}
                          disabled={isDeleting}
                          className="w-full px-4 py-3 text-left hover:bg-gray-900 transition-colors text-red-500 flex items-center space-x-3"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>{isDeleting ? 'Siliniyor...' : 'Tweeti sil'}</span>
                        </button>
                      )}
                      
                      <button
                        onClick={handleShare}
                        className="w-full px-4 py-3 text-left hover:bg-gray-900 transition-colors flex items-center space-x-3"
                      >
                        <Share className="w-4 h-4" />
                        <span>Tweeti paylaş</span>
                      </button>
                      
                      <button
                        onClick={handleCopyLink}
                        className="w-full px-4 py-3 text-left hover:bg-gray-900 transition-colors flex items-center space-x-3"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Linki kopyala</span>
                      </button>
                      
                      {!isOwner && (
                        <button
                          onClick={handleReport}
                          className="w-full px-4 py-3 text-left hover:bg-gray-900 transition-colors text-red-500 flex items-center space-x-3"
                        >
                          <Flag className="w-4 h-4" />
                          <span>Tweeti şikayet et</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile timestamp */}
            <div className="sm:hidden text-muted text-sm mb-2">
              {formatDistanceToNow(new Date(tweet.createdAt), { 
                addSuffix: true, 
                locale: tr 
              })}
            </div>

            {/* Tweet Text */}
            <div className="mb-3">
              <p className="whitespace-pre-wrap break-words text-sm sm:text-base">
                {tweet.content.split(/(\s+)/).map((word, index) => {
                  if (word.startsWith('#')) {
                    return (
                      <span key={index} className="text-accent hover:underline cursor-pointer">
                        {word}
                      </span>
                    )
                  } else if (word.startsWith('@')) {
                    return (
                      <span key={index} className="text-accent hover:underline cursor-pointer">
                        {word}
                      </span>
                    )
                  } else {
                    return word
                  }
                })}
              </p>
            </div>

            {/* Media Preview */}
            {tweet.images && tweet.images.length > 0 && (
              <div className="mb-3 rounded-2xl overflow-hidden border border-border">
                {tweet.images.length === 1 ? (
                  // Tek resim için normal görünüm
                  <div className="relative aspect-video">
                    <Image
                      src={tweet.images[0]}
                      alt="Tweet media"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  // 2+ resim için carousel
                  <div className="relative tweet-carousel aspect-video max-h-96">
                    <Swiper
                      modules={[Navigation, Pagination, Autoplay]}
                      spaceBetween={0}
                      slidesPerView={1}
                      navigation={{
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
                      }}
                      pagination={{
                        clickable: true,
                        dynamicBullets: true,
                      }}
                      autoplay={{
                        delay: 4000,
                        disableOnInteraction: true,
                      }}
                      className="w-full h-full"
                    >
                      {tweet.images.map((image, index) => (
                        <SwiperSlide key={index}>
                          <div className="relative w-full h-full aspect-video">
                            <Image
                              src={image}
                              alt={`Tweet media ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    
                    {/* Custom Navigation Buttons */}
                    <button className="swiper-button-prev-custom absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="swiper-button-next-custom absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Location */}
            {tweet.location && (
              <div className="mb-3 flex items-center space-x-2 text-muted text-sm">
                <MapPin className="w-4 h-4" />
                <span>{tweet.location}</span>
              </div>
            )}

            {/* Tweet Actions */}
            <div className="flex items-center justify-between max-w-md">
              {/* Reply */}
              <button 
                onClick={() => {
                  if (!session) {
                    alert('Yorum yapmak için giriş yapmanız gerekiyor.')
                    return
                  }
                  setShowReplies(!showReplies)
                }}
                className="flex items-center space-x-1 sm:space-x-2 text-muted hover:text-accent group"
              >
                <div className="group-hover:bg-accent/10 p-1.5 sm:p-2 rounded-full transition-colors">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-xs sm:text-sm">{tweet._count.replies || ''}</span>
              </button>

              {/* Retweet */}
              <button 
                onClick={handleRetweet}
                className={`flex items-center space-x-1 sm:space-x-2 group ${
                  isRetweeted ? 'text-green-500' : 'text-muted hover:text-green-500'
                } ${!session ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!session}
              >
                <div className="group-hover:bg-green-500/10 p-1.5 sm:p-2 rounded-full transition-colors">
                  <Repeat2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-xs sm:text-sm">{retweetCount || ''}</span>
              </button>

              {/* Like */}
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-1 sm:space-x-2 group ${
                  isLiked ? 'text-red-500' : 'text-muted hover:text-red-500'
                } ${!session ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!session}
              >
                <div className="group-hover:bg-red-500/10 p-1.5 sm:p-2 rounded-full transition-colors">
                  <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
                </div>
                <span className="text-xs sm:text-sm">{likeCount || ''}</span>
              </button>

              {/* Share */}
              <button 
                onClick={handleShare}
                className="flex items-center space-x-1 sm:space-x-2 text-muted hover:text-accent group"
              >
                <div className="group-hover:bg-accent/10 p-1.5 sm:p-2 rounded-full transition-colors">
                  <Share className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-4 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Delete Tweet */}
            {isOwner && (
              <button 
                onClick={handleDeleteTweet}
                className="flex items-center space-x-2 p-3 text-red-500 hover:bg-red-500/10 transition-colors w-full"
              >
                <Trash2 className="w-5 h-5" />
                <span className="text-sm">Tweeti Sil</span>
              </button>
            )}

            {/* Share Tweet */}
            <button 
              onClick={handleShare}
              className="flex items-center space-x-2 p-3 text-muted hover:bg-muted/10 transition-colors w-full"
            >
              <Share className="w-5 h-5" />
              <span className="text-sm">Tweeti Paylaş</span>
            </button>

            {/* Copy Link */}
            <button 
              onClick={handleCopyLink}
              className="flex items-center space-x-2 p-3 text-muted hover:bg-muted/10 transition-colors w-full"
            >
              <Copy className="w-5 h-5" />
              <span className="text-sm">Bağlantıyı Kopyala</span>
            </button>

            {/* Report Tweet */}
            <button 
              onClick={handleReport}
              className="flex items-center space-x-2 p-3 text-muted hover:bg-muted/10 transition-colors w-full"
            >
              <Flag className="w-5 h-5" />
              <span className="text-sm">Şikayet Et</span>
            </button>
          </div>
        )}

        {/* Replies Section */}
        {showReplies && session && (
          <div className="mt-4">
            {/* Reply Composer */}
            <ReplyComposer 
              tweetId={tweet.id} 
              onReplyAdded={() => setReplyRefresh(prev => prev + 1)}
            />

            {/* Replies List */}
            <div className="border-t border-border pt-4">
              <ReplyList 
                tweetId={tweet.id} 
                refreshTrigger={replyRefresh}
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
