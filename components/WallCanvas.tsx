import React, { useEffect, useRef, useState } from 'react'
import type { Block as BlockType } from '../types'
import Block from './Block'

type Props = {
  blocks: BlockType[]
  focusId?: string | null
  onBlockClick?: (b: BlockType) => void
  showAvailability?: boolean
}

export default function WallCanvas({ blocks, focusId, onBlockClick, showAvailability = true }: Props) {
  // viewport state in pixels units (translate is in px, scale unitless)
  const [scale, setScale] = useState(0.8)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const lastPointer = useRef<{x:number,y:number}|null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const UNIT = 10 // 1 grid unit = 10px

  useEffect(()=> {
    fitToViewport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(()=> {
    if (focusId) {
      const b = blocks.find(x=>x.id===focusId)
      if (b) {
        // center this block
        const cx = (b.x + b.w/2) * UNIT
        const cy = (b.y + b.h/2) * UNIT
        centerOn(cx, cy)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId])

  function clampScale(s:number){ return Math.max(0.2, Math.min(5, s)) }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault()
    const delta = -e.deltaY * 0.0015
    const newScale = clampScale(scale * (1 + delta))
    // zoom around cursor
    const rect = containerRef.current!.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const worldBeforeX = (cx - translate.x) / scale
    const worldBeforeY = (cy - translate.y) / scale

    const newTx = cx - worldBeforeX * newScale
    const newTy = cy - worldBeforeY * newScale

    setScale(newScale)
    setTranslate({ x: newTx, y: newTy })
  }

  function onPointerDown(e: React.PointerEvent) {
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    setDragging(true)
    lastPointer.current = { x: e.clientX, y: e.clientY }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging || !lastPointer.current) return
    const dx = e.clientX - lastPointer.current.x
    const dy = e.clientY - lastPointer.current.y
    lastPointer.current = { x: e.clientX, y: e.clientY }
    setTranslate(t => ({ x: t.x + dx, y: t.y + dy }))
  }

  function onPointerUp(e: React.PointerEvent) {
    setDragging(false)
    lastPointer.current = null
  }

  function resetView() {
    fitToViewport()
  }

  function fitToViewport() {
    // fit the 10000x10000 (1000 units * 10px) to container with some padding
    const container = containerRef.current
    if (!container) return
    const cw = container.clientWidth
    const ch = container.clientHeight
    const canvasSize = 1000 * UNIT
    const s = Math.min(cw / canvasSize, ch / canvasSize) * 0.95
    const clamped = clampScale(s)
    const tx = (cw - canvasSize * clamped) / 2
    const ty = (ch - canvasSize * clamped) / 2
    setScale(clamped)
    setTranslate({ x: tx, y: ty })
  }

  function centerOn(cx: number, cy: number) {
    const container = containerRef.current
    if (!container) return
    const cw = container.clientWidth
    const ch = container.clientHeight
    const tx = cw / 2 - cx * scale
    const ty = ch / 2 - cy * scale
    setTranslate({ x: tx, y: ty })
  }

  return (
    <div className="relative w-full h-full wall-wrapper" >
      <div className="absolute top-3 left-3 z-20 flex gap-2">
        <button aria-label="Zoom in" onClick={() => setScale(s => clampScale(s * 1.2))} className="bg-white/10 px-2 py-1 rounded">＋</button>
        <button aria-label="Zoom out" onClick={() => setScale(s => clampScale(s / 1.2))} className="bg-white/10 px-2 py-1 rounded">－</button>
        <button aria-label="Center wall" onClick={resetView} className="bg-white/10 px-2 py-1 rounded">Center</button>
      </div>

      <div
        ref={containerRef}
        onWheel={handleWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="w-full h-full touch-pan-y"
        style={{ touchAction: 'none' }}
      >
        <div
          ref={contentRef}
          className="relative origin-top-left"
          style={{
            width: 1000 * UNIT,
            height: 1000 * UNIT,
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            willChange: 'transform'
          }}
        >
          {/* Background grid */}
          <div className="absolute inset-0" aria-hidden>
            <div style={{ width: '100%', height: '100%', backgroundSize: `${10 * UNIT}px ${10 * UNIT}px`, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)' }} />
          </div>

          {/* Blocks */}
          {blocks.map(b => (
            <div
              key={b.id}
              onClick={() => onBlockClick?.(b)}
              onKeyDown={(e) => { if (e.key === 'Enter') onBlockClick?.(b) }}
            >
              <Block block={b} unitSize={UNIT} showAvailability={showAvailability} />
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}

/*
  COMMENT: WallCanvas contains the pan/zoom logic and fitToViewport().
  - Zoom is smooth and zooms around cursor.
  - scale limited [0.2, 5].
  - Center and fitToViewport implemented here.
*/