import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Kullanıcının takipçilerini getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params
    
    console.log('Followers API - Aranan kullanıcı:', username)

    // Kullanıcıyı bul
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { id: username },
        ],
      },
      select: { id: true, username: true },
    })

    console.log('Followers API - Bulunan kullanıcı:', user)

    if (!user) {
      console.log('Followers API - Kullanıcı bulunamadı:', username)
      return NextResponse.json(
        { error: `Kullanıcı bulunamadı: ${username}` },
        { status: 404 }
      )
    }

    // Takipçileri getir (bu kullanıcıyı takip eden kişiler)
    const followers = await prisma.follow.findMany({
      where: {
        followingId: user.id, // Bu kullanıcı followingId olarak kayıtlı
      },
      select: {
        followerId: true,
      },
    })

    // Takipçi kullanıcılarının bilgilerini getir
    const followerIds = followers.map(f => f.followerId)
    
    const followerUsers = await prisma.user.findMany({
      where: {
        id: {
          in: followerIds,
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        verified: true,
        badges: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    // Takipçi listesini düzenle
    const followerList = followerUsers.map(user => ({
      ...user,
      badges: user.badges ? JSON.parse(user.badges) : [],
    }))

    return NextResponse.json(followerList)

  } catch (error) {
    console.error('Takipçi listesi getirme hatası:', error)
    return NextResponse.json(
      { error: 'Takipçi listesi getirilemedi' },
      { status: 500 }
    )
  }
}
