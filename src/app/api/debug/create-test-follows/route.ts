import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Test takip verisi oluştur
export async function GET() {
  try {
    // İlk iki kullanıcıyı al
    const users = await prisma.user.findMany({
      select: { id: true, username: true },
      take: 3,
    })

    if (users.length < 2) {
      return NextResponse.json({
        error: 'En az 2 kullanıcı gerekli',
        userCount: users.length
      }, { status: 400 })
    }

    // Test takip ilişkisi oluştur (kullanıcı 1, kullanıcı 2'yi takip etsin)
    const followData = {
      followerId: users[0].id,
      followingId: users[1].id,
    }

    // Zaten varsa oluşturma
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: followData,
      },
    })

    if (existingFollow) {
      return NextResponse.json({
        message: 'Test takip verisi zaten mevcut',
        follow: existingFollow,
        users: users
      })
    }

    // Yeni takip oluştur
    const newFollow = await prisma.follow.create({
      data: followData,
    })

    // Eğer 3. kullanıcı varsa, 2. kullanıcı da 3. kullanıcıyı takip etsin
    if (users.length >= 3) {
      const secondFollow = {
        followerId: users[1].id,
        followingId: users[2].id,
      }

      await prisma.follow.create({
        data: secondFollow,
      }).catch(() => {
        // Zaten varsa hata verme
      })
    }

    return NextResponse.json({
      message: 'Test takip verisi oluşturuldu',
      follow: newFollow,
      users: users
    })

  } catch (error) {
    console.error('Test takip verisi oluşturma hatası:', error)
    return NextResponse.json(
      { error: 'Test takip verisi oluşturulamadı' },
      { status: 500 }
    )
  }
}
