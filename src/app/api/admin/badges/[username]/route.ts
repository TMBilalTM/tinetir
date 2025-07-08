import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST - Kullanıcıya rozet ver (sadece admin)
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

    // Admin kontrolü
    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        isAdmin: true 
      },
    })

    if (!admin?.isAdmin) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      )
    }

    const { username } = await params
    const { badge } = await request.json()

    if (!badge || !['verified', 'premium', 'business', 'developer', 'government'].includes(badge)) {
      return NextResponse.json(
        { error: 'Geçersiz rozet türü' },
        { status: 400 }
      )
    }

    // Kullanıcıyı bul (username veya id ile)
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
        badges: true 
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Mevcut rozetleri al
    const currentBadges = user.badges ? JSON.parse(user.badges) : []
    
    // Rozet zaten varsa ekleme
    if (currentBadges.includes(badge)) {
      return NextResponse.json(
        { error: 'Bu rozet zaten mevcut' },
        { status: 400 }
      )
    }

    // Yeni rozeti ekle
    const newBadges = [...currentBadges, badge]

    // Kullanıcıyı güncelle
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { 
        badges: JSON.stringify(newBadges),
        // Verified rozeti varsa verified field'ını da güncelle
        ...(badge === 'verified' && { verified: true })
      },
      select: {
        id: true,
        name: true,
        username: true,
        verified: true,
        badges: true,
      },
    })

    return NextResponse.json({
      message: 'Rozet başarıyla eklendi',
      user: {
        ...updatedUser,
        badges: JSON.parse(updatedUser.badges || '[]')
      }
    })

  } catch (error) {
    console.error('Badge verme hatası:', error)
    return NextResponse.json(
      { error: 'Rozet verilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE - Kullanıcıdan rozet al (sadece admin)
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

    // Admin kontrolü
    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        isAdmin: true 
      },
    })

    if (!admin?.isAdmin) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      )
    }

    const { username } = await params
    const { badge } = await request.json()

    if (!badge || !['verified', 'premium', 'business', 'developer', 'government'].includes(badge)) {
      return NextResponse.json(
        { error: 'Geçersiz rozet türü' },
        { status: 400 }
      )
    }

    // Kullanıcıyı bul (username veya id ile)
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
        badges: true 
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Mevcut rozetleri al
    const currentBadges = user.badges ? JSON.parse(user.badges) : []
    
    // Rozet yoksa hata ver
    if (!currentBadges.includes(badge)) {
      return NextResponse.json(
        { error: 'Bu rozet zaten yok' },
        { status: 400 }
      )
    }

    // Rozeti kaldır
    const newBadges = currentBadges.filter((b: string) => b !== badge)

    // Kullanıcıyı güncelle
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { 
        badges: JSON.stringify(newBadges),
        // Verified rozeti kaldırılıyorsa verified field'ını da güncelle
        ...(badge === 'verified' && { verified: false })
      },
      select: {
        id: true,
        name: true,
        username: true,
        verified: true,
        badges: true,
      },
    })

    return NextResponse.json({
      message: 'Rozet başarıyla kaldırıldı',
      user: {
        ...updatedUser,
        badges: JSON.parse(updatedUser.badges || '[]')
      }
    })

  } catch (error) {
    console.error('Badge kaldırma hatası:', error)
    return NextResponse.json(
      { error: 'Rozet kaldırılırken bir hata oluştu' },
      { status: 500 }
    )
  }
}
