'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { User, Settings, LogOut } from 'lucide-react'
import { useState } from 'react'

export default function MobileHeader() {
  const { data: session } = useSession()
  const [showUserMenu, setShowUserMenu] = useState(false)

  if (!session) return null

  return (
    <div className="lg:hidden sticky top-0 bg-black/90 backdrop-blur-md border-b border-border z-20">
      <div className="flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          𝕏
        </Link>

        {/* User Avatar with Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden"
          >
            {session.user?.image ? (
              <Image 
                src={session.user.image} 
                alt={session.user.name || 'User'} 
                width={32}
                height={32}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5" />
            )}
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowUserMenu(false)}
              />
              
              {/* Menu */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-black border border-border rounded-2xl shadow-lg z-20">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                      {session.user?.image ? (
                        <Image 
                          src={session.user.image} 
                          alt={session.user.name || 'User'} 
                          width={40}
                          height={40}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{session.user?.name || 'Kullanıcı'}</p>
                      <p className="text-muted text-sm">@{session.user?.username || session.user?.email?.split('@')[0] || 'user'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <Link 
                    href={session?.user?.username ? `/${session.user.username}` : (session?.user?.email ? `/${session.user.email.split('@')[0]}` : '/profile')} 
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-900 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Profil</span>
                  </Link>
                  
                  <Link 
                    href="/settings" 
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-900 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Ayarlar</span>
                  </Link>
                  
                  <button 
                    onClick={() => {
                      setShowUserMenu(false)
                      signOut()
                    }}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-900 transition-colors w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Çıkış Yap</span>
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
