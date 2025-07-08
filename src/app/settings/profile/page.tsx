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
          <div className="border-x-0 lg:border-x border-border min-h-screen">
            <div className="p-8 text-center">
              <p className="text-muted">Profil yükleniyor...</p>
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
          <div className="border-x-0 lg:border-x border-border min-h-screen">
            <div className="p-8 text-center">
              <p className="text-muted">Profil bulunamadı</p>
              <Link href="/" className="text-blue-500 hover:underline">
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
        <div className="border-x-0 lg:border-x border-border min-h-screen">
          {/* Header */}
          <div className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-md border-b border-border z-10 p-4">
            <div className="flex items-center space-x-4">
              <Link href={`/${profile.username || profile.id}`}>
                <ArrowLeft className="w-8 h-8 hover:bg-gray-900 rounded-full p-1 transition-colors" />
              </Link>
              <div>
                <h1 className="font-bold text-xl">Profili düzenle</h1>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            {/* Banner */}
            <div className="relative h-48 bg-gray-800">
              {bannerImagePreview || profile.banner ? (
                <Image
                  src={bannerImagePreview || profile.banner!}
                  alt="Banner"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700"></div>
              )}
              
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImageChange}
                  className="hidden"
                  id="banner-upload"
                />
                <label
                  htmlFor="banner-upload"
                  className="bg-black bg-opacity-60 p-3 rounded-full hover:bg-opacity-80 transition-colors cursor-pointer"
                >
                  <Camera className="w-6 h-6" />
                </label>
              </div>
            </div>

            {/* Profile Image */}
            <div className="relative -mt-16 ml-4 mb-4">
              <div className="relative w-32 h-32">
                {profileImagePreview || profile.image ? (
                  <Image
                    src={profileImagePreview || profile.image!}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover border-4 border-black"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-600 rounded-full border-4 border-black"></div>
                )}
                
                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                    id="profile-upload"
                  />
                  <label
                    htmlFor="profile-upload"
                    className="bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-80 transition-colors cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                  </label>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-4 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">İsim</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="İsminizi girin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Kullanıcı adı</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full p-3 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Kullanıcı adınızı girin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full p-3 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Kendinizi tanıtın"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Konum</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-3 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Konumunuzu girin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full p-3 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
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
