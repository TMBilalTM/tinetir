'use client'

import { useState, useEffect } from 'react'
import { Search, TrendingUp, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface TrendingHashtag {
  hashtag: string
  count: number
  displayText: string
}

interface SuggestedUser {
  id: string
  name: string
  username: string
  image?: string | null
  followersCount: number
  tweetsCount: number
}

export default function RightSidebar() {
  const router = useRouter()
  const [trendingHashtags, setTrendingHashtags] = useState<TrendingHashtag[]>([])
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Trending hashtags'leri yükle
  useEffect(() => {
    const fetchTrendingHashtags = async () => {
      try {
        const response = await fetch('/api/trending/hashtags')
        if (response.ok) {
          const data = await response.json()
          setTrendingHashtags(data)
        }
      } catch (error) {
        console.error('Trending hashtags yükleme hatası:', error)
      }
    }

    fetchTrendingHashtags()
  }, [])

  // Suggested users'ları yükle
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await fetch('/api/users/suggestions')
        if (response.ok) {
          const data = await response.json()
          setSuggestedUsers(data)
        }
      } catch (error) {
        console.error('Suggested users yükleme hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestedUsers()
  }, [])

  // Hashtag'e tıklandığında o hashtag'li tweetleri göster
  const handleHashtagClick = (hashtag: string) => {
    router.push(`/search?hashtag=${encodeURIComponent(hashtag)}`)
  }

  // Takip et butonu
  const handleFollow = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
      })
      
      if (response.ok) {
        // Kullanıcıyı listeden çıkar
        setSuggestedUsers(prev => prev.filter(user => user.id !== userId))
      }
    } catch (error) {
      console.error('Takip etme hatası:', error)
    }
  }

  // Arama yapma
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <div className="h-full flex flex-col bg-card/30 backdrop-blur-sm border-l border-border">
      {/* Modern Search Bar */}
      <div className="p-6 border-b border-border/50">
        <form onSubmit={handleSearch} className="relative">
          <div className="group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tinetir'da ara..."
              className="w-full pl-12 pr-4 py-3 bg-surface/50 border border-border rounded-2xl 
                       focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent 
                       placeholder:text-muted-foreground text-foreground transition-all
                       hover:bg-surface/70"
            />
          </div>
        </form>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Trending Topics */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-6 hover:bg-card/70 transition-all">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-accent/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Gündemde</h2>
          </div>
          <div className="space-y-1">
            {trendingHashtags.length > 0 ? (
              trendingHashtags.map((hashtag, index) => (
                <div 
                  key={index} 
                  onClick={() => handleHashtagClick(hashtag.hashtag)}
                  className="hover:bg-surface/50 p-3 rounded-2xl cursor-pointer transition-all group"
                >
                  <p className="text-muted-foreground text-sm">Kıbrıs Trendi</p>
                  <p className="font-semibold text-foreground group-hover:text-accent transition-colors">{hashtag.hashtag}</p>
                  <p className="text-muted-foreground text-sm">{hashtag.count.toLocaleString()} tweet</p>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <div className="w-12 h-12 bg-surface/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <p>Gündem yükleniyor...</p>
              </div>
            )}
          </div>
        </div>

        {/* Suggested Users */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-6 hover:bg-card/70 transition-all">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-accent/10 rounded-xl">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Kimi takip etmeli</h2>
          </div>
          <div className="space-y-4">
            {!loading && suggestedUsers.length > 0 ? (
              suggestedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between group">
                  <Link href={`/${user.username}`} className="flex items-center space-x-3 flex-1 hover:bg-surface/30 rounded-2xl p-2 -ml-2 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center overflow-hidden ring-2 ring-accent/20">
                      {user.image ? (
                        <Image 
                          src={user.image} 
                          alt={user.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-accent">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{user.name}</p>
                      <p className="text-muted-foreground text-sm truncate">@{user.username}</p>
                      <p className="text-muted-foreground text-xs">{user.followersCount.toLocaleString()} takipçi</p>
                    </div>
                  </Link>
                  <button 
                    onClick={() => handleFollow(user.id)}
                    className="bg-accent hover:bg-accent/90 text-white px-5 py-2 rounded-2xl font-medium text-sm 
                             transition-all hover:scale-105 active:scale-95 shadow-lg shadow-accent/25
                             focus:outline-none focus:ring-2 focus:ring-accent/20"
                  >
                    Takip Et
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <div className="w-12 h-12 bg-surface/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <p>{loading ? 'Öneriler yükleniyor...' : 'Önerilecek kullanıcı bulunamadı'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Trending Topics */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-6 hover:bg-card/70 transition-all">
          <h2 className="text-xl font-semibold text-foreground mb-5">Ne oluyor?</h2>
          <div className="space-y-1">
            <div className="hover:bg-surface/50 p-3 rounded-2xl cursor-pointer transition-all group">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-muted-foreground text-sm">Canlı</p>
              </div>
              <p className="font-semibold text-foreground group-hover:text-accent transition-colors">Galatasaray - Fenerbahçe</p>
              <p className="text-muted-foreground text-sm">Spor · Trending</p>
            </div>
            <div className="hover:bg-surface/50 p-3 rounded-2xl cursor-pointer transition-all group">
              <p className="text-muted-foreground text-sm">Türkiye trends</p>
              <p className="font-semibold text-foreground group-hover:text-accent transition-colors">#HavaDurumu</p>
              <p className="text-muted-foreground text-sm">15.2K posts</p>
            </div>
            <div className="hover:bg-surface/50 p-3 rounded-2xl cursor-pointer transition-all group">
              <p className="text-muted-foreground text-sm">Teknoloji</p>
              <p className="font-semibold text-foreground group-hover:text-accent transition-colors">Yapay Zeka</p>
              <p className="text-muted-foreground text-sm">8.7K posts</p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-muted-foreground text-sm space-y-3 px-2">
          <div className="flex flex-wrap gap-3">
            <a href="#" className="hover:text-accent transition-colors hover:underline">Hizmet Şartları</a>
            <a href="#" className="hover:text-accent transition-colors hover:underline">Gizlilik</a>
            <a href="#" className="hover:text-accent transition-colors hover:underline">Çerezler</a>
            <a href="#" className="hover:text-accent transition-colors hover:underline">Erişilebilirlik</a>
          </div>
          <p className="opacity-70">© {new Date().getFullYear()} Tinetir</p>
        </div>
      </div>
    </div>
  )
}
