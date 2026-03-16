export interface TextStyle {
  fontFamily?: string
  fontSize?: 'small' | 'normal' | 'large' | 'heading'
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

export interface SubStory {
  id: string
  date: string
  type: 'text' | 'photo' | 'photos' | 'img-left' | 'img-right' | 'img-top' | 'img-bottom' | 'canvas'
  title?: string
  content?: string
  photos?: string[]
  caption?: string
  textStyle?: TextStyle
  titleStyle?: TextStyle
  canvasData?: CanvasData
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
  permission?: 'view' | 'edit'
  joinedAt: string
}

export interface MemorySpace {
  id: string
  title: string
  coverImage: string
  coverImageOffsetX?: number
  coverImageOffsetY?: number
  coverImageScale?: number
  coverEmoji: string
  coverIcon: string
  coverColor: string
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
  hasVaultCode?: boolean
  hiddenSpaceIds?: string[]
}

export interface PendingInvite {
  id: string
  spaceId: string
  spaceName: string
  spaceEmoji: string
  spaceIcon?: string
  invitedBy: string
  status: 'pending' | 'rejected'
  createdAt: string
}

export interface SpacePendingInvite {
  id: string
  email: string
  invitedBy: string
  status: 'pending' | 'rejected'
  createdAt: string
}

/* ── Canvas Editor types ── */

export interface EditorBlock {
  id: string
  type: 'text' | 'heading' | 'image'
  x: number
  y: number
  width: number
  height: number
  content?: string          // text/heading content
  imageUrl?: string         // image source URL
  imageOffsetX?: number     // 0-100 object-position X (default 50)
  imageOffsetY?: number     // 0-100 object-position Y (default 50)
  style?: {
    fontFamily?: string
    fontSize?: number       // px
    color?: string
    bold?: boolean
    italic?: boolean
    underline?: boolean
    textAlign?: 'left' | 'center' | 'right'
  }
}

export interface CanvasData {
  width: number
  height: number
  background: string        // color, gradient, or image URL
  blocks: EditorBlock[]
}
