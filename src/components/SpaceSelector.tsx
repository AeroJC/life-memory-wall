import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Users, Crown, Shield, X, Pencil, Trash2, Check, Loader2, Mail, Eye, EyeOff, KeyRound } from 'lucide-react'
import { useState } from 'react'
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

type Modal = 'none' | 'create' | 'members' | 'edit-space' | 'change-password'

export default function SpaceSelector() {
  const { getVisibleSpaces, setActiveSpace, addSpace, updateSpace, deleteSpace, logout, currentUser, spaces, loading, pendingInvites, acceptSpaceInvite, rejectSpaceInvite } = useStore()
  const visibleSpaces = getVisibleSpaces()

  const [modal, setModal] = useState<Modal>('none')
  const [newTitle, setNewTitle] = useState('')
  const [newEmoji, setNewEmoji] = useState('✨')
  const [newDescription, setNewDescription] = useState(randomTagline('✨'))
  const [newType, setNewType] = useState<'personal' | 'group'>('personal')
  const [viewingSpaceId, setViewingSpaceId] = useState<string | null>(null)

  // Edit-mode for spaces page
  const [editPageMode, setEditPageMode] = useState(false)
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
    setModal('none'); setEditingSpaceId(null)
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

  const closeModal = () => {
    setModal('none')
    setViewingSpaceId(null)
    setEditingSpaceId(null)
    setDeleteConfirmId(null)
    setOldPassword(''); setNewPassword(''); setConfirmPassword('')
    setPwError(''); setPwSuccess(false)
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

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-12 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="absolute top-6 right-6 flex items-center gap-3">
            {/* Pending invites bell */}
            {pendingInvites.length > 0 && (
              <button
                onClick={() => setShowInvites((v) => !v)}
                className="relative text-warmDark/45 hover:text-warmDark/70 transition-colors"
                title="Space invites"
              >
                <Mail className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                  {pendingInvites.length}
                </span>
              </button>
            )}
            {visibleSpaces.length > 0 && (
              <button
                onClick={() => { setEditPageMode((v) => !v); setDeleteConfirmId(null) }}
                className={`text-sm font-sans transition-colors ${editPageMode ? 'text-coral/70 font-medium' : 'text-warmDark/45 hover:text-warmDark/70'}`}
              >
                {editPageMode ? 'Done' : 'Edit'}
              </button>
            )}
            <button
              onClick={() => setModal('change-password')}
              className="text-warmDark/45 hover:text-warmDark/70 transition-colors"
              title="Change password"
            >
              <KeyRound className="w-4 h-4" />
            </button>
            <button onClick={logout} className="text-warmDark/45 hover:text-warmDark/70 text-sm transition-colors">
              Sign out
            </button>
          </div>

          {/* Pending invites panel */}
          <AnimatePresence>
            {showInvites && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-16 right-6 z-20 bg-white/95 backdrop-blur-md border border-warmMid/15 rounded-2xl shadow-xl w-80 overflow-hidden"
              >
                <div className="px-4 pt-4 pb-2 border-b border-warmMid/10 flex items-center justify-between">
                  <p className="font-serif text-base text-warmDark">Space invitations</p>
                  <button onClick={() => setShowInvites(false)} className="text-warmDark/40 hover:text-warmDark/70">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-warmMid/8 max-h-80 overflow-y-auto">
                  {pendingInvites.map((inv) => (
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
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {currentUser && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="font-handwriting text-lg text-warmDark/70 mb-4">
              Hello, {currentUser.name}
            </motion.p>
          )}

          <h1 className="font-serif text-3xl md:text-5xl text-warmDark mb-4">Where do you want to go today?</h1>
          <p className="font-handwriting text-xl md:text-2xl text-warmDark/60">Choose a memory space to explore</p>
        </motion.div>

        {/* Space bubbles */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-10 max-w-5xl mb-12">
          {visibleSpaces.map((space, i) => {
            const isOwner = space.createdBy === currentUser?.id
            const myRole = space.membersList.find((m) => m.userId === currentUser?.id)?.role
            const isDelConfirm = deleteConfirmId === space.id
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
                    <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br ${spaceColors[i % spaceColors.length]}
                      flex items-center justify-center shadow-lg transition-shadow duration-500
                      border border-white/50 relative overflow-hidden ${!editPageMode ? 'group-hover:shadow-2xl' : ''}`}>
                      <div className={`absolute inset-0 bg-white/20 transition-opacity duration-500 ${!editPageMode ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`} />
                      <span className="text-4xl md:text-5xl relative z-10">{space.coverEmoji}</span>
                    </div>
                  </motion.button>

                  {/* Edit mode overlays */}
                  {editPageMode && isOwner && (
                    <>
                      <button
                        onClick={() => openEditSpace(space)}
                        className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-warmDark/60 hover:text-warmDark transition-colors z-10 border border-warmMid/10"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {!isDelConfirm ? (
                        <button
                          onClick={() => setDeleteConfirmId(space.id)}
                          className="absolute -top-1 -left-1 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-coral/60 hover:text-coral transition-colors z-10 border border-warmMid/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 z-20 whitespace-nowrap border border-warmMid/10">
                          <span className="text-xs text-warmDark/60 font-sans">Delete?</span>
                          <button onClick={() => handleDeleteSpace(space.id)} className="text-xs text-coral font-medium hover:text-coral/70">Yes</button>
                          <button onClick={() => setDeleteConfirmId(null)} className="text-xs text-warmDark/40 hover:text-warmDark/60">No</button>
                        </div>
                      )}
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
                      <p className="font-handwriting text-warmDark/70 text-sm">
                        {visibleCount} {visibleCount === 1 ? 'memory' : 'memories'}
                      </p>
                    )
                  })()}
                  {space.type === 'group' && (
                    <button
                      onClick={() => { if (!editPageMode) { setViewingSpaceId(space.id); setModal('members') } }}
                      className="flex items-center gap-1 mx-auto mt-1 text-xs text-warmDark/65 hover:text-warmDark/80 transition-colors"
                    >
                      <Users className="w-3 h-3" />
                      <span>{space.membersList.filter((m) => m.status === 'active').length} members</span>
                      {isOwner && <Crown className="w-3 h-3 text-gold/60" />}
                    </button>
                  )}
                  {space.type === 'group' && myRole && myRole !== 'owner' && (
                    <p className="text-xs text-warmDark/35 mt-0.5">{myRole === 'admin' ? 'Admin' : 'Member'}</p>
                  )}
                </div>
              </motion.div>
            )
          })}

          {/* Create new */}
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: visibleSpaces.length * 0.1 }}
            whileHover={{ scale: 1.08, y: -8 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModal('create')}
            className="group flex flex-col items-center"
          >
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-2 border-dashed border-warmMid/25 flex items-center justify-center group-hover:border-gold/50 transition-colors duration-500">
              <Plus className="w-8 h-8 text-warmDark/35 group-hover:text-gold/60 transition-colors" />
            </div>
            <p className="mt-3 font-handwriting text-base text-warmDark/45 group-hover:text-warmDark/70 transition-colors">New Space</p>
          </motion.button>
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
                        <p className="text-xs text-warmDark/40 mt-2 font-sans">A unique invite code will be generated. Members must be approved by you or an admin.</p>
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
              {modal === 'members' && viewingSpace && (
                <>
                  <div className="mb-6">
                    <h2 className="font-serif text-2xl text-warmDark flex items-center gap-2">
                      <span>{viewingSpace.coverEmoji}</span> {viewingSpace.title}
                    </h2>
                    <p className="font-handwriting text-warmDark/50 mt-1">
                      {viewingSpace.membersList.filter((m) => m.status === 'active').length} members
                    </p>
                  </div>

                  {/* Members list */}
                  <div className="space-y-2">
                    {viewingSpace.membersList
                      .filter((m) => m.status === 'active')
                      .sort((a, b) => ({ owner: 0, admin: 1, member: 2 }[a.role] - { owner: 0, admin: 1, member: 2 }[b.role]))
                      .map((member) => (
                        <div key={member.userId} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/20 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lavender/60 to-peach/60 flex items-center justify-center">
                              <span className="font-serif text-sm text-warmDark">{member.name[0]}</span>
                            </div>
                            <div>
                              <p className="font-sans text-sm text-warmDark">
                                {member.name}
                                {member.userId === currentUser?.id && <span className="text-warmDark/40 ml-1">(you)</span>}
                              </p>
                              <p className="text-xs text-warmDark/40">Joined {new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                            </div>
                          </div>
                          {member.role === 'owner' && <span className="flex items-center gap-1 text-xs text-gold bg-gold/10 px-2 py-1 rounded-full"><Crown className="w-3 h-3" /> Owner</span>}
                          {member.role === 'admin' && <span className="flex items-center gap-1 text-xs text-teal bg-teal/10 px-2 py-1 rounded-full"><Shield className="w-3 h-3" /> Admin</span>}
                          {member.role === 'member' && <span className="text-xs text-warmDark/35">Member</span>}
                        </div>
                      ))}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
