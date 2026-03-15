import { motion } from 'framer-motion'
import { MapPin, MessageCircle, Trash2, Edit3 } from 'lucide-react'
import { useState } from 'react'
import { Memory, SpaceMember } from '../types'
import { thumbnailUrl } from '../cloudinary'

interface Props {
  memory: Memory
  index: number
  side: 'left' | 'right'
  onDelete: (id: string) => void
  onReact: (id: string, emoji: string) => void
  onEdit: (memory: Memory) => void
  onCardClick: (memory: Memory) => void
  spaceType?: 'personal' | 'group'
  members?: SpaceMember[]
  canEdit?: boolean
}

const reactionEmojis = ['\u2764\uFE0F', '\ud83e\udd7a', '\ud83d\ude02', '\ud83d\ude0d', '\ud83c\udf89', '\ud83d\udd25']

function getEmojiForTag(tag?: string) {
  const map: Record<string, string> = {
    pets: '\ud83d\udc31', luna: '\ud83d\udc31', travel: '\ud83c\udf0a', beach: '\ud83c\udf0a',
    career: '\ud83d\udcbc', graduation: '\ud83c\udf93', startup: '\ud83d\udca1', idea: '\ud83d\udca1',
    birthday: '\ud83c\udf82', hackathon: '\ud83d\udcbb', arrival: '\u2708\uFE0F',
    market: '\ud83d\udea3', lanterns: '\ud83c\udfee',
  }
  return tag ? map[tag] || '\u2728' : '\u2728'
}

export default function MemoryCard({ memory, index, side, onDelete, onReact, onEdit, onCardClick, spaceType, members, canEdit = true }: Props) {
  const [showReactions, setShowReactions] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const rotation = side === 'left' ? -1.5 : 1.5

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const gradients = [
    'bg-gradient-to-br from-lavender/80 to-teal/30',
    'bg-gradient-to-br from-peach/80 to-coral/30',
    'bg-gradient-to-br from-teal/40 to-lavender/60',
    'bg-gradient-to-br from-gold/30 to-peach/60',
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -60 : 60, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
      className={`flex ${side === 'right' ? 'md:justify-start' : 'md:justify-end'} justify-center w-full`}
    >
      <motion.div
        whileHover={{ scale: 1.02, rotate: 0 }}
        style={{ rotate: rotation }}
        className="polaroid rounded-2xl max-w-sm w-full cursor-pointer relative group"
        onClick={(e) => {
          e.stopPropagation()
          onCardClick(memory)
        }}
      >
        {/* Photo area */}
        <div className="w-full h-48 rounded-xl overflow-hidden mb-4 relative">
          {memory.photos && memory.photos.length > 0 ? (
            <>
              <img
                src={thumbnailUrl(memory.photos[0])}
                alt={memory.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {memory.photos.length > 1 && (
                <div className="absolute bottom-2 right-2 glass rounded-full px-2 py-0.5">
                  <span className="text-sm font-sans text-warmDark/70">+{memory.photos.length - 1}</span>
                </div>
              )}
            </>
          ) : (
            <div className={`w-full h-full ${gradients[index % 4]} flex items-center justify-center`}>
              <span className="text-6xl opacity-50">{getEmojiForTag(memory.tags?.[0])}</span>
            </div>
          )}
          <div className={`absolute top-3 right-3 glass rounded-full px-3 py-1 transition-all duration-300 ${canEdit ? 'group-hover:top-12' : ''}`}>
            <span className="font-handwriting text-base text-warmDark">{formatDate(memory.date)}</span>
          </div>
        </div>

        <h3 className="font-serif text-xl text-warmDark mb-2 leading-tight">{memory.title}</h3>

<p className="font-sans text-base text-warmDark/75 leading-relaxed line-clamp-3">{memory.story}</p>

        {memory.location && (
          <div className="flex items-center gap-1 mt-3 text-warmDark/70">
            <MapPin className="w-3 h-3" />
            <span className="text-sm font-sans">{memory.location}</span>
          </div>
        )}

        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {memory.tags.map((tag) => (
              <span key={tag} className="text-sm bg-lavender/40 text-warmDark/75 px-2 py-1 rounded-full font-sans">
                {tag}
              </span>
            ))}
          </div>
        )}

        {memory.substories && memory.substories.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 text-gold/70">
            <div className="w-4 h-px bg-gold/40" />
            <span className="text-sm font-handwriting">
              {memory.substories.length} moments inside — tap to explore
            </span>
          </div>
        )}

        {spaceType !== 'personal' && memory.reactions && Object.keys(memory.reactions).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries(memory.reactions).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={(e) => { e.stopPropagation(); onReact(memory.id, emoji) }}
                className="flex items-center gap-1 bg-white/60 rounded-full px-2 py-1 hover:bg-white/80 transition-colors"
              >
                <span className="text-sm">{emoji}</span>
                <span className="text-sm text-warmDark/70">{count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Hover actions — hidden for view-only members */}
        {canEdit && (
          <>
            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(memory) }}
                className="glass rounded-full p-2 hover:bg-white/80 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-warmDark/70" />
              </button>
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <button
                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true) }}
                className="glass rounded-full p-2 hover:bg-coral/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-coral" />
              </button>
            </div>
          </>
        )}

        {/* Delete confirmation overlay */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 rounded-2xl bg-warmDark/60 backdrop-blur-sm flex flex-col items-center justify-center p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6 text-coral" />
            </div>
            <h4 className="font-serif text-lg text-white mb-1">Delete this memory?</h4>
            <p className="font-sans text-sm text-white/70 text-center mb-5">
              "{memory.title}" will be gone forever.
              {memory.substories && memory.substories.length > 0 && ` All ${memory.substories.length} moments inside will be lost.`}
            </p>
            <div className="flex gap-3 w-full max-w-[240px]">
              <button
                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(false) }}
                className="flex-1 py-2.5 rounded-xl bg-white/20 text-white font-sans text-sm hover:bg-white/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(memory.id); setShowDeleteConfirm(false) }}
                className="flex-1 py-2.5 rounded-xl bg-coral text-white font-sans text-sm hover:bg-coral/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        )}

        {/* Reaction picker — group spaces only */}
        {spaceType !== 'personal' && (
          <div className="mt-3 flex items-center gap-2">
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowReactions(!showReactions) }}
                className="text-warmDark/75 hover:text-warmDark/75 text-sm transition-colors flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="font-handwriting">react</span>
              </button>
              {showReactions && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute bottom-full left-0 mb-2 glass rounded-full px-2 py-1 flex gap-1 z-20"
                >
                  {reactionEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={(e) => { e.stopPropagation(); onReact(memory.id, emoji); setShowReactions(false) }}
                      className="hover:scale-125 transition-transform text-lg p-1"
                    >
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
