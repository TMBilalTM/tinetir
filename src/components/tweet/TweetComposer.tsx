'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { User, Image as ImageIcon, Smile, Calendar, MapPin, Hash, AtSign, X } from 'lucide-react'
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

  // Test için demo resim ekleme - basit versiyon
  const addDemoImage = () => {
    // Farklı demo resimler için random boyutlar ve ID'ler
    const imageIds = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
    const randomId = imageIds[Math.floor(Math.random() * imageIds.length)]
    const demoImageUrl = `https://picsum.photos/400/300?random=${randomId + mediaFiles.length}`
    
    // Maksimum 4 resim limiti
    if (mediaFiles.length < 4) {
      // Boş bir Blob oluştur (File yerine)
      const emptyBlob = new Blob(['demo-image-data'], { type: 'image/jpeg' })
      // Blob'dan File oluştur, bu daha uyumlu
      const file = Object.assign(emptyBlob, {
        name: `demo-${Date.now()}.jpg`,
        lastModified: Date.now(),
      }) as File
      
      setMediaFiles(prev => [...prev, { file, url: demoImageUrl }])
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
    <div className="border-b border-border p-4">
      <div className="flex space-x-3">
        {/* User Avatar */}
        <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
          {session.user?.image ? (
            <Image 
              src={session.user.image} 
              alt={session.user.name || 'User'} 
              width={48}
              height={48}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-6 h-6" />
          )}
        </div>

        {/* Tweet Form */}
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="mb-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Neler oluyor?"
              className="w-full bg-transparent text-lg lg:text-xl placeholder-muted resize-none outline-none min-h-[100px] lg:min-h-[120px]"
              maxLength={280}
            />
          </div>

          {/* Location Input */}
          {showLocationInput && (
            <div className="mb-4 p-3 border border-border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Konum ekle</span>
                <button
                  type="button"
                  onClick={() => setShowLocationInput(false)}
                  className="ml-auto p-1 hover:bg-gray-800 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Konum girin..."
                className="w-full bg-transparent text-sm outline-none border-b border-border pb-1"
              />
            </div>
          )}

          {/* Media Preview */}
          {mediaFiles.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-2">
              {mediaFiles.map((media, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden">
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
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white p-1 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="mb-4 p-3 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Emoji seç</span>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(false)}
                  className="p-1 hover:bg-gray-800 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-8 gap-2">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    className="p-2 hover:bg-gray-800 rounded text-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tweet Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-4 text-accent">
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
                className="hover:bg-accent/10 p-2 rounded-full transition-colors"
              >
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button 
                type="button" 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="hover:bg-accent/10 p-2 rounded-full transition-colors"
              >
                <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button type="button" className="hover:bg-accent/10 p-2 rounded-full transition-colors">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button 
                type="button" 
                onClick={getLocation}
                className="hover:bg-accent/10 p-2 rounded-full transition-colors"
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button type="button" className="hover:bg-accent/10 p-2 rounded-full transition-colors">
                <Hash className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button type="button" className="hover:bg-accent/10 p-2 rounded-full transition-colors">
                <AtSign className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              {/* Demo resim butonu - test için */}
              <button 
                type="button" 
                onClick={addDemoImage}
                className="hover:bg-accent/10 p-2 rounded-full transition-colors text-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                title={`Demo resim ekle (${mediaFiles.length}/4)`}
                disabled={mediaFiles.length >= 4}
              >
                📷+
              </button>
            </div>

            <div className="flex items-center justify-between sm:justify-end space-x-3">
              {/* Character Count */}
              <div className={`text-sm ${content.length > 260 ? 'text-red-500' : 'text-muted'}`}>
                {content.length}/280
              </div>

              {/* Tweet Button */}
              <button
                type="submit"
                disabled={(!content.trim() && mediaFiles.length === 0) || isLoading || content.length > 280}
                className="bg-accent hover:bg-accent-hover disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 sm:px-6 rounded-full transition-colors text-sm sm:text-base"
              >
                {isLoading ? 'Gönderiliyor...' : 'Tweetle'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
