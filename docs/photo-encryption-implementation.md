# Photo Encryption Implementation Guide

## Status: POC tested, reverted — ready for future implementation

## Overview

Client-side AES-256-GCM encryption of photos before uploading to Cloudinary. Photos stored as encrypted blobs (`resource_type: raw`). Only space members with the decryption key can view them.

---

## Architecture (Phase 1 — Server-Held Keys)

```
Upload:  Phone → encrypt(AES-256-GCM, spaceKey) → blob → Cloudinary (auto/upload, .dat)
Display: Cloudinary URL → fetch blob → decrypt(spaceKey) → objectURL → <img>
```

- Each Space gets a random 256-bit AES key stored server-side
- Client fetches key via authenticated API (`GET /api/spaces/:id/key`)
- Key cached in Zustand store (memory only, cleared on logout)

---

## Database Changes

### schema.prisma — Add to Space model

```prisma
model Space {
  // ... existing fields ...
  encryptionKey String?
}
```

Run after: `npx prisma generate && npx prisma db push`

---

## Backend Changes

### routes/spaces.ts

#### 1. Import crypto

```typescript
import crypto from 'crypto'
```

#### 2. Generate key on space creation (POST /)

Add to the `prisma.space.create` data object:

```typescript
encryptionKey: crypto.randomBytes(32).toString('hex'),
```

#### 3. New endpoint: GET /api/spaces/:id/key

Place this BEFORE the existing `router.get('/:id', ...)` route:

```typescript
// GET /api/spaces/:id/key — returns the space encryption key (members only)
router.get('/:id/key', async (req, res) => {
  const user = (req as any).user as User
  const space = await prisma.space.findUnique({
    where: { id: req.params.id },
    include: { members: true },
  })
  if (!space) { res.status(404).json({ error: 'Space not found' }); return }

  const isMember = space.members.some((m: any) => m.userId === user.id && m.status === 'active')
  if (!isMember) { res.status(403).json({ error: 'Not a member of this space' }); return }

  // Generate key on-the-fly for spaces created before encryption was added
  if (!space.encryptionKey) {
    const key = crypto.randomBytes(32).toString('hex')
    await prisma.space.update({ where: { id: space.id }, data: { encryptionKey: key } })
    res.json({ key })
    return
  }

  res.json({ key: space.encryptionKey })
})
```

---

## Frontend Changes

### 1. New file: src/crypto.ts

```typescript
// AES-256-GCM encryption/decryption for photo blobs using Web Crypto API

const KEY_CACHE = new Map<string, CryptoKey>()

async function importKey(hexKey: string): Promise<CryptoKey> {
  const cached = KEY_CACHE.get(hexKey)
  if (cached) return cached

  const keyBytes = new Uint8Array(hexKey.match(/.{2}/g)!.map(b => parseInt(b, 16)))
  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyBytes, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']
  )
  KEY_CACHE.set(hexKey, cryptoKey)
  return cryptoKey
}

/** Encrypt a file/blob. Returns [12-byte IV][ciphertext containing 2-byte MIME len + MIME + original bytes] */
export async function encryptBlob(data: ArrayBuffer, mimeType: string, hexKey: string): Promise<Uint8Array> {
  const key = await importKey(hexKey)
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const meta = new TextEncoder().encode(mimeType)
  const metaLen = new Uint8Array(2)
  metaLen[0] = (meta.length >> 8) & 0xff
  metaLen[1] = meta.length & 0xff

  const payload = new Uint8Array(2 + meta.length + data.byteLength)
  payload.set(metaLen, 0)
  payload.set(meta, 2)
  payload.set(new Uint8Array(data), 2 + meta.length)

  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, payload)

  const result = new Uint8Array(12 + ciphertext.byteLength)
  result.set(iv, 0)
  result.set(new Uint8Array(ciphertext), 12)
  return result
}

/** Decrypt an encrypted blob. Returns { data: ArrayBuffer, mimeType: string } */
export async function decryptBlob(encrypted: ArrayBuffer, hexKey: string): Promise<{ data: ArrayBuffer; mimeType: string }> {
  const key = await importKey(hexKey)
  const bytes = new Uint8Array(encrypted)

  const iv = bytes.slice(0, 12)
  const ciphertext = bytes.slice(12)

  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)

  const dec = new Uint8Array(decrypted)
  const metaLen = (dec[0] << 8) | dec[1]
  const mimeType = new TextDecoder().decode(dec.slice(2, 2 + metaLen))
  const data = dec.slice(2 + metaLen).buffer

  return { data, mimeType }
}

// ── Object URL Cache (LRU) ──

const DECRYPTED_URL_CACHE = new Map<string, string>()
const MAX_CACHE_SIZE = 50

export function getCachedObjectUrl(cloudinaryUrl: string): string | undefined {
  return DECRYPTED_URL_CACHE.get(cloudinaryUrl)
}

export function setCachedObjectUrl(cloudinaryUrl: string, objectUrl: string): void {
  if (DECRYPTED_URL_CACHE.size >= MAX_CACHE_SIZE) {
    const firstKey = DECRYPTED_URL_CACHE.keys().next().value
    if (firstKey) {
      const oldUrl = DECRYPTED_URL_CACHE.get(firstKey)
      if (oldUrl) URL.revokeObjectURL(oldUrl)
      DECRYPTED_URL_CACHE.delete(firstKey)
    }
  }
  DECRYPTED_URL_CACHE.set(cloudinaryUrl, objectUrl)
}

/** Check if a photo URL is an encrypted upload */
export function isEncryptedUrl(url: string): boolean {
  if (!url) return false
  return url.includes('/raw/upload/') || url.includes('/auto/upload/') || url.endsWith('.dat')
}

export function clearKeyCache(): void { KEY_CACHE.clear() }

export function clearUrlCache(): void {
  for (const url of DECRYPTED_URL_CACHE.values()) URL.revokeObjectURL(url)
  DECRYPTED_URL_CACHE.clear()
}
```

### 2. Add to src/cloudinary.ts

```typescript
import { encryptBlob } from './crypto'

const ENCRYPTED_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`

export async function uploadEncryptedImage(file: File, encryptionKey: string): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error('Only JPEG, PNG, WebP and GIF images are allowed')
  if (file.size > MAX_FILE_SIZE) throw new Error('Image must be smaller than 10 MB')

  const arrayBuffer = await file.arrayBuffer()
  const encrypted = await encryptBlob(arrayBuffer, file.type, encryptionKey)

  const blob = new Blob([encrypted], { type: 'application/octet-stream' })
  const formData = new FormData()
  formData.append('file', blob, `encrypted-${Date.now()}.dat`)
  formData.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(ENCRYPTED_UPLOAD_URL, { method: 'POST', body: formData })
  if (!res.ok) throw new Error('Encrypted image upload failed')

  const data = await res.json()
  return data.secure_url
}

export async function uploadMultipleEncryptedImages(files: File[], encryptionKey: string): Promise<string[]> {
  return Promise.all(files.map(f => uploadEncryptedImage(f, encryptionKey)))
}
```

### 3. Add to src/api.ts

```typescript
getSpaceKey: (spaceId: string) =>
  request<{ key: string }>(`/spaces/${spaceId}/key`),
```

### 4. Add to src/store/useStore.ts

```typescript
// In AppState interface:
spaceKeys: Record<string, string>
getSpaceKey: (spaceId: string) => Promise<string>

// In store implementation:
spaceKeys: {},

getSpaceKey: async (spaceId) => {
  const cached = get().spaceKeys[spaceId]
  if (cached) return cached
  const { key } = await api.getSpaceKey(spaceId)
  set((state) => ({ spaceKeys: { ...state.spaceKeys, [spaceId]: key } }))
  return key
},

// In logout — add:
import { clearKeyCache, clearUrlCache } from '../crypto'
// ... inside logout():
clearKeyCache()
clearUrlCache()
// ... in reset object:
spaceKeys: {},
```

### 5. New file: src/components/DecryptedImage.tsx

```tsx
import { useState, useEffect } from 'react'
import { isEncryptedUrl, decryptBlob, getCachedObjectUrl, setCachedObjectUrl } from '../crypto'
import { useStore } from '../store/useStore'

interface DecryptedImageProps {
  src: string
  spaceId: string
  alt?: string
  className?: string
  loading?: 'lazy' | 'eager'
  onClick?: () => void
  onLoad?: () => void
}

export default function DecryptedImage({ src, spaceId, alt = '', className = '', loading, onClick, onLoad }: DecryptedImageProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [decrypting, setDecrypting] = useState(false)
  const getSpaceKey = useStore((s) => s.getSpaceKey)

  useEffect(() => {
    if (!src || !isEncryptedUrl(src)) return
    const cached = getCachedObjectUrl(src)
    if (cached) { setObjectUrl(cached); return }

    let cancelled = false
    setDecrypting(true)
    setError(false)

    ;(async () => {
      try {
        const key = await getSpaceKey(spaceId)
        const res = await fetch(src)
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
        const encrypted = await res.arrayBuffer()
        const { data, mimeType } = await decryptBlob(encrypted, key)
        if (cancelled) return
        const blob = new Blob([data], { type: mimeType })
        const url = URL.createObjectURL(blob)
        setCachedObjectUrl(src, url)
        setObjectUrl(url)
      } catch (err) {
        console.error('Failed to decrypt image:', err)
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setDecrypting(false)
      }
    })()

    return () => { cancelled = true }
  }, [src, spaceId, getSpaceKey])

  if (!isEncryptedUrl(src)) {
    return <img src={src} alt={alt} className={className} loading={loading} onClick={onClick} onLoad={onLoad} />
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-warmDark/5 ${className}`}>
        <span className="text-warmDark/40 text-xs">Failed to load</span>
      </div>
    )
  }

  if (decrypting || !objectUrl) {
    return (
      <div className={`flex items-center justify-center bg-warmDark/5 animate-pulse ${className}`}>
        <svg className="w-5 h-5 text-warmDark/20 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4 31.4" strokeLinecap="round" />
        </svg>
      </div>
    )
  }

  return <img src={objectUrl} alt={alt} className={className} loading={loading} onClick={onClick} onLoad={onLoad} />
}
```

### 6. Component changes — upload flows

In every component that calls `uploadImage`/`uploadMultipleImages`, add the encrypted variant:

```typescript
import { uploadMultipleEncryptedImages } from '../cloudinary'
import { useStore } from '../store/useStore'

// Before upload:
const spaceId = useStore.getState().activeSpaceId
const key = spaceId ? await useStore.getState().getSpaceKey(spaceId) : null
const urls = key ? await uploadMultipleEncryptedImages(files, key) : await uploadMultipleImages(files)
```

**Files to update:** CreateMemoryModal, MomentEditor, MemoryDetail, MemoryDetailA, MemoryDetailB, MemoryDetailC, ImageCropper, SpaceSelector (cover image upload)

### 7. Component changes — display flows

Replace `<img>` tags that render user photos with `<DecryptedImage>`:

```tsx
import { isEncryptedUrl } from '../crypto'
import DecryptedImage from './DecryptedImage'

// For thumbnails:
<DecryptedImage
  src={isEncryptedUrl(url) ? url : thumbnailUrl(url)}
  spaceId={spaceId}
  alt="..."
  className="..."
/>
```

**Files to update:** MemoryCard, MemoryDetailC (cover photo, photo grid, slideshow, lightbox, edit preview), MomentEditor (canvas renderer)

### 8. ImageCropper — decrypt before cropping

When opening the cropper with an encrypted URL, decrypt it first:

```typescript
onClick={async () => {
  if (isEncryptedUrl(url)) {
    const cached = getCachedObjectUrl(url)
    if (cached) { setCropSrc(cached); setCropIndex(pi); return }
    const spaceId = useStore.getState().activeSpaceId
    if (!spaceId) return
    const key = await useStore.getState().getSpaceKey(spaceId)
    const res = await fetch(url)
    const encrypted = await res.arrayBuffer()
    const { data, mimeType } = await decryptBlob(encrypted, key)
    const blob = new Blob([data], { type: mimeType })
    const objUrl = URL.createObjectURL(blob)
    setCachedObjectUrl(url, objUrl)
    setCropSrc(objUrl); setCropIndex(pi)
  } else {
    setCropSrc(url); setCropIndex(pi)
  }
}}
```

---

## Known Tradeoffs

| Issue | Impact |
|---|---|
| No Cloudinary transforms (thumbnails, blur, WebP) | Must download full-size blob even for card thumbnails |
| Double download time | Fetch encrypted blob → decrypt → render |
| ~33% storage overhead | Encryption adds IV + auth tag + MIME metadata |
| Memory pressure on mobile | Encrypted + decrypted buffers in memory simultaneously |
| No progressive loading | Can't show blur placeholder while loading |
| Old photos stay plaintext | Need migration tool (Phase 5) |
| Server holds keys (Phase 1) | DB breach exposes keys — true E2E requires Phase 2 |

## Future Phases

- **Phase 2:** User keypairs (X25519/ECDH) + client-side key wrapping → server can't read keys
- **Phase 3:** Key rotation on member removal
- **Phase 4:** Text field encryption (title, story, location, tags)
- **Phase 5:** Migration tool for existing plaintext photos
- **Phase 6:** Recovery phrases, device transfer, encryption status UI

---

## POC Standalone Test

A standalone HTML POC exists at `poc-photo-encryption/index.html` — demonstrates the full encrypt → upload → download → decrypt flow with no dependencies.
