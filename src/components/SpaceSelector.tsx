import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Users, Crown, Shield, X, Pencil, Trash2, Check, Loader2, Mail, Eye, EyeOff, KeyRound, LogOut, UserMinus, ArrowLeft, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { api } from '../api'
import {
  spaceIconDefs, iconCategories, iconColors, getIconsByCategory,
  getIconDef, getIconVariation, makeIconId, getColorClasses,
  randomTaglineForIcon, SpaceIconRenderer,
} from './SpaceIcons'

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

const spacePageHeadings = [
  'Where do you want to go today?',
  'Which memory calls you back?',
  'Every space, a story waiting for you.',
  'Pick a space, relive the moment.',
  'Your memories are right here.',
  'Step into a moment you cherish.',
  'Which chapter do you want to revisit?',
]

const spacePageSubheadings = [
  'Choose a memory space to explore',
  'Each space holds a piece of your world',
  'Pick a space and relive the feeling',
  'The people, the places, the moments',
]

export default function SpaceSelector() {
  const { getVisibleSpaces, setActiveSpace, addSpace, updateSpace, deleteSpace, leaveSpace, removeMember, logout, currentUser, spaces, loading, pendingInvites, acceptSpaceInvite, rejectSpaceInvite } = useStore()
  const visibleSpaces = getVisibleSpaces()
  const [pageHeading] = useState(() => spacePageHeadings[Math.floor(Math.random() * spacePageHeadings.length)])
  const [pageSubheading] = useState(() => spacePageSubheadings[Math.floor(Math.random() * spacePageSubheadings.length)])

  const [modal, setModal] = useState<Modal>('none')
  const [newTitle, setNewTitle] = useState('')
  const [newIcon, setNewIcon] = useState('couple')
  const [newIconVariation, setNewIconVariation] = useState(0)
  const [newColor, setNewColor] = useState('purple-pink')
  const [newDescription, setNewDescription] = useState(randomTaglineForIcon('couple'))
  const [newType, setNewType] = useState<'personal' | 'group'>('personal')
  const [createStep, setCreateStep] = useState<'type' | 'design' | 'invite'>('type')
  const [createdSpaceId, setCreatedSpaceId] = useState<string | null>(null)
  const [inviteInput, setInviteInput] = useState('')
  const [invitedEmails, setInvitedEmails] = useState<string[]>([])
  const [inviteStatus, setInviteStatus] = useState<{ email: string; ok: boolean; msg: string } | null>(null)
  const [inviting, setInviting] = useState(false)
  const [viewingSpaceId, setViewingSpaceId] = useState<string | null>(null)

  // Edit-mode for spaces page
  const [editPageMode, setEditPageMode] = useState(false)
  const spacesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editPageMode) return
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node
      const insideModal = (target as Element).closest?.('[data-modal]')
      if (spacesContainerRef.current && !spacesContainerRef.current.contains(target) && !insideModal) {
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
  const [deleteConfirmSpace, setDeleteConfirmSpace] = useState<MemorySpace | null>(null)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [editError, setEditError] = useState('')
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

  // Icon theme (accent variation): 0 = Warm, 1 = Lavender, 2 = Rosy
  const [selectedTheme, setSelectedTheme] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string>(iconCategories[0])
  const categoryShortNames: Record<string, string> = {
    'Pets': 'Pets', 'Kids': 'Kids', 'College & School': 'College',
    'Friends & Gang': 'Friends', 'Family & Couples': 'Family',
    'Siblings & Cousins': 'Siblings', 'Personal': 'Personal',
    'Trips & Vacations': 'Trips', 'Celebrations & More': 'Celebrations',
  }

  const handleCreate = async () => {
    if (creating) return
    if (!newTitle.trim()) {
      setCreateError('Please give your space a name')
      return
    }
    setCreateError('')
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
      const newSpaceId = await addSpace(space)
      setNewTitle('')
      setNewIcon('couple')
      setNewIconVariation(0)
      setNewColor('purple-pink')
      setNewDescription(randomTaglineForIcon('couple'))
      if (newType === 'group' && newSpaceId) {
        setCreatedSpaceId(newSpaceId)
        setInvitedEmails([])
        setInviteInput('')
        setInviteStatus(null)
        setCreateStep('invite')
      } else {
        setModal('none')
        if (newSpaceId) setActiveSpace(newSpaceId)
      }
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
    if (!editingSpaceId) return
    if (!editTitle.trim()) {
      setEditError('Space name cannot be empty')
      return
    }
    setEditError('')
    const iconId = makeIconId(editIcon, editIconVariation)
    await updateSpace(editingSpaceId, { title: editTitle.trim(), coverIcon: iconId, coverColor: editColor, description: editDescription.trim() || undefined })
    setModal('none'); setEditingSpaceId(null); setEditPageMode(false)
  }

  const sendInvite = async () => {
    if (!inviteInput.trim() || !createdSpaceId) return
    const email = inviteInput.trim()
    if (!email.includes('@')) {
      setInviteStatus({ email, ok: false, msg: 'Please enter a valid email address' })
      return
    }
    setInviting(true)
    setInviteStatus(null)
    try {
      await api.inviteByEmail(createdSpaceId, email)
      setInvitedEmails((prev) => [...prev, email])
      setInviteInput('')
      setInviteStatus({ email, ok: true, msg: `Invite sent to ${email}` })
    } catch {
      setInviteStatus({ email, ok: false, msg: `Couldn't send invite to ${email}` })
    } finally {
      setInviting(false)
    }
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
    setCreateStep('type')
    setCreatedSpaceId(null)
    setInviteInput('')
    setInvitedEmails([])
    setInviteStatus(null)
    setCreateError('')
    setEditError('')
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
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-12 md:py-20">
        {/* Top Right Controls */}
        <div className="absolute top-6 right-6 flex items-center gap-3 z-30">
            {/* Profile Menu Dropdown Container */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu((v) => {
                  if (v) setShowInvites(false) // Reset nested view when closing
                  return !v
                })}
                className="relative w-11 h-11 rounded-full bg-gradient-to-br from-gold/60 to-coral/60 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all ring-2 ring-white/50"
                title="Profile options"
              >
                <span className="font-serif text-lg text-white font-semibold drop-shadow-sm">
                  {currentUser?.name?.[0]?.toUpperCase() || 'U'}
                </span>
                {pendingInvites.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-coral to-red-400 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-md ring-2 ring-white/80">
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
                      className="absolute right-0 top-14 z-20 w-60 bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl overflow-hidden"
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
                            <div className="px-5 py-4 border-b border-warmMid/10 bg-gradient-to-r from-gold/10 to-coral/10">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/50 to-coral/50 flex items-center justify-center ring-2 ring-white/60 flex-shrink-0">
                                  <span className="font-serif text-base text-white font-semibold">{currentUser?.name?.[0]?.toUpperCase() || 'U'}</span>
                                </div>
                                <div className="min-w-0">
                                  <p className="font-serif text-lg text-warmDark truncate font-medium">
                                    {currentUser?.name || 'User'}
                                  </p>
                                  <p className="font-sans text-xs text-warmDark/55 truncate">
                                    {currentUser?.email || 'user@example.com'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-2">
                              {pendingInvites.length > 0 && (
                                <button
                                  onClick={() => setShowInvites(true)}
                                  className="w-full text-left px-4 py-3 mx-1 my-0.5 rounded-xl hover:bg-gold/8 transition-all flex items-center gap-3 group"
                                >
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-4 h-4 text-amber-600/80" />
                                  </div>
                                  <span className="font-sans text-sm text-warmDark/75 group-hover:text-warmDark flex-1">Space invitations</span>
                                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-coral/80 to-red-400/80 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                                    {pendingInvites.length}
                                  </span>
                                </button>
                              )}

                              {visibleSpaces.length > 0 && (
                                <button
                                  onClick={() => {
                                    setEditPageMode((v) => !v)
                                    setDeleteConfirmId(null)
                                    setShowProfileMenu(false)
                                  }}
                                  className="w-full text-left px-4 py-3 mx-1 my-0.5 rounded-xl hover:bg-gold/8 transition-all flex items-center gap-3 group"
                                >
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${editPageMode ? 'bg-gradient-to-br from-coral/20 to-red-100' : 'bg-gradient-to-br from-gold/20 to-amber-100'}`}>
                                    <Pencil className={`w-4 h-4 ${editPageMode ? 'text-coral/80' : 'text-gold/80'}`} />
                                  </div>
                                  <span className={`font-sans text-sm ${editPageMode ? 'text-coral/80 font-medium' : 'text-warmDark/75 group-hover:text-warmDark'}`}>
                                    {editPageMode ? 'Done Editing' : 'Edit Spaces'}
                                  </span>
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setModal('change-password')
                                  setShowProfileMenu(false)
                                }}
                                className="w-full text-left px-4 py-3 mx-1 my-0.5 rounded-xl hover:bg-gold/8 transition-all flex items-center gap-3 group"
                              >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                                  <KeyRound className="w-4 h-4 text-purple-500/80" />
                                </div>
                                <span className="font-sans text-sm text-warmDark/75 group-hover:text-warmDark">Change password</span>
                              </button>
                            </div>

                            <div className="border-t border-warmMid/10 p-2">
                              <button
                                onClick={() => {
                                  setShowProfileMenu(false)
                                  logout()
                                }}
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-coral/8 transition-all flex items-center gap-3 group"
                              >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral/15 to-red-100 flex items-center justify-center flex-shrink-0">
                                  <LogOut className="w-4 h-4 text-coral/70" />
                                </div>
                                <span className="font-sans text-sm text-coral/75 group-hover:text-coral font-medium">Sign out</span>
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
                                    {inv.spaceIcon ? (
                                      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                                        <SpaceIconRenderer iconId={inv.spaceIcon} size="full" />
                                      </div>
                                    ) : (
                                      <span className="text-2xl flex-shrink-0">{inv.spaceEmoji}</span>
                                    )}
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
          className="text-center mb-12 mt-8 md:mt-0"
        >
          {currentUser && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="font-handwriting text-2xl md:text-3xl text-warmDark/70 mb-4">
              Hello, {currentUser.name}
            </motion.p>
          )}

          <h1 className="font-serif text-3xl md:text-5xl text-warmDark mb-4">
            {visibleSpaces.length === 0 ? 'Your story starts here' : pageHeading}
          </h1>
          <p className="font-handwriting text-xl md:text-2xl text-warmDark/70">
            {visibleSpaces.length === 0 ? 'Create a space to begin' : pageSubheading}
          </p>
        </motion.div>

        {/* Empty state */}
        {visibleSpaces.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center text-center max-w-sm mb-16 gap-6"
          >
            {/* Icon cluster */}
            <div className="flex items-end gap-4">
              {[
                { iconId: 'friends-trio-0', delay: '0s', size: 'w-16 h-16' },
                { iconId: 'reading-0', delay: '0.35s', size: 'w-20 h-20' },
                { iconId: 'road-trip-0', delay: '0.7s', size: 'w-16 h-16' },
              ].map(({ iconId, delay, size }) => (
                <div key={iconId} className={`${size} rounded-full glass shadow-md animate-float overflow-hidden`} style={{ animationDelay: delay }}>
                  <SpaceIconRenderer iconId={iconId} size="full" />
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <p className="font-serif text-warmDark text-base leading-relaxed italic drop-shadow-sm">
                A place to keep memories — trips, birthdays,<br />everyday moments with people you love.
              </p>
              <p className="font-handwriting text-2xl text-warmDark">
                Make one for your family, a trip, or just yourself.
              </p>
            </div>

            {/* Arrow hint + button */}
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="flex flex-col items-center gap-1 text-warmDark/50"
              >
                <p className="font-sans text-sm tracking-wide">tap <span className="font-semibold text-gold">+ New Space</span> to begin</p>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3v14M10 17l-4-4M10 17l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              <button
                onClick={() => setModal('create')}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold/90 to-coral/90 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all font-sans font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                New Space
              </button>
            </div>
          </motion.div>
        )}

        {/* Space bubbles */}
        <div ref={spacesContainerRef} className="flex flex-wrap justify-center gap-8 md:gap-10 max-w-5xl mb-12">
          {visibleSpaces.map((space, i) => {
            const isOwner = space.createdBy === currentUser?.id
            const myRole = space.membersList.find((m) => m.userId === currentUser?.id)?.role
            const isDelConfirm = false // handled by modal now
            return (
              <motion.div
                key={space.id}
                initial={{ opacity: 0, scale: 0.5, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1, type: 'spring', stiffness: 100 }}
                className="flex flex-col items-center"
              >
                <div className="relative">
                  <motion.button
                    whileHover={editPageMode ? {} : { scale: 1.08, y: -8 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => editPageMode ? undefined : setActiveSpace(space.id)}
                    className={`group flex flex-col items-center relative ${editPageMode ? 'cursor-default' : ''}`}
                    animate={editPageMode ? { rotate: [0, -2, 2, -1, 1, 0] } : { rotate: 0 }}
                    transition={editPageMode ? { repeat: Infinity, duration: 0.6, repeatDelay: 0.1 } : {}}
                  >
                    <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br ${space.coverColor ? getColorClasses(space.coverColor) : defaultSpaceColors[i % defaultSpaceColors.length]}
                      flex items-center justify-center shadow-lg transition-shadow duration-500
                      border border-white/50 relative overflow-hidden ${!editPageMode ? 'group-hover:shadow-2xl' : ''}`}>
                      <div className={`absolute inset-0 bg-white/20 transition-opacity duration-500 ${!editPageMode ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`} />
                      {space.coverIcon ? (
                        <SpaceIconRenderer iconId={space.coverIcon} size="lg" />
                      ) : (
                        <span className="text-4xl md:text-5xl relative z-10">{space.coverEmoji}</span>
                      )}
                    </div>
                  </motion.button>

                  {/* Edit mode overlays */}
                  {editPageMode && isOwner && (
                    <>
                      <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                        onClick={() => openEditSpace(space)}
                        className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-gradient-to-br from-gold/80 to-amber-400/80 shadow-lg flex items-center justify-center text-white hover:shadow-xl hover:scale-110 transition-all z-10 ring-2 ring-white/80"
                      >
                        <Pencil className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, delay: 0.15 }}
                        onClick={() => setDeleteConfirmSpace(space)}
                        className="absolute -top-2 -left-2 w-9 h-9 rounded-full bg-gradient-to-br from-coral/80 to-red-400/80 shadow-lg flex items-center justify-center text-white hover:shadow-xl hover:scale-110 transition-all z-10 ring-2 ring-white/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </>
                  )}
                </div>

                <div className="mt-3 text-center">
                  <h3 className="font-serif text-base md:text-lg text-warmDark font-medium">{space.title}</h3>
                  {(() => {
                    const visibleCount = space.memories?.length
                      ? space.memories.filter((m) => {
                          if (!m.visibleTo || m.visibleTo.length === 0) return true
                          if (m.createdBy === currentUser?.id) return true
                          return currentUser ? m.visibleTo.includes(currentUser.id) : false
                        }).length
                      : space.memoryCount
                    return (
                      <p className="font-handwriting text-warmDark/70 text-base">
                        {visibleCount} {visibleCount === 1 ? 'memory' : 'memories'}
                      </p>
                    )
                  })()}
                  {space.type === 'group' && (
                    <button
                      onClick={() => { if (!editPageMode) { setViewingSpaceId(space.id); setModal('members') } }}
                      className="flex items-center gap-1 mx-auto mt-1 text-sm text-warmDark/75 hover:text-warmDark/80 transition-colors"
                    >
                      <Users className="w-3 h-3" />
                      <span>{space.membersList.filter((m) => m.status === 'active').length} members</span>
                      {isOwner && <Crown className="w-3 h-3 text-gold/60" />}
                    </button>
                  )}
                  {space.type === 'group' && myRole && myRole !== 'owner' && (
                    <p className="text-sm text-warmDark/70 mt-0.5">{myRole === 'admin' ? 'Admin' : 'Member'}</p>
                  )}
                </div>
              </motion.div>
            )
          })}

        </div>

        {/* Floating "New Space" button — bottom right corner (only when spaces exist) */}
        {visibleSpaces.length > 0 && <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModal('create')}
          className="fixed bottom-8 right-8 z-30 flex items-center gap-2 px-5 py-3.5 rounded-full bg-gradient-to-r from-gold/90 to-coral/90 text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="w-5 h-5" />
          <span className="font-sans font-medium text-sm">New Space</span>
        </motion.button>}

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
              className={`glass rounded-3xl p-8 w-full relative z-10 max-h-[85vh] overflow-y-auto ${modal === 'members' ? 'max-w-sm' : 'max-w-lg'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={closeModal} className="absolute top-4 right-4 text-warmDark/75 hover:text-warmDark/70 transition-colors">
                <X className="w-5 h-5" />
              </button>

              {/* CREATE — Step 1: Choose type */}
              {modal === 'create' && createStep === 'type' && (
                <>
                  <h2 className="font-serif text-2xl text-warmDark mb-2">Create a new space</h2>
                  <p className="font-handwriting text-lg text-warmDark/60 mb-6">What kind of space?</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => { setNewType('personal'); setCreateStep('design') }}
                      className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-purple-50/80 to-pink-50/80 border border-purple-200/40 hover:border-purple-300/60 hover:shadow-lg hover:scale-[1.02] transition-all"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-200/70 to-pink-200/70 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <User className="w-7 h-7 text-purple-600/80" />
                      </div>
                      <div className="text-center">
                        <p className="font-serif text-lg text-warmDark font-medium">Personal</p>
                        <p className="font-sans text-sm text-warmDark/55 mt-1 leading-snug">A private space just for you</p>
                      </div>
                    </button>
                    <button
                      onClick={() => { setNewType('group'); setCreateStep('design') }}
                      className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/80 border border-amber-200/40 hover:border-amber-300/60 hover:shadow-lg hover:scale-[1.02] transition-all"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-200/70 to-orange-200/70 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <Users className="w-7 h-7 text-amber-600/80" />
                      </div>
                      <div className="text-center">
                        <p className="font-serif text-lg text-warmDark font-medium">Group</p>
                        <p className="font-sans text-sm text-warmDark/55 mt-1 leading-snug">Share memories with your circle</p>
                      </div>
                    </button>
                  </div>
                </>
              )}

              {/* CREATE — Step 2: Design */}
              {modal === 'create' && createStep === 'design' && (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    <button onClick={() => setCreateStep('type')} className="p-1.5 -ml-1.5 rounded-lg text-warmDark/50 hover:text-warmDark/80 hover:bg-white/40 transition-all">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="font-serif text-2xl text-warmDark">Design your space</h2>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="font-handwriting text-lg text-warmDark/70 block mb-2">Give it a name</label>
                      <input type="text" value={newTitle} onChange={(e) => { setNewTitle(e.target.value); setCreateError('') }}
                        placeholder="Thailand Trip 2025..."
                        className={`w-full bg-white/50 rounded-xl px-4 py-3 text-warmDark font-sans outline-none focus:ring-2 transition-all ${createError ? 'ring-2 ring-red-300/60' : 'focus:ring-gold/30'}`} />
                      {createError && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500/80 text-sm font-sans mt-1.5">{createError}</motion.p>
                      )}
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
                      {/* Category pills — wrap naturally */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {iconCategories.map((cat) => (
                          <button key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 rounded-full font-sans text-xs transition-all ${selectedCategory === cat ? 'bg-warmDark text-warmWhite font-medium' : 'bg-white/50 text-warmDark/60 hover:bg-white/70'}`}
                          >
                            {categoryShortNames[cat] ?? cat}
                          </button>
                        ))}
                      </div>
                      {/* Theme toggle */}
                      <div className="flex gap-2 mb-3">
                        {([{ label: 'Warm', value: 0 }, { label: 'Lavender', value: 1 }, { label: 'Rosy', value: 2 }] as const).map((theme) => (
                          <button key={theme.value}
                            onClick={() => { setSelectedTheme(theme.value); setNewIconVariation(theme.value) }}
                            className={`px-4 py-1.5 rounded-full font-sans text-sm transition-all ${selectedTheme === theme.value ? 'bg-coral/20 text-warmDark ring-1 ring-coral/30 font-medium' : 'bg-white/30 text-warmDark/60 hover:bg-white/50'}`}
                          >
                            {theme.label}
                          </button>
                        ))}
                      </div>
                      {/* Icon grid — no scroll, just a clean grid */}
                      <div className="grid grid-cols-6 gap-2">
                        {getIconsByCategory(selectedCategory).map((iconDef) => {
                          const isSelected = newIcon === iconDef.id && newIconVariation === selectedTheme
                          return (
                            <button key={iconDef.id}
                              onClick={() => { setNewIcon(iconDef.id); setNewIconVariation(selectedTheme); setNewDescription(randomTaglineForIcon(iconDef.id)) }}
                              className={`w-full aspect-square rounded-full flex items-center justify-center transition-all overflow-hidden ${isSelected ? 'ring-2 ring-gold/70 scale-110 shadow-md' : 'hover:scale-105 hover:shadow-sm'}`}
                              title={iconDef.name}
                            >
                              <iconDef.component accent={selectedTheme} />
                            </button>
                          )
                        })}
                      </div>
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

              {/* CREATE — Step 3: Invite friends (group only) */}
              {modal === 'create' && createStep === 'invite' && (
                <>
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/30 to-coral/30 flex items-center justify-center mb-3">
                      <Users className="w-7 h-7 text-gold/80" />
                    </div>
                    <h2 className="font-serif text-2xl text-warmDark">Invite friends</h2>
                    <p className="font-sans text-sm text-warmDark/55 mt-1 text-center">Share this space with people you love</p>
                  </div>

                  {/* Email input */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="email"
                      value={inviteInput}
                      onChange={(e) => { setInviteInput(e.target.value); setInviteStatus(null) }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendInvite() } }}
                      placeholder="friend@email.com"
                      className="flex-1 bg-white/50 rounded-xl px-4 py-3 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all text-sm"
                    />
                    <button
                      onClick={sendInvite}
                      disabled={inviting || !inviteInput.trim()}
                      className="px-4 py-3 rounded-xl bg-gradient-to-r from-gold/80 to-coral/80 text-white font-medium disabled:opacity-50 flex items-center gap-1.5 transition-all hover:shadow-md"
                    >
                      {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                      <span className="text-sm">Send</span>
                    </button>
                  </div>

                  {/* Status message */}
                  <AnimatePresence>
                    {inviteStatus && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`text-sm font-sans mb-3 ${inviteStatus.ok ? 'text-emerald-600/80' : 'text-red-500/80'}`}
                      >
                        {inviteStatus.msg}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Invited emails list */}
                  {invitedEmails.length > 0 && (
                    <div className="mb-4 space-y-1.5">
                      {invitedEmails.map((email) => (
                        <div key={email} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50/60 border border-emerald-200/40">
                          <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span className="text-sm font-sans text-warmDark/70 truncate">{email}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => { setModal('none'); setCreateStep('type'); if (createdSpaceId) setActiveSpace(createdSpaceId) }}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold/80 to-coral/80 text-white font-medium transition-all hover:shadow-md"
                    >
                      {invitedEmails.length > 0 ? 'Open Space' : 'Skip for now'}
                    </button>
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
                      <input type="text" value={editTitle} onChange={(e) => { setEditTitle(e.target.value); setEditError('') }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveSpace()}
                        className={`w-full bg-white/50 rounded-xl px-4 py-3 text-warmDark font-sans outline-none focus:ring-2 transition-all ${editError ? 'ring-2 ring-red-300/60' : 'focus:ring-gold/30'}`} />
                      {editError && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500/80 text-sm font-sans mt-1.5">{editError}</motion.p>
                      )}
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
                      {/* Category pills — wrap naturally */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {iconCategories.map((cat) => (
                          <button key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 rounded-full font-sans text-xs transition-all ${selectedCategory === cat ? 'bg-warmDark text-warmWhite font-medium' : 'bg-white/50 text-warmDark/60 hover:bg-white/70'}`}
                          >
                            {categoryShortNames[cat] ?? cat}
                          </button>
                        ))}
                      </div>
                      {/* Theme toggle */}
                      <div className="flex gap-2 mb-3">
                        {([{ label: 'Warm', value: 0 }, { label: 'Lavender', value: 1 }, { label: 'Rosy', value: 2 }] as const).map((theme) => (
                          <button key={theme.value}
                            onClick={() => { setSelectedTheme(theme.value); setEditIconVariation(theme.value) }}
                            className={`px-4 py-1.5 rounded-full font-sans text-sm transition-all ${selectedTheme === theme.value ? 'bg-coral/20 text-warmDark ring-1 ring-coral/30 font-medium' : 'bg-white/30 text-warmDark/60 hover:bg-white/50'}`}
                          >
                            {theme.label}
                          </button>
                        ))}
                      </div>
                      {/* Icon grid */}
                      <div className="grid grid-cols-6 gap-2">
                        {getIconsByCategory(selectedCategory).map((iconDef) => {
                          const isSelected = editIcon === iconDef.id && editIconVariation === selectedTheme
                          return (
                            <button key={iconDef.id}
                              onClick={() => { setEditIcon(iconDef.id); setEditIconVariation(selectedTheme) }}
                              className={`w-full aspect-square rounded-full flex items-center justify-center transition-all overflow-hidden ${isSelected ? 'ring-2 ring-gold/70 scale-110 shadow-md' : 'hover:scale-105 hover:shadow-sm'}`}
                              title={iconDef.name}
                            >
                              <iconDef.component accent={selectedTheme} />
                            </button>
                          )
                        })}
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

      {/* DELETE SPACE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfirmSpace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirmSpace(null)}
          >
            <div className="absolute inset-0 bg-warmDark/30 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass rounded-3xl p-8 w-full max-w-sm relative z-10"
              data-modal="delete-confirm"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warning icon */}
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-coral/20 to-red-200/40 flex items-center justify-center">
                  <Trash2 className="w-7 h-7 text-coral/80" />
                </div>
              </div>

              <h2 className="font-serif text-2xl text-warmDark text-center mb-2">Delete "{deleteConfirmSpace.title}"?</h2>
              <p className="font-sans text-sm text-warmDark/60 text-center mb-2 leading-relaxed">
                This will permanently delete this space and everything inside it.
              </p>
              <div className="bg-coral/8 border border-coral/20 rounded-xl px-4 py-3 mb-6">
                <ul className="space-y-1.5">
                  {[
                    `All ${deleteConfirmSpace.memoryCount || deleteConfirmSpace.memories?.length || 0} memories will be lost`,
                    'All photos will be permanently deleted',
                    'All substories and captions gone',
                    'This cannot be undone',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm font-sans text-coral/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-coral/60 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmSpace(null)}
                  className="flex-1 py-3 rounded-xl text-warmDark/70 hover:bg-white/40 transition-all font-sans font-medium"
                >
                  Keep it
                </button>
                <button
                  onClick={() => {
                    handleDeleteSpace(deleteConfirmSpace.id)
                    setDeleteConfirmSpace(null)
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-coral/80 to-red-400/80 text-white font-medium font-sans hover:shadow-lg transition-all"
                >
                  Yes, delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
