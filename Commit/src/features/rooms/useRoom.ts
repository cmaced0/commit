import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type Room = { id: string; name: string }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// One room by id. Row level security only returns rooms the person belongs to, so a
// room they are not in looks exactly like a room that does not exist (`notFound`).
export function useRoom(roomId: string | undefined) {
  const valid = !!roomId && UUID.test(roomId)

  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(valid)
  const [notFound, setNotFound] = useState(!valid)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!valid || !roomId) {
      setRoom(null)
      setLoading(false)
      setNotFound(true)
      return
    }

    let active = true
    setLoading(true)
    setError(null)

    supabase
      .from('rooms')
      .select('id, name')
      .eq('id', roomId)
      .maybeSingle()
      .then(({ data, error: queryError }) => {
        if (!active) return
        if (queryError) {
          setError("Couldn't load this room. Please try again.")
        } else {
          setRoom(data)
          setNotFound(!data)
        }
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [roomId, valid])

  return { room, loading, notFound, error }
}