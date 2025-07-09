import { NextResponse } from 'next/server'
import { prisma, withRetry } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Trending hashtags'leri getir (son 24 saat)
export async function GET() {
  try {
    // Son 24 saat içinde oluşturulan tweetleri al
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    const tweets = await withRetry(async () => {
      return await prisma.tweet.findMany({
        where: {
          createdAt: {
            gte: twentyFourHoursAgo,
          },
        },
        select: {
          content: true,
        },
        take: 1000, // Performans için limit ekle
      })
    })

    // Content'ten hashtag'leri çıkar
    const hashtagCounts: { [key: string]: number } = {}
    
    tweets.forEach(tweet => {
      // Tweet content'inden hashtag'leri bul - Türkçe karakter desteği ile
      const hashtagMatches = tweet.content.match(/#[a-zA-ZÇĞİÖŞÜçğıöşü0-9_]+/g)
      if (hashtagMatches) {
        hashtagMatches.forEach((hashtag: string) => {
          // Karşılaştırma için lowercase kullan
          const cleanHashtag = hashtag.toLowerCase()
          if (!hashtagCounts[cleanHashtag]) {
            hashtagCounts[cleanHashtag] = 0
          }
          hashtagCounts[cleanHashtag]++
        })
      }
    })

    // Hashtag'leri count'a göre sırala ve en popüler 10'unu al
    const trendingHashtags = Object.entries(hashtagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([hashtag, count]) => ({
        hashtag,
        count,
        displayText: hashtag.charAt(1).toUpperCase() + hashtag.slice(2), // İlk harf büyük
      }))

    // Eğer hiç hashtag yoksa varsayılan liste döndür
    if (trendingHashtags.length === 0) {
      return NextResponse.json([
        { hashtag: '#teknoloji', count: 42, displayText: 'Teknoloji' },
        { hashtag: '#spor', count: 28, displayText: 'Spor' },
        { hashtag: '#müzik', count: 15, displayText: 'Müzik' },
        { hashtag: '#siyaset', count: 12, displayText: 'Siyaset' },
        { hashtag: '#oyun', count: 8, displayText: 'Oyun' },
      ])
    }

    return NextResponse.json(trendingHashtags)
  } catch (error) {
    console.error('Trending hashtags hatası:', error)
    
    // Database connection error handling
    if (error instanceof Error && (
      error.message.includes('Database connection failed') ||
      error.message.includes('too many connections')
    )) {
      // Return fallback data on connection errors
      return NextResponse.json([
        { hashtag: '#teknoloji', count: 42, displayText: 'Teknoloji' },
        { hashtag: '#spor', count: 28, displayText: 'Spor' },
        { hashtag: '#müzik', count: 15, displayText: 'Müzik' },
      ])
    }
    
    return NextResponse.json(
      { error: 'Trending hashtags getirilemedi' },
      { status: 500 }
    )
  }
}

