const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dyxairjq5'
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'memory_wall'
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

export async function uploadImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only JPEG, PNG, WebP and GIF images are allowed')
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image must be smaller than 10 MB')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    throw new Error('Image upload failed')
  }

  const data = await res.json()
  return data.secure_url
}

export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  const uploads = files.map(uploadImage)
  return Promise.all(uploads)
}

const AUDIO_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`
const ALLOWED_AUDIO_TYPES = ['audio/webm', 'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/aac', 'audio/x-m4a']
const MAX_AUDIO_SIZE = 25 * 1024 * 1024 // 25 MB

export async function uploadAudio(fileOrBlob: File | Blob): Promise<string> {
  if (fileOrBlob instanceof File && !ALLOWED_AUDIO_TYPES.includes(fileOrBlob.type)) {
    throw new Error('Unsupported audio format')
  }
  if (fileOrBlob.size > MAX_AUDIO_SIZE) {
    throw new Error('Audio must be smaller than 25 MB')
  }

  const formData = new FormData()
  formData.append('file', fileOrBlob)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('resource_type', 'video') // Cloudinary uses 'video' for audio too

  const res = await fetch(AUDIO_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    throw new Error('Audio upload failed')
  }

  const data = await res.json()
  return data.secure_url
}

/**
 * Transform a Cloudinary URL to serve an optimized version.
 * Inserts transformation params before /upload/ in the URL.
 */
export function cloudinaryUrl(url: string, transforms: string): string {
  if (!url || !url.includes('/upload/')) return url
  return url.replace('/upload/', `/upload/${transforms}/`)
}

/** Thumbnail for cards: 400px wide, auto height, auto quality, auto format */
export function thumbnailUrl(url: string): string {
  return cloudinaryUrl(url, 'w_400,c_fill,q_auto,f_auto')
}

/** Medium size for detail views: 800px wide */
export function mediumUrl(url: string): string {
  return cloudinaryUrl(url, 'w_800,c_limit,q_auto,f_auto')
}

/** Full size with quality optimization */
export function fullUrl(url: string): string {
  return cloudinaryUrl(url, 'q_auto,f_auto')
}

/** Blur placeholder: tiny blurred version for progressive loading */
export function blurPlaceholderUrl(url: string): string {
  return cloudinaryUrl(url, 'w_50,e_blur:1000,q_auto,f_auto')
}

const VIDEO_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100 MB

export async function uploadVideo(file: File): Promise<string> {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    throw new Error('Only MP4, WebM, MOV, AVI, and MKV videos are allowed')
  }
  if (file.size > MAX_VIDEO_SIZE) {
    throw new Error('Video must be smaller than 100 MB')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('resource_type', 'video')

  const res = await fetch(VIDEO_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    throw new Error('Video upload failed')
  }

  const data = await res.json()
  return data.secure_url
}

/** Video thumbnail from Cloudinary */
export function videoThumbnailUrl(url: string): string {
  if (!url || !url.includes('/upload/')) return url
  // Replace video extension with .jpg and add transform
  const transformed = url.replace('/upload/', '/upload/w_400,h_300,c_fill,so_0/')
  return transformed.replace(/\.(mp4|webm|mov|avi|mkv)$/i, '.jpg')
}
