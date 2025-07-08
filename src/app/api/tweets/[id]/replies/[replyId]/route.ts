import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// DELETE - Yanıtı sil
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

    // Yanıt'ın varlığını ve sahiplik kontrolü
    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
      select: { id: true, userId: true }
    })

    if (!reply) {
      return NextResponse.json(
        { error: 'Yanıt bulunamadı' },
        { status: 404 }
      )
    }

    // Sadece yanıt sahibi silebilir
    if (reply.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Bu yanıtı silme yetkiniz yok' },
        { status: 403 }
      )
    }

    // Yanıtı sil
    await prisma.reply.delete({
      where: { id: replyId }
    })

    return NextResponse.json(
      { message: 'Yanıt başarıyla silindi' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Yanıt silme hatası:', error)
    return NextResponse.json(
      { error: 'Yanıt silinirken hata oluştu' },
      { status: 500 }
    )
  }
}
