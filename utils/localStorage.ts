const SKIP_IDS_KEY = 'smartAss_skipIds'
const POOL_ID_KEY = 'smartAss_poolId'
const ONBOARDING_KEY = 'smartAss_onboarding'
const SESSION_TOKEN_KEY = 'sa_session_token'
const GAMES_PLAYED_KEY = 'sa_games_played'
const SOUND_ENABLED_KEY = 'sa_sound_enabled'
const MAX_SKIP_IDS_PER_CATEGORY = 50

interface OnboardingData {
  completed: boolean
  favouriteCategoryIds: number[]
}

export const getOnboardingData = (): OnboardingData => {
  try {
    const stored = localStorage.getItem(ONBOARDING_KEY)
    if (!stored) return { completed: false, favouriteCategoryIds: [] }
    return JSON.parse(stored) as OnboardingData
  } catch {
    return { completed: false, favouriteCategoryIds: [] }
  }
}

export const setOnboardingData = (data: OnboardingData): void => {
  try {
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving onboarding data:', error)
  }
}

interface SkipIdsByCategory {
  [category: string]: number[]
}

/**
 * Get skip IDs for a specific category from localStorage
 */
export const getSkipIds = (category: string): number[] => {
  try {
    const stored = localStorage.getItem(SKIP_IDS_KEY)
    if (!stored) return []
    const data = JSON.parse(stored) as SkipIdsByCategory
    return Array.isArray(data[category]) ? data[category] : []
  } catch (error) {
    console.error('Error reading skipIds from localStorage:', error)
    return []
  }
}

/**
 * Add new fact IDs to the beginning of skip list for a specific category
 * Maintains maximum of MAX_SKIP_IDS_PER_CATEGORY items per category
 */
export const addSkipIds = (category: string, newIds: number[]): void => {
  try {
    const stored = localStorage.getItem(SKIP_IDS_KEY)
    const data: SkipIdsByCategory = stored ? JSON.parse(stored) : {}
    
    const existingIds = data[category] || []
    // Remove duplicates and add new IDs to the beginning
    const uniqueNewIds = newIds.filter(id => !existingIds.includes(id))
    const combinedIds = [...uniqueNewIds, ...existingIds]
    
    // Keep only the first MAX_SKIP_IDS_PER_CATEGORY
    const limitedIds = combinedIds.slice(0, MAX_SKIP_IDS_PER_CATEGORY)
    
    data[category] = limitedIds
    localStorage.setItem(SKIP_IDS_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving skipIds to localStorage:', error)
  }
}

/**
 * Get poolId from localStorage for Game of the day
 * Returns the current poolId number (defaults to 0 if not set)
 */
export const getPoolId = (): number => {
  try {
    const stored = localStorage.getItem(POOL_ID_KEY)
    if (!stored) return 0
    const poolId = parseInt(stored, 10)
    return isNaN(poolId) ? 0 : poolId
  } catch (error) {
    console.error('Error reading poolId from localStorage:', error)
    return 0
  }
}

/**
 * Set poolId in localStorage for Game of the day
 * The poolId should always be a number that grows
 */
export const setPoolId = (poolId: number): void => {
  try {
    localStorage.setItem(POOL_ID_KEY, poolId.toString())
  } catch (error) {
    console.error('Error saving poolId to localStorage:', error)
  }
}

/**
 * Increment poolId and return the new value
 * This ensures poolId always grows
 */
export const incrementPoolId = (): number => {
  const currentPoolId = getPoolId()
  const newPoolId = currentPoolId + 1
  setPoolId(newPoolId)
  return newPoolId
}

// ─── Session Token ────────────────────────────────────────────────────────────

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const getSessionToken = (): string => {
  try {
    const stored = localStorage.getItem(SESSION_TOKEN_KEY)
    if (stored) return stored
    const token = generateUUID()
    localStorage.setItem(SESSION_TOKEN_KEY, token)
    return token
  } catch {
    return generateUUID()
  }
}

// ─── Games Played ─────────────────────────────────────────────────────────────

export const getGamesPlayed = (): number => {
  try {
    const stored = localStorage.getItem(GAMES_PLAYED_KEY)
    if (!stored) return 0
    return parseInt(stored, 10) || 0
  } catch {
    return 0
  }
}

export const incrementGamesPlayed = (): number => {
  const count = getGamesPlayed() + 1
  try {
    localStorage.setItem(GAMES_PLAYED_KEY, count.toString())
  } catch { /* ignore */ }
  return count
}

// ─── Sound Preference ─────────────────────────────────────────────────────────

export const getSoundEnabled = (): boolean => {
  try {
    const stored = localStorage.getItem(SOUND_ENABLED_KEY)
    if (stored === null) return true // default on
    return stored === 'true'
  } catch {
    return true
  }
}

export const setSoundEnabled = (enabled: boolean): void => {
  try {
    localStorage.setItem(SOUND_ENABLED_KEY, enabled.toString())
  } catch { /* ignore */ }
}

