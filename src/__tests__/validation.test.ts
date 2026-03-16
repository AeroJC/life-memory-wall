import { describe, it, expect } from 'vitest'
import { validatePassword } from '../utils/validation'

describe('validatePassword', () => {
  it('rejects short passwords', () => {
    expect(validatePassword('Ab1!')).toBe('Password must be at least 8 characters')
  })

  it('rejects passwords without uppercase', () => {
    expect(validatePassword('abcdefg1!')).toBe('Password must contain at least one uppercase letter')
  })

  it('rejects passwords without lowercase', () => {
    expect(validatePassword('ABCDEFG1!')).toBe('Password must contain at least one lowercase letter')
  })

  it('rejects passwords without numbers', () => {
    expect(validatePassword('Abcdefgh!')).toBe('Password must contain at least one number')
  })

  it('rejects passwords without special characters', () => {
    expect(validatePassword('Abcdefg1')).toBe('Password must contain at least one special character')
  })

  it('accepts valid passwords', () => {
    expect(validatePassword('MyP@ss1word')).toBeNull()
    expect(validatePassword('Str0ng!Pass')).toBeNull()
    expect(validatePassword('Aa1!xxxx')).toBeNull()
  })

  it('accepts passwords with various special characters', () => {
    expect(validatePassword('Password1!')).toBeNull()
    expect(validatePassword('Password1@')).toBeNull()
    expect(validatePassword('Password1#')).toBeNull()
    expect(validatePassword('Password1$')).toBeNull()
    expect(validatePassword('Password1%')).toBeNull()
  })
})
