import type { NextApiRequest, NextApiResponse } from 'next'
import { seededBlocks } from '../../lib/blocksData'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET /api/blocks?status=approved|taken|all
  const { status } = req.query
  if (req.method === 'GET') {
    let list = seededBlocks
    if (status && typeof status === 'string') {
      if (status === 'approved') list = seededBlocks.filter(b => b.status === 'approved' || b.status === 'paid')
      else if (status === 'taken') list = seededBlocks.filter(b => b.status !== 'available')
    }
    res.status(200).json(list)
    return
  }
  res.status(405).json({ error: 'Method not allowed' })
}

/*
  COMMENT: Replace this handler to fetch blocks from Supabase or your DB.
  This mock returns the seeded in-memory list.
*/