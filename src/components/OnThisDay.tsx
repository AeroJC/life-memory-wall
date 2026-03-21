import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { api } from '../api'
import { OnThisDayMemory } from '../types'
import { thumbnailUrl } from '../cloudinary'

interface Props {
  onMemoryClick?: (spaceId: string, memoryId: string) => void
}

export default function OnThisDay({ onMemoryClick }: Props) {
  const [memories, setMemories] = useState<OnThisDayMemory[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIdx, setCurrentIdx] = useState(0)

  useEffect(() => {
    let cancelled = false
    api.getOnThisDay()
      .then((data) => {
        if (!cancelled) {
          setMemories(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  if (loading || memories.length === 0) return null

  const memory = memories[currentIdx]
  const hasMultiple = memories.length > 1
  const coverPhoto = memory.photos?.[0]

  const today = new Date()
  const dateLabel = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-4 mb-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/30 to-coral/20 flex items-center justify-center">
          <Calendar className="w-4 h-4 text-gold" />
        </div>
        <div>
          <h3 className="font-serif text-sm text-warmDark font-medium">On This Day</h3>
          <p className="text-xs text-warmDark/50 font-sans">{dateLabel}</p>
        </div>
        {hasMultiple && (
          <span className="ml-auto text-xs text-warmDark/40 font-sans">
            {currentIdx + 1} of {memories.length}
          </span>
        )}
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={memory.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-2xl overflow-hidden bg-white/60 border border-warmMid/10 shadow-md cursor-pointer"
          onClick={() => onMemoryClick?.(memory.spaceId, memory.id)}
        >
          {coverPhoto && (
            <div className="h-36 overflow-hidden">
              <img
                src={thumbnailUrl(coverPhoto)}
                alt={memory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          )}

          <div className={`p-3 ${coverPhoto ? 'absolute bottom-0 left-0 right-0' : ''}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`font-handwriting text-sm ${coverPhoto ? 'text-white/90' : 'text-gold'}`}>
                {memory.yearsAgo} year{memory.yearsAgo !== 1 ? 's' : ''} ago
              </span>
              <span className={`text-xs ${coverPhoto ? 'text-white/50' : 'text-warmDark/30'}`}>·</span>
              <span className={`text-xs font-sans ${coverPhoto ? 'text-white/70' : 'text-warmDark/50'}`}>
                {memory.spaceTitle}
              </span>
            </div>
            <h4 className={`font-serif text-base leading-snug ${coverPhoto ? 'text-white' : 'text-warmDark'}`}>
              {memory.title}
            </h4>
            {memory.location && (
              <div className={`flex items-center gap-1 mt-1 text-xs ${coverPhoto ? 'text-white/60' : 'text-warmDark/40'}`}>
                <MapPin className="w-3 h-3" />
                {memory.location}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      {hasMultiple && (
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            onClick={(e) => { e.stopPropagation(); setCurrentIdx((i) => Math.max(0, i - 1)) }}
            disabled={currentIdx === 0}
            className="p-1 rounded-full text-warmDark/40 hover:text-warmDark disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1.5">
            {memories.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentIdx(i) }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIdx ? 'bg-gold w-4' : 'bg-warmDark/15'}`}
              />
            ))}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setCurrentIdx((i) => Math.min(memories.length - 1, i + 1)) }}
            disabled={currentIdx === memories.length - 1}
            className="p-1 rounded-full text-warmDark/40 hover:text-warmDark disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  )
}
