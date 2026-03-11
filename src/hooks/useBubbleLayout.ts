import { useMemo } from 'react'
import { MemorySpace } from '../types'

export interface BubblePosition {
  x: number      // center x relative to container center
  y: number      // center y relative to container center
  radius: number
  spaceId: string
}

export interface BubbleLayout {
  bubbles: BubblePosition[]
  containerHeight: number
}

function computeScore(space: MemorySpace): number {
  const now = Date.now()
  let recencyScore = 0
  if (space.memories?.length) {
    const mostRecent = Math.max(...space.memories.map(m => new Date(m.date).getTime()))
    recencyScore = Math.max(0, 1 - (now - mostRecent) / (30 * 24 * 60 * 60 * 1000))
  }
  const count = space.memories?.length || space.memoryCount || 0
  const countScore = Math.min(count, 50) / 50
  const memberScore = Math.min(space.membersList?.length || 0, 10) / 10
  const raw = recencyScore * 0.5 + countScore * 0.3 + memberScore * 0.2
  return Math.max(raw, 0.1)
}

function scoreToRadius(score: number): number {
  // Wide range: 50px (small) to 100px (large) radius
  if (score > 0.6) return 75 + ((score - 0.6) / 0.4) * 25   // 75–100
  if (score > 0.3) return 55 + ((score - 0.3) / 0.3) * 20   // 55–75
  return 40 + (score / 0.3) * 15                              // 40–55
}

function packBubbles(items: { id: string; score: number }[]): BubblePosition[] {
  const sorted = [...items].sort((a, b) => b.score - a.score)
  const positions: BubblePosition[] = []
  const gap = 20  // gap between circle edges

  for (const item of sorted) {
    const radius = scoreToRadius(item.score)

    if (positions.length === 0) {
      positions.push({ x: 0, y: 0, radius, spaceId: item.id })
      continue
    }

    let placed = false
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))
    for (let dist = radius; dist < 1200; dist += 3) {
      for (let step = 0; step < 20; step++) {
        const angle = goldenAngle * (step + dist * 0.03)
        const x = Math.cos(angle) * dist
        const y = Math.sin(angle) * dist

        const overlaps = positions.some(p => {
          const dx = p.x - x
          const dy = p.y - y
          return Math.sqrt(dx * dx + dy * dy) < p.radius + radius + gap
        })

        if (!overlaps) {
          positions.push({ x, y, radius, spaceId: item.id })
          placed = true
          break
        }
      }
      if (placed) break
    }

    if (!placed) {
      const last = positions[positions.length - 1]
      positions.push({ x: last.x + radius * 2 + gap, y: 0, radius, spaceId: item.id })
    }
  }

  return positions
}

export function useBubbleLayout(
  spaces: MemorySpace[],
  containerWidth: number,
  availableHeight: number,
  isMobile: boolean
): BubbleLayout {
  return useMemo(() => {
    if (spaces.length === 0) {
      return { bubbles: [], containerHeight: availableHeight }
    }

    const items = spaces.map(s => ({ id: s.id, score: computeScore(s) }))
    items.push({ id: '__new_space__', score: 0.05 })

    const raw = packBubbles(items)

    // Compute bounding box
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
    for (const b of raw) {
      minX = Math.min(minX, b.x - b.radius)
      maxX = Math.max(maxX, b.x + b.radius)
      minY = Math.min(minY, b.y - b.radius)
      maxY = Math.max(maxY, b.y + b.radius)
    }

    // Re-center so bounding box is centered at (0, 0)
    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2
    const centered = raw.map(b => ({ ...b, x: b.x - cx, y: b.y - cy }))

    const layoutW = maxX - minX
    const layoutH = maxY - minY

    // Use separate x/y scale so bubbles fill the full width
    // Radii scale by the smaller of the two to stay circular
    const labelH = 40 // space reserved below each bubble for text
    const scaleX = (containerWidth * 0.92) / layoutW
    const scaleY = ((availableHeight - labelH) * 0.88) / (layoutH + labelH)
    const radiusScale = Math.min(scaleX, scaleY, 1.2)

    const bubbles = centered.map(b => ({
      ...b,
      x: b.x * scaleX,
      y: b.y * scaleY,
      radius: b.radius * radiusScale,
    }))

    return { bubbles, containerHeight: availableHeight }
  }, [spaces, containerWidth, availableHeight, isMobile])
}
