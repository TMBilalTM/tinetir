import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  transactionOptions: {
    timeout: 10000, // 10 seconds timeout (increased)
    maxWait: 5000, // 5 seconds max wait (increased)
  },
})

// Helper function to safely disconnect
export async function disconnectPrisma() {
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error('Prisma disconnect error:', error)
  }
}

// Connection retry wrapper with exponential backoff
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error
      
      // Don't retry for certain errors
      if (error.code === 'P2025' || error.code === 'P2002') {
        throw error
      }

      // Check if it's a connection error
      if (error.message?.includes('connection') || error.message?.includes('timeout')) {
        if (attempt === maxRetries) {
          console.error(`Database operation failed after ${maxRetries} attempts:`, error.message)
          throw new Error('Database connection failed. Please try again later.')
        }

        const delay = baseDelay * Math.pow(2, attempt - 1)
        console.warn(`Database attempt ${attempt} failed, retrying in ${delay}ms...`, error.message)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }

      // For non-connection errors, throw immediately
      throw error
    }
  }

  throw lastError
}

// Connection health check
export async function checkDbConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection check failed:', error)
    return false
  }
}

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...')
    await disconnectPrisma()
    process.exit(0)
  })

  process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...')
    await disconnectPrisma()
    process.exit(0)
  })

  process.on('beforeExit', async () => {
    await disconnectPrisma()
  })

  // Handle uncaught exceptions
  process.on('uncaughtException', async (error) => {
    console.error('Uncaught Exception:', error)
    await disconnectPrisma()
    process.exit(1)
  })

  process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
    await disconnectPrisma()
    process.exit(1)
  })
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
