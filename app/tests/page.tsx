'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Play, Clock, CheckCircle2, XCircle, ChevronRight, Zap, BookOpen, RotateCcw, Flag, ListChecks, Layers, Target, Globe } from 'lucide-react'

type Phase = 'setup' | 'active' | 'report'
type TestType = 'Topic Test' | 'Subject Test' | 'Full Mock'
const MIN_PER_Q = 2.5 // average GATE minutes-per-question used for auto-linking count <-> duration

export default function TestsPage() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [subjects, setSubjects] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [form, setForm] = useState<{ type: TestType; exam: string; subjectIds: string[]; topicIds: string[]; duration: number; questionCount: number }>({
    type: 'Topic Test', exam: 'CSE', subjectIds: [], topicIds: [], duration: 38, questionCount: 15
  })
  const [test, setTest] = useState<any>(null)
  const [attempt, setAttempt] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [answers, setAnswers] = useState<Record<string, { selectedOption: number | null; selectedOptions: number[]; natValue: string; timeSpent: number; marked: boolean }>>({})
  const [current, setCurrent] = useState(0)
  const [timeLeft, setTimeLeft] = useState(3600)
  const [report, setReport] = useState<any>(null)
  const [creating, setCreating] = useState(false)
  const [showNav, setShowNav] = useState(false)

  useEffect(() => {
    fetch('/api/syllabus').then(r => r.json()).then(d => setSubjects(d.subjects || []))
    fetch('/api/tests').then(r => r.json()).then(d => setHistory(d.attempts || []))
  }, [])

  useEffect(() => {
    if (phase !== 'active') return
    const t = setInterval(() => setTimeLeft(p => { if (p <= 1) { clearInterval(t); submitTest(); return 0 } return p - 1 }), 1000)
    return () => clearInterval(t)
  }, [phase])

  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const onCountChange = (val: number) => {
    const safe = Math.max(1, Math.min(100, val))
    const suggestedDuration = Math.max(5, Math.round((safe * MIN_PER_Q) / 5) * 5)
    setForm(p => ({ ...p, questionCount: safe, duration: suggestedDuration }))
  }
  const onDurationChange = (val: number) => {
    const safe = Math.max(5, Math.min(300, val))
    const suggestedCount = Math.max(1, Math.round(safe / MIN_PER_Q))
    setForm(p => ({ ...p, duration: safe, questionCount: suggestedCount }))
  }

  // Test Type drives the whole flow — switching type resets the subject/topic selection appropriately
  const onTypeChange = (newType: TestType) => {
    setForm(p => {
      const cameFromFullMock = p.type === 'Full Mock'
      if (newType === 'Full Mock') return { ...p, type: newType, subjectIds: [], topicIds: [], questionCount: 65, duration: 180 }
      const resetCounts = cameFromFullMock ? { questionCount: 15, duration: 38 } : {}
      if (newType === 'Subject Test') return { ...p, type: newType, topicIds: [], ...resetCounts }
      return { ...p, type: newType, subjectIds: p.subjectIds.slice(0, 1), topicIds: [], ...resetCounts }
    })
  }

  const toggleSubject = (subjectId: string) => {
    if (form.type === 'Topic Test') {
      // Single-select: picking a subject replaces the previous one
      setForm(p => ({ ...p, subjectIds: p.subjectIds[0] === subjectId ? [] : [subjectId], topicIds: [] }))
    } else {
      setForm(p => {
        const has = p.subjectIds.includes(subjectId)
        return { ...p, subjectIds: has ? p.subjectIds.filter(id => id !== subjectId) : [...p.subjectIds, subjectId] }
      })
    }
  }

  const toggleTopic = (topicId: string) => {
    setForm(p => {
      const has = p.topicIds.includes(topicId)
      return { ...p, topicIds: has ? p.topicIds.filter(id => id !== topicId) : [...p.topicIds, topicId] }
    })
  }

  const examSubjects = subjects.filter(s => s.exams?.includes(form.exam))
  const topics = subjects.find(s => form.subjectIds.includes(s.id))?.topics || []

  const canStart = form.type === 'Full Mock'
    ? true
    : form.type === 'Topic Test'
      ? form.subjectIds.length > 0 && form.topicIds.length > 0
      : form.subjectIds.length > 0

  const createTest = async () => {
    setCreating(true)
    const finalSubjectIds = form.type === 'Full Mock' ? examSubjects.map(s => s.id) : form.subjectIds
    const finalTopicIds = form.type === 'Topic Test' ? form.topicIds : []

    const res = await fetch('/api/tests', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', type: form.type, exam: form.exam, duration: form.duration, questionCount: form.questionCount, subjectIds: finalSubjectIds, topicIds: finalTopicIds })
    })
    const d = await res.json()
    if (!d.test) { alert(d.error || 'Failed to create test'); setCreating(false); return }
    if (d.meta?.message) {
      alert(`ℹ️ ${d.meta.message}\n\nUsing ${d.meta.pyqCount} fresh PYQ${d.meta.pyqCount === 1 ? '' : 's'}${d.meta.aiCount ? ` + ${d.meta.aiCount} AI-generated` : ''}${d.meta.repeatedCount ? ` + ${d.meta.repeatedCount} repeated` : ''}.`)
    }
    const startRes = await fetch('/api/tests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'start', testId: d.test.id }) })
    const startD = await startRes.json()
    const qRes = await fetch(`/api/tests?testId=${d.test.id}`)
    const qD = await qRes.json()
    setTest(qD.test); setAttempt(startD.attempt); setQuestions(qD.questions || [])
    setAnswers(Object.fromEntries((qD.questions || []).map((q: any) => [q.id, { selectedOption: null, selectedOptions: [], natValue: '', timeSpent: 0, marked: false }])))
    setTimeLeft(form.duration * 60); setCreating(false); setPhase('active')
  }

  const submitTest = async () => {
    const timeSpent = form.duration * 60 - timeLeft
    const ansArr = Object.entries(answers).map(([questionId, a]) => ({ questionId, selectedOption: a.selectedOption, selectedOptions: a.selectedOptions, natValue: a.natValue, timeSpent: a.timeSpent }))
    const res = await fetch('/api/tests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'submit', attemptId: attempt.id, answers: ansArr, timeSpent }) })
    const d = await res.json()
    const rRes = await fetch(`/api/tests?testId=${test.id}&attemptId=${attempt.id}`)
    const rD = await rRes.json()
    setReport({ ...d, attempt: rD.attempt }); setPhase('report')
    fetch('/api/tests').then(r => r.json()).then(d => setHistory(d.attempts || []))
  }

  const q = questions[current]
  const opts = ['A', 'B', 'C', 'D']

  if (phase === 'active' && q) return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col" style={{ top: 56 }}>
      <div className="bg-slate-900 border-b border-slate-700 px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-slate-500">{test?.name}</div>
          <div className="text-xs text-slate-400">{current + 1} / {questions.length}</div>
        </div>
        <div className={`flex items-center gap-1.5 font-mono font-bold text-sm px-3 py-1.5 rounded-lg ${timeLeft < 300 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-white'}`}>
          <Clock size={13} /> {fmtTime(timeLeft)}
        </div>
        <button onClick={() => setShowNav(!showNav)} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs">Grid</button>
        <button onClick={submitTest} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium">Submit</button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/15 text-blue-400">{q.subject?.name?.split(' ')[0]}</span>
              <span className="text-xs text-slate-500">{q.topic?.name}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${q.questionType === 'MSQ' ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' : q.questionType === 'NAT' ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' : 'bg-slate-700/50 text-slate-400 border-slate-600'}`}>{q.questionType}</span>
              <span className={`text-xs ml-auto ${q.marks === 2 ? 'text-purple-400' : 'text-slate-500'}`}>{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed mb-1">Q{current + 1}. {q.questionText}</p>
            {q.questionType === 'MSQ' && <p className="text-[11px] text-purple-400 mb-3">Select ALL correct options — no negative marking.</p>}
            {q.questionType === 'NAT' && <p className="text-[11px] text-cyan-400 mb-3">Type your numeric answer — no negative marking.</p>}
            {q.questionType !== 'MSQ' && q.questionType !== 'NAT' && <div className="mb-4" />}

            {q.questionType === 'NAT' ? (
              <input
                type="number" step="any" inputMode="decimal"
                value={answers[q.id]?.natValue ?? ''}
                onChange={e => setAnswers(p => ({ ...p, [q.id]: { ...p[q.id], natValue: e.target.value } }))}
                placeholder="Enter numeric answer"
                className="w-full sm:w-64 bg-slate-900 border border-cyan-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            ) : (
              <div className="space-y-2">
                {opts.map((opt, i) => {
                  const val = q[`option${opt}`]; if (!val) return null
                  const isMSQ = q.questionType === 'MSQ'
                  const isSel = isMSQ ? (answers[q.id]?.selectedOptions || []).includes(i) : answers[q.id]?.selectedOption === i
                  const onPick = () => {
                    if (isMSQ) {
                      setAnswers(p => {
                        const cur = p[q.id]?.selectedOptions || []
                        const next = cur.includes(i) ? cur.filter(x => x !== i) : [...cur, i]
                        return { ...p, [q.id]: { ...p[q.id], selectedOptions: next } }
                      })
                    } else {
                      setAnswers(p => ({ ...p, [q.id]: { ...p[q.id], selectedOption: i } }))
                    }
                  }
                  return (
                    <button key={opt} onClick={onPick}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left text-sm transition-all ${isSel ? 'border-blue-500 bg-blue-500/10 text-blue-200' : 'border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800/50'}`}>
                      <span className={`mt-0.5 w-4 h-4 shrink-0 flex items-center justify-center text-[10px] font-bold border ${isMSQ ? 'rounded' : 'rounded-full'} ${isSel ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-500'}`}>
                        {isSel ? '✓' : ''}
                      </span>
                      <span>{val}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className={`${showNav ? 'flex' : 'hidden lg:flex'} flex-col w-52 border-l border-slate-700 bg-slate-900 p-3`}>
          <div className="text-xs text-slate-500 mb-2 font-medium">Question Navigator</div>
          <div className="grid grid-cols-5 gap-1.5 mb-3">
            {questions.map((_, i) => {
              const ans = answers[questions[i]?.id]
              const isAns = ans?.selectedOption !== null && ans?.selectedOption !== undefined
                || (ans?.selectedOptions?.length || 0) > 0
                || (ans?.natValue !== undefined && ans?.natValue !== '')
              const isMark = ans?.marked
              return (
                <button key={i} onClick={() => { setCurrent(i); setShowNav(false) }}
                  className={`h-7 rounded text-xs font-medium transition-all ${i === current ? 'bg-blue-600 text-white' : isMark ? 'bg-orange-500/30 text-orange-400 border border-orange-500/40' : isAns ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}>
                  {i + 1}
                </button>
              )
            })}
          </div>
          <div className="text-xs space-y-1 text-slate-500">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-green-500/20" />Answered</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-orange-500/30" />Marked</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-slate-800" />Skipped</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border-t border-slate-700 px-4 py-3 flex items-center gap-2">
        <button onClick={() => setAnswers(p => ({ ...p, [q.id]: { ...p[q.id], selectedOption: null, selectedOptions: [], natValue: '' } }))} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-slate-700 rounded-lg transition-all">Clear</button>
        <button onClick={() => setAnswers(p => ({ ...p, [q.id]: { ...p[q.id], marked: !p[q.id]?.marked } }))}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all ${answers[q.id]?.marked ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' : 'border-slate-700 text-slate-400 hover:text-white'}`}>
          <Flag size={12} /> Mark
        </button>
        <div className="flex-1" />
        <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0} className="px-3 py-1.5 text-xs bg-slate-800 text-slate-400 disabled:opacity-40 rounded-lg hover:text-white">← Prev</button>
        {current < questions.length - 1
          ? <button onClick={() => setCurrent(current + 1)} className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Next →</button>
          : <button onClick={submitTest} className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg">Submit Test</button>}
      </div>
    </div>
  )

  if (phase === 'report' && report) {
    const att = report.attempt
    const answers2 = att?.answers || []
    const correct = answers2.filter((a: any) => a.isCorrect).length
    const wrong = answers2.filter((a: any) => !a.isCorrect && a.selectedOption !== null).length
    const skipped = answers2.filter((a: any) => a.selectedOption === null).length
    return (
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-5 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Test Submitted!</h2>
          <p className="text-slate-400 text-sm">{att?.test?.name}</p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="bg-slate-900/50 rounded-xl p-3"><div className="text-2xl font-bold text-white">{report.score?.toFixed(1) || 0}</div><div className="text-xs text-slate-500">Score</div></div>
            <div className="bg-slate-900/50 rounded-xl p-3"><div className="text-2xl font-bold text-green-400">{report.accuracy || 0}%</div><div className="text-xs text-slate-500">Accuracy</div></div>
            <div className="bg-slate-900/50 rounded-xl p-3"><div className="text-2xl font-bold text-blue-400">{correct}/{answers2.length}</div><div className="text-xs text-slate-500">Correct</div></div>
          </div>
          <div className="mt-3 flex justify-center gap-4 text-sm">
            <span className="text-green-400">✓ {correct} correct</span>
            <span className="text-red-400">✗ {wrong} wrong</span>
            <span className="text-slate-500">— {skipped} skipped</span>
          </div>
          {wrong > 0 && <p className="text-xs text-orange-400 mt-3">Wrong answers added to Revision queue automatically! Correct ones won't repeat in your next test.</p>}
        </div>

        <div className="space-y-3 mb-5">
          {answers2.map((a: any, i: number) => (
            <div key={a.id} className={`bg-slate-800/40 border rounded-xl p-4 ${a.isCorrect ? 'border-green-500/20' : a.selectedOption === null ? 'border-slate-700/40' : 'border-red-500/20'}`}>
              <div className="flex items-start gap-3">
                {a.isCorrect ? <CheckCircle2 size={16} className="text-green-400 mt-0.5 shrink-0" /> : a.selectedOption === null ? <div className="w-4 h-4 rounded-full border-2 border-slate-600 shrink-0 mt-0.5" /> : <XCircle size={16} className="text-red-400 mt-0.5 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm text-slate-300">Q{i + 1}. {a.question?.questionText}</p>
                    <span className="text-[10px] shrink-0 px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400 border border-slate-600">{a.question?.questionType}</span>
                  </div>
                  {!a.isCorrect && a.question?.questionType === 'MSQ' && (
                    <>
                      <p className="text-xs text-red-400">Your answer: {a.selectedOptions ? a.selectedOptions.split(',').map((i: string) => ['A','B','C','D'][+i]).join(', ') || 'None' : 'None'}</p>
                      <p className="text-xs text-green-400">Correct: {a.question.correctOptions.split(',').map((i: string) => ['A','B','C','D'][+i]).join(', ')}</p>
                    </>
                  )}
                  {!a.isCorrect && a.question?.questionType === 'NAT' && (
                    <>
                      <p className="text-xs text-red-400">Your answer: {a.natAnswer ?? 'Not attempted'}</p>
                      <p className="text-xs text-green-400">Correct: {a.question.natAnswer}</p>
                    </>
                  )}
                  {!a.isCorrect && a.question?.questionType !== 'MSQ' && a.question?.questionType !== 'NAT' && (
                    <>
                      {a.selectedOption !== null && <p className="text-xs text-red-400">Your answer: {['A','B','C','D'][a.selectedOption]}</p>}
                      <p className="text-xs text-green-400">Correct: {['A','B','C','D'][a.question?.correctOption]}</p>
                    </>
                  )}
                  {a.question?.explanation && <p className="text-xs text-slate-500 mt-1">{a.question.explanation}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setPhase('setup')} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all">
          <RotateCcw size={16} /> Take Another Test
        </button>
      </div>
    )
  }

  // Setup Phase
  const TYPE_META: Record<TestType, { icon: any; desc: string }> = {
    'Topic Test': { icon: Target, desc: 'Pick one subject, then specific topics within it' },
    'Subject Test': { icon: Layers, desc: 'Pick one or more whole subjects' },
    'Full Mock': { icon: Globe, desc: 'Auto-covers your entire GATE syllabus, no picking needed' },
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-white">Tests</h1>
        <p className="text-slate-400 text-sm mt-1">Real PYQs first, AI fills the rest automatically. Correct answers won't repeat.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {/* Form */}
        <div className="md:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-white">Create New Test</h2>

          {/* Test Type — drives everything below */}
          <div>
            <label className="text-xs text-slate-400 mb-2 block">Test Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Topic Test', 'Subject Test', 'Full Mock'] as TestType[]).map(t => {
                const Icon = TYPE_META[t].icon
                const active = form.type === t
                return (
                  <button key={t} onClick={() => onTypeChange(t)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${active ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500'}`}>
                    <Icon size={18} className={active ? 'text-blue-400' : 'text-slate-500'} />
                    <span className={`text-xs font-medium ${active ? 'text-blue-300' : 'text-slate-400'}`}>{t}</span>
                  </button>
                )
              })}
            </div>
            <p className="text-[11px] text-slate-600 mt-1.5">{TYPE_META[form.type].desc}</p>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Exam</label>
            <select value={form.exam} onChange={e => setForm(p => ({ ...p, exam: e.target.value, subjectIds: [], topicIds: [] }))} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
              <option value="CSE">GATE CSE</option><option value="DA">GATE DA</option>
            </select>
          </div>

          {/* Count <-> duration: locked for Full Mock (real GATE format), editable + linked otherwise */}
          {form.type === 'Full Mock' ? (
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5"><ListChecks size={11} /> Number of Questions</div>
                <div className="text-sm text-white font-semibold mt-0.5">65 <span className="text-slate-500 font-normal text-xs">(fixed — real GATE format)</span></div>
              </div>
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5"><Clock size={11} /> Duration</div>
                <div className="text-sm text-white font-semibold mt-0.5">180 min <span className="text-slate-500 font-normal text-xs">(fixed — real GATE format)</span></div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 flex items-center gap-1.5"><ListChecks size={11} /> Number of Questions</label>
                  <input type="number" min={1} max={100} value={form.questionCount} onChange={e => onCountChange(parseInt(e.target.value) || 1)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 flex items-center gap-1.5"><Clock size={11} /> Duration (minutes)</label>
                  <input type="number" min={5} max={300} step={5} value={form.duration} onChange={e => onDurationChange(parseInt(e.target.value) || 5)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <p className="text-[11px] text-slate-600 -mt-2">Changing one auto-adjusts the other (~2.5 min/question) — both stay editable.</p>
            </>
          )}

          {/* Subject picker — hidden entirely for Full Mock */}
          {form.type !== 'Full Mock' && (
            <div>
              <label className="text-xs text-slate-400 mb-2 block">
                {form.type === 'Topic Test' ? 'Select a Subject (one only)' : 'Select Subjects (one or more)'}
              </label>
              <div className="flex flex-wrap gap-2">
                {examSubjects.map((s: any) => {
                  const sel = form.subjectIds.includes(s.id)
                  return (
                    <button key={s.id} onClick={() => toggleSubject(s.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs border transition-all ${sel ? 'border-blue-500 bg-blue-500/20 text-blue-300' : 'border-slate-700 text-slate-400 hover:text-white'}`}>
                      {s.name.split(' ')[0]}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Topic picker — only for Topic Test, once a subject is chosen */}
          {form.type === 'Topic Test' && form.subjectIds.length > 0 && (
            <div>
              <label className="text-xs text-slate-400 mb-2 block">Select Topics (required — pick at least one)</label>
              <div className="flex flex-wrap gap-2">
                {topics.map((t: any) => {
                  const sel = form.topicIds.includes(t.id)
                  return (
                    <button key={t.id} onClick={() => toggleTopic(t.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs border transition-all ${sel ? 'border-purple-500 bg-purple-500/20 text-purple-300' : 'border-slate-700 text-slate-400 hover:text-white'}`}>
                      {t.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {form.type === 'Full Mock' && (
            <div className="flex items-start gap-2 text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <Globe size={12} className="shrink-0 mt-0.5" />
              <span>Full Mock automatically pulls from all {examSubjects.length} GATE {form.exam} subjects — no selection needed.</span>
            </div>
          )}

          <div className="flex items-start gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <Zap size={12} className="shrink-0 mt-0.5" />
            <span>Real PYQs are used first. If not enough are available, AI (Gemini) fills the rest automatically.</span>
          </div>

          <button onClick={createTest} disabled={creating || !canStart} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-medium transition-all">
            {creating ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Building your test...</> : <><Play size={16} /> Start Test</>}
          </button>
        </div>

        {/* History */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <h3 className="font-semibold text-white text-sm mb-3">Recent Tests</h3>
          {history.length === 0 ? <div className="text-slate-500 text-xs text-center py-8">No tests yet. Create your first test!</div> : (
            <div className="space-y-2">
              {history.map((a: any) => (
                <Link key={a.id} href={`/tests/review?attemptId=${a.id}`} className="block bg-slate-900/50 hover:bg-slate-900 rounded-lg p-3 transition-all">
                  <div className="text-xs font-medium text-slate-300 truncate">{a.test?.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-green-400 text-xs font-bold">{a.accuracy}%</span>
                    <span className="text-slate-500 text-xs">{a.score?.toFixed(1)} pts</span>
                    <span className="text-slate-600 text-xs ml-auto">{new Date(a.startedAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
