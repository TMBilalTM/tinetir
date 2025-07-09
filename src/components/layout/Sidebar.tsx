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
    { icon: Search, label: 'Keşfet', href: '/search' },
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
      <div className="hidden lg:flex h-full p-6 flex-col">
        {/* Logo */}
        <div className="mb-10">
          <Link href="/" className="text-3xl font-bold text-accent hover:text-accent-hover transition-colors">
            𝕏
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1">
          <ul className="space-y-1">
            {visibleMenuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center space-x-4 px-4 py-3 rounded-lg hover:bg-background-tertiary transition-all duration-200 group"
                >
                  <item.icon className="w-6 h-6 text-muted group-hover:text-foreground transition-colors" />
                  <span className="text-lg font-medium hidden xl:block text-muted group-hover:text-foreground transition-colors">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Tweet Button - Only for authenticated users */}
          {session && (
            <button className="bg-accent hover:bg-accent-hover text-white font-semibold py-4 px-8 rounded-xl mt-8 w-full xl:w-auto transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
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
              className="flex items-center justify-between p-4 rounded-xl hover:bg-background-tertiary transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-background-tertiary rounded-xl flex items-center justify-center overflow-hidden border border-border">
                  {session.user?.image ? (
                    <Image 
                      src={session.user.image} 
                      alt={session.user.name || 'User'} 
                      width={48}
                      height={48}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-muted" />
                  )}
                </div>
                <div className="hidden xl:block">
                  <p className="font-semibold text-sm text-foreground">{session.user?.name || 'Kullanıcı'}</p>
                  <p className="text-muted text-sm">@{session.user?.username || session.user?.email?.split('@')[0] || 'user'}</p>
                </div>
              </div>
            </Link>
            <button 
              onClick={() => signOut()}
              className="hidden xl:flex items-center space-x-3 p-3 hover:bg-destructive-light hover:text-destructive rounded-xl transition-all duration-200 w-full mt-3 group"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Çıkış Yap</span>
            </button>
          </div>
        ) : (
          <div className="mt-auto space-y-4">
            <Link
              href="/auth/signin"
              className="flex items-center justify-center space-x-3 bg-accent text-white font-semibold py-4 px-6 rounded-xl hover:bg-accent-hover transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <LogIn className="w-5 h-5" />
              <span className="hidden xl:block">Giriş Yap</span>
            </Link>
            <Link
              href="/auth/signup"
              className="hidden xl:flex items-center justify-center space-x-3 border-2 border-border text-foreground font-semibold py-3 px-6 rounded-xl hover:bg-background-tertiary transition-all duration-200"
            >
              <UserPlus className="w-5 h-5" />
              <span>Kaydol</span>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <div className="flex justify-around items-center py-3 px-4">
          {visibleMenuItems.slice(0, session ? 5 : 3).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center p-3 hover:bg-background-tertiary rounded-xl transition-all duration-200 min-w-[60px] group"
            >
              <item.icon className="w-6 h-6 text-muted group-hover:text-accent transition-colors" />
              <span className="text-xs mt-1 text-center text-muted group-hover:text-accent transition-colors font-medium">
                {item.label}
              </span>
            </Link>
          ))}
          
          {/* Sign In Button for Mobile - only if not authenticated */}
          {!session && (
            <Link
              href="/auth/signin"
              className="flex flex-col items-center p-3 hover:bg-background-tertiary rounded-xl transition-all duration-200 min-w-[60px] group"
            >
              <LogIn className="w-6 h-6 text-accent group-hover:text-accent-hover transition-colors" />
              <span className="text-xs mt-1 text-center text-accent group-hover:text-accent-hover transition-colors font-medium">
                Giriş
              </span>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
