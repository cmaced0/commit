import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { Href, useLocalSearchParams, useRouter } from 'expo-router'
import { NeonButton } from '@/components/ui/NeonButton'
import { useAppearance } from '@/features/appearance/useAppearance'
import { useCabinetTitle } from '@/features/cabinet/useCabinet'
import { useRoom } from '@/features/rooms/useRoom'
import { fontSize, layout, palette, spacing } from '@/constants/theme'

// Placeholder room page. The marquee shows the room's name, and the control deck
// appears at the bottom because this route has a roomId. Replace the body as
// challenges and rewards get built.
export default function RoomHome() {
  const router = useRouter()
  const { primary } = useAppearance()
  const { roomId } = useLocalSearchParams<{ roomId: string }>()
  const { room, loading, notFound, error } = useRoom(roomId)

  // Blank while loading so "Challenge Rooms" doesn't flash before the name arrives
  useCabinetTitle(room?.name ?? (notFound ? 'Room not found' : ''))

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={primary} />
      </View>
    )
  }

  if (error || notFound || !room) {
    return (
      <View style={styles.center}>
        <Text style={styles.message} accessibilityRole="alert">
          {error ?? "This room doesn't exist, or you're not in it."}
        </Text>
        <View style={styles.back}>
          <NeonButton
            label="Back to rooms"
            onPress={() => router.replace('/' as Href)}
            variant="secondary"
          />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.center}>
      <Text style={styles.heading} maxFontSizeMultiplier={layout.maxFontScale}>
        {room.name}
      </Text>
      <Text style={styles.message} maxFontSizeMultiplier={layout.maxFontScale}>
        Challenges and rewards will show up here.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  heading: {
    color: palette.text,
    fontSize: fontSize.title - 8,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    color: palette.muted,
    fontSize: 15,
    textAlign: 'center',
  },
  back: {
    width: '100%',
    marginTop: spacing.lg,
  },
})