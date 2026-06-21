'use client'
import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { BookOpen, Target, Clock, Flame, TrendingUp, RefreshCw, CheckCircle2, ChevronRight, Calendar } from 'lucide-react'
import Link from 'next/link'
import { daysUntil } from '@/lib/utils'

export default function Dashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-64 bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-800 rounded-xl" />)}</div>
        <div className="grid md:grid-cols-2 gap-4">{[...Array(2)].map((_, i) => <div key={i} className="h-64 bg-slate-800 rounded-xl" />)}</div>
      </div>
    </div>
  )

  const accuracy = data?.analytics?.totalQuestionsAttempted > 0
    ? Math.round((data.analytics.totalCorrect / data.analytics.totalQuestionsAttempted) * 100) : 0

  const stats = [
    { label: 'Questions Solved', value: data?.analytics?.totalQuestionsAttempted || 0, icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Accuracy', value: `${accuracy}%`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Study Streak', value: `${data?.analytics?.studyStreak || 0} days`, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Topics Mastered', value: `${data?.masteredTopics || 0}/${data?.totalTopics || 0}`, icon: CheckCircle2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ]

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, {data?.user?.name?.split(' ')[0] || 'Aspirant'} 👋</h1>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <p className="text-slate-400 text-sm">GATE {data?.user?.targetExam} · Target: {data?.user?.targetScore} marks</p>
            {data?.user?.targetDate && (
              <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                <Calendar size={11} /> {daysUntil(data.user.targetDate)} days to go
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {data?.dueRevisions > 0 && (
            <Link href="/revision" className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-2 rounded-lg text-sm hover:bg-orange-500/20 transition-all">
              <RefreshCw size={14} />
              {data.dueRevisions} due today
            </Link>
          )}
          <Link href="/tests" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
            Start Test <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-slate-400 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Questions Solved (Last 14 Days)</h3>
          {data?.chartData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="questions" fill="#3b82f6" radius={[3,3,0,0]} name="Attempted" />
                <Bar dataKey="correct" fill="#22c55e" radius={[3,3,0,0]} name="Correct" />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-44 flex items-center justify-center text-slate-500 text-sm">Take tests to see data here</div>}
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Study Hours Trend</h3>
          {data?.chartData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 3 }} name="Hours" />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="h-44 flex items-center justify-center text-slate-500 text-sm">Study sessions will appear here</div>}
        </div>
      </div>

      {/* Subject Progress */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Subject Progress</h3>
          <Link href="/syllabus" className="text-blue-400 text-xs hover:text-blue-300 flex items-center gap-1">View All <ChevronRight size={12} /></Link>
        </div>
        <div className="space-y-3">
          {(data?.subjectProgress || []).filter((s: any) => s.total > 0).slice(0, 8).map((s: any) => (
            <div key={s.id} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-300 truncate">{s.name}</span>
                  <span className="text-xs text-slate-500 ml-2 shrink-0">{s.mastered}/{s.total}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${s.percent}%`, background: s.color }} />
                </div>
              </div>
              <span className="text-xs text-slate-400 w-8 text-right shrink-0">{s.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: '/pyqs', label: 'Practice PYQs', sub: '2014–2024 questions', color: 'from-blue-600 to-blue-700' },
          { href: '/tests', label: 'Take a Test', sub: 'AI or PYQ based', color: 'from-purple-600 to-purple-700' },
          { href: '/revision', label: 'Revision Cards', sub: `${data?.dueRevisions || 0} due today`, color: 'from-orange-600 to-orange-700' },
          { href: '/ai-mentor', label: 'Ask AI Mentor', sub: 'Powered by Gemini', color: 'from-green-600 to-green-700' },
        ].map(({ href, label, sub, color }) => (
          <Link key={href} href={href} className={`bg-gradient-to-br ${color} rounded-xl p-4 hover:opacity-90 transition-all`}>
            <div className="text-sm font-semibold text-white">{label}</div>
            <div className="text-xs text-white/70 mt-0.5">{sub}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
