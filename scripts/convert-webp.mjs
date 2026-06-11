// One-off: regenerate the WebP category images from their PNG/JPG sources.
// The production VPS already serves .webp, but they were never committed to
// source — this reproduces them so they deploy with the repo (and to Vercel).
import sharp from 'sharp'
import { readdirSync, statSync } from 'node:fs'
import { join, parse } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIR = fileURLToPath(new URL('../public/category-images/', import.meta.url))

const files = readdirSync(DIR).filter((f) => /\.(png|jpe?g)$/i.test(f))
let done = 0
let savedBytes = 0

for (const file of files) {
  const src = join(DIR, file)
  const out = join(DIR, parse(file).name + '.webp')
  const before = statSync(src).size
  await sharp(src).webp({ quality: 80 }).toFile(out)
  const after = statSync(out).size
  savedBytes += before - after
  done++
  console.log(`${file}  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`)
}

console.log(`\nConverted ${done} images. Saved ${(savedBytes / 1024 / 1024).toFixed(1)} MB total.`)
