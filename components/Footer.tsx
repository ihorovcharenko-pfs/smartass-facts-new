'use client'

import footerLogo from '../assets/smartass-logo.png'
import instagramIcon from '../assets/ig.svg'
import tiktokIcon from '../assets/tt.svg'
import youtubeIcon from '../assets/yt.svg'
import MailchimpForm from './MailchimpForm'
import { useApp } from '../context/AppContext'
import {
  PRIVACY_PATH, TERMS_PATH, COOKIE_PATH, ABOUT_PATH,
  HOW_PATH, RANDOM_PATH, FACTS_PATH, MYTHS_PATH, VS_PATH, EDUCATORS_PATH,
} from './paths'

import '../styles/Footer.scss'

function Footer() {
  const { navigate } = useApp()

  const navLink = (path: string, label: string) => (
    <a href={path} className="footer__link" onClick={e => { e.preventDefault(); navigate(path) }}>{label}</a>
  )

  return (
    <footer className="footer">
      <div className="footer__top">

        {/* ── Explore ──────────────────────────────────────────────── */}
        <div className="footer__col">
          <h4 className="footer__col-heading">Explore</h4>
          {navLink(FACTS_PATH, 'All Facts')}
          {navLink(MYTHS_PATH, 'Myths Debunked')}
          {navLink(VS_PATH, 'VS Comparisons')}
          {navLink(RANDOM_PATH, 'Random Facts')}
        </div>

        {/* ── Company ──────────────────────────────────────────────── */}
        <div className="footer__col">
          <h4 className="footer__col-heading">Company</h4>
          {navLink(ABOUT_PATH, 'About Us')}
          {navLink(HOW_PATH, 'How It Works')}
          {navLink(EDUCATORS_PATH, 'For Educators')}
        </div>

        {/* ── Newsletter ───────────────────────────────────────────── */}
        <div className="footer__col footer__col--newsletter">
          <h4 className="footer__col-heading">Stay in the Loop</h4>
          <MailchimpForm />
          <div className="footer__social">
            <a href="https://www.instagram.com/smartass.facts" className="footer__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <img src={instagramIcon.src} alt="Instagram" width={20} height={20} />
            </a>
            <a href="https://www.tiktok.com/@smartassfacts" className="footer__social-link" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
              <img src={tiktokIcon.src} alt="TikTok" width={20} height={20} />
            </a>
            <a href="https://www.youtube.com/@SmartAssFactsDaily" className="footer__social-link" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
              <img src={youtubeIcon.src} alt="YouTube" width={20} height={20} />
            </a>
          </div>
        </div>

      </div>

      {/* ── Bottom bar ───────────────────────────────────────────────── */}
      <div className="footer__bottom">
        <div className="footer__bottom-left">
          <div
            className="footer__logo-wrap"
            role="button"
            tabIndex={0}
            onClick={() => navigate('/')}
            onKeyDown={e => e.key === 'Enter' && navigate('/')}
          >
            <img src={footerLogo.src} alt="SmartAss Facts" className="footer__logo" width={28} height={28} />
          </div>

          <div className="footer__legal">
            <a href={COOKIE_PATH} className="footer__legal-link" onClick={e => { e.preventDefault(); navigate(COOKIE_PATH) }}>Cookie Policy</a>
            <span className="footer__legal-sep">·</span>
            <a href={TERMS_PATH} className="footer__legal-link" onClick={e => { e.preventDefault(); navigate(TERMS_PATH) }}>Terms of Service</a>
            <span className="footer__legal-sep">·</span>
            <a href={PRIVACY_PATH} className="footer__legal-link" onClick={e => { e.preventDefault(); navigate(PRIVACY_PATH) }}>Privacy Policy</a>
          </div>
        </div>

        <span className="footer__copy">© 2026 SmartAss Facts. All rights reserved.</span>
      </div>
    </footer>
  )
}

export default Footer
