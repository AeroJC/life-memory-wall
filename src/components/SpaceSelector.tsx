import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Users, Crown, Shield, X, Pencil, Trash2, Check, Loader2, Mail, Eye, EyeOff, KeyRound, LogOut, UserMinus } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { api } from '../api'
import {
  spaceIconDefs, iconCategories, iconColors, getIconsByCategory,
  getIconDef, getIconVariation, makeIconId, getColorClasses,
  randomTaglineForIcon, SpaceIconRenderer, getGlowColor,
} from './SpaceIcons'
import { useBubbleLayout } from '../hooks/useBubbleLayout'

function validatePassword(p: string): string | null {
  if (p.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(p)) return 'Password must contain at least one uppercase letter'
  if (!/[a-z]/.test(p)) return 'Password must contain at least one lowercase letter'
  if (!/[0-9]/.test(p)) return 'Password must contain at least one number'
  if (!/[^A-Za-z0-9]/.test(p)) return 'Password must contain at least one special character'
  return null
}
import { MemorySpace } from '../types'
import ParticleBackground from './ParticleBackground'

const defaultSpaceColors = [
  'from-purple-200/60 to-pink-200/60',
  'from-amber-200/60 to-orange-200/60',
  'from-teal-200/60 to-cyan-200/60',
  'from-rose-200/60 to-red-200/60',
  'from-indigo-200/60 to-blue-200/60',
  'from-lime-200/60 to-emerald-200/60',
]

type Modal = 'none' | 'create' | 'members' | 'edit-space' | 'change-password'

export default function SpaceSelector() {
  const { getVisibleSpaces, setActiveSpace, addSpace, updateSpace, deleteSpace, leaveSpace, removeMember, logout, currentUser, spaces, loading, pendingInvites, acceptSpaceInvite, rejectSpaceInvite } = useStore()
  const visibleSpaces = getVisibleSpaces()

  const [modal, setModal] = useState<Modal>('none')
  const [newTitle, setNewTitle] = useState('')
  const [newIcon, setNewIcon] = useState('couple')
  const [newIconVariation, setNewIconVariation] = useState(0)
  const [newColor, setNewColor] = useState('purple-pink')
  const [newDescription, setNewDescription] = useState(randomTaglineForIcon('couple'))
  const [newType, setNewType] = useState<'personal' | 'group'>('personal')
  const [viewingSpaceId, setViewingSpaceId] = useState<string | null>(null)

  // Edit-mode for spaces page
  const [editPageMode, setEditPageMode] = useState(false)
  const spacesContainerRef = useRef<HTMLDivElement>(null)

  // Floating bubble layout
  const [hoveredBubbleId, setHoveredBubbleId] = useState<string | null>(null)
  const [containerWidth, setContainerWidth] = useState(800)
  const [availableHeight, setAvailableHeight] = useState(500)
  const isMobile = containerWidth < 768
  const bubbleLayout = useBubbleLayout(visibleSpaces, containerWidth, availableHeight, isMobile)

  // Measure container dimensions with ResizeObserver
  const bubbleContainerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = bubbleContainerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0]?.contentRect
      if (width) setContainerWidth(width)
      if (height) setAvailableHeight(height)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!editPageMode) return
    const handleMouseDown = (e: MouseEvent) => {
      if (spacesContainerRef.current && !spacesContainerRef.current.contains(e.target as Node)) {
        setEditPageMode(false)
        setDeleteConfirmId(null)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [editPageMode])

  const [editingSpaceId, setEditingSpaceId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editIcon, setEditIcon] = useState('couple')
  const [editIconVariation, setEditIconVariation] = useState(0)
  const [editColor, setEditColor] = useState('purple-pink')
  const [editDescription, setEditDescription] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [showInvites, setShowInvites] = useState(false)
  const [inviteActionId, setInviteActionId] = useState<string | null>(null)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

  // Members management
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null)
  const [leaveConfirm, setLeaveConfirm] = useState(false)
  const [leaveLoading, setLeaveLoading] = useState(false)
  const [memberActionError, setMemberActionError] = useState('')

  // Profile Menu
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const handleCreate = async () => {
    if (!newTitle.trim() || creating) return
    setCreating(true)
    const iconId = makeIconId(newIcon, newIconVariation)
    const space: MemorySpace = {
      id: `space-${Date.now()}`,
      title: newTitle,
      coverImage: '',
      coverEmoji: '✨',
      coverIcon: iconId,
      coverColor: newColor,
      memoryCount: 0,
      type: newType,
      createdBy: currentUser?.id || '',
      membersList: [],
      joinRequests: [],
      description: newDescription,
      memories: [],
    }
    try {
      await addSpace(space)
      setNewTitle('')
      setNewIcon('couple')
      setNewIconVariation(0)
      setNewColor('purple-pink')
      setNewDescription(randomTaglineForIcon('couple'))
      setModal('none')
    } finally {
      setCreating(false)
    }
  }

  const openEditSpace = (space: MemorySpace) => {
    setEditingSpaceId(space.id)
    setEditTitle(space.title)
    if (space.coverIcon) {
      const base = space.coverIcon.replace(/-[0-2]$/, '')
      const variation = getIconVariation(space.coverIcon)
      setEditIcon(base)
      setEditIconVariation(variation)
    } else {
      setEditIcon('couple')
      setEditIconVariation(0)
    }
    setEditColor(space.coverColor || 'purple-pink')
    setEditDescription(space.description || '')
    setModal('edit-space')
  }

  const handleSaveSpace = async () => {
    if (!editTitle.trim() || !editingSpaceId) return
    const iconId = makeIconId(editIcon, editIconVariation)
    await updateSpace(editingSpaceId, { title: editTitle.trim(), coverIcon: iconId, coverColor: editColor, description: editDescription.trim() || undefined })
    setModal('none'); setEditingSpaceId(null); setEditPageMode(false)
  }

  const handleDeleteSpace = async (spaceId: string) => {
    await deleteSpace(spaceId)
    setDeleteConfirmId(null); setModal('none'); setEditingSpaceId(null)
  }

  const viewingSpace = spaces.find((s) => s.id === viewingSpaceId)
  const editingSpace = spaces.find((s) => s.id === editingSpaceId)

  const handleChangePassword = async () => {
    setPwError('')
    if (!oldPassword || !newPassword || !confirmPassword) { setPwError('All fields are required'); return }
    const pwErr = validatePassword(newPassword)
    if (pwErr) { setPwError(pwErr); return }
    if (newPassword !== confirmPassword) { setPwError('Passwords do not match'); return }
    setPwLoading(true)
    try {
      await api.changePassword(oldPassword, newPassword)
      setPwSuccess(true)
      setOldPassword(''); setNewPassword(''); setConfirmPassword('')
      setTimeout(() => { setPwSuccess(false); setModal('none') }, 1500)
    } catch (err: any) {
      setPwError(err.message || 'Failed to change password')
    } finally {
      setPwLoading(false)
    }
  }

  const closeModal = () => {
    setModal('none')
    setViewingSpaceId(null)
    setEditingSpaceId(null)
    setDeleteConfirmId(null)
    setOldPassword(''); setNewPassword(''); setConfirmPassword('')
    setPwError(''); setPwSuccess(false)
    setShowProfileMenu(false)
    setRemovingMemberId(null); setLeaveConfirm(false); setMemberActionError('')
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex flex-col items-center justify-center gap-6">
        <ParticleBackground />
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* App icon */}
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gold/80 to-coral/70 flex items-center justify-center shadow-lg">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="14" stroke="white" strokeWidth="2.5" opacity="0.9" />
                <circle cx="20" cy="20" r="8" stroke="white" strokeWidth="2" opacity="0.7" />
                <circle cx="20" cy="20" r="3" fill="white" opacity="0.9" />
              </svg>
            </div>
            <div className="absolute -inset-2 rounded-[1.25rem] border-2 border-gold/20 border-t-gold/60 animate-spin" style={{ animationDuration: '1.5s' }} />
          </div>
          <div className="text-center">
            <h1 className="font-serif text-2xl text-warmDark mb-1">My Inner Circle</h1>
            <p className="font-handwriting text-xl text-warmDark/70">Loading your spaces...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen gradient-bg relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 h-screen flex flex-col items-center px-4">
        {/* Top Right Controls */}
        <div className="absolute top-6 right-6 flex items-center gap-3 z-30">
            {/* Profile Menu Dropdown Container */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu((v) => {
                  if (v) setShowInvites(false) // Reset nested view when closing
                  return !v
                })}
                className="relative w-10 h-10 rounded-full bg-gradient-to-br from-gold/40 to-coral/40 flex items-center justify-center shadow-sm hover:shadow-md transition-all border border-white/30"
                title="Profile options"
              >
                <span className="font-serif text-lg text-warmDark font-medium">
                  {currentUser?.name?.[0]?.toUpperCase() || 'U'}
                </span>
                {pendingInvites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral rounded-full text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                    {pendingInvites.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    {/* Backdrop to close menu when clicking outside */}
                    <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 z-20 w-72 bg-white/95 backdrop-blur-md border border-warmMid/15 rounded-2xl shadow-xl overflow-hidden"
                    >
                      <AnimatePresence mode="wait">
                        {!showInvites ? (
                          <motion.div
                            key="main-menu"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            {/* User Info Header */}
                            <div className="px-5 py-4 border-b border-warmMid/10 bg-warmMid/5">
                              <p className="font-serif text-lg text-warmDark truncate">
                                {currentUser?.name || 'User'}
                              </p>
                              <p className="font-sans text-sm text-warmDark/75 truncate mt-0.5">
                                {currentUser?.email || 'user@example.com'}
                              </p>
                            </div>

                            {/* Menu Items */}
                            <div className="py-2">
                              {pendingInvites.length > 0 && (
                                <button
                                  onClick={() => setShowInvites(true)}
                                  className="w-full text-left px-5 py-3 hover:bg-warmMid/10 transition-colors flex items-center justify-between group"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-sans text-sm text-warmDark/70 group-hover:text-warmDark">Space invitations</span>
                                    <span className="w-5 h-5 rounded-full bg-coral/10 text-coral text-sm font-bold flex items-center justify-center">
                                      {pendingInvites.length}
                                    </span>
                                  </div>
                                  <Mail className="w-4 h-4 text-warmDark/75 group-hover:text-warmDark/70 transition-colors" />
                                </button>
                              )}

                              {visibleSpaces.length > 0 && (
                                <button
                                  onClick={() => { 
                                    setEditPageMode((v) => !v)
                                    setDeleteConfirmId(null)
                                    setShowProfileMenu(false)
                                  }}
                                  className="w-full text-left px-5 py-3 hover:bg-warmMid/10 transition-colors flex items-center justify-between group"
                                >
                                  <span className={`font-sans text-sm ${editPageMode ? 'text-coral/80 font-medium' : 'text-warmDark/70 group-hover:text-warmDark'}`}>
                                    {editPageMode ? 'Done Editing Spaces' : 'Edit Spaces'}
                                  </span>
                                  {!editPageMode && <Pencil className="w-4 h-4 text-warmDark/75 group-hover:text-warmDark/70 transition-colors" />}
                                </button>
                              )}
                              
                              <button
                                onClick={() => {
                                  setModal('change-password')
                                  setShowProfileMenu(false)
                                }}
                                className="w-full text-left px-5 py-3 hover:bg-warmMid/10 transition-colors flex items-center justify-between group"
                              >
                                <span className="font-sans text-sm text-warmDark/70 group-hover:text-warmDark">Change password</span>
                                <KeyRound className="w-4 h-4 text-warmDark/75 group-hover:text-warmDark/70 transition-colors" />
                              </button>
                            </div>

                            <div className="border-t border-warmMid/10 py-2 bg-coral/5 hover:bg-coral/10 transition-colors">
                              <button 
                                onClick={() => {
                                  setShowProfileMenu(false)
                                  logout()
                                }} 
                                className="w-full text-left px-5 py-2.5 flex items-center justify-between group"
                              >
                                <span className="font-sans text-sm text-coral/80 group-hover:text-coral font-medium">Sign out</span>
                                <LogOut className="w-4 h-4 text-coral/60 group-hover:text-coral transition-colors" />
                              </button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="invites-menu"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="flex flex-col max-h-96"
                          >
                            <div className="px-4 py-3 border-b border-warmMid/10 flex items-center gap-3 bg-warmMid/5">
                              <button 
                                onClick={() => setShowInvites(false)} 
                                className="text-warmDark/75 hover:text-warmDark/70 p-1 -ml-1 rounded-md hover:bg-warmMid/10 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <p className="font-serif text-base text-warmDark">Space invitations</p>
                            </div>
                            <div className="divide-y divide-warmMid/8 overflow-y-auto overflow-x-hidden flex-1">
                              {pendingInvites.length === 0 ? (
                                <div className="p-6 text-center text-warmDark/75 text-sm font-sans">
                                  No pending invitations.
                                </div>
                              ) : (
                                pendingInvites.map((inv) => (
                                  <div key={inv.id} className="px-4 py-3 flex items-center gap-3">
                                    <span className="text-2xl flex-shrink-0">{inv.spaceEmoji}</span>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-sans text-sm text-warmDark font-medium truncate">{inv.spaceName}</p>
                                      <p className="font-sans text-sm text-warmDark/75">You've been invited</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      <button
                                        disabled={inviteActionId === inv.spaceId}
                                        onClick={async () => {
                                          setInviteActionId(inv.spaceId)
                                          await acceptSpaceInvite(inv.spaceId)
                                          setInviteActionId(null)
                                          if (pendingInvites.length <= 1) setShowInvites(false)
                                        }}
                                        className="w-7 h-7 rounded-full bg-teal/15 hover:bg-teal/30 flex items-center justify-center transition-colors disabled:opacity-50"
                                        title="Accept"
                                      >
                                        <Check className="w-3.5 h-3.5 text-teal" />
                                      </button>
                                      <button
                                        disabled={inviteActionId === inv.spaceId}
                                        onClick={async () => {
                                          setInviteActionId(inv.spaceId)
                                          await rejectSpaceInvite(inv.spaceId)
                                          setInviteActionId(null)
                                          if (pendingInvites.length <= 1) setShowInvites(false)
                                        }}
                                        className="w-7 h-7 rounded-full bg-coral/15 hover:bg-coral/30 flex items-center justify-center transition-colors disabled:opacity-50"
                                        title="Decline"
                                      >
                                        <X className="w-3.5 h-3.5 text-coral" />
                                      </button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center pt-6 pb-4 flex-shrink-0"
        >
          {currentUser && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="font-handwriting text-lg text-warmDark/70 mb-2">
              Hello, {currentUser.name}
            </motion.p>
          )}

          <h1 className="font-serif text-3xl md:text-4xl text-warmDark mb-2">Where do you want to go today?</h1>
          <p className="font-handwriting text-lg md:text-xl text-warmDark/70">Choose a memory space to explore</p>
        </motion.div>

        {/* Space bubbles — floating bubble layout, fills remaining screen height */}
        <div
          ref={(el) => {
            (spacesContainerRef as any).current = el
            ;(bubbleContainerRef as any).current = el
          }}
          className="relative max-w-6xl w-full mx-auto flex-1"
        >
          {bubbleLayout.bubbles.map((bp, i) => {
            const isNewSpace = bp.spaceId === '__new_space__'
            const space = isNewSpace ? null : visibleSpaces.find(s => s.id === bp.spaceId)
            if (!isNewSpace && !space) return null

            const diameter = bp.radius * 2
            const glowColor = space?.coverColor ? getGlowColor(space.coverColor) : 'rgba(212, 165, 116, 0.25)'
            const glowColorBright = glowColor.replace('0.4)', '0.65)')
            const isOwner = space ? space.createdBy === currentUser?.id : false
            const myRole = space?.membersList.find((m) => m.userId === currentUser?.id)?.role
            const isDelConfirm = space ? deleteConfirmId === space.id : false
            const isHovered = hoveredBubbleId === bp.spaceId
            const somethingHovered = hoveredBubbleId !== null

            // "New Space" bubble
            if (isNewSpace) {
              return (
                <motion.div
                  key="__new_space__"
                  className="absolute"
                  style={{
                    left: `calc(50% + ${bp.x}px - ${bp.radius}px)`,
                    top: `calc(50% + ${bp.y}px - ${bp.radius}px)`,
                    width: diameter,
                    height: diameter,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: somethingHovered && hoveredBubbleId !== '__new_space__' ? 0.6 : 1,
                    scale: 1,
                  }}
                  transition={{
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.6, delay: visibleSpaces.length * 0.08, type: 'spring', stiffness: 100 },
                  }}
                  onHoverStart={() => setHoveredBubbleId('__new_space__')}
                  onHoverEnd={() => setHoveredBubbleId(null)}
                >
                  <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setModal('create')}
                    className="group rounded-full border-2 border-dashed border-warmMid/25 flex items-center justify-center hover:border-gold/50 transition-colors duration-500"
                    style={{ width: diameter, height: diameter, boxShadow: '0 0 15px rgba(212, 165, 116, 0.15)' }}
                  >
                    <Plus className="w-7 h-7 text-warmDark/50 group-hover:text-gold/60 transition-colors" />
                  </motion.button>
                  <p className="text-center mt-2 font-handwriting text-sm text-warmDark/60">New Space</p>
                </motion.div>
              )
            }

            const colorClasses = space!.coverColor
              ? getColorClasses(space!.coverColor)
              : defaultSpaceColors[i % defaultSpaceColors.length]

            return (
              <motion.div
                key={space!.id}
                className="absolute"
                style={{
                  left: `calc(50% + ${bp.x}px - ${bp.radius}px)`,
                  top: `calc(50% + ${bp.y}px - ${bp.radius}px)`,
                  width: diameter,
                  height: diameter,
                  zIndex: isHovered ? 10 : 1,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: somethingHovered && !isHovered ? 0.65 : 1,
                  scale: 1,
                }}
                transition={{
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.6, delay: i * 0.08, type: 'spring', stiffness: 100 },
                }}
                onHoverStart={() => setHoveredBubbleId(space!.id)}
                onHoverEnd={() => setHoveredBubbleId(null)}
              >
                <div className="relative" style={{ width: diameter, height: diameter }}>
                  <motion.button
                    whileHover={editPageMode ? {} : { scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => editPageMode ? undefined : setActiveSpace(space!.id)}
                    className={`group relative ${editPageMode ? 'cursor-default' : 'cursor-pointer'}`}
                    style={{ width: diameter, height: diameter }}
                    animate={editPageMode ? { rotate: [0, -2, 2, -1, 1, 0] } : { rotate: 0 }}
                    transition={editPageMode ? { repeat: Infinity, duration: 0.6, repeatDelay: 0.1 } : {}}
                  >
                    <motion.div
                      className={`rounded-full bg-gradient-to-br ${colorClasses}
                        flex items-center justify-center border border-white/50 relative overflow-hidden`}
                      style={{ width: diameter, height: diameter }}
                      animate={{
                        boxShadow: [
                          `0 0 ${isMobile ? 15 : 20}px ${glowColor}`,
                          `0 0 ${isMobile ? 25 : 35}px ${glowColorBright}`,
                          `0 0 ${isMobile ? 15 : 20}px ${glowColor}`,
                        ],
                      }}
                      whileHover={{
                        boxShadow: `0 0 ${isMobile ? 35 : 50}px ${glowColorBright}`,
                      }}
                      transition={{
                        boxShadow: { duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut' },
                      }}
                    >
                      <div className={`absolute inset-0 bg-white/20 transition-opacity duration-500 ${!editPageMode ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`} />
                      {space!.coverIcon ? (
                        <SpaceIconRenderer iconId={space!.coverIcon} size="lg" />
                      ) : (
                        <span className="relative z-10" style={{ fontSize: diameter * 0.35 }}>{space!.coverEmoji}</span>
                      )}
                    </motion.div>
                  </motion.button>

                  {/* Edit mode overlays */}
                  {editPageMode && isOwner && (
                    <>
                      <button
                        onClick={() => openEditSpace(space!)}
                        className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-warmDark/70 hover:text-warmDark transition-colors z-10 border border-warmMid/10"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {!isDelConfirm ? (
                        <button
                          onClick={() => setDeleteConfirmId(space!.id)}
                          className="absolute -top-1 -left-1 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-coral/60 hover:text-coral transition-colors z-10 border border-warmMid/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 z-20 whitespace-nowrap border border-warmMid/10">
                          <span className="text-sm text-warmDark/70 font-sans">Delete?</span>
                          <button onClick={() => handleDeleteSpace(space!.id)} className="text-sm text-coral font-medium hover:text-coral/70">Yes</button>
                          <button onClick={() => setDeleteConfirmId(null)} className="text-sm text-warmDark/75 hover:text-warmDark/70">No</button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Labels below bubble */}
                <div className="absolute text-center" style={{
                  top: diameter + 6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: Math.max(diameter + 20, 80),
                }}>
                  <h3 className="font-serif text-warmDark font-medium truncate" style={{ fontSize: Math.max(11, Math.min(14, diameter * 0.13)) }}>
                    {space!.title}
                  </h3>
                  {(() => {
                    const visibleCount = space!.memories?.length
                      ? space!.memories.filter((m) => {
                          if (!m.visibleTo || m.visibleTo.length === 0) return true
                          if (m.createdBy === currentUser?.id) return true
                          return currentUser ? m.visibleTo.includes(currentUser.id) : false
                        }).length
                      : space!.memoryCount
                    return (
                      <p className="font-handwriting text-warmDark/60" style={{ fontSize: Math.max(10, Math.min(12, diameter * 0.11)) }}>
                        {visibleCount} {visibleCount === 1 ? 'memory' : 'memories'}
                      </p>
                    )
                  })()}
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>

      {/* ===== MODALS ===== */}
      <AnimatePresence>
        {modal !== 'none' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={closeModal}>
            <div className="absolute inset-0 bg-warmDark/20 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass rounded-3xl p-8 w-full max-w-lg relative z-10 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={closeModal} className="absolute top-4 right-4 text-warmDark/75 hover:text-warmDark/70 transition-colors">
                <X className="w-5 h-5" />
              </button>

              {/* CREATE */}
              {modal === 'create' && (
                <>
                  <h2 className="font-serif text-2xl text-warmDark mb-6">Create a new space</h2>
                  <div className="space-y-5">
                    <div>
                      <label className="font-handwriting text-lg text-warmDark/70 block mb-2">Give it a name</label>
                      <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Thailand Trip 2025..."
                        className="w-full bg-white/50 rounded-xl px-4 py-3 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all" />
                    </div>

                    {/* Icon preview — centered */}
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${getColorClasses(newColor)} flex items-center justify-center border border-white/50 shadow-lg overflow-hidden`}>
                        <SpaceIconRenderer iconId={makeIconId(newIcon, newIconVariation)} size="full" />
                      </div>
                      <div className="text-center">
                        <p className="font-handwriting text-warmDark/70 text-lg italic">{newDescription}</p>
                        <button type="button" onClick={() => setNewDescription(randomTaglineForIcon(newIcon))}
                          className="text-sm font-sans text-warmDark/60 hover:text-warmDark/80 transition-colors mt-1">
                          ↻ shuffle tagline
                        </button>
                      </div>
                    </div>

                    {/* Icon picker */}
                    <div>
                      <label className="font-handwriting text-lg text-warmDark/70 block mb-2">Choose an icon</label>
                      <div className="max-h-60 overflow-y-auto space-y-4 pr-1">
                        {iconCategories.map((cat) => (
                          <div key={cat}>
                            <p className="font-sans text-sm text-warmDark/70 uppercase tracking-wider mb-2">{cat}</p>
                            <div className="flex flex-wrap gap-2">
                              {getIconsByCategory(cat).map((iconDef) => {
                                const isSelected = newIcon === iconDef.id
                                return [0, 1, 2].map((v) => {
                                  const isThisVariation = isSelected && newIconVariation === v
                                  return (
                                    <button key={`${iconDef.id}-${v}`}
                                      onClick={() => { setNewIcon(iconDef.id); setNewIconVariation(v); setNewDescription(randomTaglineForIcon(iconDef.id)) }}
                                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all overflow-hidden ${isThisVariation ? 'ring-2 ring-gold/60 scale-110' : 'hover:scale-105'}`}
                                      title={`${iconDef.name}${v > 0 ? ` (style ${v + 1})` : ''}`}
                                    >
                                      <div className="w-14 h-14 rounded-full overflow-hidden">
                                        <iconDef.component accent={v} />
                                      </div>
                                    </button>
                                  )
                                })
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-handwriting text-lg text-warmDark/70 block mb-2">What kind of space?</label>
                      <div className="flex gap-3">
                        <button onClick={() => setNewType('personal')}
                          className={`flex-1 py-3 rounded-xl font-sans text-sm transition-all ${newType === 'personal' ? 'bg-gold/20 text-warmDark ring-1 ring-gold/30' : 'bg-white/30 text-warmDark/70 hover:bg-white/50'}`}>
                          Personal
                        </button>
                        <button onClick={() => setNewType('group')}
                          className={`flex-1 py-3 rounded-xl font-sans text-sm transition-all ${newType === 'group' ? 'bg-gold/20 text-warmDark ring-1 ring-gold/30' : 'bg-white/30 text-warmDark/70 hover:bg-white/50'}`}>
                          Group
                        </button>
                      </div>
                      {newType === 'group' && (
                        <p className="text-sm text-warmDark/75 mt-2 font-sans">Invite members by email. They can accept or decline from the app.</p>
                      )}
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={closeModal} className="flex-1 py-3 rounded-xl text-warmDark/70 hover:bg-white/30 transition-all">Cancel</button>
                      <button onClick={handleCreate} disabled={creating} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold/80 to-coral/80 text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2">
                        {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Space'}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* EDIT SPACE */}
              {modal === 'edit-space' && editingSpace && (
                <>
                  <h2 className="font-serif text-2xl text-warmDark mb-6">Edit space</h2>
                  <div className="space-y-5">
                    <div>
                      <label className="font-handwriting text-lg text-warmDark/70 block mb-2">Name</label>
                      <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveSpace()}
                        className="w-full bg-white/50 rounded-xl px-4 py-3 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all" />
                    </div>

                    {/* Icon preview — centered */}
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${getColorClasses(editColor)} flex items-center justify-center border border-white/50 shadow-lg overflow-hidden`}>
                        <SpaceIconRenderer iconId={makeIconId(editIcon, editIconVariation)} size="full" />
                      </div>
                      <div className="text-center">
                        <p className="font-handwriting text-warmDark/70 text-lg italic">{editDescription || 'No tagline set'}</p>
                        <button type="button" onClick={() => setEditDescription(randomTaglineForIcon(editIcon))}
                          className="text-sm font-sans text-warmDark/60 hover:text-warmDark/80 transition-colors mt-1">
                          ↻ shuffle tagline
                        </button>
                      </div>
                    </div>

                    {/* Icon picker */}
                    <div>
                      <label className="font-handwriting text-lg text-warmDark/70 block mb-2">Icon</label>
                      <div className="max-h-60 overflow-y-auto space-y-4 pr-1">
                        {iconCategories.map((cat) => (
                          <div key={cat}>
                            <p className="font-sans text-sm text-warmDark/70 uppercase tracking-wider mb-2">{cat}</p>
                            <div className="flex flex-wrap gap-2">
                              {getIconsByCategory(cat).map((iconDef) => {
                                const isSelected = editIcon === iconDef.id
                                return [0, 1, 2].map((v) => {
                                  const isThisVariation = isSelected && editIconVariation === v
                                  return (
                                    <button key={`${iconDef.id}-${v}`}
                                      onClick={() => { setEditIcon(iconDef.id); setEditIconVariation(v) }}
                                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all overflow-hidden ${isThisVariation ? 'ring-2 ring-gold/60 scale-110' : 'hover:scale-105'}`}
                                      title={`${iconDef.name}${v > 0 ? ` (style ${v + 1})` : ''}`}
                                    >
                                      <div className="w-14 h-14 rounded-full overflow-hidden">
                                        <iconDef.component accent={v} />
                                      </div>
                                    </button>
                                  )
                                })
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button onClick={closeModal} className="flex-1 py-3 rounded-xl text-warmDark/70 hover:bg-white/30 transition-all">Cancel</button>
                      <button onClick={handleSaveSpace} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold/80 to-coral/80 text-white font-medium flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" /> Save
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* CHANGE PASSWORD */}
              {modal === 'change-password' && (
                <>
                  <h2 className="font-serif text-2xl text-warmDark mb-2">Change password</h2>
                  <p className="font-handwriting text-lg text-warmDark/75 mb-6">Keep your account secure</p>
                  <div className="space-y-4">
                    <div>
                      <label className="font-handwriting text-warmDark/70 text-base block mb-2">Current password</label>
                      <div className="relative">
                        <input
                          type={showOld ? 'text' : 'password'}
                          value={oldPassword}
                          onChange={(e) => { setOldPassword(e.target.value); setPwError('') }}
                          placeholder="Enter current password"
                          autoFocus
                          className="w-full bg-white/50 rounded-xl px-4 py-3 pr-11 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                        />
                        <button type="button" onClick={() => setShowOld((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-warmDark/70 hover:text-warmDark/70 transition-colors">
                          {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="font-handwriting text-warmDark/70 text-base block mb-2">New password</label>
                      <div className="relative">
                        <input
                          type={showNew ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => { setNewPassword(e.target.value); setPwError('') }}
                          placeholder="8+ chars, A-Z, 0-9, symbol"
                          className="w-full bg-white/50 rounded-xl px-4 py-3 pr-11 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                        />
                        <button type="button" onClick={() => setShowNew((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-warmDark/70 hover:text-warmDark/70 transition-colors">
                          {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="font-handwriting text-warmDark/70 text-base block mb-2">Confirm new password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setPwError('') }}
                        onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()}
                        placeholder="Repeat new password"
                        className="w-full bg-white/50 rounded-xl px-4 py-3 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                      />
                    </div>

                    {pwError && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-coral font-sans bg-coral/10 rounded-xl px-4 py-2">
                        {pwError}
                      </motion.p>
                    )}
                    {pwSuccess && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-teal font-sans bg-teal/10 rounded-xl px-4 py-2 flex items-center gap-2">
                        <Check className="w-4 h-4" /> Password changed successfully!
                      </motion.p>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button onClick={closeModal} className="flex-1 py-3 rounded-xl text-warmDark/70 hover:bg-white/30 transition-all">Cancel</button>
                      <button
                        onClick={handleChangePassword}
                        disabled={pwLoading || pwSuccess}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold/80 to-coral/80 text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {pwLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Update password'}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* MEMBERS */}
              {modal === 'members' && viewingSpace && (() => {
                const myRole = viewingSpace.membersList.find((m) => m.userId === currentUser?.id)?.role
                const canManage = myRole === 'owner' || myRole === 'admin'
                const activeMembers = viewingSpace.membersList
                  .filter((m) => m.status === 'active')
                  .sort((a, b) => ({ owner: 0, admin: 1, member: 2 }[a.role] - { owner: 0, admin: 1, member: 2 }[b.role]))

                const handleRemove = async (userId: string) => {
                  setRemovingMemberId(userId)
                  setMemberActionError('')
                  try {
                    await removeMember(viewingSpace.id, userId)
                  } catch (err: any) {
                    setMemberActionError(err.message || 'Failed to remove member')
                  } finally {
                    setRemovingMemberId(null)
                  }
                }

                const handleLeave = async () => {
                  setLeaveLoading(true)
                  setMemberActionError('')
                  try {
                    await leaveSpace(viewingSpace.id)
                    closeModal()
                  } catch (err: any) {
                    setMemberActionError(err.message || 'Failed to leave group')
                    setLeaveLoading(false)
                    setLeaveConfirm(false)
                  }
                }

                return (
                  <>
                    <div className="mb-6">
                      <h2 className="font-serif text-2xl text-warmDark flex items-center gap-2">
                        {viewingSpace.coverIcon ? <SpaceIconRenderer iconId={viewingSpace.coverIcon} size="sm" /> : <span>{viewingSpace.coverEmoji}</span>} {viewingSpace.title}
                      </h2>
                      <p className="font-handwriting text-warmDark/75 mt-1">
                        {activeMembers.length} members
                      </p>
                    </div>

                    <div className="space-y-1">
                      {activeMembers.map((member) => (
                        <div key={member.userId} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/20 transition-colors group">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lavender/60 to-peach/60 flex items-center justify-center flex-shrink-0">
                              <span className="font-serif text-sm text-warmDark">{member.name[0]}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-sans text-sm text-warmDark truncate">
                                {member.name}
                                {member.userId === currentUser?.id && <span className="text-warmDark/75 ml-1">(you)</span>}
                              </p>
                              <p className="text-sm text-warmDark/75">Joined {new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            {member.role === 'owner' && <span className="flex items-center gap-1 text-sm text-gold bg-gold/10 px-2 py-1 rounded-full"><Crown className="w-3 h-3" /> Owner</span>}
                            {member.role === 'admin' && <span className="flex items-center gap-1 text-sm text-teal bg-teal/10 px-2 py-1 rounded-full"><Shield className="w-3 h-3" /> Admin</span>}
                            {member.role === 'member' && !canManage && <span className="text-sm text-warmDark/70">Member</span>}
                            {/* Remove button — shown to owner/admin for other non-owner members */}
                            {canManage && member.userId !== currentUser?.id && member.role !== 'owner' && (
                              removingMemberId === member.userId ? (
                                <div className="flex items-center gap-1.5">
                                  <button onClick={() => handleRemove(member.userId)}
                                    className="text-sm text-coral font-medium hover:text-coral/70 transition-colors">Remove</button>
                                  <button onClick={() => setRemovingMemberId(null)}
                                    className="text-sm text-warmDark/75 hover:text-warmDark/70 transition-colors">Cancel</button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setRemovingMemberId(member.userId)}
                                  className="w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-warmDark/70 hover:text-coral/70 hover:bg-coral/10 transition-all"
                                  title="Remove member"
                                >
                                  <UserMinus className="w-3.5 h-3.5" />
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {memberActionError && (
                      <p className="text-sm text-coral font-sans mt-3 px-1">{memberActionError}</p>
                    )}

                    {/* Leave group — for non-owners */}
                    {myRole && myRole !== 'owner' && (
                      <div className="mt-5 pt-4 border-t border-warmMid/10">
                        {!leaveConfirm ? (
                          <button
                            onClick={() => setLeaveConfirm(true)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-coral/70 hover:text-coral hover:bg-coral/8 transition-colors text-sm font-sans"
                          >
                            <LogOut className="w-4 h-4" /> Leave group
                          </button>
                        ) : (
                          <div className="text-center space-y-3">
                            <p className="text-sm text-warmDark/70 font-sans">Leave <strong>{viewingSpace.title}</strong>?</p>
                            <div className="flex gap-2">
                              <button onClick={() => setLeaveConfirm(false)} disabled={leaveLoading}
                                className="flex-1 py-2.5 rounded-xl text-warmDark/75 hover:bg-white/30 transition-all text-sm font-sans">
                                Cancel
                              </button>
                              <button onClick={handleLeave} disabled={leaveLoading}
                                className="flex-1 py-2.5 rounded-xl bg-coral/80 text-white text-sm font-sans disabled:opacity-60 flex items-center justify-center gap-2">
                                {leaveLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Leaving…</> : 'Leave'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
