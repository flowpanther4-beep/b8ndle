import type { Block } from '../types'

// Seeded, deterministic pseudo-random generator
function mulberry32(a: number) {
  return function () {
    var t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(123456)

// Simple palette for blocks
const palettes = ['#FF4444', '#4477FF', '#22CC66', '#00CCCC', '#FFCC00', '#AA44FF']

// Some sample logos from public CDNs
const sampleLogos = [
  'https://upload.wikimedia.org/wikipedia/commons/4/44/Googlelogo.png',
  'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
  'https://upload.wikimedia.org/wikipedia/commons/6/69/Spotify_logo_with_text.svg',
  'https://upload.wikimedia.org/wikipedia/commons/0/08/Amazon_logo.svg'
]

// Categories pool
const categories = ['tech', 'food', 'fashion', 'services', 'creator']

// Generate ~190 blocks (approx 150 occupied + 40 available)
export function generateBlocks(): Block[] {
  const blocks: Block[] = []
  // create some larger brand tiles first
  const brandSizes = [
    { w: 20, h: 10 },
    { w: 12, h: 8 },
    { w: 8, h: 8 },
    { w: 6, h: 4 }
  ]
  let idCounter = 1

  function placeBlock(w: number, h: number, kind: Block['kind'], status: Block['status']) {
    // try to place without overlap by sampling positions
    for (let attempt = 0; attempt < 200; attempt++) {
      const x = Math.floor(rand() * (1000 - w))
      const y = Math.floor(rand() * (1000 - h))
      const candidate = { x, y, w, h }
      const overlap = blocks.some(b => {
        return !(candidate.x + candidate.w <= b.x || b.x + b.w <= candidate.x || candidate.y + candidate.h <= b.y || b.y + b.h <= candidate.y)
      })
      if (!overlap) {
        const hasImg = kind === 'brand' && rand() < 0.6
        const block: Block = {
          id: String(idCounter++),
          x,
          y,
          w,
          h,
          kind,
          title: kind === 'brand' ? `Brand ${idCounter}` : kind === 'profile' ? `@user${idCounter}` : kind === 'ad' ? `Ad ${idCounter}` : `Name ${idCounter}`,
          text: kind === 'profile' ? `Creator · ${categories[Math.floor(rand() * categories.length)]}` : `Sample description ${idCounter}`,
          href: hasImg ? `https://example.com/${idCounter}` : undefined,
          img_url: hasImg ? sampleLogos[Math.floor(rand() * sampleLogos.length)] : undefined,
          theme_bg: palettes[Math.floor(rand() * palettes.length)],
          theme_fg: '#ffffff',
          status,
          category: categories[Math.floor(rand() * categories.length)]
        }
        blocks.push(block)
        return
      }
    }
    // fallback: push off-grid (rare)
  }

  // populate occupied (approx 150)
  for (let i = 0; i < 150; i++) {
    const size = brandSizes[Math.floor(rand() * brandSizes.length)]
    const kinds: Block['kind'][] = ['brand', 'name', 'profile', 'ad']
    const kind = kinds[Math.floor(rand() * kinds.length)]
    // mostly approved/paid
    const statusRand = rand()
    const status: Block['status'] = statusRand < 0.7 ? 'approved' : statusRand < 0.9 ? 'paid' : 'reserved'
    placeBlock(size.w, size.h, kind, status)
  }

  // populate available (approx 40) with creative messages later in UI
  for (let i = 0; i < 40; i++) {
    const presets = [
      { w: 6, h: 4 },
      { w: 8, h: 8 },
      { w: 4, h: 2 },
      { w: 12, h: 6 }
    ]
    const p = presets[Math.floor(rand() * presets.length)]
    placeBlock(p.w, p.h, 'name', 'available')
  }

  // some special big brand at top-left to look nice
  blocks.push({
    id: String(idCounter++),
    x: 20,
    y: 12,
    w: 30,
    h: 12,
    kind: 'brand',
    title: 'Flagship Brand',
    text: 'Premium placement - sample',
    href: 'https://example.com/flagship',
    img_url: sampleLogos[0],
    theme_bg: '#FF6A00',
    theme_fg: '#111',
    status: 'approved',
    category: 'tech'
  })

  return blocks
}

export const seededBlocks = generateBlocks()