import { describe, it, expect, vi, beforeEach } from 'vitest'
import { uploadImage, uploadMultipleImages } from '../cloudinary'

describe('uploadImage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('rejects invalid file types', async () => {
    const file = new File(['data'], 'test.pdf', { type: 'application/pdf' })
    await expect(uploadImage(file)).rejects.toThrow('Only JPEG, PNG, WebP and GIF images are allowed')
  })

  it('rejects files over 10MB', async () => {
    const bigBuffer = new ArrayBuffer(11 * 1024 * 1024)
    const file = new File([bigBuffer], 'big.jpg', { type: 'image/jpeg' })
    await expect(uploadImage(file)).rejects.toThrow('Image must be smaller than 10 MB')
  })

  it('accepts valid JPEG files', async () => {
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ secure_url: 'https://cloudinary.com/uploaded.jpg' }),
    } as Response)

    const url = await uploadImage(file)
    expect(url).toBe('https://cloudinary.com/uploaded.jpg')
    expect(globalThis.fetch).toHaveBeenCalledOnce()
  })

  it('accepts valid PNG files', async () => {
    const file = new File(['data'], 'photo.png', { type: 'image/png' })
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ secure_url: 'https://cloudinary.com/uploaded.png' }),
    } as Response)

    const url = await uploadImage(file)
    expect(url).toBe('https://cloudinary.com/uploaded.png')
  })

  it('accepts WebP and GIF', async () => {
    for (const type of ['image/webp', 'image/gif']) {
      const file = new File(['data'], `photo.${type.split('/')[1]}`, { type })
      vi.mocked(globalThis.fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ secure_url: `https://cloudinary.com/uploaded.${type.split('/')[1]}` }),
      } as Response)
      await expect(uploadImage(file)).resolves.toBeDefined()
    }
  })

  it('throws on upload failure', async () => {
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response)

    await expect(uploadImage(file)).rejects.toThrow('Image upload failed')
  })
})

describe('uploadMultipleImages', () => {
  beforeEach(() => {
    vi.mocked(globalThis.fetch).mockReset()
  })

  it('uploads multiple files in parallel', async () => {
    const files = [
      new File(['data1'], 'photo1.jpg', { type: 'image/jpeg' }),
      new File(['data2'], 'photo2.jpg', { type: 'image/jpeg' }),
    ]
    let callCount = 0
    vi.mocked(globalThis.fetch).mockImplementation(async () => {
      callCount++
      return {
        ok: true,
        json: async () => ({ secure_url: `https://cloudinary.com/photo${callCount}.jpg` }),
      } as Response
    })

    const urls = await uploadMultipleImages(files)
    expect(urls).toHaveLength(2)
    expect(globalThis.fetch).toHaveBeenCalledTimes(2)
  })
})
