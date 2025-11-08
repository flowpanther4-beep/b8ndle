import type { NextApiRequest, NextApiResponse } from 'next'
import { seededBlocks } from '../../lib/blocksData'
import { isOverlapping } from '../../utils/geom'

// POST /api/availability {x,y,w,h} -> {ok, conflicts:[ids...]}
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  const { x, y, w, h } = req.body as { x: number, y: number, w: number, h: number }
  if (typeof x !== 'number' || typeof y !== 'number') {
    res.status(400).json({ error: 'Invalid payload' })
    return
  }

  // Anti-overlap check (AABB)
  // NOTE: This is the server side validation for overlapping placements.
  const conflicts = seededBlocks.filter(b => b.status !== 'available' && isOverlapping({ x, y, w, h }, b)).map(b => b.id)
  res.status(200).json({ ok: conflicts.length === 0, conflicts })
}

/*
  COMMENT: This is the server mock for availability.
  Replace by querying your DB (Supabase) and using same isOverlapping util.
*/