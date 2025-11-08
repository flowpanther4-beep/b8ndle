import React, { useEffect, useMemo, useState } from 'react'
import TopBanner from '../components/TopBanner'
import WallCanvas from '../components/WallCanvas'
import SearchPanel from '../components/SearchPanel'
import BlockModal from '../components/BlockModal'
import { seededBlocks } from '../lib/blocksData'
import type { Block, BlockDraft } from '../types'
import { isOverlapping, zoneMultiplierForY } from '../utils/geom'

export default function Home() {
  // Application state (in-memory)
  const [blocks, setBlocks] = useState<Block[]>(() => seededBlocks)
  const [selected, setSelected] = useState<Block | null>(null)
  const [focusId, setFocusId] = useState<string | null>(null)
  const [showAvailability, setShowAvailability] = useState(true)
  const [moderationMode, setModerationMode] = useState(false)

  useEffect(()=> {
    // Example: fetch blocks from /api/blocks in real app
    // fetch('/api/blocks').then(r=>r.json()).then(data=>setBlocks(data))
  }, [])

  // Handle selection from directory
  function onSelect(b: Block) {
    setFocusId(b.id)
    setSelected(b)
  }

  async function handleReserve(draft: BlockDraft) {
    // Call availability check
    const av = await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x: draft.x, y: draft.y, w: draft.w, h: draft.h })
    }).then(r=>r.json())

    if (!av.ok) {
      alert(`Conflict with blocks: ${av.conflicts.join(', ')}`)
      return
    }

    // Quote
    const q = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x: draft.x, y: draft.y, w: draft.w, h: draft.h })
    }).then(r=>r.json())

    const proceed = confirm(`This space costs $${(q.price_cents/100).toFixed(2)} (mock). Proceed to mock checkout?`)
    if (!proceed) return

    // Checkout mock
    const checkout = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draft })
    }).then(r=>r.json())

    // simulate redirect to checkout mock (here we just mark as reserved)
    // In a real integration, redirect to Stripe Checkout session URL
    // For demo: mark the block as reserved
    setBlocks(prev => prev.map(b => {
      if (b.x === draft.x && b.y === draft.y && b.w === draft.w && b.h === draft.h) {
        return { ...b, status: 'reserved', title: draft.title, href: draft.href, img_url: draft.img_url, theme_bg: draft.theme_bg || b.theme_bg }
      }
      return b
    }))

    setSelected(null)
    alert('Mock checkout completed — block reserved (demo). Use moderation toggle to approve.')
  }

  // moderation action to approve reserved -> approved
  function moderateApprove(id: string) {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, status: 'approved' } : b))
  }

  // demo zone price calculator
  function demoPriceFor(block: { x:number; y:number; w:number; h:number }) {
    const base = 100 // cents per pixel unit * simplified factor (demo)
    const area = block.w * block.h
    const multiplier = zoneMultiplierForY(block.y, block.h)
    return Math.round(base * area * multiplier)
  }

  const handleBlockClick = (b: Block) => {
    setSelected(b)
  }

  return (
    <div className="min-h-screen">
      <TopBanner moderation={moderationMode} onModerationToggle={(v)=>setModerationMode(v)} />

      <main className="p-4 md:p-8 grid md:grid-cols-[320px_1fr] gap-4">
        <div>
          <SearchPanel blocks={blocks} onSelect={onSelect} />
          <div className="mt-4 p-3 bg-slate-900 rounded">
            <label className="flex items-center gap-2">
              <input aria-label="Show availability" type="checkbox" checked={showAvailability} onChange={(e)=>setShowAvailability(e.target.checked)} />
              <span className="text-xs">Show availability overlay</span>
            </label>

            <div className="mt-3 text-xs text-slate-300">
              <div>Presets:</div>
              <div className="flex gap-2 mt-2">
                {[
                  {w:6,h:4},{w:8,h:8},{w:12,h:8},{w:20,h:10}
                ].map(p=>(
                  <button key={`${p.w}x${p.h}`} className="px-2 py-1 bg-slate-700 rounded text-xs" onClick={()=>alert(`Select and click on wall to preview ${p.w}×${p.h} (demo)`)}>{p.w}×{p.h}</button>
                ))}
              </div>
            </div>

            <div className="mt-3 text-xs">
              <div>Developer: Click an entry in Directory to focus on block. Mock price calculator available in modal/checkout.</div>
            </div>
          </div>
        </div>

        <div className="h-[80vh]">
          <div className="relative h-full">
            <WallCanvas blocks={blocks} focusId={focusId} showAvailability={showAvailability} onBlockClick={handleBlockClick} />
          </div>
        </div>
      </main>

      <footer className="text-center py-6">
        <div className="text-sm">© 2025 Brand Space – All Rights Reserved.</div>
      </footer>

      <BlockModal block={selected} onClose={()=>setSelected(null)} onReserve={handleReserve} />

      {/* Moderation quick UI (demo) */}
      {moderationMode && (
        <div className="fixed bottom-4 right-4 bg-slate-900 p-3 rounded shadow">
          <div className="text-sm font-bold">Moderation panel (demo)</div>
          <div className="text-xs mt-2">Approve last reserved block:</div>
          <div className="mt-2">
            <button onClick={()=> {
              const lastReserved = [...blocks].reverse().find(b=>b.status==='reserved')
              if (!lastReserved) return alert('No reserved blocks')
              moderateApprove(lastReserved.id)
              alert(`Approved ${lastReserved.id}`)
            }} className="px-3 py-1 bg-green-600 rounded text-xs">Approve last reserved</button>
          </div>
        </div>
      )}
    </div>
  )
}

/*
  COMMENT:
  - Anti-overlap utility used in API /api/availability (server) and utils/geom.ts (client).
  - The availability overlay is controlled via showAvailability prop and the Block component displays the badge.
  - The yellow banner is defined in components/TopBanner.tsx.
*/