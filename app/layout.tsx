import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import '../styles/index.scss'
import Providers from '../components/Providers'
import Analytics from '../components/Analytics'
import ServiceWorkerRegister from '../components/ServiceWorkerRegister'

// Self-hosted (no external Google request) + display:swap so text paints
// instantly in a fallback and swaps when the webfont arrives. Exposed as CSS
// variables consumed throughout the SCSS (var(--font-inter) / --font-space-grotesk).
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SmartAss Facts — Fake or Fact Trivia Game',
  description: 'Can you tell fact from fiction? Pick a category and find out.',
  icons: { icon: '/favicon.png' },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* Pre-warm the API connection the first data fetch needs. Fonts are now
            self-hosted (next/font), so no fonts.googleapis/gstatic preconnects. */}
        <link rel="preconnect" href="https://api.smartassfacts.com" />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KBFTJDH2"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Analytics />
        <ServiceWorkerRegister />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
