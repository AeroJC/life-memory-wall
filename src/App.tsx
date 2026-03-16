import { motion } from 'framer-motion'
import React, { Suspense, lazy, useEffect, useRef } from 'react'
import { useStore } from './store/useStore'
import LoginPage from './components/LoginPage'
import { MobileLayout } from './components/MobileLayout'
import { api, setToken, setOnUnauthorized } from './api'

const SpaceSelector = lazy(() => import('./components/SpaceSelector'))
const Timeline = lazy(() => import('./components/Timeline'))

const LoadingFallback = () => (
  <div className="min-h-screen gradient-bg flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/80 to-coral/70 flex items-center justify-center shadow-lg mx-auto mb-4">
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="14" stroke="white" strokeWidth="2.5" opacity="0.9" />
          <circle cx="20" cy="20" r="8" stroke="white" strokeWidth="2" opacity="0.7" />
          <circle cx="20" cy="20" r="3" fill="white" opacity="0.9" />
        </svg>
      </div>
      <p className="font-handwriting text-xl text-warmDark/70">Loading...</p>
    </div>
  </div>
)

/* Refresh token every 6 hours while the app is active */
const TOKEN_REFRESH_MS = 6 * 60 * 60 * 1000

export default function App() {
  const { isLoggedIn, initialized, activeSpaceId, init, logout } = useStore()
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const skipNextPush = useRef(false)

  // Wire up 401 interceptor → auto-logout
  useEffect(() => {
    setOnUnauthorized(() => {
      logout()
    })
  }, [logout])

  // Restore session on mount
  useEffect(() => {
    init()
  }, [])

  // Push browser history when activeSpaceId changes
  useEffect(() => {
    if (!initialized || !isLoggedIn) return
    if (skipNextPush.current) {
      skipNextPush.current = false
      return
    }
    if (activeSpaceId) {
      window.history.pushState({ view: 'timeline', spaceId: activeSpaceId }, '')
    }
  }, [activeSpaceId, initialized, isLoggedIn])

  // Listen to browser back/forward
  useEffect(() => {
    if (!initialized || !isLoggedIn) return

    const handlePopState = (e: PopStateEvent) => {
      const state = e.state
      if (state?.view === 'timeline' && state.spaceId) {
        skipNextPush.current = true
        useStore.getState().setActiveSpace(state.spaceId)
      } else {
        // Back to spaces page
        skipNextPush.current = true
        useStore.getState().setActiveSpace(null)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [initialized, isLoggedIn])

  // Silent token refresh — keeps session alive while user is active
  useEffect(() => {
    if (!isLoggedIn) return

    const refreshToken = async () => {
      try {
        const result = await api.refreshToken()
        setToken(result.token)
      } catch {
        // If refresh fails (401/expired), the 401 interceptor handles logout
      }
    }

    // Refresh on an interval while logged in
    refreshTimer.current = setInterval(refreshToken, TOKEN_REFRESH_MS)

    // Also refresh when user returns to the app/tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshToken()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
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

  if (!isLoggedIn) return <MobileLayout><LoginPage /></MobileLayout>

  if (activeSpaceId) {
    return (
      <MobileLayout>
        <Suspense fallback={<LoadingFallback />}>
          <motion.div key={`space-${activeSpaceId}`} className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.4 } }}>
            <Timeline />
          </motion.div>
        </Suspense>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <Suspense fallback={<LoadingFallback />}>
        <motion.div key="selector" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.4 } }}>
          <SpaceSelector />
        </motion.div>
      </Suspense>
    </MobileLayout>
  )
}
