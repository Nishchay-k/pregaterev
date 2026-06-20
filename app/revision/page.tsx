'use client'
import { useEffect, useState } from 'react'
import { RefreshCw, CheckCircle2, Brain, Calendar } from 'lucide-react'

export default function RevisionPage() {
  const [data, setData] = useState<any>({ due: [], upcoming: 0 })
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(0)
  const [rating, setRating] = useState(false)

  const load = () => { setLoading(true); fetch('/api/revision').then(r => r.json()).then(d => { setData(d); setLoading(false) }) }
  useEffect(() => { load() }, [])

  const rate = async (r: string) => {
    const rev = data.due[current]
    setRating(true)
    await fetch('/api/revision', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ revisionId: rev.id, rating: r }) })
    setDone(p => p + 1); setFlipped(false); setRating(false)
    if (current + 1 >= data.due.length) { load(); setCurrent(0) }
    else setCurrent(p => p + 1)
  }

  if (loading) return <div className="p-6 max-w-2xl mx-auto"><div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-slate-800 rounded" /><div className="h-64 bg-slate-800 rounded-xl" /></div></div>

  const card = data.due[current]
  const total = data.due.length
  const q = card?.question

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-white">Revision Tracker</h1>
        <p className="text-slate-400 text-sm mt-1">Spaced repetition powered by SM-2 algorithm</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-orange-400">{total}</div>
          <div className="text-xs text-slate-500">Due Today</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{done}</div>
          <div className="text-xs text-slate-500">Reviewed</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">{data.upcoming}</div>
          <div className="text-xs text-slate-500">Upcoming</div>
        </div>
      </div>

      {total === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">
          <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">All caught up! 🎉</h2>
          <p className="text-slate-400 text-sm">No cards due today. Come back tomorrow or practice PYQs and wrong answers will appear here.</p>
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Card {current + 1} of {total}</span><span>{Math.round(((done) / total) * 100)}% done</span></div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${(done / total) * 100}%` }} />
            </div>
          </div>

          {/* Card */}
          {card && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 min-h-64">
              {/* Meta */}
              {q && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {q.subject?.name && <span className="text-xs px-2 py-0.5 rounded" style={{ background: q.subject?.color + '22', color: q.subject?.color }}>{q.subject.name.split(' ')[0]}</span>}
                  <span className="text-xs text-slate-500">{q.topic?.name}</span>
                  <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded ml-auto">#{card.revisionCount + 1} review · {card.interval}d interval</span>
                </div>
              )}

              {/* Front */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2"><Brain size={14} className="text-purple-400" /><span className="text-xs text-purple-400 font-medium">Question</span></div>
                <p className="text-slate-200 text-sm leading-relaxed">{q ? q.questionText : card.topic?.name}</p>
              </div>

              {/* Flip */}
              {!flipped ? (
                <button onClick={() => setFlipped(true)} className="w-full py-3 border-2 border-dashed border-slate-600 hover:border-blue-500 text-slate-400 hover:text-blue-400 rounded-xl text-sm transition-all">
                  Tap to reveal answer
                </button>
              ) : (
                <div className="space-y-3">
                  {q && (
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                      <div className="text-xs text-green-400 font-medium mb-1">Correct Answer: {['A','B','C','D'][q.correctOption]}</div>
                      {q.optionA && <p className="text-sm text-slate-200 mb-2">{['A','B','C','D'][q.correctOption]}. {q[`option${'ABCD'[q.correctOption]}`]}</p>}
                      {q.explanation && <p className="text-xs text-slate-400 leading-relaxed">{q.explanation}</p>}
                    </div>
                  )}

                  <div>
                    <div className="text-xs text-slate-500 mb-2 text-center">How well did you recall?</div>
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => rate('Hard')} disabled={rating} className="py-2.5 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all">
                        😓 Hard
                      </button>
                      <button onClick={() => rate('Medium')} disabled={rating} className="py-2.5 rounded-xl text-sm font-medium bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 transition-all">
                        🤔 Medium
                      </button>
                      <button onClick={() => rate('Easy')} disabled={rating} className="py-2.5 rounded-xl text-sm font-medium bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all">
                        😊 Easy
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-1 text-center text-xs text-slate-600">
                      <span>Reset to 1d</span><span>Continue</span><span>Increase interval</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
