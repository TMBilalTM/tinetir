import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import TwitterLayout from '@/components/layout/TwitterLayout'
import TweetComposer from '@/components/tweet/TweetComposer'
import TweetFeed from '@/components/tweet/TweetFeed'
import GuestSignInPrompt from '@/components/auth/GuestSignInPrompt'
import { TweetProvider } from '@/contexts/TweetContext'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <TweetProvider>
      <TwitterLayout>
        <div className="border-x-0 lg:border-x border-border min-h-screen">
          {/* Header */}
          <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-border p-4 z-10">
            <h1 className="text-xl font-bold">Ana Sayfa</h1>
          </div>

          {/* Tweet Composer - Only for authenticated users */}
          {session ? (
            <TweetComposer />
          ) : (
            <GuestSignInPrompt />
          )}

          {/* Tweet Feed */}
          <TweetFeed />
        </div>
      </TwitterLayout>
    </TweetProvider>
  )
}
