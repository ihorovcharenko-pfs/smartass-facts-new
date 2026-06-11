'use client'

// Client-side provider tree + persistent shell, mounted once in the root layout
// so it wraps every route. Server Components (e.g. the SSR landing page) are
// passed through as `children` and still render on the server.
import { AuthProvider } from '../context/AuthContext'
import { AppProvider } from '../context/AppContext'
import AppShell from './AppShell'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        <AppShell>{children}</AppShell>
      </AppProvider>
    </AuthProvider>
  )
}
