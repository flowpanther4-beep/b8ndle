import type { Block } from '../types'

// Anti-solape AABB utility (used by both frontend and server mocks).
// This function checks axis-aligned bounding box overlap for blocks defined in grid units.
// Note: blocks are at integer grid positions; we treat w/h as units.
export function isOverlapping(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) {
  // AABB overlap: no overlap if one is entirely left/right/top/bottom of the other
  if (a.x + a.w <= b.x) return false
  if (b.x + b.w <= a.x) return false
  if (a.y + a.h <= b.y) return false
  if (b.y + b.h <= a.y) return false
  return true
}

// Determine zone for pricing by Y coordinate (0..999)
export function zoneMultiplierForY(y: number, h: number) {
  const centerStart = 350
  const centerEnd = 650
  const topEnd = 200
  if (y + h <= topEnd) return 1.4
  if (y >= centerStart && y + h <= centerEnd) return 1.2
  return 1.0
}