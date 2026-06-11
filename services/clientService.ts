
// Works in both the browser and on the server (SSR). Defaults to the live API;
// override with NEXT_PUBLIC_API_BASE_URL (e.g. http://localhost:3000) for local API dev.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.smartassfacts.com";

// Prefetched API responses started by the inline script in index.html
// before React boots — consumed once by fetchGroups / fetchCategories.
declare global {
  interface Window {
    __prefetch?: {
      categories?: Promise<Response>
      groups?: Promise<Response>
    }
  }
}

export interface Group {
  id: number
  name: string
  image: string | null
}

export interface Category {
  id: number
  category: string
  saCategory: string
  imageUrl: string | null
  groupId: number | null
}

export interface Fact {
  id: number
  category: string
  saCategory: string
  saCategoryTwo: string | null
  fact: string
  saFact: string
  answer: string
  explanation: string | null
  createdAt: string
  updatedAt: string
}

export const fetchGroups = async (): Promise<Group[]> => {
  const cacheKey = 'groups'
  const cached = sessionStorage.getItem(cacheKey)
  if (cached) {
    try { return JSON.parse(cached) } catch { sessionStorage.removeItem(cacheKey) }
  }

  // Consume the prefetched promise if available (started before React booted)
  const pf = window.__prefetch
  const responseProm = pf?.groups ?? fetch(`${API_BASE_URL}/api/client/groups`)
  if (pf?.groups) delete pf.groups

  const response = await responseProm
  if (!response.ok) throw new Error('Failed to fetch groups')
  const data = await response.json()
  sessionStorage.setItem(cacheKey, JSON.stringify(data))
  return data
}

export const fetchCategories = async (): Promise<Category[]> => {
  const cacheKey = 'categories'
  const cached = sessionStorage.getItem(cacheKey)
  if (cached) {
    try { return JSON.parse(cached) } catch { sessionStorage.removeItem(cacheKey) }
  }

  // Consume the prefetched promise if available (started before React booted)
  const pf = window.__prefetch
  const responseProm = pf?.categories ?? fetch(`${API_BASE_URL}/api/client/categories`)
  if (pf?.categories) delete pf.categories

  const response = await responseProm
  if (!response.ok) throw new Error('Failed to fetch categories')
  const data = await response.json()
  sessionStorage.setItem(cacheKey, JSON.stringify(data))
  return data
}

export const fetchFactsForClient = async (
  category?: string,
  skipIds?: number[],
  poolId?: number
): Promise<Fact[]> => {
  const params = new URLSearchParams()
  
  if (category) {
    params.append('saCategory', category)
  }
  
  if (skipIds && skipIds.length > 0) {
    params.append('skipIds', skipIds.join(','))
  }

  if (poolId !== undefined) {
    params.append('poolId', poolId.toString())
  }

  const url = `${API_BASE_URL}/api/client/facts${params.toString() ? `?${params.toString()}` : ''}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch facts')
  }

  return response.json()
}

// ─── User Auth ────────────────────────────────────────────────────────────────

const USER_TOKEN_KEY = 'sa_user_token'

export interface User {
  id: number
  email: string
  username: string
  xpTotal: number
  currentStreak: number
  bestStreak: number
}

interface AuthResponse {
  token: string
  user: User
}

export const getUserToken = (): string | null =>
  localStorage.getItem(USER_TOKEN_KEY)

export const registerUser = async (
  email: string,
  username: string,
  password: string
): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Registration failed')
  localStorage.setItem(USER_TOKEN_KEY, data.token)
  return data
}

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Login failed')
  localStorage.setItem(USER_TOKEN_KEY, data.token)
  return data
}

export const fetchCurrentUser = async (): Promise<User | null> => {
  const token = getUserToken()
  if (!token) return null
  const res = await fetch(`${API_BASE_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    localStorage.removeItem(USER_TOKEN_KEY)
    return null
  }
  return res.json()
}

export const logoutUser = (): void => {
  localStorage.removeItem(USER_TOKEN_KEY)
}

export const googleSignIn = async (credential: string): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE_URL}/api/users/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Google sign-in failed')
  localStorage.setItem(USER_TOKEN_KEY, data.token)
  return data
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export interface LeaderboardPlayer {
  userId: number
  username: string
  totalScore: number
  gamesPlayed: number
  bestDailyScore: number
  rank: number
  badge: number | null  // 1 | 2 | 3 | null
}

export interface LeaderboardResponse {
  yearMonth: string
  players: LeaderboardPlayer[]
}

export interface MyRankResponse {
  yearMonth: string
  rank: number | null
  totalScore?: number
  gamesPlayed?: number
  bestDailyScore?: number
  totalPlayers: number
}

export const fetchMonthlyLeaderboard = async (
  month?: string
): Promise<LeaderboardResponse> => {
  const url = month
    ? `${API_BASE_URL}/api/leaderboard/monthly?month=${month}`
    : `${API_BASE_URL}/api/leaderboard/monthly`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch leaderboard')
  return res.json()
}

export const fetchMyRank = async (): Promise<MyRankResponse | null> => {
  const token = getUserToken()
  if (!token) return null
  const res = await fetch(`${API_BASE_URL}/api/leaderboard/my-rank`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  return res.json()
}

export const submitLeaderboardScore = async (
  score: number
): Promise<MyRankResponse | null> => {
  const token = getUserToken()
  if (!token) return null
  const res = await fetch(`${API_BASE_URL}/api/leaderboard/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ score }),
  })
  if (!res.ok) return null
  return res.json()
}

// ─── Daily Scores (anonymous session-based) ───────────────────────────────────

export interface DailyRankResponse {
  rankPercentile: number
  totalPlayers: number
  score: number
}

export const submitDailyScore = async (
  sessionToken: string,
  score: number,
  poolDate: string
): Promise<DailyRankResponse | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/scores/daily`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: sessionToken, score, pool_date: poolDate }),
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export const fetchDailyRank = async (
  sessionToken: string,
  poolDate: string
): Promise<DailyRankResponse | null> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/scores/daily/rank?session_token=${sessionToken}&pool_date=${poolDate}`
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// ─── Streaks ──────────────────────────────────────────────────────────────────

export interface StreakResponse {
  currentStreak: number
  longestStreak: number
  passAvailable: boolean
  streakBroken: boolean
}

export const playStreak = async (
  sessionToken: string,
  playDate: string
): Promise<StreakResponse | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/streaks/play`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: sessionToken, play_date: playDate }),
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export const fetchStreak = async (
  sessionToken: string
): Promise<StreakResponse | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/streaks?session_token=${sessionToken}`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export const useSmartassPass = async (
  sessionToken: string
): Promise<StreakResponse | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/streaks/use-pass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: sessionToken }),
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// ─── Email Subscribers ────────────────────────────────────────────────────────

export const subscribeEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok) return { success: false, error: data.error || 'Failed to subscribe' }
    return { success: true }
  } catch {
    return { success: false, error: 'Network error' }
  }
}

// ─── Battle Sessions ──────────────────────────────────────────────────────────

export interface BattleSession {
  id: string
  category: string
  challengerScore: number
  totalFacts: number
  facts: Fact[]
}

export const createBattle = async (
  category: string,
  factIds: number[],
  challengerScore: number
): Promise<{ id: string }> => {
  const res = await fetch(`${API_BASE_URL}/api/battles/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, factIds, challengerScore }),
  })
  if (!res.ok) throw new Error('Failed to create battle')
  return res.json()
}

export const fetchBattle = async (id: string): Promise<BattleSession> => {
  const res = await fetch(`${API_BASE_URL}/api/battles/${id}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Battle not found')
  return data
}

// ─── Personalised Feed ────────────────────────────────────────────────────────

export interface FactInteraction {
  factId: number
  wasCorrect: boolean
  category: string
}

export const logInteractions = async (
  sessionToken: string,
  interactions: FactInteraction[]
): Promise<void> => {
  if (interactions.length === 0) return
  try {
    await fetch(`${API_BASE_URL}/api/client/interactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: sessionToken, interactions }),
    })
  } catch {
    // Silently fail — interaction logging is non-critical
  }
}

export const fetchPersonalizedFacts = async (
  sessionToken: string,
  preferredCategories?: string[]
): Promise<Fact[]> => {
  const params = new URLSearchParams({ session_token: sessionToken })
  if (preferredCategories && preferredCategories.length > 0) {
    params.append('preferred_categories', preferredCategories.join(','))
  }
  const res = await fetch(`${API_BASE_URL}/api/client/facts/personalized?${params}`)
  if (!res.ok) throw new Error('Failed to fetch personalized facts')
  return res.json()
}

// ─── Image URLs ───────────────────────────────────────────────────────────────

export const getImageUrl = (imageUrl: string | null): string => {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  return `${API_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
}



export interface FactDetail {
  id: number
  category: string
  saCategory: string
  saCategoryTwo: string | null
  saFact: string
  answer: string
  explanation: string | null
}

export interface RelatedFact {
  id: number
  saFact: string
  category: string
}

export interface CategoryPageFact {
  id: number
  saFact: string
  answer: boolean
}

export interface CategoryPageResponse {
  categoryName: string
  total: number
  page: number
  pages: number
  facts: CategoryPageFact[]
}

export const fetchFactsByCategory = async (slug: string, page = 1): Promise<CategoryPageResponse | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/client/facts/by-category/${encodeURIComponent(slug)}?page=${page}`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export const fetchFactById = async (id: number): Promise<{ fact: FactDetail; related: RelatedFact[] } | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/client/fact/${id}`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}
