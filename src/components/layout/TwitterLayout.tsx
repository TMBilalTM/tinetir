'use client'

import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import RightSidebar from './RightSidebar'
import MobileHeader from './MobileHeader'
import MobileTweetButton from './MobileTweetButton'

interface TwitterLayoutProps {
  children: ReactNode
}

export default function TwitterLayout({ children }: TwitterLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Header */}
      <MobileHeader />
      
      <div className="max-w-7xl mx-auto flex relative">
        {/* Left Sidebar - Desktop only */}
        <div className="hidden lg:block w-64 xl:w-80 fixed h-full z-10">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 xl:ml-80 lg:mr-80 xl:mr-96 pb-16 lg:pb-0">
          {children}
        </div>

        {/* Right Sidebar - Desktop only */}
        <div className="hidden lg:block w-80 xl:w-96 fixed right-0 h-full z-10">
          <RightSidebar />
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bottom-nav-safe">
          <Sidebar />
        </div>

        {/* Mobile Floating Tweet Button */}
        <MobileTweetButton />
      </div>
    </div>
  )
}
