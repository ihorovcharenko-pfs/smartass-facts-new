'use client'

import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { fetchFactsByCategory } from '../services/clientService'
import type { CategoryPageFact, CategoryPageResponse } from '../services/clientService'
import { getDisplayName, buildFactSlug } from '../utils/categoryNames'
import '../styles/CategoryPage.scss'

export default function CategoryPage({
  categorySlug,
  initialData = null,
}: {
  categorySlug: string
  initialData?: CategoryPageResponse | null
}) {
  const { navigate, onPlayClick } = useApp()
  const [facts, setFacts] = useState<CategoryPageFact[]>(initialData?.facts ?? [])
  const [total, setTotal] = useState(initialData?.total ?? 0)
  const [pages, setPages] = useState(initialData?.pages ?? 1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(!initialData)
  const [notFound, setNotFound] = useState(initialData ? initialData.total === 0 : false)

  const displayName = getDisplayName(categorySlug)

  useEffect(() => {
    // Page 1 is already server-rendered (initialData). Only fetch when the user
    // pages forward, or if we mounted without server data.
    if (page === 1 && initialData) return
    setLoading(true)
    setNotFound(false)
    fetchFactsByCategory(categorySlug, page).then(data => {
      if (!data || data.total === 0) { setNotFound(true); setLoading(false); return }
      setFacts(data.facts)
      setTotal(data.total)
      setPages(data.pages)
      setLoading(false)
    })
  }, [categorySlug, page, initialData])

  if (loading) {
    return (
      <div className="cat-page">
        <div className="cat-page__loading"><div className="cat-page__spinner" /></div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="cat-page">
        <div className="cat-page__empty">
          <p>No facts found for this category.</p>
          <a href="/facts" className="cat-page__back-link" onClick={e => { e.preventDefault(); navigate('/facts') }}>
            ← Browse all facts
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="cat-page">
      <nav className="cat-page__breadcrumb" aria-label="breadcrumb">
        <a href="/facts" onClick={e => { e.preventDefault(); navigate('/facts') }}>All Facts</a>
        <span className="cat-page__sep">›</span>
        <span>{displayName}</span>
      </nav>

      <div className="cat-page__header">
        <h1 className="cat-page__h1">{displayName}</h1>
        <span className="cat-page__count">{total} facts</span>
      </div>

      <div className="cat-page__list">
        {facts.map(fact => {
          const factSlug = buildFactSlug(fact.id, fact.saFact)
          const factPath = `/facts/${categorySlug}/${factSlug}`
          return (
            <a
              key={fact.id}
              href={factPath}
              className="cat-page__fact"
              onClick={e => { e.preventDefault(); navigate(factPath) }}
            >
              <span className="cat-page__fact-text">{fact.saFact}</span>
              <span className={`cat-page__verdict ${fact.answer ? 'cat-page__verdict--true' : 'cat-page__verdict--false'}`}>
                {fact.answer ? '✓ FACT' : '✗ FAKE'}
              </span>
            </a>
          )
        })}
      </div>

      {pages > 1 && (
        <div className="cat-page__pagination">
          <button
            className="cat-page__page-btn"
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            ← Prev
          </button>
          <span className="cat-page__page-info">Page {page} of {pages}</span>
          <button
            className="cat-page__page-btn"
            disabled={page >= pages}
            onClick={() => setPage(p => Math.min(pages, p + 1))}
          >
            Next →
          </button>
        </div>
      )}

      <div className="cat-page__cta">
        <button className="cat-page__play-btn" onClick={() => onPlayClick(displayName)}>
          🎮 Play SmartAss Facts
        </button>
        <a href="/facts" className="cat-page__all-link" onClick={e => { e.preventDefault(); navigate('/facts') }}>
          Browse all categories →
        </a>
      </div>
    </div>
  )
}
