import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Plus, Image, BookOpen, Camera, Images, Upload, Loader2, X, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import { Memory, SubStory } from '../types'
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

export default function MemoryDetail({ memory, onClose, onAddSubstory, onUpdateSubstory, onDeleteSubstory, canEdit = true }: Props) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'photos'>('timeline')
  const [showAddForm, setShowAddForm] = useState(false)
  const [addFormStep, setAddFormStep] = useState<'pick' | 'edit'>('pick')
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newType, setNewType] = useState<'text' | 'photo' | 'photos' | 'img-left' | 'img-right' | 'img-top' | 'img-bottom'>('text')
  const [newPhotos, setNewPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [editingSubstoryId, setEditingSubstoryId] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

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

  const resetForm = () => {
    setNewTitle(''); setNewContent(''); setNewPhotos([])
    setNewType('text'); setEditingSubstoryId(null); setShowAddForm(false); setAddFormStep('pick')
  }

  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').trim()

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

  const startEditSubstory = (sub: SubStory) => {
    setEditingSubstoryId(sub.id)
    setNewTitle(sub.title || '')
    setNewContent(sub.content || sub.caption || '')
    setNewType(sub.type)
    setNewPhotos(sub.photos || [])
    setAddFormStep('edit')
    setShowAddForm(true)
  }

  const coverGroup = memory.photos?.length
    ? [{ title: memory.title, caption: 'Cover photos', date: memory.date, photos: memory.photos }]
    : []
  const allPhotos = [
    ...coverGroup,
    ...substories
      .filter((s) => s.type !== 'text')
      .map((s) => ({ title: s.title || '', caption: s.caption || '', date: s.date, photos: s.photos || [] })),
  ]

  // Flat list of all photo items for Photos tab grid
  const gridItems = allPhotos.flatMap((photo, i) =>
    photo.photos.length > 0
      ? photo.photos.map((url, j) => ({ url, title: photo.title, caption: photo.caption, key: `${i}-${j}` }))
      : [{ url: null as string | null, title: photo.title, caption: photo.caption, key: `${i}-0` }]
  )
  const lightboxPhotos = gridItems.filter((item) => item.url !== null).map((item) => item.url as string)

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

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

  return (
    <div className="h-full overflow-y-auto">
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
                <div className="w-px h-4 bg-white/20 mx-0.5" />
                <button
                  onClick={() => { setEditMode((v) => !v); if (editMode) resetForm() }}
                  title={editMode ? 'Done editing' : 'Edit moments'}
                  className={`p-1.5 rounded-lg transition-all ${editMode ? 'bg-coral/40 text-white' : 'text-white/70 hover:text-white'}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
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
            {canEdit && (
              <>
                <div className="w-px h-4 bg-warmMid/20 mx-0.5" />
                <button
                  onClick={() => { setEditMode((v) => !v); if (editMode) resetForm() }}
                  title={editMode ? 'Done editing' : 'Edit moments'}
                  className={`p-1.5 rounded-lg transition-all ${
                    editMode ? 'bg-coral/10 text-coral' : 'text-warmDark/70 hover:text-warmDark/70'
                  }`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </>
            )}
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
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: (dateIdx * 0.1) + (idx * 0.06) }}
                              className="relative"
                            >
                              {/* Edit / Delete actions — only visible in edit mode for edit-permission members */}
                              {canEdit && editMode && (
                                <div className="absolute -top-1 right-0 flex gap-1 z-10">
                                  <button
                                    onClick={() => startEditSubstory(sub)}
                                    className="w-6 h-6 rounded-lg bg-white/80 shadow flex items-center justify-center text-warmDark/75 hover:text-warmDark transition-colors"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => onDeleteSubstory(memory.id, sub.id)}
                                    className="w-6 h-6 rounded-lg bg-white/80 shadow flex items-center justify-center text-coral/60 hover:text-coral transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}

                              {/* Text story */}
                              {sub.type === 'text' && (
                                <div className="relative">
                                  {sub.title && (
                                    <h4 className="font-serif text-lg font-bold text-warmDark mb-2">
                                      {sub.title}
                                    </h4>
                                  )}
                                  {sub.content && (
                                    <div className="font-sans text-warmDark/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: sub.content }} />
                                  )}
                                </div>
                              )}

                              {/* Image left, text right */}
                              {(sub.type === 'img-left' || sub.type === 'photo') && (
                                <div>
                                  {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3">{sub.title}</h4>}
                                  <div className="flex gap-3 items-center">
                                    <div className="w-1/2 flex-shrink-0 bg-black/5 rounded-xl overflow-hidden">
                                      {sub.photos && sub.photos.length > 0 ? (
                                        <img src={sub.photos[0]} alt="" className="w-full rounded-xl object-contain" />
                                      ) : (
                                        <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${storyGradients[idx % storyGradients.length]} flex items-center justify-center border border-white/40`}>
                                          <Image className="w-8 h-8 text-warmDark/75" />
                                        </div>
                                      )}
                                    </div>
                                    {sub.caption && (
                                      <div className={`font-sans text-warmDark/90 flex-1 ${captionFontClass(sub.caption)}`} dangerouslySetInnerHTML={{ __html: sub.caption }} />
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Text left, image right */}
                              {sub.type === 'img-right' && (
                                <div>
                                  {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3">{sub.title}</h4>}
                                  <div className="flex gap-3 items-center">
                                    {sub.caption && (
                                      <div className={`font-sans text-warmDark/90 flex-1 ${captionFontClass(sub.caption)}`} dangerouslySetInnerHTML={{ __html: sub.caption }} />
                                    )}
                                    <div className="w-1/2 flex-shrink-0 bg-black/5 rounded-xl overflow-hidden">
                                      {sub.photos && sub.photos.length > 0 ? (
                                        <img src={sub.photos[0]} alt="" className="w-full rounded-xl object-contain" />
                                      ) : (
                                        <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${storyGradients[idx % storyGradients.length]} flex items-center justify-center border border-white/40`}>
                                          <Image className="w-8 h-8 text-warmDark/75" />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Image top, text below */}
                              {sub.type === 'img-top' && (
                                <div>
                                  {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3">{sub.title}</h4>}
                                  {sub.photos && sub.photos.length > 0 ? (
                                    <img src={sub.photos[0]} alt="" className="w-3/5 rounded-2xl object-contain bg-black/5 mb-3" />
                                  ) : (
                                    <div className={`w-3/5 h-44 rounded-2xl bg-gradient-to-br ${storyGradients[idx % storyGradients.length]} flex items-center justify-center border border-white/40 mb-3`}>
                                      <Image className="w-10 h-10 text-warmDark/75" />
                                    </div>
                                  )}
                                  {sub.caption && <div className="font-sans text-sm text-warmDark/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: sub.caption }} />}
                                </div>
                              )}

                              {/* Text top, image below */}
                              {sub.type === 'img-bottom' && (
                                <div>
                                  {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3">{sub.title}</h4>}
                                  {sub.caption && <div className="font-sans text-sm text-warmDark/75 leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: sub.caption }} />}
                                  {sub.photos && sub.photos.length > 0 ? (
                                    <img src={sub.photos[0]} alt="" className="w-3/5 rounded-2xl object-contain bg-black/5" />
                                  ) : (
                                    <div className={`w-3/5 h-44 rounded-2xl bg-gradient-to-br ${storyGradients[idx % storyGradients.length]} flex items-center justify-center border border-white/40`}>
                                      <Image className="w-10 h-10 text-warmDark/75" />
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Photo grid */}
                              {sub.type === 'photos' && (
                                <div>
                                  {sub.title && <h4 className="font-serif text-lg font-bold text-warmDark mb-3">{sub.title}</h4>}
                                  {sub.photos && sub.photos.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2">
                                      {sub.photos.map((url, n) => (
                                        <img key={n} src={url} alt="" className="rounded-xl object-contain bg-black/5 w-full" />
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                      {[0, 1, 2, 3].map((n) => (
                                        <div key={n} className={`h-28 rounded-xl bg-gradient-to-br ${storyGradients[(idx + n) % storyGradients.length]} flex items-center justify-center border border-white/40`}>
                                          <Image className="w-6 h-6 text-warmDark/75" />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {sub.caption && <div className="font-sans text-sm text-warmDark/90 italic mt-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: sub.caption }} />}
                                </div>
                              )}

                              {/* Separator between stories */}
                              <div className="h-px bg-warmMid/5 mt-5" />

                              {/* Inline edit form — appears directly below this substory */}
                              <AnimatePresence>
                                {editingSubstoryId === sub.id && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="mt-3 mb-2 bg-white/40 rounded-2xl p-4 border border-white/40"
                                  >
                                    {/* Layout picker */}
                                    <div className="mb-3">
                                      <p className="font-handwriting text-warmDark/75 text-sm mb-1.5">Layout</p>
                                      <div className="grid grid-cols-6 gap-1.5">
                                        {([
                                          { type: 'text', preview: <div className="flex flex-col gap-0.5 w-full px-0.5"><div className="h-1 bg-warmDark/25 rounded-full"/><div className="h-1 bg-warmDark/15 rounded-full w-4/5"/><div className="h-1 bg-warmDark/15 rounded-full"/></div> },
                                          { type: 'img-left', preview: <div className="flex gap-0.5 w-full px-0.5"><div className="w-1/2 h-5 bg-gold/30 rounded"/><div className="flex-1 flex flex-col gap-0.5 justify-center"><div className="h-1 bg-warmDark/20 rounded-full"/><div className="h-1 bg-warmDark/12 rounded-full w-4/5"/></div></div> },
                                          { type: 'img-right', preview: <div className="flex gap-0.5 w-full px-0.5"><div className="flex-1 flex flex-col gap-0.5 justify-center"><div className="h-1 bg-warmDark/20 rounded-full"/><div className="h-1 bg-warmDark/12 rounded-full w-4/5"/></div><div className="w-1/2 h-5 bg-coral/30 rounded"/></div> },
                                          { type: 'img-top', preview: <div className="flex flex-col gap-0.5 w-full px-0.5"><div className="h-3.5 bg-lavender/50 rounded w-full"/><div className="h-1 bg-warmDark/20 rounded-full"/><div className="h-1 bg-warmDark/12 rounded-full w-4/5"/></div> },
                                          { type: 'img-bottom', preview: <div className="flex flex-col gap-0.5 w-full px-0.5"><div className="h-1 bg-warmDark/20 rounded-full"/><div className="h-1 bg-warmDark/12 rounded-full w-4/5"/><div className="h-3.5 bg-teal/30 rounded w-full"/></div> },
                                          { type: 'photos', preview: <div className="grid grid-cols-2 gap-0.5 w-full px-0.5"><div className="h-2.5 bg-gold/25 rounded"/><div className="h-2.5 bg-coral/25 rounded"/><div className="h-2.5 bg-lavender/35 rounded"/><div className="h-2.5 bg-teal/25 rounded"/></div> },
                                        ] as { type: typeof newType; preview: React.ReactNode }[]).map(({ type, preview }) => (
                                          <button
                                            key={type}
                                            onClick={() => setNewType(type)}
                                            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all ${newType === type ? 'border-gold/50 bg-gold/10 ring-1 ring-gold/25' : 'border-warmMid/10 hover:border-warmMid/20 hover:bg-white/20'}`}
                                          >
                                            <div className="w-full h-7 flex items-center justify-center">{preview}</div>
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    <input
                                      type="text"
                                      value={newTitle}
                                      onChange={(e) => setNewTitle(e.target.value)}
                                      placeholder="Title..."
                                      className="w-full font-serif text-base text-warmDark bg-transparent border-b border-warmMid/10 pb-2 mb-3 outline-none focus:border-gold/40 transition-colors placeholder:text-warmDark/70"
                                    />
                                    <RichTextEditor
                                      value={newContent}
                                      onChange={setNewContent}
                                      placeholder={newType === 'text' ? 'Write your story...' : 'Caption...'}
                                      className="mb-3"
                                    />
                                    {newType !== 'text' && (
                                      <div className="mb-3">
                                        <input ref={editFileInputRef} type="file" accept="image/*" multiple className="hidden"
                                          onChange={(e) => handlePhotoFiles(Array.from(e.target.files || []), setNewPhotos, editFileInputRef)} />
                                        {newPhotos.length > 0 && (
                                          <div className="grid grid-cols-3 gap-1.5 mb-2">
                                            {newPhotos.map((url, pi) => (
                                              <div key={pi} className="relative group aspect-square rounded-lg overflow-hidden">
                                                <img src={url} alt="" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => setNewPhotos((p) => p.filter((_, idx) => idx !== pi))}
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
                                      <button onClick={resetForm} className="flex-1 py-2 rounded-xl text-sm text-warmDark/75 hover:bg-white/20 transition-all">Cancel</button>
                                      <button onClick={handleSaveSubstory} className="flex-1 py-2 rounded-xl text-sm bg-gradient-to-r from-gold/80 to-coral/70 text-white font-medium">Save changes</button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </div>

                        <div className="h-6" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add moment — only for edit-permission members, hidden while inline editing */}
              <div className="mt-8">
                {canEdit && !showAddForm && !editingSubstoryId ? (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowAddForm(true)}
                    className="w-full py-4 border-2 border-dashed border-warmMid/30 rounded-2xl text-warmDark/70 hover:border-gold/50 hover:text-warmDark/80 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="font-handwriting text-lg">Add a moment</span>
                  </motion.button>
                ) : !editingSubstoryId ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/30 rounded-2xl p-6 border border-white/40"
                  >
                    <AnimatePresence mode="wait">
                      {/* ── Step 1: Pick a layout ── */}
                      {addFormStep === 'pick' && (
                        <motion.div key="pick" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                          <div className="flex items-center justify-between mb-5">
                            <h4 className="font-serif text-xl text-warmDark">Choose a layout</h4>
                            <button onClick={resetForm} className="text-warmDark/40 hover:text-warmDark/70 transition-colors"><X className="w-5 h-5" /></button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              {
                                type: 'text' as const,
                                label: 'Story',
                                desc: 'Just text',
                                preview: (
                                  <div className="flex flex-col gap-1.5 w-full px-2 py-1">
                                    <div className="h-2 bg-warmDark/25 rounded-full w-full" />
                                    <div className="h-2 bg-warmDark/15 rounded-full w-4/5" />
                                    <div className="h-2 bg-warmDark/15 rounded-full w-full" />
                                    <div className="h-2 bg-warmDark/15 rounded-full w-3/5" />
                                  </div>
                                ),
                              },
                              {
                                type: 'img-left' as const,
                                label: 'Photo left',
                                desc: 'Image + text side by side',
                                preview: (
                                  <div className="flex gap-1.5 w-full px-2 py-1">
                                    <div className="w-2/5 h-14 bg-gold/35 rounded-lg" />
                                    <div className="flex-1 flex flex-col gap-1.5 justify-center">
                                      <div className="h-2 bg-warmDark/20 rounded-full w-full" />
                                      <div className="h-2 bg-warmDark/12 rounded-full w-4/5" />
                                      <div className="h-2 bg-warmDark/12 rounded-full w-full" />
                                    </div>
                                  </div>
                                ),
                              },
                              {
                                type: 'img-right' as const,
                                label: 'Photo right',
                                desc: 'Text + image side by side',
                                preview: (
                                  <div className="flex gap-1.5 w-full px-2 py-1">
                                    <div className="flex-1 flex flex-col gap-1.5 justify-center">
                                      <div className="h-2 bg-warmDark/20 rounded-full w-full" />
                                      <div className="h-2 bg-warmDark/12 rounded-full w-4/5" />
                                      <div className="h-2 bg-warmDark/12 rounded-full w-full" />
                                    </div>
                                    <div className="w-2/5 h-14 bg-coral/35 rounded-lg" />
                                  </div>
                                ),
                              },
                              {
                                type: 'img-top' as const,
                                label: 'Photo top',
                                desc: 'Image above text',
                                preview: (
                                  <div className="flex flex-col gap-1.5 w-full px-2 py-1">
                                    <div className="h-10 bg-lavender/50 rounded-lg w-full" />
                                    <div className="h-2 bg-warmDark/20 rounded-full w-full" />
                                    <div className="h-2 bg-warmDark/12 rounded-full w-4/5" />
                                  </div>
                                ),
                              },
                              {
                                type: 'img-bottom' as const,
                                label: 'Photo below',
                                desc: 'Text above image',
                                preview: (
                                  <div className="flex flex-col gap-1.5 w-full px-2 py-1">
                                    <div className="h-2 bg-warmDark/20 rounded-full w-full" />
                                    <div className="h-2 bg-warmDark/12 rounded-full w-4/5" />
                                    <div className="h-10 bg-teal/35 rounded-lg w-full" />
                                  </div>
                                ),
                              },
                              {
                                type: 'photos' as const,
                                label: 'Photo grid',
                                desc: 'Gallery of images',
                                preview: (
                                  <div className="grid grid-cols-2 gap-1 w-full px-2 py-1">
                                    <div className="h-7 bg-gold/30 rounded-lg" />
                                    <div className="h-7 bg-coral/30 rounded-lg" />
                                    <div className="h-7 bg-lavender/40 rounded-lg" />
                                    <div className="h-7 bg-teal/30 rounded-lg" />
                                  </div>
                                ),
                              },
                            ].map(({ type, label, desc, preview }) => (
                              <button
                                key={type}
                                onClick={() => { setNewType(type); setAddFormStep('edit') }}
                                className="flex flex-col items-center gap-2 p-3 rounded-xl border border-warmMid/10 hover:border-gold/40 hover:bg-gold/5 hover:shadow-md transition-all text-left"
                              >
                                <div className="w-full h-16 flex items-center justify-center bg-white/40 rounded-lg">
                                  {preview}
                                </div>
                                <div className="w-full">
                                  <p className="font-sans text-sm font-medium text-warmDark leading-none">{label}</p>
                                  <p className="font-sans text-xs text-warmDark/50 mt-0.5">{desc}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* ── Step 2: Layout-aware edit form ── */}
                      {addFormStep === 'edit' && (
                        <motion.div key="edit" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
                          {/* Header */}
                          <div className="flex items-center gap-2 mb-4">
                            {!editingSubstoryId && (
                              <button onClick={() => { setAddFormStep('pick'); setNewTitle(''); setNewContent(''); setNewPhotos([]) }}
                                className="p-1.5 -ml-1 rounded-lg text-warmDark/50 hover:text-warmDark/80 hover:bg-white/40 transition-all">
                                <ChevronLeft className="w-5 h-5" />
                              </button>
                            )}
                            <h4 className="font-serif text-xl text-warmDark flex-1">
                              {editingSubstoryId ? 'Edit moment' : ({ text: 'Story', 'img-left': 'Photo left', 'img-right': 'Photo right', 'img-top': 'Photo top', 'img-bottom': 'Photo below', photos: 'Photo grid', photo: 'Photo' } as Record<string,string>)[newType]}
                            </h4>
                            <button onClick={resetForm} className="text-warmDark/40 hover:text-warmDark/70 transition-colors"><X className="w-5 h-5" /></button>
                          </div>

                          {/* Title — all layouts */}
                          <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Title for this moment..."
                            className="w-full font-serif text-lg text-warmDark bg-transparent border-b border-warmMid/10 pb-2 mb-4 outline-none focus:border-gold/40 transition-colors placeholder:text-warmDark/70" />

                          {/* Hidden file input */}
                          <input ref={fileInputRef} type="file" accept="image/*"
                            multiple={newType === 'photos' || newType === 'photo'}
                            className="hidden"
                            onChange={(e) => {
                              const files = Array.from(e.target.files || [])
                              const limited = (newType === 'photos' || newType === 'photo') ? files : files.slice(0, 1)
                              handlePhotoFiles(limited, setNewPhotos, fileInputRef)
                            }} />

                          {/* ── text: full-width editor ── */}
                          {newType === 'text' && (
                            <RichTextEditor value={newContent} onChange={setNewContent}
                              placeholder="Write down what happened..." className="mb-4" />
                          )}

                          {/* ── img-left: image left | text right ── */}
                          {newType === 'img-left' && (
                            <div className="flex gap-3 mb-4" style={{ minHeight: 140 }}>
                              <div className="w-2/5 shrink-0">
                                {newPhotos[0] ? (
                                  <div className="relative group h-full rounded-xl overflow-hidden">
                                    <img src={newPhotos[0]} alt="" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => setNewPhotos([])}
                                      className="absolute top-1.5 right-1.5 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <X className="w-3.5 h-3.5 text-white" />
                                    </button>
                                  </div>
                                ) : (
                                  <button type="button" onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-full min-h-[120px] border-2 border-dashed border-warmMid/20 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-gold/40 hover:bg-gold/5 transition-all">
                                    {uploading ? <Loader2 className="w-6 h-6 animate-spin text-warmDark/40" /> : <><Upload className="w-6 h-6 text-warmDark/40" /><span className="text-sm text-warmDark/50">Choose image</span></>}
                                  </button>
                                )}
                              </div>
                              <div className="flex-1">
                                <RichTextEditor value={newContent} onChange={setNewContent} placeholder="Add a caption..." />
                              </div>
                            </div>
                          )}

                          {/* ── img-right: text left | image right ── */}
                          {newType === 'img-right' && (
                            <div className="flex gap-3 mb-4" style={{ minHeight: 140 }}>
                              <div className="flex-1">
                                <RichTextEditor value={newContent} onChange={setNewContent} placeholder="Add a caption..." />
                              </div>
                              <div className="w-2/5 shrink-0">
                                {newPhotos[0] ? (
                                  <div className="relative group h-full rounded-xl overflow-hidden">
                                    <img src={newPhotos[0]} alt="" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => setNewPhotos([])}
                                      className="absolute top-1.5 right-1.5 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <X className="w-3.5 h-3.5 text-white" />
                                    </button>
                                  </div>
                                ) : (
                                  <button type="button" onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-full min-h-[120px] border-2 border-dashed border-warmMid/20 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-gold/40 hover:bg-gold/5 transition-all">
                                    {uploading ? <Loader2 className="w-6 h-6 animate-spin text-warmDark/40" /> : <><Upload className="w-6 h-6 text-warmDark/40" /><span className="text-sm text-warmDark/50">Choose image</span></>}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* ── img-top: image on top, text below ── */}
                          {newType === 'img-top' && (
                            <div className="flex flex-col gap-3 mb-4">
                              {newPhotos[0] ? (
                                <div className="relative group rounded-xl overflow-hidden" style={{ minHeight: 160 }}>
                                  <img src={newPhotos[0]} alt="" className="w-full object-cover rounded-xl" style={{ maxHeight: 220 }} />
                                  <button type="button" onClick={() => setNewPhotos([])}
                                    className="absolute top-1.5 right-1.5 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="w-3.5 h-3.5 text-white" />
                                  </button>
                                </div>
                              ) : (
                                <button type="button" onClick={() => fileInputRef.current?.click()}
                                  className="w-full border-2 border-dashed border-warmMid/20 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-gold/40 hover:bg-gold/5 transition-all" style={{ minHeight: 160 }}>
                                  {uploading ? <Loader2 className="w-6 h-6 animate-spin text-warmDark/40" /> : <><Upload className="w-6 h-6 text-warmDark/40" /><span className="text-sm text-warmDark/50">Choose image</span></>}
                                </button>
                              )}
                              <RichTextEditor value={newContent} onChange={setNewContent} placeholder="Add a caption..." />
                            </div>
                          )}

                          {/* ── img-bottom: text on top, image below ── */}
                          {newType === 'img-bottom' && (
                            <div className="flex flex-col gap-3 mb-4">
                              <RichTextEditor value={newContent} onChange={setNewContent} placeholder="Add a caption..." />
                              {newPhotos[0] ? (
                                <div className="relative group rounded-xl overflow-hidden" style={{ minHeight: 160 }}>
                                  <img src={newPhotos[0]} alt="" className="w-full object-cover rounded-xl" style={{ maxHeight: 220 }} />
                                  <button type="button" onClick={() => setNewPhotos([])}
                                    className="absolute top-1.5 right-1.5 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="w-3.5 h-3.5 text-white" />
                                  </button>
                                </div>
                              ) : (
                                <button type="button" onClick={() => fileInputRef.current?.click()}
                                  className="w-full border-2 border-dashed border-warmMid/20 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-gold/40 hover:bg-gold/5 transition-all" style={{ minHeight: 160 }}>
                                  {uploading ? <Loader2 className="w-6 h-6 animate-spin text-warmDark/40" /> : <><Upload className="w-6 h-6 text-warmDark/40" /><span className="text-sm text-warmDark/50">Choose image</span></>}
                                </button>
                              )}
                            </div>
                          )}

                          {/* ── photos / photo: multi-image grid ── */}
                          {(newType === 'photos' || newType === 'photo') && (
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              {[...newPhotos, null].slice(0, Math.max(newPhotos.length + 1, 2)).map((url, i) =>
                                url ? (
                                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden">
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => setNewPhotos((p) => p.filter((_, idx) => idx !== i))}
                                      className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <X className="w-3 h-3 text-white" />
                                    </button>
                                  </div>
                                ) : (
                                  <button key={`add-${i}`} type="button" onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square border-2 border-dashed border-warmMid/20 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:border-gold/40 hover:bg-gold/5 transition-all">
                                    {uploading ? <Loader2 className="w-5 h-5 animate-spin text-warmDark/40" /> : <><Upload className="w-5 h-5 text-warmDark/40" /><span className="text-xs text-warmDark/50">Add photo</span></>}
                                  </button>
                                )
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-3">
                            <button onClick={resetForm} className="flex-1 py-3 rounded-xl text-warmDark/75 hover:bg-white/20 transition-all">Cancel</button>
                            <button onClick={handleSaveSubstory} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-medium">
                              {editingSubstoryId ? 'Save changes' : 'Add moment'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : null}
              </div>
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
                          <img src={item.url} alt={item.title} className="w-full object-contain" />
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
