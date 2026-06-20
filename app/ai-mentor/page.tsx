'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Zap, Loader2 } from 'lucide-react'

type Msg = { role: 'user' | 'assistant'; content: string }

const QUICK = [
  'Explain the Master Theorem with examples',
  'Solve: T(n) = 2T(n/2) + n. What is T(n)?',
  'Compare DFA and NFA. Can they recognize the same languages?',
  'Explain deadlock conditions and Banker\'s Algorithm',
  'What is the difference between 3NF and BCNF?',
  'Explain backpropagation in neural networks step by step',
]

export default function AIMentorPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', content: '👋 Hi! I\'m your GateForge AI Mentor, powered by Gemini.\n\nI can help you:\n- **Explain GATE concepts** clearly with examples\n- **Solve PYQ problems** step by step\n- **Create revision strategies** for your weak areas\n- **Answer any CS or DA question** for GATE prep\n\nTry one of the quick prompts below or ask me anything!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  const send = async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    const newMsgs: Msg[] = [...msgs, { role: 'user', content: msg }]
    setMsgs(newMsgs); setLoading(true)
    try {
      const res = await fetch('/api/ai-mentor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMsgs }) })
      const d = await res.json()
      setMsgs(p => [...p, { role: 'assistant', content: d.text || 'Sorry, I could not generate a response.' }])
    } catch {
      setMsgs(p => [...p, { role: 'assistant', content: 'Error connecting to AI. Please check your API key.' }])
    }
    setLoading(false)
  }

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  const formatMsg = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) return <div key={i} className="font-bold text-white mt-1">{line.slice(2, -2)}</div>
      if (line.startsWith('- ')) return <div key={i} className="flex gap-2 mt-0.5"><span className="text-slate-500 shrink-0">•</span><span>{formatInline(line.slice(2))}</span></div>
      if (line.startsWith('# ')) return <div key={i} className="text-lg font-bold text-white mt-2">{line.slice(2)}</div>
      if (line.startsWith('## ')) return <div key={i} className="font-semibold text-blue-400 mt-2">{line.slice(3)}</div>
      if (line === '') return <div key={i} className="h-1" />
      return <div key={i}>{formatInline(line)}</div>
    })
  }

  const formatInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    return parts.map((p, i) => {
      if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} className="text-white font-semibold">{p.slice(2, -2)}</strong>
      if (p.startsWith('`') && p.endsWith('`')) return <code key={i} className="bg-slate-700 text-green-300 px-1 py-0.5 rounded text-xs font-mono">{p.slice(1, -1)}</code>
      return p
    })
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Header */}
      <div className="bg-slate-900/80 border-b border-slate-700 px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">GateForge AI Mentor</div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500"><Zap size={10} className="text-green-400" />Powered by Google Gemini</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${m.role === 'assistant' ? 'bg-gradient-to-br from-green-500 to-blue-600' : 'bg-blue-600'}`}>
              {m.role === 'assistant' ? <Bot size={14} className="text-white" /> : <User size={14} className="text-white" />}
            </div>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === 'assistant' ? 'bg-slate-800 border border-slate-700/50 text-slate-300 rounded-tl-sm' : 'bg-blue-600 text-white rounded-tr-sm'}`}>
              {m.role === 'assistant' ? formatMsg(m.content) : m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center"><Bot size={14} className="text-white" /></div>
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 size={16} className="text-slate-400 animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {msgs.length <= 2 && (
        <div className="px-4 pb-2">
          <div className="text-xs text-slate-600 mb-2">Try asking:</div>
          <div className="flex flex-wrap gap-2">
            {QUICK.slice(0, 3).map(q => (
              <button key={q} onClick={() => send(q)} className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all truncate max-w-56">{q}</button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-slate-700 p-3 bg-slate-900/80">
        <div className="flex gap-2 items-end max-w-4xl mx-auto">
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} rows={1} placeholder="Ask about any GATE topic... (Enter to send, Shift+Enter for newline)" className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none max-h-32 overflow-y-auto" style={{ minHeight: 44 }} />
          <button onClick={() => send()} disabled={!input.trim() || loading} className="w-10 h-10 shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
        <div className="text-center text-xs text-slate-700 mt-1.5">AI can make mistakes. Verify important answers with standard textbooks.</div>
      </div>
    </div>
  )
}
