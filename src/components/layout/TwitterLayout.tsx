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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Mobile Header */}
      <MobileHeader />
      
      <div className="max-w-7xl mx-auto flex relative">
        {/* Left Sidebar - Desktop only */}
        <div className="hidden lg:block w-64 xl:w-72 fixed h-full z-10">
          <div className="h-full bg-background-secondary/50 backdrop-blur-sm border-r border-border">
            <Sidebar />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 xl:ml-72 lg:mr-80 xl:mr-88 pb-16 lg:pb-0">
          <main className="min-h-screen bg-background-secondary/30 backdrop-blur-sm">
            {children}
          </main>
        </div>

        {/* Right Sidebar - Desktop only */}
        <div className="hidden lg:block w-80 xl:w-88 fixed right-0 h-full z-10">
          <div className="h-full bg-background-secondary/50 backdrop-blur-sm border-l border-border">
            <RightSidebar />
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bottom-nav-safe">
          <div className="bg-background-secondary/95 backdrop-blur-md border-t border-border shadow-lg">
            <Sidebar />
          </div>
        </div>

        {/* Mobile Floating Tweet Button */}
        <MobileTweetButton />
      </div>
    </div>
  )
}
