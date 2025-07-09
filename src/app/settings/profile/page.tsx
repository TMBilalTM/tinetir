'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import TwitterLayout from '@/components/layout/TwitterLayout'
import { TweetProvider } from '@/contexts/TweetContext'
import { ArrowLeft, Camera } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'


interface UserProfile {
  id: string
  name: string | null
  username: string | null
  bio: string | null
  location: string | null
  website: string | null
  image: string | null
  banner: string | null
  verified: boolean
  badges: string[]
  isAdmin: boolean
}

export default function EditProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [bannerImage, setBannerImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
  })

  // Profil bilgilerini yükle
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile/edit')
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
          setFormData({
            name: data.name || '',
            username: data.username || '',
            bio: data.bio || '',
            location: data.location || '',
            website: data.website || '',
          })
        } else {
          console.error('Profil yüklenemedi')
          router.push('/')
        }
      } catch (error) {
        console.error('Profil yükleme hatası:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.id) {
      fetchProfile()
    } else if (!session) {
      router.push('/auth/signin')
    }
  }, [session, router])

  // Profil fotoğrafı seçme
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Dosya boyutu kontrolü (2MB)
      const maxSize = 2 * 1024 * 1024
      if (file.size > maxSize) {
        alert('Profil resmi 2MB\'dan büyük olamaz')
        return
      }
      
      setProfileImage(file)
      const reader = new FileReader()
      reader.onload = () => setProfileImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  // Banner fotoğrafı seçme
  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Dosya boyutu kontrolü (2MB)
      const maxSize = 2 * 1024 * 1024
      if (file.size > maxSize) {
        alert('Banner resmi 2MB\'dan büyük olamaz')
        return
      }
      
      setBannerImage(file)
      const reader = new FileReader()
      reader.onload = () => setBannerImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  // Profil güncelleme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('username', formData.username)
      formDataToSend.append('bio', formData.bio)
      formDataToSend.append('location', formData.location)
      formDataToSend.append('website', formData.website)

      if (profileImage) {
        formDataToSend.append('profileImage', profileImage)
      }

      if (bannerImage) {
        formDataToSend.append('bannerImage', bannerImage)
      }

      const response = await fetch('/api/profile/edit', {
        method: 'PUT',
        body: formDataToSend,
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        
        // Profil sayfasına yönlendir
        router.push(`/${updatedProfile.username || updatedProfile.id}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Profil güncellenemedi')
      }
    } catch (error) {
      console.error('Profil güncelleme hatası:', error)
      alert('Profil güncellenemedi')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <TweetProvider>
        <TwitterLayout>
          <div className="border-x-0 lg:border-x border-gray-200 dark:border-gray-700 min-h-screen bg-white dark:bg-gray-900">
            <div className="p-8 text-center">
              <div className="animate-pulse">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Profil yükleniyor...</p>
              </div>
            </div>
          </div>
        </TwitterLayout>
      </TweetProvider>
    )
  }

  if (!profile) {
    return (
      <TweetProvider>
        <TwitterLayout>
          <div className="border-x-0 lg:border-x border-gray-200 dark:border-gray-700 min-h-screen bg-white dark:bg-gray-900">
            <div className="p-8 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto flex items-center justify-center">
                  <span className="text-2xl">😞</span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Profil bulunamadı</p>
              <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
                Ana sayfaya dön
              </Link>
            </div>
          </div>
        </TwitterLayout>
      </TweetProvider>
    )
  }

  return (
    <TweetProvider>
      <TwitterLayout>
        <div className="border-x-0 lg:border-x border-gray-200 dark:border-gray-700 min-h-screen bg-white dark:bg-gray-900">
          {/* Modern Header */}
          <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 z-10 p-6">
            <div className="flex items-center space-x-4">
              <Link href={`/${profile.username || profile.id}`}>
                <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </div>
              </Link>
              <div>
                <h1 className="font-bold text-xl text-gray-900 dark:text-white">Profili düzenle</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Profilinizi kişiselleştirin</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            {/* Modern Banner */}
            <div className="relative h-48 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
              {bannerImagePreview || profile.banner ? (
                <Image
                  src={bannerImagePreview || profile.banner!}
                  alt="Banner"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700"></div>
              )}
              
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-sm">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleBannerImageChange}
                  className="hidden"
                  id="banner-upload"
                />
                <label
                  htmlFor="banner-upload"
                  className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl hover:bg-white/30 transition-colors cursor-pointer border border-white/20"
                  title="Banner fotoğrafı yükle (Max 2MB)"
                >
                  <Camera className="w-6 h-6 text-white" />
                </label>
              </div>
            </div>

            {/* Modern Profile Image */}
            <div className="relative -mt-16 ml-6 mb-6">
              <div className="relative w-32 h-32">
                {profileImagePreview || profile.image ? (
                  <Image
                    src={profileImagePreview || profile.image!}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full border-4 border-white dark:border-gray-900 shadow-lg"></div>
                )}
                
                <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleProfileImageChange}
                    className="hidden"
                    id="profile-upload"
                  />
                  <label
                    htmlFor="profile-upload"
                    className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors cursor-pointer border border-white/20"
                    title="Profil fotoğrafı yükle (Max 2MB)"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </label>
                </div>
              </div>
            </div>

            {/* Modern Form Fields */}
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">İsim</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                  placeholder="İsminizi girin"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">Kullanıcı adı</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                  placeholder="Kullanıcı adınızı girin"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white resize-none transition-all"
                  placeholder="Kendinizi tanıtın"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">Konum</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                  placeholder="Konumunuzu girin"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                  placeholder="https://..."
                />
              </div>

              {/* Modern Save Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </TwitterLayout>
    </TweetProvider>
  )
}
