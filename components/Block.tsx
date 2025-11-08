import React from 'react'
import type { Block as BlockType } from '../types'

export default function Block({ block, unitSize = 10, showAvailability }: { block: BlockType; unitSize?: number; showAvailability?: boolean }) {
  // position and size in px (unit = 10px)
  const style: React.CSSProperties = {
    left: block.x * unitSize,
    top: block.y * unitSize,
    width: block.w * unitSize,
    height: block.h * unitSize,
    background: block.img_url ? `linear-gradient(180deg, ${block.theme_bg} 0%, rgba(0,0,0,0.05) 100%)` : block.theme_bg || '#333',
    color: block.theme_fg || '#fff'
  }

  const isAvailable = block.status === 'available'

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${block.title} ${block.status}`}
      className={`absolute overflow-hidden rounded-sm shadow-lg transform-gpu`}
      style={style}
      data-id={block.id}
    >
      {block.img_url ? (
        <img src={block.img_url} alt={block.title} className="w-full h-full object-contain p-1 bg-white" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-sm font-bold text-center px-1" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
          {block.title}
        </div>
      )}

      {showAvailability && isAvailable && (
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
          {/* Creative available banner */}
          <div className="mt-1 px-2 py-0.5 rounded-full text-xs font-bold text-black bg-white/90 animate-pulseFast border-2 border-dashed border-white/20 shadow-sm">
            AVAILABLE NOW
          </div>
        </div>
      )}

      {/* Small status dot */}
      <div style={{ position: 'absolute', right: 4, bottom: 4, width: 10, height: 10, borderRadius: 12, background: statusToColor(block.status) }} title={block.status} />
    </div>
  )
}

function statusToColor(s: string) {
  switch (s) {
    case 'available': return '#2ecc71'
    case 'reserved': return '#f39c12'
    case 'paid': return '#9b59b6'
    case 'approved': return '#2980b9'
    case 'rejected': return '#e74c3c'
    default: return '#aaa'
  }
}

/*
  COMMENT: Block rendering and the "AVAILABLE NOW" overlay
  - The availability overlay is defined here (showAvailability prop).
  - Replace messages/styles with different copy/pulse under this file.
*/