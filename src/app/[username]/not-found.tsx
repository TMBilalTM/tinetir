import TwitterLayout from '@/components/layout/TwitterLayout'
import { TweetProvider } from '@/contexts/TweetContext'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <TweetProvider>
      <TwitterLayout>
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-8xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Bu sayfa mevcut değil
          </h2>
          <p className="text-gray-600 mb-8">
            Aradığınız sayfa bulunamadı, silinmiş olabilir ya da yanlış bir URL girmiş olabilirsiniz.
          </p>
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Ana Sayfaya Dön
            </Link>
            <div className="text-sm text-gray-500">
              <p>Yardıma mı ihtiyacınız var?</p>
              <Link href="/help" className="text-blue-500 hover:underline">
                Yardım Merkezi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </TwitterLayout>
    </TweetProvider>
  )
}
