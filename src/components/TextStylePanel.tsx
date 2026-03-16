import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, Search, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react'
import { TextStyle } from '../types'

/* ── Font catalogue ── */
const FONT_CATEGORIES: Record<string, { label: string; fonts: string[] }> = {
  handwriting: {
    label: 'Handwriting',
    fonts: [
      'Dancing Script', 'Pacifico', 'Caveat', 'Satisfy', 'Great Vibes',
      'Sacramento', 'Allura', 'Kaushan Script', 'Yellowtail', 'Cookie',
      'Indie Flower', 'Shadows Into Light', 'Amatic SC', 'Permanent Marker', 'Covered By Your Grace',
    ],
  },
  serif: {
    label: 'Serif',
    fonts: [
      'Playfair Display', 'Merriweather', 'Lora', 'Cormorant Garamond', 'Libre Baskerville',
      'EB Garamond', 'Crimson Text', 'PT Serif', 'Spectral', 'Source Serif 4',
      'Noto Serif', 'Bitter', 'Vollkorn', 'Cardo', 'Gentium Book Plus',
    ],
  },
  'sans-serif': {
    label: 'Sans Serif',
    fonts: [
      'Inter', 'Poppins', 'Montserrat', 'Open Sans', 'Raleway',
      'Nunito', 'Quicksand', 'DM Sans', 'Work Sans', 'Outfit',
      'Rubik', 'Josefin Sans', 'Comfortaa', 'Mulish', 'Manrope',
    ],
  },
  display: {
    label: 'Display',
    fonts: [
      'Abril Fatface', 'Lobster', 'Righteous', 'Bebas Neue', 'Fredoka',
      'Paytone One', 'Bungee', 'Alfa Slab One', 'Titan One', 'Lilita One',
      'Passion One', 'Luckiest Guy', 'Bangers', 'Concert One', 'Black Ops One',
    ],
  },
  monospace: {
    label: 'Monospace',
    fonts: [
      'JetBrains Mono', 'Fira Code', 'Source Code Pro', 'IBM Plex Mono', 'Space Mono',
      'Roboto Mono', 'Ubuntu Mono', 'Inconsolata', 'Courier Prime', 'Overpass Mono',
    ],
  },
}

const ALL_FONTS = Object.values(FONT_CATEGORIES).flatMap(c => c.fonts)

const FONT_SIZES: { key: TextStyle['fontSize']; label: string }[] = [
  { key: 'small', label: 'Small' },
  { key: 'normal', label: 'Normal' },
  { key: 'large', label: 'Large' },
  { key: 'heading', label: 'Heading' },
]

/* ── Google Fonts loader ── */
const loadedFonts = new Set<string>()

function loadGoogleFont(font: string) {
  if (loadedFonts.has(font)) return
  loadedFonts.add(font)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;700&display=swap`
  document.head.appendChild(link)
}

function loadAllFontsForCategory(category: string) {
  const cat = FONT_CATEGORIES[category]
  if (cat) cat.fonts.forEach(loadGoogleFont)
}

interface Props {
  style: TextStyle
  onChange: (style: TextStyle) => void
  onClose: () => void
  inline?: boolean
  targetLabel?: string
}

export default function TextStylePanel({ style, onChange, onClose, inline, targetLabel }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('handwriting')
  const [expanded, setExpanded] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  // Load fonts for current category on mount and category change
  useEffect(() => {
    loadAllFontsForCategory(activeCategory)
  }, [activeCategory])

  // Load the currently selected font
  useEffect(() => {
    if (style.fontFamily) loadGoogleFont(style.fontFamily)
  }, [style.fontFamily])

  const update = (partial: Partial<TextStyle>) => {
    onChange({ ...style, ...partial })
  }

  // Filter fonts by search
  const filteredFonts = search.trim()
    ? ALL_FONTS.filter(f => f.toLowerCase().includes(search.toLowerCase()))
    : FONT_CATEGORIES[activeCategory]?.fonts || []

  // When searching, preload fonts that match
  useEffect(() => {
    if (search.trim()) {
      filteredFonts.slice(0, 10).forEach(loadGoogleFont)
    }
  }, [search])

  const pillBtn = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-sm font-sans transition-all ${
      active
        ? 'bg-gold/20 text-warmDark font-medium ring-1 ring-gold/30'
        : 'text-warmDark/60 hover:bg-warmMid/10 hover:text-warmDark/80'
    }`

  const toggleBtn = (active: boolean) =>
    `w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
      active
        ? 'bg-warmDark/15 text-warmDark shadow-sm ring-1 ring-warmDark/20'
        : 'text-warmDark/50 hover:bg-warmMid/10 hover:text-warmDark/80'
    }`

  const hasStyle = style.fontFamily || style.fontSize || style.textAlign || style.bold || style.italic || style.underline

  const content = (
    <div className={inline ? 'space-y-3' : 'flex-1 overflow-y-auto px-4 py-4 space-y-5'}>

      {/* ── Quick controls row: size + alignment + bold/italic/underline ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Size */}
        <div className="flex gap-1">
          {FONT_SIZES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => update({ fontSize: key })}
              className={pillBtn((style.fontSize || 'normal') === key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-warmMid/15" />

        {/* Alignment */}
        <div className="flex gap-1">
          <button onClick={() => update({ textAlign: 'left' })} className={toggleBtn((style.textAlign || 'left') === 'left')} title="Left">
            <AlignLeft className="w-4 h-4" />
          </button>
          <button onClick={() => update({ textAlign: 'center' })} className={toggleBtn(style.textAlign === 'center')} title="Center">
            <AlignCenter className="w-4 h-4" />
          </button>
          <button onClick={() => update({ textAlign: 'right' })} className={toggleBtn(style.textAlign === 'right')} title="Right">
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-warmMid/15" />

        {/* Bold / Italic / Underline */}
        <div className="flex gap-1">
          <button onClick={() => update({ bold: !style.bold })} className={toggleBtn(!!style.bold)} title="Bold">
            <Bold className="w-4 h-4" />
          </button>
          <button onClick={() => update({ italic: !style.italic })} className={toggleBtn(!!style.italic)} title="Italic">
            <Italic className="w-4 h-4" />
          </button>
          <button onClick={() => update({ underline: !style.underline })} className={toggleBtn(!!style.underline)} title="Underline">
            <Underline className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Font Family (collapsible in inline mode) ── */}
      {(!inline || expanded) && (
        <div>
          <label className="font-sans text-xs text-warmDark/50 uppercase tracking-wider mb-2 block">Font Family</label>

          {/* Search */}
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-warmDark/40" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fonts..."
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-warmMid/5 border border-warmMid/10 text-sm text-warmDark outline-none focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-warmDark/30"
            />
          </div>

          {/* Category tabs */}
          {!search.trim() && (
            <div className="flex flex-wrap gap-1 mb-2">
              {Object.entries(FONT_CATEGORIES).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-sans transition-all ${
                    activeCategory === key
                      ? 'bg-gold/15 text-warmDark font-medium'
                      : 'text-warmDark/50 hover:bg-warmMid/8'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Font list */}
          <div className={`${inline ? 'max-h-[140px]' : 'max-h-[200px]'} overflow-y-auto rounded-xl border border-warmMid/10 bg-white/50`}>
            {filteredFonts.length === 0 ? (
              <p className="text-sm text-warmDark/40 text-center py-4">No fonts found</p>
            ) : (
              filteredFonts.map(font => (
                <button
                  key={font}
                  onClick={() => { loadGoogleFont(font); update({ fontFamily: font }) }}
                  className={`w-full text-left px-3 py-1.5 text-sm transition-all border-b border-warmMid/5 last:border-0 ${
                    style.fontFamily === font
                      ? 'bg-gold/10 text-warmDark font-medium'
                      : 'text-warmDark/80 hover:bg-warmMid/5'
                  }`}
                  style={{ fontFamily: `'${font}', sans-serif` }}
                >
                  {font}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Preview (non-inline only) ── */}
      {!inline && (
        <div>
          <label className="font-sans text-xs text-warmDark/50 uppercase tracking-wider mb-2 block">Preview</label>
          <div
            className="rounded-xl border border-warmMid/10 bg-white/60 p-4 min-h-[80px] flex items-center justify-center"
            style={{
              fontFamily: style.fontFamily ? `'${style.fontFamily}', sans-serif` : 'inherit',
              fontSize: style.fontSize === 'small' ? '14px' : style.fontSize === 'large' ? '20px' : style.fontSize === 'heading' ? '26px' : '16px',
              textAlign: style.textAlign || 'left',
              fontWeight: style.bold ? 'bold' : 'normal',
              fontStyle: style.italic ? 'italic' : 'normal',
              textDecoration: style.underline ? 'underline' : 'none',
            }}
          >
            <p className="text-warmDark/80">The quick brown fox jumps over the lazy dog</p>
          </div>
        </div>
      )}
    </div>
  )

  // Inline mode: compact collapsible section within edit form
  if (inline) {
    return (
      <div className="rounded-xl border border-warmMid/10 bg-white/30 overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-3 py-2 hover:bg-warmMid/5 transition-colors"
        >
          <span className="font-sans text-xs text-warmDark/50 uppercase tracking-wider flex items-center gap-2">
            {targetLabel ? `Style · ${targetLabel}` : 'Text Style'}
            {hasStyle && <span className="w-1.5 h-1.5 rounded-full bg-gold/60" />}
          </span>
          <svg className={`w-3.5 h-3.5 text-warmDark/40 transition-transform ${expanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        {expanded && (
          <div className="px-3 pb-3">
            {content}
          </div>
        )}
      </div>
    )
  }

  // Drawer mode (original)
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 bottom-0 w-[300px] z-50 bg-white/95 backdrop-blur-xl border-l border-warmMid/15 shadow-2xl flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-warmMid/10">
        <h3 className="font-serif text-base text-warmDark">Text Style</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl hover:bg-warmMid/10 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-warmDark/60" />
        </button>
      </div>
      {content}
    </motion.div>
  )
}
