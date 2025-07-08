import { Metadata } from 'next'
import ProfilePageClient from '@/components/user/ProfilePageClient'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface ProfilePageProps {
  params: Promise<{
    username: string
  }>
}

// Metadata oluşturma
export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params
  
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { id: username },
        ],
      },
      select: {
        name: true,
        username: true,
        bio: true,
        verified: true,
      },
    })

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
  } catch {
    return {
      title: 'Twitter Clone',
      description: 'Kullanıcı profili yüklenemedi.',
    }
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params

  // Kullanıcının var olup olmadığını kontrol et
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: username },
        { id: username },
      ],
    },
    select: {
      id: true,
      username: true,
    },
  })

  if (!user) {
    notFound()
  }

  return <ProfilePageClient username={username} />
}
