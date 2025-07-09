'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Sparkles, UserPlus, Info } from 'lucide-react'

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/auth/signin?message=Hesap oluşturuldu')
      } else {
        const data = await response.json()
        setError(data.error || 'Kayıt işlemi başarısız')
      }
    } catch {
      setError('Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-surface/20 to-background">
      {/* Left Side - Modern Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 items-center justify-center relative overflow-hidden backdrop-blur-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent"></div>
        
        {/* Decorative Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-60 h-60 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-md">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-accent/25">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4 leading-tight">
              Konuşmaya katıl
            </h1>
            <p className="text-xl text-muted-foreground mb-8">Bugün Tinetir&apos;e kaydol.</p>
          </div>
          
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Ücretsiz hesap</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Anında katılım</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Global erişim</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Modern Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-accent/25">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Tinetir</h1>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-3">Hesap oluştur</h2>
            <p className="text-muted-foreground">Topluluğa katıl ve paylaşımlarını yap</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-red-500 text-sm font-bold">!</span>
                  </div>
                  <p className="text-red-500 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-3">
              <label htmlFor="name" className="block text-foreground text-sm font-semibold">
                Ad Soyad
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-600"
                  placeholder="Ad ve soyadınız"
                  required
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-white text-sm font-medium">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                  @
                </span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-600"
                  placeholder="kullaniciadi"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-white text-sm font-medium">
                E-posta
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-600"
                  placeholder="E-posta adresiniz"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-white text-sm font-medium">
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-600 pr-12"
                  placeholder="Şifreniz (en az 6 karakter)"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-400">
                Şifreniz en az 6 karakter olmalıdır
              </p>
            </div>

            {/* Terms */}
            <div className="text-xs text-gray-400 leading-relaxed">
              Kaydolarak{' '}
              <a href="#" className="text-blue-400 hover:underline">Hizmet Şartları</a> ve{' '}
              <a href="#" className="text-blue-400 hover:underline">Gizlilik Politikası</a>&apos;nı
              kabul etmiş olursunuz. Çerez kullanımı dahil.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.name || !formData.email || !formData.username || !formData.password}
              className="w-full bg-white text-black font-bold py-4 px-6 rounded-xl hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span>Hesap oluşturuluyor...</span>
                </div>
              ) : (
                'Hesap Oluştur'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black text-gray-400">veya</span>
              </div>
            </div>

            {/* Alternative Sign Up Methods */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full border border-gray-700 text-white font-medium py-3 px-6 rounded-xl hover:bg-gray-900/50 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Google ile kaydol</span>
              </button>
              
              <button
                type="button"
                className="w-full border border-gray-700 text-white font-medium py-3 px-6 rounded-xl hover:bg-gray-900/50 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Apple ile kaydol</span>
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Zaten hesabın var mı?{' '}
              <Link 
                href="/auth/signin" 
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline"
              >
                Giriş yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
