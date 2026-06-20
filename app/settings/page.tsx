'use client'
import { useEffect, useState } from 'react'
import { Save, RotateCcw, AlertTriangle, Check } from 'lucide-react'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState({ name: '', targetExam: 'CSE', targetScore: 65, dailyHours: 4, targetDate: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [showReset, setShowReset] = useState(false)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      setUser(d.user); setForm({ name: d.user.name, targetExam: d.user.targetExam, targetScore: d.user.targetScore || 65, dailyHours: d.user.dailyHours || 4, targetDate: d.user.targetDate || '' })
    })
  }, [])

  const save = async () => {
    setSaving(true)
    await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update', ...form }) })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const reset = async () => {
    setResetting(true)
    await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reset' }) })
    setResetting(false); setShowReset(false); alert('Progress reset! Your syllabus and analytics have been cleared.')
  }

  if (!user) return <div className="p-6 max-w-xl mx-auto animate-pulse"><div className="h-64 bg-slate-800 rounded-xl" /></div>

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure your GATE preparation profile</p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 space-y-4 mb-5">
        <h2 className="font-semibold text-white text-sm">Profile</h2>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Name</label>
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Target Exam</label>
          <select value={form.targetExam} onChange={e => setForm(p => ({ ...p, targetExam: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
            <option value="CSE">GATE CSE</option><option value="DA">GATE DA</option><option value="BOTH">Both CSE + DA</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Target Score</label>
            <input type="number" value={form.targetScore} min={0} max={100} onChange={e => setForm(p => ({ ...p, targetScore: parseInt(e.target.value) }))} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Daily Study Hours</label>
            <input type="number" value={form.dailyHours} min={1} max={16} step={0.5} onChange={e => setForm(p => ({ ...p, dailyHours: parseFloat(e.target.value) }))} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Target Exam Date</label>
          <input type="date" value={form.targetDate} onChange={e => setForm(p => ({ ...p, targetDate: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
        </div>
        <button onClick={save} disabled={saving} className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all">
          {saved ? <><Check size={15} /> Saved!</> : saving ? 'Saving...' : <><Save size={15} /> Save Changes</>}
        </button>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 mb-5">
        <h2 className="font-semibold text-white text-sm mb-1">AI Configuration</h2>
        <p className="text-slate-500 text-xs mb-3">Add your Gemini API key to enable AI test generation and AI Mentor chat.</p>
        <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-3 text-xs text-slate-400 font-mono">
          GEMINI_API_KEY=your_key_here<br />
          <span className="text-slate-600"># Add to .env.local file in project root</span><br />
          <span className="text-slate-600"># Free key: aistudio.google.com</span>
        </div>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
        <h2 className="font-semibold text-red-400 text-sm mb-1 flex items-center gap-2"><AlertTriangle size={14} />Danger Zone</h2>
        <p className="text-slate-500 text-xs mb-3">Reset all syllabus progress and analytics. This cannot be undone.</p>
        {!showReset ? (
          <button onClick={() => setShowReset(true)} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-sm transition-all">Reset All Progress</button>
        ) : (
          <div className="space-y-2">
            <p className="text-red-400 text-xs font-medium">Are you sure? This will clear all topic progress and analytics.</p>
            <div className="flex gap-2">
              <button onClick={reset} disabled={resetting} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all">{resetting ? 'Resetting...' : 'Yes, Reset Everything'}</button>
              <button onClick={() => setShowReset(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-all">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
