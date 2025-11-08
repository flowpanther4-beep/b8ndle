import Link from 'next/link'
import React from 'react'

export default function TopBanner({ onModerationToggle, moderation }: { onModerationToggle?: (v: boolean) => void; moderation?: boolean }) {
  return (
    <header className="w-full">
      {/* Banner amarillo retro */}
      <div className="w-full bg-retroYellow text-black px-4 py-3 flex items-center justify-between" role="banner" aria-label="Brand Space banner">
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold tracking-wide">
            Brand Space™ – 1,000,000 pixels – $1 per pixel – Reserve your name worldwide!
          </div>
        </div>
        <nav aria-label="Main menu" className="hidden md:flex gap-4">
          <Link href="/"><a className="hover:underline">Homepage</a></Link>
          <Link href="/buy"><a className="hover:underline">Buy Space</a></Link>
          <Link href="/faq"><a className="hover:underline">FAQ</a></Link>
          <Link href="/blog"><a className="hover:underline">Blog</a></Link>
          <Link href="/contact"><a className="hover:underline">Contact</a></Link>
          <Link href="/directory"><a className="hover:underline">Directory</a></Link>
          <Link href="/press"><a className="hover:underline">Press</a></Link>
        </nav>
        <div className="flex items-center gap-3">
          <label className="text-xs mr-2">Moderation</label>
          <input aria-label="Moderation toggle" type="checkbox" checked={moderation} onChange={(e)=>onModerationToggle?.(e.target.checked)} />
        </div>
      </div>

      {/* Secondary nav (mobile) */}
      <div className="md:hidden bg-black text-white text-xs px-3 py-2 flex gap-3 overflow-x-auto">
        <Link href="/"><a className="whitespace-nowrap">Homepage</a></Link>
        <Link href="/buy"><a className="whitespace-nowrap">Buy Space</a></Link>
        <Link href="/faq"><a className="whitespace-nowrap">FAQ</a></Link>
        <Link href="/blog"><a className="whitespace-nowrap">Blog</a></Link>
        <Link href="/contact"><a className="whitespace-nowrap">Contact</a></Link>
        <Link href="/directory"><a className="whitespace-nowrap">Directory</a></Link>
        <Link href="/press"><a className="whitespace-nowrap">Press</a></Link>
      </div>
    </header>
  )
}

/*
  COMMENT: This component defines the yellow retro banner and menu.
  Replace text here to change branding. It's located at components/TopBanner.tsx
*/