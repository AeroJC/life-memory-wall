import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Plus, Image, BookOpen, Camera, Images, Upload, Loader2, X, ChevronLeft, ChevronRight, Pencil, Trash2, MoreHorizontal, Check } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import { Memory, SubStory } from '../types'
import { sanitizeHtml } from '../utils/sanitize'
import { uploadMultipleImages } from '../cloudinary'
import RichTextEditor from './RichTextEditor'

interface Props {
  memory: Memory
  onClose: () => void
  onAddSubstory: (memoryId: string, substory: SubStory) => void
  onUpdateSubstory: (memoryId: string, substory: SubStory) => void
  onDeleteSubstory: (memoryId: string, substoryId: string) => void
  canEdit?: boolean
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

const formatDateFull = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

// Dynamically scale font size for text beside a photo — shorter text → bigger font
function captionFontClass(html: string): string {
  const len = (html || '').replace(/<[^>]*>/g, '').trim().length
  if (len === 0) return 'text-sm'
  if (len < 30)  return 'text-2xl leading-snug font-serif'
  if (len < 60)  return 'text-xl leading-snug'
  if (len < 110) return 'text-base leading-relaxed'
  if (len < 200) return 'text-sm leading-relaxed'
  return 'text-sm leading-relaxed'
}

const storyGradients = [
  'from-lavender/40 to-purple-100/30',
  'from-peach/40 to-amber-100/30',
  'from-teal/20 to-cyan-100/25',
  'from-rose-100/40 to-pink-50/30',
  'from-amber-50/50 to-gold/15',
  'from-indigo-50/30 to-lavender/30',
]

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').trim()

// Layout picker items used in both add and edit forms
const layoutItems = [
  { type: 'text' as const, preview: <div className="flex flex-col gap-0.5 w-full px-0.5"><div className="h-1 bg-warmDark/25 rounded-full"/><div className="h-1 bg-warmDark/15 rounded-full w-4/5"/><div className="h-1 bg-warmDark/15 rounded-full"/></div> },
  { type: 'img-left' as const, preview: <div className="flex gap-0.5 w-full px-0.5"><div className="w-1/2 h-5 bg-gold/30 rounded"/><div className="flex-1 flex flex-col gap-0.5 justify-center"><div className="h-1 bg-warmDark/20 rounded-full"/><div className="h-1 bg-warmDark/12 rounded-full w-4/5"/></div></div> },
  { type: 'img-right' as const, preview: <div className="flex gap-0.5 w-full px-0.5"><div className="flex-1 flex flex-col gap-0.5 justify-center"><div className="h-1 bg-warmDark/20 rounded-full"/><div className="h-1 bg-warmDark/12 rounded-full w-4/5"/></div><div className="w-1/2 h-5 bg-coral/30 rounded"/></div> },
  { type: 'img-top' as const, preview: <div className="flex flex-col gap-0.5 w-full px-0.5"><div className="h-3.5 bg-lavender/50 rounded w-full"/><div className="h-1 bg-warmDark/20 rounded-full"/><div className="h-1 bg-warmDark/12 rounded-full w-4/5"/></div> },
  { type: 'img-bottom' as const, preview: <div className="flex flex-col gap-0.5 w-full px-0.5"><div className="h-1 bg-warmDark/20 rounded-full"/><div className="h-1 bg-warmDark/12 rounded-full w-4/5"/><div className="h-3.5 bg-teal/30 rounded w-full"/></div> },
  { type: 'photos' as const, preview: <div className="grid grid-cols-2 gap-0.5 w-full px-0.5"><div className="h-2.5 bg-gold/25 rounded"/><div className="h-2.5 bg-coral/25 rounded"/><div className="h-2.5 bg-lavender/35 rounded"/><div className="h-2.5 bg-teal/25 rounded"/></div> },
]

// Add-form layout items with labels (larger previews)
const addFormLayoutItems = [
  {
    type: 'text' as const, label: 'Story',
    preview: <div className="flex flex-col gap-1 w-full px-1"><div className="h-1.5 bg-warmDark/25 rounded-full w-full" /><div className="h-1.5 bg-warmDark/15 rounded-full w-4/5" /><div className="h-1.5 bg-warmDark/15 rounded-full w-full" /><div className="h-1.5 bg-warmDark/15 rounded-full w-3/5" /></div>,
  },
  {
    type: 'img-left' as const, label: 'Photo left',
    preview: <div className="flex gap-1 w-full px-1"><div className="w-1/2 h-10 bg-gold/30 rounded" /><div className="flex-1 flex flex-col gap-1 justify-center"><div className="h-1.5 bg-warmDark/20 rounded-full w-full" /><div className="h-1.5 bg-warmDark/12 rounded-full w-4/5" /><div className="h-1.5 bg-warmDark/12 rounded-full w-full" /></div></div>,
  },
  {
    type: 'img-right' as const, label: 'Photo right',
    preview: <div className="flex gap-1 w-full px-1"><div className="flex-1 flex flex-col gap-1 justify-center"><div className="h-1.5 bg-warmDark/20 rounded-full w-full" /><div className="h-1.5 bg-warmDark/12 rounded-full w-4/5" /><div className="h-1.5 bg-warmDark/12 rounded-full w-full" /></div><div className="w-1/2 h-10 bg-coral/30 rounded" /></div>,
  },
  {
    type: 'img-top' as const, label: 'Photo top',
    preview: <div className="flex flex-col gap-1 w-full px-1"><div className="h-7 bg-lavender/50 rounded w-full" /><div className="h-1.5 bg-warmDark/20 rounded-full w-full" /><div className="h-1.5 bg-warmDark/12 rounded-full w-4/5" /></div>,
  },
  {
    type: 'img-bottom' as const, label: 'Photo below',
    preview: <div className="flex flex-col gap-1 w-full px-1"><div className="h-1.5 bg-warmDark/20 rounded-full w-full" /><div className="h-1.5 bg-warmDark/12 rounded-full w-4/5" /><div className="h-7 bg-teal/30 rounded w-full" /></div>,
  },
  {
    type: 'photos' as const, label: 'Photo grid',
    preview: <div className="grid grid-cols-2 gap-1 w-full px-1"><div className="h-5 bg-gold/25 rounded" /><div className="h-5 bg-coral/25 rounded" /><div className="h-5 bg-lavender/35 rounded" /><div className="h-5 bg-teal/25 rounded" /></div>,
  },
]

export default function MemoryDetailA({ memory, onClose, onAddSubstory, onUpdateSubstory, onDeleteSubstory, canEdit = true }: Props) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'photos'>('timeline')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newType, setNewType] = useState<SubStory['type']>('text')
  const [newPhotos, setNewPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)
  const addFormRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Per-card editing state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editType, setEditType] = useState<SubStory['type']>('text')
  const [editPhotos, setEditPhotos] = useState<string[]>([])

  // Three-dot menu state
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  // Delete confirmation state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const handlePhotoFiles = async (files: File[], setter: React.Dispatch<React.SetStateAction<string[]>>, inputRef: React.RefObject<HTMLInputElement>) => {
    if (!files.length) return
    setUploading(true)
    try {
      const urls = await uploadMultipleImages(files)
      setter((prev) => [...prev, ...urls])
    } catch { alert('Upload failed') }
    finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const substoriesLoaded = memory.substories !== undefined
  const substories = memory.substories || []

  const groupedByDate: Record<string, SubStory[]> = {}
  substories.forEach((s) => {
    if (!groupedByDate[s.date]) groupedByDate[s.date] = []
    groupedByDate[s.date].push(s)
  })
  const sortedDates = Object.keys(groupedByDate).sort()

  const resetAddForm = () => {
    setNewTitle(''); setNewContent(''); setNewPhotos([])
    setNewType('text'); setShowAddForm(false)
  }

  const handleAddSubstory = () => {
    if (!newTitle.trim() && !stripHtml(newContent)) return
    const substory: SubStory = {
      id: `sub-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: newType,
      title: newTitle.trim() || undefined,
      content: newType === 'text' ? newContent : undefined,
      caption: newType !== 'text' ? newContent : undefined,
      photos: newType !== 'text' ? newPhotos : undefined,
    }
    onAddSubstory(memory.id, substory)
    resetAddForm()
  }

  const startEditInPlace = (sub: SubStory) => {
    setEditingId(sub.id)
    setEditTitle(sub.title || '')
    setEditContent(sub.content || sub.caption || '')
    setEditType(sub.type)
    setEditPhotos(sub.photos || [])
    setMenuOpenId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle(''); setEditContent(''); setEditPhotos([])
    setEditType('text')
  }

  const saveEdit = () => {
    if (!editingId) return
    if (!editTitle.trim() && !stripHtml(editContent)) return
    const original = substories.find((s) => s.id === editingId)
    const substory: SubStory = {
      id: editingId,
      date: original?.date || new Date().toISOString().split('T')[0],
      type: editType,
      title: editTitle.trim() || undefined,
      content: editType === 'text' ? editContent : undefined,
      caption: editType !== 'text' ? editContent : undefined,
      photos: editType !== 'text' ? editPhotos : undefined,
    }
    onUpdateSubstory(memory.id, substory)
    cancelEdit()
  }

  const handleDelete = (substoryId: string) => {
    onDeleteSubstory(memory.id, substoryId)
    setConfirmDeleteId(null)
    setMenuOpenId(null)
  }

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpenId) return
    const handler = (e: MouseEvent) => {
      setMenuOpenId(null)
      setConfirmDeleteId(null)
    }
    // Delay to avoid closing on the same click that opened it
    const timer = setTimeout(() => {
      window.addEventListener('click', handler)
    }, 0)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('click', handler)
    }
  }, [menuOpenId])

  const coverGroup = memory.photos?.length
    ? [{ title: memory.title, caption: 'Cover photos', date: memory.date, photos: memory.photos }]
    : []
  const allPhotos = [
    ...coverGroup,
    ...substories
      .filter((s) => s.type !== 'text')
      .map((s) => ({ title: s.title || '', caption: s.caption || '', date: s.date, photos: s.photos || [] })),
  ]

  const gridItems = allPhotos.flatMap((photo, i) =>
    photo.photos.length > 0
      ? photo.photos.map((url, j) => ({ url, title: photo.title, caption: photo.caption, key: `${i}-${j}` }))
      : [{ url: null as string | null, title: photo.title, caption: photo.caption, key: `${i}-0` }]
  )
  const lightboxPhotos = gridItems.filter((item) => item.url !== null).map((item) => item.url as string)

  const coverPhoto = memory.photos && memory.photos.length > 0 ? memory.photos[0] : null
  const coverRef = useRef<HTMLDivElement>(null)
  const [coverGone, setCoverGone] = useState(!coverPhoto)

  useEffect(() => {
    if (!coverPhoto || !coverRef.current) return
    const obs = new IntersectionObserver(
      ([entry]) => setCoverGone(!entry.isIntersecting),
      { threshold: 0.05 }
    )
    obs.observe(coverRef.current)
    return () => obs.disconnect()
  }, [coverPhoto])

  useEffect(() => {
    if (lightboxIdx === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setLightboxIdx((i) => i !== null ? Math.min(i + 1, lightboxPhotos.length - 1) : null)
      if (e.key === 'ArrowLeft') setLightboxIdx((i) => i !== null ? Math.max(i - 1, 0) : null)
      if (e.key === 'Escape') setLightboxIdx(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIdx, lightboxPhotos.length])

  // Helper: open a photo in lightbox by URL
  const openLightbox = (url: string) => {
    const idx = lightboxPhotos.indexOf(url)
    if (idx >= 0) setLightboxIdx(idx)
  }

  // FAB click: scroll to bottom and open add form
  const handleFabClick = () => {
    setShowAddForm(true)
    setTimeout(() => {
      addFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, 100)
  }

  // ─── Render helpers for substory cards ───────────────────────────

  const renderSubstoryView = (sub: SubStory, idx: number) => {
    switch (sub.type) {
      case 'text':
        return (
          <div className="relative">
            {sub.title && (
              <h4 className="font-serif text-lg font-bold text-warmDark mb-2">{sub.title}</h4>
            )}
            {sub.content && (
              <div className="font-sans text-warmDark/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(sub.content || '') }} />
            )}
          </div>
        )

      case 'img-left':
      case 'photo':
        return (
          <div>
            {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3">{sub.title}</h4>}
            <div className="flex gap-3 items-center">
              <div className="w-1/2 flex-shrink-0 aspect-[4/3] rounded-xl overflow-hidden bg-black/5">
                {sub.photos && sub.photos.length > 0 ? (
                  <img
                    src={sub.photos[0]} alt=""
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => openLightbox(sub.photos![0])}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${storyGradients[idx % storyGradients.length]} flex items-center justify-center border border-white/40`}>
                    <Image className="w-8 h-8 text-warmDark/75" />
                  </div>
                )}
              </div>
              {sub.caption && (
                <div className={`font-sans text-warmDark/90 flex-1 ${captionFontClass(sub.caption)}`} dangerouslySetInnerHTML={{ __html: sanitizeHtml(sub.caption || '') }} />
              )}
            </div>
          </div>
        )

      case 'img-right':
        return (
          <div>
            {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3">{sub.title}</h4>}
            <div className="flex gap-3 items-center">
              {sub.caption && (
                <div className={`font-sans text-warmDark/90 flex-1 ${captionFontClass(sub.caption)}`} dangerouslySetInnerHTML={{ __html: sanitizeHtml(sub.caption || '') }} />
              )}
              <div className="w-1/2 flex-shrink-0 aspect-[4/3] rounded-xl overflow-hidden bg-black/5">
                {sub.photos && sub.photos.length > 0 ? (
                  <img
                    src={sub.photos[0]} alt=""
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => openLightbox(sub.photos![0])}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${storyGradients[idx % storyGradients.length]} flex items-center justify-center border border-white/40`}>
                    <Image className="w-8 h-8 text-warmDark/75" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 'img-top':
        return (
          <div>
            {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3">{sub.title}</h4>}
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/5 mb-3">
              {sub.photos && sub.photos.length > 0 ? (
                <img
                  src={sub.photos[0]} alt=""
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => openLightbox(sub.photos![0])}
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${storyGradients[idx % storyGradients.length]} flex items-center justify-center border border-white/40`}>
                  <Image className="w-10 h-10 text-warmDark/75" />
                </div>
              )}
            </div>
            {sub.caption && <div className="font-sans text-sm text-warmDark/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(sub.caption || '') }} />}
          </div>
        )

      case 'img-bottom':
        return (
          <div>
            {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3">{sub.title}</h4>}
            {sub.caption && <div className="font-sans text-sm text-warmDark/75 leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: sanitizeHtml(sub.caption || '') }} />}
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/5">
              {sub.photos && sub.photos.length > 0 ? (
                <img
                  src={sub.photos[0]} alt=""
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => openLightbox(sub.photos![0])}
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${storyGradients[idx % storyGradients.length]} flex items-center justify-center border border-white/40`}>
                  <Image className="w-10 h-10 text-warmDark/75" />
                </div>
              )}
            </div>
          </div>
        )

      case 'photos':
        return (
          <div>
            {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3">{sub.title}</h4>}
            {sub.photos && sub.photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {sub.photos.map((url, n) => (
                  <div key={n} className="aspect-square rounded-xl overflow-hidden bg-black/5">
                    <img
                      src={url} alt=""
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => openLightbox(url)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((n) => (
                  <div key={n} className={`aspect-square rounded-xl bg-gradient-to-br ${storyGradients[(idx + n) % storyGradients.length]} flex items-center justify-center border border-white/40`}>
                    <Image className="w-6 h-6 text-warmDark/75" />
                  </div>
                ))}
              </div>
            )}
            {sub.caption && <div className="font-sans text-sm text-warmDark/90 italic mt-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(sub.caption || '') }} />}
          </div>
        )

      default:
        return null
    }
  }

  // ─── In-place edit form for a substory card ──────────────────────

  const renderEditForm = () => (
    <div>
      {/* Compact layout picker */}
      <div className="mb-3">
        <p className="font-handwriting text-warmDark/75 text-sm mb-1.5">Layout</p>
        <div className="grid grid-cols-6 gap-1.5">
          {layoutItems.map(({ type, preview }) => (
            <button
              key={type}
              onClick={() => setEditType(type)}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all ${editType === type ? 'border-gold/50 bg-gold/10 ring-1 ring-gold/25' : 'border-warmMid/10 hover:border-warmMid/20 hover:bg-white/20'}`}
            >
              <div className="w-full h-7 flex items-center justify-center">{preview}</div>
            </button>
          ))}
        </div>
      </div>

      <input
        type="text"
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        placeholder="Title..."
        className="w-full font-serif text-base text-warmDark bg-transparent border-b border-warmMid/10 pb-2 mb-3 outline-none focus:border-gold/40 transition-colors placeholder:text-warmDark/70"
      />
      <RichTextEditor
        value={editContent}
        onChange={setEditContent}
        placeholder={editType === 'text' ? 'Write your story...' : 'Caption...'}
        className="mb-3"
      />
      {editType !== 'text' && (
        <div className="mb-3">
          <input ref={editFileInputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => handlePhotoFiles(Array.from(e.target.files || []), setEditPhotos, editFileInputRef)} />
          {editPhotos.length > 0 && (
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {editPhotos.map((url, pi) => (
                <div key={pi} className="relative group aspect-square rounded-lg overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setEditPhotos((p) => p.filter((_, idx) => idx !== pi))}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {uploading
            ? <div className="flex items-center justify-center gap-2 text-warmDark/75 py-2"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Uploading...</span></div>
            : <div className="grid grid-cols-2 gap-1.5">
                <button type="button" onClick={() => editFileInputRef.current?.click()}
                  className="border border-dashed border-warmMid/15 rounded-xl p-2.5 flex items-center justify-center gap-1.5 hover:border-gold/25 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-warmDark/70" /><span className="text-sm text-warmDark/70">From Device</span>
                </button>
                <button type="button" onClick={() => editFileInputRef.current?.click()}
                  className="border border-dashed border-warmMid/15 rounded-xl p-2.5 flex items-center justify-center gap-1.5 hover:border-gold/25 transition-colors">
                  <Images className="w-3.5 h-3.5 text-warmDark/70" /><span className="text-sm text-warmDark/70">Google Photos</span>
                </button>
              </div>
          }
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={cancelEdit} className="flex-1 py-2 rounded-xl text-sm text-warmDark/75 hover:bg-white/20 transition-all">Cancel</button>
        <button onClick={saveEdit} className="flex-1 py-2 rounded-xl text-sm bg-gradient-to-r from-gold/80 to-coral/70 text-white font-medium">Save changes</button>
      </div>
    </div>
  )

  // ─── Three-dot menu popover ──────────────────────────────────────

  const renderMenu = (sub: SubStory) => (
    <div className="absolute top-1 right-1 z-20">
      <button
        onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === sub.id ? null : sub.id); setConfirmDeleteId(null) }}
        className="w-7 h-7 rounded-full bg-white/60 hover:bg-white/90 backdrop-blur-sm flex items-center justify-center text-warmDark/50 hover:text-warmDark/80 transition-all shadow-sm"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {menuOpenId === sub.id && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute top-9 right-0 bg-white rounded-xl shadow-lg border border-warmMid/10 overflow-hidden min-w-[120px] z-30"
            onClick={(e) => e.stopPropagation()}
          >
            {confirmDeleteId === sub.id ? (
              <div className="p-3">
                <p className="text-sm text-warmDark/80 mb-2">Delete this moment?</p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="flex-1 py-1.5 text-xs rounded-lg text-warmDark/60 hover:bg-warmMid/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(sub.id)}
                    className="flex-1 py-1.5 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => startEditInPlace(sub)}
                  className="w-full px-4 py-2.5 text-left text-sm text-warmDark/80 hover:bg-warmMid/5 transition-colors flex items-center gap-2"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <div className="h-px bg-warmMid/8" />
                <button
                  onClick={() => setConfirmDeleteId(sub.id)}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <div ref={containerRef} className="h-full overflow-y-auto relative">
      {/* Cover photo — scrolls away naturally */}
      {coverPhoto && (
        <div ref={coverRef} className="relative flex-shrink-0 h-56 overflow-hidden">
          <img src={coverPhoto} alt={memory.title} className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
          {/* Info + tabs overlaid at the bottom of cover */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
            <div className="flex items-end justify-between gap-2 mb-1">
              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-base text-white leading-snug">{memory.title}</h2>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="font-handwriting text-sm text-white/75">
                    {formatDateFull(memory.date)}
                    {memory.endDate && ` — ${formatDateFull(memory.endDate)}`}
                  </span>
                  {memory.location && (
                    <span className="flex items-center gap-1 text-white/75 text-sm">
                      <MapPin className="w-3 h-3" />
                      {memory.location}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setActiveTab('timeline')}
                  title="Stories"
                  className={`p-1.5 rounded-lg transition-all ${activeTab === 'timeline' ? 'bg-white/25 text-white' : 'text-white/70 hover:text-white'}`}
                >
                  <BookOpen className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('photos')}
                  title="Photos"
                  className={`p-1.5 rounded-lg transition-all ${activeTab === 'photos' ? 'bg-white/25 text-white' : 'text-white/70 hover:text-white'}`}
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>
            {memory.story && (
              <p className="font-sans text-sm text-white/65 leading-relaxed line-clamp-2">{memory.story}</p>
            )}
          </div>
        </div>
      )}

      {/* Sticky compact header — slides in after cover scrolls away */}
      <AnimatePresence>
        {coverGone && (
          <motion.div
            initial={{ y: -56, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -56, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className={`sticky top-0 z-10 rounded-b-3xl border-b border-warmMid/10 px-5 pb-2.5 ${!coverPhoto ? 'pt-4' : 'pt-3'}`}
            style={{ background: 'linear-gradient(-45deg, #f0e6ff, #ffe8d6, #e8f0ff, #fff0e8)', backgroundSize: '400% 400%' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-base text-warmDark leading-snug">{memory.title}</h2>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="font-handwriting text-sm text-warmDark/70">
                    {formatDateFull(memory.date)}
                    {memory.endDate && ` — ${formatDateFull(memory.endDate)}`}
                  </span>
                  {memory.location && (
                    <span className="flex items-center gap-1 text-warmDark/75 text-sm">
                      <MapPin className="w-3 h-3" />
                      {memory.location}
                    </span>
                  )}
                </div>
                {memory.story && (
                  <p className="font-sans text-sm text-warmDark/75 leading-relaxed mt-1 line-clamp-2">
                    {memory.story}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                <button
                  onClick={() => setActiveTab('timeline')}
                  title="Stories"
                  className={`p-1.5 rounded-lg transition-all ${activeTab === 'timeline' ? 'bg-gold/20 text-warmDark' : 'text-warmDark/70 hover:text-warmDark/70'}`}
                >
                  <BookOpen className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('photos')}
                  title="Photos"
                  className={`p-1.5 rounded-lg transition-all ${activeTab === 'photos' ? 'bg-gold/20 text-warmDark' : 'text-warmDark/70 hover:text-warmDark/70'}`}
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stories content */}
      <div className="px-5 py-4">
        <AnimatePresence mode="wait">
          {activeTab === 'timeline' ? (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {!substoriesLoaded ? (
                <div className="py-12 flex flex-col items-center gap-3">
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 rounded-full border-2 border-gold/20 border-t-gold animate-spin" style={{ animationDuration: '1.2s' }} />
                    <div className="absolute inset-[4px] rounded-full border border-coral/20 border-t-coral/60 animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }} />
                  </div>
                  <p className="font-handwriting text-lg text-warmDark/75">loading stories...</p>
                </div>
              ) : substories.length === 0 ? (
                <div className="py-16">
                  <p className="font-handwriting text-3xl text-warmDark/70 mb-2">No stories yet</p>
                  <p className="font-sans text-sm text-warmDark/70">Add moments from this memory</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Flowing timeline line */}
                  <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-gold/25 via-coral/15 to-teal/15" />

                  <div className="space-y-3">
                    {sortedDates.map((date, dateIdx) => (
                      <div key={date}>
                        {/* Date marker */}
                        <div className="flex items-center gap-4 mb-5 relative">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/50 to-coral/50 flex items-center justify-center z-10">
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          </div>
                          <span className="font-handwriting text-xl text-warmDark/75">
                            {formatDate(date)}
                          </span>
                        </div>

                        {/* Substories */}
                        <div className="space-y-5 ml-4 pl-8">
                          {groupedByDate[date].map((sub, idx) => (
                            <motion.div
                              key={sub.id}
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: (dateIdx * 0.1) + (idx * 0.06), layout: { duration: 0.3 } }}
                              className={`relative ${editingId === sub.id ? 'bg-white/50 ring-1 ring-gold/20 rounded-2xl p-4' : ''}`}
                            >
                              {/* Three-dot menu — visible when canEdit and not currently editing this card */}
                              {canEdit && editingId !== sub.id && renderMenu(sub)}

                              {/* Card content: view or edit */}
                              <AnimatePresence mode="wait">
                                {editingId === sub.id ? (
                                  <motion.div
                                    key="edit"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {renderEditForm()}
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="view"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {renderSubstoryView(sub, idx)}
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Separator between stories */}
                              {editingId !== sub.id && <div className="h-px bg-warmMid/5 mt-5" />}
                            </motion.div>
                          ))}
                        </div>

                        <div className="h-6" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add moment form (inline at bottom) */}
              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    ref={addFormRef}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-white/30 rounded-2xl p-6 border border-white/40 mt-8"
                  >
                    <h4 className="font-serif text-xl text-warmDark mb-5">Add a moment</h4>

                    {/* Layout template picker */}
                    <div className="mb-5">
                      <p className="font-handwriting text-warmDark/70 text-base mb-2">Choose a layout</p>
                      <div className="grid grid-cols-3 gap-2">
                        {addFormLayoutItems.map(({ type, label, preview }) => (
                          <button
                            key={type}
                            onClick={() => setNewType(type)}
                            className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                              newType === type
                                ? 'border-gold/50 bg-gold/8 ring-1 ring-gold/25'
                                : 'border-warmMid/10 hover:border-warmMid/20 hover:bg-white/20'
                            }`}
                          >
                            <div className="w-full h-12 flex items-center justify-center">
                              {preview}
                            </div>
                            <span className="font-sans text-sm text-warmDark/75 leading-none">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Title for this moment..."
                      className="w-full font-serif text-lg text-warmDark bg-transparent border-b border-warmMid/10 pb-2 mb-4 outline-none focus:border-gold/40 transition-colors placeholder:text-warmDark/70"
                    />

                    <RichTextEditor
                      value={newContent}
                      onChange={setNewContent}
                      placeholder={newType === 'text' ? 'Write down what happened...' : 'Add a caption...'}
                      className="mb-4"
                    />

                    {newType !== 'text' && (
                      <div className="mb-4">
                        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                          onChange={(e) => handlePhotoFiles(Array.from(e.target.files || []), setNewPhotos, fileInputRef)} />
                        {newPhotos.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {newPhotos.map((url, i) => (
                              <div key={i} className="relative group aspect-square rounded-xl overflow-hidden">
                                <img src={url} alt="" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setNewPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                                  className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3.5 h-3.5 text-white" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {uploading ? (
                          <div className="flex items-center justify-center gap-2 text-warmDark/75 py-4">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm">Uploading...</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <button type="button" onClick={() => fileInputRef.current?.click()}
                              className="border-2 border-dashed border-warmMid/10 rounded-xl p-4 flex flex-col items-center gap-1.5 hover:border-gold/25 transition-colors">
                              <Upload className="w-5 h-5 text-warmDark/70" />
                              <span className="text-sm text-warmDark/70">From Device</span>
                            </button>
                            <button type="button" onClick={() => fileInputRef.current?.click()}
                              className="border-2 border-dashed border-warmMid/10 rounded-xl p-4 flex flex-col items-center gap-1.5 hover:border-gold/25 transition-colors">
                              <Images className="w-5 h-5 text-warmDark/70" />
                              <span className="text-sm text-warmDark/70">Google Photos</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={resetAddForm}
                        className="flex-1 py-3 rounded-xl text-warmDark/75 hover:bg-white/20 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddSubstory}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-medium"
                      >
                        Add moment
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom padding so FAB doesn't overlap last card */}
              <div className="h-20" />
            </motion.div>
          ) : (
            <motion.div
              key="photos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {allPhotos.length === 0 ? (
                <div className="py-16">
                  <Camera className="w-12 h-12 text-warmDark/75 mx-auto mb-3" />
                  <p className="font-handwriting text-3xl text-warmDark/70 mb-2">No photos yet</p>
                  <p className="font-sans text-sm text-warmDark/70">Photos from your stories will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gridItems.map((item, i) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="group"
                    >
                      <div
                        className={`rounded-2xl border border-white/30 relative overflow-hidden cursor-pointer ${item.url ? 'bg-black/5' : `bg-gradient-to-br ${storyGradients[i % storyGradients.length]}`}`}
                        onClick={() => {
                          if (item.url) {
                            const lbIdx = lightboxPhotos.indexOf(item.url)
                            if (lbIdx >= 0) setLightboxIdx(lbIdx)
                          }
                        }}
                      >
                        {item.url ? (
                          <div className="aspect-square overflow-hidden">
                            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-32 flex items-center justify-center">
                            <Image className="w-8 h-8 text-warmDark/75" />
                          </div>
                        )}
                        {item.url && (
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end">
                            <div className="w-full bg-gradient-to-t from-black/40 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.title && <p className="text-white text-sm truncate">{item.title}</p>}
                            </div>
                          </div>
                        )}
                      </div>
                      {item.caption && (
                        <p className="text-sm text-warmDark/75 mt-1.5 line-clamp-2 font-sans">{item.caption}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button — Add moment */}
      {canEdit && activeTab === 'timeline' && !showAddForm && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFabClick}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-gold to-coral shadow-lg shadow-coral/25 flex items-center justify-center text-white z-20"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/92"
            onClick={() => setLightboxIdx(null)}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              onClick={() => setLightboxIdx(null)}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Counter */}
            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-sans">
              {lightboxIdx + 1} / {lightboxPhotos.length}
            </span>

            {/* Prev */}
            {lightboxIdx > 0 && (
              <button
                className="absolute left-3 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx - 1) }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Image */}
            <motion.img
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              src={lightboxPhotos[lightboxIdx]}
              alt=""
              className="max-h-[85vh] max-w-[88vw] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next */}
            {lightboxIdx < lightboxPhotos.length - 1 && (
              <button
                className="absolute right-3 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx + 1) }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
