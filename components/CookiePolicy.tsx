'use client'

import { useEffect, useRef } from 'react'
import '../styles/Cookie.scss'

const TOC_ITEMS = [
  { href: '#what-are-cookies', label: 'What are cookies?' },
  { href: '#how-we-use', label: 'How we use them' },
  { href: '#types', label: 'Types of cookies' },
  { href: '#third-party', label: 'Third-party cookies' },
  { href: '#your-choices', label: 'Your choices' },
  { href: '#retention', label: 'Retention periods' },
  { href: '#updates', label: 'Policy updates' },
  { href: '#contact', label: 'Contact us' },
]

export default function CookiePolicy() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const revealEls = root.querySelectorAll('.reveal')
    const sections = root.querySelectorAll('.policy-section[id]')
    const tocLinks = root.querySelectorAll('.toc a')
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            revealObs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08 }
    )
    revealEls.forEach((el) => revealObs.observe(el))
    const tocObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            tocLinks.forEach((l) => l.classList.remove('active'))
            const active = root.querySelector(`.toc a[href="#${(e.target as HTMLElement).id}"]`)
            if (active) active.classList.add('active')
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    sections.forEach((s) => tocObs.observe(s))
    const handleTocClick = (e: Event) => {
      const link = (e.target as HTMLElement).closest('a')
      if (!link || !link.hash) return
      e.preventDefault()
      const target = root.querySelector(link.getAttribute('href')!)
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    tocLinks.forEach((link) => link.addEventListener('click', handleTocClick))
    return () => {
      revealEls.forEach((el) => revealObs.unobserve(el))
      sections.forEach((s) => tocObs.unobserve(s))
      tocLinks.forEach((link) => link.removeEventListener('click', handleTocClick))
    }
  }, [])

  return (
    <div className="cookie-policy" ref={rootRef}>
      <header className="policy-hero">
        <div className="eyebrow">
          <span>🍪</span> Legal
        </div>
        <h1>Cookie Policy</h1>
        <p>
          We use cookies to make Smartass Facts work better — and to make sure we&apos;re not
          tracking you like a creep.
        </p>
        <div className="meta-row">
          <div className="meta-chip">
            📅 Last updated: <strong>May 1, 2025</strong>
          </div>
          <div className="meta-chip">
            🌍 Applies to: <strong>smartassfacts.com</strong>
          </div>
          <div className="meta-chip">
            📋 Version: <strong>1.2</strong>
          </div>
        </div>
      </header>

      <div className="policy-layout">
        <aside className="toc">
          <div className="toc-label">On this page</div>
          <ul>
            {TOC_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={item.href === '#what-are-cookies' ? 'active' : ''}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <article className="policy-article">
          <section className="policy-section reveal" id="what-are-cookies">
            <h2>What are cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device (computer, phone, tablet)
              when you visit a website. They&apos;re stored by your browser and sent back to us on
              future visits so we can remember who you are and how you prefer to use the app.
            </p>
            <p>
              Think of them like the &quot;remember me&quot; checkbox at login — except they work
              automatically in the background. They can&apos;t run code, carry viruses, or access
              your device&apos;s files. They&apos;re just tiny notes.
            </p>
            <div className="callout">
              <div className="callout-icon">💡</div>
              <p>
                <strong>Fun fact:</strong> The term &quot;cookie&quot; comes from &quot;magic
                cookie&quot; — a computing concept for a packet of data that a program receives and
                sends back unchanged. Not nearly as delicious as it sounds.
              </p>
            </div>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="how-we-use">
            <h2>How we use cookies</h2>
            <p>Smartass Facts uses cookies and similar technologies for the following purposes:</p>
            <ul>
              <li>To keep you signed in to your account across sessions</li>
              <li>To remember your game preferences, category selections, and UI settings</li>
              <li>To understand how you interact with the app so we can improve it</li>
              <li>To measure the effectiveness of our marketing campaigns</li>
              <li>To detect and prevent fraud and abuse</li>
              <li>To comply with legal obligations (e.g., GDPR consent records)</li>
            </ul>
            <p>
              We do <strong>not</strong> sell your cookie data to third parties. We don&apos;t use
              cookies to build advertising profiles on you or track you across unrelated websites.
            </p>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="types">
            <h2>Types of cookies we use</h2>
            <p>We classify our cookies into four categories based on their function:</p>
            <div className="cookie-cards">
              <div className="cookie-card">
                <div className="cookie-card-icon">🔒</div>
                <span className="badge badge-required">Required</span>
                <h3>Strictly Necessary</h3>
                <p>
                  Essential for the website to function. Can&apos;t be switched off. They include
                  session management, security tokens, and consent records.
                </p>
              </div>
              <div className="cookie-card">
                <div className="cookie-card-icon">📊</div>
                <span className="badge badge-analytics">Analytics</span>
                <h3>Performance &amp; Analytics</h3>
                <p>
                  Help us understand how visitors use Smartass Facts — which facts get played most,
                  where people drop off, and what&apos;s working.
                </p>
              </div>
              <div className="cookie-card">
                <div className="cookie-card-icon">⚙️</div>
                <span className="badge badge-optional">Optional</span>
                <h3>Functional</h3>
                <p>
                  Remember your preferences like theme, language, and game settings. Disabling these
                  won&apos;t break anything, but we&apos;ll forget who you are.
                </p>
              </div>
              <div className="cookie-card">
                <div className="cookie-card-icon">📣</div>
                <span className="badge badge-marketing">Marketing</span>
                <h3>Marketing &amp; Targeting</h3>
                <p>
                  Used to measure the effectiveness of ad campaigns and show you relevant content on
                  other platforms. These are always opt-in.
                </p>
              </div>
            </div>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="third-party">
            <h2>Third-party cookies</h2>
            <p>Some cookies on Smartass Facts are set by third-party services we use:</p>
            <table className="cookie-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Cookie name</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Google Analytics</td>
                  <td><code>_ga</code>, <code>_gid</code></td>
                  <td>Tracks page views and session info for analytics</td>
                  <td>2 years / 24 hrs</td>
                </tr>
                <tr>
                  <td>Firebase</td>
                  <td><code>__session</code></td>
                  <td>Session management and user authentication</td>
                  <td>Session</td>
                </tr>
                <tr>
                  <td>Meta Pixel</td>
                  <td><code>_fbp</code>, <code>_fbc</code></td>
                  <td>Ad conversion tracking (opt-in only)</td>
                  <td>90 days</td>
                </tr>
                <tr>
                  <td>Stripe</td>
                  <td><code>__stripe_mid</code></td>
                  <td>Fraud prevention during payment flows</td>
                  <td>1 year</td>
                </tr>
                <tr>
                  <td>Smartass Facts</td>
                  <td><code>sf_consent</code></td>
                  <td>Stores your cookie consent preferences</td>
                  <td>1 year</td>
                </tr>
                <tr>
                  <td>Smartass Facts</td>
                  <td><code>sf_session</code></td>
                  <td>Keeps you logged in across page loads</td>
                  <td>30 days</td>
                </tr>
              </tbody>
            </table>
            <p>
              Third-party providers have their own privacy policies. We encourage you to review
              them:{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google</a>
              ,{' '}
              <a href="https://www.facebook.com/policy.php" target="_blank" rel="noopener noreferrer">Meta</a>
              ,{' '}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe</a>.
            </p>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="your-choices">
            <h2>Your choices</h2>
            <p>You&apos;re in control. Here&apos;s how you can manage your cookie preferences:</p>
            <ol>
              <li>
                <strong>Cookie banner:</strong> When you first visit Smartass Facts, we show a consent
                banner. You can accept all, reject optional cookies, or customise your preferences.
              </li>
              <li>
                <strong>Cookie Settings link:</strong> You can update your preferences at any time by
                clicking &quot;Cookie Settings&quot; in the footer.
              </li>
              <li>
                <strong>Browser settings:</strong> All modern browsers let you block or delete
                cookies. Check your browser&apos;s help docs:{' '}
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome</a>
                ,{' '}
                <a href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">Firefox</a>
                ,{' '}
                <a href="https://support.apple.com/guide/safari/sfri11471" target="_blank" rel="noopener noreferrer">Safari</a>.
              </li>
              <li>
                <strong>Opt-out links:</strong> For Google Analytics, you can install the{' '}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.
              </li>
            </ol>
            <div className="callout">
              <div className="callout-icon">⚠️</div>
              <p>
                <strong>Heads up:</strong> Blocking strictly necessary cookies will prevent the app
                from working correctly. You won&apos;t be able to log in, save progress, or play in
                authenticated mode.
              </p>
            </div>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="retention">
            <h2>Retention periods</h2>
            <p>Cookies are stored for varying lengths of time depending on their type:</p>
            <ul>
              <li>
                <strong>Session cookies</strong> — deleted automatically when you close your browser.
              </li>
              <li>
                <strong>Persistent cookies</strong> — remain on your device until they expire or you
                delete them. Most expire within 30 days to 1 year.
              </li>
              <li>
                <strong>Consent records</strong> — your consent preferences are stored for 12
                months, after which we&apos;ll ask again.
              </li>
            </ul>
            <p>
              You can delete all cookies at any time via your browser settings. This won&apos;t
              delete your account data — just local browser preferences.
            </p>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="updates">
            <h2>Policy updates</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology,
              legislation, or how we operate. When we make significant changes, we&apos;ll notify you
              via:
            </p>
            <ul>
              <li>A banner on the Smartass Facts website</li>
              <li>An in-app notification (if you have an account)</li>
              <li>An email to registered users (for material changes)</li>
            </ul>
            <p>
              The &quot;Last updated&quot; date at the top of this page always reflects the most
              recent revision. Continued use of Smartass Facts after changes constitutes acceptance
              of the revised policy.
            </p>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="contact">
            <h2>Contact us</h2>
            <p>Got questions about cookies, data, or anything privacy-related? We&apos;re happy to help.</p>
            <div className="contact-card">
              <div>
                <h3>Talk to a real person 🐒</h3>
                <p>
                  Our privacy team usually responds within 2 business days.
                  <br />
                  You can also reach us for GDPR / CCPA requests.
                </p>
              </div>
              <a href="mailto:privacy@smartassfacts.com" className="pill-btn-white">
                📩 privacy@smartassfacts.com
              </a>
            </div>
          </section>
        </article>
      </div>
    </div>
  )
}
