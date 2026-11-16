import { useCallback, useRef } from 'react'
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { Href, useFocusEffect, useRouter } from 'expo-router'
import { NeonButton } from '@/components/ui/NeonButton'
import { useAppearance } from '@/features/appearance/useAppearance'
import { useAuth } from '@/features/auth/hooks'
import { RoomCard } from '@/features/rooms/RoomCard'
import { useRooms } from '@/features/rooms/useRooms'
import { fontSize, layout, lineWidth, palette, radius, spacing } from '@/constants/theme'
import { glow } from '@/utils/glow'

// The rooms page (the "/" route). Shows a big plus when the person is in no rooms,
// otherwise the list of rooms they belong to. Joining a room happens through an
// invite link, so there is no "browse all rooms" here.
export default function Rooms() {
  const router = useRouter()
  const { primary, secondary } = useAppearance()
  const { session, signOut } = useAuth()
  const { rooms, loading, error, refresh } = useRooms(session?.user.id)

  // Reload when coming back to this page (for example after creating a room).
  // The first focus is skipped because useRooms already loads on mount.
  const firstFocus = useRef(true)
  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false
        return
      }
      refresh()
    }, [refresh])
  )

  // The create-room page does not exist yet, so this lands on the 404 until it is built.
  const createRoom = () => router.push('/room/new' as Href)

  let body
  if (loading) {
    body = (
      <View style={styles.center}>
        <ActivityIndicator color={primary} />
      </View>
    )
  } else if (error && rooms.length === 0) {
    body = (
      <View style={styles.center}>
        <Text style={styles.message} accessibilityRole="alert">
          {error}
        </Text>
        <View style={styles.retry}>
          <NeonButton label="Try again" onPress={refresh} variant="secondary" />
        </View>
      </View>
    )
  } else if (rooms.length === 0) {
    body = (
      <View style={styles.center}>
        <Pressable
          onPress={createRoom}
          accessibilityRole="button"
          accessibilityLabel="Create a room"
          style={[styles.plus, { borderColor: primary }, glow(primary, 'focus')]}
        >
          <Text style={[styles.plusGlyph, { color: primary }]}>+</Text>
        </Pressable>
        <Text style={styles.heading} maxFontSizeMultiplier={layout.maxFontScale}>
          Create a room
        </Text>
        <Text style={styles.message} maxFontSizeMultiplier={layout.maxFontScale}>
          Rooms you are invited to will show up here too.
        </Text>
      </View>
    )
  } else {
    body = (
      <FlatList
        data={rooms}
        keyExtractor={(room) => room.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.gap} />}
        renderItem={({ item }) => (
          <RoomCard room={item} onPress={() => router.push(`/room/${item.id}` as Href)} />
        )}
        ListFooterComponent={
          <Pressable
            onPress={createRoom}
            accessibilityRole="button"
            accessibilityLabel="Create a room"
            style={[styles.newRoom, { borderColor: secondary }]}
          >
            <Text style={[styles.newRoomText, { color: secondary }]}>+ New room</Text>
          </Pressable>
        }
      />
    )
  }

  return (
    <View style={styles.root}>
      <View style={styles.body}>{body}</View>

      {/* Temporary: keeps the login loop testable. Move into the options page later. */}
      <Pressable onPress={signOut} hitSlop={10} style={styles.signOut} accessibilityRole="button">
        <Text style={[styles.signOutText, { color: secondary }]}>Sign out</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  plus: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: lineWidth,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  plusGlyph: {
    fontSize: 56,
    fontWeight: '300',
    lineHeight: 62,
  },
  heading: {
    color: palette.text,
    fontSize: fontSize.body + 3,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    color: palette.muted,
    fontSize: 15,
    textAlign: 'center',
  },
  retry: {
    width: '100%',
    marginTop: spacing.lg,
  },
  list: {
    padding: spacing.md,
  },
  gap: {
    height: spacing.md,
  },
  newRoom: {
    minHeight: layout.controlHeight,
    marginTop: spacing.md,
    borderWidth: lineWidth,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newRoomText: {
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  signOut: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '600',
  },
})