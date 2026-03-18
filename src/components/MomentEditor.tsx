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

/** Extract clientX/clientY from mouse or touch events */
function getClientXY(e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) {
  if ('touches' in e) {
    const touch = e.touches[0] || (e as TouchEvent).changedTouches[0]
    return { clientX: touch.clientX, clientY: touch.clientY }
  }
  return { clientX: (e as MouseEvent).clientX, clientY: (e as MouseEvent).clientY }
}

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

/* ── Hook: detect mobile ── */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
  )
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])
  return isMobile
}

/* ── Inline Canvas Editor Component ── */

interface Props {
  initialData?: CanvasData
  onChange?: (data: CanvasData) => void
}

const CANVAS_W = 480
const CANVAS_H = 320

export default function MomentEditor({ initialData, onChange }: Props) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialData?.blocks || [])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showFontPicker, setShowFontPicker] = useState(false)
  const [fontSearch, setFontSearch] = useState('')
  const [fontCategory, setFontCategory] = useState('handwriting')
  const [uploading, setUploading] = useState(false)
  const [editingTextId, setEditingTextId] = useState<string | null>(null)

  const isMobile = useIsMobile()

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
  const startDrag = (e: React.MouseEvent | React.TouchEvent, blockId: string) => {
    if (editingTextId === blockId) return
    e.preventDefault()
    e.stopPropagation()
    const block = blocks.find(b => b.id === blockId)!
    const { clientX, clientY } = getClientXY(e)
    dragRef.current = { blockId, startX: clientX, startY: clientY, origX: block.x, origY: block.y }
    setSelectedId(blockId)

    const onMove = (ev: MouseEvent | TouchEvent) => {
      if (!dragRef.current) return
      if ('touches' in ev) ev.preventDefault()
      const { blockId: id, startX, startY, origX, origY } = dragRef.current
      const pos = getClientXY(ev)
      const scale = getCanvasScale()
      const dx = (pos.clientX - startX) / scale
      const dy = (pos.clientY - startY) / scale
      updateBlock(id, { x: Math.round(origX + dx), y: Math.round(origY + dy) })
    }
    const onUp = () => {
      dragRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)
  }

  /* ── Resize ── */
  const startResize = (e: React.MouseEvent | React.TouchEvent, blockId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const block = blocks.find(b => b.id === blockId)!
    const { clientX, clientY } = getClientXY(e)
    resizeRef.current = { blockId, startX: clientX, startY: clientY, origW: block.width, origH: block.height }

    const onMove = (ev: MouseEvent | TouchEvent) => {
      if (!resizeRef.current) return
      if ('touches' in ev) ev.preventDefault()
      const { blockId: id, startX, startY, origW, origH } = resizeRef.current
      const pos = getClientXY(ev)
      const scale = getCanvasScale()
      updateBlock(id, {
        width: Math.max(40, Math.round(origW + (pos.clientX - startX) / scale)),
        height: Math.max(20, Math.round(origH + (pos.clientY - startY) / scale)),
      })
    }
    const onUp = () => {
      resizeRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)
  }

  /* ── Image pan (drag image within its frame) ── */
  const startImagePan = (e: React.MouseEvent | React.TouchEvent, blockId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const block = blocks.find(b => b.id === blockId)!
    const { clientX, clientY } = getClientXY(e)
    imgPanRef.current = { blockId, startX: clientX, startY: clientY, origOX: block.imageOffsetX ?? 50, origOY: block.imageOffsetY ?? 50 }
    setSelectedId(blockId)

    const onMove = (ev: MouseEvent | TouchEvent) => {
      if (!imgPanRef.current) return
      if ('touches' in ev) ev.preventDefault()
      const { blockId: id, startX, startY, origOX, origOY } = imgPanRef.current
      const b = blocks.find(bl => bl.id === id)
      const scale = getCanvasScale()
      const bw = (b?.width || 100) * scale
      const bh = (b?.height || 100) * scale
      const pos = getClientXY(ev)
      const dx = -((pos.clientX - startX) / bw) * 100
      const dy = -((pos.clientY - startY) / bh) * 100
      updateBlock(id, {
        imageOffsetX: Math.max(0, Math.min(100, Math.round(origOX + dx))),
        imageOffsetY: Math.max(0, Math.min(100, Math.round(origOY + dy))),
      })
    }
    const onUp = () => {
      imgPanRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)
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

  /* ── Tap-to-edit on mobile: tap on already-selected text block → edit ── */
  const handleBlockTap = (blockId: string, isText: boolean) => {
    if (isMobile && isText && selectedId === blockId && editingTextId !== blockId) {
      setEditingTextId(blockId)
    }
    setSelectedId(blockId)
  }

  /* ── Size classes based on mobile ── */
  const resizeHandleCls = isMobile ? 'w-5 h-5' : 'w-2.5 h-2.5'
  const deleteBtnCls = isMobile ? 'w-7 h-7' : 'w-5 h-5'
  const deleteIconCls = isMobile ? 'w-4 h-4' : 'w-3 h-3'
  const formatBtnCls = isMobile ? 'w-8 h-8' : 'w-6 h-6'
  const fontCatPillCls = isMobile ? 'text-xs px-2.5 py-1' : 'text-[10px] px-1.5 py-0.5'

  /* ── Font picker content (shared between inline & bottom sheet) ── */
  const renderFontPickerContent = (isBottomSheet: boolean) => (
    <div className={`${isBottomSheet ? 'p-4 space-y-3' : 'border border-warmMid/10 rounded-xl bg-white/60 p-2 space-y-1.5'}`}>
      {isBottomSheet && (
        <div className="flex justify-center mb-1">
          <div className="w-10 h-1 bg-warmMid/20 rounded-full" />
        </div>
      )}
      <div className="relative">
        <Search className={`absolute left-2 top-1/2 -translate-y-1/2 ${isBottomSheet ? 'w-4 h-4' : 'w-3 h-3'} text-warmDark/40`} />
        <input
          type="text"
          value={fontSearch}
          onChange={e => setFontSearch(e.target.value)}
          placeholder="Search fonts..."
          className={`w-full ${isBottomSheet ? 'pl-9 pr-3 py-2.5 text-sm rounded-xl' : 'pl-7 pr-2 py-1.5 text-xs rounded-lg'} bg-warmMid/5 border border-warmMid/10 text-warmDark outline-none focus:ring-1 focus:ring-gold/20 placeholder:text-warmDark/30`}
        />
      </div>
      {!fontSearch.trim() && (
        <div className="flex flex-wrap gap-1">
          {Object.entries(FONT_CATEGORIES).map(([key, { label }]) => (
            <button key={key} onClick={() => setFontCategory(key)} className={`${fontCatPillCls} rounded font-sans transition-all ${fontCategory === key ? 'bg-gold/15 text-warmDark font-medium' : 'text-warmDark/50 hover:bg-warmMid/8'}`}>
              {label}
            </button>
          ))}
        </div>
      )}
      <div className={`${isBottomSheet ? 'max-h-[50vh]' : 'max-h-[120px]'} overflow-y-auto rounded-lg border border-warmMid/10 bg-white/50`}>
        {filteredFonts.length === 0 ? (
          <p className={`${isBottomSheet ? 'text-sm py-4' : 'text-xs py-2'} text-warmDark/40 text-center`}>No fonts found</p>
        ) : filteredFonts.map(font => (
          <button
            key={font}
            onClick={() => { loadGoogleFont(font); if (selected) updateBlockStyle(selected.id, { fontFamily: font }); setShowFontPicker(false) }}
            className={`w-full text-left ${isBottomSheet ? 'px-3 py-3 text-sm' : 'px-2 py-1.5 text-xs'} transition-all border-b border-warmMid/5 last:border-0 ${selected?.style?.fontFamily === font ? 'bg-gold/10 font-medium' : 'text-warmDark/80 hover:bg-warmMid/5'}`}
            style={{ fontFamily: `'${font}', sans-serif` }}
          >
            {font}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div ref={wrapperRef} className="relative space-y-2">
      {/* ── Toolbar ── */}
      {isMobile ? (
        /* Mobile: two-row toolbar */
        <div className="space-y-1">
          {/* Row 1: Add block buttons — always visible */}
          <div className="flex items-center gap-1">
            <button onClick={() => addBlock('text')} className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-sans text-warmDark/60 hover:bg-gold/10 hover:text-warmDark transition-all" title="Add Text">
              <Type className="w-4 h-4" /> Text
            </button>
            <button onClick={() => addBlock('heading')} className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-sans text-warmDark/60 hover:bg-gold/10 hover:text-warmDark transition-all" title="Add Heading">
              <Heading1 className="w-4 h-4" /> Heading
            </button>
            <button onClick={() => addBlock('image')} className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-sans text-warmDark/60 hover:bg-gold/10 hover:text-warmDark transition-all" title="Add Image">
              <Image className="w-4 h-4" /> Image
            </button>
          </div>
          {/* Row 2: Formatting — shown when a block is selected */}
          {selected && (
            <div className="flex items-center gap-1 flex-wrap">
              {(selected.type === 'text' || selected.type === 'heading') && (
                <>
                  <button
                    onClick={() => setShowFontPicker(!showFontPicker)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-sans transition-all max-w-[100px] truncate ${showFontPicker ? 'bg-gold/15 ring-1 ring-gold/30' : 'text-warmDark/60 hover:bg-warmMid/10 border border-warmMid/10'}`}
                    style={{ fontFamily: selected.style?.fontFamily ? `'${selected.style.fontFamily}', sans-serif` : 'inherit' }}
                  >
                    {selected.style?.fontFamily || 'Font'}
                  </button>
                  <input
                    type="number"
                    value={selected.style?.fontSize || 14}
                    onChange={e => updateBlockStyle(selected.id, { fontSize: Number(e.target.value) || 14 })}
                    className="w-11 px-1.5 py-1.5 rounded-lg text-xs text-warmDark bg-white/60 border border-warmMid/10 outline-none focus:ring-1 focus:ring-gold/30"
                    min={8} max={80}
                  />
                  <button onClick={() => updateBlockStyle(selected.id, { bold: !selected.style?.bold })} className={`${formatBtnCls} rounded flex items-center justify-center transition-all ${selected.style?.bold ? 'bg-warmDark/15 text-warmDark' : 'text-warmDark/40 hover:bg-warmMid/10'}`}>
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => updateBlockStyle(selected.id, { italic: !selected.style?.italic })} className={`${formatBtnCls} rounded flex items-center justify-center transition-all ${selected.style?.italic ? 'bg-warmDark/15 text-warmDark' : 'text-warmDark/40 hover:bg-warmMid/10'}`}>
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => updateBlockStyle(selected.id, { underline: !selected.style?.underline })} className={`${formatBtnCls} rounded flex items-center justify-center transition-all ${selected.style?.underline ? 'bg-warmDark/15 text-warmDark' : 'text-warmDark/40 hover:bg-warmMid/10'}`}>
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-5 bg-warmMid/15 mx-0.5" />
                  <button onClick={() => updateBlockStyle(selected.id, { textAlign: 'left' })} className={`${formatBtnCls} rounded flex items-center justify-center transition-all ${(selected.style?.textAlign || 'left') === 'left' ? 'bg-warmDark/15' : 'text-warmDark/40 hover:bg-warmMid/10'}`}>
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => updateBlockStyle(selected.id, { textAlign: 'center' })} className={`${formatBtnCls} rounded flex items-center justify-center transition-all ${selected.style?.textAlign === 'center' ? 'bg-warmDark/15' : 'text-warmDark/40 hover:bg-warmMid/10'}`}>
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => updateBlockStyle(selected.id, { textAlign: 'right' })} className={`${formatBtnCls} rounded flex items-center justify-center transition-all ${selected.style?.textAlign === 'right' ? 'bg-warmDark/15' : 'text-warmDark/40 hover:bg-warmMid/10'}`}>
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="color"
                    value={selected.style?.color || '#4a3728'}
                    onChange={e => updateBlockStyle(selected.id, { color: e.target.value })}
                    className={`${formatBtnCls} rounded border border-warmMid/10 cursor-pointer`}
                  />
                </>
              )}
              {selected.type === 'image' && (
                <button onClick={() => handleImageUpload(selected.id)} disabled={uploading} className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-sans text-warmDark/60 hover:bg-gold/10 transition-all disabled:opacity-50">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {selected.imageUrl ? 'Replace' : 'Upload'}
                </button>
              )}
              <button onClick={deleteSelected} className={`${deleteBtnCls} rounded flex items-center justify-center text-coral/50 hover:text-coral hover:bg-coral/10 transition-all ml-auto`} title="Delete">
                <Trash2 className={deleteIconCls} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Desktop: single-row toolbar */
        <div className="flex items-center gap-1 flex-wrap">
          <button onClick={() => addBlock('text')} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-sans text-warmDark/60 hover:bg-gold/10 hover:text-warmDark transition-all" title="Add Text">
            <Type className="w-3.5 h-3.5" /> Text
          </button>
          <button onClick={() => addBlock('heading')} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-sans text-warmDark/60 hover:bg-gold/10 hover:text-warmDark transition-all" title="Add Heading">
            <Heading1 className="w-3.5 h-3.5" /> Heading
          </button>
          <button onClick={() => addBlock('image')} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-sans text-warmDark/60 hover:bg-gold/10 hover:text-warmDark transition-all" title="Add Image">
            <Image className="w-3.5 h-3.5" /> Image
          </button>

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
      )}

      {/* ── Font Picker ── */}
      <AnimatePresence>
        {showFontPicker && selected && (
          isMobile ? (
            /* Mobile: bottom sheet overlay */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/30"
              onClick={() => setShowFontPicker(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 bg-warmWhite rounded-t-2xl max-h-[70vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                {renderFontPickerContent(true)}
              </motion.div>
            </motion.div>
          ) : (
            /* Desktop: inline expansion */
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {renderFontPickerContent(false)}
            </motion.div>
          )
        )}
      </AnimatePresence>

      {/* ── Canvas ── */}
      <div
        ref={canvasRef}
        className="relative rounded-xl overflow-hidden border border-warmMid/10 bg-white/40 select-none"
        style={{
          width: '100%',
          aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
          touchAction: 'none',
          userSelect: 'none',
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
          const canDrag = !isEditing && !(block.type === 'image' && block.imageUrl && isSelected)

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
                touchAction: 'none',
              }}
              onMouseDown={canDrag ? (e) => startDrag(e, block.id) : undefined}
              onTouchStart={canDrag ? (e) => startDrag(e, block.id) : undefined}
              onClick={(e) => { e.stopPropagation(); handleBlockTap(block.id, isText) }}
              onDoubleClick={isText && !isMobile ? () => handleTextDoubleClick(block.id) : undefined}
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
                    className="w-full h-full overflow-hidden flex items-center p-1 select-none relative"
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
                    {/* Mobile: "Tap to edit" overlay on selected text blocks */}
                    {isMobile && isSelected && !isEditing && (
                      <button
                        className="absolute inset-0 flex items-end justify-center pb-0.5"
                        onClick={(e) => { e.stopPropagation(); setEditingTextId(block.id) }}
                      >
                        <span className="bg-blue-400/90 text-white text-[9px] font-sans px-2 py-0.5 rounded-full shadow-sm">
                          Tap to edit
                        </span>
                      </button>
                    )}
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
                      onTouchStart={isSelected ? (e) => startImagePan(e, block.id) : undefined}
                    />
                    {isSelected && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[9px] font-sans px-1.5 py-0.5 rounded-full pointer-events-none">
                        {isMobile ? 'touch to reposition' : 'drag to reposition'}
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
                  <div
                    className={`absolute -bottom-1 -right-1 ${resizeHandleCls} bg-blue-400 rounded-full cursor-se-resize shadow-sm z-10`}
                    onMouseDown={(e) => startResize(e, block.id)}
                    onTouchStart={(e) => startResize(e, block.id)}
                  />
                  <div className={`absolute -top-1 -left-1 ${resizeHandleCls} bg-blue-400 rounded-full shadow-sm z-10`} />
                  <div className={`absolute -bottom-1 -left-1 ${resizeHandleCls} bg-blue-400 rounded-full shadow-sm z-10`} />
                  {/* Delete button */}
                  <button
                    className={`absolute -top-3 -right-3 ${deleteBtnCls} bg-coral rounded-full flex items-center justify-center text-white shadow-md z-20 hover:bg-red-500 transition-colors`}
                    onClick={(e) => { e.stopPropagation(); setBlocks(prev => prev.filter(b => b.id !== block.id)); setSelectedId(null) }}
                    title="Delete"
                  >
                    <X className={deleteIconCls} />
                  </button>
                  {/* Label — drag to move block */}
                  <div
                    className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-400 text-white rounded px-1 py-0.5 text-[9px] font-sans flex items-center gap-0.5 shadow-sm whitespace-nowrap cursor-grab active:cursor-grabbing"
                    onMouseDown={(e) => startDrag(e, block.id)}
                    onTouchStart={(e) => startDrag(e, block.id)}
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
