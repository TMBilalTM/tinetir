import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Kullanıcının profil bilgilerini getir (düzenleme için)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        location: true,
        website: true,
        image: true,
        banner: true,
        verified: true,
        badges: true,
        isAdmin: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // JSON string'leri parse et
    const userData = {
      ...user,      badges: user.badges ? JSON.parse(user.badges) : [],
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error('Profil bilgileri getirme hatası:', error)
    return NextResponse.json(
      { error: 'Profil bilgileri getirilemedi' },
      { status: 500 }
    )
  }
}

// PUT - Profil bilgilerini güncelle
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const name = formData.get('name') as string
    const username = formData.get('username') as string
    const bio = formData.get('bio') as string
    const location = formData.get('location') as string
    const website = formData.get('website') as string
    const profileImage = formData.get('profileImage') as File | null
    const bannerImage = formData.get('bannerImage') as File | null

    // Username benzersizlik kontrolü
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: username,
          NOT: { id: session.user.id }
        }
      })
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Bu kullanıcı adı zaten kullanılıyor' },
          { status: 400 }
        )
      }
    }

    // Resim upload işlemleri
    let profileImageUrl: string | undefined
    let bannerImageUrl: string | undefined

    // Vercel'de dosya sistemi sınırlı olduğu için, şimdilik base64 formatında saklayalım
    // Büyük dosyalar için boyut sınırı koyalım (2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB

    if (profileImage && profileImage.size > 0) {
      if (profileImage.size > maxSize) {
        return NextResponse.json(
          { error: 'Profil resmi 2MB\'dan büyük olamaz' },
          { status: 400 }
        )
      }
      
      const bytes = await profileImage.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString('base64')
      const mimeType = profileImage.type || 'image/jpeg'
      profileImageUrl = `data:${mimeType};base64,${base64}`
    }

    if (bannerImage && bannerImage.size > 0) {
      if (bannerImage.size > maxSize) {
        return NextResponse.json(
          { error: 'Banner resmi 2MB\'dan büyük olamaz' },
          { status: 400 }
        )
      }
      
      const bytes = await bannerImage.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString('base64')
      const mimeType = bannerImage.type || 'image/jpeg'
      bannerImageUrl = `data:${mimeType};base64,${base64}`
    }

    // Profil güncelleme
    const updateData: {
      name?: string | null
      username?: string | null
      bio?: string | null
      location?: string | null
      website?: string | null
      image?: string
      banner?: string
    } = {
      name: name || null,
      username: username || null,
      bio: bio || null,
      location: location || null,
      website: website || null,
    }

    if (profileImageUrl) {
      updateData.image = profileImageUrl
    }

    if (bannerImageUrl) {
      updateData.banner = bannerImageUrl
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        location: true,
        website: true,
        image: true,        banner: true,
        verified: true,        badges: true,
      },
    })

    // JSON string'leri parse et
    const userData = {
      ...updatedUser,      badges: updatedUser.badges ? JSON.parse(updatedUser.badges) : [],
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error('Profil güncelleme hatası:', error)
    return NextResponse.json(
      { error: 'Profil güncellenemedi' },
      { status: 500 }
    )
  }
}


