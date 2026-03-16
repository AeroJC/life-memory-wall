import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { MapPin, Plus, Image, BookOpen, Camera, Images, Upload, Loader2, X, ChevronLeft, ChevronRight, Pencil, Trash2, GripHorizontal } from 'lucide-react'
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

/* ─────────── Swipeable Substory Card ─────────── */
function SwipeableCard({
  children,
  canEdit,
  onEdit,
  onDelete,
}: {
  children: React.ReactNode
  canEdit: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  const [dragX, setDragX] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const ACTION_WIDTH = 140

  if (!canEdit) return <div>{children}</div>

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Action tray behind the card */}
      <div className="absolute inset-y-0 right-0 flex items-stretch z-0" style={{ width: ACTION_WIDTH }}>
        <button
          onClick={onEdit}
          className="flex-1 flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-blue-400/90 to-gold/80 text-white transition-opacity"
        >
          <Pencil className="w-4 h-4" />
          <span className="text-xs font-medium">Edit</span>
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-red-400/90 to-coral/80 text-white transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-xs font-medium">Delete</span>
        </button>
      </div>

      {/* Draggable foreground card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -ACTION_WIDTH, right: 0 }}
        dragElastic={0.1}
        onDrag={(_, info) => setDragX(info.offset.x)}
        onDragEnd={(_, info) => {
          if (info.offset.x < -ACTION_WIDTH * 0.5) {
            setIsRevealed(true)
          } else {
            setIsRevealed(false)
          }
        }}
        animate={{ x: isRevealed ? -ACTION_WIDTH : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative z-10 bg-white/60 backdrop-blur-sm rounded-2xl cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'pan-y' }}
      >
        {children}

        {/* Desktop hover actions (top-right) */}
        <AnimatePresence>
          {hovered && !isRevealed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-2 right-2 flex gap-1 z-20"
            >
              <button
                onClick={(e) => { e.stopPropagation(); onEdit() }}
                className="w-7 h-7 rounded-lg bg-white/90 shadow-md flex items-center justify-center text-blue-500 hover:text-blue-600 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete() }}
                className="w-7 h-7 rounded-lg bg-white/90 shadow-md flex items-center justify-center text-coral hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

/* ─────────── Bottom Sheet ─────────── */
function BottomSheet({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  const sheetRef = useRef<HTMLDivElement>(null)

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 300) {
                onClose()
              }
            }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-2xl"
            style={{ maxHeight: '60vh', touchAction: 'none' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 rounded-full bg-warmDark/20" />
            </div>

            {/* Scrollable content */}
            <div
              className="overflow-y-auto px-5 pb-6"
              style={{ maxHeight: 'calc(60vh - 28px)' }}
              onPointerDownCapture={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ─────────── Delete Confirmation ─────────── */
function DeleteConfirmation({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-4 right-4 bottom-24 z-50 bg-white rounded-2xl shadow-2xl p-5 max-w-sm mx-auto"
          >
            <h4 className="font-serif text-lg text-warmDark mb-2">Delete this moment?</h4>
            <p className="text-sm text-warmDark/70 mb-4">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl text-sm text-warmDark/75 hover:bg-warmDark/5 transition-all border border-warmMid/15"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-2.5 rounded-xl text-sm bg-gradient-to-r from-red-500 to-coral text-white font-medium"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ─────────── Layout Picker ─────────── */
function LayoutPicker({
  value,
  onChange,
}: {
  value: SubStory['type']
  onChange: (t: SubStory['type']) => void
}) {
  const layouts: { type: SubStory['type']; label: string; preview: React.ReactNode }[] = [
    {
      type: 'text',
      label: 'Story',
      preview: (
        <div className="flex flex-col gap-1 w-full px-1">
          <div className="h-1.5 bg-warmDark/25 rounded-full w-full" />
          <div className="h-1.5 bg-warmDark/15 rounded-full w-4/5" />
          <div className="h-1.5 bg-warmDark/15 rounded-full w-full" />
          <div className="h-1.5 bg-warmDark/15 rounded-full w-3/5" />
        </div>
      ),
    },
    {
      type: 'img-left',
      label: 'Photo left',
      preview: (
        <div className="flex gap-1 w-full px-1">
          <div className="w-1/2 h-10 bg-gold/30 rounded" />
          <div className="flex-1 flex flex-col gap-1 justify-center">
            <div className="h-1.5 bg-warmDark/20 rounded-full w-full" />
            <div className="h-1.5 bg-warmDark/12 rounded-full w-4/5" />
            <div className="h-1.5 bg-warmDark/12 rounded-full w-full" />
          </div>
        </div>
      ),
    },
    {
      type: 'img-right',
      label: 'Photo right',
      preview: (
        <div className="flex gap-1 w-full px-1">
          <div className="flex-1 flex flex-col gap-1 justify-center">
            <div className="h-1.5 bg-warmDark/20 rounded-full w-full" />
            <div className="h-1.5 bg-warmDark/12 rounded-full w-4/5" />
            <div className="h-1.5 bg-warmDark/12 rounded-full w-full" />
          </div>
          <div className="w-1/2 h-10 bg-coral/30 rounded" />
        </div>
      ),
    },
    {
      type: 'img-top',
      label: 'Photo top',
      preview: (
        <div className="flex flex-col gap-1 w-full px-1">
          <div className="h-7 bg-lavender/50 rounded w-full" />
          <div className="h-1.5 bg-warmDark/20 rounded-full w-full" />
          <div className="h-1.5 bg-warmDark/12 rounded-full w-4/5" />
        </div>
      ),
    },
    {
      type: 'img-bottom',
      label: 'Photo below',
      preview: (
        <div className="flex flex-col gap-1 w-full px-1">
          <div className="h-1.5 bg-warmDark/20 rounded-full w-full" />
          <div className="h-1.5 bg-warmDark/12 rounded-full w-4/5" />
          <div className="h-7 bg-teal/30 rounded w-full" />
        </div>
      ),
    },
    {
      type: 'photos',
      label: 'Photo grid',
      preview: (
        <div className="grid grid-cols-2 gap-1 w-full px-1">
          <div className="h-5 bg-gold/25 rounded" />
          <div className="h-5 bg-coral/25 rounded" />
          <div className="h-5 bg-lavender/35 rounded" />
          <div className="h-5 bg-teal/25 rounded" />
        </div>
      ),
    },
  ]

  return (
    <div className="mb-4">
      <p className="font-handwriting text-warmDark/70 text-base mb-2">Choose a layout</p>
      <div className="grid grid-cols-3 gap-2">
        {layouts.map(({ type, label, preview }) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
              value === type
                ? 'border-gold/50 bg-gold/8 ring-1 ring-gold/25'
                : 'border-warmMid/10 hover:border-warmMid/20 hover:bg-white/20'
            }`}
          >
            <div className="w-full h-12 flex items-center justify-center">{preview}</div>
            <span className="font-sans text-sm text-warmDark/75 leading-none">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   MemoryDetailB — Bottom Sheet Editor Design
   ═══════════════════════════════════════════════════ */
export default function MemoryDetailB({
  memory,
  onClose,
  onAddSubstory,
  onUpdateSubstory,
  onDeleteSubstory,
  canEdit = true,
}: Props) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'photos'>('timeline')

  // Bottom sheet form state
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingSubstoryId, setEditingSubstoryId] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newType, setNewType] = useState<SubStory['type']>('text')
  const [newPhotos, setNewPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  // Lightbox
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const substoriesLoaded = memory.substories !== undefined
  const substories = memory.substories || []

  const groupedByDate: Record<string, SubStory[]> = {}
  substories.forEach((s) => {
    if (!groupedByDate[s.date]) groupedByDate[s.date] = []
    groupedByDate[s.date].push(s)
  })
  const sortedDates = Object.keys(groupedByDate).sort()

  // Photo handling
  const handlePhotoFiles = async (files: File[]) => {
    if (!files.length) return
    setUploading(true)
    try {
      const urls = await uploadMultipleImages(files)
      setNewPhotos((prev) => [...prev, ...urls])
    } catch {
      alert('Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Reset form
  const resetForm = () => {
    setNewTitle('')
    setNewContent('')
    setNewPhotos([])
    setNewType('text')
    setEditingSubstoryId(null)
    setSheetOpen(false)
  }

  // Save
  const handleSaveSubstory = () => {
    if (!newTitle.trim() && !stripHtml(newContent)) return
    const substory: SubStory = {
      id: editingSubstoryId || `sub-${Date.now()}`,
      date: substories.find((s) => s.id === editingSubstoryId)?.date || new Date().toISOString().split('T')[0],
      type: newType,
      title: newTitle.trim() || undefined,
      content: newType === 'text' ? newContent : undefined,
      caption: newType !== 'text' ? newContent : undefined,
      photos: newType !== 'text' ? newPhotos : undefined,
    }
    if (editingSubstoryId) {
      onUpdateSubstory(memory.id, substory)
    } else {
      onAddSubstory(memory.id, substory)
    }
    resetForm()
  }

  // Start editing
  const startEditSubstory = (sub: SubStory) => {
    setEditingSubstoryId(sub.id)
    setNewTitle(sub.title || '')
    setNewContent(sub.content || sub.caption || '')
    setNewType(sub.type)
    setNewPhotos(sub.photos || [])
    setSheetOpen(true)
  }

  // Open add form
  const openAddSheet = () => {
    setEditingSubstoryId(null)
    setNewTitle('')
    setNewContent('')
    setNewType('text')
    setNewPhotos([])
    setSheetOpen(true)
  }

  // Photos tab data
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

  // Cover scroll tracking
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

  // Lightbox keyboard
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

  /* ── Render substory card content ── */
  const renderSubstoryContent = (sub: SubStory, idx: number) => {
    const photoClick = (url: string) => {
      const lbIdx = lightboxPhotos.indexOf(url)
      if (lbIdx >= 0) setLightboxIdx(lbIdx)
    }

    switch (sub.type) {
      case 'text':
        return (
          <div className="p-4">
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
          <div className="p-4">
            {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3">{sub.title}</h4>}
            <div className="flex gap-3 items-center">
              <div className="w-1/2 flex-shrink-0 aspect-[4/3] overflow-hidden rounded-xl">
                {sub.photos && sub.photos.length > 0 ? (
                  <img
                    src={sub.photos[0]}
                    alt=""
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => photoClick(sub.photos![0])}
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
          <div className="p-4">
            {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3">{sub.title}</h4>}
            <div className="flex gap-3 items-center">
              {sub.caption && (
                <div className={`font-sans text-warmDark/90 flex-1 ${captionFontClass(sub.caption)}`} dangerouslySetInnerHTML={{ __html: sanitizeHtml(sub.caption || '') }} />
              )}
              <div className="w-1/2 flex-shrink-0 aspect-[4/3] overflow-hidden rounded-xl">
                {sub.photos && sub.photos.length > 0 ? (
                  <img
                    src={sub.photos[0]}
                    alt=""
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => photoClick(sub.photos![0])}
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
          <div className="p-4">
            {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3">{sub.title}</h4>}
            <div className="aspect-[4/3] overflow-hidden rounded-xl mb-3">
              {sub.photos && sub.photos.length > 0 ? (
                <img
                  src={sub.photos[0]}
                  alt=""
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => photoClick(sub.photos![0])}
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
          <div className="p-4">
            {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3">{sub.title}</h4>}
            {sub.caption && <div className="font-sans text-sm text-warmDark/75 leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: sanitizeHtml(sub.caption || '') }} />}
            <div className="aspect-[4/3] overflow-hidden rounded-xl">
              {sub.photos && sub.photos.length > 0 ? (
                <img
                  src={sub.photos[0]}
                  alt=""
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => photoClick(sub.photos![0])}
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
          <div className="p-4">
            {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3">{sub.title}</h4>}
            {sub.photos && sub.photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {sub.photos.map((url, n) => (
                  <div key={n} className="aspect-square overflow-hidden rounded-xl">
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => photoClick(url)}
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

  return (
    <div className="h-full overflow-y-auto relative">
      {/* ── Cover photo ── */}
      {coverPhoto && (
        <div ref={coverRef} className="relative flex-shrink-0 h-56 overflow-hidden">
          <img src={coverPhoto} alt={memory.title} className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
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

      {/* ── Sticky compact header ── */}
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

      {/* ── Main content ── */}
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
                  {/* Timeline line */}
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

                        {/* Substories with swipe-to-reveal */}
                        <div className="space-y-5 ml-4 pl-8">
                          {groupedByDate[date].map((sub, idx) => (
                            <motion.div
                              key={sub.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: (dateIdx * 0.1) + (idx * 0.06) }}
                            >
                              <SwipeableCard
                                canEdit={canEdit}
                                onEdit={() => startEditSubstory(sub)}
                                onDelete={() => setDeleteTarget(sub.id)}
                              >
                                {renderSubstoryContent(sub, idx)}
                              </SwipeableCard>

                              {/* Separator */}
                              <div className="h-px bg-warmMid/5 mt-5" />
                            </motion.div>
                          ))}
                        </div>

                        <div className="h-6" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Spacer so FAB doesn't cover last item */}
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

              {/* Spacer for FAB */}
              <div className="h-20" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── FAB: Add moment ── */}
      {canEdit && !sheetOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAddSheet}
          className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-gradient-to-br from-gold to-coral shadow-lg shadow-coral/25 flex items-center justify-center text-white"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      )}

      {/* ── Bottom Sheet Editor ── */}
      <BottomSheet open={sheetOpen} onClose={resetForm}>
        <h4 className="font-serif text-xl text-warmDark mb-4">
          {editingSubstoryId ? 'Edit moment' : 'Add a moment'}
        </h4>

        <LayoutPicker value={newType} onChange={setNewType} />

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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handlePhotoFiles(Array.from(e.target.files || []))}
            />
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
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-warmMid/10 rounded-xl p-4 flex flex-col items-center gap-1.5 hover:border-gold/25 transition-colors"
                >
                  <Upload className="w-5 h-5 text-warmDark/70" />
                  <span className="text-sm text-warmDark/70">From Device</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-warmMid/10 rounded-xl p-4 flex flex-col items-center gap-1.5 hover:border-gold/25 transition-colors"
                >
                  <Images className="w-5 h-5 text-warmDark/70" />
                  <span className="text-sm text-warmDark/70">Google Photos</span>
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={resetForm}
            className="flex-1 py-3 rounded-xl text-warmDark/75 hover:bg-warmDark/5 transition-all border border-warmMid/15"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSubstory}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-medium"
          >
            {editingSubstoryId ? 'Save changes' : 'Add moment'}
          </button>
        </div>
      </BottomSheet>

      {/* ── Delete Confirmation ── */}
      <DeleteConfirmation
        open={deleteTarget !== null}
        onConfirm={() => {
          if (deleteTarget) {
            onDeleteSubstory(memory.id, deleteTarget)
            setDeleteTarget(null)
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/92"
            onClick={() => setLightboxIdx(null)}
          >
            <button
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              onClick={() => setLightboxIdx(null)}
            >
              <X className="w-5 h-5" />
            </button>

            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-sans">
              {lightboxIdx + 1} / {lightboxPhotos.length}
            </span>

            {lightboxIdx > 0 && (
              <button
                className="absolute left-3 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx - 1) }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

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
