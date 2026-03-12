import { create } from 'zustand'
import { Memory, MemorySpace, SubStory, User, SpaceMember, JoinRequest, PendingInvite } from '../types'
import { api, setToken, clearToken } from '../api'

interface AppState {
  isLoggedIn: boolean
  initialized: boolean
  currentUser: User | null
  spaces: MemorySpace[]
  activeSpaceId: string | null
  activeSpaceData: MemorySpace | null
  loading: boolean
  pendingInvites: PendingInvite[]

  init: () => Promise<void>
  login: (user?: Partial<User>) => Promise<void>
  logout: () => void
  fetchSpaces: () => Promise<void>
  fetchMyInvites: () => Promise<void>
  acceptSpaceInvite: (spaceId: string) => Promise<void>
  rejectSpaceInvite: (spaceId: string) => Promise<void>
  setActiveSpace: (id: string | null) => Promise<void>
  getActiveSpace: () => MemorySpace | null
  getVisibleSpaces: () => MemorySpace[]
  getVisibleMemories: (space: MemorySpace) => Memory[]

  addMemory: (spaceId: string, memory: Memory) => Promise<void>
  updateMemory: (spaceId: string, memoryId: string, updates: Partial<Memory>) => Promise<void>
  deleteMemory: (spaceId: string, memoryId: string) => Promise<void>
  addReaction: (spaceId: string, memoryId: string, emoji: string) => Promise<void>
  addSubstory: (spaceId: string, memoryId: string, substory: SubStory) => Promise<void>
  updateMemorySubstories: (spaceId: string, memoryId: string, substories: SubStory[]) => void

  addSpace: (space: MemorySpace) => Promise<string | null>
  updateSpace: (spaceId: string, data: { title?: string; coverEmoji?: string; coverIcon?: string; coverColor?: string; description?: string }) => Promise<void>
  deleteSpace: (spaceId: string) => Promise<void>
  updateSubstory: (spaceId: string, memoryId: string, substoryId: string, data: Partial<SubStory>) => Promise<void>
  deleteSubstory: (spaceId: string, memoryId: string, substoryId: string) => Promise<void>
  leaveSpace: (spaceId: string) => Promise<void>
  removeMember: (spaceId: string, userId: string) => Promise<void>
  updateMemberRole: (spaceId: string, userId: string, role: SpaceMember['role']) => Promise<void>
}

export const useStore = create<AppState>((set, get) => ({
  isLoggedIn: false,
  initialized: false,
  currentUser: null,
  spaces: [],
  activeSpaceId: null,
  activeSpaceData: null,
  loading: false,
  pendingInvites: [],

  init: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ initialized: true })
      return
    }
    try {
      const result = await api.me()
      set({ isLoggedIn: true, currentUser: result.user })
      const savedSpaceId = localStorage.getItem('activeSpaceId')
      await Promise.all([get().fetchSpaces(), get().fetchMyInvites()])
      if (savedSpaceId) {
        await get().setActiveSpace(savedSpaceId)
      }
      set({ initialized: true })
    } catch {
      clearToken()
      localStorage.removeItem('activeSpaceId')
      set({ initialized: true })
    }
  },

  login: async (user) => {
    const result = await api.login({
      email: user?.email,
      phone: user?.phone,
      name: user?.name,
      password: (user as any)?.password,
    })
    setToken(result.token)
    localStorage.removeItem('activeSpaceId')
    set({ isLoggedIn: true, currentUser: result.user })
    await Promise.all([get().fetchSpaces(), get().fetchMyInvites()])
  },

  logout: () => {
    clearToken()
    localStorage.removeItem('activeSpaceId')
    set({ isLoggedIn: false, currentUser: null, spaces: [], activeSpaceId: null, activeSpaceData: null, pendingInvites: [] })
  },

  fetchMyInvites: async () => {
    try {
      const invites = await api.getMyInvites()
      set({ pendingInvites: invites })
    } catch {}
  },

  acceptSpaceInvite: async (spaceId) => {
    await api.acceptInvite(spaceId)
    set((state) => ({ pendingInvites: state.pendingInvites.filter((inv) => inv.spaceId !== spaceId) }))
    await get().fetchSpaces()
  },

  rejectSpaceInvite: async (spaceId) => {
    await api.rejectInvite(spaceId)
    set((state) => ({ pendingInvites: state.pendingInvites.filter((inv) => inv.spaceId !== spaceId) }))
  },

  fetchSpaces: async () => {
    set({ loading: true })
    try {
      const spaces = await api.getSpaces()
      set({ spaces, loading: false })
    } catch (err) {
      console.error('Failed to fetch spaces:', err)
      set({ loading: false })
    }
  },

  setActiveSpace: async (id) => {
    if (!id) {
      localStorage.removeItem('activeSpaceId')
      set({ activeSpaceId: null, activeSpaceData: null, loading: true })
      await get().fetchSpaces()
      return
    }
    localStorage.setItem('activeSpaceId', id)
    set({ activeSpaceId: id, loading: true })
    try {
      const spaceData = await api.getSpace(id)
      set({ activeSpaceData: spaceData, loading: false })
    } catch (err) {
      console.error('Failed to fetch space:', err)
      localStorage.removeItem('activeSpaceId')
      set({ loading: false })
    }
  },

  getActiveSpace: () => get().activeSpaceData,

  getVisibleSpaces: () => get().spaces,

  getVisibleMemories: (space) => {
    const { currentUser } = get()
    if (!currentUser) return space.memories || []
    return (space.memories || []).filter((m) => {
      if (!m.visibleTo || m.visibleTo.length === 0) return true
      if (m.createdBy === currentUser.id) return true
      return m.visibleTo.includes(currentUser.id)
    })
  },

  addMemory: async (spaceId, memory) => {
    try {
      const created = await api.createMemory(spaceId, memory)
      set((state) => ({
        activeSpaceData: state.activeSpaceData?.id === spaceId
          ? { ...state.activeSpaceData, memories: [...state.activeSpaceData.memories, created], memoryCount: state.activeSpaceData.memoryCount + 1 }
          : state.activeSpaceData,
      }))
    } catch (err) {
      console.error('Failed to create memory:', err)
    }
  },

  updateMemory: async (spaceId, memoryId, updates) => {
    try {
      const updated = await api.updateMemory(spaceId, memoryId, updates)
      set((state) => ({
        activeSpaceData: state.activeSpaceData?.id === spaceId
          ? { ...state.activeSpaceData, memories: state.activeSpaceData.memories.map((m) => m.id === memoryId ? updated : m) }
          : state.activeSpaceData,
      }))
    } catch (err) {
      console.error('Failed to update memory:', err)
    }
  },

  deleteMemory: async (spaceId, memoryId) => {
    try {
      await api.deleteMemory(spaceId, memoryId)
      set((state) => ({
        activeSpaceData: state.activeSpaceData?.id === spaceId
          ? { ...state.activeSpaceData, memories: state.activeSpaceData.memories.filter((m) => m.id !== memoryId), memoryCount: state.activeSpaceData.memoryCount - 1 }
          : state.activeSpaceData,
      }))
    } catch (err) {
      console.error('Failed to delete memory:', err)
    }
  },

  addReaction: async (spaceId, memoryId, emoji) => {
    try {
      const result = await api.addReaction(spaceId, memoryId, emoji)
      set((state) => ({
        activeSpaceData: state.activeSpaceData?.id === spaceId
          ? {
              ...state.activeSpaceData,
              memories: state.activeSpaceData.memories.map((m) =>
                m.id === memoryId ? { ...m, reactions: result.reactions } : m
              ),
            }
          : state.activeSpaceData,
      }))
    } catch (err) {
      console.error('Failed to add reaction:', err)
    }
  },

  updateMemorySubstories: (spaceId, memoryId, substories) => {
    set((state) => ({
      activeSpaceData: state.activeSpaceData?.id === spaceId ? {
        ...state.activeSpaceData,
        memories: state.activeSpaceData.memories.map((m) =>
          m.id === memoryId ? { ...m, substories } : m
        ),
      } : state.activeSpaceData,
    }))
  },

  addSubstory: async (spaceId, memoryId, substory) => {
    try {
      const created = await api.addSubstory(spaceId, memoryId, substory)
      set((state) => ({
        activeSpaceData: state.activeSpaceData?.id === spaceId
          ? {
              ...state.activeSpaceData,
              memories: state.activeSpaceData.memories.map((m) =>
                m.id === memoryId
                  ? { ...m, substories: [...(m.substories || []), created] }
                  : m
              ),
            }
          : state.activeSpaceData,
      }))
    } catch (err) {
      console.error('Failed to add substory:', err)
    }
  },

  addSpace: async (space) => {
    try {
      const created = await api.createSpace({
        title: space.title,
        coverEmoji: space.coverEmoji,
        coverIcon: space.coverIcon,
        coverColor: space.coverColor,
        coverImage: space.coverImage,
        type: space.type,
        description: space.description,
      })
      await get().fetchSpaces()
      return created?.id ?? null
    } catch (err) {
      console.error('Failed to create space:', err)
      return null
    }
  },

  updateSpace: async (spaceId, data) => {
    try {
      await api.updateSpace(spaceId, data)
      set((state) => ({
        spaces: state.spaces.map((s) => s.id === spaceId ? { ...s, ...data } : s),
        activeSpaceData: state.activeSpaceData?.id === spaceId ? { ...state.activeSpaceData, ...data } : state.activeSpaceData,
      }))
    } catch (err) { console.error('Failed to update space:', err) }
  },

  deleteSpace: async (spaceId) => {
    // Optimistic: remove from UI immediately
    localStorage.removeItem('activeSpaceId')
    set((state) => ({
      spaces: state.spaces.filter((s) => s.id !== spaceId),
      activeSpaceId: state.activeSpaceId === spaceId ? null : state.activeSpaceId,
      activeSpaceData: state.activeSpaceData?.id === spaceId ? null : state.activeSpaceData,
    }))
    // Fire and forget — cleanup happens in background
    api.deleteSpace(spaceId).catch((err) => console.error('Failed to delete space:', err))
  },

  updateSubstory: async (spaceId, memoryId, substoryId, data) => {
    try {
      const updated = await api.updateSubstory(spaceId, memoryId, substoryId, data)
      set((state) => ({
        activeSpaceData: state.activeSpaceData?.id === spaceId ? {
          ...state.activeSpaceData,
          memories: state.activeSpaceData.memories.map((m) =>
            m.id === memoryId
              ? { ...m, substories: (m.substories || []).map((s) => s.id === substoryId ? updated : s) }
              : m
          ),
        } : state.activeSpaceData,
      }))
    } catch (err) { console.error('Failed to update substory:', err) }
  },

  deleteSubstory: async (spaceId, memoryId, substoryId) => {
    try {
      await api.deleteSubstory(spaceId, memoryId, substoryId)
      set((state) => ({
        activeSpaceData: state.activeSpaceData?.id === spaceId ? {
          ...state.activeSpaceData,
          memories: state.activeSpaceData.memories.map((m) =>
            m.id === memoryId
              ? { ...m, substories: (m.substories || []).filter((s) => s.id !== substoryId) }
              : m
          ),
        } : state.activeSpaceData,
      }))
    } catch (err) { console.error('Failed to delete substory:', err) }
  },

  leaveSpace: async (spaceId) => {
    await api.leaveSpace(spaceId)
    localStorage.removeItem('activeSpaceId')
    set((state) => ({
      spaces: state.spaces.filter((s) => s.id !== spaceId),
      activeSpaceId: state.activeSpaceId === spaceId ? null : state.activeSpaceId,
      activeSpaceData: state.activeSpaceData?.id === spaceId ? null : state.activeSpaceData,
    }))
  },

  removeMember: async (spaceId, userId) => {
    try {
      await api.removeMember(spaceId, userId)
      await get().fetchSpaces()
    } catch (err) {
      console.error('Failed to remove member:', err)
    }
  },

  updateMemberRole: async (spaceId, userId, role) => {
    try {
      await api.updateMemberRole(spaceId, userId, role)
      await get().fetchSpaces()
    } catch (err) {
      console.error('Failed to update role:', err)
    }
  },
}))
