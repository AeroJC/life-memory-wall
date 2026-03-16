import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Users, Check, Copy, Loader2, X, UserMinus, LogOut } from 'lucide-react'
import { SpaceIconRenderer } from './SpaceIcons'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect, useRef, useMemo, Suspense, lazy } from 'react'
import { useStore } from '../store/useStore'
import { api } from '../api'
import { Memory, SubStory } from '../types'
import MemoryCard from './MemoryCard'
import MemoryDetail from './MemoryDetailC'
import FloatingNav from './FloatingNav'

const CreateMemoryModal = lazy(() => import('./CreateMemoryModal'))

export default function Timeline() {
  const { activeSpaceData: space, setActiveSpace, addMemory, updateMemory, deleteMemory, addReaction, addSubstory, updateSubstory, deleteSubstory, getVisibleMemories, currentUser, removeMember, leaveSpace, updateMemberPermission, hasMoreMemories, loadingMore, fetchMoreMemories } =
    useStore()
  const [showCreate, setShowCreate] = useState(false)
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null)
  const [selectedMemoryId, setSelectedMemoryIdRaw] = useState<string | null>(() => {
    const saved = localStorage.getItem('selectedMemoryId')
    const savedSpace = localStorage.getItem('selectedMemorySpaceId')
    // Only restore if it belongs to the current space
    return saved && savedSpace === space?.id ? saved : null
  })

  const skipMemoryPush = useRef(false)

  const setSelectedMemoryId = (id: string | null) => {
    setSelectedMemoryIdRaw(id)
    if (id) {
      localStorage.setItem('selectedMemoryId', id)
      localStorage.setItem('selectedMemorySpaceId', space?.id || '')
      if (!skipMemoryPush.current) {
        window.history.pushState({ view: 'memory', memoryId: id }, '')
      }
    } else {
      localStorage.removeItem('selectedMemoryId')
      localStorage.removeItem('selectedMemorySpaceId')
    }
    skipMemoryPush.current = false
  }

  // Browser back button within timeline (memory → timeline list)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const state = e.state
      if (state?.view === 'memory') {
        skipMemoryPush.current = true
        setSelectedMemoryId(state.memoryId)
      } else if (state?.view === 'timeline') {
        skipMemoryPush.current = true
        setSelectedMemoryId(null)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const [showMembers, setShowMembers] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null)
  const [leaveConfirm, setLeaveConfirm] = useState(false)
  const [leaveLoading, setLeaveLoading] = useState(false)
  const [memberActionError, setMemberActionError] = useState('')
  const [updatingPermissionId, setUpdatingPermissionId] = useState<string | null>(null)


  const { ref: loadMoreRef, inView } = useInView({ threshold: 0 })

  useEffect(() => {
    if (inView && hasMoreMemories && !loadingMore && !selectedMemoryId) {
      fetchMoreMemories()
    }
  }, [inView, hasMoreMemories, loadingMore, selectedMemoryId])


  const visibleMemories = space ? getVisibleMemories(space) : []
  const sortedMemories = useMemo(
    () => [...visibleMemories].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [space?.id, visibleMemories.length, JSON.stringify(visibleMemories.map(m => m.id + m.date + JSON.stringify(m.reactions || {}) + (m.substories?.length ?? 0)))]
  )

  const timelineStats = useMemo(() => {
    if (sortedMemories.length === 0) return null
    const first = new Date(sortedMemories[0].date + 'T00:00:00')
    const last = new Date(sortedMemories[sortedMemories.length - 1].date + 'T00:00:00')
    const msPerYear = 1000 * 60 * 60 * 24 * 365.25
    const diff = last.getTime() - first.getTime()
    const years = diff / msPerYear
    let span: string
    if (sortedMemories.length === 1 || diff < 1000 * 60 * 60 * 24 * 30) {
      span = first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    } else if (years < 1) {
      const months = Math.round(diff / (1000 * 60 * 60 * 24 * 30.5))
      span = `${months} month${months !== 1 ? 's' : ''}`
    } else {
      const y = parseFloat(years.toFixed(1))
      span = `${y} year${y !== 1 ? 's' : ''}`
    }
    return { span, count: sortedMemories.length, firstYear: first.getFullYear() }
  }, [sortedMemories])

  // If restored selectedMemoryId no longer exists in this space, clear it
  useEffect(() => {
    if (selectedMemoryId && sortedMemories.length > 0) {
      const exists = sortedMemories.some((m) => m.id === selectedMemoryId)
      if (!exists) setSelectedMemoryId(null)
    }
  }, [sortedMemories.length])

  // Lazy load substories when a memory is selected
  useEffect(() => {
    if (!selectedMemoryId || !space) return
    const memory = sortedMemories.find((m) => m.id === selectedMemoryId)
    if (!memory || memory.substories !== undefined) return
    api.getSubstories(space.id, selectedMemoryId).then((substories) => {
      useStore.getState().updateMemorySubstories(space.id, selectedMemoryId, substories)
    }).catch((err) => console.error('Failed to load moments:', err))
  }, [selectedMemoryId])

  if (!space) {
    return (
      <div className="min-h-screen gradient-bg flex flex-col items-center justify-center gap-6">
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
          <p className="font-handwriting text-xl text-warmDark/70">Opening your memories...</p>
        </div>
      </div>
    )
  }

  // Use visibleMemories (not memoized sortedMemories) so substory changes are reflected immediately
  const selectedMemory = visibleMemories.find((m) => m.id === selectedMemoryId) || null
  const isDetailOpen = selectedMemory !== null

  const handleSave = async (memory: Memory) => {
    try {
      if (editingMemory) {
        await updateMemory(space.id, memory.id, memory)
      } else {
        await addMemory(space.id, memory)
      }
    } catch (err) {
      console.error('Failed to save memory:', err)
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
      setSelectedMemoryId(null)
      setActiveSpace(null)
    }
  }

  const myMember = space.membersList.find((m) => m.userId === currentUser?.id)
  const myRole = myMember?.role
  const myPermission = (myMember?.role === 'owner' || myMember?.role === 'admin') ? 'edit' : (myMember?.permission ?? 'view')
  const canEdit = myPermission === 'edit'
  const allActiveMembers = space.membersList.filter((m) => m.status === 'active')

  // Members visible for the currently selected memory
  const memoryMembers = selectedMemory
    ? (selectedMemory.visibleTo && selectedMemory.visibleTo.length > 0
        ? allActiveMembers.filter((m) => selectedMemory.visibleTo!.includes(m.userId))
        : allActiveMembers)
    : allActiveMembers

  const handleRemoveMember = async (userId: string) => {
    if (!space) return
    setRemovingMemberId(userId)
    setMemberActionError('')
    try {
      await removeMember(space.id, userId)
    } catch (err: any) {
      setMemberActionError(err.message || 'Failed to remove member')
    } finally {
      setRemovingMemberId(null)
    }
  }

  const handleLeaveSpace = async () => {
    if (!space) return
    setLeaveLoading(true)
    setMemberActionError('')
    try {
      await leaveSpace(space.id)
    } catch (err: any) {
      setMemberActionError(err.message || 'Failed to leave group')
      setLeaveLoading(false)
      setLeaveConfirm(false)
    }
  }

  const handleTogglePermission = async (userId: string, current: 'view' | 'edit') => {
    setUpdatingPermissionId(userId)
    setMemberActionError('')
    try {
      await updateMemberPermission(space.id, userId, current === 'edit' ? 'view' : 'edit')
    } catch (err: any) {
      setMemberActionError(err.message || 'Failed to update permission')
    } finally {
      setUpdatingPermissionId(null)
    }
  }

  const renderMembersList = (members: typeof allActiveMembers, showActions = false) => (
    <ul className="space-y-1.5">
      {members.map((m) => (
        <li key={m.userId} className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-lavender/60 to-peach/60 flex items-center justify-center text-sm font-serif text-warmDark flex-shrink-0">
            {m.name[0]}
          </div>
          <span className="font-sans text-sm text-warmDark/80 flex-1 min-w-0 truncate">
            {m.name}{m.userId === currentUser?.id && <span className="text-warmDark/75 ml-1 text-sm">(you)</span>}
          </span>
          {m.role === 'owner' && <span className="text-xs text-gold flex-shrink-0">owner</span>}
          {/* Permission toggle — only owner sees it, only for non-owner members */}
          {showActions && myRole === 'owner' && m.userId !== currentUser?.id && m.role !== 'owner' && (
            <button
              onClick={() => handleTogglePermission(m.userId, m.permission ?? 'view')}
              disabled={updatingPermissionId === m.userId}
              title={`Switch to ${(m.permission ?? 'view') === 'edit' ? 'view' : 'edit'}`}
              className="flex items-center gap-1.5 flex-shrink-0 disabled:opacity-40"
            >
              <span className={`text-[10px] font-sans transition-colors ${(m.permission ?? 'view') === 'edit' ? 'text-teal' : 'text-warmDark/40'}`}>
                {(m.permission ?? 'view') === 'edit' ? 'edit' : 'view'}
              </span>
              <div className={`relative w-8 h-4 rounded-full transition-colors duration-200 ${(m.permission ?? 'view') === 'edit' ? 'bg-teal/70' : 'bg-warmMid/30'}`}>
                {updatingPermissionId === m.userId ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-2.5 h-2.5 text-white animate-spin" />
                  </div>
                ) : (
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${(m.permission ?? 'view') === 'edit' ? 'translate-x-4' : 'translate-x-0.5'}`} />
                )}
              </div>
            </button>
          )}
          {showActions && myRole === 'owner' && m.userId !== currentUser?.id && m.role !== 'owner' && (
            removingMemberId === m.userId ? (
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => handleRemoveMember(m.userId)} className="text-sm text-coral font-medium">Remove</button>
                <button onClick={() => setRemovingMemberId(null)} className="text-sm text-warmDark/75">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setRemovingMemberId(m.userId)}
                className="w-5 h-5 rounded-full flex items-center justify-center text-warmDark/75 opacity-0 group-hover:opacity-100 hover:text-coral/70 hover:bg-coral/10 transition-all flex-shrink-0"
                title="Remove member">
                <UserMinus className="w-3 h-3" />
              </button>
            )
          )}
        </li>
      ))}
    </ul>
  )

  // Panel for detail mode — just shows who can see this memory as icons
  const MemoryMembersPanel = (
    <>
      <div className="fixed inset-0 z-40" onClick={() => { setShowMembers(false) }} />
      <div className="absolute right-0 top-9 z-50 bg-white/95 backdrop-blur-md border border-warmMid/15 rounded-2xl p-3 shadow-xl w-60">
        <p className="font-sans text-xs text-warmDark/50 mb-2">
          {selectedMemory?.visibleTo && selectedMemory.visibleTo.length > 0 ? 'Visible to' : 'Everyone in the space'}
        </p>
        <ul className="space-y-1">
          {memoryMembers.map((m) => (
            <li key={m.userId} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-lavender/60 to-peach/60 flex items-center justify-center flex-shrink-0">
                <span className="font-serif text-xs text-warmDark">{m.name[0]}</span>
              </div>
              <span className="font-sans text-sm text-warmDark/80">{m.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )

  // Panel for normal mode — shows all space members + invite code + join requests
  const SpaceMembersPanel = (
    <>
      <div className="fixed inset-0 z-40" onClick={() => { setShowMembers(false) }} />
      <div className="absolute right-0 top-9 z-50 bg-white/95 backdrop-blur-md border border-warmMid/15 rounded-2xl w-72 shadow-xl max-h-[80vh] overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Members list */}
          {renderMembersList(allActiveMembers, true)}

          {memberActionError && (
            <p className="text-sm text-coral font-sans">{memberActionError}</p>
          )}

          {/* Invite Code — owner/admin only */}
          {space.inviteCode && (
            <div className="pt-3 border-t border-warmMid/10">
              <p className="font-sans text-xs text-warmDark/50 mb-2">Invite code</p>
              <div className="flex items-center gap-2 bg-white/40 rounded-xl px-3 py-2">
                <span className="font-mono text-sm tracking-[0.15em] text-warmDark font-semibold flex-1 select-all">{space.inviteCode}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(space.inviteCode || '')
                    setCodeCopied(true)
                    setTimeout(() => setCodeCopied(false), 2000)
                  }}
                  className="p-1.5 rounded-lg hover:bg-warmMid/10 transition-colors text-warmDark/50 hover:text-warmDark"
                  title="Copy code"
                >
                  {codeCopied ? <Check className="w-3.5 h-3.5 text-teal" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="font-sans text-[11px] text-warmDark/40 mt-1">Share this code so others can request to join</p>
            </div>
          )}

          {/* Leave group — for non-owners in group spaces */}
          {space.type === 'group' && myRole && myRole !== 'owner' && (
            <div className="pt-3 border-t border-warmMid/10">
              {!leaveConfirm ? (
                <button onClick={() => setLeaveConfirm(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-coral/70 hover:text-coral hover:bg-coral/8 transition-colors text-sm font-sans">
                  <LogOut className="w-3.5 h-3.5" /> Leave group
                </button>
              ) : (
                <div className="text-center space-y-2">
                  <p className="text-sm text-warmDark/70 font-sans">Leave <strong>{space.title}</strong>?</p>
                  <div className="flex gap-2">
                    <button onClick={() => setLeaveConfirm(false)} disabled={leaveLoading}
                      className="flex-1 py-2 rounded-xl text-warmDark/75 hover:bg-white/30 transition-all text-sm font-sans">Cancel</button>
                    <button onClick={handleLeaveSpace} disabled={leaveLoading}
                      className="flex-1 py-2 rounded-xl bg-coral/80 text-white text-sm font-sans disabled:opacity-60 flex items-center justify-center gap-1">
                      {leaveLoading ? <><Loader2 className="w-3 h-3 animate-spin" /> Leaving…</> : 'Leave'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen gradient-bg relative">

      {/* ── DETAIL MODE: slim sticky header ── */}
      {isDetailOpen && (
        <div className="sticky top-0 z-30 rounded-b-3xl flex items-center justify-between px-4 py-2" style={{ background: 'linear-gradient(-45deg, #f0e6ff, #ffe8d6, #e8f0ff, #fff0e8)', backgroundSize: '400% 400%' }}>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goBack() }}
            className="glass rounded-xl px-3 py-2 flex items-center gap-1.5 text-warmDark/70 hover:text-warmDark transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-sans text-sm">Timeline</span>
          </button>

          <div className="flex items-center gap-1.5">
            {space.coverIcon ? (
              <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                <SpaceIconRenderer iconId={space.coverIcon} size="full" />
              </div>
            ) : (
              <span className="text-sm">{space.coverEmoji}</span>
            )}
            <span className="font-serif text-sm text-warmDark">{space.title}</span>
          </div>

          {space.type === 'group' && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMembers((v) => !v)}
              className="glass rounded-xl px-3 py-2 flex items-center gap-1.5 text-warmDark/70 hover:text-warmDark transition-colors shadow-sm"
            >
              <div className="flex -space-x-1">
                {memoryMembers.slice(0, 3).map((m) => (
                  <div key={m.userId} className="w-4 h-4 rounded-full bg-gradient-to-br from-gold/60 to-coral/50 flex items-center justify-center text-white text-[8px] font-bold ring-1 ring-white/60 flex-shrink-0">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>
              <span className="text-sm font-sans">{memoryMembers.length}</span>
            </button>
            {showMembers && MemoryMembersPanel}
          </div>
          )}
        </div>
      )}

      {/* ── NORMAL MODE: full sticky header ── */}
      {!isDetailOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-30 rounded-b-3xl px-4 py-4"
          style={{ background: 'linear-gradient(-45deg, #f0e6ff, #ffe8d6, #e8f0ff, #fff0e8)', backgroundSize: '400% 400%' }}
        >
          <div className="relative max-w-6xl mx-auto flex items-center justify-between">
            <div className="glass rounded-2xl px-5 py-3 flex items-center justify-between w-full">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); goBack() }}
                className="flex items-center gap-2 text-warmDark/70 hover:text-warmDark transition-colors cursor-pointer"
                type="button"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-sans text-sm">Spaces</span>
              </button>
              <div className="text-center flex items-center justify-center gap-2">
                {space.coverIcon ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <SpaceIconRenderer iconId={space.coverIcon} size="full" />
                  </div>
                ) : (
                  <span>{space.coverEmoji}</span>
                )}
                <h2 className="font-serif text-lg text-warmDark">{space.title}</h2>
              </div>
              {space.type === 'group' && (
              <button
                type="button"
                onClick={() => setShowMembers((v) => !v)}
                className="flex items-center gap-1.5 glass rounded-xl px-2.5 py-1.5 hover:shadow-md transition-all cursor-pointer"
              >
                {space.membersList.filter((m) => m.status === 'active').length > 0 ? (
                  <div className="flex -space-x-1.5">
                    {space.membersList.filter((m) => m.status === 'active').slice(0, 3).map((m) => (
                      <div key={m.userId} className="w-5 h-5 rounded-full bg-gradient-to-br from-gold/60 to-coral/50 flex items-center justify-center text-white text-[9px] font-bold ring-1 ring-white/60 flex-shrink-0">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Users className="w-4 h-4 text-warmDark/75" />
                )}
                <span className="text-sm font-sans text-warmDark/70">
                  {space.membersList.filter((m) => m.status === 'active').length}
                </span>
              </button>
              )}
            </div>
            {showMembers && SpaceMembersPanel}
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
          <p className="font-handwriting text-2xl text-warmDark/70">
            {space.description || 'A collection of precious moments'}
          </p>
          {space.type === 'group' && space.membersList.length > 0 && (
            <p className="font-sans text-sm text-warmDark/75 mt-2">
              with {space.membersList.filter((m) => m.status === 'active').map((m) => m.name).join(', ')}
            </p>
          )}

          {/* Timeline stats */}
          {timelineStats && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-6 mt-5"
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-serif text-2xl text-warmDark">{timelineStats.count}</span>
                <span className="font-sans text-xs text-warmDark/50 uppercase tracking-wide">
                  {timelineStats.count === 1 ? 'memory' : 'memories'}
                </span>
              </div>
              <div className="w-px h-8 bg-warmDark/15" />
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-serif text-2xl text-warmDark">{timelineStats.span}</span>
                <span className="font-sans text-xs text-warmDark/50 uppercase tracking-wide">
                  {timelineStats.count === 1 ? 'since ' + timelineStats.firstYear : 'together'}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Main content */}
      <div className={`relative z-0 max-w-7xl mx-auto px-4 ${isDetailOpen ? 'pt-0 pb-0' : 'pb-16 pt-4'}`}>
        <div className="flex gap-6 relative">

          {/* LEFT: Timeline list — collapses when text style panel or edit panel opens */}
          <div className={`relative transition-all duration-500 overflow-hidden ${
            isDetailOpen
              ? 'w-[12%] min-w-[180px] opacity-100 hidden md:block'
              : 'w-full'
          }`}>

            {/* Center path for full view */}
            {!isDetailOpen && (
              <svg
                className="absolute left-1/2 -translate-x-1/2 top-0 w-2 h-full pointer-events-none hidden md:block"
                style={{ overflow: 'visible' }}
              >
                <line
                  x1="1" y1="0" x2="1" y2="100%"
                  stroke="rgba(212, 165, 116, 0.2)"
                  strokeWidth="2" strokeDasharray="8 8"
                />
              </svg>
            )}

            {/* Left path for compact view — hides when text style or edit panel is open */}
            {isDetailOpen && (
              <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-gold/20 via-coral/20 to-teal/20" />
            )}

            {/* Mobile left path */}
            {!isDetailOpen && (
              <div className="absolute left-6 md:hidden top-0 bottom-0 w-px bg-gradient-to-b from-gold/20 via-coral/20 to-teal/20" />
            )}

            {/* Cards */}
            <div className={isDetailOpen ? 'space-y-3' : 'space-y-8 md:space-y-10'}>
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
                            : 'text-warmDark/75 hover:text-warmDark/70 hover:bg-white/20'
                        }`}
                      >
                        <h3 className={`font-serif text-sm leading-tight truncate ${
                          isSelected ? 'text-warmDark font-medium' : ''
                        }`}>
                          {memory.title}
                        </h3>
                        <p className="font-handwriting text-sm text-warmDark/75 mt-0.5">
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
                    />

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
                        spaceType={space.type}
                        members={space.membersList}
                        canEdit={canEdit}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Infinite scroll trigger */}
            {!isDetailOpen && hasMoreMemories && (
              <div ref={loadMoreRef} className="flex justify-center py-8">
                {loadingMore && (
                  <div className="flex items-center gap-2 text-warmDark/50">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-handwriting text-lg">Loading more memories...</span>
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {sortedMemories.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                <p className="font-handwriting text-3xl text-warmDark/75 mb-4">No memories yet</p>
                <p className="font-sans text-warmDark/70">Tap the glowing orb to create your first memory</p>
              </motion.div>
            )}

            {sortedMemories.length > 0 && !isDetailOpen && (
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center pt-16">
                <p className="font-handwriting text-2xl text-warmDark/80">...and the story continues</p>
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

                  canEdit={canEdit}

                  onEditingChange={() => {}}
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
  
                    canEdit={canEdit}
  
                    onEditingChange={() => {}}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating nav — hidden in detail view; create button hidden for view-only members */}
      {!isDetailOpen && (
        <FloatingNav
          onCreateClick={canEdit ? () => { setEditingMemory(null); setShowCreate(true) } : undefined}
          onHomeClick={() => setActiveSpace(null)}
        />
      )}

      {/* Create/Edit modal */}
      <Suspense fallback={null}>
        <CreateMemoryModal
          isOpen={showCreate}
          onClose={() => { setShowCreate(false); setEditingMemory(null) }}
          onSave={handleSave}
          editMemory={editingMemory}
          spaceType={space.type}
          members={space.membersList}
          currentUserId={currentUser?.id}
        />
      </Suspense>
    </div>
  )
}
