import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Tweet'in yanıtlarını getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tweetId } = await params

    const replies = await prisma.reply.findMany({
      where: { tweetId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Date'leri string'e çevir
    const repliesWithStringDates = replies.map(reply => ({
      ...reply,
      createdAt: reply.createdAt.toISOString(),
    }))

    return NextResponse.json(repliesWithStringDates)
  } catch (error) {
    console.error('Yanıtlar getirme hatası:', error)
    return NextResponse.json(
      { error: 'Yanıtlar getirilemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni yanıt ekle
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const { id: tweetId } = await params
    const { content } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Yanıt içeriği boş olamaz' },
        { status: 400 }
      )
    }

    // Tweet'in varlığını kontrol et
    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
      select: { id: true }
    })

    if (!tweet) {
      return NextResponse.json(
        { error: 'Tweet bulunamadı' },
        { status: 404 }
      )
    }

    // Yanıt oluştur
    const reply = await prisma.reply.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        tweetId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    })

    // Date'i string'e çevir
    const replyWithStringDate = {
      ...reply,
      createdAt: reply.createdAt.toISOString(),
    }

    return NextResponse.json(replyWithStringDate, { status: 201 })
  } catch (error) {
    console.error('Yanıt oluşturma hatası:', error)
    return NextResponse.json(
      { error: 'Yanıt oluşturulamadı' },
      { status: 500 }
    )
  }
}
