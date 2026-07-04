import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Redirect any /facts/[MixedCase]... URL to its lowercase equivalent.
// Google crawled these from old sitemaps/links that had incorrect casing.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const lower = pathname.toLowerCase()
  if (lower !== pathname) {
    const url = request.nextUrl.clone()
    url.pathname = lower
    return NextResponse.redirect(url, { status: 301 })
  }
  return NextResponse.next()
}

export const config = {
  // Only run on paths that start with /facts/ and contain an uppercase letter
  matcher: ['/facts/:path*'],
}
