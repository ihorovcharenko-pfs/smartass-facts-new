// One-off (re-run when fact content changes): fetch every fact from the API and
// write their sitemap path suffixes to app/fact-urls.json. Done as a slow,
// sequential, retry-on-429 script so it never trips the API's rate limit — the
// sitemap then reads this committed file (fast, reliable builds; no live-API load).
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const API = 'https://api.smartassfacts.com/api/client/facts/by-category'
const OUT = fileURLToPath(new URL('../app/fact-urls.json', import.meta.url))

// All category slugs (CATEGORY_DISPLAY keys). Empty/alias slugs return 0 and are skipped.
const SLUGS = [
  'arts','cars','construction','countries','design','famous-people','fashion','finance',
  'food','games','geography','guinness-world-records','health','history','human-brain',
  'humans','humour','inventions','languages','literature','mathematics','movies','music',
  'nature','people','pets-animals','philosophy','physics','politics','psychology','religion',
  'science','space','sports','technology','topics','travel',
]

// Mirror of buildFactSlug() in utils/categoryNames.ts
function buildFactSlug(id, saFact) {
  const slug = saFact
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)
    .replace(/-+$/, '')
  return `${id}-${slug}`
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function fetchPage(slug, page, attempt = 1) {
  try {
    const res = await fetch(`${API}/${slug}?page=${page}`)
    if (res.status === 429 || res.status >= 500) {
      if (attempt > 7) return null
      await sleep(1500 * attempt) // exponential-ish backoff
      return fetchPage(slug, page, attempt + 1)
    }
    if (!res.ok) return null
    return await res.json()
  } catch {
    if (attempt > 7) return null
    await sleep(1500 * attempt)
    return fetchPage(slug, page, attempt + 1)
  }
}

const paths = []
for (const slug of SLUGS) {
  const first = await fetchPage(slug, 1)
  await sleep(250)
  if (!first || first.total === 0) { console.log(`${slug.padEnd(24)} → 0 (skip)`); continue }

  const facts = [...first.facts]
  for (let p = 2; p <= first.pages; p++) {
    const data = await fetchPage(slug, p)
    await sleep(250)
    if (data) facts.push(...data.facts)
  }
  for (const f of facts) paths.push(`${slug}/${buildFactSlug(f.id, f.saFact)}`)
  console.log(`${slug.padEnd(24)} → ${facts.length} / ${first.total}`)
}

writeFileSync(OUT, JSON.stringify(paths))
console.log(`\nTOTAL fact URLs: ${paths.length} → ${OUT}`)
