'use client'

import { useState, useEffect } from 'react'
import { X, Search, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { BadgeList } from '@/components/ui/Badge'

interface FollowUser {
  id: string
  name: string | null
  username: string | null
  image: string | null
  bio: string | null
  verified: boolean
  badges?: string[]
}

interface FollowModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  type: 'followers' | 'following'
  title: string
}

export default function FollowModal({ isOpen, onClose, userId, type, title }: FollowModalProps) {
  const [users, setUsers] = useState<FollowUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<FollowUser[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      console.log('FollowModal - API isteği:', `/api/users/${userId}/${type}`)
      const response = await fetch(`/api/users/${userId}/${type}`)
      
      console.log('FollowModal - API yanıtı:', {
        status: response.status,
        ok: response.ok,
        url: response.url
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('FollowModal - Alınan veri:', data)
        setUsers(data)
        setFilteredUsers(data)
      } else {
        const errorData = await response.text()
        console.error('Kullanıcılar yüklenemedi:', {
          status: response.status,
          error: errorData
        })
      }
    } catch (error) {
      console.error('Kullanıcı listesi yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  // Kullanıcıları yükle
  useEffect(() => {
    if (isOpen && userId) {
      fetchUsers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId, type])

  // Arama filtresi
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(user => 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-xl border border-gray-200/20 dark:border-gray-700/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/20 dark:border-gray-700/20">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200/20 dark:border-gray-700/20">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Kullanıcı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-3"></div>
                <p className="text-gray-500 dark:text-gray-400">Yükleniyor...</p>
              </div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="p-6 space-y-3">
              {filteredUsers.map((user) => (
                <Link
                  key={user.id}
                  href={`/${user.username || user.id}`}
                  onClick={onClose}
                  className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                    {user.image ? (
                      <Image 
                        src={user.image} 
                        alt={user.name || 'User'}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {user.name || 'Adsız Kullanıcı'}
                      </h3>
                      {user.badges && user.badges.length > 0 && (
                        <BadgeList badges={user.badges} size="sm" />
                      )}
                      {user.verified && !user.badges?.includes('verified') && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
                      @{user.username || user.id.slice(0, 8)}
                    </p>
                    {user.bio && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">
                        {user.bio}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mb-4">
                <User className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery 
                  ? 'Arama sonucu bulunamadı' 
                  : `Henüz hiç ${type === 'followers' ? 'takipçi' : 'takip edilen'} yok`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
