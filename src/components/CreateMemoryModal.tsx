import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Tag, Upload, Loader2, Images, Lock, Globe } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Memory, SpaceMember } from '../types'
import { uploadMultipleImages } from '../cloudinary'

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
  }, [editMemory, isOpen])

  const handleSave = () => {
    if (!title.trim() || !story.trim()) return

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
                className="absolute top-4 right-4 text-warmDark/40 hover:text-warmDark/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="font-serif text-2xl text-warmDark mb-1">
                {editMemory ? 'Edit this memory' : 'A new memory'}
              </h2>
              <p className="font-handwriting text-lg text-warmDark/55 mb-8">
                {editMemory ? 'Change the details of this moment' : 'Write down this moment before it fades...'}
              </p>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give this memory a title..."
                    className="w-full font-serif text-xl text-warmDark bg-transparent border-b border-warmMid/10 pb-2 outline-none focus:border-gold/40 transition-colors placeholder:text-warmDark/35"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="font-handwriting text-warmDark/55 text-lg block mb-1">
                    When did this happen?
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="font-sans text-warmDark bg-white/50 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>

                {/* Story */}
                <div>
                  <label className="font-handwriting text-warmDark/55 text-lg block mb-1">
                    Tell the story
                  </label>
                  <textarea
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="What happened? How did it feel? Write it down like you're telling a friend..."
                    rows={5}
                    className="w-full font-sans text-warmDark bg-white/30 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold/20 transition-all resize-none leading-relaxed"
                  />
                </div>

                {/* Photo upload */}
                <div>
                  <label className="font-handwriting text-warmDark/55 text-lg block mb-2">
                    Add photos
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(Array.from(e.target.files || []))}
                  />
                  {photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {photos.map((url, i) => (
                        <div key={i} className="relative group aspect-square rounded-xl overflow-hidden">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                            className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2 text-warmDark/50 py-4">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-warmMid/15 rounded-xl p-4 flex flex-col items-center gap-1.5 hover:border-gold/30 transition-colors"
                      >
                        <Upload className="w-5 h-5 text-warmDark/40" />
                        <span className="text-xs text-warmDark/40">From Device</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-warmMid/15 rounded-xl p-4 flex flex-col items-center gap-1.5 hover:border-gold/30 transition-colors"
                      >
                        <Images className="w-5 h-5 text-warmDark/40" />
                        <span className="text-xs text-warmDark/40">Google Photos</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-warmDark/40" />
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
                  <Tag className="w-4 h-4 text-warmDark/40" />
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
                    <label className="font-handwriting text-warmDark/60 text-lg flex items-center gap-2 mb-3">
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
                            : 'bg-white/30 border-warmMid/15 text-warmDark/45 hover:border-warmMid/30'
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
                            : 'bg-white/30 border-warmMid/15 text-warmDark/45 hover:border-warmMid/30'
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
                                {checked && <span className="text-white text-xs font-bold">✓</span>}
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
                                {isMe && <span className="text-warmDark/40 text-xs ml-1">(you)</span>}
                              </span>
                              {/* Role badge */}
                              {m.role === 'owner' && <span className="text-xs text-gold/80 font-sans">owner</span>}
                              {m.role === 'admin' && <span className="text-xs text-teal/80 font-sans">admin</span>}
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
    </AnimatePresence>
  )
}
