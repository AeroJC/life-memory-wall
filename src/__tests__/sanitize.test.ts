import { describe, it, expect } from 'vitest'
import { sanitizeHtml, sanitizeText } from '../utils/sanitize'

describe('sanitizeHtml', () => {
  it('allows safe formatting tags', () => {
    const input = '<b>bold</b> <i>italic</i> <u>underline</u>'
    expect(sanitizeHtml(input)).toBe('<b>bold</b> <i>italic</i> <u>underline</u>')
  })

  it('strips script tags', () => {
    const input = '<p>Hello</p><script>alert("xss")</script>'
    expect(sanitizeHtml(input)).toBe('<p>Hello</p>')
  })

  it('strips event handlers', () => {
    const input = '<img src="x" onerror="alert(1)">'
    expect(sanitizeHtml(input)).not.toContain('onerror')
    expect(sanitizeHtml(input)).not.toContain('alert')
  })

  it('strips iframe tags', () => {
    const input = '<p>Text</p><iframe src="http://evil.com"></iframe>'
    expect(sanitizeHtml(input)).toBe('<p>Text</p>')
  })

  it('strips svg with onload', () => {
    const input = '<svg onload="alert(1)"><circle></circle></svg>'
    const result = sanitizeHtml(input)
    expect(result).not.toContain('onload')
    expect(result).not.toContain('alert')
  })

  it('allows style attribute', () => {
    const input = '<span style="color: red;">red text</span>'
    expect(sanitizeHtml(input)).toContain('style')
  })

  it('strips form tags', () => {
    const input = '<form action="/steal"><input type="text"></form>'
    expect(sanitizeHtml(input)).not.toContain('form')
    expect(sanitizeHtml(input)).not.toContain('input')
  })

  it('returns empty string for null/undefined', () => {
    expect(sanitizeHtml('')).toBe('')
    expect(sanitizeHtml(null as any)).toBe('')
    expect(sanitizeHtml(undefined as any)).toBe('')
  })

  it('preserves line breaks', () => {
    const input = '<p>Line 1</p><br><p>Line 2</p>'
    expect(sanitizeHtml(input)).toBe('<p>Line 1</p><br><p>Line 2</p>')
  })
})

describe('sanitizeText', () => {
  it('strips all HTML tags', () => {
    const input = '<b>bold</b> <script>alert(1)</script> plain'
    expect(sanitizeText(input)).toBe('bold  plain')
  })

  it('returns empty string for falsy input', () => {
    expect(sanitizeText('')).toBe('')
  })
})
