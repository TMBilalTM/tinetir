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
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    title: 'Doğrulanmış hesap',
  },
  premium: {
    icon: Star,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    title: 'Premium üye',
  },
  business: {
    icon: Briefcase,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    title: 'İşletme hesabı',
  },
  developer: {
    icon: Code,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    title: 'Geliştirici',
  },
  government: {
    icon: Building,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    borderColor: 'border-gray-200 dark:border-gray-800',
    title: 'Resmi kurum',
  },
}

const sizeConfig = {
  sm: { 
    icon: 'w-3 h-3', 
    padding: 'p-1', 
    gap: 'space-x-1' 
  },
  md: { 
    icon: 'w-4 h-4', 
    padding: 'p-1.5', 
    gap: 'space-x-1.5' 
  },
  lg: { 
    icon: 'w-5 h-5', 
    padding: 'p-2', 
    gap: 'space-x-2' 
  },
}

export default function Badge({ type, size = 'md', className = '' }: BadgeProps) {
  const config = badgeConfig[type as keyof typeof badgeConfig]
  
  if (!config) return null

  const Icon = config.icon
  const sizeClass = sizeConfig[size]

  return (
    <span 
      className={`inline-flex items-center justify-center rounded-full border ${config.bgColor} ${config.borderColor} ${sizeClass.padding} ${className}`}
      title={config.title}
    >
      <Icon className={`${sizeClass.icon} ${config.color}`} />
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

  const sizeClass = sizeConfig[size]

  return (
    <div className={`flex items-center ${sizeClass.gap} ${className}`}>
      {badges.map((badge) => (
        <Badge key={badge} type={badge} size={size} />
      ))}
    </div>
  )
}
