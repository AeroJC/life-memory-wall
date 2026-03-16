import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Users, Crown, Shield, X, Pencil, Trash2, Check, Loader2, Mail, Eye, EyeOff, KeyRound, LogOut, UserMinus, ArrowLeft, User, ImagePlus, Copy, Lock, Unlock, UserPlus } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { api } from '../api'
import { uploadImage } from '../cloudinary'
import {
  spaceIconDefs, iconCategories, iconColors, getIconsByCategory,
  getIconDef, getIconVariation, makeIconId, getColorClasses,
  randomTaglineForIcon, SpaceIconRenderer,
} from './SpaceIcons'
import { validatePassword } from '../utils/validation'
import { MemorySpace } from '../types'
import ParticleBackground from './ParticleBackground'
import ImageCropModal from './ImageCropModal'

const defaultSpaceColors = [
  'from-purple-200/60 to-pink-200/60',
  'from-amber-200/60 to-orange-200/60',
  'from-teal-200/60 to-cyan-200/60',
  'from-rose-200/60 to-red-200/60',
  'from-indigo-200/60 to-blue-200/60',
  'from-lime-200/60 to-emerald-200/60',
]

type Modal = 'none' | 'create' | 'members' | 'edit-space' | 'edit-profile' | 'change-password' | 'join' | 'unlock-vault' | 'set-secret-code' | 'profile' | 'manage-spaces'

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
  const { getVisibleSpaces, setActiveSpace, addSpace, updateSpace, deleteSpace, leaveSpace, removeMember, logout, currentUser, spaces, loading, pendingInvites, acceptSpaceInvite, rejectSpaceInvite, hiddenSpaceIds: storeHiddenSpaceIds, hasVaultCode, setVaultCode: storeSetVaultCode, changeVaultCode: storeChangeVaultCode, verifyVaultCode: storeVerifyVaultCode, updateHiddenSpaces: storeUpdateHiddenSpaces } = useStore()
  const allSpaces = getVisibleSpaces()
  const totalJoinRequests = spaces.reduce((sum, s) => s.createdBy === currentUser?.id ? sum + (s.joinRequests?.length || 0) : sum, 0)
  const totalNotifications = pendingInvites.length + totalJoinRequests
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
  const [newCoverImage, setNewCoverImage] = useState('')
  const [newCoverImagePosX, setNewCoverImagePosX] = useState(50)
  const [newCoverImagePosY, setNewCoverImagePosY] = useState(50)
  const [newCoverImageScale, setNewCoverImageScale] = useState(1)
  const [coverImageUploading, setCoverImageUploading] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [cropTarget, setCropTarget] = useState<'create' | 'edit' | null>(null)
  const [cropIsReadjust, setCropIsReadjust] = useState(false)
  const [cropPendingFile, setCropPendingFile] = useState<File | null>(null)
  const [cropInitialPosX, setCropInitialPosX] = useState(50)
  const [cropInitialPosY, setCropInitialPosY] = useState(50)
  const [cropInitialScale, setCropInitialScale] = useState(1)
  const [cropUploading, setCropUploading] = useState(false)
  const [createdSpaceId, setCreatedSpaceId] = useState<string | null>(null)
  const [createdInviteCode, setCreatedInviteCode] = useState<string | null>(null)
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
  const [editCoverImage, setEditCoverImage] = useState('')
  const [editCoverImagePosX, setEditCoverImagePosX] = useState(50)
  const [editCoverImagePosY, setEditCoverImagePosY] = useState(50)
  const [editCoverImageScale, setEditCoverImageScale] = useState(1)
  const [editCoverImageUploading, setEditCoverImageUploading] = useState(false)
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

  // Join group
  const [joinCode, setJoinCode] = useState('')
  const [joinLoading, setJoinLoading] = useState(false)
  const [joinError, setJoinError] = useState('')
  const [joinSuccess, setJoinSuccess] = useState('')
  const [codeCopied, setCodeCopied] = useState(false)
  const [membersTab, setMembersTab] = useState<'members' | 'requests'>('members')

  const pwSuccessTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (pwSuccessTimerRef.current) clearTimeout(pwSuccessTimerRef.current) }, [])

  // Profile Menu
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [editName, setEditName] = useState('')
  const [editNameError, setEditNameError] = useState('')
  const [editNameLoading, setEditNameLoading] = useState(false)
  const [editNameSuccess, setEditNameSuccess] = useState(false)
  const [profileTab, setProfileTab] = useState<'name' | 'password' | 'code'>('name')

  // Icon theme (accent variation): 0 = Warm, 1 = Lavender, 2 = Rosy
  const [selectedTheme, setSelectedTheme] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string>(iconCategories[0])

  // Hidden Spaces / Secret Vault
  const hiddenSpaceIds = new Set(storeHiddenSpaceIds)
  const [hideSelectMode, setHideSelectMode] = useState(false)
  const [selectedToHide, setSelectedToHide] = useState<Set<string>>(new Set())
  const [vaultOpen, setVaultOpen] = useState(false)
  const [vaultPinInput, setVaultPinInput] = useState('')
  const [vaultPinError, setVaultPinError] = useState('')
  const [newSecretCode, setNewSecretCode] = useState('')
  const [confirmSecretCode, setConfirmSecretCode] = useState('')
  const [currentSecretCodeInput, setCurrentSecretCodeInput] = useState('')
  const [secretCodeError, setSecretCodeError] = useState('')
  const [secretCodeSuccess, setSecretCodeSuccess] = useState(false)
  const [pendingHideAfterCode, setPendingHideAfterCode] = useState(false)
  const categoryShortNames: Record<string, string> = {
    'Pets': 'Pets', 'Kids': 'Kids', 'College & School': 'College',
    'Friends & Gang': 'Friends', 'Family & Couples': 'Family',
    'Siblings & Cousins': 'Siblings', 'Personal': 'Personal',
    'Trips & Vacations': 'Trips', 'Celebrations & More': 'Celebrations',
  }

  // Spaces shown in the grid (respects vault state)
  const visibleSpaces = hideSelectMode || vaultOpen
    ? allSpaces
    : allSpaces.filter((s) => !hiddenSpaceIds.has(s.id))

  const handleDoneHiding = () => {
    if (selectedToHide.size > 0 && !hasVaultCode) {
      setPendingHideAfterCode(true)
      setModal('set-secret-code')
      return
    }
    storeUpdateHiddenSpaces(Array.from(selectedToHide))
    setSelectedToHide(new Set())
    setHideSelectMode(false)
    setVaultOpen(false)
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
      coverImage: newCoverImage,
      coverImageOffsetX: newCoverImagePosX,
      coverImageOffsetY: newCoverImagePosY,
      coverImageScale: newCoverImageScale,
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
      const created = await addSpace(space)
      setNewTitle('')
      setNewIcon('couple')
      setNewIconVariation(0)
      setNewColor('purple-pink')
      setNewCoverImage('')
      setNewCoverImagePosX(50)
      setNewCoverImagePosY(50)
      setNewCoverImageScale(1)
      setNewDescription(randomTaglineForIcon('couple'))
      if (newType === 'group' && created?.id) {
        setCreatedSpaceId(created.id)
        setCreatedInviteCode(created.inviteCode || null)
        setCreateStep('invite')
      } else {
        setModal('none')
        if (created?.id) setActiveSpace(created.id)
      }
    } finally {
      setCreating(false)
    }
  }

  const openEditSpace = (space: MemorySpace) => {
    setEditingSpaceId(space.id)
    setEditTitle(space.title)
    setEditCoverImage(space.coverImage || '')
    setEditCoverImagePosX(space.coverImageOffsetX ?? 50)
    setEditCoverImagePosY(space.coverImageOffsetY ?? 50)
    setEditCoverImageScale(space.coverImageScale ?? 1)
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
    await updateSpace(editingSpaceId, { title: editTitle.trim(), coverImage: editCoverImage || undefined, coverImageOffsetX: editCoverImagePosX, coverImageOffsetY: editCoverImagePosY, coverImageScale: editCoverImageScale, coverIcon: editCoverImage ? '' : iconId, coverColor: editColor, description: editDescription.trim() || undefined })
    setModal('none'); setEditingSpaceId(null); setEditPageMode(false)
  }

  const handleDeleteSpace = async (spaceId: string) => {
    await deleteSpace(spaceId)
    setDeleteConfirmId(null); setModal('none'); setEditingSpaceId(null)
  }

  const handleJoinByCode = async () => {
    if (!joinCode.trim()) { setJoinError('Please enter an invite code'); return }
    setJoinLoading(true)
    setJoinError('')
    setJoinSuccess('')
    try {
      const result = await api.joinByCode(joinCode.trim())
      setJoinSuccess(`Request sent to join "${result.spaceName}"! The owner will review your request.`)
      setJoinCode('')
    } catch (err: any) {
      setJoinError(err.message || 'Failed to join. Please check the code and try again.')
    } finally {
      setJoinLoading(false)
    }
  }

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    })
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
      if (pwSuccessTimerRef.current) clearTimeout(pwSuccessTimerRef.current)
      pwSuccessTimerRef.current = setTimeout(() => { setPwSuccess(false); setModal('none') }, 1500)
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
    setNewCoverImage('')
    setEditCoverImage('')
    setCreatedSpaceId(null)
    setCreatedInviteCode(null)
    setJoinCode('')
    setJoinError('')
    setJoinSuccess('')
    setCodeCopied(false)
    setCreateError('')
    setEditError('')
    // Vault / hide state reset
    setVaultPinInput('')
    setVaultPinError('')
    setNewSecretCode('')
    setConfirmSecretCode('')
    setCurrentSecretCodeInput('')
    setSecretCodeError('')
    setSecretCodeSuccess(false)
    if (!pendingHideAfterCode) setPendingHideAfterCode(false)
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
    <div className="h-full gradient-bg relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 h-full overflow-y-auto flex flex-col items-center px-4 pt-16 pb-8">
        {/* Top Right Controls */}
        <div className="fixed top-0 right-0 z-30 pr-6 flex items-center gap-3" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 50px)' }}>
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
                {totalNotifications > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-coral to-red-400 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-md ring-2 ring-white/80">
                    {totalNotifications}
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

                              {totalJoinRequests > 0 && (
                                <button
                                  onClick={() => {
                                    const spaceWithReq = spaces.find(s => s.createdBy === currentUser?.id && (s.joinRequests?.length || 0) > 0)
                                    if (spaceWithReq) {
                                      setViewingSpaceId(spaceWithReq.id)
                                      setModal('members')
                                    }
                                    setShowProfileMenu(false)
                                  }}
                                  className="w-full text-left px-4 py-3 mx-1 my-0.5 rounded-xl hover:bg-gold/8 transition-all flex items-center gap-3 group"
                                >
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center flex-shrink-0">
                                    <UserPlus className="w-4 h-4 text-amber-600/80" />
                                  </div>
                                  <span className="font-sans text-sm text-warmDark/75 group-hover:text-warmDark flex-1">Join requests</span>
                                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                                    {totalJoinRequests}
                                  </span>
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setModal('join')
                                  setShowProfileMenu(false)
                                }}
                                className="w-full text-left px-4 py-3 mx-1 my-0.5 rounded-xl hover:bg-gold/8 transition-all flex items-center gap-3 group"
                              >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal/20 to-emerald-100 flex items-center justify-center flex-shrink-0">
                                  <Users className="w-4 h-4 text-teal/80" />
                                </div>
                                <span className="font-sans text-sm text-warmDark/75 group-hover:text-warmDark">Join a group</span>
                              </button>

                              {allSpaces.length > 0 && (
                                <button
                                  onClick={() => {
                                    setModal('manage-spaces')
                                    setShowProfileMenu(false)
                                  }}
                                  className="w-full text-left px-4 py-3 mx-1 my-0.5 rounded-xl hover:bg-gold/8 transition-all flex items-center gap-3 group"
                                >
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/20 to-amber-100 flex items-center justify-center flex-shrink-0">
                                    <Pencil className="w-4 h-4 text-gold/80" />
                                  </div>
                                  <span className="font-sans text-sm text-warmDark/75 group-hover:text-warmDark">Manage spaces</span>
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setEditName(currentUser?.name || '')
                                  setEditNameError('')
                                  setEditNameSuccess(false)
                                  setOldPassword(''); setNewPassword(''); setConfirmPassword(''); setPwError(''); setPwSuccess(false)
                                  setNewSecretCode(''); setConfirmSecretCode(''); setCurrentSecretCodeInput(''); setSecretCodeError(''); setSecretCodeSuccess(false)
                                  setProfileTab('name')
                                  setModal('profile')
                                  setShowProfileMenu(false)
                                }}
                                className="w-full text-left px-4 py-3 mx-1 my-0.5 rounded-xl hover:bg-gold/8 transition-all flex items-center gap-3 group"
                              >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-100 to-sky-100 flex items-center justify-center flex-shrink-0">
                                  <User className="w-4 h-4 text-cyan-600/80" />
                                </div>
                                <span className="font-sans text-sm text-warmDark/75 group-hover:text-warmDark">Profile</span>
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
          className="text-center mb-8 mt-0"
        >
          {currentUser && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="font-handwriting text-2xl md:text-3xl text-warmDark/70 mb-4">
              Hello, {currentUser.name}
            </motion.p>
          )}

          <h1 className="font-serif text-3xl md:text-5xl text-warmDark mb-4">
            {allSpaces.length === 0 ? 'Your story starts here' : pageHeading}
          </h1>
          <p className="font-handwriting text-xl md:text-2xl text-warmDark/70">
            {allSpaces.length === 0 ? 'Create a space to begin' : pageSubheading}
          </p>
        </motion.div>

        {/* Empty state */}
        {allSpaces.length === 0 && (
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
        <div ref={spacesContainerRef} className="flex flex-wrap justify-center gap-8 md:gap-10 max-w-5xl mb-4">
          {visibleSpaces.map((space, i) => {
            const isOwner = space.createdBy === currentUser?.id
            const myRole = space.membersList.find((m) => m.userId === currentUser?.id)?.role
            const isHidden = hiddenSpaceIds.has(space.id)
            const isChecked = selectedToHide.has(space.id)
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
                    whileHover={editPageMode || hideSelectMode ? {} : { scale: 1.08, y: -8 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (hideSelectMode) {
                        setSelectedToHide((prev) => {
                          const next = new Set(prev)
                          if (next.has(space.id)) next.delete(space.id)
                          else next.add(space.id)
                          return next
                        })
                      } else if (!editPageMode) {
                        setActiveSpace(space.id)
                      }
                    }}
                    className={`group flex flex-col items-center relative ${editPageMode || hideSelectMode ? 'cursor-pointer' : ''}`}
                    animate={editPageMode ? { rotate: [0, -2, 2, -1, 1, 0] } : { rotate: 0 }}
                    transition={editPageMode ? { repeat: Infinity, duration: 0.6, repeatDelay: 0.1 } : {}}
                  >
                    <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full shadow-lg transition-all duration-300
                      border border-white/50 relative overflow-hidden ${!editPageMode && !hideSelectMode ? 'group-hover:shadow-2xl' : ''}
                      ${isHidden && vaultOpen ? 'opacity-70' : ''}
                      ${space.coverImage ? '' : `bg-gradient-to-br ${space.coverColor ? getColorClasses(space.coverColor) : defaultSpaceColors[i % defaultSpaceColors.length]} flex items-center justify-center`}`}>
                      {space.coverImage ? (
                        <div className="w-full h-full" style={{
                          backgroundImage: `url(${space.coverImage})`,
                          backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: `${space.coverImageOffsetX ?? 50}% ${space.coverImageOffsetY ?? 50}%`,
                          transform: `scale(${space.coverImageScale ?? 1})`,
                          transformOrigin: `${space.coverImageOffsetX ?? 50}% ${space.coverImageOffsetY ?? 50}%`,
                        }} />
                      ) : (
                        <>
                          <div className={`absolute inset-0 bg-white/20 transition-opacity duration-500 ${!editPageMode ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`} />
                          {space.coverIcon ? (
                            <SpaceIconRenderer iconId={space.coverIcon} size="lg" />
                          ) : (
                            <span className="text-4xl md:text-5xl relative z-10">{space.coverEmoji}</span>
                          )}
                        </>
                      )}
                      {/* Hide select mode: dim overlay + check */}
                      {hideSelectMode && (
                        <div className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-200 ${isChecked ? 'bg-warmDark/50' : 'bg-warmDark/10'}`}>
                          <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-white border-white' : 'border-white/70'}`}>
                            {isChecked && <Check className="w-5 h-5 text-warmDark" />}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.button>

                  {/* Lock badge — shown when vault is open and space is hidden */}
                  {!hideSelectMode && vaultOpen && isHidden && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-gold/80 to-coral/70 shadow-md flex items-center justify-center ring-2 ring-white/80 z-10"
                    >
                      <Lock className="w-3.5 h-3.5 text-white" />
                    </motion.div>
                  )}

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
                  <h3 className={`font-serif text-base md:text-lg font-medium ${isHidden && vaultOpen ? 'text-warmDark/50' : 'text-warmDark'}`}>{space.title}</h3>
                  {(() => {
                    const visibleCount = space.memories?.length
                      ? space.memories.filter((m) => {
                          if (!m.visibleTo || m.visibleTo.length === 0) return true
                          if (m.createdBy === currentUser?.id) return true
                          return currentUser ? m.visibleTo.includes(currentUser.id) : false
                        }).length
                      : space.memoryCount
                    return (
                      <p className={`font-handwriting text-base ${isHidden && vaultOpen ? 'text-warmDark/40' : 'text-warmDark/70'}`}>
                        {visibleCount} {visibleCount === 1 ? 'memory' : 'memories'}
                      </p>
                    )
                  })()}
                  {!hideSelectMode && space.type === 'group' && (
                    <button
                      onClick={() => { if (!editPageMode) { setViewingSpaceId(space.id); setMembersTab('members'); setModal('members') } }}
                      className="flex items-center gap-1 mx-auto mt-1 text-sm text-warmDark/75 hover:text-warmDark/80 transition-colors"
                    >
                      <Users className="w-3 h-3" />
                      <span>{space.membersList.filter((m) => m.status === 'active').length} members</span>
                      {isOwner && <Crown className="w-3 h-3 text-gold/60" />}
                    </button>
                  )}
                  {!hideSelectMode && space.type === 'group' && myRole && myRole !== 'owner' && (
                    <p className="text-sm text-warmDark/70 mt-0.5">{myRole === 'admin' ? 'Admin' : 'Member'}</p>
                  )}
                </div>
              </motion.div>
            )
          })}


        </div>

        {/* Hide-select mode: floating Done / Cancel bar */}
        <AnimatePresence>
          {hideSelectMode && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 rounded-full bg-white/90 backdrop-blur-xl shadow-2xl border border-white/60"
            >
              <button
                onClick={() => {
                  setHideSelectMode(false)
                  setSelectedToHide(new Set())
                }}
                className="px-4 py-2 rounded-full text-warmDark/70 hover:text-warmDark font-sans text-sm transition-colors"
              >
                Cancel
              </button>
              <div className="w-px h-5 bg-warmDark/15" />
              <span className="font-sans text-sm text-warmDark/60 px-1">
                {selectedToHide.size} selected
              </span>
              <div className="w-px h-5 bg-warmDark/15" />
              <button
                onClick={handleDoneHiding}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 text-white font-sans text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating "New Space" button — bottom right corner (only when spaces exist) */}
        {allSpaces.length > 0 && !hideSelectMode && <motion.button
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
              data-modal="main"
              className={`glass rounded-3xl p-8 w-full relative z-10 max-h-[85vh] overflow-y-auto ${modal === 'members' || modal === 'join' ? 'max-w-sm' : 'max-w-lg'}`}
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

                    {/* Cover preview — image or icon */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative group/cover">
                        <div className={`w-28 h-28 rounded-full border border-white/50 shadow-lg overflow-hidden flex items-center justify-center
                          ${newCoverImage ? '' : `bg-gradient-to-br ${getColorClasses(newColor)}`}`}>
                          {newCoverImage ? (
                            <div className="w-full h-full" style={{
                              backgroundImage: `url(${newCoverImage})`,
                              backgroundSize: 'cover',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: `${newCoverImagePosX}% ${newCoverImagePosY}%`,
                              transform: `scale(${newCoverImageScale})`,
                              transformOrigin: `${newCoverImagePosX}% ${newCoverImagePosY}%`,
                            }} />
                          ) : (
                            <SpaceIconRenderer iconId={makeIconId(newIcon, newIconVariation)} size="full" />
                          )}
                        </div>
                        {/* Upload overlay (hover only, pointer-events disabled so badge stays clickable) */}
                        <label className="absolute inset-0 rounded-full flex items-center justify-center bg-warmDark/30 opacity-0 group-hover/cover:opacity-100 pointer-events-none transition-opacity">
                          {coverImageUploading ? (
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                          ) : (
                            <ImagePlus className="w-6 h-6 text-white" />
                          )}
                        </label>
                        {/* Always-visible upload badge (for touch devices) */}
                        {!newCoverImage && (
                          <label className="absolute bottom-1 right-1 z-10 w-8 h-8 rounded-full bg-warmDark/70 text-white flex items-center justify-center cursor-pointer hover:bg-warmDark transition-colors shadow-md">
                            {coverImageUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              setCropSrc(URL.createObjectURL(file))
                              setCropTarget('create')
                              setCropIsReadjust(false)
                              setCropPendingFile(file)
                              setCropInitialPosX(50)
                              setCropInitialPosY(50)
                              setCropInitialScale(1)
                              e.target.value = ''
                            }} />
                          </label>
                        )}
                        {newCoverImage && (
                          <>
                            <button
                              type="button"
                              onClick={() => setNewCoverImage('')}
                              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-warmDark/70 text-white flex items-center justify-center hover:bg-warmDark transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => { setCropSrc(newCoverImage); setCropTarget('create'); setCropIsReadjust(true); setCropInitialPosX(newCoverImagePosX); setCropInitialPosY(newCoverImagePosY); setCropInitialScale(newCoverImageScale) }}
                              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gold/80 text-white flex items-center justify-center hover:bg-gold transition-colors text-xs font-bold"
                              title="Adjust crop"
                            >
                              ⌖
                            </button>
                          </>
                        )}
                      </div>
                      <p className="text-xs font-sans text-warmDark/50">Tap the camera to upload a photo</p>
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

              {/* CREATE — Step 3: Share invite code (group only) */}
              {modal === 'create' && createStep === 'invite' && (
                <>
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/30 to-coral/30 flex items-center justify-center mb-3">
                      <Check className="w-7 h-7 text-gold/80" />
                    </div>
                    <h2 className="font-serif text-2xl text-warmDark">Group space created!</h2>
                    <p className="font-sans text-sm text-warmDark/55 mt-1 text-center">Share this invite code with your friends</p>
                  </div>

                  {/* Invite code display */}
                  {createdInviteCode ? (
                    <div className="flex flex-col items-center gap-4 mb-6">
                      <div className="bg-white/60 border border-warmMid/20 rounded-2xl px-6 py-4 flex items-center gap-3">
                        <span className="font-mono text-2xl tracking-[0.3em] text-warmDark font-bold select-all">{createdInviteCode}</span>
                        <button
                          onClick={() => copyInviteCode(createdInviteCode)}
                          className="p-2 rounded-xl hover:bg-warmMid/10 transition-colors text-warmDark/50 hover:text-warmDark"
                          title="Copy code"
                        >
                          {codeCopied ? <Check className="w-5 h-5 text-teal" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                      {codeCopied && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-teal font-sans">
                          Copied to clipboard!
                        </motion.p>
                      )}
                      <p className="font-sans text-sm text-warmDark/50 text-center leading-relaxed">
                        Friends can use this code to request to join.<br />You'll be able to approve or decline requests.
                      </p>
                    </div>
                  ) : (
                    <p className="text-center text-warmDark/50 font-sans text-sm mb-6">Loading invite code...</p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => { setModal('none'); setCreateStep('type'); if (createdSpaceId) setActiveSpace(createdSpaceId) }}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold/80 to-coral/80 text-white font-medium transition-all hover:shadow-md"
                    >
                      Open Space
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

                    {/* Cover preview — image or icon */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative group/cover">
                        <div className={`w-28 h-28 rounded-full border border-white/50 shadow-lg overflow-hidden flex items-center justify-center
                          ${editCoverImage ? '' : `bg-gradient-to-br ${getColorClasses(editColor)}`}`}>
                          {editCoverImage ? (
                            <div className="w-full h-full" style={{
                              backgroundImage: `url(${editCoverImage})`,
                              backgroundSize: 'cover',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: `${editCoverImagePosX}% ${editCoverImagePosY}%`,
                              transform: `scale(${editCoverImageScale})`,
                              transformOrigin: `${editCoverImagePosX}% ${editCoverImagePosY}%`,
                            }} />
                          ) : (
                            <SpaceIconRenderer iconId={makeIconId(editIcon, editIconVariation)} size="full" />
                          )}
                        </div>
                        <label className="absolute inset-0 rounded-full flex items-center justify-center bg-warmDark/30 opacity-0 group-hover/cover:opacity-100 pointer-events-none transition-opacity">
                          {editCoverImageUploading ? (
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                          ) : (
                            <ImagePlus className="w-6 h-6 text-white" />
                          )}
                        </label>
                        {/* Always-visible upload badge (for touch devices) */}
                        {!editCoverImage && (
                          <label className="absolute bottom-1 right-1 z-10 w-8 h-8 rounded-full bg-warmDark/70 text-white flex items-center justify-center cursor-pointer hover:bg-warmDark transition-colors shadow-md">
                            {editCoverImageUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              setCropSrc(URL.createObjectURL(file))
                              setCropTarget('edit')
                              setCropIsReadjust(false)
                              setCropPendingFile(file)
                              setCropInitialPosX(50)
                              setCropInitialPosY(50)
                              setCropInitialScale(1)
                              e.target.value = ''
                            }} />
                          </label>
                        )}
                        {editCoverImage && (
                          <>
                            <button
                              type="button"
                              onClick={() => setEditCoverImage('')}
                              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-warmDark/70 text-white flex items-center justify-center hover:bg-warmDark transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => { setCropSrc(editCoverImage); setCropTarget('edit'); setCropIsReadjust(true); setCropInitialPosX(editCoverImagePosX); setCropInitialPosY(editCoverImagePosY); setCropInitialScale(editCoverImageScale) }}
                              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gold/80 text-white flex items-center justify-center hover:bg-gold transition-colors text-xs font-bold"
                              title="Adjust crop"
                            >
                              ⌖
                            </button>
                          </>
                        )}
                      </div>
                      <p className="text-xs font-sans text-warmDark/50">Tap the camera to change photo</p>
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

              {/* MANAGE SPACES */}
              {modal === 'manage-spaces' && (
                <>
                  <h2 className="font-serif text-2xl text-warmDark mb-2">Manage spaces</h2>
                  <p className="font-handwriting text-lg text-warmDark/60 mb-6">What would you like to do?</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setEditPageMode(true)
                        setDeleteConfirmId(null)
                        closeModal()
                      }}
                      className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/80 border border-amber-200/40 hover:border-amber-300/60 hover:shadow-lg hover:scale-[1.02] transition-all"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/30 to-amber-200/70 flex items-center justify-center shadow-sm">
                        <Pencil className="w-7 h-7 text-amber-600/80" />
                      </div>
                      <div className="text-center">
                        <p className="font-serif text-base text-warmDark font-medium">Edit spaces</p>
                        <p className="font-sans text-xs text-warmDark/55 mt-1 leading-snug">Rename, restyle or delete</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedToHide(new Set(hiddenSpaceIds))
                        setHideSelectMode(true)
                        closeModal()
                      }}
                      className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-slate-50/80 to-gray-100/80 border border-slate-200/40 hover:border-slate-300/60 hover:shadow-lg hover:scale-[1.02] transition-all"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-200/70 to-gray-300/70 flex items-center justify-center shadow-sm">
                        <EyeOff className="w-7 h-7 text-slate-500/80" />
                      </div>
                      <div className="text-center">
                        <p className="font-serif text-base text-warmDark font-medium">Hide spaces</p>
                        <p className="font-sans text-xs text-warmDark/55 mt-1 leading-snug">Move to secret vault</p>
                      </div>
                    </button>
                  </div>
                  <button onClick={closeModal} className="w-full mt-4 py-3 rounded-xl text-warmDark/70 hover:bg-white/30 transition-all font-sans text-sm">Cancel</button>
                </>
              )}

              {/* PROFILE (tabbed: name / password / secrecy code) */}
              {modal === 'profile' && (
                <>
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold/40 to-coral/40 flex items-center justify-center flex-shrink-0 ring-2 ring-white/60">
                      <span className="font-serif text-base text-white font-semibold">{currentUser?.name?.[0]?.toUpperCase() || 'U'}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-serif text-lg text-warmDark font-medium truncate">{currentUser?.name || 'User'}</p>
                      <p className="font-sans text-xs text-warmDark/50 truncate">{currentUser?.email}</p>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-1 mb-5 bg-warmMid/8 rounded-xl p-1">
                    {([
                      { key: 'name', label: 'Name' },
                      { key: 'password', label: 'Password' },
                      { key: 'code', label: 'Secret code' },
                    ] as const).map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => {
                          setProfileTab(tab.key)
                          setEditNameError(''); setEditNameSuccess(false)
                          setPwError(''); setPwSuccess(false)
                          setSecretCodeError(''); setSecretCodeSuccess(false)
                        }}
                        className={`flex-1 py-2 rounded-lg text-xs font-sans transition-all ${profileTab === tab.key ? 'bg-white shadow-sm text-warmDark font-medium' : 'text-warmDark/60 hover:text-warmDark/80'}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab: Edit name */}
                  {profileTab === 'name' && (
                    <div className="space-y-4">
                      <div>
                        <label className="font-handwriting text-warmDark/70 text-base block mb-2">Your name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => { setEditName(e.target.value); setEditNameError(''); setEditNameSuccess(false) }}
                          onKeyDown={(e) => e.key === 'Enter' && !editNameLoading && (async () => {
                            if (!editName.trim() || editName.trim().length < 2) { setEditNameError('Name must be at least 2 characters'); return }
                            setEditNameLoading(true); setEditNameError('')
                            try {
                              const result = await api.updateProfile({ name: editName.trim() })
                              useStore.getState().setCurrentUser(result.user)
                              setEditNameSuccess(true)
                            } catch (err: any) { setEditNameError(err.message || 'Failed to update name') }
                            finally { setEditNameLoading(false) }
                          })()}
                          placeholder="Your name"
                          autoFocus
                          className="w-full bg-white/50 rounded-xl px-4 py-3 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                        />
                      </div>
                      {editNameError && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-coral font-sans bg-coral/10 rounded-xl px-4 py-2">
                          {editNameError}
                        </motion.p>
                      )}
                      {editNameSuccess && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-teal font-sans bg-teal/10 rounded-xl px-4 py-2 flex items-center gap-2">
                          <Check className="w-4 h-4" /> Name updated!
                        </motion.p>
                      )}
                      <div className="flex gap-3 pt-1">
                        <button onClick={closeModal} className="flex-1 py-3 rounded-xl text-warmDark/70 hover:bg-white/30 transition-all font-sans text-sm">Cancel</button>
                        <button
                          onClick={async () => {
                            if (!editName.trim() || editName.trim().length < 2) { setEditNameError('Name must be at least 2 characters'); return }
                            setEditNameLoading(true); setEditNameError('')
                            try {
                              const result = await api.updateProfile({ name: editName.trim() })
                              useStore.getState().setCurrentUser(result.user)
                              setEditNameSuccess(true)
                            } catch (err: any) { setEditNameError(err.message || 'Failed to update name') }
                            finally { setEditNameLoading(false) }
                          }}
                          disabled={editNameLoading || editNameSuccess}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold/80 to-coral/80 text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2 font-sans text-sm"
                        >
                          {editNameLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tab: Change password */}
                  {profileTab === 'password' && (
                    <div className="space-y-4">
                      <div>
                        <label className="font-handwriting text-warmDark/70 text-base block mb-2">Current password</label>
                        <div className="relative">
                          <input type={showOld ? 'text' : 'password'} value={oldPassword}
                            onChange={(e) => { setOldPassword(e.target.value); setPwError('') }}
                            placeholder="Enter current password" autoFocus
                            className="w-full bg-white/50 rounded-xl px-4 py-3 pr-11 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all" />
                          <button type="button" onClick={() => setShowOld((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-warmDark/70 hover:text-warmDark/70 transition-colors">
                            {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="font-handwriting text-warmDark/70 text-base block mb-2">New password</label>
                        <div className="relative">
                          <input type={showNew ? 'text' : 'password'} value={newPassword}
                            onChange={(e) => { setNewPassword(e.target.value); setPwError('') }}
                            placeholder="8+ chars, A-Z, 0-9, symbol"
                            className="w-full bg-white/50 rounded-xl px-4 py-3 pr-11 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all" />
                          <button type="button" onClick={() => setShowNew((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-warmDark/70 hover:text-warmDark/70 transition-colors">
                            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="font-handwriting text-warmDark/70 text-base block mb-2">Confirm new password</label>
                        <input type="password" value={confirmPassword}
                          onChange={(e) => { setConfirmPassword(e.target.value); setPwError('') }}
                          onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()}
                          placeholder="Repeat new password"
                          className="w-full bg-white/50 rounded-xl px-4 py-3 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all" />
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
                          <Check className="w-4 h-4" /> Password changed!
                        </motion.p>
                      )}
                      <div className="flex gap-3 pt-1">
                        <button onClick={closeModal} className="flex-1 py-3 rounded-xl text-warmDark/70 hover:bg-white/30 transition-all font-sans text-sm">Cancel</button>
                        <button onClick={handleChangePassword} disabled={pwLoading || pwSuccess}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold/80 to-coral/80 text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2 font-sans text-sm">
                          {pwLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Update'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Secret Vault entry — only shown when a code is set or hidden spaces exist */}
                  {(hasVaultCode || hiddenSpaceIds.size > 0) && profileTab !== 'code' && (
                    <div className="mt-5 pt-4 border-t border-warmMid/10">
                      <button
                        onClick={() => {
                          if (vaultOpen) {
                            setVaultOpen(false)
                            closeModal()
                          } else if (hasVaultCode) {
                            setVaultPinInput('')
                            setVaultPinError('')
                            setModal('unlock-vault')
                          } else {
                            setProfileTab('code')
                          }
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/30 transition-all group"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${vaultOpen ? 'bg-gradient-to-br from-gold/20 to-amber-100' : 'bg-gradient-to-br from-warmMid/10 to-warmMid/20'}`}>
                          {vaultOpen
                            ? <Unlock className="w-4 h-4 text-gold/80" />
                            : <Lock className="w-4 h-4 text-warmDark/50" />
                          }
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-sans text-sm text-warmDark/75 group-hover:text-warmDark">
                            {vaultOpen ? 'Lock vault' : 'Open secret vault'}
                          </p>
                          {hiddenSpaceIds.size > 0 && (
                            <p className="font-sans text-xs text-warmDark/40">
                              {hiddenSpaceIds.size} hidden {hiddenSpaceIds.size === 1 ? 'space' : 'spaces'}
                            </p>
                          )}
                        </div>
                        {vaultOpen && <span className="w-2 h-2 rounded-full bg-gold/70 flex-shrink-0" />}
                      </button>
                    </div>
                  )}

                  {/* Tab: Secrecy code */}
                  {profileTab === 'code' && (
                    <div className="space-y-4">
                      <p className="font-handwriting text-warmDark/60 text-center text-lg">
                        {hasVaultCode ? 'Change the code that protects your hidden spaces' : 'Set a 4-digit code to lock your secret vault'}
                      </p>
                      {hasVaultCode && (
                        <div>
                          <label className="font-handwriting text-warmDark/70 text-base block mb-2 text-center">Current code</label>
                          <div className="flex gap-3 justify-center">
                            {[0, 1, 2, 3].map((idx) => (
                              <input key={idx} id={`pc-cur-${idx}`} type="password" inputMode="numeric" maxLength={1}
                                value={currentSecretCodeInput[idx] || ''} autoFocus={idx === 0}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/, ''); if (!val) return
                                  const arr = (currentSecretCodeInput + '    ').split('').slice(0, 4); arr[idx] = val
                                  setCurrentSecretCodeInput(arr.join('').trimEnd()); setSecretCodeError('')
                                  if (idx < 3) document.getElementById(`pc-cur-${idx + 1}`)?.focus()
                                }}
                                onKeyDown={(e) => { if (e.key === 'Backspace') { e.preventDefault(); const arr = (currentSecretCodeInput + '    ').split('').slice(0, 4); if (arr[idx]?.trim()) { arr[idx] = ' '; setCurrentSecretCodeInput(arr.join('').trimEnd()) } else if (idx > 0) { arr[idx - 1] = ' '; setCurrentSecretCodeInput(arr.join('').trimEnd()); document.getElementById(`pc-cur-${idx - 1}`)?.focus() } } }}
                                className="w-12 h-12 rounded-xl bg-white/60 border-2 border-warmMid/20 text-center text-lg font-bold text-warmDark outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="font-handwriting text-warmDark/70 text-base block mb-2 text-center">{hasVaultCode ? 'New code' : 'Your code'}</label>
                        <div className="flex gap-3 justify-center">
                          {[0, 1, 2, 3].map((idx) => (
                            <input key={idx} id={`pc-new-${idx}`} type="password" inputMode="numeric" maxLength={1}
                              value={newSecretCode[idx] || ''} autoFocus={!hasVaultCode && idx === 0}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/, ''); if (!val) return
                                const arr = (newSecretCode + '    ').split('').slice(0, 4); arr[idx] = val
                                setNewSecretCode(arr.join('').trimEnd()); setSecretCodeError('')
                                if (idx < 3) document.getElementById(`pc-new-${idx + 1}`)?.focus()
                                else document.getElementById('pc-conf-0')?.focus()
                              }}
                              onKeyDown={(e) => { if (e.key === 'Backspace') { e.preventDefault(); const arr = (newSecretCode + '    ').split('').slice(0, 4); if (arr[idx]?.trim()) { arr[idx] = ' '; setNewSecretCode(arr.join('').trimEnd()) } else if (idx > 0) { arr[idx - 1] = ' '; setNewSecretCode(arr.join('').trimEnd()); document.getElementById(`pc-new-${idx - 1}`)?.focus() } } }}
                              className="w-12 h-12 rounded-xl bg-white/60 border-2 border-warmMid/20 text-center text-lg font-bold text-warmDark outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all"
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="font-handwriting text-warmDark/70 text-base block mb-2 text-center">Confirm code</label>
                        <div className="flex gap-3 justify-center">
                          {[0, 1, 2, 3].map((idx) => (
                            <input key={idx} id={`pc-conf-${idx}`} type="password" inputMode="numeric" maxLength={1}
                              value={confirmSecretCode[idx] || ''}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/, ''); if (!val) return
                                const arr = (confirmSecretCode + '    ').split('').slice(0, 4); arr[idx] = val
                                setConfirmSecretCode(arr.join('').trimEnd()); setSecretCodeError('')
                                if (idx < 3) document.getElementById(`pc-conf-${idx + 1}`)?.focus()
                              }}
                              onKeyDown={(e) => { if (e.key === 'Backspace') { e.preventDefault(); const arr = (confirmSecretCode + '    ').split('').slice(0, 4); if (arr[idx]?.trim()) { arr[idx] = ' '; setConfirmSecretCode(arr.join('').trimEnd()) } else if (idx > 0) { arr[idx - 1] = ' '; setConfirmSecretCode(arr.join('').trimEnd()); document.getElementById(`pc-conf-${idx - 1}`)?.focus() } } }}
                              className="w-12 h-12 rounded-xl bg-white/60 border-2 border-warmMid/20 text-center text-lg font-bold text-warmDark outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all"
                            />
                          ))}
                        </div>
                      </div>
                      {secretCodeError && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-coral font-sans bg-coral/10 rounded-xl px-4 py-2 text-center">
                          {secretCodeError}
                        </motion.p>
                      )}
                      {secretCodeSuccess && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-teal font-sans bg-teal/10 rounded-xl px-4 py-2 flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" /> Code saved!
                        </motion.p>
                      )}
                      <div className="flex gap-3 pt-1">
                        <button onClick={closeModal} className="flex-1 py-3 rounded-xl text-warmDark/70 hover:bg-white/30 transition-all font-sans text-sm">Cancel</button>
                        <button
                          onClick={async () => {
                            const cleanNew = newSecretCode.replace(/\s/g, '')
                            const cleanConfirm = confirmSecretCode.replace(/\s/g, '')
                            if (cleanNew.length !== 4) { setSecretCodeError('Must be exactly 4 digits'); return }
                            if (cleanNew !== cleanConfirm) { setSecretCodeError('Codes do not match'); return }
                            try {
                              if (hasVaultCode) {
                                const cleanCurrent = currentSecretCodeInput.replace(/\s/g, '')
                                if (cleanCurrent.length !== 4) { setSecretCodeError('Enter your current 4-digit code'); return }
                                await storeChangeVaultCode(cleanCurrent, cleanNew)
                              } else {
                                await storeSetVaultCode(cleanNew)
                              }
                              // If pending hide, complete it now
                              if (pendingHideAfterCode) {
                                await storeUpdateHiddenSpaces(Array.from(selectedToHide))
                                setSelectedToHide(new Set())
                                setHideSelectMode(false)
                                setPendingHideAfterCode(false)
                              }
                              setSecretCodeSuccess(true)
                              setTimeout(() => closeModal(), 1200)
                            } catch (err: any) {
                              setSecretCodeError(err.message || 'Failed to save code')
                            }
                          }}
                          disabled={secretCodeSuccess}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold/80 to-coral/80 text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2 font-sans text-sm"
                        >
                          Save code
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* EDIT PROFILE (name) */}
              {modal === 'edit-profile' && (
                <>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-100 to-sky-100 flex items-center justify-center mx-auto mb-4">
                    <User className="w-6 h-6 text-cyan-600/80" />
                  </div>
                  <h2 className="font-serif text-2xl text-warmDark mb-2">Edit name</h2>
                  <p className="font-handwriting text-lg text-warmDark/75 mb-6">How should we call you?</p>
                  <div className="space-y-4">
                    <div>
                      <label className="font-handwriting text-warmDark/70 text-base block mb-2">Your name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => { setEditName(e.target.value); setEditNameError(''); setEditNameSuccess(false) }}
                        onKeyDown={(e) => e.key === 'Enter' && !editNameLoading && (async () => {
                          if (!editName.trim() || editName.trim().length < 2) { setEditNameError('Name must be at least 2 characters'); return }
                          setEditNameLoading(true); setEditNameError('')
                          try {
                            const result = await api.updateProfile({ name: editName.trim() })
                            useStore.getState().setCurrentUser(result.user)
                            setEditNameSuccess(true)
                          } catch (err: any) { setEditNameError(err.message || 'Failed to update name') }
                          finally { setEditNameLoading(false) }
                        })()}
                        placeholder="Your name"
                        autoFocus
                        className="w-full bg-white/50 rounded-xl px-4 py-3 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                      />
                    </div>
                    <p className="font-sans text-xs text-warmDark/40">Email: {currentUser?.email}</p>

                    {editNameError && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-coral font-sans bg-coral/10 rounded-xl px-4 py-2">
                        {editNameError}
                      </motion.p>
                    )}
                    {editNameSuccess && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-teal font-sans bg-teal/10 rounded-xl px-4 py-2 flex items-center gap-2">
                        <Check className="w-4 h-4" /> Name updated!
                      </motion.p>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button onClick={closeModal} className="flex-1 py-3 rounded-xl text-warmDark/70 hover:bg-white/30 transition-all">Cancel</button>
                      <button
                        onClick={async () => {
                          if (!editName.trim() || editName.trim().length < 2) { setEditNameError('Name must be at least 2 characters'); return }
                          setEditNameLoading(true); setEditNameError('')
                          try {
                            const result = await api.updateProfile({ name: editName.trim() })
                            useStore.getState().setCurrentUser(result.user)
                            setEditNameSuccess(true)
                          } catch (err: any) { setEditNameError(err.message || 'Failed to update name') }
                          finally { setEditNameLoading(false) }
                        }}
                        disabled={editNameLoading || editNameSuccess}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold/80 to-coral/80 text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {editNameLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save'}
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
                    <div className="mb-4">
                      <h2 className="font-serif text-2xl text-warmDark flex items-center gap-2">
                        {viewingSpace.coverIcon ? <SpaceIconRenderer iconId={viewingSpace.coverIcon} size="sm" /> : <span>{viewingSpace.coverEmoji}</span>} {viewingSpace.title}
                      </h2>
                      <p className="font-handwriting text-warmDark/75 mt-1">
                        {activeMembers.length} members
                      </p>
                    </div>

                    {/* Tabs */}
                    {canManage && viewingSpace.type === 'group' && (
                      <div className="flex gap-1 mb-4 bg-warmMid/8 rounded-xl p-1">
                        <button
                          onClick={() => setMembersTab('members')}
                          className={`flex-1 py-2 rounded-lg text-sm font-sans transition-all ${membersTab === 'members' ? 'bg-white shadow-sm text-warmDark font-medium' : 'text-warmDark/60 hover:text-warmDark/80'}`}
                        >
                          Members
                        </button>
                        <button
                          onClick={() => setMembersTab('requests')}
                          className={`flex-1 py-2 rounded-lg text-sm font-sans transition-all flex items-center justify-center gap-1.5 ${membersTab === 'requests' ? 'bg-white shadow-sm text-warmDark font-medium' : 'text-warmDark/60 hover:text-warmDark/80'}`}
                        >
                          Requests
                          {viewingSpace.joinRequests && viewingSpace.joinRequests.length > 0 && (
                            <span className="w-5 h-5 rounded-full bg-amber-400 text-white text-xs flex items-center justify-center font-medium">
                              {viewingSpace.joinRequests.length}
                            </span>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Members tab content */}
                    {membersTab === 'members' && (
                      <>
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

                        {/* Invite Code — visible to all members */}
                        {viewingSpace.inviteCode && (
                          <div className="mt-5 pt-4 border-t border-warmMid/10">
                            <p className="font-sans text-xs text-warmDark/50 mb-2">Invite code</p>
                            <div className="flex items-center gap-2 bg-white/40 rounded-xl px-4 py-2.5">
                              <span className="font-mono text-base tracking-[0.2em] text-warmDark font-semibold flex-1 select-all">{viewingSpace.inviteCode}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(viewingSpace.inviteCode || '')
                                  setCodeCopied(true)
                                  setTimeout(() => setCodeCopied(false), 2000)
                                }}
                                className="p-1.5 rounded-lg hover:bg-warmMid/10 transition-colors text-warmDark/50 hover:text-warmDark"
                                title="Copy code"
                              >
                                {codeCopied ? <Check className="w-4 h-4 text-teal" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                            <p className="font-sans text-[11px] text-warmDark/40 mt-1.5">Share this code so others can request to join</p>
                          </div>
                        )}
                      </>
                    )}

                    {/* Requests tab content */}
                    {membersTab === 'requests' && (
                      <div className="min-h-[120px]">
                        {viewingSpace.joinRequests && viewingSpace.joinRequests.length > 0 ? (
                          <div className="space-y-2">
                            {viewingSpace.joinRequests.map((req) => (
                              <div key={req.userId} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50/50 border border-amber-200/30">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200/60 to-orange-200/60 flex items-center justify-center text-sm font-serif text-warmDark flex-shrink-0">
                                  {req.userName[0]}
                                </div>
                                <span className="font-sans text-sm text-warmDark/80 flex-1 truncate">{req.userName}</span>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <button
                                    onClick={async () => {
                                      try {
                                        await api.approveJoin(viewingSpace.id, req.userId)
                                        await useStore.getState().fetchSpaces()
                                      } catch {}
                                    }}
                                    className="w-7 h-7 rounded-full bg-teal/15 hover:bg-teal/30 flex items-center justify-center transition-colors"
                                    title="Approve"
                                  >
                                    <Check className="w-3.5 h-3.5 text-teal" />
                                  </button>
                                  <button
                                    onClick={async () => {
                                      try {
                                        await api.rejectJoin(viewingSpace.id, req.userId)
                                        await useStore.getState().fetchSpaces()
                                      } catch {}
                                    }}
                                    className="w-7 h-7 rounded-full bg-coral/15 hover:bg-coral/30 flex items-center justify-center transition-colors"
                                    title="Reject"
                                  >
                                    <X className="w-3.5 h-3.5 text-coral" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 text-warmDark/40">
                            <Users className="w-8 h-8 mb-2 opacity-40" />
                            <p className="font-sans text-sm">No pending requests</p>
                          </div>
                        )}
                      </div>
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

              {/* JOIN GROUP */}
              {modal === 'join' && (
                <>
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal/20 to-emerald-100 flex items-center justify-center mb-3">
                      <Users className="w-7 h-7 text-teal/80" />
                    </div>
                    <h2 className="font-serif text-2xl text-warmDark">Join a group</h2>
                    <p className="font-sans text-sm text-warmDark/55 mt-1 text-center">Enter the invite code shared by the group owner</p>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={joinCode}
                      onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); setJoinError(''); setJoinSuccess('') }}
                      onKeyDown={(e) => e.key === 'Enter' && handleJoinByCode()}
                      placeholder="Enter 8-character code"
                      maxLength={8}
                      autoFocus
                      className="w-full bg-white/50 rounded-xl px-4 py-3 text-warmDark font-mono text-center text-xl tracking-[0.2em] outline-none focus:ring-2 focus:ring-gold/30 transition-all uppercase placeholder:text-warmDark/30 placeholder:tracking-normal placeholder:font-sans placeholder:text-base"
                    />

                    {joinError && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-coral font-sans bg-coral/10 rounded-xl px-4 py-2 text-center">
                        {joinError}
                      </motion.p>
                    )}
                    {joinSuccess && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-teal font-sans bg-teal/10 rounded-xl px-4 py-2.5 text-center leading-relaxed">
                        {joinSuccess}
                      </motion.p>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button onClick={closeModal} className="flex-1 py-3 rounded-xl text-warmDark/70 hover:bg-white/30 transition-all">Cancel</button>
                      <button
                        onClick={handleJoinByCode}
                        disabled={joinLoading || !!joinSuccess}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold/80 to-coral/80 text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {joinLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Request to join'}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* UNLOCK VAULT */}
              {modal === 'unlock-vault' && (
                <>
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-peach/40 flex items-center justify-center mb-4 shadow-inner">
                      <Lock className="w-7 h-7 text-gold/80" />
                    </div>
                    <h2 className="font-serif text-2xl text-warmDark">Secret Vault</h2>
                    <p className="font-handwriting text-lg text-warmDark/60 mt-1">Enter your 4-digit secrecy code</p>
                  </div>
                  <div className="flex justify-center gap-3 mb-4">
                    {[0, 1, 2, 3].map((idx) => (
                      <input
                        key={idx}
                        id={`vault-pin-${idx}`}
                        type="password"
                        inputMode="numeric"
                        maxLength={1}
                        value={vaultPinInput[idx] || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/, '')
                          if (!val) return
                          const arr = (vaultPinInput + '    ').split('').slice(0, 4)
                          arr[idx] = val
                          const next = arr.join('').trim()
                          setVaultPinInput(next)
                          setVaultPinError('')
                          if (idx < 3) document.getElementById(`vault-pin-${idx + 1}`)?.focus()
                          if (next.length === 4) {
                            storeVerifyVaultCode(next).then((ok) => {
                              if (ok) {
                                setVaultOpen(true)
                                closeModal()
                              } else {
                                setVaultPinError('Incorrect code. Try again.')
                                setVaultPinInput('')
                                document.getElementById('vault-pin-0')?.focus()
                              }
                            })
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace') {
                            e.preventDefault()
                            const arr = (vaultPinInput + '    ').split('').slice(0, 4)
                            if (arr[idx] && arr[idx].trim()) {
                              arr[idx] = ' '
                              setVaultPinInput(arr.join('').trimEnd())
                            } else if (idx > 0) {
                              arr[idx - 1] = ' '
                              setVaultPinInput(arr.join('').trimEnd())
                              document.getElementById(`vault-pin-${idx - 1}`)?.focus()
                            }
                            setVaultPinError('')
                          }
                        }}
                        autoFocus={idx === 0}
                        className="w-14 h-14 rounded-2xl bg-white/60 border-2 border-warmMid/20 text-center text-xl font-bold text-warmDark outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all"
                      />
                    ))}
                  </div>
                  {vaultPinError && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-coral font-sans bg-coral/10 rounded-xl px-4 py-2 text-center mb-3">
                      {vaultPinError}
                    </motion.p>
                  )}
                  <button onClick={closeModal} className="w-full py-3 rounded-xl text-warmDark/70 hover:bg-white/30 transition-all font-sans text-sm">Cancel</button>
                </>
              )}

              {/* SET / CHANGE SECRECY CODE */}
              {modal === 'set-secret-code' && (
                <>
                  <div className="flex flex-col items-center mb-5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/20 to-amber-100 flex items-center justify-center mb-3">
                      <Lock className="w-6 h-6 text-gold/80" />
                    </div>
                    <h2 className="font-serif text-2xl text-warmDark">{hasVaultCode ? 'Change secrecy code' : 'Set secrecy code'}</h2>
                    <p className="font-handwriting text-lg text-warmDark/60 mt-1 text-center">
                      {hasVaultCode ? 'Choose a new 4-digit code for your vault' : 'Create a 4-digit code to protect your hidden spaces'}
                    </p>
                  </div>
                  <div className="space-y-4">
                    {hasVaultCode && (
                      <div>
                        <label className="font-handwriting text-warmDark/70 text-base block mb-2">Current code</label>
                        <div className="flex gap-3 justify-center">
                          {[0, 1, 2, 3].map((idx) => (
                            <input
                              key={idx}
                              id={`cur-code-${idx}`}
                              type="password"
                              inputMode="numeric"
                              maxLength={1}
                              value={currentSecretCodeInput[idx] || ''}
                              autoFocus={idx === 0}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/, '')
                                if (!val) return
                                const arr = (currentSecretCodeInput + '    ').split('').slice(0, 4)
                                arr[idx] = val
                                setCurrentSecretCodeInput(arr.join('').trimEnd())
                                setSecretCodeError('')
                                if (idx < 3) document.getElementById(`cur-code-${idx + 1}`)?.focus()
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Backspace') {
                                  e.preventDefault()
                                  const arr = (currentSecretCodeInput + '    ').split('').slice(0, 4)
                                  if (arr[idx]?.trim()) { arr[idx] = ' '; setCurrentSecretCodeInput(arr.join('').trimEnd()) }
                                  else if (idx > 0) { arr[idx - 1] = ' '; setCurrentSecretCodeInput(arr.join('').trimEnd()); document.getElementById(`cur-code-${idx - 1}`)?.focus() }
                                }
                              }}
                              className="w-12 h-12 rounded-xl bg-white/60 border-2 border-warmMid/20 text-center text-lg font-bold text-warmDark outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="font-handwriting text-warmDark/70 text-base block mb-2">{hasVaultCode ? 'New code' : 'Your code'}</label>
                      <div className="flex gap-3 justify-center">
                        {[0, 1, 2, 3].map((idx) => (
                          <input
                            key={idx}
                            id={`new-code-${idx}`}
                            type="password"
                            inputMode="numeric"
                            maxLength={1}
                            value={newSecretCode[idx] || ''}
                            autoFocus={!hasVaultCode && idx === 0}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/, '')
                              if (!val) return
                              const arr = (newSecretCode + '    ').split('').slice(0, 4)
                              arr[idx] = val
                              setNewSecretCode(arr.join('').trimEnd())
                              setSecretCodeError('')
                              if (idx < 3) document.getElementById(`new-code-${idx + 1}`)?.focus()
                              else document.getElementById('conf-code-0')?.focus()
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Backspace') {
                                e.preventDefault()
                                const arr = (newSecretCode + '    ').split('').slice(0, 4)
                                if (arr[idx]?.trim()) { arr[idx] = ' '; setNewSecretCode(arr.join('').trimEnd()) }
                                else if (idx > 0) { arr[idx - 1] = ' '; setNewSecretCode(arr.join('').trimEnd()); document.getElementById(`new-code-${idx - 1}`)?.focus() }
                              }
                            }}
                            className="w-12 h-12 rounded-xl bg-white/60 border-2 border-warmMid/20 text-center text-lg font-bold text-warmDark outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all"
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="font-handwriting text-warmDark/70 text-base block mb-2">Confirm code</label>
                      <div className="flex gap-3 justify-center">
                        {[0, 1, 2, 3].map((idx) => (
                          <input
                            key={idx}
                            id={`conf-code-${idx}`}
                            type="password"
                            inputMode="numeric"
                            maxLength={1}
                            value={confirmSecretCode[idx] || ''}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/, '')
                              if (!val) return
                              const arr = (confirmSecretCode + '    ').split('').slice(0, 4)
                              arr[idx] = val
                              setConfirmSecretCode(arr.join('').trimEnd())
                              setSecretCodeError('')
                              if (idx < 3) document.getElementById(`conf-code-${idx + 1}`)?.focus()
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Backspace') {
                                e.preventDefault()
                                const arr = (confirmSecretCode + '    ').split('').slice(0, 4)
                                if (arr[idx]?.trim()) { arr[idx] = ' '; setConfirmSecretCode(arr.join('').trimEnd()) }
                                else if (idx > 0) { arr[idx - 1] = ' '; setConfirmSecretCode(arr.join('').trimEnd()); document.getElementById(`conf-code-${idx - 1}`)?.focus() }
                              }
                            }}
                            className="w-12 h-12 rounded-xl bg-white/60 border-2 border-warmMid/20 text-center text-lg font-bold text-warmDark outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all"
                          />
                        ))}
                      </div>
                    </div>

                    {secretCodeError && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-coral font-sans bg-coral/10 rounded-xl px-4 py-2 text-center">
                        {secretCodeError}
                      </motion.p>
                    )}
                    {secretCodeSuccess && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-teal font-sans bg-teal/10 rounded-xl px-4 py-2 flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" /> Code saved!
                      </motion.p>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button onClick={() => { closeModal(); if (pendingHideAfterCode) { setPendingHideAfterCode(false); setHideSelectMode(false); setSelectedToHide(new Set()) } }} className="flex-1 py-3 rounded-xl text-warmDark/70 hover:bg-white/30 transition-all">Cancel</button>
                      <button
                        onClick={async () => {
                          const cleanNew = newSecretCode.replace(/\s/g, '')
                          const cleanConfirm = confirmSecretCode.replace(/\s/g, '')
                          if (hasVaultCode) {
                            const cleanCurrent = currentSecretCodeInput.replace(/\s/g, '')
                            if (cleanCurrent.length !== 4) { setSecretCodeError('Enter your current 4-digit code'); return }
                            const valid = await storeVerifyVaultCode(cleanCurrent)
                            if (!valid) { setSecretCodeError('Current code is incorrect'); return }
                          }
                          if (cleanNew.length !== 4) { setSecretCodeError('New code must be exactly 4 digits'); return }
                          if (cleanNew !== cleanConfirm) { setSecretCodeError('Codes do not match'); return }
                          try {
                            if (hasVaultCode) {
                              await storeChangeVaultCode(currentSecretCodeInput.replace(/\s/g, ''), cleanNew)
                            } else {
                              await storeSetVaultCode(cleanNew)
                            }
                            setSecretCodeSuccess(true)
                            // If pending hide, complete it now
                            if (pendingHideAfterCode) {
                              await storeUpdateHiddenSpaces(Array.from(selectedToHide))
                              setSelectedToHide(new Set())
                              setHideSelectMode(false)
                              setPendingHideAfterCode(false)
                            }
                            setTimeout(() => closeModal(), 1200)
                          } catch {
                            setSecretCodeError('Failed to save code. Please try again.')
                          }
                        }}
                        disabled={secretCodeSuccess}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold/80 to-coral/80 text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        Save code
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IMAGE CROP MODAL */}
      <AnimatePresence>
        {cropSrc && (
          <ImageCropModal
            src={cropSrc}
            initialPosX={cropInitialPosX}
            initialPosY={cropInitialPosY}
            initialScale={cropInitialScale}
            uploading={cropUploading}
            onCancel={() => {
              if (!cropIsReadjust) URL.revokeObjectURL(cropSrc)
              setCropSrc(null); setCropTarget(null); setCropPendingFile(null)
            }}
            onDone={async ({ posX, posY, scale }) => {
              if (cropIsReadjust) {
                // Re-adjust only: no re-upload, just update position
                if (cropTarget === 'create') { setNewCoverImagePosX(posX); setNewCoverImagePosY(posY); setNewCoverImageScale(scale) }
                else { setEditCoverImagePosX(posX); setEditCoverImagePosY(posY); setEditCoverImageScale(scale) }
                setCropSrc(null); setCropTarget(null)
              } else {
                // New upload: upload the original file, then save URL + position
                setCropUploading(true)
                try {
                  const url = await uploadImage(cropPendingFile!)
                  if (cropTarget === 'create') { setNewCoverImage(url); setNewCoverImagePosX(posX); setNewCoverImagePosY(posY); setNewCoverImageScale(scale) }
                  else { setEditCoverImage(url); setEditCoverImagePosX(posX); setEditCoverImagePosY(posY); setEditCoverImageScale(scale) }
                } catch { /* silently fail */ } finally {
                  URL.revokeObjectURL(cropSrc)
                  setCropSrc(null); setCropTarget(null); setCropPendingFile(null); setCropUploading(false)
                }
              }
            }}
          />
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
