'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Sparkles, Info } from 'lucide-react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Geçersiz e-posta veya şifre')
      } else {
        await getSession()
        router.push('/')
      }
    } catch {
      setError('Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
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
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4 leading-tight">
              Dünyada olup bitenler
            </h1>
            <p className="text-xl text-muted-foreground mb-8">Hemen katıl ve keşfet.</p>
          </div>
          
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Gerçek zamanlı güncellemeler</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Global topluluk</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Güvenli platform</span>
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
            <h2 className="text-3xl font-bold text-foreground mb-3">Hoş geldin!</h2>
            <p className="text-muted-foreground">Hesabına giriş yaparak devam et</p>
          </div>

          {/* Demo Alert */}
          <div className="bg-accent/5 border border-accent/20 rounded-3xl p-6 mb-6 backdrop-blur-sm">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-accent font-semibold text-sm mb-2">Developed by BilalTM</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                  Tinetir KKTC sosyal medya platformunun demo sürümüdür. Herhangi bir e-posta ile giriş yapabilirsiniz.
                </p>
                <p className="text-accent text-sm font-medium">
                  Örnek: demo@example.com
                </p>
              </div>
            </div>
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

            {/* Email Field */}
            <div className="space-y-3">
              <label htmlFor="email" className="block text-foreground text-sm font-semibold">
                E-posta
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-surface/50 border border-border rounded-2xl text-foreground 
                           placeholder:text-muted-foreground focus:ring-2 focus:ring-accent/20 focus:border-accent 
                           outline-none transition-all hover:bg-surface/70 backdrop-blur-sm"
                  placeholder="E-posta adresinizi girin"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label htmlFor="password" className="block text-foreground text-sm font-semibold">
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-surface/50 border border-border rounded-2xl text-foreground 
                           placeholder:text-muted-foreground focus:ring-2 focus:ring-accent/20 focus:border-accent 
                           outline-none transition-all hover:bg-surface/70 backdrop-blur-sm pr-14"
                  placeholder="Şifrenizi girin"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-muted-foreground 
                           hover:text-accent transition-colors rounded-xl hover:bg-accent/10"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button type="button" className="text-accent hover:text-accent/80 text-sm font-medium transition-colors hover:underline">
                Şifreni mi unuttun?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent 
                       text-white font-semibold py-4 px-6 rounded-2xl transition-all 
                       hover:scale-105 active:scale-95 disabled:from-muted-foreground/20 disabled:to-muted-foreground/10 
                       disabled:cursor-not-allowed shadow-lg shadow-accent/25 disabled:shadow-none
                       focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Giriş yapılıyor...</span>
                </div>
              ) : (
                'Giriş Yap'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground font-medium">veya</span>
              </div>
            </div>

            {/* Alternative Login Methods */}
            <div className="space-y-4">
              <button
                type="button"
                className="w-full border border-border bg-surface/30 hover:bg-surface/50 text-foreground font-semibold 
                         py-4 px-6 rounded-2xl transition-all hover:scale-105 active:scale-95 backdrop-blur-sm
                         flex items-center justify-center space-x-3"
              >
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <span>Google ile devam et</span>
              </button>
              
              <button
                type="button"
                className="w-full border border-border bg-surface/30 hover:bg-surface/50 text-foreground font-semibold 
                         py-4 px-6 rounded-2xl transition-all hover:scale-105 active:scale-95 backdrop-blur-sm
                         flex items-center justify-center space-x-3"
              >
                <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">🍎</span>
                </div>
                <span>Apple ile devam et</span>
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Hesabın yok mu?{' '}
              <Link 
                href="/auth/signup" 
                className="text-accent hover:text-accent/80 font-semibold transition-colors hover:underline"
              >
                Hemen kaydol
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground/70">
            <p>Bu sayfa reCAPTCHA tarafından korunmaktadır ve Google</p>
            <p className="mt-1">
              <a href="#" className="hover:text-accent transition-colors hover:underline">Gizlilik Politikası</a> ve{' '}
              <a href="#" className="hover:text-accent transition-colors hover:underline">Hizmet Şartları</a> geçerlidir.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
