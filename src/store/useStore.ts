import { create } from 'zustand'
import { Memory, MemorySpace, SubStory, User, SpaceMember, JoinRequest } from '../types'
import { api, setToken, clearToken } from '../api'

interface AppState {
  isLoggedIn: boolean
  initialized: boolean
  currentUser: User | null
  spaces: MemorySpace[]
  activeSpaceId: string | null
  activeSpaceData: MemorySpace | null
  loading: boolean

  init: () => Promise<void>
  login: (user?: Partial<User>) => Promise<void>
  logout: () => void
  fetchSpaces: () => Promise<void>
  setActiveSpace: (id: string | null) => Promise<void>
  getActiveSpace: () => MemorySpace | null
  getVisibleSpaces: () => MemorySpace[]
  getVisibleMemories: (space: MemorySpace) => Memory[]

  addMemory: (spaceId: string, memory: Memory) => Promise<void>
  updateMemory: (spaceId: string, memoryId: string, updates: Partial<Memory>) => Promise<void>
  deleteMemory: (spaceId: string, memoryId: string) => Promise<void>
  addReaction: (spaceId: string, memoryId: string, emoji: string) => Promise<void>
  addSubstory: (spaceId: string, memoryId: string, substory: SubStory) => Promise<void>

  addSpace: (space: MemorySpace) => Promise<void>
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

  init: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ initialized: true })
      return
    }
    try {
      const result = await api.login({ id: token })
      setToken(result.token)
      set({ isLoggedIn: true, currentUser: result.user })
      await get().fetchSpaces()
      const savedSpaceId = localStorage.getItem('activeSpaceId')
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
      id: user?.id,
      email: user?.email,
      phone: user?.phone,
      name: user?.name,
      password: (user as any)?.password,
    })
    setToken(result.token)
    set({ isLoggedIn: true, currentUser: result.user })
    await get().fetchSpaces()
  },

  logout: () => {
    clearToken()
    localStorage.removeItem('activeSpaceId')
    set({ isLoggedIn: false, currentUser: null, spaces: [], activeSpaceId: null, activeSpaceData: null })
  },

  fetchSpaces: async () => {
    try {
      const spaces = await api.getSpaces()
      set({ spaces })
    } catch (err) {
      console.error('Failed to fetch spaces:', err)
    }
  },

  setActiveSpace: async (id) => {
    if (!id) {
      localStorage.removeItem('activeSpaceId')
      set({ activeSpaceId: null, activeSpaceData: null })
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
      await api.createSpace({
        title: space.title,
        coverEmoji: space.coverEmoji,
        type: space.type,
        description: space.description,
      })
      await get().fetchSpaces()
    } catch (err) {
      console.error('Failed to create space:', err)
    }
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
