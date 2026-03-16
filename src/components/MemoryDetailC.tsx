import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Plus, Image, BookOpen, Camera, Images, Upload, Loader2, X, ChevronLeft, ChevronRight, Pencil, Trash2, Check, MoreVertical, Play, Pause, Crop } from 'lucide-react'
import React, { useState, useRef, useEffect, useCallback } from 'react'

import { Memory, SubStory, TextStyle, CanvasData } from '../types'
import { uploadMultipleImages, thumbnailUrl, mediumUrl, fullUrl } from '../cloudinary'
import RichTextEditor from './RichTextEditor'
import ImageCropper from './ImageCropper'
import TextStylePanel from './TextStylePanel'
import MomentEditor, { CanvasRenderer } from './MomentEditor'

interface Props {
  memory: Memory
  onClose: () => void
  onAddSubstory: (memoryId: string, substory: SubStory) => void
  onUpdateSubstory: (memoryId: string, substory: SubStory) => void
  onDeleteSubstory: (memoryId: string, substoryId: string) => void
  canEdit?: boolean
  onEditingChange?: (editing: boolean) => void
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

/* ── Layout picker data (compact row) ── */
const layoutOptions: { type: SubStory['type']; preview: React.ReactNode }[] = [
  { type: 'text', preview: <div className="flex flex-col gap-0.5 w-full px-0.5"><div className="h-1 bg-warmDark/25 rounded-full"/><div className="h-1 bg-warmDark/15 rounded-full w-4/5"/><div className="h-1 bg-warmDark/15 rounded-full"/></div> },
  { type: 'img-left', preview: <div className="flex gap-0.5 w-full px-0.5"><div className="w-1/2 h-5 bg-gold/30 rounded"/><div className="flex-1 flex flex-col gap-0.5 justify-center"><div className="h-1 bg-warmDark/20 rounded-full"/><div className="h-1 bg-warmDark/12 rounded-full w-4/5"/></div></div> },
  { type: 'img-right', preview: <div className="flex gap-0.5 w-full px-0.5"><div className="flex-1 flex flex-col gap-0.5 justify-center"><div className="h-1 bg-warmDark/20 rounded-full"/><div className="h-1 bg-warmDark/12 rounded-full w-4/5"/></div><div className="w-1/2 h-5 bg-coral/30 rounded"/></div> },
  { type: 'img-top', preview: <div className="flex flex-col gap-0.5 w-full px-0.5"><div className="h-3.5 bg-lavender/50 rounded w-full"/><div className="h-1 bg-warmDark/20 rounded-full"/><div className="h-1 bg-warmDark/12 rounded-full w-4/5"/></div> },
  { type: 'img-bottom', preview: <div className="flex flex-col gap-0.5 w-full px-0.5"><div className="h-1 bg-warmDark/20 rounded-full"/><div className="h-1 bg-warmDark/12 rounded-full w-4/5"/><div className="h-3.5 bg-teal/30 rounded w-full"/></div> },
  { type: 'photos', preview: <div className="grid grid-cols-2 gap-0.5 w-full px-0.5"><div className="h-2.5 bg-gold/25 rounded"/><div className="h-2.5 bg-coral/25 rounded"/><div className="h-2.5 bg-lavender/35 rounded"/><div className="h-2.5 bg-teal/25 rounded"/></div> },
  { type: 'canvas', preview: <div className="relative w-full h-6 bg-warmMid/5 rounded border border-dashed border-warmMid/20"><div className="absolute top-0.5 left-0.5 w-3 h-2 bg-gold/25 rounded-sm"/><div className="absolute bottom-0.5 right-1 w-4 h-1 bg-warmDark/15 rounded-full"/><div className="absolute top-1 right-0.5 w-2.5 h-2.5 bg-coral/20 rounded-sm"/></div> },
]

/** Build inline CSS from a TextStyle object */
function textStyleToCss(ts?: TextStyle): React.CSSProperties {
  if (!ts) return {}
  return {
    fontFamily: ts.fontFamily ? `'${ts.fontFamily}', sans-serif` : undefined,
    fontSize: ts.fontSize === 'small' ? '14px' : ts.fontSize === 'large' ? '20px' : ts.fontSize === 'heading' ? '26px' : undefined,
    textAlign: ts.textAlign || undefined,
    fontWeight: ts.bold ? 'bold' : undefined,
    fontStyle: ts.italic ? 'italic' : undefined,
    textDecoration: ts.underline ? 'underline' : undefined,
  }
}

export default function MemoryDetailC({ memory, onClose, onAddSubstory, onUpdateSubstory, onDeleteSubstory, canEdit = true, onEditingChange }: Props) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'photos'>('timeline')

  /* ── Per-card editing state ── */
  const [expandedId, setExpandedId] = useState<string | null>(null)   // which substory is in edit mode
  const [showAddForm, setShowAddForm] = useState(false)               // "add moment" card expanded
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  /* ── Canvas draft for 'canvas' type moments ── */
  const [canvasDraft, setCanvasDraft] = useState<CanvasData | undefined>(undefined)

  /* ── Slideshow state ── */
  const [slideshowActive, setSlideshowActive] = useState(false)
  const [slideshowIdx, setSlideshowIdx] = useState(0)
  const [slideshowPaused, setSlideshowPaused] = useState(false)
  const slideshowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* ── Edit fields ── */
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editType, setEditType] = useState<SubStory['type']>('text')
  const [editTextStyle, setEditTextStyle] = useState<TextStyle>({})
  const [editTitleStyle, setEditTitleStyle] = useState<TextStyle>({})
  const [styleTarget, setStyleTarget] = useState<'title' | 'content'>('content')
  const [editPhotos, setEditPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)       // image URL being cropped
  const [cropIndex, setCropIndex] = useState<number | null>(null)    // index in editPhotos to replace

  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  /* ── Photo upload helper ── */
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

  /* ── Derived data ── */
  const substoriesLoaded = memory.substories !== undefined
  const substories = memory.substories || []

  const groupedByDate: Record<string, SubStory[]> = {}
  substories.forEach((s) => {
    if (!groupedByDate[s.date]) groupedByDate[s.date] = []
    groupedByDate[s.date].push(s)
  })
  const sortedDates = Object.keys(groupedByDate).sort()

  /* ── Reset / start helpers ── */
  const resetEdit = () => {
    setEditTitle(''); setEditContent(''); setEditPhotos([])
    setEditType('text'); setExpandedId(null); setShowAddForm(false)
    setCropSrc(null); setCropIndex(null)
    setMenuOpenId(null); setDeleteConfirmId(null)
    setCanvasDraft(undefined); setEditTextStyle({}); setEditTitleStyle({}); setStyleTarget('content')
    onEditingChange?.(false)
  }

  const startEdit = (sub: SubStory) => {
    setExpandedId(sub.id)
    setEditTitle(sub.title || '')
    setEditContent(sub.content || sub.caption || '')
    setEditType(sub.type)
    setEditPhotos(sub.photos || [])
    setEditTextStyle(sub.textStyle || {})
    setEditTitleStyle(sub.titleStyle || {})
    setStyleTarget('content')
    if (sub.type === 'canvas') setCanvasDraft(sub.canvasData)
    setMenuOpenId(null)
    onEditingChange?.(true)
  }

  const startAdd = () => {
    setShowAddForm(true)
    setExpandedId(null)
    setEditTitle(''); setEditContent(''); setEditPhotos([])
    setEditType('text'); setEditTextStyle({}); setEditTitleStyle({}); setStyleTarget('content')
  }

  /* ── Save ── */
  const handleSave = () => {
    // Canvas type moment
    if (editType === 'canvas') {
      if (!canvasDraft || canvasDraft.blocks.length === 0) return
      const existingSub = substories.find((s) => s.id === expandedId)
      const substory: SubStory = {
        id: expandedId || `sub-${Date.now()}`,
        date: existingSub?.date || new Date().toISOString().split('T')[0],
        type: 'canvas',
        title: editTitle.trim() || undefined,
        canvasData: canvasDraft,
      }
      if (expandedId) {
        onUpdateSubstory(memory.id, substory)
      } else {
        onAddSubstory(memory.id, substory)
      }
      resetEdit()
      return
    }

    if (!editTitle.trim() && !stripHtml(editContent)) return
    const existingSub = substories.find((s) => s.id === expandedId)
    const substory: SubStory = {
      id: expandedId || `sub-${Date.now()}`,
      date: existingSub?.date || new Date().toISOString().split('T')[0],
      type: editType,
      title: editTitle.trim() || undefined,
      content: editType === 'text' ? editContent : undefined,
      caption: editType !== 'text' ? editContent : undefined,
      photos: editType !== 'text' ? editPhotos : undefined,
      textStyle: Object.keys(editTextStyle).length > 0 ? editTextStyle : undefined,
      titleStyle: Object.keys(editTitleStyle).length > 0 ? editTitleStyle : undefined,
    }
    if (expandedId) {
      onUpdateSubstory(memory.id, substory)
    } else {
      onAddSubstory(memory.id, substory)
    }
    resetEdit()
  }

  /* ── All photos (for Photos tab + lightbox) ── */
  const coverGroup = memory.photos?.length
    ? [{ title: memory.title, caption: 'Cover photos', date: memory.date, photos: memory.photos }]
    : []
  const allPhotos = [
    ...coverGroup,
    ...substories
      .filter((s) => s.type !== 'text' && s.type !== 'canvas' && s.photos && s.photos.length > 0)
      .map((s) => ({ title: s.title || '', caption: s.caption || '', date: s.date, photos: s.photos || [] })),
  ]
  const canvasItems = substories
    .filter((s) => s.type === 'canvas' && s.canvasData)
    .map((s) => ({ title: s.title || '', canvasData: s.canvasData!, key: `canvas-${s.id}` }))
  const gridItems = allPhotos.flatMap((photo, i) =>
    photo.photos.map((url, j) => ({ url, title: photo.title, caption: photo.caption, key: `${i}-${j}` }))
  )
  const lightboxPhotos = gridItems.map((item) => item.url)
  const hasMediaItems = gridItems.length > 0 || canvasItems.length > 0

  /* ── Lightbox ── */
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const openLightbox = (url: string) => {
    const idx = lightboxPhotos.indexOf(url)
    if (idx >= 0) setLightboxIdx(idx)
  }

  /* ── Cover observer ── */
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

  /* ── Keyboard lightbox navigation ── */
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

  /* ── Slideshow slides: each substory becomes a slide ── */
  const slideshowSlides = [
    // Cover photo as first slide
    ...(coverPhoto ? [{
      id: 'cover',
      title: memory.title,
      text: memory.story || '',
      photo: coverPhoto,
      date: memory.date,
      canvasData: undefined as CanvasData | undefined,
    }] : []),
    // Substory slides
    ...substories.map((sub) => ({
      id: sub.id,
      title: sub.title || '',
      text: sub.type === 'text' ? (sub.content || '') : (sub.caption || ''),
      photo: sub.photos && sub.photos.length > 0 ? sub.photos[0] : null,
      date: sub.date,
      canvasData: sub.type === 'canvas' ? sub.canvasData : undefined,
    })),
  ]

  /* ── Slideshow auto-advance ── */
  useEffect(() => {
    if (!slideshowActive || slideshowPaused || slideshowSlides.length === 0) return
    slideshowTimerRef.current = setTimeout(() => {
      setSlideshowIdx((prev) => {
        if (prev >= slideshowSlides.length - 1) {
          setSlideshowActive(false)
          return 0
        }
        return prev + 1
      })
    }, 5000)
    return () => { if (slideshowTimerRef.current) clearTimeout(slideshowTimerRef.current) }
  }, [slideshowActive, slideshowPaused, slideshowIdx, slideshowSlides.length])

  const startSlideshow = useCallback(() => {
    if (slideshowSlides.length === 0) return
    setSlideshowIdx(0)
    setSlideshowPaused(false)
    setSlideshowActive(true)
  }, [substories.length])

  /* ── Close menus on outside click ── */
  useEffect(() => {
    if (!menuOpenId) return
    const handler = () => setMenuOpenId(null)
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [menuOpenId])

  /* ─────────── Render helpers ─────────── */

  /** Clickable photo wrapper */
  const ClickablePhoto = ({ url, className }: { url: string; className: string }) => (
    <img
      src={mediumUrl(url)}
      alt=""
      className={`${className} cursor-pointer hover:brightness-95 transition-all`}
      loading="lazy"
      onClick={() => openLightbox(url)}
    />
  )

  /** Compact substory card (read-only view) */
  const CompactCard = ({ sub, idx, gradIdx }: { sub: SubStory; idx: number; gradIdx: number }) => (
    <div className="relative group/card">
      {/* Three-dot menu */}
      {canEdit && (
        <div className="absolute -top-1 right-0 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === sub.id ? null : sub.id) }}
            className="w-7 h-7 rounded-lg bg-white/60 shadow-sm flex items-center justify-center text-warmDark/50 hover:text-warmDark/80 opacity-0 group-hover/card:opacity-100 transition-all"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {menuOpenId === sub.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-warmMid/10 py-1 min-w-[120px] z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => startEdit(sub)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-warmDark/80 hover:bg-gold/8 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => { setDeleteConfirmId(sub.id); setMenuOpenId(null) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-coral/80 hover:bg-coral/8 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Delete confirmation overlay */}
      <AnimatePresence>
        {deleteConfirmId === sub.id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-3 p-4"
          >
            <p className="font-serif text-base text-warmDark">Delete this moment?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-sm text-warmDark/75 hover:bg-warmMid/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { onDeleteSubstory(memory.id, sub.id); setDeleteConfirmId(null) }}
                className="px-4 py-2 rounded-xl text-sm bg-coral/80 text-white font-medium hover:bg-coral transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card content based on type */}
      {sub.type === 'text' && (
        <div>
          {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-2" style={textStyleToCss(sub.titleStyle)}>{sub.title}</h4>}
          {sub.content && (
            <div
              className="font-sans text-warmDark/90 leading-relaxed whitespace-pre-wrap"
              style={textStyleToCss(sub.textStyle)}
              dangerouslySetInnerHTML={{ __html: sub.content }}
            />
          )}
        </div>
      )}

      {(sub.type === 'img-left' || sub.type === 'photo') && (
        <div>
          {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3" style={textStyleToCss(sub.titleStyle)}>{sub.title}</h4>}
          <div className="flex gap-3 items-center">
            <div className="w-1/2 flex-shrink-0 rounded-xl overflow-hidden">
              {sub.photos && sub.photos.length > 0 ? (
                <ClickablePhoto url={sub.photos[0]} className="w-full aspect-[4/3] object-contain bg-black/5 rounded-xl" />
              ) : (
                <div className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${storyGradients[gradIdx % storyGradients.length]} flex items-center justify-center border border-white/40`}>
                  <Image className="w-8 h-8 text-warmDark/75" />
                </div>
              )}
            </div>
            {sub.caption && (
              <div className={`font-sans text-warmDark/90 flex-1 whitespace-pre-wrap ${captionFontClass(sub.caption)}`} style={textStyleToCss(sub.textStyle)} dangerouslySetInnerHTML={{ __html: sub.caption }} />
            )}
          </div>
        </div>
      )}

      {sub.type === 'img-right' && (
        <div>
          {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3" style={textStyleToCss(sub.titleStyle)}>{sub.title}</h4>}
          <div className="flex gap-3 items-center">
            {sub.caption && (
              <div className={`font-sans text-warmDark/90 flex-1 whitespace-pre-wrap ${captionFontClass(sub.caption)}`} style={textStyleToCss(sub.textStyle)} dangerouslySetInnerHTML={{ __html: sub.caption }} />
            )}
            <div className="w-1/2 flex-shrink-0 rounded-xl overflow-hidden">
              {sub.photos && sub.photos.length > 0 ? (
                <ClickablePhoto url={sub.photos[0]} className="w-full aspect-[4/3] object-contain bg-black/5 rounded-xl" />
              ) : (
                <div className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${storyGradients[gradIdx % storyGradients.length]} flex items-center justify-center border border-white/40`}>
                  <Image className="w-8 h-8 text-warmDark/75" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {sub.type === 'img-top' && (
        <div>
          {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3" style={textStyleToCss(sub.titleStyle)}>{sub.title}</h4>}
          {sub.photos && sub.photos.length > 0 ? (
            <ClickablePhoto url={sub.photos[0]} className="w-full aspect-[4/3] object-contain bg-black/5 rounded-xl mb-3" />
          ) : (
            <div className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${storyGradients[gradIdx % storyGradients.length]} flex items-center justify-center border border-white/40 mb-3`}>
              <Image className="w-10 h-10 text-warmDark/75" />
            </div>
          )}
          {sub.caption && <div className="font-sans text-sm text-warmDark/90 leading-relaxed whitespace-pre-wrap" style={textStyleToCss(sub.textStyle)} dangerouslySetInnerHTML={{ __html: sub.caption }} />}
        </div>
      )}

      {sub.type === 'img-bottom' && (
        <div>
          {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3" style={textStyleToCss(sub.titleStyle)}>{sub.title}</h4>}
          {sub.caption && <div className="font-sans text-sm text-warmDark/75 leading-relaxed whitespace-pre-wrap mb-3" style={textStyleToCss(sub.textStyle)} dangerouslySetInnerHTML={{ __html: sub.caption }} />}
          {sub.photos && sub.photos.length > 0 ? (
            <ClickablePhoto url={sub.photos[0]} className="w-full aspect-[4/3] object-contain bg-black/5 rounded-xl" />
          ) : (
            <div className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${storyGradients[gradIdx % storyGradients.length]} flex items-center justify-center border border-white/40`}>
              <Image className="w-10 h-10 text-warmDark/75" />
            </div>
          )}
        </div>
      )}

      {sub.type === 'photos' && (
        <div>
          {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3" style={textStyleToCss(sub.titleStyle)}>{sub.title}</h4>}
          {sub.photos && sub.photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {sub.photos.map((url, n) => (
                <ClickablePhoto key={n} url={url} className="aspect-square object-contain bg-black/5 rounded-xl w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((n) => (
                <div key={n} className={`aspect-square rounded-xl bg-gradient-to-br ${storyGradients[(gradIdx + n) % storyGradients.length]} flex items-center justify-center border border-white/40`}>
                  <Image className="w-6 h-6 text-warmDark/75" />
                </div>
              ))}
            </div>
          )}
          {sub.caption && <div className="font-sans text-sm text-warmDark/90 italic mt-3 leading-relaxed whitespace-pre-wrap" style={textStyleToCss(sub.textStyle)} dangerouslySetInnerHTML={{ __html: sub.caption }} />}
        </div>
      )}

      {sub.type === 'canvas' && sub.canvasData && (
        <div>
          {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3" style={textStyleToCss(sub.titleStyle)}>{sub.title}</h4>}
          <CanvasRenderer data={sub.canvasData} />
        </div>
      )}
    </div>
  )

  /* ── Inline editable photo zone — fits inside card layout ── */
  const renderInlinePhotoZone = (inputRef: React.RefObject<HTMLInputElement>, isGrid?: boolean, className?: string) => {
    const maxPhotos = editType === 'photos' ? 4 : 1
    const atLimit = editPhotos.length >= maxPhotos
    return (
      <div className={className}>
        <input ref={inputRef} type="file" accept="image/*" multiple={editType === 'photos'} className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []).slice(0, maxPhotos - editPhotos.length)
            if (files.length > 0) handlePhotoFiles(files, setEditPhotos, inputRef)
          }} />
        {editPhotos.length > 0 ? (
          <div className={isGrid ? 'grid grid-cols-2 gap-2' : ''}>
            {editPhotos.map((url, pi) => (
              <div key={pi} className="relative group/photo rounded-xl overflow-hidden">
                <img src={url} alt="" className={`w-full ${isGrid ? 'aspect-square' : 'aspect-[4/3]'} object-contain bg-black/5 rounded-xl`} />
                <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover/photo:opacity-100 transition-opacity">
                  <button type="button" onClick={() => { setCropSrc(url); setCropIndex(pi) }}
                    className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors" title="Crop">
                    <Crop className="w-3 h-3 text-white" />
                  </button>
                  <button type="button" onClick={() => setEditPhotos((p) => p.filter((_, idx) => idx !== pi))}
                    className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors" title="Remove">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
            ))}
            {!atLimit && !uploading && (
              <button type="button" onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed border-warmMid/20 rounded-xl flex items-center justify-center hover:border-gold/30 transition-colors ${isGrid ? 'aspect-square' : 'aspect-[4/3]'}`}>
                <Plus className="w-4 h-4 text-warmDark/50" />
              </button>
            )}
          </div>
        ) : uploading ? (
          <div className="flex items-center justify-center gap-2 text-warmDark/75 aspect-[4/3]">
            <Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Uploading...</span>
          </div>
        ) : (
          <button type="button" onClick={() => inputRef.current?.click()}
            className={`w-full border-2 border-dashed border-warmMid/20 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:border-gold/30 hover:bg-gold/5 transition-all ${isGrid ? 'aspect-square' : 'aspect-[4/3]'}`}>
            <Upload className="w-5 h-5 text-warmDark/40" />
            <span className="text-xs text-warmDark/40 font-sans">Add photo</span>
          </button>
        )}
      </div>
    )
  }

  /* ── Inline editable title ── */
  const editableTitle = (
    <input
      type="text"
      value={editTitle}
      onChange={(e) => setEditTitle(e.target.value)}
      onFocus={() => setStyleTarget('title')}
      placeholder="Title..."
      className={`w-full font-serif text-lg font-bold text-warmDark bg-transparent outline-none placeholder:text-warmDark/25 border-b transition-colors mb-2 pb-1 ${styleTarget === 'title' ? 'border-gold/40' : 'border-transparent hover:border-warmMid/15'}`}
      style={textStyleToCss(editTitleStyle)}
    />
  )

  /* ── Inline editable content/caption ── */
  const renderEditableContent = (placeholder: string) => (
    <div
      className={`rounded-lg transition-all ${styleTarget === 'content' ? 'ring-1 ring-gold/20' : ''}`}
      onFocus={() => setStyleTarget('content')}
    >
      <RichTextEditor
        value={editContent}
        onChange={setEditContent}
        placeholder={placeholder}
        editorStyle={textStyleToCss(editTextStyle)}
      />
    </div>
  )

  /* ── Inline edit card — mirrors CompactCard layout but editable ── */
  const renderInlineEditCard = (isNew: boolean) => {
    const inputRef = isNew ? fileInputRef : editFileInputRef
    return (
      <div>
        {editType === 'text' && (
          <div>
            {editableTitle}
            {renderEditableContent('Write your story...')}
          </div>
        )}

        {(editType === 'img-left' || editType === 'photo') && (
          <div>
            {editableTitle}
            <div className="flex gap-3 items-start">
              {renderInlinePhotoZone(inputRef, false, 'w-1/2 flex-shrink-0')}
              <div className="flex-1">
                {renderEditableContent('Caption...')}
              </div>
            </div>
          </div>
        )}

        {editType === 'img-right' && (
          <div>
            {editableTitle}
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                {renderEditableContent('Caption...')}
              </div>
              {renderInlinePhotoZone(inputRef, false, 'w-1/2 flex-shrink-0')}
            </div>
          </div>
        )}

        {editType === 'img-top' && (
          <div>
            {editableTitle}
            {renderInlinePhotoZone(inputRef, false, 'mb-3')}
            {renderEditableContent('Caption...')}
          </div>
        )}

        {editType === 'img-bottom' && (
          <div>
            {editableTitle}
            {renderEditableContent('Caption...')}
            {renderInlinePhotoZone(inputRef, false, 'mt-3')}
          </div>
        )}

        {editType === 'photos' && (
          <div>
            {editableTitle}
            {renderInlinePhotoZone(inputRef, true, 'mb-3')}
            {renderEditableContent('Caption...')}
          </div>
        )}

        {editType === 'canvas' && (
          <div>
            {editableTitle}
            <MomentEditor initialData={canvasDraft} onChange={setCanvasDraft} />
          </div>
        )}
      </div>
    )
  }

  /** Controls bar below inline edit card: layout picker + style + save/cancel */
  const renderEditControls = (isNew: boolean) => (
    <div className="mt-3 space-y-2">
      {/* Layout picker */}
      <div className="flex items-center gap-1.5">
        <span className="font-sans text-[10px] text-warmDark/35 uppercase tracking-wider mr-1">Layout</span>
        {layoutOptions.map(({ type, preview }) => (
          <button
            key={type}
            onClick={() => { setEditType(type); if (type === 'canvas' && !canvasDraft) setCanvasDraft({ width: 480, height: 220, background: '#fffbf5', blocks: [] }) }}
            className={`p-1.5 rounded-lg border transition-all ${editType === type ? 'border-gold/50 bg-gold/10 ring-1 ring-gold/25' : 'border-warmMid/10 hover:border-warmMid/20'}`}
            title={type === 'text' ? 'Text' : type === 'img-left' ? 'Left' : type === 'img-right' ? 'Right' : type === 'img-top' ? 'Top' : type === 'img-bottom' ? 'Bottom' : type === 'photos' ? 'Grid' : 'Canvas'}
          >
            <div className="w-6 h-5 flex items-center justify-center">{preview}</div>
          </button>
        ))}
      </div>

      {/* Text style controls */}
      {editType !== 'canvas' && (
        <TextStylePanel
          style={styleTarget === 'title' ? editTitleStyle : editTextStyle}
          onChange={styleTarget === 'title' ? setEditTitleStyle : setEditTextStyle}
          onClose={() => {}}
          inline
          targetLabel={styleTarget === 'title' ? 'Title' : 'Description'}
        />
      )}

      {/* Save / Cancel */}
      <div className="flex gap-2 pt-1">
        <button onClick={resetEdit} className="flex-1 py-2 rounded-xl text-sm text-warmDark/75 hover:bg-white/30 transition-all">
          Cancel
        </button>
        <button onClick={handleSave} className="flex-1 py-2 rounded-xl text-sm bg-gradient-to-r from-gold/80 to-coral/70 text-white font-medium hover:from-gold to-coral transition-all">
          {isNew ? 'Add moment' : 'Save'}
        </button>
      </div>
    </div>
  )

  /* ═══════════════════ RENDER ═══════════════════ */

  return (
    <div className="h-full overflow-y-auto">
      {/* ── Cover photo ── */}
      {coverPhoto && (
        <div ref={coverRef} className="relative flex-shrink-0 h-56 overflow-hidden">
          <img src={mediumUrl(coverPhoto)} alt={memory.title} className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
            <div className="flex items-end justify-between gap-2 mb-1">
              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-base text-white leading-snug">{memory.title}</h2>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="font-handwriting text-sm text-white/75">
                    {formatDateFull(memory.date)}
                    {memory.endDate && ` \u2014 ${formatDateFull(memory.endDate)}`}
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
                    {memory.endDate && ` \u2014 ${formatDateFull(memory.endDate)}`}
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
              {/* Loading state */}
              {!substoriesLoaded ? (
                <div className="py-12 flex flex-col items-center gap-3">
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 rounded-full border-2 border-gold/20 border-t-gold animate-spin" style={{ animationDuration: '1.2s' }} />
                    <div className="absolute inset-[4px] rounded-full border border-coral/20 border-t-coral/60 animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }} />
                  </div>
                  <p className="font-handwriting text-lg text-warmDark/75">loading stories...</p>
                </div>

              ) : substories.length === 0 ? (
                /* Empty state — only show if no canvas layout either */
                <div className="py-16">
                  <p className="font-handwriting text-3xl text-warmDark/70 mb-2">No stories yet</p>
                  <p className="font-sans text-sm text-warmDark/70">Add moments from this memory</p>
                </div>

              ) : (
                /* Timeline with substory cards */
                <div className="relative">
                  <div
                    className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-gold/25 via-coral/15 to-teal/15"
                  />

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

                        {/* Substory cards */}
                        <div className="space-y-5 ml-4 pl-8">
                          {groupedByDate[date].map((sub, idx) => {
                            const isExpanded = expandedId === sub.id
                            return (
                              <motion.div
                                key={sub.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (dateIdx * 0.1) + (idx * 0.06), layout: { duration: 0.3, type: 'spring', stiffness: 300, damping: 30 } }}
                                className={`relative rounded-2xl p-4 transition-all ${
                                  isExpanded
                                    ? 'ring-2 ring-gold/40 bg-gold/5 shadow-md'
                                    : 'bg-transparent'
                                }`}
                              >
                                {/* Card — read-only or inline editable */}
                                {isExpanded ? (
                                  <motion.div
                                    key="inline-edit"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {renderInlineEditCard(false)}
                                    {renderEditControls(false)}
                                  </motion.div>
                                ) : (
                                  <CompactCard sub={sub} idx={idx} gradIdx={idx} />
                                )}

                                {/* Separator */}
                                {!isExpanded && <div className="h-px bg-warmMid/5 mt-5" />}
                              </motion.div>
                            )
                          })}
                        </div>

                        <div className="h-6" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom spacer */}
              <div className="h-8" />
            </motion.div>
          ) : (
            /* ── Photos tab ── */
            <motion.div
              key="photos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {!hasMediaItems ? (
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
                        className="rounded-2xl border border-white/30 relative overflow-hidden cursor-pointer bg-black/5 aspect-square"
                        onClick={() => openLightbox(item.url)}
                      >
                        <img src={mediumUrl(item.url)} alt={item.title} className="w-full h-full object-cover rounded-2xl" loading="lazy" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end">
                          <div className="w-full bg-gradient-to-t from-black/40 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.title && <p className="text-white text-sm truncate">{item.title}</p>}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {canvasItems.map((item, i) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (gridItems.length + i) * 0.04 }}
                      className="group"
                    >
                      <div className="rounded-2xl border border-white/30 relative overflow-hidden bg-white/60 aspect-square flex items-center justify-center p-2">
                        <CanvasRenderer data={item.canvasData} />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-end pointer-events-none">
                          <div className="w-full bg-gradient-to-t from-black/30 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.title && <p className="text-white text-sm truncate">{item.title}</p>}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Floating buttons (bottom-right): slideshow + add moment ── */}
      {!showAddForm && !expandedId && !slideshowActive && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
          className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3"
        >
          {(substories.length > 0 || coverPhoto) && (
            <motion.button
              onClick={startSlideshow}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/90 backdrop-blur shadow-lg border border-warmMid/15 text-warmDark/70 hover:text-warmDark transition-colors font-handwriting text-xl"
            >
              <Play className="w-4 h-4 ml-0.5" />
              <span>Relive</span>
            </motion.button>
          )}
          {canEdit && (
            <motion.button
              onClick={startAdd}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-gold to-coral text-white shadow-lg font-sans text-sm font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>New moment</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/50 to-coral/50 blur-md -z-10" />
            </motion.button>
          )}
        </motion.div>
      )}

      {/* ── Slideshow overlay ── */}
      <AnimatePresence>
        {slideshowActive && slideshowSlides.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
          >
            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 px-3 pt-3">
              {slideshowSlides.map((_, i) => (
                <div key={i} className="flex-1 h-0.5 rounded-full bg-white/20 overflow-hidden">
                  <motion.div
                    className="h-full bg-white/80 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{
                      width: i < slideshowIdx ? '100%'
                        : i === slideshowIdx ? (slideshowPaused ? `${(0)}%` : '100%')
                        : '0%'
                    }}
                    transition={i === slideshowIdx && !slideshowPaused ? { duration: 5, ease: 'linear' } : { duration: 0.2 }}
                  />
                </div>
              ))}
            </div>

            {/* Back button */}
            <button
              onClick={() => setSlideshowActive(false)}
              className="absolute top-12 left-4 z-10 flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-sans transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Moments</span>
            </button>

            {/* Slide content */}
            <div className="flex-1 flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slideshowIdx}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="w-full h-full flex flex-col items-center justify-center px-6"
                >
                  {slideshowSlides[slideshowIdx]?.canvasData ? (
                    <div className="max-w-lg w-full">
                      <CanvasRenderer data={slideshowSlides[slideshowIdx].canvasData!} />
                    </div>
                  ) : slideshowSlides[slideshowIdx]?.photo ? (
                    <img
                      src={fullUrl(slideshowSlides[slideshowIdx].photo!)}
                      alt=""
                      className="max-h-[60vh] max-w-full object-contain rounded-2xl shadow-2xl"
                    />
                  ) : (
                    <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-gold/30 to-coral/20 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white/40" />
                    </div>
                  )}

                  <div className="mt-6 text-center max-w-lg">
                    {slideshowSlides[slideshowIdx]?.title && (
                      <h3 className="font-serif text-2xl text-white mb-2">
                        {slideshowSlides[slideshowIdx].title}
                      </h3>
                    )}
                    {slideshowSlides[slideshowIdx]?.text && (
                      <div
                        className="font-sans text-base text-white/75 leading-relaxed line-clamp-4"
                        dangerouslySetInnerHTML={{ __html: slideshowSlides[slideshowIdx].text }}
                      />
                    )}
                    <p className="font-handwriting text-sm text-white/50 mt-3">
                      {formatDate(slideshowSlides[slideshowIdx]?.date || '')}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Nav arrows */}
              {slideshowIdx > 0 && (
                <button
                  onClick={() => setSlideshowIdx(slideshowIdx - 1)}
                  className="absolute left-3 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {slideshowIdx < slideshowSlides.length - 1 && (
                <button
                  onClick={() => setSlideshowIdx(slideshowIdx + 1)}
                  className="absolute right-3 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom controls */}
            <div className="flex items-center justify-center gap-4 pb-8">
              <button
                onClick={() => setSlideshowPaused(!slideshowPaused)}
                className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
              >
                {slideshowPaused ? <Play className="w-5 h-5 ml-0.5" /> : <Pause className="w-5 h-5" />}
              </button>
              <span className="text-white/50 text-sm font-sans">
                {slideshowIdx + 1} / {slideshowSlides.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Add moment popup modal ── */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={resetEdit}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-warmMid/10 p-5 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-serif text-lg text-warmDark">Add a moment</h4>
                <button onClick={resetEdit} className="w-7 h-7 rounded-full hover:bg-warmMid/10 flex items-center justify-center transition-colors">
                  <X className="w-4 h-4 text-warmDark/60" />
                </button>
              </div>
              {renderInlineEditCard(true)}
              {renderEditControls(true)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              src={fullUrl(lightboxPhotos[lightboxIdx])}
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

      {/* ── Image Cropper ── */}
      {cropSrc && (
        <ImageCropper
          imageSrc={cropSrc}
          onCropDone={(croppedUrl) => {
            if (cropIndex !== null) {
              setEditPhotos((prev) => prev.map((url, i) => i === cropIndex ? croppedUrl : url))
            }
            setCropSrc(null)
            setCropIndex(null)
          }}
          onCancel={() => { setCropSrc(null); setCropIndex(null) }}
        />
      )}


    </div>
  )
}
