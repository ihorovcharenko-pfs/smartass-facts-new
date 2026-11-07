// Share actions for the custom "Brag about it" sheet.
//   Instagram / TikTok have no web share URL → copy the caption, then hand the story-card
//   image to the OS share sheet (Web Share API with files). Desktop: download + toast.
//   X → intent URL, WhatsApp → wa.me, Copy link → clipboard.
import { track } from './analytics'
import type { Platform } from '../components/comic/PlatformIcons'

export const SITE = 'https://smartassfacts.com'

export interface ShareInfo {
  category: string
  score: number
  total: number
  /** Short challenge code (smartassfacts.com/beat/CODE); null if the API couldn't make one */
  code: string | null
}

export const shortLink = (code: string | null) => (code ? `smartassfacts.com/beat/${code}` : 'smartassfacts.com')

/** Full URL with UTM tags (utm_source = platform, utm_medium = share). */
export function shareUrl(info: ShareInfo, source: string): string {
  const base = info.code ? `${SITE}/beat/${info.code}` : `${SITE}/game/?cat=${encodeURIComponent(info.category)}`
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}utm_source=${source}&utm_medium=share`
}

export const captionFor = (info: ShareInfo) =>
  `I scored ${info.score}/${info.total} in ${info.category} on SmartAss Facts. Think you can beat me? ${shortLink(info.code)} #SmartAssFacts`

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try { // old-WebView fallback
      const ta = document.createElement('textarea')
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'
      document.body.appendChild(ta); ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch { return false }
  }
}

export function canShareFiles(file: File): boolean {
  try { return typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] }) } catch { return false }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

export interface ShareUi {
  toast: (msg: string) => void
  /** Clipboard failed → show the caption in a selectable box with a Copy button */
  showCaption: (text: string) => void
}

const CAPTION_TOAST = 'Caption + link copied. Paste it in your post, or add it with the link sticker.'

export async function runShare(platform: Platform | 'save', info: ShareInfo, image: Blob | null, ui: ShareUi, mode: string) {
  const base = { category: info.category, mode }
  const file = image ? new File([image], 'smartass-score.png', { type: 'image/png' }) : null

  if (platform === 'instagram' || platform === 'tiktok') {
    track('share', { platform, ...base })
    const caption = captionFor(info)
    // Start the clipboard write and the share in the same tick so the share keeps its
    // user-gesture (iOS Safari rejects navigator.share after an awaited promise).
    const copying = copyText(caption)
    let sharing: Promise<unknown> | null = null
    if (file && canShareFiles(file)) sharing = navigator.share({ files: [file] }).catch(() => undefined)
    const ok = await copying
    if (ok) { track('caption_copied', { platform, ...base }); ui.toast(CAPTION_TOAST) } else ui.showCaption(caption)
    if (sharing) await sharing
    else if (image) downloadBlob(image, 'smartass-score.png') // desktop fallback: image + copied link
    return
  }

  if (platform === 'x') {
    track('share', { platform, ...base })
    const text = `I scored ${info.score}/${info.total} in ${info.category} on SmartAss Facts. Think you can beat me?`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl(info, 'x'))}`, '_blank', 'noopener')
    return
  }

  if (platform === 'whatsapp') {
    track('share', { platform, ...base })
    const text = `I scored ${info.score}/${info.total} in ${info.category} on SmartAss Facts. Think you can beat me? ${shareUrl(info, 'whatsapp')}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
    return
  }

  if (platform === 'copy') {
    track('share', { platform, ...base })
    const url = shareUrl(info, 'copy')
    const ok = await copyText(url)
    if (ok) ui.toast('Copied!')
    else ui.showCaption(url)
    return
  }

  // save
  track('share', { platform: 'save', ...base })
  if (!image) return ui.toast('Your card isn’t ready yet. Try again in a second.')
  // Touch devices: the OS share sheet offers "Save Image" (browser downloads are awkward on phones)
  const touch = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches
  if (file && canShareFiles(file) && touch) {
    await navigator.share({ files: [file] }).catch(() => undefined) // sheet offers "Save Image"
  } else {
    downloadBlob(image, 'smartass-score.png')
    ui.toast('Image saved.')
  }
}
