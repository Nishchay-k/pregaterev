'use client'
import { useEffect, useState } from 'react'
import { Search, Bookmark, BookmarkCheck, Plus, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Sparkles, Loader2 } from 'lucide-react'

export default function PYQsPage() {
  const [data, setData] = useState<any>({ questions: [], total: 0, pages: 1, subjects: [], years: [] })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', subject: '', year: '', difficulty: '', bookmarked: false })
  const [page, setPage] = useState(1)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<Record<string, number>>({})
  const [selectedMulti, setSelectedMulti] = useState<Record<string, number[]>>({})
  const [natInputs, setNatInputs] = useState<Record<string, string>>({})
  const [generating, setGenerating] = useState(false)
  const [genMsg, setGenMsg] = useState('')

  const load = async (p = page, f = filters) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(p), ...(f.search && { search: f.search }), ...(f.subject && { subject: f.subject }), ...(f.year && { year: f.year }), ...(f.difficulty && { difficulty: f.difficulty }), ...(f.bookmarked && { bookmarked: 'true' }) })
    const res = await fetch(`/api/pyqs?${params}`)
    const d = await res.json()
    setData(d); setLoading(false)
  }

  useEffect(() => { load(1, filters) }, [])

  const applyFilter = (key: string, val: any) => {
    const newF = { ...filters, [key]: val }
    setFilters(newF); setPage(1); load(1, newF); setRevealed(new Set()); setSelected({}); setGenMsg('')
  }

  const toggleBookmark = async (qId: string) => {
    await fetch('/api/pyqs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ questionId: qId, action: 'bookmark' }) })
    setData((prev: any) => ({ ...prev, questions: prev.questions.map((q: any) => q.id === qId ? { ...q, isBookmarked: !q.isBookmarked } : q) }))
  }

  const addRevision = async (qId: string) => {
    await fetch('/api/pyqs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ questionId: qId, action: 'add_revision' }) })
    alert('Added to revision queue!')
  }

  const generateForYear = async () => {
    setGenerating(true); setGenMsg('')
    const res = await fetch('/api/pyqs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'generate_for_year', subjectId: filters.subject, year: filters.year, count: 8 }) })
    const d = await res.json()
    setGenerating(false)
    if (d.error) { setGenMsg(`❌ ${d.error}`); return }
    setGenMsg(`✅ Generated ${d.count} new AI questions for this year/subject.`)
    load(1, filters)
  }

  const opts = ['A', 'B', 'C', 'D']
  const selectedSubject = data.subjects?.find((s: any) => s.id === filters.subject)
  const showGenerateCTA = filters.subject && filters.year && !loading && data.total < 5

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-white">PYQ Library</h1>
        <p className="text-slate-400 text-sm mt-1">GATE CSE (last 5 years) + GATE DA (all years) — AI fills gaps for any year you select</p>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-5 space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={filters.search} onChange={e => applyFilter('search', e.target.value)} placeholder="Search questions..." className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={filters.subject} onChange={e => applyFilter('subject', e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500">
            <option value="">All Subjects</option>
            {data.subjects?.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={filters.year} onChange={e => applyFilter('year', e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500">
            <option value="">All Years</option>
            {data.years?.map((y: number) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={filters.difficulty} onChange={e => applyFilter('difficulty', e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500">
            <option value="">All Levels</option>
            {['Easy', 'Medium', 'Hard'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button onClick={() => applyFilter('bookmarked', !filters.bookmarked)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filters.bookmarked ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400' : 'border-slate-600 text-slate-400 hover:text-white'}`}>
            <Bookmark size={12} /> Bookmarked
          </button>
        </div>
      </div>

      {/* AI Generate CTA when results are thin for a specific year+subject */}
      {showGenerateCTA && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
          <Sparkles size={18} className="text-purple-400 shrink-0" />
          <div className="flex-1 text-sm text-purple-200">
            Only {data.total} question{data.total === 1 ? '' : 's'} found for <strong>{selectedSubject?.name}</strong> in <strong>{filters.year}</strong>.
            {selectedSubject?.exams?.includes('DA') && !selectedSubject?.exams?.includes('CSE') ? '' : ' (GATE CSE PYQs are seeded for 2022–2026 only — older years need AI.)'}
          </div>
          <button onClick={generateForYear} disabled={generating} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-all shrink-0">
            {generating ? <><Loader2 size={13} className="animate-spin" /> Generating...</> : <><Sparkles size={13} /> Generate via AI</>}
          </button>
        </div>
      )}
      {genMsg && <div className="text-xs text-slate-400 mb-4 -mt-2">{genMsg}</div>}

      {/* Question count */}
      <div className="text-xs text-slate-500 mb-4">{data.total} questions found</div>

      {/* Questions */}
      {loading ? (
        <div className="space-y-4 animate-pulse">{[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-slate-800 rounded-xl" />)}</div>
      ) : data.questions?.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No questions found. Try a different filter, or use "Generate via AI" above.</div>
      ) : (
        <div className="space-y-4">
          {data.questions.map((q: any, qi: number) => {
            const isRevealed = revealed.has(q.id)
            const selOpt = selected[q.id]
            const multiSel = selectedMulti[q.id] || []
            const natVal = natInputs[q.id] ?? ''
            const isCorrect = q.questionType === 'MSQ'
              ? [...multiSel].sort((a,b)=>a-b).join(',') === q.correctOptions.split(',').filter(Boolean).map(Number).sort((a,b)=>a-b).join(',')
              : q.questionType === 'NAT'
                ? natVal !== '' && Math.abs(parseFloat(natVal) - q.natAnswer) <= (q.natTolerance || 0.01)
                : selOpt === q.correctOption
            return (
              <div key={q.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {q.year && <span className="text-xs px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 font-medium">GATE {q.year}</span>}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${q.source === 'AI' ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' : 'bg-green-500/15 text-green-300 border-green-500/30'}`}>{q.source === 'AI' ? 'AI' : 'PYQ'}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${q.questionType === 'MSQ' ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' : q.questionType === 'NAT' ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' : 'bg-slate-700/50 text-slate-400 border-slate-600'}`}>{q.questionType}</span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: q.subject?.color + '22', color: q.subject?.color }}>{q.subject?.name?.split(' ')[0]}</span>
                  <span className="text-xs text-slate-500">{q.topic?.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${q.difficulty === 'Easy' ? 'bg-green-500/15 text-green-400' : q.difficulty === 'Hard' ? 'bg-red-500/15 text-red-400' : 'bg-yellow-500/15 text-yellow-400'}`}>{q.difficulty}</span>
                  <span className="text-xs text-slate-600">{q.marks}M</span>
                  <div className="ml-auto flex gap-1.5">
                    <button onClick={() => toggleBookmark(q.id)} className={`p-1.5 rounded-lg transition-all ${q.isBookmarked ? 'text-yellow-400 bg-yellow-500/10' : 'text-slate-500 hover:text-yellow-400 hover:bg-yellow-500/10'}`}>
                      {q.isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                    </button>
                    <button onClick={() => addRevision(q.id)} title="Add to revision" className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Question */}
                <p className="text-slate-200 text-sm mb-3 leading-relaxed">{(qi + 1 + (page - 1) * 12)}. {q.questionText}</p>

                {/* Options */}
                {q.questionType === 'NAT' ? (
                  <div className="mb-3">
                    <input
                      type="number" step="any" inputMode="decimal" disabled={isRevealed}
                      value={natVal}
                      onChange={e => setNatInputs(p => ({ ...p, [q.id]: e.target.value }))}
                      placeholder="Type your numeric answer"
                      className={`w-full sm:w-56 bg-slate-900 border rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none ${isRevealed ? (isCorrect ? 'border-green-500' : 'border-red-500') : 'border-cyan-500/30 focus:border-cyan-400'}`}
                    />
                  </div>
                ) : q.questionType === 'MSQ' ? (
                  <div className="grid sm:grid-cols-2 gap-2 mb-3">
                    {opts.map((opt, i) => {
                      const val = q[`option${opt}`]
                      if (!val) return null
                      const isSel = multiSel.includes(i)
                      const isCorrectOpt = q.correctOptions.split(',').filter(Boolean).map(Number).includes(i)
                      let cls = 'border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-700/30 cursor-pointer'
                      if (isRevealed) {
                        if (isCorrectOpt) cls = 'border-green-500 bg-green-500/10 text-green-300'
                        else if (isSel && !isCorrectOpt) cls = 'border-red-500 bg-red-500/10 text-red-300'
                        else cls = 'border-slate-700 text-slate-500'
                      } else if (isSel) cls = 'border-blue-500 bg-blue-500/10 text-blue-300'
                      return (
                        <button key={opt} onClick={() => !isRevealed && setSelectedMulti(p => { const cur = p[q.id] || []; const next = cur.includes(i) ? cur.filter(x => x !== i) : [...cur, i]; return { ...p, [q.id]: next } })}
                          className={`flex items-start gap-2 p-2.5 rounded-lg border text-left text-xs transition-all ${cls}`}>
                          <span className="w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center text-[9px] font-bold rounded border border-current">{isSel ? '✓' : ''}</span>
                          <span>{val}</span>
                          {isRevealed && isCorrectOpt && <CheckCircle2 size={12} className="text-green-400 ml-auto shrink-0 mt-0.5" />}
                          {isRevealed && isSel && !isCorrectOpt && <XCircle size={12} className="text-red-400 ml-auto shrink-0 mt-0.5" />}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-2 mb-3">
                    {opts.map((opt, i) => {
                      const val = q[`option${opt}`]
                      if (!val) return null
                      const isSel = selOpt === i
                      const isCorrectOpt = i === q.correctOption
                      let cls = 'border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-700/30 cursor-pointer'
                      if (isRevealed) {
                        if (isCorrectOpt) cls = 'border-green-500 bg-green-500/10 text-green-300'
                        else if (isSel && !isCorrectOpt) cls = 'border-red-500 bg-red-500/10 text-red-300'
                        else cls = 'border-slate-700 text-slate-500'
                      } else if (isSel) cls = 'border-blue-500 bg-blue-500/10 text-blue-300'
                      return (
                        <button key={opt} onClick={() => !isRevealed && setSelected(p => ({ ...p, [q.id]: i }))}
                          className={`flex items-start gap-2 p-2.5 rounded-lg border text-left text-xs transition-all ${cls}`}>
                          <span className="font-bold w-4 shrink-0 mt-0.5">{opt}.</span>
                          <span>{val}</span>
                          {isRevealed && isCorrectOpt && <CheckCircle2 size={12} className="text-green-400 ml-auto shrink-0 mt-0.5" />}
                          {isRevealed && isSel && !isCorrectOpt && <XCircle size={12} className="text-red-400 ml-auto shrink-0 mt-0.5" />}
                        </button>
                      )
                    })}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {!isRevealed ? (
                    <button onClick={() => setRevealed(prev => new Set([...prev, q.id]))}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-all">
                      Check Answer
                    </button>
                  ) : (
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {isCorrect ? 'Correct!' : q.questionType === 'MSQ'
                        ? `Correct answer: ${q.correctOptions.split(',').filter(Boolean).map((i: string) => opts[+i]).join(', ')}`
                        : q.questionType === 'NAT'
                          ? `Correct answer: ${q.natAnswer}`
                          : `Correct answer: ${opts[q.correctOption]}`}
                    </div>
                  )}
                </div>

                {isRevealed && q.explanation && (
                  <div className="mt-3 p-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-xs text-slate-300 leading-relaxed">
                    <span className="text-blue-400 font-semibold">Explanation: </span>{q.explanation}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {data.pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button onClick={() => { setPage(p => p - 1); load(page - 1) }} disabled={page === 1} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 text-slate-400 disabled:opacity-40 hover:text-white text-sm">
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-sm text-slate-400">Page {page} of {data.pages}</span>
          <button onClick={() => { setPage(p => p + 1); load(page + 1) }} disabled={page === data.pages} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 text-slate-400 disabled:opacity-40 hover:text-white text-sm">
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
