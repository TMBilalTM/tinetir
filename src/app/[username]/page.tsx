import { Metadata } from 'next'
import ProfilePageClient from '@/components/user/ProfilePageClient'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { cache } from 'react'

interface ProfilePageProps {
  params: Promise<{
    username: string
  }>
}

// Cache'lenmiş kullanıcı sorgulama fonksiyonu
const getUserByUsername = cache(async (username: string) => {
  try {
    return await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { id: username },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        verified: true,
      },
    })
  } catch (error) {
    console.error('User lookup error:', error)
    return null
  }
})

// Metadata oluşturma
export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params
  
  const user = await getUserByUsername(username)
  
  if (!user) {
    return {
      title: 'Kullanıcı Bulunamadı / Twitter Clone',
      description: 'Bu kullanıcı bulunamadı.',
    }
  }

  const displayName = user.name || user.username || 'Kullanıcı'
  const verifiedBadge = user.verified ? ' ✓' : ''
  
  return {
    title: `${displayName}${verifiedBadge} (@${user.username}) / Twitter Clone`,
    description: user.bio || `${displayName} adlı kullanıcının Twitter Clone profili`,
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params

  // Cache'lenmiş fonksiyonu kullan
  const user = await getUserByUsername(username)

  if (!user) {
    notFound()
  }

  return <ProfilePageClient username={username} />
}
