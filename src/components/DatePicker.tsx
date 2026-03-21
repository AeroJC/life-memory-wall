import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']

interface DatePickerProps {
  value: string
  onChange: (v: string) => void
  compact?: boolean
}

export default function DatePicker({ value, onChange, compact }: DatePickerProps) {
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

  const displayDateCompact = selected
    ? selected.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Date'

  // Reset view to selected date's month/year when opening
  const handleOpen = () => {
    const p = value ? new Date(value + 'T00:00:00') : new Date()
    setView({ y: p.getFullYear(), m: p.getMonth() })
    setShowYears(false)
    setOpen(v => !v)
  }

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
      <button type="button" onClick={handleOpen}
        className={compact
          ? 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-gold/12 to-coral/8 border border-gold/20 hover:border-gold/35 transition-all'
          : 'flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-gold/15 to-coral/10 border border-gold/25 hover:border-gold/40 transition-all'
        }>
        <Calendar className={compact ? 'w-3.5 h-3.5 text-gold/60' : 'w-4 h-4 text-gold/70'} />
        <span className={compact
          ? 'font-sans text-xs text-warmDark/70'
          : 'font-handwriting text-lg text-warmDark/80'
        }>{compact ? displayDateCompact : displayDate}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }} transition={{ duration: 0.18 }}
            className="absolute left-0 bottom-full mb-2 z-50 bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl p-4 w-72">

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors">
                <ChevronLeft className="w-4 h-4 text-warmDark/60" />
              </button>
              <button type="button" onClick={() => setShowYears(v => !v)}
                className="font-handwriting text-lg text-warmDark hover:text-gold/80 transition-colors">
                {MONTHS[view.m]} {view.y}
              </button>
              <button type="button" onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors">
                <ChevronRight className="w-4 h-4 text-warmDark/60" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {showYears ? (
                <motion.div key="years" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-3 gap-1.5">
                  <button type="button" onClick={() => setView(v => ({ ...v, y: v.y - 12 }))}
                    className="col-span-3 text-xs text-warmDark/40 hover:text-warmDark/60 pb-1">
                    ‹ earlier
                  </button>
                  {years.map(y => (
                    <button type="button" key={y} onClick={() => { setView(v => ({ ...v, y })); setShowYears(false) }}
                      className={`py-1.5 rounded-xl text-sm font-sans transition-all ${
                        y === view.y ? 'bg-gradient-to-br from-gold/80 to-coral/70 text-white font-medium' : 'hover:bg-gold/10 text-warmDark/70'
                      }`}>
                      {y}
                    </button>
                  ))}
                  <button type="button" onClick={() => setView(v => ({ ...v, y: v.y + 12 }))}
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
                        <button type="button" key={d} onClick={() => pickDay(d)}
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
