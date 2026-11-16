import { createContext, useEffect, useState, ReactNode } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export type AuthContextValue = {
  session: Session | null
  loading: boolean
  // The number between login and verify. Held in memory, not in a URL parameter,
  // so it never lands in browser history. It is lost on a page refresh, and the
  // verify screen then sends the user back to login.
  pendingPhone: string | null
  setPendingPhone: (phone: string | null) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingPhone, setPendingPhone] = useState<string | null>(null)

  useEffect(() => {
    // Restore any saved session on startup. Always clear `loading`, even on failure,
    // otherwise the splash screen would never hide.
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .catch(() => setSession(null))
      .finally(() => setLoading(false))

    // Stay in sync with sign-in, sign-out, and token refresh
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ session, loading, pendingPhone, setPendingPhone }}>
      {children}
    </AuthContext.Provider>
  )
}