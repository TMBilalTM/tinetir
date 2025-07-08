'use client'

import Link from 'next/link'
import { LogIn, UserPlus } from 'lucide-react'

export default function GuestSignInPrompt() {
  return (
    <div className="border-b border-border p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">👋</div>
        <h2 className="text-2xl font-bold text-white">Tinetir&apos;e Hoş Geldin!</h2>
        <p className="text-gray-300 max-w-md mx-auto">
          Tweetleri görüntüleyebilirsin, ancak paylaşım yapmak, beğenmek ve yorum yapmak için giriş yapman gerekiyor.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
          <Link
            href="/auth/signin"
            className="bg-white text-black font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2 min-w-[140px] justify-center"
          >
            <LogIn className="w-4 h-4" />
            Giriş Yap
          </Link>
          
          <Link
            href="/auth/signup"
            className="border border-white text-white font-bold py-3 px-6 rounded-full hover:bg-white hover:text-black transition-colors flex items-center gap-2 min-w-[140px] justify-center"
          >
            <UserPlus className="w-4 h-4" />
            Kaydol
          </Link>
        </div>
      </div>
    </div>
  )
}
