'use client'
import { useEffect, useState } from 'react'
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Clock, BarChart2, Zap } from 'lucide-react'

const STATUS_CYCLE = ['Not Started', 'Learning', 'Practicing', 'Revised', 'Mastered']
const STATUS_COLOR: Record<string, string> = {
  'Not Started': 'text-slate-500', 'Learning': 'text-blue-400', 'Practicing': 'text-yellow-400', 'Revised': 'text-purple-400', 'Mastered': 'text-green-400'
}
const DIFF_COLOR: Record<string, string> = { Easy: 'bg-green-500/15 text-green-400', Medium: 'bg-yellow-500/15 text-yellow-400', Hard: 'bg-red-500/15 text-red-400' }
const TABS = ['Unified', 'CSE Only', 'DA Only', 'Compare']

export default function SyllabusPage() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState('All')
  const [updating, setUpdating] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/syllabus').then(r => r.json()).then(d => { setSubjects(d.subjects || []); setLoading(false) })
  }, [])

  const toggle = (id: string) => setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const updateStatus = async (topicId: string, current: string) => {
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length]
    setUpdating(prev => new Set([...prev, topicId]))
    setSubjects(prev => prev.map(s => ({ ...s, topics: s.topics.map((t: any) => t.id === topicId ? { ...t, status: next } : t) })))
    await fetch('/api/syllabus', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topicId, status: next }) })
    setUpdating(prev => { const n = new Set(prev); n.delete(topicId); return n })
  }

  const filterSubjects = (subs: any[]) => {
    let filtered = subs
    if (tab === 1) filtered = subs.filter(s => s.exams === 'CSE' || s.exams.includes('CSE'))
    if (tab === 2) filtered = subs.filter(s => s.exams === 'DA' || s.exams.includes('DA'))
    if (tab === 0 && filter !== 'All') {
      if (filter === 'Common') filtered = subs.filter(s => s.exams.includes('CSE') && s.exams.includes('DA'))
      else if (filter === 'CSE') filtered = subs.filter(s => s.exams === 'CSE' || (s.exams.includes('CSE') && !s.exams.includes('DA')))
      else if (filter === 'DA') filtered = subs.filter(s => s.exams === 'DA' || (s.exams.includes('DA') && !s.exams.includes('CSE')))
    }
    return filtered
  }

  const getExamBadge = (exams: string) => {
    const both = exams.includes('CSE') && exams.includes('DA')
    if (both) return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">BOTH</span>
    if (exams.includes('DA')) return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">DA</span>
    return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">CSE</span>
  }

  const SubjectList = ({ subs }: { subs: any[] }) => (
    <div className="space-y-3">
      {subs.map(s => {
        const total = s.topics.length
        const mastered = s.topics.filter((t: any) => t.status === 'Mastered').length
        const pct = total > 0 ? Math.round((mastered / total) * 100) : 0
        const isOpen = expanded.has(s.id)
        return (
          <div key={s.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <button onClick={() => toggle(s.id)} className="w-full flex items-center gap-3 p-4 hover:bg-slate-800 transition-all text-left">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white text-sm">{s.name}</span>
                  {getExamBadge(s.exams)}
                  <span className="text-xs text-slate-500">{mastered}/{total} mastered</span>
                </div>
                <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden w-full max-w-xs">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: s.color }} />
                </div>
              </div>
              <span className="text-xs text-slate-400 shrink-0">{pct}%</span>
              {isOpen ? <ChevronDown size={16} className="text-slate-500 shrink-0" /> : <ChevronRight size={16} className="text-slate-500 shrink-0" />}
            </button>
            {isOpen && (
              <div className="border-t border-slate-700/50 divide-y divide-slate-700/30">
                {s.topics.map((t: any) => (
                  <div key={t.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/20 transition-all">
                    <button onClick={() => updateStatus(t.id, t.status)} disabled={updating.has(t.id)} className="shrink-0 transition-all hover:scale-110">
                      {t.status === 'Mastered'
                        ? <CheckCircle2 size={18} className="text-green-400" />
                        : <Circle size={18} className={STATUS_COLOR[t.status] || 'text-slate-600'} />}
                    </button>
                    <span className="flex-1 text-sm text-slate-300 min-w-0 truncate">{t.name}</span>
                    {getExamBadge(t.exams)}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${DIFF_COLOR[t.difficulty]}`}>{t.difficulty}</span>
                    <div className="hidden sm:flex items-center gap-1 text-slate-500 text-xs shrink-0">
                      <Clock size={10} /> {t.estimatedHours}h
                    </div>
                    <div className="hidden sm:flex items-center gap-1 text-slate-500 text-xs shrink-0">
                      <BarChart2 size={10} /> {t.weightage}%
                    </div>
                    <span className={`text-xs shrink-0 ${STATUS_COLOR[t.status]}`}>{t.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  const filteredSubs = filterSubjects(subjects)
  const cseSubs = subjects.filter(s => s.exams === 'CSE' || s.exams.includes('CSE'))
  const daSubs = subjects.filter(s => s.exams === 'DA' || s.exams.includes('DA'))

  if (loading) return (
    <div className="p-6 max-w-5xl mx-auto space-y-3 animate-pulse">
      {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-slate-800 rounded-xl" />)}
    </div>
  )

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Syllabus Tracker</h1>
        <p className="text-slate-400 text-sm mt-1">Click a topic status to cycle through: Not Started → Learning → Practicing → Revised → Mastered</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-1 mb-4 flex-wrap">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className={`flex-1 min-w-[80px] py-2 px-3 rounded-lg text-xs font-medium transition-all ${tab === i ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Unified filter */}
      {tab === 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {['All', 'CSE', 'DA', 'Common'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${filter === f ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-600 text-slate-400 hover:text-white hover:border-slate-500'}`}>
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Stats bar */}
      {tab !== 3 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Total Topics', val: filteredSubs.reduce((a, s) => a + s.topics.length, 0) },
            { label: 'In Progress', val: filteredSubs.reduce((a, s) => a + s.topics.filter((t: any) => ['Learning','Practicing','Revised'].includes(t.status)).length, 0) },
            { label: 'Mastered', val: filteredSubs.reduce((a, s) => a + s.topics.filter((t: any) => t.status === 'Mastered').length, 0) },
          ].map(({ label, val }) => (
            <div key={label} className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-white">{val}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {tab === 3 ? (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold px-2 py-1 rounded">CSE</span>
              <span className="text-sm font-medium text-white">GATE Computer Science</span>
            </div>
            <SubjectList subs={cseSubs} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-bold px-2 py-1 rounded">DA</span>
              <span className="text-sm font-medium text-white">GATE Data Science & AI</span>
            </div>
            <SubjectList subs={daSubs} />
          </div>
        </div>
      ) : (
        <SubjectList subs={filteredSubs} />
      )}
    </div>
  )
}
