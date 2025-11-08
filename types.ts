export type Kind = 'brand' | 'name' | 'profile' | 'ad'
export type Status = 'available' | 'reserved' | 'paid' | 'approved' | 'rejected'

export type Block = {
  id: string
  x: number // grid units 0..999
  y: number
  w: number
  h: number
  kind: Kind
  title: string
  text?: string
  href?: string
  img_url?: string
  theme_bg?: string
  theme_fg?: string
  status: Status
  category?: string
}

export type BlockDraft = {
  x: number
  y: number
  w: number
  h: number
  title: string
  text?: string
  href?: string
  img_url?: string
  kind?: Kind
  category?: string
  theme_bg?: string
  theme_fg?: string
}

export type QuoteResponse = {
  price_cents: number
  breakdown?: { base: number; zoneMultiplier: number; area: number }
}