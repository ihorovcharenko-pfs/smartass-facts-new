// 1080×1920 story card, drawn on a canvas: logo, "I scored 8/10", category sticker,
// "Beat me?" pill, and the short challenge link in large type at the bottom.
import { getCategoryArt } from './categoryImages'

const W = 1080
const H = 1920

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

function fitText(ctx: CanvasRenderingContext2D, text: string, family: string, weight: number, maxSize: number, maxWidth: number): number {
  let size = maxSize
  ctx.font = `${weight} ${size}px ${family}`
  while (ctx.measureText(text).width > maxWidth && size > 28) { size -= 4; ctx.font = `${weight} ${size}px ${family}` }
  return size
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath()
}

export interface CardData { score: number; total: number; category: string; link: string }

export async function generateStoryCard({ score, total, category, link }: CardData): Promise<Blob | null> {
  try { await document.fonts?.ready } catch { /* ignore */ }
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const family = getComputedStyle(document.body).fontFamily || 'system-ui, sans-serif'

  // Background + halftone dots
  ctx.fillStyle = '#16162b'; ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#26264a'
  for (let y = 14; y < H; y += 28) for (let x = 14; x < W; x += 28) { ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill() }

  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'

  // Logo medallion
  const logo = await loadImage('/smartass-logo.png')
  ctx.save(); ctx.beginPath(); ctx.arc(W / 2, 190, 110, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill()
  ctx.lineWidth = 10; ctx.strokeStyle = '#000'; ctx.stroke(); ctx.clip()
  if (logo) ctx.drawImage(logo, W / 2 - 100, 90, 200, 200)
  ctx.restore()
  ctx.fillStyle = '#b8b8d0'; ctx.font = `900 40px ${family}`; ctx.fillText('SMARTASS FACTS', W / 2, 370)

  // "I scored" + big score
  ctx.fillStyle = '#fff'; ctx.font = `800 72px ${family}`; ctx.fillText('I scored', W / 2, 500)
  const scoreText = `${score}/${total}`
  ctx.font = `900 330px ${family}`
  ctx.lineJoin = 'round'; ctx.lineWidth = 26; ctx.strokeStyle = '#000'
  ctx.strokeText(scoreText, W / 2 + 10, 790 + 10); ctx.fillStyle = '#000'; ctx.fillText(scoreText, W / 2 + 10, 800)
  ctx.strokeText(scoreText, W / 2, 790); ctx.fillStyle = '#ffd23f'; ctx.fillText(scoreText, W / 2, 790)

  // "in {category}"
  ctx.fillStyle = '#fff'
  const inText = `in ${category}`
  fitText(ctx, inText, family, 900, 84, W - 140); ctx.fillText(inText, W / 2, 900)

  // Category sticker (square, white, bordered, tilted, hard shadow) — never cropped
  const artUrl = getCategoryArt(category)
  const art = artUrl ? await loadImage(artUrl) : null
  const S = 540, cx = W / 2, cy = 1230
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(-3 * Math.PI / 180)
  ctx.fillStyle = '#000'; roundRect(ctx, -S / 2 + 18, -S / 2 + 18, S, S, 26); ctx.fill()
  ctx.fillStyle = '#fff'; roundRect(ctx, -S / 2, -S / 2, S, S, 26); ctx.fill()
  if (art) { ctx.save(); roundRect(ctx, -S / 2, -S / 2, S, S, 26); ctx.clip(); ctx.drawImage(art, -S / 2, -S / 2, S, S); ctx.restore() }
  ctx.lineWidth = 10; ctx.strokeStyle = '#000'; roundRect(ctx, -S / 2, -S / 2, S, S, 26); ctx.stroke()
  ctx.restore()

  // "Beat me?" pill
  const px = W / 2 - 250, py = 1560, pw = 500, ph = 120
  ctx.fillStyle = '#000'; roundRect(ctx, px + 8, py + 12, pw, ph, 60); ctx.fill()
  ctx.fillStyle = '#ff6b35'; roundRect(ctx, px, py, pw, ph, 60); ctx.fill()
  ctx.lineWidth = 8; ctx.strokeStyle = '#000'; roundRect(ctx, px, py, pw, ph, 60); ctx.stroke()
  ctx.fillStyle = '#111'; ctx.font = `900 62px ${family}`; ctx.fillText('Beat me?', W / 2, py + 82)

  // Short link, large and readable (typeable even if the tap link is lost)
  ctx.fillStyle = '#fff'
  fitText(ctx, link, family, 900, 70, W - 120); ctx.fillText(link, W / 2, 1830)

  return new Promise(resolve => canvas.toBlob(b => resolve(b), 'image/png'))
}
