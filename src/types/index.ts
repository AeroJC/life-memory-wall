export interface SubStory {
  id: string
  date: string
  type: 'text' | 'photo' | 'photos' | 'img-left' | 'img-right' | 'img-top' | 'img-bottom'
  title?: string
  content?: string
  photos?: string[]
  caption?: string
}

export interface Memory {
  id: string
  title: string
  date: string
  endDate?: string
  photos: string[]
  story: string
  location?: string
  tags?: string[]
  reactions?: Record<string, number>
  comments?: Comment[]
  storylineId?: string
  substories?: SubStory[]
  visibleTo?: string[]
  createdBy?: string
}

export interface Comment {
  id: string
  author: string
  text: string
  date: string
}

export interface JoinRequest {
  userId: string
  userName: string
  requestedAt: string
}

export interface SpaceMember {
  userId: string
  name: string
  role: 'owner' | 'admin' | 'member'
  status: 'active' | 'pending'
  joinedAt: string
}

export interface MemorySpace {
  id: string
  title: string
  coverImage: string
  coverEmoji: string
  memoryCount: number
  type: 'personal' | 'group'
  createdBy: string
  inviteCode?: string
  membersList: SpaceMember[]
  joinRequests?: JoinRequest[]
  pendingInvites?: any[]
  description?: string
  memories: Memory[]
}

export interface User {
  id: string
  name: string
  avatar: string
  email: string
  phone?: string
  password?: string
}
