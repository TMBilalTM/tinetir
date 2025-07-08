import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const tweets = await prisma.tweet.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            verified: true,
            badges: true,
          },
        },
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
        retweets: {
          select: {
            id: true,
            userId: true,
          },
        },
        replies: {
          select: {
            id: true,
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            retweets: true,
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // JSON alanları parse et
    const tweetsWithParsedData = tweets.map((tweet) => ({
      ...tweet,
      images: tweet.images ? JSON.parse(tweet.images) : [],
      hashtags: tweet.hashtags ? JSON.parse(tweet.hashtags) : [],
      mentions: tweet.mentions ? JSON.parse(tweet.mentions) : [],
      user: {
        ...tweet.user,
        badges: tweet.user.badges ? JSON.parse(tweet.user.badges) : [],
      },
    }))

    return NextResponse.json(tweetsWithParsedData)
  } catch (error) {
    console.error('Tweets getirme hatası:', error)
    return NextResponse.json(
      { error: 'Tweets getirilemedi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    // FormData veya JSON verisi kontrolü
    const contentType = request.headers.get('content-type')
    let content, location, hashtags, mentions
    const mediaFiles = []

    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData()
      content = formData.get('content') as string
      location = formData.get('location') as string
      hashtags = JSON.parse(formData.get('hashtags') as string || '[]')
      mentions = JSON.parse(formData.get('mentions') as string || '[]')
      
      // Media dosyalarını işle
      const uploadedFiles = []
      for (let i = 0; formData.get(`media_${i}`); i++) {
        const file = formData.get(`media_${i}`) as File
        if (file && file.size > 0) {
          try {
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            
            // Benzersiz dosya adı oluştur
            const fileExtension = file.name.split('.').pop()
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExtension}`
            const filePath = join(process.cwd(), 'public', 'uploads', fileName)
            
            // Dosyayı kaydet
            await writeFile(filePath, buffer)
            uploadedFiles.push(`/uploads/${fileName}`)
          } catch (error) {
            console.error('Dosya yükleme hatası:', error)
          }
        }
      }
      mediaFiles.push(...uploadedFiles)
    } else {
      const data = await request.json()
      content = data.content
      location = data.location || ''
      hashtags = data.hashtags || []
      mentions = data.mentions || []
    }

    // Gelişmiş özellikler kullanılmıyor şimdilik, console'a log
    if (location) console.log('Tweet location:', location)
    if (hashtags?.length > 0) console.log('Tweet hashtags:', hashtags)
    if (mentions?.length > 0) console.log('Tweet mentions:', mentions)
    if (mediaFiles.length > 0) console.log('Tweet media:', mediaFiles)

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Tweet içeriği gereklidir' },
        { status: 400 }
      )
    }

    if (content.length > 280) {
      return NextResponse.json(
        { error: 'Tweet 280 karakterden uzun olamaz' },
        { status: 400 }
      )
    }

    const tweet = await prisma.tweet.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        location: location || null,
        images: mediaFiles.length > 0 ? JSON.stringify(mediaFiles) : null,
        hashtags: hashtags.length > 0 ? JSON.stringify(hashtags) : null,
        mentions: mentions.length > 0 ? JSON.stringify(mentions) : null,
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
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
        retweets: {
          select: {
            id: true,
            userId: true,
          },
        },
        replies: {
          select: {
            id: true,
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            retweets: true,
            replies: true,
          },
        },
      },
    })

    // JSON alanları parse et
    const tweetWithParsedData = {
      ...tweet,
      images: tweet.images ? JSON.parse(tweet.images) : [],
      hashtags: tweet.hashtags ? JSON.parse(tweet.hashtags) : [],
      mentions: tweet.mentions ? JSON.parse(tweet.mentions) : [],
    }

    return NextResponse.json(tweetWithParsedData, { status: 201 })
  } catch (error) {
    console.error('Tweet oluşturma hatası:', error)
    return NextResponse.json(
      { error: 'Tweet oluşturulamadı' },
      { status: 500 }
    )
  }
}
