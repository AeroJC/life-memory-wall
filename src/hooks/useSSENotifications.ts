import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { createNotificationStream } from '../utils/sseClient'
import type { SSENotificationEvent } from '../types'

const MAX_ERRORS = 5
const FALLBACK_POLL_INTERVAL = 60000 // 60s fallback polling

/**
 * React hook that manages an SSE connection for real-time notifications.
 * Falls back to slow polling after repeated SSE errors.
 */
export function useSSENotifications() {
  const isLoggedIn = useStore((s) => s.isLoggedIn)
  const handleSSENotification = useStore((s) => s.handleSSENotification)
  const fetchNotificationSummary = useStore((s) => s.fetchNotificationSummary)
  const errorCount = useRef(0)

  useEffect(() => {
    if (!isLoggedIn) return

    const token = localStorage.getItem('token')
    if (!token) return

    let eventSource: EventSource | null = null
    let fallbackInterval: ReturnType<typeof setInterval> | null = null

    function connect() {
      eventSource = createNotificationStream(token!)

      eventSource.addEventListener('connected', () => {
        errorCount.current = 0
        // Sync full state on (re)connect
        fetchNotificationSummary()
      })

      eventSource.addEventListener('notification', (e: MessageEvent) => {
        errorCount.current = 0
        try {
          const data: SSENotificationEvent = JSON.parse(e.data)
          handleSSENotification(data)
        } catch {
          // Ignore malformed events
        }
      })

      eventSource.onerror = () => {
        errorCount.current++
        if (errorCount.current >= MAX_ERRORS) {
          // Give up on SSE and fall back to slow polling
          eventSource?.close()
          eventSource = null
          fallbackInterval = setInterval(fetchNotificationSummary, FALLBACK_POLL_INTERVAL)
        }
        // Otherwise EventSource auto-reconnects natively
      }
    }

    connect()

    return () => {
      eventSource?.close()
      eventSource = null
      if (fallbackInterval) clearInterval(fallbackInterval)
    }
  }, [isLoggedIn, handleSSENotification, fetchNotificationSummary])
}
