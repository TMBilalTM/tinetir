import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    const tweetId = params.id

    // Tweet'in var olup olmadığını kontrol et
    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
    })

    if (!tweet) {
      return NextResponse.json(
        { error: 'Tweet bulunamadı' },
        { status: 404 }
      )
    }

    // Zaten beğenilmiş mi kontrol et
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_tweetId: {
          userId: session.user.id,
          tweetId,
        },
      },
    })

    if (existingLike) {
      return NextResponse.json(
        { error: 'Tweet zaten beğenilmiş' },
        { status: 400 }
      )
    }

    // Beğeni ekle
    const like = await prisma.like.create({
      data: {
        userId: session.user.id,
        tweetId,
      },
    })

    return NextResponse.json(like, { status: 201 })
  } catch (error) {
    console.error('Beğeni ekleme hatası:', error)
    return NextResponse.json(
      { error: 'Beğeni eklenemedi' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    const tweetId = params.id

    // Beğeniyi bul ve sil
    const deletedLike = await prisma.like.deleteMany({
      where: {
        userId: session.user.id,
        tweetId,
      },
    })

    if (deletedLike.count === 0) {
      return NextResponse.json(
        { error: 'Beğeni bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Beğeni silme hatası:', error)
    return NextResponse.json(
      { error: 'Beğeni silinemedi' },
      { status: 500 }
    )
  }
}
