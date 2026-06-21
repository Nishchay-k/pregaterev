import type { Metadata, Viewport } from 'next'
import './globals.css'
import TopNav from '@/components/nav/TopNav'

export const metadata: Metadata = {
  title: 'GateForge — GATE CSE & DA Prep',
  description: 'Complete GATE preparation: syllabus tracker, PYQs, AI tests, spaced revision, analytics.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GateForge',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <TopNav />
        <main className="pt-14 min-h-screen">{children}</main>
      </body>
    </html>
  )
}
