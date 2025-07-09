import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tweets = await prisma.tweet.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            verified: true,
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
      take: 20,
    })

    return NextResponse.json({
      success: true,
      data: tweets,
      count: tweets.length,
    })
  } catch (error) {
    console.error('Debug tweets error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tweets',
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    // Test tweet creation for debugging
    const testTweet = await prisma.tweet.create({
      data: {
        content: `Test tweet created at ${new Date().toISOString()}`,
        userId: 'test-user-id', // This should be replaced with actual user ID
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            verified: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: testTweet,
      message: 'Test tweet created successfully',
    })
  } catch (error) {
    console.error('Debug tweet creation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create test tweet',
      },
      { status: 500 }
    )
  }
}