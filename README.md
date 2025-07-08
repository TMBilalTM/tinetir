# 𝕏 Twitter Clone

Bu proje, Twitter/X'in tam bir klonudur. Next.js, TypeScript, Prisma ve Tailwind CSS kullanılarak geliştirilmiştir.

## 🚀 Özellikler

- ✅ Kullanıcı kaydı ve giriş sistemi (NextAuth.js)
- ✅ Tweet oluşturma, düzenleme ve silme
- ✅ Beğeni ve retweet sistemi
- ✅ Gerçek zamanlı tweet akışı
- ✅ Kullanıcı profilleri ve takip sistemi
- ✅ Responsive tasarım (mobil uyumlu)
- ✅ Twitter/X benzeri arayüz ve UX
- ✅ Ücretsiz açık kaynak kütüphaneler

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Veritabanı**: Prisma ORM + SQLite (geliştirme) / PostgreSQL (prodüksiyon)
- **Authentication**: NextAuth.js
- **State Management**: React Context
- **İkonlar**: Lucide React
- **Form Yönetimi**: React Hook Form + Zod
- **Tarih**: date-fns

## 📦 Kurulum

1. Depoyu klonlayın:
```bash
git clone <repository-url>
cd tinetir
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Ortam değişkenlerini ayarlayın:
```bash
# .env dosyasında
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. Veritabanını oluşturun:
```bash
npx prisma generate
npx prisma db push
```

5. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

6. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 🎯 Kullanım

1. **Hesap Oluşturma**: `/auth/signup` sayfasından yeni hesap oluşturun
2. **Giriş Yapma**: `/auth/signin` sayfasından giriş yapın
3. **Tweet Atma**: Ana sayfada tweet composer'ı kullanarak tweet atın
4. **Etkileşim**: Tweet'leri beğenin, retweet yapın ve yanıtlayın
5. **Keşfet**: Sağ sidebar'dan gündem ve önerilen kullanıcıları görün

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API route'ları
│   ├── auth/              # Authentication sayfaları
│   └── globals.css        # Global stiller
├── components/            # React bileşenleri
│   ├── layout/           # Layout bileşenleri
│   ├── tweet/            # Tweet ile ilgili bileşenler
│   └── providers/        # Context provider'ları
├── lib/                  # Utility fonksiyonları
│   ├── auth.ts          # NextAuth konfigürasyonu
│   └── prisma.ts        # Prisma client
└── types/               # TypeScript tip tanımları
```

## 🗄️ Veritabanı Modeli

- **User**: Kullanıcı bilgileri
- **Tweet**: Tweet içerikleri
- **Like**: Beğeni ilişkileri
- **Retweet**: Retweet ilişkileri
- **Reply**: Yanıt sistemi
- **Follow**: Takip sistemi

## 🚀 Deployment

### Vercel (Önerilen)

1. GitHub'a push yapın
2. Vercel'e bağlayın
3. Ortam değişkenlerini ayarlayın
4. PostgreSQL veritabanı ekleyin

### Diğer Platformlar

- Railway
- PlanetScale
- Heroku
- Netlify

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Branch'i push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje ile ilgili sorularınız için issue açabilirsiniz.

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
