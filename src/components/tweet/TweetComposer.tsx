'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { User, Image as ImageIcon, Smile, Calendar, MapPin, Hash, AtSign, X, Send } from 'lucide-react'
import Image from 'next/image'
import { useTweets } from '@/contexts/TweetContext'

interface MediaFile {
  file: File
  url: string
}

export default function TweetComposer() {
  const { data: session } = useSession()
  const { addTweet } = useTweets()
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [location, setLocation] = useState('')
  const [showLocationInput, setShowLocationInput] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const emojis = ['😀', '😂', '❤️', '🔥', '👍', '👎', '😍', '🤔', '😭', '🎉', '💯', '🚀', '⭐', '🌟', '💎', '🎯']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() && mediaFiles.length === 0) return
    
    setIsLoading(true)
    try {
      // Extract hashtags and mentions
      const hashtags = content.match(/#\w+/g)?.map(tag => tag.slice(1)) || []
      const mentions = content.match(/@\w+/g)?.map(mention => mention.slice(1)) || []

      // Create FormData for file upload
      const formData = new FormData()
      formData.append('content', content)
      formData.append('location', location)
      formData.append('hashtags', JSON.stringify(hashtags))
      formData.append('mentions', JSON.stringify(mentions))
      
      mediaFiles.forEach((media, index) => {
        formData.append(`media_${index}`, media.file)
      })

      const response = await fetch('/api/tweets', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const newTweet = await response.json()
        addTweet(newTweet)
        
        // Reset form
        setContent('')
        setMediaFiles([])
        setLocation('')
        setShowLocationInput(false)
        setShowEmojiPicker(false)
      }
    } catch (error) {
      console.error('Tweet oluşturulurken hata:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const maxSize = 2 * 1024 * 1024 // 2MB
    
    files.forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        // Dosya boyutu kontrolü
        if (file.size > maxSize) {
          alert(`${file.name} dosyası 2MB'dan büyük olamaz`)
          return
        }
        
        // Maksimum 4 dosya kontrolü
        if (mediaFiles.length >= 4) {
          alert('En fazla 4 medya dosyası yükleyebilirsiniz')
          return
        }
        
        const url = URL.createObjectURL(file)
        setMediaFiles(prev => [...prev, { file, url }])
      }
    })
    
    // Input'u temizle
    if (e.target) {
      e.target.value = ''
    }
  }

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index))
  }

  const insertEmoji = (emoji: string) => {
    setContent(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`)
          setShowLocationInput(true)
        },
        () => {
          setShowLocationInput(true)
        }
      )
    } else {
      setShowLocationInput(true)
    }
  }

  if (!session) return null

  return (
    <div className="bg-card/50 backdrop-blur-sm border-b border-border/50">
      <div className="p-6">
        <div className="flex space-x-4">
          {/* Modern User Avatar */}
          <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-accent/20">
            {session.user?.image ? (
              <Image 
                src={session.user.image} 
                alt={session.user.name || 'User'} 
                width={56}
                height={56}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              <User className="w-7 h-7 text-accent" />
            )}
          </div>

          {/* Tweet Form */}
          <form onSubmit={handleSubmit} className="flex-1">
            <div className="mb-6">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Neler oluyor?"
                className="w-full bg-transparent text-lg lg:text-xl text-foreground placeholder:text-muted-foreground 
                         resize-none outline-none min-h-[120px] lg:min-h-[140px] leading-relaxed font-medium"
                maxLength={280}
              />
            </div>

            {/* Location Input */}
            {showLocationInput && (
              <div className="mb-6 p-4 border border-border/50 rounded-2xl bg-surface/30 backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-accent/10 rounded-xl">
                    <MapPin className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Konum ekle</span>
                  <button
                    type="button"
                    onClick={() => setShowLocationInput(false)}
                    className="ml-auto p-2 hover:bg-surface/50 rounded-xl transition-all hover:scale-105 active:scale-95"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Konum girin..."
                  className="w-full bg-transparent text-sm text-foreground outline-none border-b border-border/50 pb-2 
                           focus:border-accent transition-colors placeholder:text-muted-foreground"
                />
              </div>
            )}

            {/* Media Preview */}
            {mediaFiles.length > 0 && (
              <div className="mb-6 grid grid-cols-2 gap-3">
                {mediaFiles.map((media, index) => (
                  <div key={index} className="relative rounded-2xl overflow-hidden border border-border/50 bg-surface/30">
                    <Image
                      src={media.url}
                      alt="Media preview"
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-500 text-white p-2 rounded-xl 
                               transition-all hover:scale-105 active:scale-95 shadow-lg"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="mb-6 p-4 border border-border/50 rounded-2xl bg-surface/30 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">Emoji seç</span>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(false)}
                    className="p-2 hover:bg-surface/50 rounded-xl transition-all hover:scale-105 active:scale-95"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="grid grid-cols-8 gap-2">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => insertEmoji(emoji)}
                      className="p-2 hover:bg-surface/50 rounded-xl text-lg transition-all hover:scale-110 active:scale-95"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tweet Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMediaUpload}
                  accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/webm"
                  multiple
                  className="hidden"
                />
                
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 hover:bg-accent/10 rounded-2xl transition-all hover:scale-105 active:scale-95 group"
                  title="Fotoğraf ekle"
                >
                  <ImageIcon className="w-5 h-5 text-accent group-hover:text-accent/80" />
                </button>
                
                <button 
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-3 hover:bg-accent/10 rounded-2xl transition-all hover:scale-105 active:scale-95 group"
                  title="Emoji ekle"
                >
                  <Smile className="w-5 h-5 text-accent group-hover:text-accent/80" />
                </button>
                
                <button 
                  type="button"
                  className="p-3 hover:bg-accent/10 rounded-2xl transition-all hover:scale-105 active:scale-95 group"
                  title="Takvim"
                >
                  <Calendar className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
                </button>
                
                <button 
                  type="button"
                  onClick={getLocation}
                  className="p-3 hover:bg-accent/10 rounded-2xl transition-all hover:scale-105 active:scale-95 group"
                  title="Konum ekle"
                >
                  <MapPin className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
                </button>
                
                <button 
                  type="button"
                  className="p-3 hover:bg-accent/10 rounded-2xl transition-all hover:scale-105 active:scale-95 group"
                  title="Hashtag"
                >
                  <Hash className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
                </button>
                
                <button 
                  type="button"
                  className="p-3 hover:bg-accent/10 rounded-2xl transition-all hover:scale-105 active:scale-95 group"
                  title="Mention"
                >
                  <AtSign className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
                </button>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-4">
                {/* Character Count Circle */}
                {content.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className={`text-sm font-medium ${
                      content.length > 260 ? 'text-red-500' : 
                      content.length > 240 ? 'text-yellow-500' : 
                      'text-muted-foreground'
                    }`}>
                      {content.length}/280
                    </div>
                    <div className="w-8 h-8 relative">
                      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-surface"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={`${(content.length / 280) * 87.96} 87.96`}
                          className={
                            content.length > 260 ? 'text-red-500' :
                            content.length > 240 ? 'text-yellow-500' :
                            'text-accent'
                          }
                        />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Tweet Button */}
                <button
                  type="submit"
                  disabled={isLoading || (!content.trim() && mediaFiles.length === 0)}
                  className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent 
                           disabled:from-muted-foreground/20 disabled:to-muted-foreground/10 disabled:cursor-not-allowed 
                           text-white font-semibold px-8 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95 
                           shadow-lg shadow-accent/25 disabled:shadow-none flex items-center gap-2
                           focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Tweetle
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
