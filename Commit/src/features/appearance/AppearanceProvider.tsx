import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DEFAULT_ACCENT } from '@/constants/theme'

const STORAGE_KEY = 'appearance.accent.v1'
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/

export type AppearanceContextValue = {
  accent: string
  setAccent: (hex: string) => void
  ready: boolean // true once the saved choice has been loaded
}

export const AppearanceContext = createContext<AppearanceContextValue | null>(null)

// Holds the user's chosen accent color (the outline and glow color) and remembers it
// on this device. Later this can also sync to a column on `profiles` so it follows
// the user across devices.
export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [accent, setAccentState] = useState(DEFAULT_ACCENT)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        // Stored values are treated as untrusted: only accept a valid hex color
        if (active && saved && HEX_COLOR.test(saved)) setAccentState(saved)
      })
      .catch(() => {}) // storage can be unavailable (private mode, blocked data)
      .finally(() => {
        if (active) setReady(true)
      })
    return () => {
      active = false
    }
  }, [])

  const setAccent = useCallback((hex: string) => {
    if (!HEX_COLOR.test(hex)) return
    setAccentState(hex)
    AsyncStorage.setItem(STORAGE_KEY, hex).catch(() => {})
  }, [])

  const value = useMemo(() => ({ accent, setAccent, ready }), [accent, setAccent, ready])

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>
}