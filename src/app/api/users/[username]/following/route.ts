import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Kullanıcının takip ettiklerini getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params
    
    console.log('Following API - Aranan kullanıcı:', username)

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

    console.log('Following API - Bulunan kullanıcı:', user)

    if (!user) {
      console.log('Following API - Kullanıcı bulunamadı:', username)
      return NextResponse.json(
        { error: `Kullanıcı bulunamadı: ${username}` },
        { status: 404 }
      )
    }

    // Takip ettiklerini getir (bu kullanıcının takip ettiği kişiler)
    const following = await prisma.follow.findMany({
      where: {
        followerId: user.id, // Bu kullanıcı followerId olarak kayıtlı
      },
      select: {
        followingId: true,
      },
    })

    // Takip edilen kullanıcıların bilgilerini getir
    const followingIds = following.map(f => f.followingId)
    
    const followingUsers = await prisma.user.findMany({
      where: {
        id: {
          in: followingIds,
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

    // Takip edilen listesini düzenle
    const followingList = followingUsers.map(user => ({
      ...user,
      badges: user.badges ? JSON.parse(user.badges) : [],
    }))

    return NextResponse.json(followingList)

  } catch (error) {
    console.error('Takip edilen listesi getirme hatası:', error)
    return NextResponse.json(
      { error: 'Takip edilen listesi getirilemedi' },
      { status: 500 }
    )
  }
}
