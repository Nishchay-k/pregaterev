# 🚀 GateForge — GATE CSE & DA Preparation Platform

A complete GATE preparation web app with syllabus tracker, PYQ library, AI-powered test generation, spaced revision, analytics, and AI mentor chat.

## ✨ Features
- **Unified Syllabus Tracker** — CSE + DA in one place, 4 views (Unified, CSE, DA, Compare)
- **PYQ Library** — 2014–2024 questions with filters, instant answer checking, bookmarks
- **Test System** — Custom tests from PYQs or AI-generated via Gemini
- **Spaced Revision** — SM-2 algorithm flashcards, wrong answers auto-added
- **Analytics** — Accuracy trends, study hours, test history
- **Notes** — Markdown notes with tags and pin
- **AI Mentor** — Gemini-powered GATE tutor chat
- **Horizontal Top Nav** — Mobile-first with bottom sheet drawer

## 🛠️ Tech Stack
- **Next.js 14** (App Router) + TypeScript
- **Prisma** + **SQLite** (zero-config local database)
- **Tailwind CSS** for styling
- **Recharts** for charts
- **Google Gemini API** (free tier, optional)

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up database
```bash
npx prisma db push
```

### 3. Seed with GATE data
```bash
npm run db:seed
```

### 4. (Optional) Add Gemini API key
Get a free key at https://aistudio.google.com/ then edit `.env.local`:
```
GEMINI_API_KEY=your_key_here
```

### 5. Start development server
```bash
npm run dev
```

Open http://localhost:3000

## 📦 Deploy to Vercel (Free)

1. Push this folder to a GitHub repo
2. Go to https://vercel.com → New Project → Import your repo
3. Add environment variable: `DATABASE_URL=file:./dev.db`
4. Add `GEMINI_API_KEY` if you have one
5. Deploy!

> **Note:** For production with Vercel, switch to Supabase PostgreSQL:
> - Create free project at supabase.com
> - Copy the connection string as `DATABASE_URL`
> - Update `prisma/schema.prisma` provider from `sqlite` to `postgresql`

## 📁 Project Structure
```
gateforge/
├── app/              # Next.js App Router pages
│   ├── api/          # API routes (dashboard, syllabus, pyqs, tests, etc.)
│   ├── page.tsx      # Dashboard
│   ├── syllabus/     # Unified syllabus tracker
│   ├── pyqs/         # PYQ library
│   ├── tests/        # Test system
│   ├── revision/     # Spaced repetition
│   ├── analytics/    # Performance analytics
│   ├── notes/        # Study notes
│   ├── ai-mentor/    # AI chat
│   └── settings/     # Profile settings
├── components/
│   └── nav/          # TopNav + mobile drawer
├── lib/
│   ├── prisma.ts     # DB client
│   ├── sm2.ts        # Spaced repetition algorithm
│   ├── gemini.ts     # Gemini AI wrapper
│   └── utils.ts      # Utilities
├── prisma/
│   ├── schema.prisma # Database schema
│   └── seed.ts       # GATE data seed
└── .env.local        # Environment variables
```

## 🎯 Subjects Covered

### GATE CSE (11 subjects)
Engineering Mathematics, Digital Logic, Computer Organization, Programming & DS, Algorithms, Theory of Computation, Compiler Design, Operating Systems, Databases, Computer Networks, Software Engineering

### GATE DA (10 subjects)  
Engineering Mathematics, Programming & DS, Machine Learning, Deep Learning, Artificial Intelligence, Database Management, Probability & Statistics, Linear Algebra, Calculus, Data Visualization

> Shared subjects (Linear Algebra, Probability, DS, Algorithms) appear in both streams tagged with [BOTH]

## 📝 Default Login
The app uses a single demo user: `demo@gateforge.com` — no login required for local use.
