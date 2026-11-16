import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DEFAULT_PALETTE_ID, PALETTES } from '@/constants/theme'

const STORAGE_KEY = 'appearance.palette.v1'

export type AppearanceContextValue = {
  primary: string
  secondary: string
  accent: string // alias of primary so components written earlier keep working
  paletteId: string
  setPalette: (id: string) => void
  ready: boolean // true once the saved choice has been loaded
}

export const AppearanceContext = createContext<AppearanceContextValue | null>(null)

const find = (id: string) => PALETTES.find((p) => p.id === id)

// Holds the user's chosen palette (a primary and secondary neon pair) and remembers it
// on this device. Later this can also sync to a `profiles.palette_id` column so it
// follows the user across devices.
export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [paletteId, setPaletteId] = useState(DEFAULT_PALETTE_ID)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        // Stored values are treated as untrusted: only accept an id from the known list
        if (active && saved && find(saved)) setPaletteId(saved)
      })
      .catch(() => {}) // storage can be unavailable (private mode, blocked data)
      .finally(() => {
        if (active) setReady(true)
      })
    return () => {
      active = false
    }
  }, [])

  const setPalette = useCallback((id: string) => {
    if (!find(id)) return
    setPaletteId(id)
    AsyncStorage.setItem(STORAGE_KEY, id).catch(() => {})
  }, [])

  const value = useMemo(() => {
    const p = find(paletteId) ?? PALETTES[0]
    return {
      primary: p.primary,
      secondary: p.secondary,
      accent: p.primary,
      paletteId: p.id,
      setPalette,
      ready,
    }
  }, [paletteId, setPalette, ready])

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>
}