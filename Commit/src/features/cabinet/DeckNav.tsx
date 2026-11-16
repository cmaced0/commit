import { Href, usePathname, useRouter } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useAppearance } from '@/features/appearance/useAppearance'
import { layout, lineWidth, palette, radius } from '@/constants/theme'
import { glow, withAlpha } from '@/utils/glow'
import { mix } from '@/utils/color'

type Item = {
  key: string
  label: string
  to: (roomId: string) => string
  enabled: boolean // false = drawn dimmed and does nothing until the page exists
}

// The control deck. Flip `enabled` to true as each page gets built.
const ITEMS: Item[] = [
  { key: 'rooms', label: 'Rooms', to: () => '/', enabled: true },
  { key: 'challenges', label: 'Challenges', to: (id) => `/room/${id}/challenges`, enabled: false },
  { key: 'rewards', label: 'Rewards', to: (id) => `/room/${id}/rewards`, enabled: false },
  { key: 'inbox', label: 'Inbox', to: (id) => `/room/${id}/inbox`, enabled: false },
]

// Navigation buttons for the bottom plate. Only rendered once a room is chosen.
// They use the secondary color; the frame itself uses the primary.
export function DeckNav({ roomId }: { roomId: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const { secondary } = useAppearance()

  return (
    <View style={styles.row}>
      {ITEMS.map((item) => {
        const target = item.to(roomId)
        const active = item.key !== 'rooms' && pathname.startsWith(target)

        return (
          <Pressable
            key={item.key}
            onPress={() => router.push(target as Href)}
            disabled={!item.enabled}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ disabled: !item.enabled, selected: active }}
            style={({ pressed }) => [
              styles.key,
              {
                borderColor: item.enabled ? secondary : withAlpha(secondary, 0.3),
                backgroundColor:
                  pressed || active ? mix(palette.surface, secondary, 0.2) : palette.surface,
              },
              item.enabled && glow(secondary, 'soft'),
            ]}
          >
            <Text
              style={[styles.label, { color: item.enabled ? palette.text : palette.muted }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              maxFontSizeMultiplier={layout.maxFontScale}
            >
              {item.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  key: {
    flex: 1,
    minHeight: layout.controlHeight,
    borderWidth: lineWidth,
    borderRadius: radius.lg,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
})