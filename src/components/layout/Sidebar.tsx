'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Home, 
  Search, 
  Bell, 
  Mail, 
  Bookmark, 
  User, 
  MoreHorizontal,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-react'

export default function Sidebar() {
  const { data: session } = useSession()

  const menuItems = [
    { icon: Home, label: 'Ana Sayfa', href: '/' },
    { icon: Search, label: 'Keşfet', href: '/explore' },
    { icon: Bell, label: 'Bildirimler', href: '/notifications', requireAuth: true },
    { icon: Mail, label: 'Mesajlar', href: '/messages', requireAuth: true },
    { icon: Bookmark, label: 'Yer İmleri', href: '/bookmarks', requireAuth: true },
    { 
      icon: User, 
      label: 'Profil', 
      href: session?.user?.username ? `/${session.user.username}` : (session?.user?.email ? `/${session.user.email.split('@')[0]}` : '/profile'),
      requireAuth: true
    },
    { icon: MoreHorizontal, label: 'Daha Fazla', href: '/more' },
  ]

  // Filter menu items based on authentication status
  const visibleMenuItems = session 
    ? menuItems 
    : menuItems.filter(item => !item.requireAuth)

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full p-4 flex-col">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="text-2xl font-bold">
            𝕏
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {visibleMenuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 p-3 rounded-full hover:bg-gray-900 transition-colors"
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-xl hidden xl:block">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Tweet Button - Only for authenticated users */}
          {session && (
            <button className="bg-accent hover:bg-accent-hover text-white font-bold py-3 px-8 rounded-full mt-6 w-full xl:w-auto transition-colors">
              <span className="hidden xl:block">Tweetle</span>
              <span className="xl:hidden">+</span>
            </button>
          )}
        </nav>

        {/* User Profile or Sign In */}
        {session ? (
          <div className="mt-auto">
            <Link 
              href={session?.user?.username ? `/${session.user.username}` : (session?.user?.email ? `/${session.user.email.split('@')[0]}` : '/profile')}
              className="flex items-center justify-between p-3 rounded-full hover:bg-gray-900 transition-colors"
            >
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
                <div className="hidden xl:block">
                  <p className="font-bold text-sm">{session.user?.name || 'Kullanıcı'}</p>
                  <p className="text-muted text-sm">@{session.user?.username || session.user?.email?.split('@')[0] || 'user'}</p>
                </div>
              </div>
            </Link>
            <button 
              onClick={() => signOut()}
              className="hidden xl:flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-full transition-colors w-full mt-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Çıkış Yap</span>
            </button>
          </div>
        ) : (
          <div className="mt-auto space-y-3">
            <Link
              href="/auth/signin"
              className="flex items-center justify-center space-x-2 bg-white text-black font-bold py-3 px-4 rounded-full hover:bg-gray-200 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden xl:block">Giriş Yap</span>
            </Link>
            <Link
              href="/auth/signup"
              className="hidden xl:flex items-center justify-center space-x-2 border border-white text-white font-bold py-2 px-4 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Kaydol</span>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden bg-black border-t border-border">
        <div className="flex justify-around items-center py-2 px-4">
          {visibleMenuItems.slice(0, session ? 5 : 3).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center p-2 hover:bg-gray-900 rounded-lg transition-colors min-w-[60px]"
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1 text-center">{item.label}</span>
            </Link>
          ))}
          
          {/* Sign In Button for Mobile - only if not authenticated */}
          {!session && (
            <Link
              href="/auth/signin"
              className="flex flex-col items-center p-2 hover:bg-gray-900 rounded-lg transition-colors min-w-[60px]"
            >
              <LogIn className="w-6 h-6" />
              <span className="text-xs mt-1 text-center">Giriş</span>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
