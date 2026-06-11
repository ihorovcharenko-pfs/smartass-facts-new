'use client'

import { useState, useEffect } from 'react'
import { fetchFactById, type FactDetail, type RelatedFact } from '../services/clientService'
import { decryptAnswer } from '../utils/decryption'
import { useApp } from '../context/AppContext'
import { getDisplayName, buildRelatedSlug } from '../utils/categoryNames'
import '../styles/FactDetailPage.scss'

interface Props {
  categorySlug: string
  factSlug: string
  initialFact?: FactDetail | null
  initialRelated?: RelatedFact[]
  initialIsReal?: boolean | null
}

export default function FactDetailPage({
  categorySlug,
  factSlug,
  initialFact = null,
  initialRelated = [],
  initialIsReal = null,
}: Props) {
  const { navigate } = useApp()
  const [fact, setFact] = useState<FactDetail | null>(initialFact)
  const [related, setRelated] = useState<RelatedFact[]>(initialRelated)
  const [isReal, setIsReal] = useState<boolean | null>(initialIsReal)
  const [loading, setLoading] = useState(!initialFact)
  const [notFound, setNotFound] = useState(false)
  const [copied, setCopied] = useState(false)

  // Extract numeric ID from slug like "101-a-car-s-horn-was..."
  const factId = parseInt(factSlug.split('-')[0], 10)

  useEffect(() => {
    // Already server-rendered — nothing to fetch on the client.
    if (initialFact) return
    if (isNaN(factId)) { setNotFound(true); setLoading(false); return }

    fetchFactById(factId).then(async data => {
      if (!data) { setNotFound(true); setLoading(false); return }

      setFact(data.fact)
      setRelated(data.related)

      try {
        const answer = await decryptAnswer(data.fact.answer)
        setIsReal(answer)
      } catch {
        setIsReal(null)
      }

      setLoading(false)
    })
  }, [factId, initialFact])

  if (loading) return (
    <div className="fact-detail-loading">
      <div className="fact-detail-loading__spinner" />
    </div>
  )

  if (notFound || !fact) return (
    <div className="fact-detail-notfound">
      <p>Fact not found.</p>
      <a href="/facts/" className="fact-detail-notfound__link">Browse all facts →</a>
    </div>
  )

  const displayCategoryName = getDisplayName(categorySlug)
  const categoryUrl = `/facts/${categorySlug}`
  const isRealFact = isReal === true

  const handleShare = async () => {
    const url = `https://smartassfacts.com/facts/${categorySlug}/${factSlug}`
    const text = fact ? `${fact.saFact} — Fact or fake? Test your BS detector!` : 'Check this out on SmartAss Facts!'
    if (navigator.share) {
      try { await navigator.share({ title: 'SmartAss Facts', text, url }) } catch { /* dismissed */ }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch { /* ignore */ }
    }
  }

  return (
    <div className="fact-detail">
      {/* Breadcrumb */}
      <nav className="fact-detail__breadcrumb" aria-label="breadcrumb">
        <a href="/facts" onClick={e => { e.preventDefault(); navigate('/facts') }}>All Facts</a>
        <span className="fact-detail__breadcrumb-sep">›</span>
        <a href={categoryUrl} onClick={e => { e.preventDefault(); navigate(categoryUrl) }}>{displayCategoryName}</a>
        <span className="fact-detail__breadcrumb-sep">›</span>
        <span>{fact.saFact.slice(0, 60)}{fact.saFact.length > 60 ? '…' : ''}</span>
      </nav>

      {/* Category badge */}
      <span className="fact-detail__badge">{(fact.saCategory || displayCategoryName).toUpperCase()}</span>

      {/* Fact statement */}
      <h1 className="fact-detail__title">{fact.saFact}</h1>

      {/* Verdict */}
      {isReal !== null && (
        <div className={`fact-detail__verdict ${isRealFact ? 'fact-detail__verdict--true' : 'fact-detail__verdict--fake'}`}>
          {isRealFact ? '✓ TRUE FACT' : '✗ FAKE'}
        </div>
      )}

      {/* Share */}
      <div className="fact-detail__share">
        <button onClick={handleShare} className={copied ? 'copied' : ''} aria-label="Share this fact">
          {copied ? '✓ Link copied!' : '↗ Share this fact'}
        </button>
      </div>

      {/* Explanation */}
      {fact.explanation && (
        <div className="fact-detail__explanation">{fact.explanation}</div>
      )}

      {/* Play CTA */}
      <button className="fact-detail__cta" onClick={() => navigate('/')}>
        Play SmartAss Facts 🎯
      </button>

      {/* Related facts */}
      {related.length > 0 && (
        <section className="fact-detail__related">
          <h2>More {displayCategoryName} facts</h2>
          {related.map(r => {
            const slug = buildRelatedSlug(r.id, r.saFact, r.category)
            return (
              <a
                key={r.id}
                href={slug}
                className="fact-detail__related-link"
                onClick={e => { e.preventDefault(); navigate(slug) }}
              >
                {r.saFact}
              </a>
            )
          })}
          <a href={categoryUrl} className="fact-detail__see-all" onClick={e => { e.preventDefault(); navigate(categoryUrl) }}>
            See all {displayCategoryName} facts →
          </a>
        </section>
      )}

      {/* Explore pills */}
      <section className="fact-detail__explore" aria-label="Explore more">
        <h3>Explore more</h3>
        <div className="fact-detail__pills">
          <a href={categoryUrl} className="fact-detail__pill" onClick={e => { e.preventDefault(); navigate(categoryUrl) }}>
            📂 All {displayCategoryName} Facts
          </a>
          <a href="/facts" className="fact-detail__pill" onClick={e => { e.preventDefault(); navigate('/facts') }}>
            🔍 All Facts
          </a>
        </div>
      </section>
    </div>
  )
}
