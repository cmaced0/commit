import { Pressable, StyleSheet, View } from 'react-native'
import Svg, { Circle, Path } from 'react-native-svg'
import { useAppearance } from '@/features/appearance/useAppearance'
import { lineWidth, palette } from '@/constants/theme'
import { glow } from '@/utils/glow'

type Props = {
  // Leave out until the destination page exists: the button then does nothing.
  onPress?: () => void
}

// Round profile button (top left). Will link to the user's page later.
export function ProfileButton({ onPress }: Props) {
  const { primary } = useAppearance()

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Profile"
      style={[styles.circle, { borderColor: primary }, glow(primary, 'soft')]}
    >
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={9} r={4} stroke={primary} strokeWidth={1.5} />
        <Path
          d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"
          stroke={primary}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </Svg>
    </Pressable>
  )
}

// Three-line options button (top right). Uses the secondary color so the primary
// stays the frame's color. Will link to the options page later.
export function OptionsButton({ onPress }: Props) {
  const { secondary } = useAppearance()

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Options"
      style={styles.options}
    >
      {[0, 1, 2].map((i) => (
        <View key={i} style={[styles.line, { backgroundColor: secondary }]} />
      ))}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: lineWidth,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  options: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  line: {
    width: 22,
    height: 2,
    borderRadius: 1,
  },
})