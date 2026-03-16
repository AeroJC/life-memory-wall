import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Type, Heading1, Image, Trash2, Upload, Loader2,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Search, GripVertical, Plus, X,
} from 'lucide-react'
import { EditorBlock, CanvasData } from '../types'
import { sanitizeHtml } from '../utils/sanitize'
import { uploadMultipleImages, mediumUrl } from '../cloudinary'

/* ── Font catalogue ── */
const FONT_CATEGORIES: Record<string, { label: string; fonts: string[] }> = {
  handwriting: {
    label: 'Handwriting',
    fonts: ['Dancing Script', 'Pacifico', 'Caveat', 'Satisfy', 'Great Vibes', 'Sacramento', 'Allura', 'Indie Flower', 'Shadows Into Light', 'Amatic SC'],
  },
  serif: {
    label: 'Serif',
    fonts: ['Playfair Display', 'Merriweather', 'Lora', 'Cormorant Garamond', 'Libre Baskerville', 'EB Garamond', 'Crimson Text', 'PT Serif', 'Spectral', 'Source Serif 4'],
  },
  'sans-serif': {
    label: 'Sans Serif',
    fonts: ['Inter', 'Poppins', 'Montserrat', 'Open Sans', 'Raleway', 'Nunito', 'Quicksand', 'DM Sans', 'Work Sans', 'Outfit'],
  },
  display: {
    label: 'Display',
    fonts: ['Abril Fatface', 'Lobster', 'Righteous', 'Bebas Neue', 'Fredoka', 'Paytone One', 'Lilita One', 'Bangers', 'Concert One', 'Black Ops One'],
  },
}
const ALL_FONTS = Object.values(FONT_CATEGORIES).flatMap(c => c.fonts)

const loadedFonts = new Set<string>()
function loadGoogleFont(font: string) {
  if (loadedFonts.has(font)) return
  loadedFonts.add(font)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;700&display=swap`
  document.head.appendChild(link)
}

/* ── Helpers ── */
let blockIdCounter = 0
function newId() { return `block_${Date.now()}_${++blockIdCounter}` }

function createBlock(type: EditorBlock['type'], canvasW: number, canvasH: number): EditorBlock {
  const base = {
    id: newId(),
    type,
    x: Math.round(canvasW / 2 - (canvasW * 0.35)),
    y: Math.round(canvasH / 2 - 25),
    width: Math.round(canvasW * 0.7),
    height: 50,
  }
  if (type === 'text') return { ...base, content: 'Type your text here...', style: { fontSize: 14, color: '#4a3728', fontFamily: 'DM Sans' } }
  if (type === 'heading') return { ...base, height: 40, content: 'Heading', style: { fontSize: 22, color: '#4a3728', fontFamily: 'Playfair Display', bold: true } }
  return { ...base, width: Math.round(canvasW * 0.6), height: Math.round(canvasH * 0.5), imageUrl: '' }
}

/* ── Inline Canvas Editor Component ── */

interface Props {
  initialData?: CanvasData
  onChange?: (data: CanvasData) => void
}

const CANVAS_W = 480
const CANVAS_H = 220

export default function MomentEditor({ initialData, onChange }: Props) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialData?.blocks || [])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showFontPicker, setShowFontPicker] = useState(false)
  const [fontSearch, setFontSearch] = useState('')
  const [fontCategory, setFontCategory] = useState('handwriting')
  const [uploading, setUploading] = useState(false)
  const [editingTextId, setEditingTextId] = useState<string | null>(null)

  const canvasRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ blockId: string; startX: number; startY: number; origX: number; origY: number } | null>(null)
  const resizeRef = useRef<{ blockId: string; startX: number; startY: number; origW: number; origH: number } | null>(null)
  const imgPanRef = useRef<{ blockId: string; startX: number; startY: number; origOX: number; origOY: number } | null>(null)

  const selected = blocks.find(b => b.id === selectedId) || null

  // Notify parent of changes
  useEffect(() => {
    onChange?.({ width: CANVAS_W, height: CANVAS_H, background: 'transparent', blocks })
  }, [blocks])

  // Load fonts
  useEffect(() => {
    if (selected?.style?.fontFamily) loadGoogleFont(selected.style.fontFamily)
  }, [selected?.style?.fontFamily])

  useEffect(() => {
    if (showFontPicker) FONT_CATEGORIES[fontCategory]?.fonts.forEach(loadGoogleFont)
  }, [showFontPicker, fontCategory])

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (editingTextId) return
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault()
        setBlocks(prev => prev.filter(b => b.id !== selectedId))
        setSelectedId(null)
      }
      if (e.key === 'Escape') {
        if (showFontPicker) setShowFontPicker(false)
        else setSelectedId(null)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedId, editingTextId, showFontPicker])

  const updateBlock = useCallback((id: string, patch: Partial<EditorBlock>) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...patch } : b))
  }, [])

  const updateBlockStyle = useCallback((id: string, stylePatch: Partial<EditorBlock['style']>) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, style: { ...b.style, ...stylePatch } } : b))
  }, [])

  const getCanvasScale = () => {
    if (!canvasRef.current) return 1
    return canvasRef.current.offsetWidth / CANVAS_W
  }

  /* ── Drag ── */
  const startDrag = (e: React.MouseEvent, blockId: string) => {
    if (editingTextId === blockId) return
    e.preventDefault()
    e.stopPropagation()
    const block = blocks.find(b => b.id === blockId)!
    dragRef.current = { blockId, startX: e.clientX, startY: e.clientY, origX: block.x, origY: block.y }
    setSelectedId(blockId)
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      const { blockId: id, startX, startY, origX, origY } = dragRef.current
      const scale = getCanvasScale()
      const dx = (ev.clientX - startX) / scale
      const dy = (ev.clientY - startY) / scale
      updateBlock(id, { x: Math.round(origX + dx), y: Math.round(origY + dy) })
    }
    const onUp = () => { dragRef.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  /* ── Resize ── */
  const startResize = (e: React.MouseEvent, blockId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const block = blocks.find(b => b.id === blockId)!
    resizeRef.current = { blockId, startX: e.clientX, startY: e.clientY, origW: block.width, origH: block.height }
    const onMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return
      const { blockId: id, startX, startY, origW, origH } = resizeRef.current
      const scale = getCanvasScale()
      updateBlock(id, {
        width: Math.max(40, Math.round(origW + (ev.clientX - startX) / scale)),
        height: Math.max(20, Math.round(origH + (ev.clientY - startY) / scale)),
      })
    }
    const onUp = () => { resizeRef.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  /* ── Image pan (drag image within its frame) ── */
  const startImagePan = (e: React.MouseEvent, blockId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const block = blocks.find(b => b.id === blockId)!
    imgPanRef.current = { blockId, startX: e.clientX, startY: e.clientY, origOX: block.imageOffsetX ?? 50, origOY: block.imageOffsetY ?? 50 }
    setSelectedId(blockId)
    const onMove = (ev: MouseEvent) => {
      if (!imgPanRef.current) return
      const { blockId: id, startX, startY, origOX, origOY } = imgPanRef.current
      // Sensitivity: moving mouse by the block's pixel size = 100% offset change
      const b = blocks.find(bl => bl.id === id)
      const scale = getCanvasScale()
      const bw = (b?.width || 100) * scale
      const bh = (b?.height || 100) * scale
      const dx = -((ev.clientX - startX) / bw) * 100
      const dy = -((ev.clientY - startY) / bh) * 100
      updateBlock(id, {
        imageOffsetX: Math.max(0, Math.min(100, Math.round(origOX + dx))),
        imageOffsetY: Math.max(0, Math.min(100, Math.round(origOY + dy))),
      })
    }
    const onUp = () => { imgPanRef.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  /* ── Image upload ── */
  const handleImageUpload = async (blockId: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/jpeg,image/png,image/webp,image/gif'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      setUploading(true)
      try {
        const [url] = await uploadMultipleImages([file])
        updateBlock(blockId, { imageUrl: url })
      } catch (err) { console.error('Upload failed:', err) }
      finally { setUploading(false) }
    }
    input.click()
  }

  const addBlock = (type: EditorBlock['type']) => {
    const block = createBlock(type, CANVAS_W, CANVAS_H)
    setBlocks(prev => [...prev, block])
    setSelectedId(block.id)
    if (type === 'image') handleImageUpload(block.id)
  }

  const deleteSelected = () => {
    if (!selectedId) return
    setBlocks(prev => prev.filter(b => b.id !== selectedId))
    setSelectedId(null)
  }

  const filteredFonts = fontSearch.trim()
    ? ALL_FONTS.filter(f => f.toLowerCase().includes(fontSearch.toLowerCase()))
    : FONT_CATEGORIES[fontCategory]?.fonts || []

  useEffect(() => {
    if (fontSearch.trim()) filteredFonts.slice(0, 10).forEach(loadGoogleFont)
  }, [fontSearch])

  const handleTextDoubleClick = (blockId: string) => { setEditingTextId(blockId); setSelectedId(blockId) }
  const handleTextBlur = (blockId: string, newContent: string) => { updateBlock(blockId, { content: newContent }); setEditingTextId(null) }

  return (
    <div ref={wrapperRef} className="relative space-y-2">
      {/* ── Compact Toolbar ── */}
      <div className="flex items-center gap-1 flex-wrap">
        {/* Add block buttons */}
        <button onClick={() => addBlock('text')} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-sans text-warmDark/60 hover:bg-gold/10 hover:text-warmDark transition-all" title="Add Text">
          <Type className="w-3.5 h-3.5" /> Text
        </button>
        <button onClick={() => addBlock('heading')} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-sans text-warmDark/60 hover:bg-gold/10 hover:text-warmDark transition-all" title="Add Heading">
          <Heading1 className="w-3.5 h-3.5" /> Heading
        </button>
        <button onClick={() => addBlock('image')} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-sans text-warmDark/60 hover:bg-gold/10 hover:text-warmDark transition-all" title="Add Image">
          <Image className="w-3.5 h-3.5" /> Image
        </button>

        {/* Selected block controls */}
        {selected && (
          <>
            <div className="w-px h-4 bg-warmMid/15 mx-0.5" />
            {(selected.type === 'text' || selected.type === 'heading') && (
              <>
                <button
                  onClick={() => setShowFontPicker(!showFontPicker)}
                  className={`px-2 py-1 rounded-lg text-xs font-sans transition-all max-w-[100px] truncate ${showFontPicker ? 'bg-gold/15 ring-1 ring-gold/30' : 'text-warmDark/60 hover:bg-warmMid/10 border border-warmMid/10'}`}
                  style={{ fontFamily: selected.style?.fontFamily ? `'${selected.style.fontFamily}', sans-serif` : 'inherit' }}
                >
                  {selected.style?.fontFamily || 'Font'}
                </button>
                <input
                  type="number"
                  value={selected.style?.fontSize || 14}
                  onChange={e => updateBlockStyle(selected.id, { fontSize: Number(e.target.value) || 14 })}
                  className="w-11 px-1.5 py-1 rounded-lg text-xs text-warmDark bg-white/60 border border-warmMid/10 outline-none focus:ring-1 focus:ring-gold/30"
                  min={8} max={80}
                />
                <button onClick={() => updateBlockStyle(selected.id, { bold: !selected.style?.bold })} className={`w-6 h-6 rounded flex items-center justify-center transition-all ${selected.style?.bold ? 'bg-warmDark/15 text-warmDark' : 'text-warmDark/40 hover:bg-warmMid/10'}`}>
                  <Bold className="w-3 h-3" />
                </button>
                <button onClick={() => updateBlockStyle(selected.id, { italic: !selected.style?.italic })} className={`w-6 h-6 rounded flex items-center justify-center transition-all ${selected.style?.italic ? 'bg-warmDark/15 text-warmDark' : 'text-warmDark/40 hover:bg-warmMid/10'}`}>
                  <Italic className="w-3 h-3" />
                </button>
                <button onClick={() => updateBlockStyle(selected.id, { underline: !selected.style?.underline })} className={`w-6 h-6 rounded flex items-center justify-center transition-all ${selected.style?.underline ? 'bg-warmDark/15 text-warmDark' : 'text-warmDark/40 hover:bg-warmMid/10'}`}>
                  <Underline className="w-3 h-3" />
                </button>
                <div className="w-px h-4 bg-warmMid/15 mx-0.5" />
                <button onClick={() => updateBlockStyle(selected.id, { textAlign: 'left' })} className={`w-6 h-6 rounded flex items-center justify-center transition-all ${(selected.style?.textAlign || 'left') === 'left' ? 'bg-warmDark/15' : 'text-warmDark/40 hover:bg-warmMid/10'}`}>
                  <AlignLeft className="w-3 h-3" />
                </button>
                <button onClick={() => updateBlockStyle(selected.id, { textAlign: 'center' })} className={`w-6 h-6 rounded flex items-center justify-center transition-all ${selected.style?.textAlign === 'center' ? 'bg-warmDark/15' : 'text-warmDark/40 hover:bg-warmMid/10'}`}>
                  <AlignCenter className="w-3 h-3" />
                </button>
                <button onClick={() => updateBlockStyle(selected.id, { textAlign: 'right' })} className={`w-6 h-6 rounded flex items-center justify-center transition-all ${selected.style?.textAlign === 'right' ? 'bg-warmDark/15' : 'text-warmDark/40 hover:bg-warmMid/10'}`}>
                  <AlignRight className="w-3 h-3" />
                </button>
                <input
                  type="color"
                  value={selected.style?.color || '#4a3728'}
                  onChange={e => updateBlockStyle(selected.id, { color: e.target.value })}
                  className="w-6 h-6 rounded border border-warmMid/10 cursor-pointer"
                />
              </>
            )}
            {selected.type === 'image' && (
              <button onClick={() => handleImageUpload(selected.id)} disabled={uploading} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-sans text-warmDark/60 hover:bg-gold/10 transition-all disabled:opacity-50">
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {selected.imageUrl ? 'Replace' : 'Upload'}
              </button>
            )}
            <button onClick={deleteSelected} className="w-6 h-6 rounded flex items-center justify-center text-coral/50 hover:text-coral hover:bg-coral/10 transition-all ml-auto" title="Delete">
              <Trash2 className="w-3 h-3" />
            </button>
          </>
        )}
      </div>

      {/* ── Font Picker ── */}
      <AnimatePresence>
        {showFontPicker && selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border border-warmMid/10 rounded-xl bg-white/60 p-2 space-y-1.5">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-warmDark/40" />
                <input
                  type="text"
                  value={fontSearch}
                  onChange={e => setFontSearch(e.target.value)}
                  placeholder="Search fonts..."
                  className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-warmMid/5 border border-warmMid/10 text-xs text-warmDark outline-none focus:ring-1 focus:ring-gold/20 placeholder:text-warmDark/30"
                />
              </div>
              {!fontSearch.trim() && (
                <div className="flex flex-wrap gap-1">
                  {Object.entries(FONT_CATEGORIES).map(([key, { label }]) => (
                    <button key={key} onClick={() => setFontCategory(key)} className={`px-1.5 py-0.5 rounded text-[10px] font-sans transition-all ${fontCategory === key ? 'bg-gold/15 text-warmDark font-medium' : 'text-warmDark/50 hover:bg-warmMid/8'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              )}
              <div className="max-h-[120px] overflow-y-auto rounded-lg border border-warmMid/10 bg-white/50">
                {filteredFonts.length === 0 ? (
                  <p className="text-xs text-warmDark/40 text-center py-2">No fonts found</p>
                ) : filteredFonts.map(font => (
                  <button
                    key={font}
                    onClick={() => { loadGoogleFont(font); updateBlockStyle(selected.id, { fontFamily: font }); setShowFontPicker(false) }}
                    className={`w-full text-left px-2 py-1.5 text-xs transition-all border-b border-warmMid/5 last:border-0 ${selected.style?.fontFamily === font ? 'bg-gold/10 font-medium' : 'text-warmDark/80 hover:bg-warmMid/5'}`}
                    style={{ fontFamily: `'${font}', sans-serif` }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Canvas ── */}
      <div
        ref={canvasRef}
        className="relative rounded-xl overflow-hidden border border-warmMid/10 bg-white/40"
        style={{
          width: '100%',
          aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
        }}
        onClick={() => { setSelectedId(null); setShowFontPicker(false) }}
      >
        {/* Upload indicator */}
        {uploading && (
          <div className="absolute inset-0 z-30 bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white/90 rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg">
              <Loader2 className="w-4 h-4 animate-spin text-gold" />
              <span className="font-sans text-xs text-warmDark">Uploading...</span>
            </div>
          </div>
        )}

        {/* Empty state */}
        {blocks.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-coral/20 flex items-center justify-center">
              <Plus className="w-5 h-5 text-gold/50" />
            </div>
            <p className="font-sans text-xs text-warmDark/35">Add text, headings, or images</p>
          </div>
        )}

        {/* Blocks */}
        {blocks.map(block => {
          const isSelected = block.id === selectedId
          const isEditing = editingTextId === block.id
          const isText = block.type === 'text' || block.type === 'heading'

          return (
            <div
              key={block.id}
              style={{
                position: 'absolute',
                left: `${(block.x / CANVAS_W) * 100}%`,
                top: `${(block.y / CANVAS_H) * 100}%`,
                width: `${(block.width / CANVAS_W) * 100}%`,
                height: `${(block.height / CANVAS_H) * 100}%`,
                cursor: isEditing ? 'text' : 'grab',
              }}
              onMouseDown={!isEditing && !(block.type === 'image' && block.imageUrl && isSelected) ? (e) => startDrag(e, block.id) : undefined}
              onClick={(e) => { e.stopPropagation(); setSelectedId(block.id) }}
              onDoubleClick={isText ? () => handleTextDoubleClick(block.id) : undefined}
              className={`group ${isSelected ? 'ring-2 ring-blue-400 ring-offset-1' : 'hover:ring-1 hover:ring-blue-300/50'}`}
            >
              {isText && (
                isEditing ? (
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => handleTextBlur(block.id, e.currentTarget.textContent || '')}
                    className="w-full h-full outline-none overflow-hidden p-1"
                    style={{
                      fontFamily: block.style?.fontFamily ? `'${block.style.fontFamily}', sans-serif` : 'inherit',
                      fontSize: block.style?.fontSize || 14,
                      color: block.style?.color || '#4a3728',
                      fontWeight: block.style?.bold ? 'bold' : 'normal',
                      fontStyle: block.style?.italic ? 'italic' : 'normal',
                      textDecoration: block.style?.underline ? 'underline' : 'none',
                      textAlign: block.style?.textAlign || 'left',
                    }}
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.content || '') }}
                    autoFocus
                  />
                ) : (
                  <div
                    className="w-full h-full overflow-hidden flex items-center p-1 select-none"
                    style={{
                      fontFamily: block.style?.fontFamily ? `'${block.style.fontFamily}', sans-serif` : 'inherit',
                      fontSize: block.style?.fontSize || 14,
                      color: block.style?.color || '#4a3728',
                      fontWeight: block.style?.bold ? 'bold' : 'normal',
                      fontStyle: block.style?.italic ? 'italic' : 'normal',
                      textDecoration: block.style?.underline ? 'underline' : 'none',
                      textAlign: block.style?.textAlign || 'left',
                    }}
                  >
                    <span className="w-full">{block.content || (block.type === 'heading' ? 'Heading' : 'Text')}</span>
                  </div>
                )
              )}

              {block.type === 'image' && (
                block.imageUrl ? (
                  <div className="w-full h-full rounded-lg overflow-hidden relative">
                    <img
                      src={mediumUrl(block.imageUrl)}
                      alt=""
                      className={`w-full h-full object-cover rounded-lg ${isSelected ? 'cursor-move' : ''}`}
                      style={{ objectPosition: `${block.imageOffsetX ?? 50}% ${block.imageOffsetY ?? 50}%` }}
                      draggable={false}
                      onMouseDown={isSelected ? (e) => startImagePan(e, block.id) : undefined}
                    />
                    {isSelected && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[9px] font-sans px-1.5 py-0.5 rounded-full pointer-events-none">
                        drag to reposition
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="w-full h-full rounded-lg border-2 border-dashed border-warmMid/20 flex flex-col items-center justify-center gap-1 bg-warmMid/5 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); handleImageUpload(block.id) }}
                  >
                    <Image className="w-5 h-5 text-warmMid/30" />
                    <span className="text-[10px] text-warmMid/40 font-sans">Upload</span>
                  </div>
                )
              )}

              {/* Resize handle + corner indicators + delete button */}
              {isSelected && (
                <>
                  <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-blue-400 rounded-full cursor-se-resize shadow-sm z-10" onMouseDown={(e) => startResize(e, block.id)} />
                  <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-blue-400 rounded-full shadow-sm z-10" />
                  <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-blue-400 rounded-full shadow-sm z-10" />
                  {/* Delete button */}
                  <button
                    className="absolute -top-3 -right-3 w-5 h-5 bg-coral rounded-full flex items-center justify-center text-white shadow-md z-20 hover:bg-red-500 transition-colors"
                    onClick={(e) => { e.stopPropagation(); setBlocks(prev => prev.filter(b => b.id !== block.id)); setSelectedId(null) }}
                    title="Delete"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {/* Label — drag to move block */}
                  <div
                    className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-400 text-white rounded px-1 py-0.5 text-[9px] font-sans flex items-center gap-0.5 shadow-sm whitespace-nowrap cursor-grab active:cursor-grabbing"
                    onMouseDown={(e) => startDrag(e, block.id)}
                  >
                    <GripVertical className="w-2.5 h-2.5" />
                    {block.type}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Static renderer for saved canvas data (used in detail view) ── */
export function CanvasRenderer({ data }: { data: CanvasData }) {
  return (
    <div
      className="relative rounded-xl overflow-hidden"
      style={{
        width: '100%',
        aspectRatio: `${data.width} / ${data.height}`,
      }}
    >
      {data.blocks.map(block => (
        <div
          key={block.id}
          style={{
            position: 'absolute',
            left: `${(block.x / data.width) * 100}%`,
            top: `${(block.y / data.height) * 100}%`,
            width: `${(block.width / data.width) * 100}%`,
            height: `${(block.height / data.height) * 100}%`,
          }}
        >
          {(block.type === 'text' || block.type === 'heading') && (
            <div
              className="w-full h-full flex items-center p-1 overflow-hidden"
              style={{
                fontFamily: block.style?.fontFamily ? `'${block.style.fontFamily}', sans-serif` : 'inherit',
                fontSize: block.style?.fontSize || 14,
                color: block.style?.color || '#4a3728',
                fontWeight: block.style?.bold ? 'bold' : 'normal',
                fontStyle: block.style?.italic ? 'italic' : 'normal',
                textDecoration: block.style?.underline ? 'underline' : 'none',
                textAlign: block.style?.textAlign || 'left',
              }}
            >
              <span className="w-full">{block.content}</span>
            </div>
          )}
          {block.type === 'image' && block.imageUrl && (
            <img
              src={mediumUrl(block.imageUrl)}
              alt=""
              className="w-full h-full object-cover rounded-lg"
              style={{ objectPosition: `${block.imageOffsetX ?? 50}% ${block.imageOffsetY ?? 50}%` }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
