import { motion } from 'framer-motion'
import { Bell, X, Heart, Camera, UserPlus, MessageCircle, ChevronRight } from 'lucide-react'
import { useState } from 'react'

/**
 * Preview-only component — shows different notification styles for group spaces.
 * Delete this file after choosing a style.
 */

const sampleNotifs = [
  { id: 1, icon: <Camera className="w-4 h-4" />, user: 'Nikhil', action: 'added 3 photos to', target: 'Beach Trip 2026', time: '2m ago', avatar: 'N' },
  { id: 2, icon: <Heart className="w-4 h-4" />, user: 'Priya', action: 'reacted to your moment in', target: 'Family Dinner', time: '15m ago', avatar: 'P' },
  { id: 3, icon: <UserPlus className="w-4 h-4" />, user: 'Rahul', action: 'wants to join', target: 'College Friends', time: '1h ago', avatar: 'R' },
  { id: 4, icon: <MessageCircle className="w-4 h-4" />, user: 'Sneha', action: 'added a moment to', target: 'Road Trip Memories', time: '3h ago', avatar: 'S' },
]

/* ── Style 1: Toast / Snackbar (top slide-down) ── */
function ToastStyle() {
  const n = sampleNotifs[0]
  return (
    <div className="relative h-32 bg-warmWhite rounded-2xl overflow-hidden border border-warmMid/10">
      <p className="text-[10px] text-warmDark/40 text-center mt-2 font-sans uppercase tracking-wider">Toast / Snackbar</p>
      <motion.div
        initial={{ y: -60 }} animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
        className="mx-3 mt-2 bg-warmDark rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-coral flex items-center justify-center text-white text-xs font-bold shrink-0">{n.avatar}</div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs truncate"><span className="font-semibold">{n.user}</span> {n.action} <span className="text-gold">{n.target}</span></p>
          <p className="text-white/50 text-[10px]">{n.time}</p>
        </div>
        <X className="w-4 h-4 text-white/40 shrink-0" />
      </motion.div>
    </div>
  )
}

/* ── Style 2: Bell dropdown panel ── */
function BellDropdownStyle() {
  return (
    <div className="relative h-72 bg-warmWhite rounded-2xl overflow-hidden border border-warmMid/10">
      <p className="text-[10px] text-warmDark/40 text-center mt-2 font-sans uppercase tracking-wider">Bell Dropdown</p>
      <div className="flex justify-end px-4 mt-2">
        <div className="relative">
          <Bell className="w-5 h-5 text-warmDark" />
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-coral rounded-full text-white text-[9px] font-bold flex items-center justify-center">4</span>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mx-3 mt-2 bg-white rounded-xl shadow-xl border border-warmMid/10 overflow-hidden"
      >
        {sampleNotifs.map((n, i) => (
          <div key={n.id} className={`flex items-center gap-2.5 px-3 py-2.5 ${i > 0 ? 'border-t border-warmMid/5' : ''} ${i === 0 ? 'bg-gold/5' : ''}`}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold/80 to-coral/60 flex items-center justify-center text-white text-[10px] font-bold shrink-0">{n.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-warmDark text-[11px] truncate"><span className="font-semibold">{n.user}</span> {n.action} <span className="font-medium text-gold">{n.target}</span></p>
              <p className="text-warmDark/40 text-[9px]">{n.time}</p>
            </div>
            <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center shrink-0">{n.icon}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/* ── Style 3: Inline banner (inside the space card) ── */
function InlineBannerStyle() {
  const n = sampleNotifs[0]
  return (
    <div className="relative h-40 bg-warmWhite rounded-2xl overflow-hidden border border-warmMid/10 p-3">
      <p className="text-[10px] text-warmDark/40 text-center font-sans uppercase tracking-wider">Inline Banner</p>
      {/* Fake space card */}
      <div className="mt-2 bg-gradient-to-br from-purple-200/60 to-pink-200/60 rounded-xl p-3 relative">
        <p className="font-serif text-sm font-bold text-warmDark">Beach Trip 2026</p>
        <p className="text-[10px] text-warmDark/50">3 members</p>
        {/* Notification banner */}
        <motion.div
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.5 }}
          className="mt-2 bg-white/80 backdrop-blur rounded-lg px-3 py-2 flex items-center gap-2 border border-gold/20"
        >
          <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
            <Camera className="w-3 h-3 text-gold" />
          </div>
          <p className="text-warmDark text-[10px] flex-1 truncate"><span className="font-semibold">{n.user}</span> added 3 photos</p>
          <span className="text-warmDark/30 text-[9px] shrink-0">{n.time}</span>
        </motion.div>
      </div>
    </div>
  )
}

/* ── Style 4: Bottom sheet / slide-up panel ── */
function BottomSheetStyle() {
  return (
    <div className="relative h-72 bg-warmWhite rounded-2xl overflow-hidden border border-warmMid/10">
      <p className="text-[10px] text-warmDark/40 text-center mt-2 font-sans uppercase tracking-wider">Bottom Sheet</p>
      <div className="absolute bottom-0 left-0 right-0">
        <motion.div
          initial={{ y: 100 }} animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0.4 }}
          className="bg-white rounded-t-2xl shadow-2xl border-t border-warmMid/10 px-4 pt-3 pb-4"
        >
          <div className="w-10 h-1 bg-warmMid/20 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-sm font-bold text-warmDark">Notifications</h3>
            <span className="text-[10px] text-gold font-semibold">Mark all read</span>
          </div>
          {sampleNotifs.slice(0, 3).map((n, i) => (
            <div key={n.id} className={`flex items-center gap-2.5 py-2 ${i > 0 ? 'border-t border-warmMid/5' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/80 to-coral/60 flex items-center justify-center text-white text-xs font-bold shrink-0">{n.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-warmDark text-[11px] truncate"><span className="font-semibold">{n.user}</span> {n.action} <span className="font-medium text-gold">{n.target}</span></p>
                <p className="text-warmDark/40 text-[9px]">{n.time}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-warmDark/20 shrink-0" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

/* ── Style 5: Floating badge with expandable list ── */
function FloatingBadgeStyle() {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="relative h-64 bg-warmWhite rounded-2xl overflow-hidden border border-warmMid/10">
      <p className="text-[10px] text-warmDark/40 text-center mt-2 font-sans uppercase tracking-wider">Floating Badge</p>
      <div className="absolute bottom-4 right-4">
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute bottom-14 right-0 w-56 bg-white rounded-xl shadow-2xl border border-warmMid/10 overflow-hidden mb-2"
            >
              {sampleNotifs.slice(0, 3).map((n, i) => (
                <div key={n.id} className={`flex items-center gap-2 px-3 py-2 ${i > 0 ? 'border-t border-warmMid/5' : ''}`}>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold/80 to-coral/60 flex items-center justify-center text-white text-[9px] font-bold shrink-0">{n.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-warmDark text-[10px] truncate"><span className="font-semibold">{n.user}</span> {n.action}</p>
                    <p className="text-warmDark/40 text-[9px]">{n.time}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setExpanded(!expanded)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-coral shadow-lg flex items-center justify-center relative"
        >
          <Bell className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">4</span>
        </motion.button>
      </div>
    </div>
  )
}

/* ── Style 6: Full-width activity feed ── */
function ActivityFeedStyle() {
  return (
    <div className="relative bg-warmWhite rounded-2xl overflow-hidden border border-warmMid/10 p-3">
      <p className="text-[10px] text-warmDark/40 text-center font-sans uppercase tracking-wider mb-2">Activity Feed</p>
      <div className="space-y-1.5">
        {sampleNotifs.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: n.id * 0.15 }}
            className="flex items-center gap-3 bg-white/70 rounded-xl px-3 py-2.5 border border-warmMid/5"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/80 to-coral/60 flex items-center justify-center text-white text-xs font-bold shrink-0">{n.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-warmDark text-xs"><span className="font-semibold">{n.user}</span> {n.action} <span className="font-medium text-gold">{n.target}</span></p>
              <p className="text-warmDark/35 text-[10px] mt-0.5">{n.time}</p>
            </div>
            <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center shrink-0 text-gold">{n.icon}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

import { AnimatePresence } from 'framer-motion'

export default function NotificationPreviews() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-warmWhite to-peach/20 p-4 pb-20">
      <h1 className="font-serif text-xl font-bold text-warmDark text-center mb-1">Notification Styles</h1>
      <p className="font-sans text-xs text-warmDark/50 text-center mb-6">Pick a style for group space notifications</p>

      <div className="max-w-md mx-auto space-y-6">
        <ToastStyle />
        <BellDropdownStyle />
        <InlineBannerStyle />
        <BottomSheetStyle />
        <FloatingBadgeStyle />
        <ActivityFeedStyle />
      </div>
    </div>
  )
}
