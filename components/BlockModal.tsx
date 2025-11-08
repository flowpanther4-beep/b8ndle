import React, { useState } from 'react'
import type { Block, BlockDraft } from '../types'

export default function BlockModal({ block, onClose, onReserve }: { block: Block | null; onClose: ()=>void; onReserve: (draft: BlockDraft)=>Promise<void> }) {
  const [draftTitle, setDraftTitle] = useState('')
  const [href, setHref] = useState('')
  const [img, setImg] = useState('')
  const [themeBg, setThemeBg] = useState('#FF4444')
  const [loading, setLoading] = useState(false)

  React.useEffect(()=> {
    if (block) {
      setDraftTitle(block.title)
      setHref(block.href || '')
      setImg(block.img_url || '')
      setThemeBg(block.theme_bg || '#FF4444')
    }
  }, [block])

  if (!block) return null

  async function reserve() {
    setLoading(true)
    const draft: BlockDraft = {
      x: block.x,
      y: block.y,
      w: block.w,
      h: block.h,
      title: draftTitle,
      href,
      img_url: img,
      kind: block.kind,
      theme_bg: themeBg,
      theme_fg: '#fff'
    }
    try {
      await onReserve(draft)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-slate-900 w-11/12 md:w-2/3 lg:w-1/3 p-4 rounded shadow-lg">
        <button aria-label="Close modal" onClick={onClose} className="absolute top-2 right-2">✕</button>
        <div className="flex gap-4">
          <div style={{ width: 120, height: 80, background: block.theme_bg }} className="flex items-center justify-center">
            {block.img_url ? <img src={block.img_url} alt={block.title} className="max-h-full max-w-full" /> : <div className="text-sm font-bold">{block.title}</div>}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{block.title}</h3>
            <p className="text-sm text-slate-300">{block.text}</p>
            <div className="text-xs mt-2">Type: {block.kind} · Size: {block.w}×{block.h} · Pos: {block.x},{block.y}</div>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs">Your name / brand</label>
          <input value={draftTitle} onChange={(e)=>setDraftTitle(e.target.value)} className="w-full p-2 mt-1 bg-slate-800 rounded" />

          <label className="text-xs mt-2">Website / Link</label>
          <input value={href} onChange={(e)=>setHref(e.target.value)} className="w-full p-2 mt-1 bg-slate-800 rounded" />

          <label className="text-xs mt-2">Logo URL (optional)</label>
          <input value={img} onChange={(e)=>setImg(e.target.value)} className="w-full p-2 mt-1 bg-slate-800 rounded" />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-700">Cancel</button>
          {block.status === 'available' ? (
            <button onClick={reserve} disabled={loading} className="px-3 py-1 rounded bg-yellow-400 text-black font-bold">Reserve this space</button>
          ) : (
            <a href={block.href || '#'} target="_blank" rel="noreferrer" className="px-3 py-1 rounded bg-blue-600">Visit</a>
          )}
        </div>
      </div>
    </div>
  )
}

/*
  COMMENT: BlockModal provides UI to reserve (draft) a block.
  - onReserve should call /api/checkout mock. After payment occurs, server would mark reserved/paid.
*/