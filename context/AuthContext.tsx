'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import {
  fetchCurrentUser,
  loginUser as apiLogin,
  registerUser as apiRegister,
  logoutUser as apiLogout,
  type User,
} from '../services/clientService'

interface AuthContextValue {
  user: User | null
  isLoadingAuth: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
  setUserFromAuth: (user: User) => void
  showAuthModal: boolean
  authModalTab: 'login' | 'register'
  openAuthModal: (tab?: 'login' | 'register') => void
  closeAuthModal: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login')

  // Restore session on mount
  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .finally(() => setIsLoadingAuth(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password)
    setUser(data.user)
    setShowAuthModal(false)
  }, [])

  const register = useCallback(async (email: string, username: string, password: string) => {
    const data = await apiRegister(email, username, password)
    setUser(data.user)
    setShowAuthModal(false)
  }, [])

  const logout = useCallback(() => {
    apiLogout()
    setUser(null)
  }, [])

  const openAuthModal = useCallback((tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab)
    setShowAuthModal(true)
  }, [])

  const closeAuthModal = useCallback(() => setShowAuthModal(false), [])

  const setUserFromAuth = useCallback((u: User) => {
    setUser(u)
    setShowAuthModal(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingAuth,
        login,
        register,
        logout,
        setUserFromAuth,
        showAuthModal,
        authModalTab,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
