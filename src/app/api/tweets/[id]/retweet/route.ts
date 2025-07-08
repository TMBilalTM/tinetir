import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

    // Zaten retweet edilmiş mi kontrol et
    const existingRetweet = await prisma.retweet.findUnique({
      where: {
        userId_tweetId: {
          userId: session.user.id,
          tweetId,
        },
      },
    })

    if (existingRetweet) {
      return NextResponse.json(
        { error: 'Tweet zaten retweet edilmiş' },
        { status: 400 }
      )
    }

    // Retweet ekle
    const retweet = await prisma.retweet.create({
      data: {
        userId: session.user.id,
        tweetId,
      },
    })

    return NextResponse.json(retweet, { status: 201 })
  } catch (error) {
    console.error('Retweet ekleme hatası:', error)
    return NextResponse.json(
      { error: 'Retweet eklenemedi' },
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

    // Retweet'i bul ve sil
    const deletedRetweet = await prisma.retweet.deleteMany({
      where: {
        userId: session.user.id,
        tweetId,
      },
    })

    if (deletedRetweet.count === 0) {
      return NextResponse.json(
        { error: 'Retweet bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Retweet silme hatası:', error)
    return NextResponse.json(
      { error: 'Retweet silinemedi' },
      { status: 500 }
    )
  }
}
