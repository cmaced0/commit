import { createContext, ReactNode, useMemo, useState } from 'react'

export type CabinetContextValue = {
  // null means "use the default title" (Challenge Rooms)
  title: string | null
  setTitle: (title: string | null) => void
}

export const CabinetContext = createContext<CabinetContextValue | null>(null)

// Lets a page decide what the marquee says (for example the name of the current room)
// without the layout having to know what the page loaded.
export function CabinetProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string | null>(null)
  const value = useMemo(() => ({ title, setTitle }), [title])

  return <CabinetContext.Provider value={value}>{children}</CabinetContext.Provider>
}