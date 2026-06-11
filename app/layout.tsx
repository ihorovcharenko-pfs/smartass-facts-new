import type { Metadata } from 'next'
import '../styles/index.scss'
import Providers from '../components/Providers'
import Analytics from '../components/Analytics'
import ServiceWorkerRegister from '../components/ServiceWorkerRegister'

export const metadata: Metadata = {
  title: 'SmartAss Facts — Fake or Fact Trivia Game',
  description: 'Can you tell fact from fiction? Pick a category and find out.',
  icons: { icon: '/favicon.png' },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Pre-warm the connections the first paint needs */}
        <link rel="preconnect" href="https://api.smartassfacts.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
        />
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
