import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import staticContentPaths from './static-content-paths.json'

// Restored static SEO pages (myth/vs/topic/country/people/animal detail pages,
// their hub pages, the author page, and the embeddable quiz) live in /public
// as <path>/index.html. Next.js doesn't resolve directory indexes in /public,
// so those exact paths are rewritten to their index.html file here.
const STATIC_PAGES = new Set<string>(staticContentPaths)

// Last path segment contains a dot → an actual file (index.html, widget.html);
// never append a trailing slash to those.
const isFile = (p: string) => /\.[a-z0-9]+$/i.test(p)

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Old homepage filter links (/?category=Design). The next.config redirect
  // used for this carried the query string along, minting duplicate URLs like
  // /facts/design/?category=design that Google then flagged. Handled here so
  // the query can be dropped entirely.
  if (pathname === '/' && searchParams.has('category')) {
    const cat = (searchParams.get('category') || '').toLowerCase().replace(/[^a-z0-9-]/g, '')
    const url = request.nextUrl.clone()
    url.pathname = cat ? `/facts/${cat}/` : '/facts/'
    url.search = ''
    return NextResponse.redirect(url, { status: 301 })
  }

  // Normalize legacy /facts/[MixedCase] URLs (old sitemaps/links had wrong
  // casing) — lowercase and trailing slash in one 301. (Next's own
  // trailingSlash 308 usually runs first, so the slash branch here is a
  // safety net that keeps the chain short if that ordering ever changes.)
  const lower = pathname.toLowerCase()
  const normalized = lower.endsWith('/') || isFile(lower) ? lower : `${lower}/`
  if (normalized !== pathname) {
    const url = request.nextUrl.clone()
    url.pathname = normalized
    return NextResponse.redirect(url, { status: 301 })
  }

  if (pathname.endsWith('/') && STATIC_PAGES.has(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = `${pathname}index.html`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/facts/:path*', '/about/:path*', '/embed/:path*'],
}
