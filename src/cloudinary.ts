const CLOUD_NAME = 'dyxairjq5'
const UPLOAD_PRESET = 'memory_wall'
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

export async function uploadImage(file: File): Promise<string> {
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
