'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { User, Settings, LogOut, Sparkles } from 'lucide-react'
import { useState } from 'react'

export default function MobileHeader() {
  const { data: session } = useSession()
  const [showUserMenu, setShowUserMenu] = useState(false)

  if (!session) return null

  return (
    <div className="lg:hidden sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border/50 z-20">
      <div className="flex items-center justify-between p-4">
        {/* Modern Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
            Tinetir
          </span>
        </Link>

        {/* User Avatar with Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center overflow-hidden 
                     ring-2 ring-accent/20 hover:ring-accent/40 transition-all hover:scale-105 active:scale-95"
          >
            {session.user?.image ? (
              <Image 
                src={session.user.image} 
                alt={session.user.name || 'User'} 
                width={40}
                height={40}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-accent" />
            )}
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm" 
                onClick={() => setShowUserMenu(false)}
              />
              
              {/* Menu */}
              <div className="absolute right-0 top-full mt-3 w-72 bg-card/95 backdrop-blur-xl border border-border rounded-3xl shadow-2xl shadow-black/25 z-20 overflow-hidden">
                <div className="p-6 border-b border-border/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center overflow-hidden ring-2 ring-accent/20">
                      {session.user?.image ? (
                        <Image 
                          src={session.user.image} 
                          alt={session.user.name || 'User'} 
                          width={48}
                          height={48}
                          className="w-full h-full rounded-2xl object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-accent" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{session.user?.name || 'Kullanıcı'}</p>
                      <p className="text-muted-foreground text-sm truncate">@{session.user?.username || session.user?.email?.split('@')[0] || 'user'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <Link 
                    href={session?.user?.username ? `/${session.user.username}` : (session?.user?.email ? `/${session.user.email.split('@')[0]}` : '/profile')} 
                    className="flex items-center space-x-4 px-6 py-4 hover:bg-surface/50 transition-all group"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <div className="p-2 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                      <User className="w-4 h-4 text-accent" />
                    </div>
                    <span className="font-medium text-foreground group-hover:text-accent transition-colors">Profil</span>
                  </Link>
                  
                  <Link 
                    href="/settings" 
                    className="flex items-center space-x-4 px-6 py-4 hover:bg-surface/50 transition-all group"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <div className="p-2 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                      <Settings className="w-4 h-4 text-accent" />
                    </div>
                    <span className="font-medium text-foreground group-hover:text-accent transition-colors">Ayarlar</span>
                  </Link>
                  
                  <button 
                    onClick={() => {
                      setShowUserMenu(false)
                      signOut()
                    }}
                    className="flex items-center space-x-4 px-6 py-4 hover:bg-red-500/10 transition-all w-full text-left group"
                  >
                    <div className="p-2 bg-red-500/10 rounded-xl group-hover:bg-red-500/20 transition-colors">
                      <LogOut className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="font-medium text-red-500">Çıkış Yap</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
