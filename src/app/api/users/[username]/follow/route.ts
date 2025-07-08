import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST - Kullanıcıyı takip et
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const { username } = await params

    // Takip edilecek kullanıcıyı bul
    const targetUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { id: username },
        ],
      },
      select: { id: true },
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Kendini takip etmeye çalışıyor mu?
    if (targetUser.id === session.user.id) {
      return NextResponse.json(
        { error: 'Kendinizi takip edemezsiniz' },
        { status: 400 }
      )
    }

    // Zaten takip ediyor mu?
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: targetUser.id,
        },
      },
    })

    if (existingFollow) {
      return NextResponse.json(
        { error: 'Bu kullanıcıyı zaten takip ediyorsunuz' },
        { status: 409 }
      )
    }

    // Takip et
    await prisma.follow.create({
      data: {
        followerId: session.user.id,
        followingId: targetUser.id,
      },
    })

    return NextResponse.json({ message: 'Kullanıcı takip edildi' }, { status: 201 })

  } catch (error) {
    console.error('Takip etme hatası:', error)
    return NextResponse.json(
      { error: 'Takip işlemi başarısız' },
      { status: 500 }
    )
  }
}

// DELETE - Kullanıcıyı takibi bırak
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const { username } = await params

    // Takibi bırakılacak kullanıcıyı bul
    const targetUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { id: username },
        ],
      },
      select: { id: true },
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Takibi bırak
    const deletedFollow = await prisma.follow.deleteMany({
      where: {
        followerId: session.user.id,
        followingId: targetUser.id,
      },
    })

    if (deletedFollow.count === 0) {
      return NextResponse.json(
        { error: 'Bu kullanıcıyı takip etmiyordunuz' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Takip bırakıldı' }, { status: 200 })

  } catch (error) {
    console.error('Takip bırakma hatası:', error)
    return NextResponse.json(
      { error: 'Takip bırakma işlemi başarısız' },
      { status: 500 }
    )
  }
}

// GET - Takip durumunu kontrol et
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ isFollowing: false })
    }

    const { username } = await params

    // Takip durumu kontrol edilecek kullanıcıyı bul
    const targetUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { id: username },
        ],
      },
      select: { id: true },
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Takip durumunu kontrol et
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: targetUser.id,
        },
      },
    })

    return NextResponse.json({ isFollowing: !!follow })

  } catch (error) {
    console.error('Takip durumu kontrol hatası:', error)
    return NextResponse.json({ isFollowing: false })
  }
}
