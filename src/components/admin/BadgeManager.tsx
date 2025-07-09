'use client'

import { useState } from 'react'
import { Shield, Star, Briefcase, Code, Building, X } from 'lucide-react'

interface BadgeManagerProps {
  userId: string
  currentBadges: string[]
  onBadgeUpdate: (badges: string[]) => void
  onClose: () => void
}

const availableBadges = [
  {
    id: 'verified',
    name: 'Doğrulanmış',
    icon: Shield,
    color: 'text-blue-500',
    description: 'Bu hesap doğrulanmıştır'
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: Star,
    color: 'text-yellow-500',
    description: 'Premium üye'
  },
  {
    id: 'business',
    name: 'İşletme',
    icon: Briefcase,
    color: 'text-green-500',
    description: 'İşletme hesabı'
  },
  {
    id: 'developer',
    name: 'Geliştirici',
    icon: Code,
    color: 'text-purple-500',
    description: 'Geliştirici hesabı'
  },
  {
    id: 'government',
    name: 'Resmi Kurum',
    icon: Building,
    color: 'text-gray-400',
    description: 'Resmi kurum hesabı'
  }
]

export default function BadgeManager({ userId, currentBadges, onBadgeUpdate, onClose }: BadgeManagerProps) {
  const [loading, setLoading] = useState(false)

  const handleBadgeToggle = async (badgeId: string) => {
    setLoading(true)
    try {
      const isRemoving = currentBadges.includes(badgeId)
      const method = isRemoving ? 'DELETE' : 'POST'
      
      const response = await fetch(`/api/admin/badges/${userId}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ badge: badgeId }),
      })

      if (response.ok) {
        const data = await response.json()
        onBadgeUpdate(data.user.badges || [])
      } else {
        const error = await response.json()
        alert(error.error || 'Rozet işlemi başarısız')
      }
    } catch (error) {
      console.error('Rozet işlemi hatası:', error)
      alert('Rozet işlemi başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Rozet Yönetimi</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Kullanıcı rozetlerini yönetin</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {availableBadges.map((badge) => {
            const Icon = badge.icon
            const hasBadge = currentBadges.includes(badge.id)
            
            return (
              <div
                key={badge.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl bg-gray-100 dark:bg-gray-800`}>
                    <Icon className={`w-5 h-5 ${badge.color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{badge.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{badge.description}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleBadgeToggle(badge.id)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
                    hasBadge
                      ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                      : 'bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                  }`}
                >
                  {loading ? '...' : hasBadge ? 'Kaldır' : 'Ekle'}
                </button>
              </div>
            )
          })}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-colors font-medium"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
}
