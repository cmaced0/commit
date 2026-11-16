import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useAppearance } from '@/features/appearance/useAppearance'
import { layout, lineWidth, palette, radius, fontSize, spacing } from '@/constants/theme'
import { glow, withAlpha } from '@/utils/glow'
import { mix } from '@/utils/color'
import { RoomSummary } from './useRooms'

type Props = { room: RoomSummary; onPress: () => void }

// One row in the rooms list. Owners and admins get a small chip in the secondary color.
export function RoomCard({ room, onPress }: Props) {
  const { primary, secondary } = useAppearance()

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open room ${room.name}`}
      style={({ pressed }) => [
        styles.card,
        {
          borderColor: withAlpha(primary, 0.6),
          backgroundColor: pressed ? mix(palette.surface, primary, 0.18) : palette.surface,
        },
        glow(primary, 'soft'),
      ]}
    >
      <Text style={styles.name} numberOfLines={1} maxFontSizeMultiplier={layout.maxFontScale}>
        {room.name}
      </Text>

      {room.role !== 'member' ? (
        <View style={[styles.chip, { borderColor: secondary }]}>
          <Text
            style={[styles.chipText, { color: secondary }]}
            maxFontSizeMultiplier={layout.maxFontScale}
          >
            {room.role}
          </Text>
        </View>
      ) : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    minHeight: layout.controlHeight,
    borderWidth: lineWidth,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  name: {
    flex: 1,
    color: palette.text,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  chip: {
    borderWidth: lineWidth,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
})