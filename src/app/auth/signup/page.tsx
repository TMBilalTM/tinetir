'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

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
    <div className="min-h-screen flex">
      {/* Left Side - Image/Logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white">
          <div className="text-8xl mb-8 font-bold">𝕏</div>
          <h1 className="text-4xl font-bold mb-4">Konuşmaya katıl</h1>
          <p className="text-xl opacity-90">Bugün Twitter&apos;a kaydol.</p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-1/3 left-20 w-24 h-24 bg-white/5 rounded-full"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-black">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="text-6xl font-bold text-white mb-4">𝕏</div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Twitter&apos;a katıl</h2>
            <p className="text-gray-400">Hesap oluşturarak başla</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 flex items-center space-x-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">!</span>
                </div>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-white text-sm font-medium">
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
