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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Rozet Yönetimi</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
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
                className="flex items-center justify-between p-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${badge.color}`} />
                  <div>
                    <p className="font-medium">{badge.name}</p>
                    <p className="text-sm text-gray-400">{badge.description}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleBadgeToggle(badge.id)}
                  disabled={loading}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    hasBadge
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  } disabled:opacity-50`}
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
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
}
