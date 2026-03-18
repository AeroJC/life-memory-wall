import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Tag, Upload, Loader2, Images, Lock, Globe, ChevronLeft, ChevronRight, Calendar, Crop } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Memory, SpaceMember } from '../types'
import { uploadMultipleImages } from '../cloudinary'
import ImageCropper from './ImageCropper'
import type { AspectOption } from './ImageCropper'

const COVER_ASPECT_OPTIONS: AspectOption[] = [
  { label: '16:9', value: 16 / 9 },
  { label: '3:2', value: 3 / 2 },
  { label: '4:3', value: 4 / 3 },
  { label: '1:1', value: 1 },
  { label: 'Free', value: undefined },
]

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']

function DatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const parsed = value ? new Date(value + 'T00:00:00') : new Date()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState({ y: parsed.getFullYear(), m: parsed.getMonth() })
  const [showYears, setShowYears] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = value ? new Date(value + 'T00:00:00') : null
  const today = new Date(); today.setHours(0,0,0,0)

  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const firstDay = new Date(view.y, view.m, 1).getDay()

  const displayDate = selected
    ? selected.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Choose a date'

  const pickDay = (d: number) => {
    const ds = `${view.y}-${String(view.m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    onChange(ds); setOpen(false)
  }

  const prevMonth = () => setView(v => v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 })
  const nextMonth = () => setView(v => v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 })

  const yearStart = Math.floor(view.y / 12) * 12
  const years = Array.from({ length: 12 }, (_, i) => yearStart + i)

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => { setOpen(v => !v); setShowYears(false) }}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-gold/15 to-coral/10 border border-gold/25 hover:border-gold/40 transition-all">
        <Calendar className="w-4 h-4 text-gold/70" />
        <span className="font-handwriting text-lg text-warmDark/80">{displayDate}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }} transition={{ duration: 0.18 }}
            className="absolute left-0 top-full mt-2 z-50 bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl p-4 w-72">

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors">
                <ChevronLeft className="w-4 h-4 text-warmDark/60" />
              </button>
              <button onClick={() => setShowYears(v => !v)}
                className="font-handwriting text-lg text-warmDark hover:text-gold/80 transition-colors">
                {MONTHS[view.m]} {view.y}
              </button>
              <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors">
                <ChevronRight className="w-4 h-4 text-warmDark/60" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {showYears ? (
                <motion.div key="years" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-3 gap-1.5">
                  <button onClick={() => setView(v => ({ ...v, y: v.y - 12 }))}
                    className="col-span-3 text-xs text-warmDark/40 hover:text-warmDark/60 pb-1">
                    ‹ earlier
                  </button>
                  {years.map(y => (
                    <button key={y} onClick={() => { setView(v => ({ ...v, y })); setShowYears(false) }}
                      className={`py-1.5 rounded-xl text-sm font-sans transition-all ${
                        y === view.y ? 'bg-gradient-to-br from-gold/80 to-coral/70 text-white font-medium' : 'hover:bg-gold/10 text-warmDark/70'
                      }`}>
                      {y}
                    </button>
                  ))}
                  <button onClick={() => setView(v => ({ ...v, y: v.y + 12 }))}
                    className="col-span-3 text-xs text-warmDark/40 hover:text-warmDark/60 pt-1">
                    later ›
                  </button>
                </motion.div>
              ) : (
                <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Day headers */}
                  <div className="grid grid-cols-7 mb-1">
                    {DAYS.map(d => (
                      <div key={d} className="text-center text-xs text-warmDark/35 font-sans py-1">{d}</div>
                    ))}
                  </div>
                  {/* Day grid */}
                  <div className="grid grid-cols-7 gap-y-0.5">
                    {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                      const thisDate = new Date(view.y, view.m, d)
                      const isSelected = selected && thisDate.getTime() === selected.getTime()
                      const isToday = thisDate.getTime() === today.getTime()
                      return (
                        <button key={d} onClick={() => pickDay(d)}
                          className={`aspect-square w-8 mx-auto rounded-full text-sm font-sans transition-all flex items-center justify-center ${
                            isSelected
                              ? 'bg-gradient-to-br from-gold/80 to-coral/70 text-white shadow-md scale-110'
                              : isToday
                              ? 'border border-gold/40 text-gold/80 hover:bg-gold/10'
                              : 'text-warmDark/70 hover:bg-gold/10'
                          }`}>
                          {d}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: (memory: Memory) => void
  editMemory?: Memory | null
  spaceType?: 'personal' | 'group'
  members?: SpaceMember[]
  currentUserId?: string
}

export default function CreateMemoryModal({ isOpen, onClose, onSave, editMemory, spaceType, members, currentUserId }: Props) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [story, setStory] = useState('')
  const [location, setLocation] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [visibleTo, setVisibleTo] = useState<string[]>([])
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<{ title?: string; story?: string }>({})
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: File[]) => {
    if (!files.length) return
    setUploading(true)
    try {
      const urls = await uploadMultipleImages(files)
      setPhotos((prev) => [...prev, ...urls])
    } catch {
      alert('Failed to upload images. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const activeMembers = members?.filter((m) => m.status === 'active') || []

  useEffect(() => {
    if (editMemory) {
      setTitle(editMemory.title)
      setDate(editMemory.date)
      setStory(editMemory.story)
      setLocation(editMemory.location || '')
      setTagsInput(editMemory.tags?.join(', ') || '')
      setVisibleTo(editMemory.visibleTo || [])
      setPhotos(editMemory.photos || [])
    } else {
      setTitle('')
      setDate(new Date().toISOString().split('T')[0])
      setStory('')
      setLocation('')
      setTagsInput('')
      setVisibleTo([])
      setPhotos([])
    }
    setErrors({})
  }, [editMemory, isOpen])

  const handleSave = () => {
    const newErrors: { title?: string; story?: string } = {}
    if (!title.trim()) newErrors.title = 'Give this memory a title'
    if (!story.trim()) newErrors.story = 'Write down the story of this moment'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({})

    const memory: Memory = {
      id: editMemory?.id || `m-${Date.now()}`,
      title: title.trim(),
      date,
      photos,
      story: story.trim(),
      location: location.trim() || undefined,
      tags: tagsInput
        ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
        : undefined,
      reactions: editMemory?.reactions || {},
      visibleTo: visibleTo,
      createdBy: currentUserId,
    }

    onSave(memory)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-warmDark/20 backdrop-blur-sm" />

          <motion.div
            initial={{ scale: 0.85, opacity: 0, rotateX: 10 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.85, opacity: 0, rotateX: -10 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Journal page */}
            <div className="bg-warmWhite rounded-3xl shadow-2xl p-8 relative">
              {/* Page texture line */}
              <div className="absolute left-12 top-0 bottom-0 w-px bg-coral/10" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-warmDark/75 hover:text-warmDark/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="font-serif text-2xl text-warmDark mb-1">
                {editMemory ? 'Edit this memory' : 'A new memory'}
              </h2>
              <p className="font-handwriting text-xl text-warmDark/75 mb-8">
                {editMemory ? 'Change the details of this moment' : 'Write down this moment before it fades...'}
              </p>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="font-handwriting text-warmDark/75 text-xl block mb-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })) }}
                    placeholder="What's this memory about?"
                    className={`w-full font-sans text-lg text-warmDark bg-transparent border-b pb-2 outline-none transition-colors placeholder:text-warmDark/30 ${errors.title ? 'border-coral/50' : 'border-warmMid/10 focus:border-gold/40'}`}
                  />
                  <AnimatePresence>
                    {errors.title && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-sm text-coral/80 font-sans bg-coral/8 rounded-lg px-3 py-1.5 mt-1.5">
                        {errors.title}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Date */}
                <div>
                  <label className="font-handwriting text-warmDark/75 text-xl block mb-1">
                    When did this happen?
                  </label>
                  <DatePicker value={date} onChange={setDate} />
                </div>

                {/* Story */}
                <div>
                  <label className="font-handwriting text-warmDark/75 text-xl block mb-1">
                    Tell the story
                  </label>
                  <textarea
                    value={story}
                    onChange={(e) => { setStory(e.target.value); setErrors((p) => ({ ...p, story: undefined })) }}
                    placeholder="What happened? How did it feel? Write it down like you're telling a friend..."
                    rows={5}
                    className={`w-full font-sans text-warmDark bg-white/30 rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all resize-none leading-relaxed ${errors.story ? 'ring-2 ring-coral/30 focus:ring-coral/30' : 'focus:ring-gold/20'}`}
                  />
                  <AnimatePresence>
                    {errors.story && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-sm text-coral/80 font-sans bg-coral/8 rounded-lg px-3 py-1.5 mt-1.5">
                        {errors.story}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Photo upload — max 1 cover photo */}
                <div>
                  <label className="font-handwriting text-warmDark/75 text-xl block mb-2">
                    Add cover photo
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []).slice(0, 1)
                      if (files.length > 0) { setPhotos([]); handleFiles(files) }
                    }}
                  />
                  {photos.length > 0 ? (
                    <div className="mb-3">
                      <div className="relative group rounded-xl overflow-hidden mb-2">
                        <img src={photos[0]} alt="" className="w-full aspect-[16/9] object-cover rounded-xl" />
                        <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => setCropSrc(photos[0])}
                            className="w-7 h-7 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                            title="Crop"
                          >
                            <Crop className="w-3.5 h-3.5 text-white" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPhotos([])}
                            className="w-7 h-7 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 text-sm text-warmDark/60 hover:text-warmDark/90 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Change photo
                      </button>
                    </div>
                  ) : uploading ? (
                    <div className="flex items-center justify-center gap-2 text-warmDark/75 py-4">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-warmMid/15 rounded-xl p-4 flex flex-col items-center gap-1.5 hover:border-gold/30 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-warmDark/75" />
                      <span className="text-sm text-warmDark/75">Upload photo</span>
                    </button>
                  )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-warmDark/75" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where were you?"
                    className="flex-1 font-sans text-sm text-warmDark bg-transparent border-b border-warmMid/10 pb-1 outline-none focus:border-gold/40 transition-colors"
                  />
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-warmDark/75" />
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Tags (comma separated)"
                    className="flex-1 font-sans text-sm text-warmDark bg-transparent border-b border-warmMid/10 pb-1 outline-none focus:border-gold/40 transition-colors"
                  />
                </div>

                {/* Visibility — show whenever there are multiple members */}
                {activeMembers.length > 1 && (
                  <div>
                    <label className="font-handwriting text-warmDark/75 text-xl flex items-center gap-2 mb-3">
                      {visibleTo.length === 0
                        ? <Globe className="w-4 h-4 text-teal/60" />
                        : <Lock className="w-4 h-4 text-coral/60" />}
                      Visibility
                    </label>

                    {/* Everyone / Specific people toggle */}
                    <div className="flex gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => setVisibleTo([])}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-sans transition-all ${
                          visibleTo.length === 0
                            ? 'bg-teal/10 border-teal/30 text-teal/80 font-medium'
                            : 'bg-white/30 border-warmMid/15 text-warmDark/75 hover:border-warmMid/30'
                        }`}
                      >
                        <Globe className="w-4 h-4" />
                        Everyone
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (visibleTo.length === 0) {
                            // Pre-select current user when switching to specific
                            setVisibleTo(currentUserId ? [currentUserId] : [activeMembers[0]?.userId])
                          }
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-sans transition-all ${
                          visibleTo.length > 0
                            ? 'bg-coral/10 border-coral/30 text-coral/80 font-medium'
                            : 'bg-white/30 border-warmMid/15 text-warmDark/75 hover:border-warmMid/30'
                        }`}
                      >
                        <Lock className="w-4 h-4" />
                        Specific people
                      </button>
                    </div>

                    {/* Member checklist — shown when "Specific people" */}
                    {visibleTo.length > 0 && (
                      <div className="bg-white/30 rounded-2xl border border-warmMid/10 overflow-hidden">
                        {activeMembers.map((m, i) => {
                          const checked = visibleTo.includes(m.userId)
                          const isMe = m.userId === currentUserId
                          return (
                            <label
                              key={m.userId}
                              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-white/30 ${
                                i < activeMembers.length - 1 ? 'border-b border-warmMid/8' : ''
                              } ${checked ? 'bg-coral/5' : ''}`}
                            >
                              {/* Checkbox */}
                              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                checked ? 'bg-coral/70 border-coral/70' : 'border-warmMid/30 bg-white/50'
                              }`}>
                                {checked && <span className="text-white text-sm font-bold">✓</span>}
                              </div>
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={checked}
                                onChange={() =>
                                  setVisibleTo((prev) =>
                                    prev.includes(m.userId)
                                      ? prev.filter((id) => id !== m.userId)
                                      : [...prev, m.userId]
                                  )
                                }
                              />
                              {/* Avatar */}
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/60 to-coral/50 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {m.name.charAt(0).toUpperCase()}
                              </div>
                              {/* Name */}
                              <span className="font-sans text-sm text-warmDark flex-1">
                                {m.name}
                                {isMe && <span className="text-warmDark/75 text-sm ml-1">(you)</span>}
                              </span>
                              {/* Role badge */}
                              {m.role === 'owner' && <span className="text-sm text-gold/80 font-sans">owner</span>}
                              {m.role === 'admin' && <span className="text-sm text-teal/80 font-sans">admin</span>}
                            </label>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Save button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-serif text-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  {editMemory ? 'Save Changes' : 'Save this memory'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Cover photo cropper */}
      {cropSrc && (
        <ImageCropper
          imageSrc={cropSrc}
          aspectOptions={COVER_ASPECT_OPTIONS}
          defaultAspectIndex={0}
          onCropDone={(croppedUrl) => {
            setPhotos([croppedUrl])
            setCropSrc(null)
          }}
          onCancel={() => setCropSrc(null)}
        />
      )}
    </AnimatePresence>
  )
}
