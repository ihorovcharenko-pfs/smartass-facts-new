'use client'

import { useState, useEffect, useCallback } from 'react'
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

function buildGameSearch(category: string): string {
  return `${CAT_PARAM}=${encodeURIComponent(category)}`
}

interface GameRouteProps {
  navigate: (pathname: string, search?: string, replace?: boolean) => void
}

function GameRoute({ navigate }: GameRouteProps) {
  const [gameFacts, setGameFacts] = useState<Fact[]>([])
  const [isLoadingFacts, setIsLoadingFacts] = useState(false)

  const category = getCategoryFromUrl()

  const FOR_YOU_CATEGORY = 'For You'

  const loadFacts = useCallback(async (cat: string) => {
    try {
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

      setGameFacts(facts)
    } catch (error) {
      console.error('Failed to fetch facts:', error)
    } finally {
      setIsLoadingFacts(false)
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
      navigate(GAME_PATH, buildGameSearch(cat))
    },
    [navigate]
  )

  if (!category) {
    return null
  }

  if (isLoadingFacts || gameFacts.length === 0) {
    return <GamePageSkeleton />
  }

  return (
    <GamePage
      facts={gameFacts}
      category={category}
      onBack={handleBack}
      onContinue={handleContinue}
      onPlayAgain={handlePlayAgain}
    />
  )
}

export default GameRoute
export { GAME_PATH, CAT_PARAM, getCategoryFromUrl, buildGameSearch }
