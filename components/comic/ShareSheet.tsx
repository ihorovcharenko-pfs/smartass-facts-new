'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Button from './Button'
import { PlatformIcon, PLATFORM_BG, PLATFORM_LABEL, type Platform } from './PlatformIcons'
import { useToast } from './Toast'
import { useAuth } from '../../context/AuthContext'
import { createBeat } from '../../services/clientService'
import { generateStoryCard } from '../../utils/shareCard'
import { runShare, shortLink, copyText, type ShareInfo } from '../../utils/share'
import '../../styles/comic.scss'

interface Props {
  open: boolean
  onClose: () => void
  category: string
  score: number
  total: number
  /** Analytics mode: single | daily | party … */
  mode?: string
  /** Sharer name for the "Beat Gigi's 8/10" banner (defaults to the signed-in username) */
  name?: string | null
}

const APPS: Platform[] = ['instagram', 'tiktok', 'x', 'whatsapp', 'copy']

/** "Brag about it" bottom sheet: 9:16 story-card preview + platform buttons + Save image. */
export default function ShareSheet({ open, onClose, category, score, total, mode = 'single', name }: Props) {
  const { user } = useAuth()
  const { toast, node } = useToast()
  const [code, setCode] = useState<string | null>(null)
  const [image, setImage] = useState<Blob | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [caption, setCaption] = useState<string | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const madeFor = useRef<string>('')

  // One short code + one story card per (category, score) — created when the sheet first opens
  useEffect(() => {
    if (!open) return
    const key = `${category}|${score}|${total}`
    if (madeFor.current === key) return
    madeFor.current = key
    let cancelled = false
    setImage(null); setPreviewUrl(null); setCaption(null)
    ;(async () => {
      const c = await createBeat(category, score, total, name ?? user?.username ?? null)
      if (cancelled) return
      setCode(c)
      const blob = await generateStoryCard({ score, total, category, link: shortLink(c) })
      if (cancelled || !blob) return
      setImage(blob)
      setPreviewUrl(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(blob) })
    })()
    return () => { cancelled = true }
  }, [open, category, score, total, name, user?.username])

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  // Modal behaviour: Esc closes, focus moves in and stays in, page behind doesn't scroll
  useEffect(() => {
    if (!open) return
    const prevFocus = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab' || !sheetRef.current) return
      const f = Array.from(sheetRef.current.querySelectorAll<HTMLElement>('button, textarea, [href]')).filter(x => !x.hasAttribute('disabled'))
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; prevFocus?.focus?.() }
  }, [open, onClose])

  const info: ShareInfo = { category, score, total, code }
  const act = useCallback((p: Platform | 'save') => runShare(p, info, image, { toast, showCaption: setCaption }, mode),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category, score, total, code, image, mode, toast])

  if (!open) return null

  return (
    <div className="cp-sheet-backdrop" onClick={onClose}>
      <div ref={sheetRef} className="cp-sheet" role="dialog" aria-modal="true" aria-labelledby="cp-sheet-title" onClick={e => e.stopPropagation()}>
        <div className="cp-sheet__grip" aria-hidden="true" />
        <div className="cp-sheet__head">
          <h2 id="cp-sheet-title" className="cp-sheet__title">Brag about it</h2>
          <Button ref={closeRef} variant="white" size="round" aria-label="Close" onClick={onClose}><span aria-hidden="true">✕</span></Button>
        </div>

        <div className="cp-sheet__preview-row">
          <div className="cp-sheet__preview">{previewUrl ? <img src={previewUrl} alt={`Score card: ${score}/${total} in ${category}`} /> : null}</div>
          <div className="cp-sheet__blurb">
            <strong>{image ? 'Your score card is ready.' : 'Making your card…'}</strong>
            <p>Sized for stories. Friends who tap it land straight in {category}.</p>
          </div>
        </div>

        <div className="cp-sheet__apps">
          {APPS.map(p => (
            <button key={p} type="button" className="cp-app" onClick={() => act(p)}>
              <span className="cp-app__icon" style={{ background: PLATFORM_BG[p] }}><PlatformIcon platform={p} /></span>
              {PLATFORM_LABEL[p]}
            </button>
          ))}
        </div>

        {caption && (
          <div className="cp-sheet__caption">
            <textarea readOnly value={caption} aria-label="Caption to copy" onFocus={e => e.currentTarget.select()} />
            <Button variant="yellow" size="small" onClick={async () => { if (await copyText(caption)) toast('Copied!') }}>Copy</Button>
          </div>
        )}

        <Button variant="black" block onClick={() => act('save')}>Save image</Button>
      </div>
      {node}
    </div>
  )
}
