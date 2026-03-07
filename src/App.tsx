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
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-gold/40 border-t-gold animate-spin" />
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
