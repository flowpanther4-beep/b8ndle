import type { NextApiRequest, NextApiResponse } from 'next'
import { zoneMultiplierForY } from '../../utils/geom'

// POST /api/quote {x,y,w,h,zone} -> {price_cents}
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  const { x, y, w, h } = req.body as { x: number, y: number, w: number, h: number }
  const baseCentsPerUnit = 100 // demo base: $1.00 => 100 cents per pixel-unit (simplified)
  const area = w * h
  const multiplier = zoneMultiplierForY(y, h)
  const price_cents = Math.round(baseCentsPerUnit * area * multiplier)

  res.status(200).json({ price_cents, breakdown: { base: baseCentsPerUnit, zoneMultiplier: multiplier, area } })
}

/*
  COMMENT: Mock quote calculation. Replace with real price logic as needed.
  Zone multipliers are: top x1.4, center x1.2, rest x1.0 (demo in utils/geom.ts).
*/