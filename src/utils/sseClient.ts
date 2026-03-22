import { getBaseUrl } from '../api'

/**
 * Create an EventSource connection to the SSE notification stream.
 * Uses query param auth since EventSource doesn't support custom headers.
 */
export function createNotificationStream(token: string): EventSource {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/notifications/stream?token=${encodeURIComponent(token)}`
  return new EventSource(url)
}
