'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
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

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Search Bar */}
      <div className="p-4 pb-2">
        <div className="bg-gray-900 rounded-full flex items-center px-4 py-3">
          <Search className="w-5 h-5 text-muted mr-3" />
          <input
            type="text"
            placeholder="Ara"
            className="bg-transparent text-white placeholder-muted flex-1 outline-none"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6 custom-scrollbar">
        {/* Trending Topics */}
        <div className="bg-gray-900 rounded-2xl p-4">
          <h2 className="text-xl font-bold mb-4">Gündemde</h2>
          <div className="space-y-3">
            {trendingHashtags.length > 0 ? (
              trendingHashtags.map((hashtag, index) => (
                <div 
                  key={index} 
                  onClick={() => handleHashtagClick(hashtag.hashtag)}
                  className="hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors"
                >
                  <p className="text-muted text-sm">Kıbrıs Trendi</p>
                  <p className="font-bold">{hashtag.hashtag}</p>
                  <p className="text-muted text-sm">{hashtag.count} tweet</p>
                </div>
              ))
            ) : (
              <div className="text-center text-muted py-4">
                <p>Gündem yükleniyor...</p>
              </div>
            )}
          </div>
        </div>

        {/* Suggested Users */}
        <div className="bg-gray-900 rounded-2xl p-4">
          <h2 className="text-xl font-bold mb-4">Kimi takip etmeli</h2>
          <div className="space-y-3">
            {!loading && suggestedUsers.length > 0 ? (
              suggestedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <Link href={`/${user.username}`} className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                      {user.image ? (
                        <Image 
                          src={user.image} 
                          alt={user.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{user.name}</p>
                      <p className="text-muted text-sm">@{user.username}</p>
                      <p className="text-muted text-xs">{user.followersCount} takipçi</p>
                    </div>
                  </Link>
                  <button 
                    onClick={() => handleFollow(user.id)}
                    className="bg-white text-black px-4 py-1 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
                  >
                    Takip Et
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-muted py-4">
                <p>{loading ? 'Öneriler yükleniyor...' : 'Önerilecek kullanıcı bulunamadı'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Content for More Scrolling */}
        <div className="bg-gray-900 rounded-2xl p-4">
          <h2 className="text-xl font-bold mb-4">Ne oluyor?</h2>
          <div className="space-y-3">
            <div className="hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors">
              <p className="text-muted text-sm">Canlı</p>
              <p className="font-bold">Galatasaray - Fenerbahçe</p>
              <p className="text-muted text-sm">Spor · Trending</p>
            </div>
            <div className="hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors">
              <p className="text-muted text-sm">Türkiye trends</p>
              <p className="font-bold">#HavaDurumu</p>
              <p className="text-muted text-sm">15.2K posts</p>
            </div>
            <div className="hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors">
              <p className="text-muted text-sm">Teknoloji</p>
              <p className="font-bold">Yapay Zeka</p>
              <p className="text-muted text-sm">8.7K posts</p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-muted text-sm space-y-2">
          <div className="flex flex-wrap gap-2">
            <a href="#" className="hover:underline">Hizmet Şartları</a>
            <a href="#" className="hover:underline">Gizlilik Politikası</a>
            <a href="#" className="hover:underline">Çerez Politikası</a>
            <a href="#" className="hover:underline">Erişilebilirlik</a>
          </div>
          <p>© {new Date().getFullYear()} Tinetir</p>
        </div>
      </div>
    </div>
  )
}
