import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'
import { useAppearance } from '@/features/appearance/useAppearance'
import { layout, lineWidth, palette, radius, fontSize } from '@/constants/theme'
import { glow, withAlpha } from '@/utils/glow'

type Props = {
  label: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
}

// Thin outlined button with a soft glow in the user's accent color.
// Dims and loses its glow when disabled or loading.
export function NeonButton({ label, onPress, loading, disabled }: Props) {
  const { accent } = useAppearance()
  const inactive = !!(disabled || loading)

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: !!loading }}
      style={({ pressed }) => [
        styles.base,
        {
          borderColor: inactive ? withAlpha(accent, 0.3) : accent,
          backgroundColor: pressed ? withAlpha(accent, 0.18) : palette.surface,
        },
        !inactive && glow(accent, 'soft'),
      ]}
    >
      {loading ? (
        <ActivityIndicator color={accent} />
      ) : (
        <Text
          style={[styles.label, inactive && styles.labelInactive]}
          maxFontSizeMultiplier={layout.maxFontScale}
        >
          {label}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.controlHeight,
    borderWidth: lineWidth,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: palette.text,
    fontSize: fontSize.body,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  labelInactive: {
    color: palette.muted,
  },
})