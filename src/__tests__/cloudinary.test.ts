import { describe, it, expect } from 'vitest'
import { cloudinaryUrl, thumbnailUrl, mediumUrl, fullUrl, blurPlaceholderUrl } from '../cloudinary'

const SAMPLE_URL = 'https://res.cloudinary.com/dyxairjq5/image/upload/v1234567890/sample.jpg'

describe('cloudinaryUrl', () => {
  it('inserts transforms before /upload/', () => {
    const result = cloudinaryUrl(SAMPLE_URL, 'w_400,c_fill')
    expect(result).toBe('https://res.cloudinary.com/dyxairjq5/image/upload/w_400,c_fill/v1234567890/sample.jpg')
  })

  it('returns empty string for empty URL', () => {
    expect(cloudinaryUrl('', 'w_400')).toBe('')
  })

  it('returns URL unchanged if no /upload/ segment', () => {
    const url = 'https://example.com/image.jpg'
    expect(cloudinaryUrl(url, 'w_400')).toBe(url)
  })
})

describe('thumbnailUrl', () => {
  it('adds 400px width fill transform', () => {
    const result = thumbnailUrl(SAMPLE_URL)
    expect(result).toContain('w_400')
    expect(result).toContain('c_fill')
    expect(result).toContain('q_auto')
    expect(result).toContain('f_auto')
  })
})

describe('mediumUrl', () => {
  it('adds 800px width limit transform', () => {
    const result = mediumUrl(SAMPLE_URL)
    expect(result).toContain('w_800')
    expect(result).toContain('c_limit')
  })
})

describe('fullUrl', () => {
  it('adds quality optimization', () => {
    const result = fullUrl(SAMPLE_URL)
    expect(result).toContain('q_auto')
    expect(result).toContain('f_auto')
    expect(result).not.toContain('w_')
  })
})

describe('blurPlaceholderUrl', () => {
  it('adds blur and tiny width', () => {
    const result = blurPlaceholderUrl(SAMPLE_URL)
    expect(result).toContain('w_50')
    expect(result).toContain('e_blur:1000')
  })
})
