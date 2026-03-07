import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Tag, Eye, Upload, Loader2 } from 'lucide-react'
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
  const [showVisibility, setShowVisibility] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activeMembers = members?.filter((m) => m.status === 'active') || []

  useEffect(() => {
    if (editMemory) {
      setTitle(editMemory.title)
      setDate(editMemory.date)
      setStory(editMemory.story)
      setLocation(editMemory.location || '')
      setTagsInput(editMemory.tags?.join(', ') || '')
      setVisibleTo(editMemory.visibleTo || [])
      setShowVisibility((editMemory.visibleTo?.length || 0) > 0)
      setPhotos(editMemory.photos || [])
    } else {
      setTitle('')
      setDate(new Date().toISOString().split('T')[0])
      setStory('')
      setLocation('')
      setTagsInput('')
      setVisibleTo([])
      setShowVisibility(false)
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
      visibleTo: showVisibility && visibleTo.length > 0 ? visibleTo : undefined,
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
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || [])
                      if (files.length === 0) return
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
                    }}
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
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full border-2 border-dashed border-warmMid/15 rounded-xl p-6 text-center hover:border-gold/30 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {uploading ? (
                      <div className="flex items-center justify-center gap-2 text-warmDark/50">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-warmDark/40">
                        <Upload className="w-5 h-5" />
                        <span className="text-sm">Tap to upload photos</span>
                      </div>
                    )}
                  </button>
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

                {/* Visibility (group spaces only) */}
                {spaceType === 'group' && activeMembers.length > 0 && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowVisibility(!showVisibility)}
                      className="flex items-center gap-2 text-warmDark/50 hover:text-warmDark/70 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="font-sans text-sm">
                        {showVisibility
                          ? `Visible to ${visibleTo.length || 'none'} selected`
                          : 'Visible to everyone'}
                      </span>
                    </button>
                    {showVisibility && (
                      <div className="mt-3 space-y-2 pl-6">
                        <p className="font-handwriting text-warmDark/50 text-sm mb-2">
                          Only these people can see this memory
                        </p>
                        {activeMembers.map((m) => (
                          <label
                            key={m.userId}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={visibleTo.includes(m.userId)}
                              onChange={() => {
                                setVisibleTo((prev) =>
                                  prev.includes(m.userId)
                                    ? prev.filter((id) => id !== m.userId)
                                    : [...prev, m.userId]
                                )
                              }}
                              className="rounded border-warmMid/20 text-gold focus:ring-gold/30"
                            />
                            <span className="font-sans text-sm text-warmDark">
                              {m.name}
                              {m.userId === currentUserId && (
                                <span className="text-warmDark/40 ml-1">(you)</span>
                              )}
                            </span>
                          </label>
                        ))}
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
