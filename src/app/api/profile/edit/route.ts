import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

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

    if (profileImage && profileImage.size > 0) {
      const bytes = await profileImage.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'profiles')
      await mkdir(uploadsDir, { recursive: true })
      
      const filename = `profile_${session.user.id}_${Date.now()}.${profileImage.name.split('.').pop()}`
      const filepath = path.join(uploadsDir, filename)
      await writeFile(filepath, buffer)
      
      profileImageUrl = `/uploads/profiles/${filename}`
    }

    if (bannerImage && bannerImage.size > 0) {
      const bytes = await bannerImage.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'banners')
      await mkdir(uploadsDir, { recursive: true })
      
      const filename = `banner_${session.user.id}_${Date.now()}.${bannerImage.name.split('.').pop()}`
      const filepath = path.join(uploadsDir, filename)
      await writeFile(filepath, buffer)
      
      bannerImageUrl = `/uploads/banners/${filename}`
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

