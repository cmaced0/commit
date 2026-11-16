import { useCallback, useEffect, useState } from 'react'

// Counts down once per second. `seconds` is 0 when idle or finished.
// Used for the "Resend code" wait, since every text costs money.
export function useCooldown(initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds)

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  const start = useCallback((s: number) => setSeconds(s), [])

  return { seconds, active: seconds > 0, start }
}