'use client'

import { Shield, Star, Briefcase, Code, Building } from 'lucide-react'

interface BadgeProps {
  type: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const badgeConfig = {
  verified: {
    icon: Shield,
    color: 'text-blue-500',
    title: 'Doğrulanmış hesap',
  },
  premium: {
    icon: Star,
    color: 'text-yellow-500',
    title: 'Premium üye',
  },
  business: {
    icon: Briefcase,
    color: 'text-green-500',
    title: 'İşletme hesabı',
  },
  developer: {
    icon: Code,
    color: 'text-purple-500',
    title: 'Geliştirici',
  },
  government: {
    icon: Building,
    color: 'text-gray-400',
    title: 'Resmi kurum',
  },
}

const sizeConfig = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

export default function Badge({ type, size = 'md', className = '' }: BadgeProps) {
  const config = badgeConfig[type as keyof typeof badgeConfig]
  
  if (!config) return null

  const Icon = config.icon
  const sizeClass = sizeConfig[size]

  return (
    <span 
      className={`inline-flex items-center ${className}`}
      title={config.title}
    >
      <Icon className={`${sizeClass} ${config.color}`} />
    </span>
  )
}

// Çoklu rozet gösterimi için yardımcı bileşen
interface BadgeListProps {
  badges: string[]
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function BadgeList({ badges, size = 'md', className = '' }: BadgeListProps) {
  if (!badges || badges.length === 0) return null

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {badges.map((badge) => (
        <Badge key={badge} type={badge} size={size} />
      ))}
    </div>
  )
}
