import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Loader2, X, Check } from 'lucide-react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { Memory, SubStory } from '../types'
import { sanitizeText } from '../utils/sanitize'
import { sanitizeHtml } from '../utils/sanitize'

interface Props {
  memory: Memory
  onClose: () => void
}

function formatDateForPdf(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function stripHtml(html: string): string {
  return html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '').trim()
}

/** Render an offscreen HTML element to canvas, then to a jsPDF image */
async function renderToCanvas(el: HTMLElement): Promise<HTMLCanvasElement> {
  return html2canvas(el, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#fffbf5',
    logging: false,
  })
}

/** Build a styled offscreen container matching the app's look */
function createContainer(widthPx: number): HTMLDivElement {
  const container = document.createElement('div')
  container.style.cssText = `
    position: fixed; left: -9999px; top: 0;
    width: ${widthPx}px;
    font-family: 'Outfit', system-ui, -apple-system, sans-serif;
    background: #fffbf5;
    color: #4a3728;
    padding: 32px;
    box-sizing: border-box;
  `
  document.body.appendChild(container)
  return container
}

function removeContainer(el: HTMLElement) {
  document.body.removeChild(el)
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
    setProgressLabel('Rendering pages...')

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()
    const pageH = doc.internal.pageSize.getHeight()
    const margin = 10
    const contentW = pageW - margin * 2
    const containerPx = 600 // render width for html2canvas
    let isFirstPage = true

    /** Add a canvas as an image page (or flowing) to the PDF */
    const addCanvasToDoc = (canvas: HTMLCanvasElement, startNewPage: boolean) => {
      const imgData = canvas.toDataURL('image/jpeg', 0.92)
      const imgW = contentW
      const imgH = (canvas.height / canvas.width) * imgW

      if (startNewPage && !isFirstPage) doc.addPage()
      isFirstPage = false

      // If image is taller than page, scale to fit
      if (imgH > pageH - margin * 2) {
        const scale = (pageH - margin * 2) / imgH
        const scaledW = imgW * scale
        const scaledH = imgH * scale
        doc.addImage(imgData, 'JPEG', margin + (contentW - scaledW) / 2, margin, scaledW, scaledH)
      } else {
        doc.addImage(imgData, 'JPEG', margin, margin, imgW, imgH)
      }
    }

    // ── Cover Page ──
    setProgressLabel('Rendering cover...')
    const coverEl = createContainer(containerPx)
    const coverPhoto = memory.photos?.[0]
    coverEl.innerHTML = `
      <div style="
        position: relative;
        min-height: ${containerPx * 1.4}px;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        text-align: center;
        border-radius: 12px;
        overflow: hidden;
        ${coverPhoto ? `background: url(${coverPhoto}) center/cover no-repeat;` : 'background: linear-gradient(135deg, #d4a574, #e8927c);'}
        padding: 48px 32px;
      ">
        <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.5);"></div>
        <div style="position: relative; z-index: 1;">
          <h1 style="font-size: 36px; font-weight: 700; color: white; margin: 0 0 12px 0; line-height: 1.2;">
            ${sanitizeText(memory.title)}
          </h1>
          <p style="font-size: 16px; color: #d4a574; margin: 0 0 8px 0; font-style: italic;">
            ${formatDateForPdf(memory.date)}${memory.endDate ? ` — ${formatDateForPdf(memory.endDate)}` : ''}
          </p>
          ${memory.location ? `<p style="font-size: 14px; color: rgba(255,255,255,0.7); margin: 0 0 16px 0;">${sanitizeText(memory.location)}</p>` : ''}
          ${substories.length > 0 ? `<p style="font-size: 13px; color: rgba(255,255,255,0.5); margin: 0;">${substories.length} moment${substories.length !== 1 ? 's' : ''}</p>` : ''}
        </div>
      </div>
    `
    // Wait for cover image to load
    if (coverPhoto) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    const coverCanvas = await renderToCanvas(coverEl)
    addCanvasToDoc(coverCanvas, false)
    removeContainer(coverEl)
    setProgress(15)

    // ── Story text ──
    const storyText = stripHtml(memory.story)
    if (storyText) {
      setProgressLabel('Rendering story...')
      const storyEl = createContainer(containerPx)
      storyEl.innerHTML = `
        <div style="padding: 8px 0;">
          <p style="font-size: 15px; line-height: 1.7; color: #4a3728; white-space: pre-wrap; margin: 0;">
            ${sanitizeHtml(memory.story)}
          </p>
        </div>
      `
      const storyCanvas = await renderToCanvas(storyEl)
      addCanvasToDoc(storyCanvas, true)
      removeContainer(storyEl)
    }

    // ── Cover photos (beyond the first) ──
    if (memory.photos && memory.photos.length > 1) {
      const photosEl = createContainer(containerPx)
      const photoHtml = memory.photos.slice(1, 5).map(url =>
        `<img src="${url}" style="max-width: 100%; height: auto; border-radius: 10px; margin-bottom: 12px; display: block;" crossorigin="anonymous" />`
      ).join('')
      photosEl.innerHTML = `<div>${photoHtml}</div>`
      await new Promise(resolve => setTimeout(resolve, 800))
      const photosCanvas = await renderToCanvas(photosEl)
      addCanvasToDoc(photosCanvas, true)
      removeContainer(photosEl)
    }

    // Tags
    if (memory.tags && memory.tags.length > 0) {
      const tagsEl = createContainer(containerPx)
      tagsEl.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${memory.tags.map(t => `<span style="background: rgba(212,165,116,0.15); color: #d4a574; padding: 4px 12px; border-radius: 20px; font-size: 13px;">#${sanitizeText(t)}</span>`).join('')}
        </div>
      `
      const tagsCanvas = await renderToCanvas(tagsEl)
      addCanvasToDoc(tagsCanvas, true)
      removeContainer(tagsEl)
    }
    setProgress(30)

    // ── Moments ──
    if (substories.length > 0) {
      const totalSubs = substories.length

      for (let si = 0; si < substories.length; si++) {
        const sub = substories[si]
        setProgressLabel(`Rendering moment ${si + 1}/${totalSubs}...`)
        setProgress(30 + Math.round(((si + 1) / totalSubs) * 60))

        const momentEl = createContainer(containerPx)

        // Build photo HTML
        let photoHtml = ''
        if (sub.photos && sub.photos.length > 0 && sub.type !== 'text' && sub.type !== 'video' && sub.type !== 'canvas') {
          if (sub.type === 'photos' && sub.photos.length > 1) {
            // Grid layout — square thumbnails
            photoHtml = `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
              ${sub.photos.map(url => `<div style="aspect-ratio: 1; overflow: hidden; border-radius: 10px;"><img src="${url}" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" /></div>`).join('')}
            </div>`
          } else if (sub.type === 'img-top' || sub.type === 'img-bottom') {
            // Full-width, natural height
            photoHtml = `<div style="border-radius: 10px; overflow: hidden;"><img src="${sub.photos[0]}" style="max-width: 100%; height: auto; display: block;" crossorigin="anonymous" /></div>`
          } else {
            // img-left, img-right, photo — constrained side image
            photoHtml = `<div style="width: 48%; flex-shrink: 0; border-radius: 10px; overflow: hidden;"><img src="${sub.photos[0]}" style="width: 100%; height: auto; display: block;" crossorigin="anonymous" /></div>`
          }
        }

        const titleHtml = sub.title
          ? `<h3 style="font-size: 20px; font-weight: 700; color: #4a3728; margin: 0 0 6px 0;">${sanitizeText(sub.title)}</h3>`
          : ''

        const captionText = stripHtml(sub.content || sub.caption || '')
        const captionHtml = captionText
          ? `<div style="font-size: 14px; line-height: 1.6; color: rgba(74,55,40,0.85); white-space: pre-wrap;">${sanitizeHtml(sub.content || sub.caption || '')}</div>`
          : ''

        const dateHtml = `<p style="font-size: 11px; color: #d4a574; margin: 0 0 8px 0;">${formatDateForPdf(sub.date)}</p>`

        // Assemble based on layout type
        let bodyHtml = ''

        if (sub.type === 'text' || sub.type === 'canvas' || sub.type === 'video') {
          bodyHtml = `${titleHtml}${dateHtml}${captionHtml}`
          if (sub.type === 'video') bodyHtml += `<p style="font-size: 12px; color: rgba(74,55,40,0.4); margin-top: 8px; font-style: italic;">🎬 Video moment — view in app</p>`
        } else if (sub.type === 'img-top') {
          bodyHtml = `${titleHtml}${dateHtml}${photoHtml}<div style="margin-top: 10px;">${captionHtml}</div>`
        } else if (sub.type === 'img-bottom') {
          bodyHtml = `${titleHtml}${dateHtml}${captionHtml}<div style="margin-top: 10px;">${photoHtml}</div>`
        } else if (sub.type === 'img-left' || sub.type === 'photo') {
          bodyHtml = `${titleHtml}${dateHtml}<div style="display: flex; gap: 12px; align-items: flex-start;">${photoHtml}<div style="flex: 1;">${captionHtml}</div></div>`
        } else if (sub.type === 'img-right') {
          bodyHtml = `${titleHtml}${dateHtml}<div style="display: flex; gap: 12px; align-items: flex-start;"><div style="flex: 1;">${captionHtml}</div>${photoHtml}</div>`
        } else if (sub.type === 'photos') {
          bodyHtml = `${titleHtml}${dateHtml}${photoHtml}${captionHtml}`
        } else {
          bodyHtml = `${titleHtml}${dateHtml}${captionHtml}`
        }

        if (sub.audioUrl) {
          bodyHtml += `<p style="font-size: 12px; color: rgba(74,55,40,0.4); margin-top: 8px; font-style: italic;">🎵 Audio recording — listen in app</p>`
        }

        momentEl.innerHTML = `
          <div style="
            background: rgba(74,55,40,0.03);
            border: 1px solid rgba(74,55,40,0.08);
            border-radius: 16px;
            padding: 20px;
          ">
            <div style="font-size: 11px; color: rgba(74,55,40,0.4); margin-bottom: 8px;">
              Moment ${si + 1} of ${totalSubs}
            </div>
            ${bodyHtml}
          </div>
        `

        // Wait for images to load
        const imgs = momentEl.querySelectorAll('img')
        if (imgs.length > 0) {
          await Promise.all(Array.from(imgs).map(img =>
            new Promise<void>(resolve => {
              if (img.complete) { resolve(); return }
              img.onload = () => resolve()
              img.onerror = () => resolve()
            })
          ))
          await new Promise(resolve => setTimeout(resolve, 100))
        }

        const momentCanvas = await renderToCanvas(momentEl)
        addCanvasToDoc(momentCanvas, true)
        removeContainer(momentEl)
      }
    }

    // ── Back Cover ──
    setProgressLabel('Finishing...')
    const backEl = createContainer(containerPx)
    backEl.innerHTML = `
      <div style="
        min-height: ${containerPx * 1.4}px;
        background: #4a3728;
        border-radius: 12px;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        text-align: center;
        padding: 48px 32px;
      ">
        <h2 style="font-size: 22px; color: #d4a574; font-style: italic; margin: 0 0 12px 0; font-weight: 400;">
          ${sanitizeText(memory.title)}
        </h2>
        <p style="font-size: 14px; color: rgba(255,251,245,0.5); margin: 0 0 24px 0;">
          Memories are the treasures of the heart.
        </p>
        <p style="font-size: 11px; color: rgba(255,251,245,0.3); margin: 0;">
          My Inner Circle · ${new Date().toLocaleDateString()}
        </p>
      </div>
    `
    const backCanvas = await renderToCanvas(backEl)
    addCanvasToDoc(backCanvas, true)
    removeContainer(backEl)

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
