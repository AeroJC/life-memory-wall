import { useState, useRef, useEffect, useCallback } from 'react'

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
  editorStyle?: React.CSSProperties
}

export default function RichTextEditor({ value, onChange, placeholder, className, editorStyle }: Props) {
  const editorRef = useRef<HTMLDivElement>(null)
  const savedRange = useRef<Range | null>(null)
  const [_activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

  // Set initial HTML once on mount only
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || ''
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save the current selection range (called on every interaction inside editor)
  const saveRange = useCallback(() => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0).cloneRange()
      // Update active formats based on where the cursor is
      const active = new Set<string>()
      try {
        if (document.queryCommandState('bold')) active.add('bold')
        if (document.queryCommandState('italic')) active.add('italic')
        if (document.queryCommandState('underline')) active.add('underline')
        if (document.queryCommandState('strikeThrough')) active.add('strikeThrough')
        if (document.queryCommandState('justifyLeft')) active.add('justifyLeft')
        if (document.queryCommandState('justifyCenter')) active.add('justifyCenter')
        if (document.queryCommandState('justifyRight')) active.add('justifyRight')
      } catch { /* ignore */ }
      setActiveFormats(active)
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      document.execCommand('insertLineBreak')
      onChange(editorRef.current?.innerHTML || '')
    }
  }

  return (
    <div className={`relative ${className ?? ''}`}>
      {/* ── Contenteditable editor ── */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(editorRef.current?.innerHTML || '')}
        onBlur={() => { saveRange() }}
        onKeyDown={handleKeyDown}
        onMouseUp={saveRange}
        onKeyUp={saveRange}
        onSelect={saveRange}
        data-placeholder={placeholder}
        className="rich-editor w-full font-sans text-warmDark bg-white/40 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-gold/15 transition-all leading-relaxed min-h-[80px]"
        style={editorStyle}
      />
    </div>
  )
}
