'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, XCircle, ArrowLeft, Clock } from 'lucide-react'

function ReviewContent() {
  const params = useSearchParams()
  const attemptId = params.get('attemptId')
  const [attempt, setAttempt] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!attemptId) { setLoading(false); return }
    fetch(`/api/tests?attemptId=${attemptId}`).then(r => r.json()).then(d => { setAttempt(d.attempt); setLoading(false) })
  }, [attemptId])

  if (loading) return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto animate-pulse space-y-4">
      <div className="h-8 w-48 bg-slate-800 rounded" />
      <div className="h-40 bg-slate-800 rounded-2xl" />
      {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-slate-800 rounded-xl" />)}
    </div>
  )

  if (!attempt) return (
    <div className="p-6 max-w-3xl mx-auto text-center py-16">
      <p className="text-slate-400">Test attempt not found.</p>
      <Link href="/tests" className="text-blue-400 text-sm hover:underline mt-2 inline-block">← Back to Tests</Link>
    </div>
  )

  const answers2 = attempt.answers || []
  const correct = answers2.filter((a: any) => a.isCorrect).length
  const wrong = answers2.filter((a: any) => !a.isCorrect && (a.selectedOption !== null || (a.selectedOptions && a.selectedOptions !== '') || a.natAnswer !== null)).length
  const skipped = answers2.length - correct - wrong
  const fmtTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <Link href="/tests" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-4 transition-all">
        <ArrowLeft size={14} /> Back to Tests
      </Link>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-5 text-center">
        <h2 className="text-xl font-bold text-white mb-1">{attempt.test?.name}</h2>
        <p className="text-slate-500 text-xs flex items-center justify-center gap-1.5">
          <Clock size={11} /> {new Date(attempt.startedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          {attempt.timeSpent ? ` · Took ${fmtTime(attempt.timeSpent)}` : ''}
        </p>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="bg-slate-900/50 rounded-xl p-3"><div className="text-2xl font-bold text-white">{attempt.score?.toFixed(1) || 0}</div><div className="text-xs text-slate-500">Score</div></div>
          <div className="bg-slate-900/50 rounded-xl p-3"><div className="text-2xl font-bold text-green-400">{attempt.accuracy || 0}%</div><div className="text-xs text-slate-500">Accuracy</div></div>
          <div className="bg-slate-900/50 rounded-xl p-3"><div className="text-2xl font-bold text-blue-400">{correct}/{answers2.length}</div><div className="text-xs text-slate-500">Correct</div></div>
        </div>
        <div className="mt-3 flex justify-center gap-4 text-sm">
          <span className="text-green-400">✓ {correct} correct</span>
          <span className="text-red-400">✗ {wrong} wrong</span>
          <span className="text-slate-500">— {skipped} skipped</span>
        </div>
      </div>

      <div className="space-y-3">
        {answers2.map((a: any, i: number) => {
          const isSkipped = !a.isCorrect && a.selectedOption === null && (!a.selectedOptions || a.selectedOptions === '') && a.natAnswer === null
          return (
            <div key={a.id} className={`bg-slate-800/40 border rounded-xl p-4 ${a.isCorrect ? 'border-green-500/20' : isSkipped ? 'border-slate-700/40' : 'border-red-500/20'}`}>
              <div className="flex items-start gap-3">
                {a.isCorrect ? <CheckCircle2 size={16} className="text-green-400 mt-0.5 shrink-0" /> : isSkipped ? <div className="w-4 h-4 rounded-full border-2 border-slate-600 shrink-0 mt-0.5" /> : <XCircle size={16} className="text-red-400 mt-0.5 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm text-slate-300">Q{i + 1}. {a.question?.questionText}</p>
                    <span className="text-[10px] shrink-0 px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400 border border-slate-600">{a.question?.questionType}</span>
                    {a.question?.subject?.name && <span className="text-[10px] shrink-0 px-1.5 py-0.5 rounded" style={{ background: a.question.subject.color + '22', color: a.question.subject.color }}>{a.question.subject.name.split(' ')[0]}</span>}
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
          )
        })}
      </div>
    </div>
  )
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="p-6 max-w-3xl mx-auto animate-pulse h-64 bg-slate-800 rounded-xl" />}>
      <ReviewContent />
    </Suspense>
  )
}
