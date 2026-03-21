import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Loader2, X, Check } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { Memory, SubStory } from '../types'
import { sanitizeText } from '../utils/sanitize'

interface Props {
  memory: Memory
  onClose: () => void
}

async function fetchImageAsBase64(url: string): Promise<{ data: string; format: 'JPEG' | 'PNG' } | null> {
  try {
    const optimizedUrl = url.includes('/upload/')
      ? url.replace('/upload/', '/upload/w_600,q_70,f_jpg/')
      : url
    const res = await fetch(optimizedUrl)
    if (!res.ok) return null
    const blob = await res.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve({ data: reader.result as string, format: 'JPEG' })
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

function stripHtml(html: string): string {
  return html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '').trim()
}

function formatDateForPdf(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function MemoryBookExport({ memory, onClose }: Props) {
  const [exporting, setExporting] = useState(false)
  const [progressLabel, setProgressLabel] = useState('')
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  const substories: SubStory[] = memory.substories || []

  const handleExport = async () => {
    setExporting(true)
    setProgress(0)
    setDone(false)
    setProgressLabel('Generating PDF...')

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()
    const pageH = doc.internal.pageSize.getHeight()
    const margin = 20
    const contentW = pageW - margin * 2
    let y = 0

    const addPageIfNeeded = (neededHeight: number) => {
      if (y + neededHeight > pageH - margin) {
        doc.addPage()
        y = margin
      }
    }

    // ── Cover Page ──
    // Try to use the first cover photo as background
    const coverPhoto = memory.photos?.[0]
    if (coverPhoto) {
      const coverImg = await fetchImageAsBase64(coverPhoto)
      if (coverImg) {
        try {
          doc.addImage(coverImg.data, coverImg.format, 0, 0, pageW, pageH)
        } catch {
          // fallback to solid color
        }
      }
    }

    // Dark overlay
    doc.setFillColor(0, 0, 0)
    doc.setGState(new (doc as any).GState({ opacity: 0.55 }))
    doc.rect(0, 0, pageW, pageH, 'F')
    doc.setGState(new (doc as any).GState({ opacity: 1 }))

    // Title
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    const title = sanitizeText(memory.title)
    const titleLines = doc.splitTextToSize(title, contentW)
    doc.text(titleLines, pageW / 2, pageH / 2 - 15, { align: 'center' })

    // Date + location
    doc.setFontSize(12)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(212, 165, 116)
    let dateLine = formatDateForPdf(memory.date)
    if (memory.endDate) dateLine += ` — ${formatDateForPdf(memory.endDate)}`
    doc.text(dateLine, pageW / 2, pageH / 2 + 5, { align: 'center' })

    if (memory.location) {
      doc.setFontSize(10)
      doc.setTextColor(255, 255, 255, 180)
      doc.text(sanitizeText(memory.location), pageW / 2, pageH / 2 + 14, { align: 'center' })
    }

    // Moments count
    if (substories.length > 0) {
      doc.setFontSize(10)
      doc.setTextColor(255, 255, 255, 140)
      doc.text(`${substories.length} moment${substories.length !== 1 ? 's' : ''}`, pageW / 2, pageH / 2 + 26, { align: 'center' })
    }

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(255, 255, 255, 80)
    doc.text('My Inner Circle', pageW / 2, pageH - 15, { align: 'center' })

    setProgress(15)

    // ── Story page ──
    const storyText = stripHtml(memory.story)
    if (storyText) {
      doc.addPage()
      y = margin

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      doc.setTextColor(74, 55, 40)
      const storyLines = doc.splitTextToSize(storyText, contentW)
      for (const line of storyLines) {
        addPageIfNeeded(6)
        doc.text(line, margin, y + 4)
        y += 5.5
      }
      y += 8
    }

    // ── Cover photos (beyond the first one used as background) ──
    if (memory.photos && memory.photos.length > 1) {
      addPageIfNeeded(40)
      for (let pi = 1; pi < Math.min(memory.photos.length, 5); pi++) {
        const imgData = await fetchImageAsBase64(memory.photos[pi])
        if (imgData) {
          const imgW = contentW
          const imgH = imgW * 0.6
          addPageIfNeeded(imgH + 6)
          try {
            doc.addImage(imgData.data, imgData.format, margin, y, imgW, imgH)
            y += imgH + 6
          } catch {
            // skip
          }
        }
      }
    }

    // Tags
    if (memory.tags && memory.tags.length > 0) {
      addPageIfNeeded(10)
      doc.setFontSize(9)
      doc.setTextColor(212, 165, 116)
      doc.text(memory.tags.map((t) => `#${sanitizeText(t)}`).join('  '), margin, y + 4)
      y += 10
    }

    setProgress(30)

    // ── Moments pages ──
    if (substories.length > 0) {
      const totalSubs = substories.length

      for (let si = 0; si < substories.length; si++) {
        const sub = substories[si]
        setProgress(30 + Math.round(((si + 1) / totalSubs) * 60))

        // Start each moment on a new page for cleanliness
        doc.addPage()
        y = margin

        // Moment number label
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(212, 165, 116)
        doc.text(`Moment ${si + 1} of ${totalSubs}`, margin, y + 3)
        y += 8

        // Substory title
        if (sub.title) {
          doc.setFontSize(18)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(74, 55, 40)
          const subTitleLines = doc.splitTextToSize(sanitizeText(sub.title), contentW)
          doc.text(subTitleLines, margin, y + 6)
          y += subTitleLines.length * 7 + 4
        }

        // Date
        doc.setFontSize(9)
        doc.setFont('helvetica', 'italic')
        doc.setTextColor(150, 130, 110)
        doc.text(formatDateForPdf(sub.date), margin, y + 3)
        y += 8

        // Divider
        doc.setDrawColor(212, 165, 116)
        doc.setLineWidth(0.2)
        doc.line(margin, y, margin + contentW * 0.3, y)
        y += 6

        // Photos (before text for visual layouts)
        if (sub.photos && sub.photos.length > 0 && sub.type !== 'text' && sub.type !== 'video') {
          const maxPhotos = Math.min(sub.photos.length, 6)
          const isSingle = maxPhotos === 1
          for (let pi = 0; pi < maxPhotos; pi++) {
            const imgData = await fetchImageAsBase64(sub.photos[pi])
            if (imgData) {
              const imgW = isSingle ? contentW : contentW / 2 - 2
              const imgH = imgW * 0.65
              addPageIfNeeded(imgH + 4)
              try {
                const xOffset = !isSingle && pi % 2 === 1 ? margin + contentW / 2 + 2 : margin
                doc.addImage(imgData.data, imgData.format, xOffset, y, imgW, imgH)
                if (isSingle || pi % 2 === 1) y += imgH + 4
              } catch {
                // skip
              }
            }
          }
          y += 2
        }

        // Content/caption text
        const text = stripHtml(sub.content || sub.caption || '')
        if (text) {
          doc.setFontSize(11)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(74, 55, 40)
          const lines = doc.splitTextToSize(text, contentW)
          for (const line of lines) {
            addPageIfNeeded(6)
            doc.text(line, margin, y + 4)
            y += 5.5
          }
          y += 4
        }

        // Video note
        if (sub.type === 'video' && sub.videoUrl) {
          addPageIfNeeded(10)
          doc.setFontSize(9)
          doc.setFont('helvetica', 'italic')
          doc.setTextColor(180, 160, 140)
          doc.text('[Video moment — view in app]', margin, y + 4)
          y += 8
        }

        // Audio note
        if (sub.audioUrl) {
          addPageIfNeeded(10)
          doc.setFontSize(9)
          doc.setFont('helvetica', 'italic')
          doc.setTextColor(180, 160, 140)
          doc.text('[Audio recording — listen in app]', margin, y + 4)
          y += 8
        }
      }
    }

    // ── Back Cover ──
    doc.addPage()
    doc.setFillColor(74, 55, 40)
    doc.rect(0, 0, pageW, pageH, 'F')
    doc.setTextColor(212, 165, 116)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'italic')
    doc.text(sanitizeText(memory.title), pageW / 2, pageH / 2 - 8, { align: 'center' })
    doc.setFontSize(10)
    doc.setTextColor(255, 251, 245, 120)
    doc.text('Memories are the treasures of the heart.', pageW / 2, pageH / 2 + 5, { align: 'center' })
    doc.setFontSize(8)
    doc.setTextColor(255, 251, 245, 80)
    doc.text(`My Inner Circle · ${new Date().toLocaleDateString()}`, pageW / 2, pageH / 2 + 16, { align: 'center' })

    // Save
    setProgress(100)
    setProgressLabel('Saving...')
    const filename = `${sanitizeText(memory.title).replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}-memory.pdf`
    doc.save(filename)
    setDone(true)
    setExporting(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-warmWhite rounded-2xl shadow-xl max-w-sm w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/30 to-coral/20 flex items-center justify-center">
                <Download className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-warmDark">Export Memory</h3>
                <p className="text-xs text-warmDark/50 font-sans">
                  {substories.length} moment{substories.length !== 1 ? 's' : ''}
                  {memory.photos?.length ? ` · ${memory.photos.length} photo${memory.photos.length !== 1 ? 's' : ''}` : ''}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-warmMid/10 transition-all">
              <X className="w-4 h-4 text-warmDark/40" />
            </button>
          </div>

          <div className="px-5 pb-5 space-y-4">
            {/* Preview info */}
            <div className="p-3 rounded-xl bg-white/60 border border-warmMid/10">
              <p className="font-serif text-sm text-warmDark font-medium">{memory.title}</p>
              <p className="text-xs text-warmDark/50 font-sans mt-0.5">
                {formatDateForPdf(memory.date)}
                {memory.location ? ` · ${memory.location}` : ''}
              </p>
              <p className="text-xs text-warmDark/40 font-sans mt-1">
                Includes cover photo, story, all moments with their photos and text.
              </p>
            </div>

            {/* Progress */}
            {exporting && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gold" />
                  <span className="text-sm text-warmDark/70 font-sans">{progressLabel} {progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-warmMid/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-gold to-coral rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Done message */}
            {done && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200"
              >
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-sans">PDF downloaded!</span>
              </motion.div>
            )}

            {/* Export button */}
            <button
              onClick={handleExport}
              disabled={exporting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-gold/90 to-coral/80 text-white font-sans font-medium text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {done ? 'Export Again' : 'Export as PDF'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
