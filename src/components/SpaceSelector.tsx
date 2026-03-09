import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Users, Crown, Shield, X, Pencil, Trash2, Check, Loader2, Mail, Eye, EyeOff, KeyRound, LogOut, UserMinus } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { api } from '../api'
import { MemorySpace } from '../types'
import ParticleBackground from './ParticleBackground'

const categoryTaglines: Record<string, string[]> = {
  Travel: [
    'Where every road becomes a story.',
    'Miles traveled, memories made.',
    'Adventures waiting to be remembered.',
    'Far from home, close to the heart.',
    'The world, one memory at a time.',
    'Not all who wander are lost — some are collecting stories.',
    'Every destination leaves a piece of itself with you.',
  ],
  'Family & People': [
    'Every family has a story. This is ours.',
    'Built on love, held together by memories.',
    'The people who make life worth living.',
    'Where laughter echoes and love stays forever.',
    'Our story, written together.',
    'Blood, bond, and beautiful chaos.',
    'The ones who fill our days with meaning.',
  ],
  'Love & Feelings': [
    'The moments that make the heart full.',
    'Love, in all its forms, preserved here.',
    'Feelings too big for words, too precious to forget.',
    'Every heartbeat holds a story.',
    'The softest moments, held forever.',
    'A little corner for what matters most.',
    'Where feelings find a home.',
  ],
  Celebrations: [
    'Life\'s best chapters, remembered together.',
    'Every reason to celebrate, captured here.',
    'Big moments. Bigger memories.',
    'Here\'s to the moments worth raising a glass to.',
    'The milestones that light up our story.',
    'Joy, laughter, and everything worth toasting to.',
    'Life is short. Celebrate everything.',
  ],
  Nature: [
    'Seasons change. Memories stay.',
    'Where the wild things grow and memories bloom.',
    'Earth\'s beauty, one snapshot at a time.',
    'Every sunrise tells a different story.',
    'The quiet moments between mountains and sea.',
    'Nature\'s gift, captured here.',
    'In the wild, we find ourselves.',
  ],
  'Food & Drinks': [
    'Good food, good people, good times.',
    'Every meal is a memory waiting to happen.',
    'Flavors that tell a story.',
    'A table full of stories.',
    'Life tastes better with great memories.',
    'Where every bite is a moment to remember.',
    'Recipes for living well.',
  ],
  'Sports & Fitness': [
    'Every drop of sweat tells a story.',
    'Pushing limits, making memories.',
    'The wins, the losses, the glory.',
    'In the zone and in the moment.',
    'Training hard, living fully.',
    'Every finish line is a new beginning.',
    'Where the game meets the memory.',
  ],
  'Music & Arts': [
    'The soundtrack of a life well-lived.',
    'Every note, every stroke, every moment.',
    'Art is the memory we leave behind.',
    'Where imagination and memory meet.',
    'Creating and capturing, one moment at a time.',
    'Every masterpiece has a story.',
    'Where creativity finds its home.',
  ],
  'Work & School': [
    'The grind, the growth, the glory.',
    'Learning, building, becoming.',
    'Late nights and big dreams, documented.',
    'The journey of becoming something great.',
    'Every achievement, archived here.',
    'Where hard work meets its reward.',
    'Milestones on the road to something amazing.',
  ],
  'Home & Life': [
    'Home is where the memories are made.',
    'The little things that mean everything.',
    'Where ordinary moments become extraordinary.',
    'Life\'s quiet chapters, lovingly kept.',
    'The beauty of an everyday life.',
    'A life fully lived, beautifully remembered.',
    'The everyday moments that make up a life.',
  ],
}

const emojiCategories: Record<string, string> = {
  '✈️':'Travel','🌍':'Travel','🗺️':'Travel','🏖️':'Travel','🏔️':'Travel','🗼':'Travel','🏕️':'Travel','🚢':'Travel','🚂':'Travel','🛵':'Travel','🏝️':'Travel','🌅':'Travel','🌄':'Travel','🗽':'Travel','🏯':'Travel','🎡':'Travel',
  '👨‍👩‍👧‍👦':'Family & People','👪':'Family & People','🤱':'Family & People','👶':'Family & People','👫':'Family & People','👭':'Family & People','👬':'Family & People','🧑‍🤝‍🧑':'Family & People','👴':'Family & People','👵':'Family & People','🧒':'Family & People','🧓':'Family & People','💑':'Family & People','👰':'Family & People','🤵':'Family & People','🎅':'Family & People',
  '❤️':'Love & Feelings','🥰':'Love & Feelings','💕':'Love & Feelings','💖':'Love & Feelings','💝':'Love & Feelings','💌':'Love & Feelings','🫶':'Love & Feelings','😊':'Love & Feelings','🥹':'Love & Feelings','😍':'Love & Feelings','🤗':'Love & Feelings','😭':'Love & Feelings','🎊':'Love & Feelings','🙏':'Love & Feelings','✨':'Love & Feelings','🌈':'Love & Feelings',
  '🎉':'Celebrations','🎂':'Celebrations','🎁':'Celebrations','🥂':'Celebrations','🍾':'Celebrations','🎈':'Celebrations','🏆':'Celebrations','🥳':'Celebrations','🎆':'Celebrations','🎇':'Celebrations','🎀':'Celebrations','🪅':'Celebrations','🎗️':'Celebrations','🎵':'Celebrations','🎤':'Celebrations',
  '🌸':'Nature','🌿':'Nature','🍀':'Nature','🌻':'Nature','🌺':'Nature','🍂':'Nature','🌙':'Nature','⭐':'Nature','🌊':'Nature','🦋':'Nature','🐚':'Nature','🍁':'Nature','🌞':'Nature','❄️':'Nature','🌴':'Nature','🦜':'Nature',
  '🍕':'Food & Drinks','🍜':'Food & Drinks','🍣':'Food & Drinks','🥗':'Food & Drinks','🍔':'Food & Drinks','🧁':'Food & Drinks','🍰':'Food & Drinks','☕':'Food & Drinks','🧋':'Food & Drinks','🍷':'Food & Drinks','🍦':'Food & Drinks','🥘':'Food & Drinks','🍱':'Food & Drinks','🥐':'Food & Drinks','🫕':'Food & Drinks','🍫':'Food & Drinks',
  '⚽':'Sports & Fitness','🏀':'Sports & Fitness','🎾':'Sports & Fitness','🏊':'Sports & Fitness','🧘':'Sports & Fitness','🚴':'Sports & Fitness','🏋️':'Sports & Fitness','🎯':'Sports & Fitness','🏄':'Sports & Fitness','🤸':'Sports & Fitness','🎳':'Sports & Fitness','🥊':'Sports & Fitness','🏇':'Sports & Fitness','🧗':'Sports & Fitness','⛷️':'Sports & Fitness','🤾':'Sports & Fitness',
  '🎸':'Music & Arts','🎹':'Music & Arts','🎨':'Music & Arts','🖌️':'Music & Arts','📸':'Music & Arts','🎭':'Music & Arts','🎬':'Music & Arts','🥁':'Music & Arts','🎷':'Music & Arts','🎻':'Music & Arts','📚':'Music & Arts','✏️':'Music & Arts','🎙️':'Music & Arts','🎺':'Music & Arts',
  '💼':'Work & School','🎓':'Work & School','📖':'Work & School','🖥️':'Work & School','🔬':'Work & School','📊':'Work & School','🏫':'Work & School','📝':'Work & School','🔭':'Work & School','💡':'Work & School','🧪':'Work & School','📐':'Work & School','🗂️':'Work & School','🏗️':'Work & School','⚙️':'Work & School','🧠':'Work & School',
  '🏠':'Home & Life','🌱':'Home & Life','🪴':'Home & Life','🛋️':'Home & Life','🕯️':'Home & Life','🧸':'Home & Life','🪆':'Home & Life','📷':'Home & Life','🗝️':'Home & Life','🎠':'Home & Life','🛁':'Home & Life','🪞':'Home & Life','🛏️':'Home & Life','🏡':'Home & Life','🪟':'Home & Life','🧺':'Home & Life',
}

function randomTagline(emoji: string): string {
  const category = emojiCategories[emoji]
  const lines = category ? categoryTaglines[category] : null
  if (!lines) return 'A collection of precious moments.'
  return lines[Math.floor(Math.random() * lines.length)]
}

const spaceColors = [
  'from-purple-200/60 to-pink-200/60',
  'from-amber-200/60 to-orange-200/60',
  'from-teal-200/60 to-cyan-200/60',
  'from-rose-200/60 to-red-200/60',
  'from-indigo-200/60 to-blue-200/60',
  'from-lime-200/60 to-emerald-200/60',
]

// Drifting Polaroids - layer config: near (0), mid (1), far (2)
const polaroidLayers = [
  { parallax: 18, blur: 0,   opacity: 1,    floatRange: 12, floatSpeed: 6,   zIndex: 30 },
  { parallax: 9,  blur: 0.8, opacity: 0.90, floatRange: 8,  floatSpeed: 7.5, zIndex: 20 },
  { parallax: 4,  blur: 2.5, opacity: 0.70, floatRange: 6,  floatSpeed: 9,   zIndex: 10 },
]
// [leftPct, topPct, rotateDeg]
const polaroidPositions: [number, number, number][] = [
  [28,  5,  -5],
  [52, 20,   3],
  [ 5, 27,  -8],
  [68,  4,   6],
  [40, 47,  -3],
  [74, 43,   5],
  [12, 54,  -6],
  [57, 55,   7],
  [82, 21,  -4],
  [21, 64,   4],
  [62, 63,  -5],
]
const layerCardWidths   = [176, 148, 120]
const layerImageHeights = [136, 112, 90]
const layerEmojiSizes   = ['text-5xl', 'text-4xl', 'text-3xl']

type Modal = 'none' | 'create' | 'members' | 'edit-space' | 'change-password'

export default function SpaceSelector() {
  const { getVisibleSpaces, setActiveSpace, addSpace, updateSpace, deleteSpace, leaveSpace, removeMember, logout, currentUser, spaces, loading, pendingInvites, acceptSpaceInvite, rejectSpaceInvite } = useStore()
  const visibleSpaces = getVisibleSpaces()

  const [modal, setModal] = useState<Modal>('none')
  const [newTitle, setNewTitle] = useState('')
  const [newEmoji, setNewEmoji] = useState('✨')
  const [newDescription, setNewDescription] = useState(randomTagline('✨'))
  const [newType, setNewType] = useState<'personal' | 'group'>('personal')
  const [viewingSpaceId, setViewingSpaceId] = useState<string | null>(null)

  // Edit-mode for spaces page
  const [editPageMode, setEditPageMode] = useState(false)
  const spacesContainerRef = useRef<HTMLDivElement>(null)

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
  const [editEmoji, setEditEmoji] = useState('✨')
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

  // Parallax mouse tracking
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  const handleCreate = async () => {
    if (!newTitle.trim() || creating) return
    setCreating(true)
    const space: MemorySpace = {
      id: `space-${Date.now()}`,
      title: newTitle,
      coverImage: '',
      coverEmoji: newEmoji,
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
      setNewEmoji('✨')
      setNewDescription(randomTagline('✨'))
      setModal('none')
    } finally {
      setCreating(false)
    }
  }

  const openEditSpace = (space: MemorySpace) => {
    setEditingSpaceId(space.id)
    setEditTitle(space.title)
    setEditEmoji(space.coverEmoji)
    setModal('edit-space')
  }

  const handleSaveSpace = async () => {
    if (!editTitle.trim() || !editingSpaceId) return
    await updateSpace(editingSpaceId, { title: editTitle.trim(), coverEmoji: editEmoji })
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
    if (newPassword.length < 6) { setPwError('New password must be at least 6 characters'); return }
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

  const handleMouseMoveCanvas = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMouse({
      x: (e.clientX - rect.left - rect.width  / 2) / rect.width,
      y: (e.clientY - rect.top  - rect.height / 2) / rect.height,
    })
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
      <div className="min-h-screen gradient-bg flex flex-col items-center justify-center gap-5">
        <ParticleBackground />
        <div className="relative z-10 flex flex-col items-center gap-5">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-gold/20 border-t-gold animate-spin" style={{ animationDuration: '1.2s' }} />
            <div className="absolute inset-[5px] rounded-full border-2 border-coral/20 border-t-coral/60 animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-gold/50" />
            </div>
          </div>
          <p className="font-handwriting text-xl text-warmDark/45">loading your spaces...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 min-h-screen">
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
                              <p className="font-sans text-xs text-warmDark/50 truncate mt-0.5">
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
                                    <span className="w-5 h-5 rounded-full bg-coral/10 text-coral text-[10px] font-bold flex items-center justify-center">
                                      {pendingInvites.length}
                                    </span>
                                  </div>
                                  <Mail className="w-4 h-4 text-warmDark/40 group-hover:text-warmDark/60 transition-colors" />
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
                                  {!editPageMode && <Pencil className="w-4 h-4 text-warmDark/40 group-hover:text-warmDark/60 transition-colors" />}
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
                                <KeyRound className="w-4 h-4 text-warmDark/40 group-hover:text-warmDark/60 transition-colors" />
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
                                className="text-warmDark/40 hover:text-warmDark/70 p-1 -ml-1 rounded-md hover:bg-warmMid/10 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <p className="font-serif text-base text-warmDark">Space invitations</p>
                            </div>
                            <div className="divide-y divide-warmMid/8 overflow-y-auto overflow-x-hidden flex-1">
                              {pendingInvites.length === 0 ? (
                                <div className="p-6 text-center text-warmDark/40 text-sm font-sans">
                                  No pending invitations.
                                </div>
                              ) : (
                                pendingInvites.map((inv) => (
                                  <div key={inv.id} className="px-4 py-3 flex items-center gap-3">
                                    <span className="text-2xl flex-shrink-0">{inv.spaceEmoji}</span>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-sans text-sm text-warmDark font-medium truncate">{inv.spaceName}</p>
                                      <p className="font-sans text-xs text-warmDark/40">You've been invited</p>
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
          className="relative z-20 text-center pt-16 pb-3 px-4 pointer-events-none"
        >
          {currentUser && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="font-handwriting text-lg text-warmDark/70 mb-3">
              Hello, {currentUser.name}
            </motion.p>
          )}
          <h1 className="font-serif text-3xl md:text-5xl text-warmDark mb-2">Where do you want to go today?</h1>
          <p className="font-handwriting text-xl md:text-2xl text-warmDark/55">Choose a memory space to explore</p>
        </motion.div>

        {/* ===== DRIFTING POLAROIDS CANVAS ===== */}
        <div
          ref={spacesContainerRef}
          className="relative w-full"
          style={{ height: 'calc(100vh - 185px)', minHeight: 500 }}
          onMouseMove={handleMouseMoveCanvas}
          onMouseLeave={() => setMouse({ x: 0, y: 0 })}
        >
          {/* Soft bokeh blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-96 h-96 rounded-full bg-lavender/35 blur-3xl" style={{ top: '10%', left: '3%' }} />
            <div className="absolute w-80 h-80 rounded-full bg-peach/30 blur-3xl" style={{ bottom: '8%', right: '8%' }} />
            <div className="absolute w-56 h-56 rounded-full bg-gold/12 blur-3xl" style={{ top: '5%', right: '28%' }} />
          </div>

          {([...visibleSpaces, null] as any[]).map((space: any, i: number) => {
            const isNew = space === null
            const layer = i % 3
            const layerCfg = polaroidLayers[layer]
            const [leftPct, topPct, rotation] = polaroidPositions[i % polaroidPositions.length]

            const parallaxX = mouse.x * layerCfg.parallax
            const parallaxY = mouse.y * layerCfg.parallax

            const cardWidth   = layerCardWidths[layer]
            const imgHeight   = layerImageHeights[layer]
            const emojiSz     = layerEmojiSizes[layer]

            const isOwner     = !isNew && space.createdBy === currentUser?.id
            const isDelConfirm = !isNew && deleteConfirmId === space.id

            const visibleCount = !isNew
              ? (space.memories?.length
                  ? space.memories.filter((m: any) => {
                      if (!m.visibleTo || m.visibleTo.length === 0) return true
                      if (m.createdBy === currentUser?.id) return true
                      return currentUser ? m.visibleTo.includes(currentUser.id) : false
                    }).length
                  : space.memoryCount)
              : 0

            return (
              <div
                key={isNew ? 'new-space' : space.id}
                style={{
                  position: 'absolute',
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  zIndex: layerCfg.zIndex,
                  transform: `translate(${parallaxX}px, ${parallaxY}px)`,
                  transition: 'transform 0.18s ease-out',
                  filter: layerCfg.blur > 0 ? `blur(${layerCfg.blur}px)` : undefined,
                  opacity: layerCfg.opacity,
                }}
              >
                {/* Entry fade-in */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: i * 0.11, type: 'spring', stiffness: 110, damping: 14 }}
                >
                  {/* Float + hover */}
                  <motion.div
                    className="group relative cursor-pointer"
                    animate={{ y: [0, -(layerCfg.floatRange), 0] }}
                    transition={{
                      y: {
                        duration: layerCfg.floatSpeed + i * 0.45,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.38,
                      },
                    }}
                    whileHover={editPageMode || isNew ? {} : {
                      scale: 1.07,
                      y: -(layerCfg.floatRange + 16),
                      transition: { duration: 0.22, ease: 'easeOut' },
                    }}
                    whileTap={!editPageMode && !isNew ? { scale: 0.97 } : {}}
                    onClick={() => {
                      if (isNew) { setModal('create'); return }
                      if (editPageMode) return
                      setActiveSpace(space.id)
                    }}
                  >
                    {/* Polaroid card */}
                    <div
                      className="relative bg-white select-none"
                      style={{
                        width: cardWidth,
                        transform: `rotate(${rotation}deg)`,
                        boxShadow: '0 8px 28px rgba(74,55,40,0.18), 0 2px 8px rgba(74,55,40,0.09)',
                        borderRadius: 3,
                      }}
                    >
                      {/* Gold glow ring on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-10"
                        style={{
                          boxShadow: '0 0 0 2.5px rgba(212,165,116,0.70), 0 0 22px rgba(212,165,116,0.30)',
                          borderRadius: 3,
                        }}
                      />

                      {/* Photo area */}
                      {isNew ? (
                        <div
                          className="flex items-center justify-center overflow-hidden"
                          style={{ height: imgHeight, background: 'rgba(240,230,255,0.22)', borderRadius: '3px 3px 0 0' }}
                        >
                          <Plus className="text-warmMid/35" style={{ width: cardWidth * 0.16, height: cardWidth * 0.16 }} />
                        </div>
                      ) : (
                        <div
                          className={`flex items-center justify-center overflow-hidden bg-gradient-to-br ${spaceColors[i % spaceColors.length]}`}
                          style={{ height: imgHeight, borderRadius: '3px 3px 0 0' }}
                        >
                          <span className={emojiSz}>{space.coverEmoji}</span>
                        </div>
                      )}

                      {/* Polaroid label */}
                      <div className="bg-white px-3 pt-2.5 pb-3" style={{ borderRadius: '0 0 3px 3px' }}>
                        {isNew ? (
                          <p className="font-handwriting text-warmMid/45 text-center" style={{ fontSize: 13 }}>
                            new space
                          </p>
                        ) : (
                          <>
                            <p
                              className="font-handwriting text-warmDark font-medium leading-snug"
                              style={{ fontSize: layer === 0 ? 16 : layer === 1 ? 14 : 12 }}
                            >
                              {space.title}
                            </p>
                            <p
                              className="font-handwriting text-warmDark/50 mt-0.5"
                              style={{ fontSize: layer === 0 ? 13 : 11 }}
                            >
                              {visibleCount} {visibleCount === 1 ? 'memory' : 'memories'}
                            </p>
                            {space.type === 'group' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (!editPageMode) { setViewingSpaceId(space.id); setModal('members') }
                                }}
                                className="flex items-center gap-1 mt-1 text-warmDark/45 hover:text-warmDark/65 transition-colors"
                                style={{ fontSize: 10 }}
                              >
                                <Users style={{ width: 10, height: 10 }} />
                                <span>{space.membersList.filter((m: any) => m.status === 'active').length} members</span>
                                {isOwner && <Crown style={{ width: 10, height: 10 }} className="text-gold/60" />}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Edit mode overlays */}
                    {editPageMode && !isNew && isOwner && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditSpace(space) }}
                          className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-warmDark/60 hover:text-warmDark transition-colors z-20 border border-warmMid/10"
                          style={{ transform: `rotate(${-rotation}deg)` }}
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        {!isDelConfirm ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(space.id) }}
                            className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-coral/60 hover:text-coral transition-colors z-20 border border-warmMid/10"
                            style={{ transform: `rotate(${-rotation}deg)` }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        ) : (
                          <div
                            className="absolute -top-11 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 z-20 whitespace-nowrap border border-warmMid/10"
                            style={{ transform: `translateX(-50%) rotate(${-rotation}deg)` }}
                          >
                            <span className="text-xs text-warmDark/60 font-sans">Delete?</span>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteSpace(space.id) }} className="text-xs text-coral font-medium hover:text-coral/70">Yes</button>
                            <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null) }} className="text-xs text-warmDark/40 hover:text-warmDark/60">No</button>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                </motion.div>
              </div>
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
              className="glass rounded-3xl p-8 w-full max-w-md relative z-10 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={closeModal} className="absolute top-4 right-4 text-warmDark/40 hover:text-warmDark/70 transition-colors">
                <X className="w-5 h-5" />
              </button>

              {/* CREATE */}
              {modal === 'create' && (
                <>
                  <h2 className="font-serif text-2xl text-warmDark mb-6">Create a new space</h2>
                  <div className="space-y-5">
                    <div>
                      <label className="font-handwriting text-lg text-warmDark/60 block mb-2">Give it a name</label>
                      <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Thailand Trip 2025..."
                        className="w-full bg-white/50 rounded-xl px-4 py-3 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all" />
                    </div>
                    <div>
                      <label className="font-handwriting text-lg text-warmDark/60 block mb-2">Pick an emoji</label>
                      <div className="max-h-52 overflow-y-auto space-y-3 pr-1">
                        {[
                          { label: 'Travel', emojis: ['✈️','🌍','🗺️','🏖️','🏔️','🗼','🏕️','🚢','🚂','🛵','🏝️','🌅','🌄','🗽','🏯','🎡'] },
                          { label: 'Family & People', emojis: ['👨‍👩‍👧‍👦','👪','🤱','👶','👫','👭','👬','🧑‍🤝‍🧑','👴','👵','🧒','🧓','💑','👰','🤵','🎅'] },
                          { label: 'Love & Feelings', emojis: ['❤️','🥰','💕','💖','💝','💌','🫶','😊','🥹','😍','🤗','😭','🎊','🙏','✨','🌈'] },
                          { label: 'Celebrations', emojis: ['🎉','🎂','🎁','🥂','🍾','🎈','🎊','🏆','🥳','🎆','🎇','🎀','🪅','🎗️','🎵','🎤'] },
                          { label: 'Nature', emojis: ['🌸','🌿','🍀','🌻','🌺','🍂','🌙','⭐','🌊','🦋','🐚','🍁','🌞','❄️','🌴','🦜'] },
                          { label: 'Food & Drinks', emojis: ['🍕','🍜','🍣','🥗','🍔','🧁','🍰','☕','🧋','🍷','🍦','🥘','🍱','🥐','🫕','🍫'] },
                          { label: 'Sports & Fitness', emojis: ['⚽','🏀','🎾','🏊','🧘','🚴','🏋️','🎯','🏄','🤸','🎳','🥊','🏇','🧗','⛷️','🤾'] },
                          { label: 'Music & Arts', emojis: ['🎵','🎸','🎹','🎨','🖌️','📸','🎭','🎬','🎤','🥁','🎷','🎻','📚','✏️','🎙️','🎺'] },
                          { label: 'Work & School', emojis: ['💼','🎓','📖','🖥️','🔬','📊','🏫','📝','🔭','💡','🧪','📐','🗂️','🏗️','⚙️','🧠'] },
                          { label: 'Home & Life', emojis: ['🏠','🌱','🪴','🛋️','🕯️','🧸','🪆','📷','🗝️','🎠','🛁','🪞','🛏️','🏡','🪟','🧺'] },
                        ].map(({ label, emojis }) => (
                          <div key={label}>
                            <p className="font-sans text-[10px] text-warmDark/35 uppercase tracking-wider mb-1.5">{label}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {emojis.map((emoji) => (
                                <button key={emoji} onClick={() => { setNewEmoji(emoji); setNewDescription(randomTagline(emoji)) }}
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${newEmoji === emoji ? 'bg-gold/25 ring-2 ring-gold/50 scale-110' : 'bg-white/30 hover:bg-white/50'}`}>
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Live tagline preview with re-roll */}
                      <div className="mt-2.5 flex items-center gap-2">
                        <p className="font-handwriting text-warmDark/50 text-sm italic flex-1">{newDescription}</p>
                        <button
                          type="button"
                          onClick={() => setNewDescription(randomTagline(newEmoji))}
                          className="text-[10px] font-sans text-warmDark/30 hover:text-warmDark/55 transition-colors whitespace-nowrap"
                          title="Pick another"
                        >
                          ↻ shuffle
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="font-handwriting text-lg text-warmDark/60 block mb-2">What kind of space?</label>
                      <div className="flex gap-3">
                        <button onClick={() => setNewType('personal')}
                          className={`flex-1 py-3 rounded-xl font-sans text-sm transition-all ${newType === 'personal' ? 'bg-gold/20 text-warmDark ring-1 ring-gold/30' : 'bg-white/30 text-warmDark/55 hover:bg-white/50'}`}>
                          Personal
                        </button>
                        <button onClick={() => setNewType('group')}
                          className={`flex-1 py-3 rounded-xl font-sans text-sm transition-all ${newType === 'group' ? 'bg-gold/20 text-warmDark ring-1 ring-gold/30' : 'bg-white/30 text-warmDark/55 hover:bg-white/50'}`}>
                          Group
                        </button>
                      </div>
                      {newType === 'group' && (
                        <p className="text-xs text-warmDark/40 mt-2 font-sans">Invite members by email. They can accept or decline from the app.</p>
                      )}
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={closeModal} className="flex-1 py-3 rounded-xl text-warmDark/55 hover:bg-white/30 transition-all">Cancel</button>
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
                      <label className="font-handwriting text-lg text-warmDark/60 block mb-2">Name</label>
                      <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveSpace()}
                        className="w-full bg-white/50 rounded-xl px-4 py-3 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all" />
                    </div>
                    <div>
                      <label className="font-handwriting text-lg text-warmDark/60 block mb-2">Emoji</label>
                      <div className="max-h-52 overflow-y-auto space-y-3 pr-1">
                        {[
                          { label: 'Travel', emojis: ['✈️','🌍','🗺️','🏖️','🏔️','🗼','🏕️','🚢','🚂','🛵','🏝️','🌅','🌄','🗽','🏯','🎡'] },
                          { label: 'Family & People', emojis: ['👨‍👩‍👧‍👦','👪','🤱','👶','👫','👭','👬','🧑‍🤝‍🧑','👴','👵','🧒','🧓','💑','👰','🤵','🎅'] },
                          { label: 'Love & Feelings', emojis: ['❤️','🥰','💕','💖','💝','💌','🫶','😊','🥹','😍','🤗','😭','🎊','🙏','✨','🌈'] },
                          { label: 'Celebrations', emojis: ['🎉','🎂','🎁','🥂','🍾','🎈','🎊','🏆','🥳','🎆','🎇','🎀','🪅','🎗️','🎵','🎤'] },
                          { label: 'Nature', emojis: ['🌸','🌿','🍀','🌻','🌺','🍂','🌙','⭐','🌊','🦋','🐚','🍁','🌞','❄️','🌴','🦜'] },
                          { label: 'Food & Drinks', emojis: ['🍕','🍜','🍣','🥗','🍔','🧁','🍰','☕','🧋','🍷','🍦','🥘','🍱','🥐','🫕','🍫'] },
                          { label: 'Sports & Fitness', emojis: ['⚽','🏀','🎾','🏊','🧘','🚴','🏋️','🎯','🏄','🤸','🎳','🥊','🏇','🧗','⛷️','🤾'] },
                          { label: 'Music & Arts', emojis: ['🎵','🎸','🎹','🎨','🖌️','📸','🎭','🎬','🎤','🥁','🎷','🎻','📚','✏️','🎙️','🎺'] },
                          { label: 'Work & School', emojis: ['💼','🎓','📖','🖥️','🔬','📊','🏫','📝','🔭','💡','🧪','📐','🗂️','🏗️','⚙️','🧠'] },
                          { label: 'Home & Life', emojis: ['🏠','🌱','🪴','🛋️','🕯️','🧸','🪆','📷','🗝️','🎠','🛁','🪞','🛏️','🏡','🪟','🧺'] },
                        ].map(({ label, emojis }) => (
                          <div key={label}>
                            <p className="font-sans text-[10px] text-warmDark/35 uppercase tracking-wider mb-1.5">{label}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {emojis.map((emoji) => (
                                <button key={emoji} onClick={() => setEditEmoji(emoji)}
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${editEmoji === emoji ? 'bg-gold/25 ring-2 ring-gold/50 scale-110' : 'bg-white/30 hover:bg-white/50'}`}>
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={closeModal} className="flex-1 py-3 rounded-xl text-warmDark/55 hover:bg-white/30 transition-all">Cancel</button>
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
                  <p className="font-handwriting text-lg text-warmDark/50 mb-6">Keep your account secure</p>
                  <div className="space-y-4">
                    <div>
                      <label className="font-handwriting text-warmDark/55 text-base block mb-2">Current password</label>
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
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-warmDark/35 hover:text-warmDark/60 transition-colors">
                          {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="font-handwriting text-warmDark/55 text-base block mb-2">New password</label>
                      <div className="relative">
                        <input
                          type={showNew ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => { setNewPassword(e.target.value); setPwError('') }}
                          placeholder="At least 6 characters"
                          className="w-full bg-white/50 rounded-xl px-4 py-3 pr-11 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                        />
                        <button type="button" onClick={() => setShowNew((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-warmDark/35 hover:text-warmDark/60 transition-colors">
                          {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="font-handwriting text-warmDark/55 text-base block mb-2">Confirm new password</label>
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
                      <button onClick={closeModal} className="flex-1 py-3 rounded-xl text-warmDark/55 hover:bg-white/30 transition-all">Cancel</button>
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
                        <span>{viewingSpace.coverEmoji}</span> {viewingSpace.title}
                      </h2>
                      <p className="font-handwriting text-warmDark/50 mt-1">
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
                                {member.userId === currentUser?.id && <span className="text-warmDark/40 ml-1">(you)</span>}
                              </p>
                              <p className="text-xs text-warmDark/40">Joined {new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            {member.role === 'owner' && <span className="flex items-center gap-1 text-xs text-gold bg-gold/10 px-2 py-1 rounded-full"><Crown className="w-3 h-3" /> Owner</span>}
                            {member.role === 'admin' && <span className="flex items-center gap-1 text-xs text-teal bg-teal/10 px-2 py-1 rounded-full"><Shield className="w-3 h-3" /> Admin</span>}
                            {member.role === 'member' && !canManage && <span className="text-xs text-warmDark/35">Member</span>}
                            {/* Remove button — shown to owner/admin for other non-owner members */}
                            {canManage && member.userId !== currentUser?.id && member.role !== 'owner' && (
                              removingMemberId === member.userId ? (
                                <div className="flex items-center gap-1.5">
                                  <button onClick={() => handleRemove(member.userId)}
                                    className="text-xs text-coral font-medium hover:text-coral/70 transition-colors">Remove</button>
                                  <button onClick={() => setRemovingMemberId(null)}
                                    className="text-xs text-warmDark/40 hover:text-warmDark/60 transition-colors">Cancel</button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setRemovingMemberId(member.userId)}
                                  className="w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-warmDark/30 hover:text-coral/70 hover:bg-coral/10 transition-all"
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
                      <p className="text-xs text-coral font-sans mt-3 px-1">{memberActionError}</p>
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
                                className="flex-1 py-2.5 rounded-xl text-warmDark/50 hover:bg-white/30 transition-all text-sm font-sans">
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
