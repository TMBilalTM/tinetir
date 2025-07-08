import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Yanıtı beğen
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; replyId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const { replyId } = await params

    // Yanıt'ın var olup olmadığını kontrol et
    const reply = await prisma.reply.findUnique({
      where: { id: replyId }
    })

    if (!reply) {
      return NextResponse.json(
        { error: 'Yanıt bulunamadı' },
        { status: 404 }
      )
    }

    // Daha önce beğenilmiş mi kontrol et
    const existingLike = await prisma.replyLike.findUnique({
      where: {
        userId_replyId: {
          userId: session.user.id,
          replyId: replyId,
        },
      },
    })

    if (existingLike) {
      return NextResponse.json(
        { error: 'Bu yanıtı zaten beğenmişsiniz' },
        { status: 409 }
      )
    }

    // Beğeni ekle
    await prisma.replyLike.create({
      data: {
        userId: session.user.id,
        replyId: replyId,
      },
    })

    return NextResponse.json({ message: 'Yanıt beğenildi' }, { status: 201 })

  } catch (error) {
    console.error('Yanıt beğeni hatası:', error)
    return NextResponse.json(
      { error: 'Yanıt beğenilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE - Yanıt beğenisini kaldır
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; replyId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const { replyId } = await params

    // Beğeniyi kaldır
    const deletedLike = await prisma.replyLike.deleteMany({
      where: {
        userId: session.user.id,
        replyId: replyId,
      },
    })

    if (deletedLike.count === 0) {
      return NextResponse.json(
        { error: 'Bu yanıtı beğenmemişsiniz' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Yanıt beğenisi kaldırıldı' }, { status: 200 })

  } catch (error) {
    console.error('Yanıt beğeni kaldırma hatası:', error)
    return NextResponse.json(
      { error: 'Beğeni kaldırılırken bir hata oluştu' },
      { status: 500 }
    )
  }
}
