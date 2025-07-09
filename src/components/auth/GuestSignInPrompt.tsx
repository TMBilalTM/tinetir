'use client'

import Link from 'next/link'
import { LogIn, UserPlus, Sparkles, Star } from 'lucide-react'

export default function GuestSignInPrompt() {
  return (
    <div className="border-b border-border/50 p-8 bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 backdrop-blur-sm">
      <div className="text-center space-y-6 max-w-lg mx-auto">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-accent/25">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-2xl flex items-center justify-center">
            <Star className="w-4 h-4 text-yellow-900" />
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-3">Tinetir&apos;e Hoş Geldin!</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Tweetleri görüntüleyebilirsin, ancak paylaşım yapmak, beğenmek ve yorum yapmak için 
            <span className="text-accent font-semibold"> giriş yapman</span> gerekiyor.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          <Link
            href="/auth/signin"
            className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent 
                     text-white font-semibold py-4 px-8 rounded-2xl transition-all hover:scale-105 active:scale-95 
                     flex items-center gap-3 min-w-[160px] justify-center shadow-lg shadow-accent/25
                     focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            <LogIn className="w-5 h-5" />
            Giriş Yap
          </Link>
          
          <Link
            href="/auth/signup"
            className="border-2 border-accent bg-accent/5 hover:bg-accent/10 text-accent hover:text-accent/90 
                     font-semibold py-4 px-8 rounded-2xl transition-all hover:scale-105 active:scale-95
                     flex items-center gap-3 min-w-[160px] justify-center backdrop-blur-sm
                     focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            <UserPlus className="w-5 h-5" />
            Kaydol
          </Link>
        </div>
        
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Ücretsiz</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Güvenli</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Hızlı</span>
          </div>
        </div>
      </div>
    </div>
  )
}
