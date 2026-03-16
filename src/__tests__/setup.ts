import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

// Mock Capacitor
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: () => false,
    getPlatform: () => 'web',
  },
}))

// Mock localStorage
const store: Record<string, string> = {}
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, val: string) => { store[key] = val },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { Object.keys(store).forEach(k => delete store[k]) },
  },
})

// Mock fetch
globalThis.fetch = vi.fn()

// Mock import.meta.env
vi.stubEnv('VITE_API_URL', 'http://localhost:3001/api')
vi.stubEnv('VITE_CLOUDINARY_CLOUD_NAME', 'test-cloud')
vi.stubEnv('VITE_CLOUDINARY_UPLOAD_PRESET', 'test-preset')
