import React, { useMemo, useState } from 'react'
import type { Block } from '../types'

export default function SearchPanel({ blocks, onSelect }: { blocks: Block[]; onSelect: (b: Block) => void }) {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<string>('all')
  const [category, setCategory] = useState<string>('all')

  const kinds = ['all', 'brand', 'name', 'profile', 'ad']
  const categories = ['all', 'tech', 'food', 'fashion', 'services', 'creator']

  const filtered = useMemo(()=> {
    const q = query.trim().toLowerCase()
    return blocks.filter(b=> {
      if (kind !== 'all' && b.kind !== kind) return false
      if (category !== 'all' && b.category !== category) return false
      if (!q) return true
      return (b.title?.toLowerCase()||'').includes(q) || (b.text||'').toLowerCase().includes(q)
    }).slice(0, 200)
  }, [blocks, query, kind, category])

  return (
    <aside className="w-full md:w-80 p-3 bg-slate-900/60 rounded-md">
      <div>
        <label className="block text-xs mb-1">Search</label>
        <input aria-label="Search blocks" className="w-full p-2 rounded bg-slate-800" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by title or text..." />
      </div>

      <div className="mt-3 text-xs flex gap-2">
        <select aria-label="Filter by kind" value={kind} onChange={(e)=>setKind(e.target.value)} className="p-2 bg-slate-800 rounded">
          {kinds.map(k=> <option key={k} value={k}>{k}</option>)}
        </select>
        <select aria-label="Filter by category" value={category} onChange={(e)=>setCategory(e.target.value)} className="p-2 bg-slate-800 rounded">
          {categories.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="mt-4 text-sm">
        <div className="text-xs uppercase mb-2">Directory ({filtered.length})</div>
        <ul className="max-h-64 overflow-auto">
          {filtered.map(b=> (
            <li key={b.id}>
              <button onClick={()=>onSelect(b)} className="w-full text-left p-2 rounded hover:bg-white/5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-sm">{b.title}</div>
                    <div className="text-xs text-slate-300">{b.category} · {b.kind} · {b.w}×{b.h}</div>
                  </div>
                  <div className="text-xs text-slate-400">#{b.id}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

/*
  COMMENT: SearchPanel handles live search + filters and directory list.
  Clicking an entry calls onSelect which the page binds to focus/zoom behavior.
*/