'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import GamePage from './GamePage'
import GamePageSkeleton from './GamePageSkeleton'
import { fetchFactsForClient, fetchPersonalizedFacts, type Fact } from '../services/clientService'
import { getSkipIds, getPoolId, getSessionToken } from '../utils/localStorage'

const GAME_PATH = '/game'
const CAT_PARAM = 'cat'

function getCategoryFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search)
  return params.get(CAT_PARAM)
}

function buildGameSearch(category: string, source?: string): string {
  return `${CAT_PARAM}=${encodeURIComponent(category)}${source ? `&src=${encodeURIComponent(source)}` : ''}`
}

interface GameRouteProps {
  navigate: (pathname: string, search?: string, replace?: boolean) => void
}

function GameRoute({ navigate }: GameRouteProps) {
  const [gameFacts, setGameFacts] = useState<Fact[]>([])
  const [isLoadingFacts, setIsLoadingFacts] = useState(false)

  // Read the category from Next's router state, NOT window.location. On a
  // client-side push the component can render before the browser URL has
  // updated (always, once the chunk is cached), which made `category` null and
  // bounced every game launch back to the home page.
  const searchParams = useSearchParams()
  const category = searchParams.get(CAT_PARAM)
  const source = searchParams.get('src') ?? 'direct'
  const [loadError, setLoadError] = useState(false)
  const requestRef = useRef(0)

  const FOR_YOU_CATEGORY = 'For You'

  const loadFacts = useCallback(async (cat: string) => {
    const requestId = ++requestRef.current
    try {
      setLoadError(false)
      setIsLoadingFacts(true)
      window.scrollTo(0, 0)

      let facts: Fact[]

      if (cat === FOR_YOU_CATEGORY) {
        // Personalised feed: server scores facts using play-history signals.
        // Onboarding category IDs aren't sent here because the server derives
        // category preferences directly from interaction history (more accurate).
        const sessionToken = getSessionToken()
        facts = await fetchPersonalizedFacts(sessionToken)
      } else {
        const skipIds = getSkipIds(cat)
        let poolId: number | undefined
        if (cat === 'Game of the day') {
          poolId = getPoolId()
        }
        facts = await fetchFactsForClient(
          cat,
          skipIds.length > 0 ? skipIds : undefined,
          poolId
        )
      }

      if (requestId !== requestRef.current) return // a newer load superseded this one
      if (!facts || facts.length === 0) throw new Error('No facts returned')
      setGameFacts(facts)
    } catch (error) {
      console.error('Failed to fetch facts:', error)
      // Don't leave the skeleton spinning forever (e.g. after a refresh on a flaky network)
      if (requestId === requestRef.current) setLoadError(true)
    } finally {
      if (requestId === requestRef.current) setIsLoadingFacts(false)
    }
  }, [])

  useEffect(() => {
    if (!category) {
      navigate('/', undefined, true)
      return
    }
    setGameFacts([])
    loadFacts(category)
  }, [category, navigate, loadFacts])

  const goHome = useCallback(() => {
    navigate('/')
  }, [navigate])

  const handleBack = useCallback(() => {
    setTimeout(() => goHome(), 300)
  }, [goHome])

  const handleContinue = useCallback(() => {
    goHome()
  }, [goHome])

  const handlePlayAgain = useCallback(
    (cat: string) => {
      navigate(GAME_PATH, buildGameSearch(cat, 'replay'))
    },
    [navigate]
  )

  if (!category) {
    return null
  }

  if (loadError) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', color: 'var(--color-text)' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Couldn&apos;t load this game</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Check your connection and try again.</p>
        <button className="results-screen__button results-screen__button--primary" style={{ marginRight: '0.5rem' }} onClick={() => loadFacts(category)}>Try again</button>
        <button className="results-screen__button results-screen__button--secondary" onClick={goHome}>Back to home</button>
      </div>
    )
  }

  if (isLoadingFacts || gameFacts.length === 0) {
    return <GamePageSkeleton />
  }

  return (
    <GamePage
      facts={gameFacts}
      category={category}
      source={source}
      onBack={handleBack}
      onContinue={handleContinue}
      onPlayAgain={handlePlayAgain}
    />
  )
}

export default GameRoute
export { GAME_PATH, CAT_PARAM, getCategoryFromUrl, buildGameSearch }
