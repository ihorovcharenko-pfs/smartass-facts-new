// The derived AES key is the same for every answer — build it once, and memoize
// results per ciphertext so pre-warming (see GamePage) makes answering instant.
let keyPromise: Promise<CryptoKey> | null = null
const answerCache = new Map<string, Promise<boolean>>()

function getKey(): Promise<CryptoKey> {
  if (!keyPromise) {
    keyPromise = (async () => {
      const envKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-encryption-key-change-in-production'
      let keyBuffer: ArrayBuffer
      if (envKey.length === 64 && /^[0-9a-fA-F]+$/.test(envKey)) {
        const hexBytes = envKey.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16))
        keyBuffer = new Uint8Array(hexBytes).buffer
      } else {
        keyBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(envKey))
      }
      return crypto.subtle.importKey('raw', keyBuffer, { name: 'AES-CBC' }, false, ['decrypt'])
    })()
    keyPromise.catch(() => { keyPromise = null })
  }
  return keyPromise
}

export function decryptAnswer(encryptedAnswer: string): Promise<boolean> {
  let p = answerCache.get(encryptedAnswer)
  if (!p) {
    p = decryptUncached(encryptedAnswer)
    answerCache.set(encryptedAnswer, p)
  }
  return p
}

async function decryptUncached(encryptedAnswer: string): Promise<boolean> {
  try {
    const [ivHex, encryptedHex] = encryptedAnswer.split(':')
    if (!ivHex || !encryptedHex) {
      throw new Error('Invalid encrypted answer format')
    }

    const key = await getKey()

    const iv = Uint8Array.from(ivHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
    const encrypted = Uint8Array.from(encryptedHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))

    const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, encrypted)

    return new TextDecoder().decode(decrypted) === 'true'
  } catch (error) {
    console.error('Error decrypting answer:', error)
    return false
  }
}
