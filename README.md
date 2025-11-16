# 𝕏 Twitter Clone

A fully functional, modern Twitter/X clone built with **Next.js**, **TypeScript**, **Prisma**, and **Tailwind CSS**.  
Designed to replicate the core experience of X — fast, responsive, and real-time.

## 🚀 Features

- 🔐 **User Authentication** (NextAuth.js)
- 📝 **Create / Edit / Delete Tweets**
- ❤️ **Likes** & 🔁 **Retweets**
- 💬 **Replies & Thread System**
- 👤 **User Profiles**
- ➕ **Follow / Unfollow**
- ⚡ **Real-time Feed Updates**
- 📱 **Fully Responsive UI**
- 🎨 **Twitter-like UI/UX**
- 🌐 **Open-source friendly**

## 🛠️ Tech Stack

### **Frontend**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

### **Backend**
- Prisma ORM  
- SQLite (development) / PostgreSQL (production)

### **Auth**
- NextAuth.js

### **State Management**
- React Context

### **Other**
- React Hook Form + Zod  
- Lucide Icons  
- date-fns  

---

## 📦 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd tinetir
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set environment variables
Create a **.env** file:
```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

### 5. Start development server
```bash
npm run dev
```

Now visit:  
➡️ **http://localhost:3000**

---

## 🎯 Usage Guide

- 🆕 Sign up via **/auth/signup**  
- 🔑 Log in using **/auth/signin**  
- 📝 Post tweets from the Home feed  
- ❤️ Interact with tweets (like, retweet, reply)  
- 🙋 View profiles & follow other users  
- 📊 Explore trending topics on the right sidebar  

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/               # API routes
│   ├── auth/              # Auth pages
│   └── globals.css        # Global styles
├── components/
│   ├── layout/            # Layout components
│   ├── tweet/             # Tweet UI components
│   └── providers/         # Context providers
├── lib/
│   ├── auth.ts            # NextAuth config
│   └── prisma.ts          # Prisma client
└── types/                 # TypeScript types
```

---

## 🗄️ Database Models

- **User** — Profile info, username, avatar  
- **Tweet** — Main tweet content  
- **Like** — Relationship table for likes  
- **Retweet** — Retweet records  
- **Reply** — Reply/Thread system  
- **Follow** — Follower/following relationships  

---

## 🚀 Deployment

### **Vercel (Recommended)**
1. Push your repo to GitHub  
2. Import the project on Vercel  
3. Add environment variables  
4. Use Vercel PostgreSQL  

### Other Platforms  
- Railway  
- PlanetScale  
- Render  
- Netlify (with serverless functions)  

---

## 🤝 Contributing

1. Fork the repo  
2. Create a feature branch  
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes  
   ```bash
   git commit -m "Add amazing feature"
   ```
4. Push your branch  
   ```bash
   git push origin feature/amazing-feature
   ```
5. Submit a Pull Request  

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 📞 Contact

For questions or feedback, feel free to open an issue.

---

⭐ If you like this project, consider giving it a star!

## Images
<img width="1908" height="859" alt="image" src="https://github.com/user-attachments/assets/21bd4bd9-784e-4800-b9ca-7ae51e683aed" />
<img width="755" height="831" alt="image" src="https://github.com/user-attachments/assets/ff5ae236-a5c7-4c65-a6e0-4b5f81bb7341" />
<img width="852" height="784" alt="image" src="https://github.com/user-attachments/assets/f4880459-23b8-4826-8306-27a39a052b97" />


