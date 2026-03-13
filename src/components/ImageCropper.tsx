import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { motion } from 'framer-motion'
import { Check, RotateCw, ZoomIn, ZoomOut, ChevronLeft, Loader2 } from 'lucide-react'
import { uploadImage } from '../cloudinary'

interface Props {
  imageSrc: string
  onCropDone: (croppedUrl: string) => void
  onCancel: () => void
}

const ASPECT_OPTIONS: { label: string; value: number | undefined }[] = [
  { label: 'Free', value: undefined },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:4', value: 3 / 4 },
  { label: '16:9', value: 16 / 9 },
  { label: '9:16', value: 9 / 16 },
]

/** Create a cropped image file from canvas */
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<File> {
  // Fetch image as blob first to avoid CORS canvas tainting
  const resp = await fetch(imageSrc)
  const imgBlob = await resp.blob()
  const blobUrl = URL.createObjectURL(imgBlob)

  const image = new Image()
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = reject
    image.src = blobUrl
  })
  URL.revokeObjectURL(blobUrl)

  const canvas = document.createElement('canvas')
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  const ctx = canvas.getContext('2d')!

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  )

  return new Promise<File>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], `cropped-${Date.now()}.jpg`, { type: 'image/jpeg' }))
      }
    }, 'image/jpeg', 0.92)
  })
}

export default function ImageCropper({ imageSrc, onCropDone, onCancel }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [processing, setProcessing] = useState(false)
  const [selectedAspect, setSelectedAspect] = useState(0)

  const aspect = ASPECT_OPTIONS[selectedAspect].value

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleDone = async () => {
    if (!croppedAreaPixels) return
    setProcessing(true)
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels)
      const uploadedUrl = await uploadImage(croppedFile)
      onCropDone(uploadedUrl)
    } catch {
      onCancel()
    } finally {
      setProcessing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex flex-col"
      style={{ zIndex: 9999 }}
    >
      {/* ── Cropper area — takes most of the screen ── */}
      <div style={{ position: 'relative', flex: '1 1 0', minHeight: 0 }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: { background: '#111' },
            cropAreaStyle: { border: '2px solid rgba(212, 165, 116, 0.7)' },
          }}
        />
      </div>

      {/* ── All controls below the cropper ── */}
      <div style={{ flexShrink: 0, background: '#000', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', zIndex: 10 }}>

        {/* Aspect ratio pills */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {ASPECT_OPTIONS.map((opt, i) => (
            <button
              key={opt.label}
              onClick={() => { setSelectedAspect(i); setCrop({ x: 0, y: 0 }) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all ${
                selectedAspect === i
                  ? 'bg-gradient-to-r from-gold/80 to-coral/70 text-white font-medium shadow'
                  : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white/80'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Zoom + rotate row */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex items-center gap-2.5 bg-white/8 rounded-xl px-3 py-2">
            <button
              onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
              className="text-white/60 hover:text-white transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-28 h-1 appearance-none bg-white/20 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
            />
            <button
              onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
              className="text-white/60 hover:text-white transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/8 hover:bg-white/12 text-white/60 hover:text-white transition-colors text-sm"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Back / Done buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-sans transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            onClick={handleDone}
            disabled={processing}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-coral text-white text-sm font-sans font-medium transition-all disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            {processing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{processing ? 'Saving...' : 'Done'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
