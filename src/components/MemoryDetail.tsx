import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Plus, Image, BookOpen, Camera, Upload, Loader2, X } from 'lucide-react'
import { useState, useRef } from 'react'
import { Memory, SubStory } from '../types'
import { uploadMultipleImages } from '../cloudinary'

interface Props {
  memory: Memory
  onClose: () => void
  onAddSubstory: (memoryId: string, substory: SubStory) => void
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

const formatDateFull = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

const storyGradients = [
  'from-lavender/40 to-purple-100/30',
  'from-peach/40 to-amber-100/30',
  'from-teal/20 to-cyan-100/25',
  'from-rose-100/40 to-pink-50/30',
  'from-amber-50/50 to-gold/15',
  'from-indigo-50/30 to-lavender/30',
]

export default function MemoryDetail({ memory, onClose, onAddSubstory }: Props) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'photos'>('timeline')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newType, setNewType] = useState<'text' | 'photo' | 'photos'>('text')
  const [newPhotos, setNewPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const substories = memory.substories || []

  const groupedByDate: Record<string, SubStory[]> = {}
  substories.forEach((s) => {
    if (!groupedByDate[s.date]) groupedByDate[s.date] = []
    groupedByDate[s.date].push(s)
  })
  const sortedDates = Object.keys(groupedByDate).sort()

  const handleAddSubstory = () => {
    if (!newTitle.trim() && !newContent.trim()) return
    const substory: SubStory = {
      id: `sub-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: newType,
      title: newTitle.trim() || undefined,
      content: newType === 'text' ? newContent.trim() : undefined,
      caption: newType !== 'text' ? newContent.trim() : undefined,
      photos: newType !== 'text' ? newPhotos : undefined,
    }
    onAddSubstory(memory.id, substory)
    setNewTitle('')
    setNewContent('')
    setNewPhotos([])
    setShowAddForm(false)
  }

  const allPhotos = substories
    .filter((s) => s.type === 'photo' || s.type === 'photos')
    .map((s) => ({ title: s.title || '', caption: s.caption || '', date: s.date }))

  const coverPhoto = memory.photos && memory.photos.length > 0 ? memory.photos[0] : null

  return (
    <div className="h-full flex flex-col">
      {/* Header — cover photo if available, plain otherwise */}
      {coverPhoto ? (
        <div className="flex-shrink-0 relative h-44 overflow-hidden">
          <img src={coverPhoto} alt={memory.title} className="w-full h-full object-cover" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          {/* Tab toggle — top right */}
          <div className="absolute top-3 right-3 flex gap-1">
            <button
              onClick={() => setActiveTab('timeline')}
              title="Stories"
              className={`p-1.5 rounded-lg backdrop-blur-sm transition-all ${activeTab === 'timeline' ? 'bg-white/30 text-white' : 'text-white/60 hover:text-white/90'}`}
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              title="Photos"
              className={`p-1.5 rounded-lg backdrop-blur-sm transition-all ${activeTab === 'photos' ? 'bg-white/30 text-white' : 'text-white/60 hover:text-white/90'}`}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          {/* Text overlaid at bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
            <h2 className="font-serif text-lg text-white leading-snug drop-shadow">{memory.title}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="font-handwriting text-xs text-white/80">
                {formatDateFull(memory.date)}
                {memory.endDate && ` — ${formatDateFull(memory.endDate)}`}
              </span>
              {memory.location && (
                <span className="flex items-center gap-1 text-white/65 text-xs">
                  <MapPin className="w-3 h-3" />
                  {memory.location}
                </span>
              )}
            </div>
            {memory.story && (
              <p className="font-sans text-xs text-white/70 leading-relaxed mt-1 line-clamp-2">
                {memory.story}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-shrink-0 px-5 pt-4 pb-3 border-b border-warmMid/10">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-base text-warmDark leading-snug">{memory.title}</h2>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="font-handwriting text-xs text-warmDark/55">
                  {formatDateFull(memory.date)}
                  {memory.endDate && ` — ${formatDateFull(memory.endDate)}`}
                </span>
                {memory.location && (
                  <span className="flex items-center gap-1 text-warmDark/40 text-xs">
                    <MapPin className="w-3 h-3" />
                    {memory.location}
                  </span>
                )}
              </div>
              {memory.story && (
                <p className="font-sans text-xs text-warmDark/60 leading-relaxed mt-1.5 line-clamp-2">
                  {memory.story}
                </p>
              )}
            </div>
            <div className="flex gap-1 flex-shrink-0 mt-0.5">
              <button
                onClick={() => setActiveTab('timeline')}
                title="Stories"
                className={`p-1.5 rounded-lg transition-all ${activeTab === 'timeline' ? 'bg-gold/20 text-warmDark' : 'text-warmDark/35 hover:text-warmDark/55'}`}
              >
                <BookOpen className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                title="Photos"
                className={`p-1.5 rounded-lg transition-all ${activeTab === 'photos' ? 'bg-gold/20 text-warmDark' : 'text-warmDark/35 hover:text-warmDark/55'}`}
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stories — scrollable, starts strictly below header */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <AnimatePresence mode="wait">
          {activeTab === 'timeline' ? (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {substories.length === 0 ? (
                <div className="py-16">
                  <p className="font-handwriting text-3xl text-warmDark/35 mb-2">No stories yet</p>
                  <p className="font-sans text-sm text-warmDark/30">Add moments from this memory</p>
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
                          <span className="font-handwriting text-xl text-warmDark/55">
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
                            >
                              {/* Text story */}
                              {sub.type === 'text' && (
                                <div className="relative">
                                  {sub.title && (
                                    <h4 className="font-serif text-lg text-warmDark mb-2">
                                      {sub.title}
                                    </h4>
                                  )}
                                  {sub.content && (
                                    <p className="font-sans text-warmDark/65 leading-relaxed">
                                      {sub.content}
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Single photo */}
                              {sub.type === 'photo' && (
                                <div>
                                  {sub.title && <h4 className="font-serif text-lg text-warmDark mb-3">{sub.title}</h4>}
                                  {sub.photos && sub.photos.length > 0 ? (
                                    <img src={sub.photos[0]} alt="" className="w-full rounded-2xl object-cover max-h-64" />
                                  ) : (
                                    <div className={`w-full h-48 rounded-2xl bg-gradient-to-br ${storyGradients[idx % storyGradients.length]} flex items-center justify-center border border-white/40`}>
                                      <Image className="w-10 h-10 text-warmDark/25" />
                                    </div>
                                  )}
                                  {sub.caption && <p className="font-sans text-sm text-warmDark/55 italic mt-3 leading-relaxed">{sub.caption}</p>}
                                </div>
                              )}

                              {/* Photo grid */}
                              {sub.type === 'photos' && (
                                <div>
                                  {sub.title && <h4 className="font-serif text-lg text-warmDark mb-3">{sub.title}</h4>}
                                  {sub.photos && sub.photos.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2">
                                      {sub.photos.map((url, n) => (
                                        <img key={n} src={url} alt="" className="rounded-xl object-cover aspect-square w-full" />
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                      {[0, 1, 2, 3].map((n) => (
                                        <div key={n} className={`h-28 rounded-xl bg-gradient-to-br ${storyGradients[(idx + n) % storyGradients.length]} flex items-center justify-center border border-white/40`}>
                                          <Image className="w-6 h-6 text-warmDark/20" />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {sub.caption && <p className="font-sans text-sm text-warmDark/55 italic mt-3 leading-relaxed">{sub.caption}</p>}
                                </div>
                              )}

                              {/* Separator between stories */}
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

              {/* Add moment */}
              <div className="mt-8">
                {!showAddForm ? (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowAddForm(true)}
                    className="w-full py-4 border-2 border-dashed border-warmMid/30 rounded-2xl text-warmDark/60 hover:border-gold/50 hover:text-warmDark/80 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="font-handwriting text-lg">Add a moment</span>
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/30 rounded-2xl p-6 border border-white/40"
                  >
                    <h4 className="font-serif text-xl text-warmDark mb-5">Add a moment</h4>

                    <div className="flex gap-2 mb-5">
                      {[
                        { type: 'text' as const, icon: BookOpen, label: 'Story' },
                        { type: 'photo' as const, icon: Image, label: 'Photo' },
                        { type: 'photos' as const, icon: Camera, label: 'Photos' },
                      ].map(({ type, icon: Icon, label }) => (
                        <button
                          key={type}
                          onClick={() => setNewType(type)}
                          className={`flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${
                            newType === type
                              ? 'bg-gold/15 text-warmDark ring-1 ring-gold/25'
                              : 'text-warmDark/40 hover:bg-white/30'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {label}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Title for this moment..."
                      className="w-full font-serif text-lg text-warmDark bg-transparent border-b border-warmMid/10 pb-2 mb-4 outline-none focus:border-gold/40 transition-colors placeholder:text-warmDark/35"
                    />

                    <textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder={newType === 'text' ? 'Write down what happened...' : 'Add a caption...'}
                      rows={4}
                      className="w-full font-sans text-warmDark bg-white/40 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold/15 transition-all resize-none leading-relaxed mb-4"
                    />

                    {newType !== 'text' && (
                      <div className="mb-4">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple={newType === 'photos'}
                          className="hidden"
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || [])
                            if (files.length === 0) return
                            setUploading(true)
                            try {
                              const urls = await uploadMultipleImages(files)
                              setNewPhotos((prev) => [...prev, ...urls])
                            } catch {
                              alert('Failed to upload images. Please try again.')
                            } finally {
                              setUploading(false)
                              if (fileInputRef.current) fileInputRef.current.value = ''
                            }
                          }}
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
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="w-full border-2 border-dashed border-warmMid/10 rounded-xl p-6 text-center hover:border-gold/25 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {uploading ? (
                            <div className="flex items-center justify-center gap-2 text-warmDark/50">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span className="text-sm">Uploading...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2 text-warmDark/35">
                              <Upload className="w-5 h-5" />
                              <span className="text-sm">Tap to add photos</span>
                            </div>
                          )}
                        </button>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="flex-1 py-3 rounded-xl text-warmDark/40 hover:bg-white/20 transition-all"
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
                  <Camera className="w-12 h-12 text-warmDark/20 mx-auto mb-3" />
                  <p className="font-handwriting text-3xl text-warmDark/35 mb-2">No photos yet</p>
                  <p className="font-sans text-sm text-warmDark/30">Photos from your stories will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl">
                  {allPhotos.map((photo, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="group"
                    >
                      <div className={`aspect-square rounded-2xl bg-gradient-to-br ${storyGradients[i % storyGradients.length]} flex items-center justify-center border border-white/30 relative overflow-hidden`}>
                        <Image className="w-8 h-8 text-warmDark/20" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-xs truncate">{photo.title}</p>
                        </div>
                      </div>
                      {photo.caption && (
                        <p className="text-xs text-warmDark/40 mt-2 line-clamp-2 font-sans">{photo.caption}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
