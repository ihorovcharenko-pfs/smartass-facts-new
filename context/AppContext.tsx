'use client'

// App-wide UI state (search text, group filter, favourites) plus a navigation
// bridge. In the old Vite SPA, `pathname`/`navigate` were backed by a custom
// history router. Here they're backed by Next's router instead, so every
// existing `useApp()` consumer keeps working unchanged.
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getOnboardingData } from '../utils/localStorage'

export type NavigateFn = (pathname: string, search?: string, replace?: boolean) => void

export interface AppContextValue {
  pathname: string
  navigate: NavigateFn
  searchText: string
  onSearchChange: (text: string) => void
  selectedGroupId: number | null
  onGroupSelect: (groupId: number | null) => void
  onPlayClick: (category: string) => void
  favouriteCategories: number[]
}

const AppContext = createContext<AppContextValue | null>(null)

const normalize = (p: string) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p)

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = normalize(usePathname() || '/')

  const [searchText, setSearchText] = useState('')
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const [favouriteCategories, setFavouriteCategories] = useState<number[]>([])

  // localStorage is browser-only — read after mount so SSR markup and the first
  // client render match (no hydration mismatch).
  useEffect(() => {
    setFavouriteCategories(getOnboardingData().favouriteCategoryIds)
  }, [])

  const navigate = useCallback<NavigateFn>(
    (path, search, replace = false) => {
      const normalized = normalize(path)
      const url = search ? `${normalized}?${search}` : normalized
      if (replace) router.replace(url)
      else router.push(url)
    },
    [router],
  )

  const onSearchChange = useCallback((text: string) => {
    setSearchText(text)
    if (text.trim() !== '') setSelectedGroupId(null)
  }, [])

  const onGroupSelect = useCallback((groupId: number | null) => {
    setSelectedGroupId(groupId)
    setSearchText('')
  }, [])

  const onPlayClick = useCallback(
    (category: string) => {
      router.push(`/game?cat=${encodeURIComponent(category)}`)
    },
    [router],
  )

  const value: AppContextValue = {
    pathname,
    navigate,
    searchText,
    onSearchChange,
    selectedGroupId,
    onGroupSelect,
    onPlayClick,
    favouriteCategories,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
