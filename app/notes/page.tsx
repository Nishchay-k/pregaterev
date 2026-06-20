'use client'
import { useEffect, useState } from 'react'
import { Search, Pin, PinOff, Plus, Trash2, Edit2, X, Check, Tag } from 'lucide-react'

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<any>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', tags: '' })

  const load = (s = '') => {
    const p = s ? `?search=${encodeURIComponent(s)}` : ''
    fetch(`/api/notes${p}`).then(r => r.json()).then(d => { setNotes(d.notes || []); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.title.trim()) return
    if (editing) {
      await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update', id: editing.id, ...form }) })
    } else {
      await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'create', ...form }) })
    }
    setEditing(null); setCreating(false); setForm({ title: '', content: '', tags: '' }); load(search)
  }

  const del = async (id: string) => {
    if (!confirm('Delete this note?')) return
    await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) })
    load(search)
  }

  const pin = async (id: string) => {
    await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'pin', id }) })
    load(search)
  }

  const startEdit = (note: any) => {
    setEditing(note); setForm({ title: note.title, content: note.content, tags: note.tags || '' }); setCreating(true)
  }

  const cancelEdit = () => { setEditing(null); setCreating(false); setForm({ title: '', content: '', tags: '' }) }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Notes</h1>
          <p className="text-slate-400 text-sm mt-1">Markdown-supported study notes</p>
        </div>
        <button onClick={() => { setCreating(true); setEditing(null) }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all">
          <Plus size={15} /> New Note
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input value={search} onChange={e => { setSearch(e.target.value); load(e.target.value) }} placeholder="Search notes..." className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
      </div>

      {/* Editor */}
      {creating && (
        <div className="bg-slate-800/80 border border-blue-500/30 rounded-xl p-4 mb-5">
          <h3 className="text-sm font-semibold text-white mb-3">{editing ? 'Edit Note' : 'New Note'}</h3>
          <div className="space-y-3">
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Note title..." className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={10} placeholder="Write your notes here... Markdown supported!" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono resize-y" />
            <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="Tags (comma-separated): algorithms, os, cheatsheet" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={save} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all"><Check size={14} /> Save</button>
            <button onClick={cancelEdit} className="flex items-center gap-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-all"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">{[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-slate-800 rounded-xl" />)}</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No notes found. Create your first note!</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note: any) => (
            <div key={note.id} className={`bg-slate-800/50 border rounded-xl p-4 flex flex-col hover:border-slate-600 transition-all ${note.isPinned ? 'border-yellow-500/30' : 'border-slate-700/50'}`}>
              <div className="flex items-start gap-2 mb-2">
                <h3 className="font-semibold text-white text-sm flex-1 min-w-0 line-clamp-2">{note.title}</h3>
                <button onClick={() => pin(note.id)} className={`shrink-0 p-1.5 rounded transition-all ${note.isPinned ? 'text-yellow-400 hover:text-yellow-300' : 'text-slate-600 hover:text-yellow-400'}`}>
                  {note.isPinned ? <Pin size={13} /> : <PinOff size={13} />}
                </button>
              </div>
              <p className="text-slate-400 text-xs flex-1 line-clamp-5 font-mono leading-relaxed whitespace-pre-wrap">{note.content.slice(0, 200)}{note.content.length > 200 ? '...' : ''}</p>
              {note.tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {note.tags.split(',').filter((t: string) => t.trim()).slice(0, 3).map((tag: string) => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{tag.trim()}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
                <span className="text-[10px] text-slate-600">{new Date(note.updatedAt).toLocaleDateString('en-IN')}</span>
                <div className="flex gap-1.5">
                  <button onClick={() => startEdit(note)} className="p-1.5 rounded text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"><Edit2 size={12} /></button>
                  <button onClick={() => del(note.id)} className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
