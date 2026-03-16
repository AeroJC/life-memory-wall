import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const CIRCLE_SIZE = 280

export interface CropResult {
  posX: number   // 0–100  (background-position-x %)
  posY: number   // 0–100  (background-position-y %)
  scale: number  // ≥1.0   (zoom multiplier beyond "cover")
}

interface Props {
  src: string
  initialPosX?: number
  initialPosY?: number
  initialScale?: number
  onDone: (result: CropResult) => void
  onCancel: () => void
  uploading?: boolean
}

export default function ImageCropModal({
  src,
  initialPosX = 50,
  initialPosY = 50,
  initialScale = 1,
  onDone,
  onCancel,
  uploading = false,
}: Props) {
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 })
  const [posX, setPosX] = useState(initialPosX)
  const [posY, setPosY] = useState(initialPosY)
  const [scaleMultiplier, setScaleMultiplier] = useState(Math.max(1, initialScale))
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0, basePosX: initialPosX, basePosY: initialPosY })
  const pinchRef = useRef({ lastDist: 0, baseScale: Math.max(1, initialScale) })

  useEffect(() => {
    const img = new Image()
    img.onload = () => setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
    img.src = src
  }, [src])

  // Pixel overhang at current scale — used to map drag pixels → % change
  const getOverhang = useCallback((sc: number) => {
    if (naturalSize.w === 0) return { x: 1, y: 1 }
    const coverScale = Math.max(CIRCLE_SIZE / naturalSize.w, CIRCLE_SIZE / naturalSize.h)
    return {
      x: Math.max(1, naturalSize.w * coverScale * sc - CIRCLE_SIZE),
      y: Math.max(1, naturalSize.h * coverScale * sc - CIRCLE_SIZE),
    }
  }, [naturalSize])

  const clamp = (v: number) => Math.max(0, Math.min(100, v))

  // ── Mouse drag ──────────────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    dragRef.current = { startX: e.clientX, startY: e.clientY, basePosX: posX, basePosY: posY }
  }

  useEffect(() => {
    if (!isDragging) return
    const sc = scaleMultiplier
    const onMove = (e: MouseEvent) => {
      const { x: ovX, y: ovY } = getOverhang(sc)
      const dx = e.clientX - dragRef.current.startX
      const dy = e.clientY - dragRef.current.startY
      // Only pan an axis if there is meaningful overhang (image is larger than circle in that direction)
      if (ovX > 4) setPosX(clamp(dragRef.current.basePosX - (dx / ovX) * 100))
      if (ovY > 4) setPosY(clamp(dragRef.current.basePosY - (dy / ovY) * 100))
    }
    const onUp = () => setIsDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [isDragging, scaleMultiplier, getOverhang])

  // ── Scroll zoom ─────────────────────────────────────────────────────────────
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setScaleMultiplier(s => Math.max(1, Math.min(s * (e.deltaY > 0 ? 0.92 : 1.08), 5)))
  }

  // ── Touch drag + pinch ──────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true)
      dragRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, basePosX: posX, basePosY: posY }
    } else if (e.touches.length === 2) {
      setIsDragging(false)
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      pinchRef.current = { lastDist: Math.hypot(dx, dy), baseScale: scaleMultiplier }
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    if (e.touches.length === 1 && isDragging) {
      const { x: ovX, y: ovY } = getOverhang(scaleMultiplier)
      const dx = e.touches[0].clientX - dragRef.current.startX
      const dy = e.touches[0].clientY - dragRef.current.startY
      if (ovX > 4) setPosX(clamp(dragRef.current.basePosX - (dx / ovX) * 100))
      if (ovY > 4) setPosY(clamp(dragRef.current.basePosY - (dy / ovY) * 100))
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      setScaleMultiplier(Math.max(1, Math.min(pinchRef.current.baseScale * (dist / pinchRef.current.lastDist), 5)))
    }
  }

  const onTouchEnd = () => setIsDragging(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-warmDark/60 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className="glass rounded-3xl p-6 w-full max-w-sm relative z-10 flex flex-col items-center gap-5"
        data-modal="crop"
      >
        <div className="text-center">
          <h3 className="text-lg font-serif text-warmDark font-semibold">Adjust photo</h3>
          <p className="text-xs text-warmDark/50 font-sans mt-0.5">Drag to reposition · Scroll or pinch to zoom</p>
        </div>

        {/* Circular preview — image is a background-image div with CSS transform for zoom */}
        <div
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}
          className="relative ring-4 ring-white/60 shadow-2xl select-none"
          onMouseDown={onMouseDown}
          onWheel={onWheel}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: `${posX}% ${posY}%`,
              transform: `scale(${scaleMultiplier})`,
              transformOrigin: `${posX}% ${posY}%`,
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          />
        </div>

        <div className="flex gap-3 w-full">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl text-warmDark/70 hover:bg-white/30 transition-all font-sans">
            Cancel
          </button>
          <button
            onClick={() => onDone({ posX, posY, scale: scaleMultiplier })}
            disabled={uploading}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold/80 to-coral/80 text-white font-medium font-sans flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {uploading
              ? <div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
              : <><Check className="w-4 h-4" /> Use photo</>
            }
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
