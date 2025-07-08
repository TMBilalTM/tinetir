import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
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

    // Tweet'in varlığını ve sahiplik kontrolü
    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
      select: { id: true, userId: true }
    })

    if (!tweet) {
      return NextResponse.json(
        { error: 'Tweet bulunamadı' },
        { status: 404 }
      )
    }

    // Sadece tweet sahibi silebilir
    if (tweet.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Bu tweet\'i silme yetkiniz yok' },
        { status: 403 }
      )
    }

    // Tweet'i sil
    await prisma.tweet.delete({
      where: { id: tweetId }
    })

    return NextResponse.json(
      { message: 'Tweet başarıyla silindi' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Tweet silme hatası:', error)
    return NextResponse.json(
      { error: 'Tweet silinirken hata oluştu' },
      { status: 500 }
    )
  }
}
