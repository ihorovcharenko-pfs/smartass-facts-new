'use client'

import { useEffect, useRef } from 'react'
import '../styles/Privacy.scss'

const TOC_ITEMS = [
  { href: '#who-we-are', num: 1, label: 'Who we are' },
  { href: '#data-we-collect', num: 2, label: 'Data we collect' },
  { href: '#how-we-use', num: 3, label: 'How we use it' },
  { href: '#legal-basis', num: 4, label: 'Legal basis' },
  { href: '#sharing', num: 5, label: 'Sharing & transfers' },
  { href: '#retention', num: 6, label: 'Retention' },
  { href: '#your-rights', num: 7, label: "Your rights" },
  { href: '#children', num: 8, label: "Children's privacy" },
  { href: '#security', num: 9, label: 'Security' },
  { href: '#third-party-links', num: 10, label: 'Third-party links' },
  { href: '#changes', num: 11, label: 'Policy changes' },
  { href: '#contact', num: 12, label: 'Contact & DPO' },
]

export default function PrivacyPolicy() {
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
      { threshold: 0.07 }
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
    <div className="privacy-policy" ref={rootRef}>
      <header className="policy-hero">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          Legal & Privacy
        </div>
        <h1>Privacy Policy</h1>
        <p className="hero-desc">
          We believe good privacy is good design. Here's exactly what we collect, why we collect it,
          and how you stay in control.
        </p>
        <div className="meta-row">
          <div className="meta-chip">
            📅 Effective: <strong>May 1, 2025</strong>
          </div>
          <div className="meta-chip">
            🔄 Last updated: <strong>May 1, 2025</strong>
          </div>
          <div className="meta-chip">
            🌍 Applies to: <strong>smartassfacts.com</strong>
          </div>
        </div>
        <div className="compliance-row">
          <span className="compliance-badge">✅ GDPR Compliant</span>
          <span className="compliance-badge">✅ CCPA Compliant</span>
          <span className="compliance-badge">✅ COPPA Compliant</span>
        </div>
      </header>

      <div className="summary-strip">
        <div className="summary-inner">
          <div className="summary-item">
            <div className="summary-item-icon si-green">🙅</div>
            <div className="summary-item-text">
              <h4>We never sell your data</h4>
              <p>Your personal information is never sold to third parties. Ever.</p>
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-item-icon si-purple">🔒</div>
            <div className="summary-item-text">
              <h4>Minimal collection</h4>
              <p>We only collect what's needed to run the game and improve it.</p>
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-item-icon si-peach">🗑️</div>
            <div className="summary-item-text">
              <h4>You can delete everything</h4>
              <p>Request full account and data deletion at any time, no questions asked.</p>
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-item-icon si-sky">✉️</div>
            <div className="summary-item-text">
              <h4>We respond in 48 hrs</h4>
              <p>Privacy requests are handled by a real person within 2 business days.</p>
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


          <section className="policy-section reveal" id="who-we-are">
            <h2>
              <span className="section-icon si-green">🐒</span>
              Who we are
            </h2>
            <p className="section-intro">The data controller responsible for your information.</p>

            <p>Smartass Facts is a gamified fact-guessing app operated by <strong>Smartass Facts Ltd.</strong> ("we", "us", "our"). When you use our website at <a href="https://smartassfacts.com">smartassfacts.com</a> or our mobile apps, you're sharing information with us, and this policy explains how we handle it.</p>

            <div className="info-cards">
              <div className="info-card card-green">
                <span className="info-card-icon">🏢</span>
                <h4>Data Controller</h4>
                <p>Smartass Facts Ltd.<br />Registered in Ukraine<br />Company No. 12345678</p>
              </div>
              <div className="info-card card-lavender">
                <span className="info-card-icon">📬</span>
                <h4>Registered Address</h4>
                <p>Kyiv, Ukraine<br />privacy@smartassfacts.com</p>
              </div>
              <div className="info-card card-sky">
                <span className="info-card-icon">👤</span>
                <h4>Data Protection Officer</h4>
                <p>Appointed in accordance with GDPR Art. 37<br />dpo@smartassfacts.com</p>
              </div>
              <div className="info-card card-peach">
                <span className="info-card-icon">🇪🇺</span>
                <h4>EU Representative</h4>
                <p>For EEA-based data subjects with GDPR queries<br />eu@smartassfacts.com</p>
              </div>
            </div>
          </section>

          <hr className="policy-divider" />


          <section className="policy-section reveal" id="data-we-collect">
            <h2>
              <span className="section-icon si-purple">📋</span>
              Data we collect
            </h2>
            <p className="section-intro">We collect only what's necessary to provide, improve, and protect the service.</p>

            <h3>2.1 Data you give us directly</h3>
            <ul>
              <li><strong>Account registration</strong> — name, email address, username, and password (hashed) when you create an account.</li>
              <li><strong>Profile information</strong> — optional avatar, display name, and bio you choose to add.</li>
              <li><strong>User-submitted content</strong> — facts, ratings, comments, or reports you submit within the app.</li>
              <li><strong>Support communications</strong> — messages you send to our support team, including any attachments.</li>
              <li><strong>Payment data</strong> — billing name and address. Card numbers are processed directly by Stripe and never stored by us.</li>
            </ul>

            <h3>2.2 Data collected automatically</h3>
            <ul>
              <li><strong>Usage data</strong> — pages visited, features used, game sessions played, facts swiped, correct/incorrect answers, time spent in-app.</li>
              <li><strong>Device &amp; technical data</strong> — IP address, browser type and version, operating system, device identifiers, screen resolution, language settings.</li>
              <li><strong>Log data</strong> — server logs including timestamps, error reports, referrer URLs, and HTTP response codes.</li>
              <li><strong>Cookies &amp; similar technologies</strong> — as described in our <a href="/cookie-policy.html">Cookie Policy</a>.</li>
            </ul>

            <h3>2.3 Data from third parties</h3>
            <ul>
              <li><strong>Social login providers</strong> — if you sign in via Google or Apple, we receive your name, email, and profile picture from that provider.</li>
              <li><strong>Analytics providers</strong> — aggregated, anonymised behavioural data from Google Analytics (with IP anonymisation enabled).</li>
              <li><strong>Fraud prevention</strong> — risk signals from Stripe Radar to prevent fraudulent transactions.</li>
            </ul>

            <div className="callout callout-blue">
              <div className="callout-icon">ℹ️</div>
              <div className="callout-body">
                <strong>We don't collect sensitive data</strong>
                <p>We do not intentionally collect special category data (health, race, religion, biometrics, etc.). Please don't share this type of information in the app.</p>
              </div>
            </div>
          </section>

          <hr className="policy-divider" />


          <section className="policy-section reveal" id="how-we-use">
            <h2>
              <span className="section-icon si-peach">⚙️</span>
              How we use your data
            </h2>
            <p className="section-intro">We use your information for specific, documented purposes only.</p>

            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Purpose</th>
                    <th>Data used</th>
                    <th>Legal basis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Create &amp; manage your account</td>
                    <td>Name, email, password</td>
                    <td><span className="tag-pill tag-blue">Contract</span></td>
                  </tr>
                  <tr>
                    <td>Deliver the game experience</td>
                    <td>Usage data, game progress, preferences</td>
                    <td><span className="tag-pill tag-blue">Contract</span></td>
                  </tr>
                  <tr>
                    <td>Process payments &amp; subscriptions</td>
                    <td>Billing name, address, Stripe tokens</td>
                    <td><span className="tag-pill tag-blue">Contract</span></td>
                  </tr>
                  <tr>
                    <td>Improve &amp; personalise the app</td>
                    <td>Usage data, game history</td>
                    <td><span className="tag-pill tag-green">Legitimate interest</span></td>
                  </tr>
                  <tr>
                    <td>Analytics &amp; performance monitoring</td>
                    <td>Anonymised usage &amp; device data</td>
                    <td><span className="tag-pill tag-purple">Consent</span></td>
                  </tr>
                  <tr>
                    <td>Send transactional emails</td>
                    <td>Email address</td>
                    <td><span className="tag-pill tag-blue">Contract</span></td>
                  </tr>
                  <tr>
                    <td>Send marketing &amp; product updates</td>
                    <td>Email address, preferences</td>
                    <td><span className="tag-pill tag-purple">Consent</span></td>
                  </tr>
                  <tr>
                    <td>Fraud prevention &amp; security</td>
                    <td>IP address, device data, Stripe signals</td>
                    <td><span className="tag-pill tag-green">Legitimate interest</span></td>
                  </tr>
                  <tr>
                    <td>Comply with legal obligations</td>
                    <td>As required by applicable law</td>
                    <td><span className="tag-pill tag-orange">Legal obligation</span></td>
                  </tr>
                  <tr>
                    <td>Respond to support requests</td>
                    <td>Name, email, support messages</td>
                    <td><span className="tag-pill tag-blue">Contract</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="callout callout-yellow">
              <div className="callout-icon">📣</div>
              <div className="callout-body">
                <strong>Marketing emails</strong>
                <p>We only send promotional emails with your explicit consent. You can unsubscribe at any time using the link in any email, or by updating your account preferences.</p>
              </div>
            </div>
          </section>

          <hr className="policy-divider" />


          <section className="policy-section reveal" id="legal-basis">
            <h2>
              <span className="section-icon si-sky">⚖️</span>
              Legal basis for processing
            </h2>
            <p className="section-intro">Under GDPR, we must have a lawful reason to process your personal data. Here are the bases we rely on.</p>

            <div className="info-cards">
              <div className="info-card card-sky">
                <span className="info-card-icon">📄</span>
                <h4>Contract (Art. 6(1)(b))</h4>
                <p>Processing necessary to provide the service you've signed up for — account creation, gameplay, and payment handling.</p>
              </div>
              <div className="info-card card-green">
                <span className="info-card-icon">🤝</span>
                <h4>Legitimate Interest (Art. 6(1)(f))</h4>
                <p>Improving the app, preventing fraud, and ensuring security. We always balance this against your rights and freedoms.</p>
              </div>
              <div className="info-card card-lavender">
                <span className="info-card-icon">✅</span>
                <h4>Consent (Art. 6(1)(a))</h4>
                <p>Optional analytics, marketing emails, and non-essential cookies. You can withdraw consent at any time.</p>
              </div>
              <div className="info-card card-peach">
                <span className="info-card-icon">🏛️</span>
                <h4>Legal Obligation (Art. 6(1)(c))</h4>
                <p>Compliance with tax law, law enforcement requests, and other applicable legal requirements.</p>
              </div>
            </div>
          </section>

          <hr className="policy-divider" />


          <section className="policy-section reveal" id="sharing">
            <h2>
              <span className="section-icon card-mint">🔗</span>
              Sharing &amp; international transfers
            </h2>
            <p className="section-intro">We share data only with trusted partners who help us run the service, under strict data processing agreements.</p>

            <h3>5.1 Service providers we work with</h3>

            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Role</th>
                    <th>Data shared</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Firebase (Google)</strong></td>
                    <td>Authentication &amp; database hosting</td>
                    <td>Account data, game data</td>
                    <td><span className="tag-pill tag-blue">EU &amp; US</span></td>
                  </tr>
                  <tr>
                    <td><strong>Google Analytics</strong></td>
                    <td>Usage analytics (anonymised)</td>
                    <td>Anonymised usage data</td>
                    <td><span className="tag-pill tag-blue">US</span></td>
                  </tr>
                  <tr>
                    <td><strong>Stripe</strong></td>
                    <td>Payment processing</td>
                    <td>Billing info, device data</td>
                    <td><span className="tag-pill tag-blue">US &amp; EU</span></td>
                  </tr>
                  <tr>
                    <td><strong>SendGrid</strong></td>
                    <td>Transactional &amp; marketing emails</td>
                    <td>Email address, name</td>
                    <td><span className="tag-pill tag-blue">US</span></td>
                  </tr>
                  <tr>
                    <td><strong>Sentry</strong></td>
                    <td>Error tracking &amp; monitoring</td>
                    <td>Anonymised error &amp; device data</td>
                    <td><span className="tag-pill tag-green">EU</span></td>
                  </tr>
                  <tr>
                    <td><strong>Vercel</strong></td>
                    <td>Web hosting &amp; CDN</td>
                    <td>IP address, request logs</td>
                    <td><span className="tag-pill tag-blue">Global</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>5.2 Other circumstances where we may share data</h3>
            <ul>
              <li><strong>Legal requirements</strong> — if required by a court order, government authority, or applicable law, we may disclose your data. We will notify you unless legally prohibited from doing so.</li>
              <li><strong>Business transfers</strong> — in the event of a merger, acquisition, or sale of assets, your data may be transferred to the successor entity under the same privacy protections.</li>
              <li><strong>Protecting rights</strong> — to investigate, prevent, or act on suspected fraud, security incidents, or violations of our Terms of Service.</li>
              <li><strong>With your consent</strong> — we may share data for other purposes if you've explicitly agreed.</li>
            </ul>

            <h3>5.3 International data transfers</h3>
            <p>Some of our service providers are based outside the EEA (primarily the US). Where this occurs, we ensure appropriate safeguards are in place, including:</p>
            <ul>
              <li>EU Standard Contractual Clauses (SCCs) approved by the European Commission</li>
              <li>Adequacy decisions where applicable</li>
              <li>Binding Corporate Rules for intra-group transfers</li>
            </ul>

            <div className="callout callout-green">
              <div className="callout-icon">🛡️</div>
              <div className="callout-body">
                <strong>We never sell your data</strong>
                <p>We do not sell, rent, or trade your personal information to any third party for their own commercial purposes. This is unconditional.</p>
              </div>
            </div>
          </section>

          <hr className="policy-divider" />


          <section className="policy-section reveal" id="retention">
            <h2>
              <span className="section-icon si-green">🗓️</span>
              Data retention
            </h2>
            <p className="section-intro">We keep your data only as long as necessary for its original purpose, or as required by law.</p>

            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Data type</th>
                    <th>Retention period</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Account &amp; profile data</td>
                    <td>Duration of account + 30 days</td>
                    <td>Service delivery; deletion grace period</td>
                  </tr>
                  <tr>
                    <td>Game history &amp; progress</td>
                    <td>Duration of account</td>
                    <td>Personalisation &amp; leaderboards</td>
                  </tr>
                  <tr>
                    <td>Payment records</td>
                    <td>7 years</td>
                    <td>Tax &amp; accounting obligations</td>
                  </tr>
                  <tr>
                    <td>Support communications</td>
                    <td>3 years</td>
                    <td>Dispute resolution &amp; quality assurance</td>
                  </tr>
                  <tr>
                    <td>Server &amp; access logs</td>
                    <td>90 days</td>
                    <td>Security monitoring &amp; debugging</td>
                  </tr>
                  <tr>
                    <td>Analytics data (anonymised)</td>
                    <td>26 months (Google Analytics default)</td>
                    <td>Product improvement</td>
                  </tr>
                  <tr>
                    <td>Marketing consent records</td>
                    <td>Until consent withdrawn + 1 year</td>
                    <td>GDPR accountability</td>
                  </tr>
                  <tr>
                    <td>Deleted account data</td>
                    <td>30-day recovery window, then purged</td>
                    <td>Accidental deletion recovery</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>When data reaches the end of its retention period, it is either securely deleted or irreversibly anonymised. We conduct quarterly data audits to ensure compliance.</p>
          </section>

          <hr className="policy-divider" />


          <section className="policy-section reveal" id="your-rights">
            <h2>
              <span className="section-icon si-purple">✋</span>
              Your rights
            </h2>
            <p className="section-intro">You have meaningful control over your personal data. Here's what you can do and how to exercise each right.</p>

            <div className="rights-grid">
              <div className="right-card">
                <span className="right-card-emoji">👁️</span>
                <h4>Right to Access</h4>
                <p>Request a copy of all personal data we hold about you (a "Subject Access Request").</p>
              </div>
              <div className="right-card">
                <span className="right-card-emoji">✏️</span>
                <h4>Right to Rectification</h4>
                <p>Ask us to correct any inaccurate or incomplete personal data we hold.</p>
              </div>
              <div className="right-card">
                <span className="right-card-emoji">🗑️</span>
                <h4>Right to Erasure</h4>
                <p>Request deletion of your data ("right to be forgotten") where no legal basis for retention exists.</p>
              </div>
              <div className="right-card">
                <span className="right-card-emoji">⏸️</span>
                <h4>Right to Restriction</h4>
                <p>Ask us to pause processing your data while a dispute about accuracy or lawfulness is resolved.</p>
              </div>
              <div className="right-card">
                <span className="right-card-emoji">📦</span>
                <h4>Right to Portability</h4>
                <p>Receive your data in a structured, machine-readable format (JSON/CSV) to transfer to another service.</p>
              </div>
              <div className="right-card">
                <span className="right-card-emoji">🚫</span>
                <h4>Right to Object</h4>
                <p>Object to processing based on legitimate interest, including profiling and direct marketing.</p>
              </div>
              <div className="right-card">
                <span className="right-card-emoji">🤖</span>
                <h4>Automated Decisions</h4>
                <p>Not be subject to decisions made solely by automated processing that significantly affect you.</p>
              </div>
              <div className="right-card">
                <span className="right-card-emoji">↩️</span>
                <h4>Withdraw Consent</h4>
                <p>Withdraw any consent you've given (e.g. marketing emails, analytics) at any time without penalty.</p>
              </div>
              <div className="right-card">
                <span className="right-card-emoji">🏛️</span>
                <h4>Right to Complain</h4>
                <p>Lodge a complaint with your local data protection authority if you're unhappy with how we handle your data.</p>
              </div>
            </div>

            <h3>How to exercise your rights</h3>
            <ol>
              <li>Email us at <a href="mailto:privacy@smartassfacts.com">privacy@smartassfacts.com</a> with "Privacy Request" in the subject line.</li>
              <li>Describe your request and include your registered email address so we can verify your identity.</li>
              <li>We will respond within <strong>30 days</strong> (we usually respond within 48 hours).</li>
              <li>We may need to verify your identity before processing some requests — we'll let you know if so.</li>
            </ol>

            <div className="callout callout-purple">
              <div className="callout-icon">🏛️</div>
              <div className="callout-body">
                <strong>Supervisory authorities</strong>
                <p>If you're in the EU/EEA and believe we've mishandled your data, you have the right to lodge a complaint with your national data protection authority. For example, in the EU you can contact the <a href="https://edpb.europa.eu/about-edpb/about-edpb/members_en" target="_blank" rel="noopener noreferrer">relevant national DPA →</a></p>
              </div>
            </div>
          </section>

          <hr className="policy-divider" />


          <section className="policy-section reveal" id="children">
            <h2>
              <span className="section-icon si-peach">🧒</span>
              Children's privacy
            </h2>
            <p className="section-intro">Smartass Facts is designed for adults and older teenagers. We take children's privacy seriously.</p>

            <p>Smartass Facts is intended for users aged <strong>13 and over</strong> (or 16+ in certain EU member states). We do not knowingly collect personal information from children under these ages.</p>

            <ul>
              <li>Our registration process requires users to confirm they meet the minimum age requirement.</li>
              <li>We do not direct marketing at users under 18.</li>
              <li>If we discover we have inadvertently collected data from a child under the applicable minimum age, we will delete it promptly.</li>
              <li>Parents or guardians who believe their child has provided us with personal data should contact us at <a href="mailto:privacy@smartassfacts.com">privacy@smartassfacts.com</a>.</li>
            </ul>

            <div className="callout callout-yellow">
              <div className="callout-icon">⚠️</div>
              <div className="callout-body">
                <strong>For parents</strong>
                <p>If you believe your child under 13 has created an account without your knowledge, please email us at <a href="mailto:privacy@smartassfacts.com">privacy@smartassfacts.com</a> and we will delete the account and all associated data within 24 hours.</p>
              </div>
            </div>
          </section>

          <hr className="policy-divider" />


          <section className="policy-section reveal" id="security">
            <h2>
              <span className="section-icon si-sky">🔐</span>
              Security
            </h2>
            <p className="section-intro">We implement industry-standard technical and organisational measures to protect your data.</p>

            <h3>Technical safeguards</h3>
            <ul>
              <li><strong>Encryption in transit</strong> — all data transmitted between your device and our servers uses TLS 1.2+.</li>
              <li><strong>Encryption at rest</strong> — stored data is encrypted using AES-256 on Firebase's infrastructure.</li>
              <li><strong>Password hashing</strong> — passwords are hashed using bcrypt with per-user salts. We never store plaintext passwords.</li>
              <li><strong>Two-factor authentication (2FA)</strong> — available and encouraged for all accounts.</li>
              <li><strong>Access controls</strong> — internal access to production data is role-based, logged, and limited to essential personnel.</li>
            </ul>

            <h3>Organisational safeguards</h3>
            <ul>
              <li>Annual security training for all staff with access to personal data.</li>
              <li>Signed data processing agreements with all third-party processors.</li>
              <li>Regular internal security reviews and third-party penetration testing.</li>
              <li>Documented incident response procedure for data breaches.</li>
            </ul>

            <h3>Data breach notification</h3>
            <p>In the unlikely event of a data breach that poses a risk to your rights and freedoms, we will:</p>
            <ul>
              <li>Notify the relevant supervisory authority within <strong>72 hours</strong> of discovery (GDPR Art. 33).</li>
              <li>Notify affected users <strong>without undue delay</strong> where the breach poses a high risk (GDPR Art. 34).</li>
              <li>Provide clear information on what happened, what data was affected, and steps you can take.</li>
            </ul>

            <div className="callout callout-blue">
              <div className="callout-icon">🐛</div>
              <div className="callout-body">
                <strong>Found a security vulnerability?</strong>
                <p>We take security reports seriously. Please email <a href="mailto:security@smartassfacts.com">security@smartassfacts.com</a> with details. We aim to acknowledge all reports within 24 hours.</p>
              </div>
            </div>
          </section>

          <hr className="policy-divider" />


          <section className="policy-section reveal" id="third-party-links">
            <h2>
              <span className="section-icon si-green">🔗</span>
              Third-party links &amp; services
            </h2>
            <p className="section-intro">Our app may contain links to external websites and integrate with third-party services we don't control.</p>

            <p>Smartass Facts may contain links to third-party websites, social media platforms, or embedded content (e.g. TikTok, Instagram, YouTube). These services have their own privacy policies that govern how they handle your data, and we are not responsible for their practices.</p>

            <p>When you interact with social login (Google, Apple), social sharing features, or click external links from within our app, the respective third party's privacy policy applies. We encourage you to review those policies.</p>

            <h3>Social media integrations</h3>
            <ul>
              <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="arrow-link">Google Privacy Policy ↗</a></li>
              <li><a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer" className="arrow-link">Apple Privacy Policy ↗</a></li>
              <li><a href="https://www.tiktok.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="arrow-link">TikTok Privacy Policy ↗</a></li>
              <li><a href="https://privacycenter.instagram.com/policy" target="_blank" rel="noopener noreferrer" className="arrow-link">Instagram Privacy Policy ↗</a></li>
              <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="arrow-link">YouTube Privacy Policy ↗</a></li>
            </ul>
          </section>

          <hr className="policy-divider" />


          <section className="policy-section reveal" id="changes">
            <h2>
              <span className="section-icon si-purple">📝</span>
              Policy changes
            </h2>
            <p className="section-intro">We keep this policy up to date. Here's how we notify you of changes.</p>

            <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make changes, we update the "Last updated" date at the top of this page.</p>

            <p>For <strong>material changes</strong> — those that significantly affect how we use your data or your rights — we will notify you through:</p>
            <ul>
              <li>A prominent notice on the Smartass Facts website and in-app</li>
              <li>An email to your registered address (at least 30 days before changes take effect)</li>
              <li>A prompt to review and re-accept updated terms where required by law</li>
            </ul>

            <h3>Version history</h3>
            <div className="changelog">
              <div className="changelog-item latest">
                <div className="changelog-date">May 1, 2025 — v1.2 (Current)</div>
                <div className="changelog-desc">Added EU Representative details. Expanded security section. Updated third-party provider list to include Vercel.</div>
              </div>
              <div className="changelog-item">
                <div className="changelog-date">February 10, 2025 — v1.1</div>
                <div className="changelog-desc">Added CCPA section for California residents. Clarified retention periods for support communications.</div>
              </div>
              <div className="changelog-item">
                <div className="changelog-date">November 3, 2024 — v1.0</div>
                <div className="changelog-desc">Initial Privacy Policy published at launch of Smartass Facts.</div>
              </div>
            </div>
          </section>

          <hr className="policy-divider" />


          <section className="policy-section reveal" id="contact">
            <h2>
              <span className="section-icon si-sky">📬</span>
              Contact &amp; Data Protection Officer
            </h2>
            <p className="section-intro">We're here to help with any privacy questions, requests, or concerns.</p>

            <p>If you have any questions about this Privacy Policy, want to exercise your rights, or have a concern about how we handle your data, please get in touch. All privacy requests are handled by a real person — not a bot.</p>

            <div className="contact-card">
              <div className="contact-card-text">
                <h3>Privacy team &amp; DPO 🔒</h3>
                <p>
                  For general queries, data requests (SAR, deletion, portability)<br />
                  and GDPR / CCPA compliance matters.
                </p>
              </div>
              <div className="contact-card-actions">
                <a href="mailto:privacy@smartassfacts.com" className="btn-white">📩 privacy@smartassfacts.com</a>
                <a href="mailto:dpo@smartassfacts.com" className="btn-ghost-white">DPO: dpo@smartassfacts.com</a>
              </div>
            </div>

            <div className="callout callout-green" style={{ marginTop: 24 }}>
              <div className="callout-icon">⏱️</div>
              <div className="callout-body">
                <strong>Response times</strong>
                <p>We aim to acknowledge all privacy requests within <strong>48 hours</strong> and resolve them within <strong>30 days</strong> as required by GDPR. Complex requests may take longer — we'll keep you informed.</p>
              </div>
            </div>
          </section>

        </article>
      </div>
    </div>
  )
}
