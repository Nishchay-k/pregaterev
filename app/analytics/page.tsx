'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'

export default function AnalyticsPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetch('/api/analytics').then(r => r.json()).then(d => { setData(d); setLoading(false) }) }, [])

  if (loading) return <div className="p-6 max-w-5xl mx-auto animate-pulse space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-48 bg-slate-800 rounded-xl" />)}</div>

  const acc = data?.analytics
  const accuracy = acc?.totalQuestionsAttempted > 0 ? Math.round((acc.totalCorrect / acc.totalQuestionsAttempted) * 100) : 0

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Track your performance and identify weak areas</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Questions', val: acc?.totalQuestionsAttempted || 0, color: 'text-blue-400' },
          { label: 'Correct', val: acc?.totalCorrect || 0, color: 'text-green-400' },
          { label: 'Accuracy', val: `${accuracy}%`, color: 'text-purple-400' },
          { label: 'Study Streak', val: `${acc?.studyStreak || 0}d`, color: 'text-orange-400' },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className={`text-2xl font-bold ${color}`}>{val}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Daily Accuracy Trend</h3>
          {(data?.chartData?.length || 0) > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="accuracy" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} name="Accuracy %" />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="h-44 flex items-center justify-center text-slate-500 text-sm">Take tests to see trends</div>}
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Questions Per Day</h3>
          {(data?.chartData?.length || 0) > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="questions" fill="#3b82f6" radius={[3,3,0,0]} name="Questions" />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-44 flex items-center justify-center text-slate-500 text-sm">No data yet</div>}
        </div>
      </div>

      {/* Test history */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-4">Test History</h3>
        {(data?.attempts?.length || 0) === 0 ? (
          <div className="text-slate-500 text-sm text-center py-8">No tests completed yet. Go to Tests to start!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-slate-700 text-slate-500"><th className="text-left py-2 pr-3">Test Name</th><th className="text-left py-2 pr-3">Type</th><th className="text-left py-2 pr-3">Score</th><th className="text-left py-2 pr-3">Accuracy</th><th className="text-left py-2">Date</th></tr></thead>
              <tbody className="divide-y divide-slate-700/50">
                {data.attempts.map((a: any) => (
                  <tr key={a.id} onClick={() => router.push(`/tests/review?attemptId=${a.id}`)} className="cursor-pointer hover:bg-slate-700/20 transition-all">
                    <td className="py-2 pr-3 text-slate-300 max-w-32 truncate">{a.test?.name}</td>
                    <td className="py-2 pr-3 text-slate-500">{a.test?.type}</td>
                    <td className="py-2 pr-3 text-white font-medium">{a.score?.toFixed(1)}</td>
                    <td className="py-2 pr-3"><span className={`font-medium ${a.accuracy >= 70 ? 'text-green-400' : a.accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{a.accuracy}%</span></td>
                    <td className="py-2 text-slate-500">{new Date(a.startedAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
