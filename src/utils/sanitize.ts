import DOMPurify from 'dompurify'

/**
 * Allowed HTML tags for rich text content.
 * Only safe formatting tags — no scripts, iframes, forms, etc.
 */
const ALLOWED_TAGS = [
  'b', 'i', 'u', 'em', 'strong', 'p', 'br', 'span',
  'div', 'ul', 'ol', 'li', 'blockquote', 'h1', 'h2', 'h3',
  'sub', 'sup', 'strike', 's', 'del',
]

const ALLOWED_ATTR = [
  'style', 'class',
]

/**
 * Sanitize HTML content — strips dangerous tags/attributes while preserving formatting.
 * Use this before rendering any user-submitted HTML with dangerouslySetInnerHTML.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return ''
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  })
}

/**
 * Sanitize plain text — strips ALL HTML tags. Use for titles, names, locations, etc.
 */
export function sanitizeText(dirty: string): string {
  if (!dirty) return ''
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
}
