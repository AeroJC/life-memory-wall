const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

function getToken(): string | null {
  return localStorage.getItem('token')
}

export function setToken(token: string) {
  localStorage.setItem('token', token)
}

export function clearToken() {
  localStorage.removeItem('token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const err = new Error(body.error || `Request failed: ${res.status}`) as any
    Object.assign(err, body)
    throw err
  }

  return res.json()
}

// Auth
export const api = {
  me: () =>
    request<{ user: any }>('/auth/me'),

  login: (data: { email?: string; phone?: string; name?: string; password?: string }) =>
    request<{ user: any; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  preSignup: (email: string) =>
    request<{ userId: string }>('/auth/pre-signup', { method: 'POST', body: JSON.stringify({ email }) }),

  completeSignup: (userId: string, name: string, password: string) =>
    request<{ user: any; token: string }>('/auth/complete-signup', { method: 'POST', body: JSON.stringify({ userId, name, password }) }),

  getUsers: () =>
    request<any[]>('/auth/users'),

  // Spaces
  getSpaces: () =>
    request<any[]>('/spaces'),

  getSpace: (id: string) =>
    request<any>(`/spaces/${id}`),

  createSpace: (data: { title: string; coverEmoji?: string; coverIcon?: string; coverColor?: string; coverImage?: string; type: string; description?: string }) =>
    request<any>('/spaces', { method: 'POST', body: JSON.stringify(data) }),

  joinByCode: (code: string) =>
    request<{ success: boolean; spaceName: string }>('/spaces/join', { method: 'POST', body: JSON.stringify({ code }) }),

  approveJoin: (spaceId: string, userId: string) =>
    request<any>(`/spaces/${spaceId}/approve`, { method: 'POST', body: JSON.stringify({ userId }) }),

  rejectJoin: (spaceId: string, userId: string) =>
    request<any>(`/spaces/${spaceId}/reject`, { method: 'POST', body: JSON.stringify({ userId }) }),

  inviteByEmail: (spaceId: string, email: string) =>
    request<{ success: boolean; message: string }>(`/spaces/${spaceId}/invite`, { method: 'POST', body: JSON.stringify({ email }) }),

  leaveSpace: (spaceId: string) =>
    request<{ success: boolean }>(`/spaces/${spaceId}/leave`, { method: 'POST' }),

  removeMember: (spaceId: string, userId: string) =>
    request<any>(`/spaces/${spaceId}/members/${userId}`, { method: 'DELETE' }),

  updateMemberRole: (spaceId: string, userId: string, role: string) =>
    request<any>(`/spaces/${spaceId}/members/${userId}`, { method: 'PATCH', body: JSON.stringify({ role }) }),

  // Memories
  createMemory: (spaceId: string, data: any) =>
    request<any>(`/spaces/${spaceId}/memories`, { method: 'POST', body: JSON.stringify(data) }),

  updateMemory: (spaceId: string, memoryId: string, data: any) =>
    request<any>(`/spaces/${spaceId}/memories/${memoryId}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteMemory: (spaceId: string, memoryId: string) =>
    request<any>(`/spaces/${spaceId}/memories/${memoryId}`, { method: 'DELETE' }),

  addReaction: (spaceId: string, memoryId: string, emoji: string) =>
    request<any>(`/spaces/${spaceId}/memories/${memoryId}/react`, { method: 'POST', body: JSON.stringify({ emoji }) }),

  getSubstories: (spaceId: string, memoryId: string) =>
    request<any[]>(`/spaces/${spaceId}/memories/${memoryId}/substories`),

  addSubstory: (spaceId: string, memoryId: string, data: any) =>
    request<any>(`/spaces/${spaceId}/memories/${memoryId}/substories`, { method: 'POST', body: JSON.stringify(data) }),

  updateSubstory: (spaceId: string, memoryId: string, substoryId: string, data: any) =>
    request<any>(`/spaces/${spaceId}/memories/${memoryId}/substories/${substoryId}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteSubstory: (spaceId: string, memoryId: string, substoryId: string) =>
    request<any>(`/spaces/${spaceId}/memories/${memoryId}/substories/${substoryId}`, { method: 'DELETE' }),

  updateSpace: (spaceId: string, data: { title?: string; coverEmoji?: string; coverIcon?: string; coverColor?: string; coverImage?: string; description?: string }) =>
    request<any>(`/spaces/${spaceId}`, { method: 'PATCH', body: JSON.stringify(data) }),

  deleteSpace: (spaceId: string) =>
    request<any>(`/spaces/${spaceId}`, { method: 'DELETE' }),

  changePassword: (oldPassword: string, newPassword: string) =>
    request<{ success: boolean }>('/auth/change-password', { method: 'POST', body: JSON.stringify({ oldPassword, newPassword }) }),

  sendVerification: (userId: string) =>
    request<{ success: boolean }>('/auth/send-verification', { method: 'POST', body: JSON.stringify({ userId }) }),

  verifyEmail: (userId: string, code: string) =>
    request<{ user: any; token: string }>('/auth/verify-email', { method: 'POST', body: JSON.stringify({ userId, code }) }),

  forgotPassword: (email: string) =>
    request<{ success: boolean }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (email: string, code: string, newPassword: string) =>
    request<{ success: boolean }>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ email, code, newPassword }) }),

  // Invites — user side
  getMyInvites: () =>
    request<any[]>('/spaces/my-invites'),

  acceptInvite: (spaceId: string) =>
    request<{ success: boolean }>(`/spaces/${spaceId}/accept-invite`, { method: 'POST' }),

  rejectInvite: (spaceId: string) =>
    request<{ success: boolean }>(`/spaces/${spaceId}/reject-invite`, { method: 'POST' }),

  // Invites — admin side
  getSpacePendingInvites: (spaceId: string) =>
    request<any[]>(`/spaces/${spaceId}/pending-invites`),

  cancelPendingInvite: (spaceId: string, inviteId: string) =>
    request<{ success: boolean }>(`/spaces/${spaceId}/pending-invites/${inviteId}`, { method: 'DELETE' }),
}
