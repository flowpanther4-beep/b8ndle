import type { NextApiRequest, NextApiResponse } from 'next'

// POST /api/stripe-webhook -> placeholder that would mark draft paid->approved
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // This is a placeholder. In production you must verify stripe signature and event types.
  // Here we just echo and return 200.
  console.log('stripe-webhook (mock) payload:', req.body)
  res.status(200).json({ received: true })
}

/*
  COMMENT: Implement real Stripe webhook handling here to mark a draft as paid and then approved.
*/