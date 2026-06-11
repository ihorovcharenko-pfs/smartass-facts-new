'use client'

import { useEffect, useRef } from 'react'
import '../styles/Terms.scss'

const TOC_ITEMS = [
  { href: '#acceptance', num: 1, label: 'Acceptance' },
  { href: '#about-service', num: 2, label: 'About the Service' },
  { href: '#eligibility', num: 3, label: 'Eligibility' },
  { href: '#accounts', num: 4, label: 'Accounts' },
  { href: '#subscriptions', num: 5, label: 'Subscriptions & Billing' },
  { href: '#user-content', num: 6, label: 'User Content' },
  { href: '#acceptable-use', num: 7, label: 'Acceptable Use' },
  { href: '#ip', num: 8, label: 'Intellectual Property' },
  { href: '#third-party', num: 9, label: 'Third-Party Services' },
  { href: '#disclaimers', num: 10, label: 'Disclaimers' },
  { href: '#liability', num: 11, label: 'Limitation of Liability' },
  { href: '#indemnification', num: 12, label: 'Indemnification' },
  { href: '#termination', num: 13, label: 'Termination' },
  { href: '#disputes', num: 14, label: 'Disputes & Governing Law' },
  { href: '#changes', num: 15, label: 'Changes to Terms' },
  { href: '#contact', num: 16, label: 'Contact Us' },
]

export default function TermsOfService() {
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
      { threshold: 0.06 }
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
      { rootMargin: '-15% 0px -75% 0px' }
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
    <div className="terms-of-service" ref={rootRef}>
      <header className="policy-hero">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          Legal
        </div>
        <h1>Terms of Service</h1>
        <p className="hero-desc">
          The rules of the game — for the app and for us. Plain language, no traps. By playing, you
          agree to these terms.
        </p>
        <div className="meta-row">
          <div className="meta-chip">
            📅 Effective: <strong>May 1, 2025</strong>
          </div>
          <div className="meta-chip">
            🔄 Last updated: <strong>May 1, 2025</strong>
          </div>
          <div className="meta-chip">
            🌍 Applies to: <strong>smartassfacts.com &amp; apps</strong>
          </div>
        </div>
        <div className="compliance-row">
          <span className="compliance-badge">✅ GDPR Aligned</span>
          <span className="compliance-badge">✅ Consumer Rights Act 2015</span>
          <span className="compliance-badge">✅ DSA Compliant</span>
        </div>
      </header>

      <div className="summary-strip">
        <div className="summary-inner">
          <div className="summary-item">
            <div className="summary-icon si-amber">🎮</div>
            <div className="summary-text">
              <h4>Free to play</h4>
              <p>Core game is always free. Premium features available via subscription.</p>
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-icon si-green">🧠</div>
            <div className="summary-text">
              <h4>You own your content</h4>
              <p>Facts and content you submit remain yours. We just licence the right to display them.</p>
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-icon si-sky">🔒</div>
            <div className="summary-text">
              <h4>Your data stays yours</h4>
              <p>We don&apos;t sell personal data. Full details in our Privacy Policy.</p>
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-icon si-mint">🚪</div>
            <div className="summary-text">
              <h4>Leave anytime</h4>
              <p>Delete your account and all associated data at any time, no questions asked.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="policy-layout">
        <aside className="toc">
          <div className="toc-label">Contents</div>
          <ul>
            {TOC_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={item.num === 1 ? 'active' : ''}>
                  <span className="toc-num">{item.num}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <article className="policy-article">
          <section className="policy-section reveal" id="acceptance">
            <h2>
              <span className="section-icon si-amber">📜</span>
              Acceptance of Terms
            </h2>
            <p className="section-intro">By using Smartass Facts, you agree to be bound by these Terms.</p>
            <p>
              Welcome to Smartass Facts. These Terms of Service (&quot;Terms&quot;) govern your access to and use
              of the Smartass Facts website at <a href="https://smartassfacts.com">smartassfacts.com</a>, our
              mobile applications, APIs, and all related services (collectively the &quot;Service&quot;),
              operated by <strong>Smartass Facts Ltd.</strong> (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
            </p>
            <p>
              By creating an account, accessing, or using any part of the Service, you confirm that you have
              read, understood, and agree to be bound by these Terms and our{' '}
              <a href="/privacy">Privacy Policy</a>. If you do not agree, you must not use the Service.
            </p>
            <div className="callout callout-amber">
              <div className="callout-icon">⚡</div>
              <div className="callout-body">
                <strong>The short version</strong>
                <p>
                  Use Smartass Facts to play, learn, and have fun. Don&apos;t abuse the platform, don&apos;t post
                  harmful content, and don&apos;t do anything illegal. We keep the game running; you keep it fun.
                </p>
              </div>
            </div>
            <p>
              These Terms were last updated on <strong>May 1, 2025</strong>. The most current version is
              always available at <a href="/terms">smartassfacts.com/terms</a>.
            </p>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="about-service">
            <h2>
              <span className="section-icon si-green">🎮</span>
              About the Service
            </h2>
            <p className="section-intro">What Smartass Facts is, what it offers, and how it works.</p>
            <p>
              Smartass Facts is a gamified knowledge and fact-guessing platform. The Service allows users to
              play trivia-style games, submit community facts, rate content, participate in leaderboards, and
              learn bite-sized information across a variety of categories.
            </p>
            <div className="info-cards">
              <div className="info-card card-amber">
                <span className="info-card-icon">🃏</span>
                <h4>Fake or Fact Game</h4>
                <p>Swipe through statements and guess whether they&apos;re real or made up. Instant feedback, real sources.</p>
              </div>
              <div className="info-card card-mint">
                <span className="info-card-icon">📂</span>
                <h4>Mood-Based Categories</h4>
                <p>Culture Shock Therapy, Nerds Gone Wild, Past Drama, Fit Happens — knowledge with personality.</p>
              </div>
              <div className="info-card card-sky">
                <span className="info-card-icon">🏆</span>
                <h4>Leaderboards</h4>
                <p>Compete with friends and the global community. Weekly resets keep it fresh and fair.</p>
              </div>
              <div className="info-card card-peach">
                <span className="info-card-icon">✍️</span>
                <h4>Community Facts</h4>
                <p>Submit your own facts for community rating. Accepted submissions appear in the game.</p>
              </div>
            </div>
            <p>
              We reserve the right to modify, suspend, or discontinue any feature of the Service at any time
              with reasonable notice where practicable.
            </p>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="eligibility">
            <h2>
              <span className="section-icon si-peach">🪪</span>
              Eligibility
            </h2>
            <p className="section-intro">Who can use Smartass Facts and under what conditions.</p>
            <p>To use the Service, you must:</p>
            <ul>
              <li>Be at least <strong>13 years old</strong> (or 16 in certain EU member states).</li>
              <li>Have the legal capacity to enter into a binding agreement.</li>
              <li>Not be prohibited from using the Service under applicable law.</li>
              <li>Not have had your account previously suspended or terminated by us for violation of these Terms.</li>
            </ul>
            <p>
              If you are between 13 and 18, you may only use the Service with the consent and supervision of a
              parent or legal guardian who agrees to be bound by these Terms on your behalf.
            </p>
            <div className="callout callout-yellow">
              <div className="callout-icon">🧒</div>
              <div className="callout-body">
                <strong>Users under 18</strong>
                <p>
                  We do not target our Service at users under 18. If you are a parent and believe your child
                  has registered without your consent, contact <a href="mailto:privacy@smartassfacts.com">privacy@smartassfacts.com</a> and we will delete the account promptly.
                </p>
              </div>
            </div>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="accounts">
            <h2>
              <span className="section-icon si-sky">👤</span>
              Accounts
            </h2>
            <p className="section-intro">Your responsibilities as an account holder.</p>
            <h3>4.1 Account creation</h3>
            <p>
              You must provide accurate, current, and complete information during registration and keep your
              account information updated. You may not create an account on behalf of someone else without
              their explicit permission.
            </p>
            <h3>4.2 Account security</h3>
            <p>You are responsible for maintaining the confidentiality of your credentials and all activity under your account. Notify us at <a href="mailto:support@smartassfacts.com">support@smartassfacts.com</a> of any unauthorised access.</p>
            <h3>4.3 One account per person</h3>
            <p>Each person may hold only one personal account. Creating multiple accounts to circumvent restrictions or manipulate leaderboards is prohibited and will result in permanent ban.</p>
            <h3>4.4 Username policy</h3>
            <p>Your username must not impersonate others, contain hate speech or slurs, be deceptively similar to our brand, or contain personally identifiable information.</p>
            <div className="callout callout-blue">
              <div className="callout-icon">🔑</div>
              <div className="callout-body">
                <strong>Lost access?</strong>
                <p>Use &quot;Forgot password&quot; on the login page, or contact <a href="mailto:support@smartassfacts.com">support@smartassfacts.com</a> with your registered email.</p>
              </div>
            </div>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="subscriptions">
            <h2>
              <span className="section-icon si-amber">💳</span>
              Subscriptions &amp; Billing
            </h2>
            <p className="section-intro">How our free and paid tiers work and your rights around billing.</p>
            <h3>5.1 Free tier</h3>
            <p>The core experience is free: unlimited Fake or Fact gameplay, leaderboards, fact submission (subject to moderation), and basic statistics.</p>
            <h3>5.2 Smartass Pro</h3>
            <p>Optional paid tier, billed monthly or annually. Pro includes exclusive categories, ad-free experience, unlimited fact submissions, detailed statistics, custom badge, early access to features, and priority support.</p>
            <div className="plan-table-wrap">
              <table className="plan-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Free</th>
                    <th className="featured">Pro ⭐</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>All base categories</td>
                    <td><span className="check">✓</span></td>
                    <td className="featured"><span className="check">✓</span></td>
                  </tr>
                  <tr>
                    <td>Exclusive Pro categories</td>
                    <td><span className="cross">✕</span></td>
                    <td className="featured"><span className="check">✓</span></td>
                  </tr>
                  <tr>
                    <td>Ad-free experience</td>
                    <td><span className="cross">✕</span></td>
                    <td className="featured"><span className="check">✓</span></td>
                  </tr>
                  <tr>
                    <td>Fact submissions/month</td>
                    <td>5</td>
                    <td className="featured">Unlimited</td>
                  </tr>
                  <tr>
                    <td>Detailed statistics</td>
                    <td><span className="cross">✕</span></td>
                    <td className="featured"><span className="check">✓</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h3>5.3 Billing &amp; auto-renewal</h3>
            <p>Subscriptions auto-renew unless cancelled. You authorise us (via Stripe) to charge your payment method on each renewal date.</p>
            <h3>5.4 Cancellation</h3>
            <p>Cancel anytime from account settings. Cancellation takes effect at the end of the current billing period; you retain Pro access until then.</p>
            <h3>5.5 Refunds</h3>
            <p>14-day cooling-off (EU/UK), billing errors, or service unavailability. Email <a href="mailto:billing@smartassfacts.com">billing@smartassfacts.com</a>.</p>
            <h3>5.6 Price changes</h3>
            <p>We may change prices with at least 30 days&apos; advance notice via email. Continued use after that date constitutes acceptance.</p>
            <div className="callout callout-green">
              <div className="callout-icon">🇪🇺</div>
              <div className="callout-body">
                <strong>EU &amp; UK consumer rights</strong>
                <p>You have statutory rights including the right to withdraw from a digital subscription within 14 days. These Terms do not affect your statutory rights.</p>
              </div>
            </div>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="user-content">
            <h2>
              <span className="section-icon si-mint">✍️</span>
              User Content
            </h2>
            <p className="section-intro">What&apos;s yours, what we can do with it, and your responsibilities.</p>
            <h3>6.1 Ownership</h3>
            <p>You retain ownership of content you submit. Submitting does not transfer ownership to us.</p>
            <h3>6.2 Licence</h3>
            <p>By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free, sublicensable licence to use, display, reproduce, adapt, and distribute your content for operating and promoting the Service.</p>
            <h3>6.3 Content standards</h3>
            <div className="do-dont">
              <div className="do-box">
                <span className="box-label">✓ Acceptable</span>
                <ul>
                  <li>Factual, verifiable statements from credible sources</li>
                  <li>Playful, witty, educational information</li>
                  <li>Original content you have the right to share</li>
                </ul>
              </div>
              <div className="dont-box">
                <span className="box-label">✕ Prohibited</span>
                <ul>
                  <li>Misinformation, fabricated facts, or falsehoods</li>
                  <li>Hate speech, slurs, or targeting protected characteristics</li>
                  <li>Sexually explicit, graphic violence, spam, or IP infringement</li>
                </ul>
              </div>
            </div>
            <h3>6.4 Moderation</h3>
            <p>We may reject, edit, remove, or re-categorise any User Content that violates these standards without prior notice.</p>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="acceptable-use">
            <h2>
              <span className="section-icon si-peach">🚦</span>
              Acceptable Use Policy
            </h2>
            <p className="section-intro">How to use Smartass Facts responsibly.</p>
            <p>You agree not to: gain unauthorised access; use bots or automated tools; scrape or data-mine; reverse-engineer; introduce malware; manipulate scores or use multiple accounts to exploit leaderboards; harass, bully, or impersonate; use the Service for commercial purposes without consent.</p>
            <div className="callout callout-red">
              <div className="callout-icon">⛔</div>
              <div className="callout-body">
                <strong>Zero tolerance</strong>
                <p>Violations involving child safety, doxxing, credible threats, or coordinated harassment result in immediate permanent termination and may be reported to law enforcement.</p>
              </div>
            </div>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="ip">
            <h2>
              <span className="section-icon si-purple">©️</span>
              Intellectual Property
            </h2>
            <p className="section-intro">What belongs to us, what belongs to you, and how to report infringement.</p>
            <p>The Service and its original content, features, design, code, and &quot;Smartass Facts&quot; marks are the property of Smartass Facts Ltd. You may not use our name or logo without prior written consent.</p>
            <h3>DMCA / Copyright</h3>
            <p>If you believe your copyrighted work has been reproduced without authorisation, send a notice with the required details to <a href="mailto:legal@smartassfacts.com">legal@smartassfacts.com</a> — Subject: &quot;Copyright Notice&quot;.</p>
            <p>Feedback you provide grants us a perpetual, royalty-free licence to use and incorporate it into the Service.</p>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="third-party">
            <h2>
              <span className="section-icon si-sky">🔗</span>
              Third-Party Services
            </h2>
            <p className="section-intro">External services we integrate with.</p>
            <p>The Service may contain links to or integrations with third-party websites and services we do not operate. We are not responsible for their content, privacy practices, or terms. App Store or Google Play downloads are also subject to those stores&apos; terms.</p>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Google / Apple Sign-In</strong></td>
                    <td>Social authentication</td>
                  </tr>
                  <tr>
                    <td><strong>Stripe</strong></td>
                    <td>Payment processing — subject to Stripe&apos;s Terms</td>
                  </tr>
                  <tr>
                    <td><strong>TikTok / Instagram / YouTube</strong></td>
                    <td>Social sharing &amp; follow links</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="disclaimers">
            <h2>
              <span className="section-icon si-amber">⚠️</span>
              Disclaimers
            </h2>
            <p className="section-intro">Honest statements about the nature of the Service.</p>
            <p>The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. We do not warrant that all content is complete, current, or error-free. We do not guarantee uninterrupted availability. We do not endorse or guarantee the accuracy of User Content.</p>
            <div className="callout callout-blue">
              <div className="callout-icon">ℹ️</div>
              <div className="callout-body">
                <strong>Consumer protection</strong>
                <p>Nothing here affects your statutory rights as a consumer where applicable.</p>
              </div>
            </div>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="liability">
            <h2>
              <span className="section-icon si-peach">🛡️</span>
              Limitation of Liability
            </h2>
            <p className="section-intro">The extent of our financial responsibility.</p>
            <p>To the maximum extent permitted by law, we are not liable for indirect, incidental, special, consequential, or punitive damages; loss of profits, data, or goodwill; or damages from your reliance on content or unauthorised access due to your failure to secure your account.</p>
            <p>Our total liability shall not exceed the greater of: the amount you paid us in the 12 months before the claim, or €50 if you have not made any payments.</p>
            <div className="callout callout-blue">
              <div className="callout-icon">🇪🇺</div>
                <div className="callout-body">
                  <strong>EU &amp; UK consumers</strong>
                  <p>We do not limit liability for death or personal injury, fraud, or any liability that cannot be excluded by law. You retain rights under consumer protection legislation.</p>
                </div>
            </div>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="indemnification">
            <h2>
              <span className="section-icon si-mint">🤝</span>
              Indemnification
            </h2>
            <p className="section-intro">Your agreement to protect us from costs arising from your misuse.</p>
            <p>You agree to defend, indemnify, and hold harmless Smartass Facts Ltd. and its officers, directors, employees, and agents from claims arising from: your violation of these Terms; your User Content; your use of the Service in an unauthorised manner; or your negligence or wilful misconduct. This does not apply to the extent a claim arises from our own negligence or wilful misconduct.</p>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="termination">
            <h2>
              <span className="section-icon si-peach">🚪</span>
              Termination
            </h2>
            <p className="section-intro">How and when accounts can be terminated.</p>
            <p>You may delete your account at any time. We may suspend or terminate your account for breach, fraud, abuse, risk to others, or if required by law. For serious violations we may act immediately; for minor ones we generally warn first. Appeals within 14 days to <a href="mailto:appeals@smartassfacts.com">appeals@smartassfacts.com</a>.</p>
            <div className="callout callout-amber">
              <div className="callout-icon">💾</div>
              <div className="callout-body">
                <strong>Export your data</strong>
                <p>Before deleting, request a full export from account settings or <a href="mailto:privacy@smartassfacts.com">privacy@smartassfacts.com</a>. We&apos;ll prepare it within 72 hours.</p>
              </div>
            </div>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="disputes">
            <h2>
              <span className="section-icon si-sky">⚖️</span>
              Disputes &amp; Governing Law
            </h2>
            <p className="section-intro">How we handle disagreements and which laws apply.</p>
            <p>These Terms are governed by the laws of <strong>Ukraine</strong>. Try to resolve disputes informally first by contacting <a href="mailto:legal@smartassfacts.com">legal@smartassfacts.com</a>; we will attempt resolution within 30 days. Legal proceedings may be brought in the courts of Kyiv, Ukraine. EU consumers may use the ODR platform: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="arrow-link">ec.europa.eu/consumers/odr ↗</a>. To the extent permitted by law, you waive class action rights (where enforceable).</p>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="changes">
            <h2>
              <span className="section-icon si-purple">📝</span>
              Changes to These Terms
            </h2>
            <p className="section-intro">How we update the Terms and how we&apos;ll notify you.</p>
            <p>We may modify these Terms at any time. Material changes (pricing, core rights, dispute resolution) get at least 30 days&apos; notice via email and in-app banner. Minor changes get an updated &quot;Last updated&quot; date and changelog note. Continued use after changes take effect constitutes acceptance.</p>
            <h3>Version history</h3>
            <div className="changelog">
              <div className="changelog-item latest">
                <div className="changelog-date">May 1, 2025 — v1.2 (Current)</div>
                <div className="changelog-desc">Added Smartass Pro details. Expanded Acceptable Use. Added EU ODR link. Clarified class action waiver for EU consumers.</div>
              </div>
              <div className="changelog-item">
                <div className="changelog-date">February 10, 2025 — v1.1</div>
                <div className="changelog-desc">Added DMCA procedure. Updated third-party table. Clarified termination appeals.</div>
              </div>
              <div className="changelog-item">
                <div className="changelog-date">November 3, 2024 — v1.0</div>
                <div className="changelog-desc">Initial Terms of Service published at launch.</div>
              </div>
            </div>
          </section>

          <hr className="policy-divider" />

          <section className="policy-section reveal" id="contact">
            <h2>
              <span className="section-icon si-green">📬</span>
              Contact Us
            </h2>
            <p className="section-intro">Get in touch with the right team.</p>
            <div className="info-cards-3" style={{ marginBottom: 28 }}>
              <div className="info-card card-amber">
                <span className="info-card-icon">⚖️</span>
                <h4>Legal &amp; Terms</h4>
                <p><a href="mailto:legal@smartassfacts.com">legal@smartassfacts.com</a></p>
                <p style={{ marginTop: 6 }}>DMCA, copyright, licensing.</p>
              </div>
              <div className="info-card card-sky">
                <span className="info-card-icon">💳</span>
                <h4>Billing &amp; Refunds</h4>
                <p><a href="mailto:billing@smartassfacts.com">billing@smartassfacts.com</a></p>
                <p style={{ marginTop: 6 }}>Subscriptions, refunds, payment errors.</p>
              </div>
              <div className="info-card card-mint">
                <span className="info-card-icon">🛟</span>
                <h4>General Support</h4>
                <p><a href="mailto:support@smartassfacts.com">support@smartassfacts.com</a></p>
                <p style={{ marginTop: 6 }}>Account access, bugs, appeals.</p>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-card-text">
                <h3>Need legal documentation? 📋</h3>
                <p>
                  For formal notices, subpoenas, DPA, or enterprise enquiries — our legal team responds
                  <br /> within 3 business days.
                </p>
              </div>
              <div className="contact-card-actions">
                <a href="mailto:legal@smartassfacts.com" className="btn-white">📩 legal@smartassfacts.com</a>
                <a href="/privacy" className="btn-ghost-white">Privacy Policy →</a>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  )
}
