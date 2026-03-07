import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Users, Send } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../store/useStore'
import { api } from '../api'
import { Memory, SubStory } from '../types'
import MemoryCard from './MemoryCard'
import MemoryDetail from './MemoryDetail'
import CreateMemoryModal from './CreateMemoryModal'
import FloatingNav from './FloatingNav'

export default function Timeline() {
  const { getActiveSpace, setActiveSpace, addMemory, updateMemory, deleteMemory, addReaction, addSubstory, updateSubstory, deleteSubstory, getVisibleMemories, currentUser } =
    useStore()
  const space = getActiveSpace()
  const [showCreate, setShowCreate] = useState(false)
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null)
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null)

  const [showMembers, setShowMembers] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteStatus, setInviteStatus] = useState<{ ok: boolean; msg: string } | null>(null)
  const [inviting, setInviting] = useState(false)


  const { scrollYProgress } = useScroll()
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  if (!space) return null

  const visibleMemories = getVisibleMemories(space)
  const sortedMemories = [...visibleMemories].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const selectedMemory = sortedMemories.find((m) => m.id === selectedMemoryId) || null
  const isDetailOpen = selectedMemory !== null

  const handleSave = (memory: Memory) => {
    if (editingMemory) {
      updateMemory(space.id, memory.id, memory)
    } else {
      addMemory(space.id, memory)
    }
    setEditingMemory(null)
  }

  const handleDelete = (memoryId: string) => {
    deleteMemory(space.id, memoryId)
    if (selectedMemoryId === memoryId) setSelectedMemoryId(null)
  }

  const handleReact = (memoryId: string, emoji: string) => {
    addReaction(space.id, memoryId, emoji)
  }

  const handleEdit = (memory: Memory) => {
    setEditingMemory(memory)
    setShowCreate(true)
  }

  const handleCardClick = (memory: Memory) => {
    setSelectedMemoryId(memory.id === selectedMemoryId ? null : memory.id)
  }

  const handleAddSubstory = (memoryId: string, substory: SubStory) => {
    addSubstory(space.id, memoryId, substory)
  }

  const handleUpdateSubstory = (memoryId: string, substory: SubStory) => {
    updateSubstory(space.id, memoryId, substory.id, substory)
  }

  const handleDeleteSubstory = (memoryId: string, substoryId: string) => {
    deleteSubstory(space.id, memoryId, substoryId)
  }


  const goBack = () => {
    if (isDetailOpen) {
      setSelectedMemoryId(null)
    } else {
      setActiveSpace(null)
    }
  }

  const myRole = space.membersList.find((m) => m.userId === currentUser?.id)?.role
  const canInvite = myRole === 'owner' || myRole === 'admin'

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) return
    setInviting(true)
    setInviteStatus(null)
    try {
      const result = await api.inviteByEmail(space.id, inviteEmail.trim())
      setInviteStatus({ ok: true, msg: result.message })
      setInviteEmail('')
    } catch (err: any) {
      setInviteStatus({ ok: false, msg: err.message || 'Failed to send invite' })
    } finally {
      setInviting(false)
      setTimeout(() => setInviteStatus(null), 4000)
    }
  }

  // Shared members panel content
  const MembersPanel = (
    <>
      <div className="fixed inset-0 z-40" onClick={() => { setShowMembers(false); setInviteStatus(null) }} />
      <div className="absolute right-0 top-9 z-50 glass rounded-2xl p-4 w-72 shadow-lg max-h-[80vh] overflow-y-auto">
        <p className="font-serif text-sm text-warmDark mb-3">Members</p>
        <ul className="space-y-2">
          {space.membersList.filter((m) => m.status === 'active').map((m) => (
            <li key={m.userId} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-lavender/60 to-peach/60 flex items-center justify-center text-xs font-serif text-warmDark flex-shrink-0">
                {m.name[0]}
              </div>
              <span className="font-sans text-sm text-warmDark/80 flex-1">{m.name}{m.userId === currentUser?.id && <span className="text-warmDark/40 ml-1 text-xs">(you)</span>}</span>
              {m.role === 'owner' && <span className="text-xs text-gold">owner</span>}
              {m.role === 'admin' && <span className="text-xs text-teal">admin</span>}
            </li>
          ))}
        </ul>

        {canInvite && (
          <div className="mt-4 pt-4 border-t border-warmMid/10">
            <p className="font-sans text-xs text-warmDark/50 mb-2">Invite by email</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                placeholder="email@example.com"
                className="flex-1 bg-white/40 rounded-xl px-3 py-2 text-sm text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all"
              />
              <button
                onClick={handleInvite}
                disabled={inviting}
                className="p-2 rounded-xl bg-gradient-to-br from-gold/80 to-coral/70 text-white flex-shrink-0 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            {inviteStatus && (
              <p className={`text-xs mt-2 font-sans ${inviteStatus.ok ? 'text-teal' : 'text-coral'}`}>
                {inviteStatus.msg}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  )

  return (
    <div className="min-h-screen gradient-bg relative">

      {/* ── DETAIL MODE: slim sticky header ── */}
      {isDetailOpen && (
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-2" style={{ background: 'linear-gradient(-45deg, #f0e6ff, #ffe8d6, #e8f0ff, #fff0e8)', backgroundSize: '400% 400%' }}>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goBack() }}
            className="glass rounded-xl px-3 py-2 flex items-center gap-1.5 text-warmDark/60 hover:text-warmDark transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-sans text-xs">Timeline</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMembers((v) => !v)}
              className="glass rounded-xl px-3 py-2 flex items-center gap-1.5 text-warmDark/60 hover:text-warmDark transition-colors shadow-sm"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs font-sans">{space.membersList.filter((m) => m.status === 'active').length}</span>
            </button>
            {showMembers && MembersPanel}
          </div>
        </div>
      )}

      {/* ── NORMAL MODE: full sticky header ── */}
      {!isDetailOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-30 px-4 py-4"
          style={{ background: 'linear-gradient(-45deg, #f0e6ff, #ffe8d6, #e8f0ff, #fff0e8)', backgroundSize: '400% 400%' }}
        >
          <div className="glass rounded-2xl px-5 py-3 max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); goBack() }}
              className="flex items-center gap-2 text-warmDark/60 hover:text-warmDark transition-colors cursor-pointer"
              type="button"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-sans text-sm">Spaces</span>
            </button>
            <div className="text-center">
              <h2 className="font-serif text-lg text-warmDark flex items-center gap-2">
                <span>{space.coverEmoji}</span>
                {space.title}
              </h2>
            </div>
            <div className="relative flex items-center gap-1 text-warmDark/50">
              {space.type === 'group' && (
                <button
                  type="button"
                  onClick={() => setShowMembers((v) => !v)}
                  className="flex items-center gap-1 hover:text-warmDark transition-colors cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-xs">{space.membersList.filter((m) => m.status === 'active').length}</span>
                </button>
              )}
              {showMembers && space.type === 'group' && MembersPanel}
            </div>
          </div>
        </motion.div>
      )}

      {/* Space description - only when no detail open */}
      {!isDetailOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center px-4 pt-8 pb-4"
        >
          <p className="font-handwriting text-2xl text-warmDark/55">
            {space.description || 'A collection of precious moments'}
          </p>
          {space.type === 'group' && space.membersList.length > 0 && (
            <p className="font-sans text-sm text-warmDark/45 mt-2">
              with {space.membersList.filter((m) => m.status === 'active').map((m) => m.name).join(', ')}
            </p>
          )}
        </motion.div>
      )}

      {/* Main content */}
      <div className={`max-w-7xl mx-auto px-4 ${isDetailOpen ? 'pt-0 pb-0' : 'pb-40 pt-4'}`}>
        <div className="flex gap-6 relative">

          {/* LEFT: Timeline list */}
          <div className={`relative transition-all duration-500 ${isDetailOpen ? 'w-[12%] min-w-[180px] hidden md:block' : 'w-full'}`}>

            {/* Center path for full view */}
            {!isDetailOpen && (
              <svg
                className="absolute left-1/2 -translate-x-1/2 top-0 w-2 h-full pointer-events-none hidden md:block"
                style={{ overflow: 'visible' }}
              >
                <motion.line
                  x1="1" y1="0" x2="1" y2="100%"
                  stroke="rgba(212, 165, 116, 0.2)"
                  strokeWidth="2" strokeDasharray="8 8"
                  className="timeline-path"
                  style={{ pathLength }}
                />
              </svg>
            )}

            {/* Left path for compact view */}
            {isDetailOpen && (
              <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-gold/20 via-coral/20 to-teal/20" />
            )}

            {/* Mobile left path */}
            {!isDetailOpen && (
              <div className="absolute left-6 md:hidden top-0 bottom-0 w-px">
                <motion.div
                  className="w-full h-full bg-gradient-to-b from-gold/20 via-coral/20 to-teal/20"
                  style={{ scaleY: pathLength, transformOrigin: 'top' }}
                />
              </div>
            )}

            {/* Cards */}
            <div className={isDetailOpen ? 'space-y-3' : 'space-y-12 md:space-y-16'}>
              {sortedMemories.map((memory, i) => {
                const side = i % 2 === 0 ? 'left' : 'right'
                const isSelected = memory.id === selectedMemoryId

                /* ---- COMPACT MODE (detail panel open) ---- */
                if (isDetailOpen) {
                  return (
                    <div key={memory.id} className="relative pl-6">
                      <div
                        className={`absolute left-[4px] top-3 w-2.5 h-2.5 rounded-full z-10 transition-all duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-br from-gold to-coral scale-125'
                            : 'bg-warmMid/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleCardClick(memory)
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-300 ${
                          isSelected
                            ? 'bg-white/50 text-warmDark'
                            : 'text-warmDark/50 hover:text-warmDark/70 hover:bg-white/20'
                        }`}
                      >
                        <h3 className={`font-serif text-sm leading-tight truncate ${
                          isSelected ? 'text-warmDark font-medium' : ''
                        }`}>
                          {memory.title}
                        </h3>
                        <p className="font-handwriting text-xs text-warmDark/40 mt-0.5">
                          {new Date(memory.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </button>
                    </div>
                  )
                }

                /* ---- FULL MODE (no detail panel) ---- */
                return (
                  <div key={memory.id} className="relative">
                    {/* Desktop dot */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-gold to-coral z-10 shadow-md hidden md:block"
                      style={{ top: '2rem' }}
                    >
                      <div className="absolute inset-0 rounded-full animate-ping bg-gold/30" />
                    </motion.div>

                    {/* Mobile dot */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      className="absolute left-[18px] w-4 h-4 rounded-full bg-gradient-to-br from-gold to-coral z-10 shadow-md md:hidden"
                      style={{ top: '1rem' }}
                    />

                    {/* Card wrapper */}
                    <div className={`md:w-[48%] ml-12 md:ml-0 ${
                      side === 'left' ? 'md:mr-auto' : 'md:ml-auto'
                    }`}>
                      <MemoryCard
                        memory={memory}
                        index={i}
                        side={side}
                        onDelete={handleDelete}
                        onReact={handleReact}
                        onEdit={handleEdit}
                        onCardClick={handleCardClick}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Empty state */}
            {sortedMemories.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                <p className="font-handwriting text-3xl text-warmDark/40 mb-4">No memories yet</p>
                <p className="font-sans text-warmDark/35">Tap the glowing orb to create your first memory</p>
              </motion.div>
            )}

            {sortedMemories.length > 0 && !isDetailOpen && (
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center pt-16">
                <p className="font-handwriting text-xl text-warmDark/65">...and the story continues</p>
              </motion.div>
            )}
          </div>

          {/* RIGHT: Detail panel (desktop) — no card, lives on the wall */}
          <AnimatePresence>
            {isDetailOpen && selectedMemory && (
              <motion.div
                key="detail-panel"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="flex-1 hidden md:block sticky top-11 h-[calc(100vh-44px)] overflow-hidden"
              >
                <MemoryDetail
                  memory={selectedMemory}
                  onClose={() => setSelectedMemoryId(null)}
                  onAddSubstory={handleAddSubstory}
                  onUpdateSubstory={handleUpdateSubstory}
                  onDeleteSubstory={handleDeleteSubstory}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile: Full-screen detail overlay */}
          <AnimatePresence>
            {isDetailOpen && selectedMemory && (
              <motion.div
                key="detail-mobile"
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '100%' }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="fixed inset-0 z-40 md:hidden bg-warmWhite"
              >
                <div className="h-full overflow-hidden">
                  <MemoryDetail
                    memory={selectedMemory}
                    onClose={() => setSelectedMemoryId(null)}
                    onAddSubstory={handleAddSubstory}
                    onUpdateSubstory={handleUpdateSubstory}
                    onDeleteSubstory={handleDeleteSubstory}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating nav — hidden in detail view */}
      {!isDetailOpen && (
        <FloatingNav
          onCreateClick={() => { setEditingMemory(null); setShowCreate(true) }}
          onHomeClick={() => setActiveSpace(null)}
        />
      )}

      {/* Create/Edit modal */}
      <CreateMemoryModal
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); setEditingMemory(null) }}
        onSave={handleSave}
        editMemory={editingMemory}
        spaceType={space.type}
        members={space.membersList}
        currentUserId={currentUser?.id}
      />
    </div>
  )
}
