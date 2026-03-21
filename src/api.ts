import { Capacitor } from '@capacitor/core'
import type { User, MemorySpace, Memory, SubStory, PendingInvite, SpacePendingInvite, OnThisDayMemory, AppNotification } from './types'

function getBaseUrl() {
  if (Capacitor.isNativePlatform()) {
    return import.meta.env.VITE_API_URL_NATIVE || 'https://your-production-api.com/api'
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
}

const BASE_URL = getBaseUrl()

function getToken(): string | null {
  return localStorage.getItem('token')
}

export function setToken(token: string) {
  localStorage.setItem('token', token)
}

export function clearToken() {
  localStorage.removeItem('token')
}

/** Callback invoked on 401 — set by the store to trigger logout */
let onUnauthorized: (() => void) | null = null
export function setOnUnauthorized(cb: () => void) {
  onUnauthorized = cb
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const method = (options.method || 'GET').toUpperCase()
  const maxAttempts = method === 'GET' ? 3 : 1

  let lastError: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        const err = new Error(body.error || `Request failed: ${res.status}`) as any
        err.status = res.status
        Object.assign(err, body)

        // On 401, clear token and notify store (unless this IS the refresh call or a PIN/OTP verification)
        const isVaultEndpoint = path === '/auth/vault-code/verify' || path === '/auth/vault-code/reset' || path === '/auth/vault-code/verify-otp'
        if (res.status === 401 && path !== '/auth/refresh' && path !== '/auth/me' && !isVaultEndpoint) {
          clearToken()
          onUnauthorized?.()
          throw err
        }

        // Retry on 5xx for GET requests
        if (res.status >= 500 && attempt < maxAttempts) {
          lastError = err
          await delay(Math.min(1000 * Math.pow(2, attempt - 1), 5000))
          continue
        }

        throw err
      }

      return res.json()
    } catch (err: any) {
      clearTimeout(timeoutId)

      // Don't retry client errors (4xx) or non-GET
      if (err.status && err.status < 500) throw err

      lastError = err
      if (attempt < maxAttempts) {
        await delay(Math.min(1000 * Math.pow(2, attempt - 1), 5000))
        continue
      }

      // Wrap abort errors
      if (err.name === 'AbortError') {
        const timeoutErr = new Error('Request timed out') as any
        timeoutErr.status = 0
        throw timeoutErr
      }

      throw err
    }
  }

  throw lastError
}

// Auth
export const api = {
  me: () =>
    request<{ user: User }>('/auth/me'),

  login: (data: { email?: string; phone?: string; name?: string; password?: string }) =>
    request<{ user: User; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  preSignup: (email: string) =>
    request<{ userId: string }>('/auth/pre-signup', { method: 'POST', body: JSON.stringify({ email }) }),

  completeSignup: (userId: string, name: string, password: string) =>
    request<{ user: User; token: string }>('/auth/complete-signup', { method: 'POST', body: JSON.stringify({ userId, name, password }) }),

  getUsers: () =>
    request<Pick<User, 'id' | 'name' | 'email' | 'avatar'>[]>('/auth/users'),

  refreshToken: () =>
    request<{ token: string }>('/auth/refresh', { method: 'POST' }),

  // Spaces
  getSpaces: () =>
    request<MemorySpace[]>('/spaces'),

  getSpace: (id: string) =>
    request<MemorySpace>(`/spaces/${id}`),

  getSpacePaginated: (id: string, cursor?: string, limit = 20) =>
    request<MemorySpace & { nextCursor: string | null; hasMore: boolean }>(`/spaces/${id}${cursor ? `?cursor=${cursor}&limit=${limit}` : `?limit=${limit}`}`),

  createSpace: (data: { title: string; coverEmoji?: string; coverIcon?: string; coverColor?: string; coverImage?: string; coverImageOffsetX?: number; coverImageOffsetY?: number; coverImageScale?: number; type: string; description?: string }) =>
    request<MemorySpace>('/spaces', { method: 'POST', body: JSON.stringify(data) }),

  joinByCode: (code: string) =>
    request<{ success: boolean; spaceName: string }>('/spaces/join', { method: 'POST', body: JSON.stringify({ code }) }),

  approveJoin: (spaceId: string, userId: string) =>
    request<{ success: boolean; member: { userId: string; name: string; role: string; status: string } }>(`/spaces/${spaceId}/approve`, { method: 'POST', body: JSON.stringify({ userId }) }),

  rejectJoin: (spaceId: string, userId: string) =>
    request<{ success: boolean }>(`/spaces/${spaceId}/reject`, { method: 'POST', body: JSON.stringify({ userId }) }),

  inviteByEmail: (spaceId: string, email: string) =>
    request<{ success: boolean; message: string }>(`/spaces/${spaceId}/invite`, { method: 'POST', body: JSON.stringify({ email }) }),

  leaveSpace: (spaceId: string) =>
    request<{ success: boolean }>(`/spaces/${spaceId}/leave`, { method: 'POST' }),

  removeMember: (spaceId: string, userId: string) =>
    request<{ success: boolean }>(`/spaces/${spaceId}/members/${userId}`, { method: 'DELETE' }),

  updateMemberRole: (spaceId: string, userId: string, role: string) =>
    request<{ success: boolean }>(`/spaces/${spaceId}/members/${userId}`, { method: 'PATCH', body: JSON.stringify({ role }) }),

  updateMemberPermission: (spaceId: string, userId: string, permission: 'view' | 'edit') =>
    request<{ success: boolean }>(`/spaces/${spaceId}/members/${userId}`, { method: 'PATCH', body: JSON.stringify({ permission }) }),

  // Memories
  createMemory: (spaceId: string, data: Partial<Memory>) =>
    request<Memory>(`/spaces/${spaceId}/memories`, { method: 'POST', body: JSON.stringify(data) }),

  updateMemory: (spaceId: string, memoryId: string, data: Partial<Memory>) =>
    request<Memory>(`/spaces/${spaceId}/memories/${memoryId}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteMemory: (spaceId: string, memoryId: string) =>
    request<{ success: boolean }>(`/spaces/${spaceId}/memories/${memoryId}`, { method: 'DELETE' }),

  addReaction: (spaceId: string, memoryId: string, emoji: string) =>
    request<{ reactions: Record<string, number> }>(`/spaces/${spaceId}/memories/${memoryId}/react`, { method: 'POST', body: JSON.stringify({ emoji }) }),

  getSubstories: (spaceId: string, memoryId: string) =>
    request<SubStory[]>(`/spaces/${spaceId}/memories/${memoryId}/substories`),

  addSubstory: (spaceId: string, memoryId: string, data: Partial<SubStory>) =>
    request<SubStory>(`/spaces/${spaceId}/memories/${memoryId}/substories`, { method: 'POST', body: JSON.stringify(data) }),

  updateSubstory: (spaceId: string, memoryId: string, substoryId: string, data: Partial<SubStory>) =>
    request<SubStory>(`/spaces/${spaceId}/memories/${memoryId}/substories/${substoryId}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteSubstory: (spaceId: string, memoryId: string, substoryId: string) =>
    request<{ success: boolean }>(`/spaces/${spaceId}/memories/${memoryId}/substories/${substoryId}`, { method: 'DELETE' }),

  updateSpace: (spaceId: string, data: { title?: string; coverEmoji?: string; coverIcon?: string; coverColor?: string; coverImage?: string; coverImageOffsetX?: number; coverImageOffsetY?: number; coverImageScale?: number; description?: string }) =>
    request<MemorySpace>(`/spaces/${spaceId}`, { method: 'PATCH', body: JSON.stringify(data) }),

  deleteSpace: (spaceId: string) =>
    request<{ success: boolean }>(`/spaces/${spaceId}`, { method: 'DELETE' }),

  updateProfile: (data: { name?: string }) =>
    request<{ success: boolean; user: User }>('/auth/profile', { method: 'PATCH', body: JSON.stringify(data) }),

  sendLoginCode: (email: string) =>
    request<{ success: boolean }>('/auth/send-login-code', { method: 'POST', body: JSON.stringify({ email }) }),

  loginWithCode: (email: string, code: string) =>
    request<{ user: User; token: string }>('/auth/login-with-code', { method: 'POST', body: JSON.stringify({ email, code }) }),

  changePassword: (oldPassword: string, newPassword: string) =>
    request<{ success: boolean }>('/auth/change-password', { method: 'POST', body: JSON.stringify({ oldPassword, newPassword }) }),

  sendVerification: (userId: string) =>
    request<{ success: boolean }>('/auth/send-verification', { method: 'POST', body: JSON.stringify({ userId }) }),

  verifyEmail: (userId: string, code: string) =>
    request<{ user: User; token: string }>('/auth/verify-email', { method: 'POST', body: JSON.stringify({ userId, code }) }),

  forgotPassword: (email: string) =>
    request<{ success: boolean }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (email: string, code: string, newPassword: string) =>
    request<{ success: boolean }>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ email, code, newPassword }) }),

  // Invites — user side
  getMyInvites: () =>
    request<PendingInvite[]>('/spaces/my-invites'),

  acceptInvite: (spaceId: string) =>
    request<{ success: boolean }>(`/spaces/${spaceId}/accept-invite`, { method: 'POST' }),

  rejectInvite: (spaceId: string) =>
    request<{ success: boolean }>(`/spaces/${spaceId}/reject-invite`, { method: 'POST' }),

  // Invites — admin side
  getSpacePendingInvites: (spaceId: string) =>
    request<SpacePendingInvite[]>(`/spaces/${spaceId}/pending-invites`),

  cancelPendingInvite: (spaceId: string, inviteId: string) =>
    request<{ success: boolean }>(`/spaces/${spaceId}/pending-invites/${inviteId}`, { method: 'DELETE' }),

  regenerateInviteCode: (spaceId: string) =>
    request<{ inviteCode: string }>(`/spaces/${spaceId}/regenerate-code`, { method: 'POST' }),

  // Vault
  setVaultCode: (code: string) =>
    request<{ success: boolean }>('/auth/vault-code', { method: 'POST', body: JSON.stringify({ code }) }),

  changeVaultCode: (currentCode: string, newCode: string) =>
    request<{ success: boolean }>('/auth/vault-code', { method: 'PATCH', body: JSON.stringify({ currentCode, newCode }) }),

  verifyVaultCode: (code: string) =>
    request<{ success: boolean }>('/auth/vault-code/verify', { method: 'POST', body: JSON.stringify({ code }) }),

  updateHiddenSpaces: (spaceIds: string[]) =>
    request<{ success: boolean; hiddenSpaceIds: string[] }>('/auth/hidden-spaces', { method: 'PATCH', body: JSON.stringify({ spaceIds }) }),

  forgotVaultCode: () =>
    request<{ success: boolean }>('/auth/vault-code/forgot', { method: 'POST' }),

  verifyVaultOtp: (otpCode: string) =>
    request<{ success: boolean }>('/auth/vault-code/verify-otp', { method: 'POST', body: JSON.stringify({ otpCode }) }),

  resetVaultCode: (otpCode: string, newCode: string) =>
    request<{ success: boolean }>('/auth/vault-code/reset', { method: 'POST', body: JSON.stringify({ otpCode, newCode }) }),

  // On This Day
  getOnThisDay: () =>
    request<OnThisDayMemory[]>('/on-this-day'),

  // Notifications
  getNotifications: () =>
    request<AppNotification[]>('/notifications'),

  getUnreadCounts: () =>
    request<{ total: number; bySpace: Record<string, number> }>('/notifications/unread-count'),

  getNotificationSummary: () =>
    request<import('./types').NotificationSummary>('/notifications/summary'),

  markNotificationsRead: (data?: { notificationIds?: string[]; spaceId?: string }) =>
    request<{ success: boolean }>('/notifications/mark-read', { method: 'POST', body: JSON.stringify(data || {}) }),
}
