import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type RoomRole = 'owner' | 'admin' | 'member'
export type RoomSummary = { id: string; name: string; role: RoomRole }

type Row = {
  role: RoomRole
  rooms: { id: string; name: string } | { id: string; name: string }[] | null
}

// The rooms the signed-in person belongs to, newest membership first.
// The caller passes the user id (from useAuth) so features don't reach into each other.
//
// Needs the room_members select policy from supabase/rooms_access.sql. Without it
// the list is always empty. The `.eq` is still required: that policy also lets you
// see the OTHER members of your rooms, and this list wants only your own rows.
export function useRooms(userId: string | undefined) {
  const [rooms, setRooms] = useState<RoomSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!userId) return

    const { data, error: queryError } = await supabase
      .from('room_members')
      .select('role, rooms ( id, name )')
      .eq('user_id', userId)
      .order('joined_at', { ascending: false })

    if (queryError) {
      setError("Couldn't load your rooms. Please try again.")
      setLoading(false)
      return
    }

    // The embedded room can come back as an object or a one-item array
    // depending on the generated types, so accept both.
    const list = ((data ?? []) as unknown as Row[]).flatMap((row) => {
      const room = Array.isArray(row.rooms) ? row.rooms[0] : row.rooms
      return room ? [{ id: room.id, name: room.name, role: row.role }] : []
    })

    setRooms(list)
    setError(null)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { rooms, loading, error, refresh }
}