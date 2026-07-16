import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import staticContentPaths from './static-content-paths.json'

// Restored static SEO pages (myth/vs/topic/country/people/animal detail pages,
// their hub pages, the author page, and the embeddable quiz) live in /public
// as <path>/index.html. Next.js doesn't resolve directory indexes in /public,
// so those exact paths are rewritten to their index.html file here.
const STATIC_PAGES = new Set<string>(staticContentPaths)

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect any /facts/[MixedCase]... URL to its lowercase equivalent.
  // Google crawled these from old sitemaps/links that had incorrect casing.
  const lower = pathname.toLowerCase()
  if (lower !== pathname) {
    const url = request.nextUrl.clone()
    url.pathname = lower
    return NextResponse.redirect(url, { status: 301 })
  }

  // Only rewrite trailing-slash requests; non-slash ones get Next's own
  // trailingSlash 308 first and come back here with the slash.
  if (pathname.endsWith('/') && STATIC_PAGES.has(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = `${pathname}index.html`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/facts/:path*', '/about/:path*', '/embed/:path*'],
}
