'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, LayoutDashboard, FileQuestion, ClipboardList, RefreshCw, BarChart2, StickyNote, Bot, Settings, Menu, X, Zap, ChevronDown, Info } from 'lucide-react'

const NAV = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/syllabus', label: 'Syllabus', icon: BookOpen },
  { href: '/pyqs', label: 'PYQs', icon: FileQuestion },
  { href: '/tests', label: 'Tests', icon: ClipboardList },
  { href: '/revision', label: 'Revision', icon: RefreshCw },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/notes', label: 'Notes', icon: StickyNote },
  { href: '/ai-mentor', label: 'AI Mentor', icon: Bot },
  { href: '/about', label: 'About GATE', icon: Info },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function TopNav() {
  const [open, setOpen] = useState(false)
  const [examYear, setExamYear] = useState<string>('')
  const path = usePathname()

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      const dateStr = d.user?.targetDate
      if (dateStr) {
        const year = new Date(dateStr).getFullYear()
        if (!isNaN(year)) setExamYear(String(year))
      }
    }).catch(() => {})
  }, [])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700/50">
        <div className="max-w-screen-2xl mx-auto px-3 h-14 flex items-center gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 mr-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm hidden sm:block">GateForge</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 overflow-x-auto">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = path === href
              return (
                <Link key={href} href={href} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                  <Icon size={13} />
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Tablet Nav (icons only) */}
          <div className="hidden md:flex lg:hidden items-center gap-0.5 flex-1 overflow-x-auto">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = path === href
              return (
                <Link key={href} href={href} title={label} className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                  <Icon size={16} />
                </Link>
              )
            })}
          </div>

          <div className="flex-1 lg:flex-none" />

          {/* GATE Badge — reflects the user's actual target year from Settings */}
          {examYear && (
            <div className="hidden sm:flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5">
              <span className="text-blue-400 text-xs font-bold">GATE {examYear}</span>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button onClick={() => setOpen(true)} className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Sheet */}
      {open && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 rounded-t-2xl pb-safe">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-600" />
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Zap size={14} className="text-white" />
                </div>
                <span className="font-bold text-white">GateForge</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>
            <div className="p-3 grid grid-cols-3 gap-2">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = path === href
                return (
                  <Link key={href} href={href} onClick={() => setOpen(false)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${active ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                    <Icon size={20} />
                    <span className="text-xs font-medium">{label}</span>
                  </Link>
                )
              })}
            </div>
            <div className="h-6" />
          </div>
        </div>
      )}
    </>
  )
}
