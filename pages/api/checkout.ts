import type { NextApiRequest, NextApiResponse } from 'next'

// POST /api/checkout {draft} -> {url:"/checkout-mock"}
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  const { draft } = req.body
  // In a real integration, create a Stripe Checkout session and return session.url
  // For demo, return a mock URL and pretend checkout is started.
  res.status(200).json({ url: '/checkout-mock', draft })
}

/*
  COMMENT: This mock endpoint should be replaced with server-side Stripe Checkout creation.
  Keep note: include draft details and persist to DB (Supabase) as pending reservation.
*/