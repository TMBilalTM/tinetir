import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import TwitterLayout from '@/components/layout/TwitterLayout'
import TweetComposer from '@/components/tweet/TweetComposer'
import TweetFeed from '@/components/tweet/TweetFeed'
import GuestSignInPrompt from '@/components/auth/GuestSignInPrompt'
import { TweetProvider } from '@/contexts/TweetContext'
import { Sparkles, Home } from 'lucide-react'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <TweetProvider>
      <TwitterLayout>
        <div className="border-x-0 lg:border-x border-border/50 min-h-screen bg-background/50">
          {/* Modern Header */}
          <div className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border/50 z-10">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-2xl">
                  <Home className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Ana Sayfa</h1>
                  <p className="text-muted-foreground text-sm">En son güncellemeler</p>
                </div>
                <div className="ml-auto">
                  <button className="p-3 hover:bg-surface/50 rounded-2xl transition-all hover:scale-105 active:scale-95">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="space-y-1">
            {/* Tweet Composer - Only for authenticated users */}
            {session ? (
              <div className="border-b border-border/50">
                <TweetComposer />
              </div>
            ) : (
              <div className="border-b border-border/50">
                <GuestSignInPrompt />
              </div>
            )}

            {/* Tweet Feed */}
            <TweetFeed />
          </div>
        </div>
      </TwitterLayout>
    </TweetProvider>
  )
}
