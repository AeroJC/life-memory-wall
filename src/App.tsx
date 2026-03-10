import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useStore } from './store/useStore'
import LoginPage from './components/LoginPage'
import SpaceSelector from './components/SpaceSelector'
import Timeline from './components/Timeline'

const INACTIVITY_MS = 5 * 60 * 1000 // 5 minutes

export default function App() {
  const { isLoggedIn, initialized, activeSpaceId, init, logout } = useStore()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restore session on mount
  useEffect(() => {
    init()
  }, [])

  // Inactivity auto-logout
  useEffect(() => {
    if (!isLoggedIn) return

    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(logout, INACTIVITY_MS)
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'] as const
    events.forEach((e) => window.addEventListener(e, reset))
    reset()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach((e) => window.removeEventListener(e, reset))
    }
  }, [isLoggedIn])

  if (!initialized) {
    return (
      <div className="min-h-screen gradient-bg flex flex-col items-center justify-center gap-6">
        {/* App icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gold/80 to-coral/70 flex items-center justify-center shadow-lg">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="14" stroke="white" strokeWidth="2.5" opacity="0.9" />
              <circle cx="20" cy="20" r="8" stroke="white" strokeWidth="2" opacity="0.7" />
              <circle cx="20" cy="20" r="3" fill="white" opacity="0.9" />
            </svg>
          </div>
          {/* Spinner ring around icon */}
          <div className="absolute -inset-2 rounded-[1.25rem] border-2 border-gold/20 border-t-gold/60 animate-spin" style={{ animationDuration: '1.5s' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <h1 className="font-serif text-2xl text-warmDark mb-1">My Inner Circle</h1>
          <p className="font-handwriting text-xl text-warmDark/70">Restoring your moments...</p>
        </motion.div>
      </div>
    )
  }

  if (!isLoggedIn) return <LoginPage />

  if (activeSpaceId) {
    return (
      <motion.div key={`space-${activeSpaceId}`} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.4 } }}>
        <Timeline />
      </motion.div>
    )
  }

  return (
    <motion.div key="selector" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.4 } }}>
      <SpaceSelector />
    </motion.div>
  )
}
