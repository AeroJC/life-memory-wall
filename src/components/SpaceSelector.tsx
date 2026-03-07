import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Users, Crown, Shield, X } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../store/useStore'
import { MemorySpace } from '../types'
import ParticleBackground from './ParticleBackground'

const spaceColors = [
  'from-purple-200/60 to-pink-200/60',
  'from-amber-200/60 to-orange-200/60',
  'from-teal-200/60 to-cyan-200/60',
  'from-rose-200/60 to-red-200/60',
  'from-indigo-200/60 to-blue-200/60',
  'from-lime-200/60 to-emerald-200/60',
]

type Modal = 'none' | 'create' | 'members'

export default function SpaceSelector() {
  const { getVisibleSpaces, setActiveSpace, addSpace, logout, currentUser, spaces } = useStore()
  const visibleSpaces = getVisibleSpaces()

  const [modal, setModal] = useState<Modal>('none')
  const [newTitle, setNewTitle] = useState('')
  const [newEmoji, setNewEmoji] = useState('\u2728')
  const [newType, setNewType] = useState<'personal' | 'group'>('personal')
  const [viewingSpaceId, setViewingSpaceId] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!newTitle.trim()) return
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
      description: '',
      memories: [],
    }
    await addSpace(space)
    setNewTitle('')
    setNewEmoji('\u2728')
    setModal('none')
  }

  const viewingSpace = spaces.find((s) => s.id === viewingSpaceId)

  const closeModal = () => {
    setModal('none')
    setViewingSpaceId(null)
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
          <button onClick={logout} className="absolute top-6 right-6 text-warmDark/45 hover:text-warmDark/70 text-sm transition-colors">
            Sign out
          </button>

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
            return (
              <motion.div
                key={space.id}
                initial={{ opacity: 0, scale: 0.5, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1, type: 'spring', stiffness: 100 }}
                className="flex flex-col items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.08, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSpace(space.id)}
                  className="group flex flex-col items-center relative"
                >
                  <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br ${spaceColors[i % spaceColors.length]}
                    flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow duration-500
                    border border-white/50 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="text-4xl md:text-5xl relative z-10">{space.coverEmoji}</span>
                  </div>
                </motion.button>

                <div className="mt-3 text-center">
                  <h3 className="font-serif text-base md:text-lg text-warmDark font-medium">{space.title}</h3>
                  <p className="font-handwriting text-warmDark/70 text-sm">
                    {space.memoryCount} {space.memoryCount === 1 ? 'memory' : 'memories'}
                  </p>
                  {space.type === 'group' && (
                    <button
                      onClick={() => { setViewingSpaceId(space.id); setModal('members') }}
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
                      <div className="flex gap-3 flex-wrap">
                        {['\u2728', '\u2708\uFE0F', '\ud83c\udf93', '\ud83d\ude80', '\ud83c\udfe0', '\ud83c\udf0a', '\ud83c\udf04', '\ud83c\udfb5', '\ud83d\udcda', '\u2764\uFE0F'].map((emoji) => (
                          <button key={emoji} onClick={() => setNewEmoji(emoji)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${newEmoji === emoji ? 'bg-gold/20 ring-2 ring-gold/50 scale-110' : 'bg-white/30 hover:bg-white/50'}`}>
                            {emoji}
                          </button>
                        ))}
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
                      <button onClick={handleCreate} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold/80 to-coral/80 text-white font-medium">Create Space</button>
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
