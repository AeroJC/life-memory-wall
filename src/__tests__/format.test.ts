import { describe, it, expect } from 'vitest'
import { formatDate, formatDateFull } from '../utils/format'

describe('formatDate', () => {
  it('formats a date string to short format', () => {
    const result = formatDate('2024-06-15')
    expect(result).toContain('Jun')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('formats another date correctly', () => {
    const result = formatDate('2024-12-25')
    expect(result).toContain('Dec')
    expect(result).toContain('25')
    expect(result).toContain('2024')
  })

  it('handles ISO date strings', () => {
    const result = formatDate('2024-01-01T00:00:00.000Z')
    expect(result).toContain('2024')
  })
})

describe('formatDateFull', () => {
  it('formats a date to full format with weekday', () => {
    const result = formatDateFull('2024-06-15')
    expect(result).toContain('June')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('includes the day of the week', () => {
    // June 15, 2024 is a Saturday
    const result = formatDateFull('2024-06-15')
    expect(result).toContain('Saturday')
  })
})
