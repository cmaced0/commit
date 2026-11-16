import { useContext, useEffect } from 'react'
import { CabinetContext } from './CabinetProvider'

export function useCabinet() {
  const ctx = useContext(CabinetContext)
  if (!ctx) throw new Error('useCabinet must be used inside <CabinetProvider>')
  return ctx
}

// Call from a page to set the marquee title while that page is mounted.
// An empty string shows a blank title (use it while the name is still loading).
// The title goes back to the default when the page unmounts.
export function useCabinetTitle(title: string) {
  const { setTitle } = useCabinet()

  useEffect(() => {
    setTitle(title)
    return () => setTitle(null)
  }, [title, setTitle])
}