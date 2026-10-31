import { ComponentRef, forwardRef, useState } from 'react'
import { Platform, StyleSheet, TextInput, TextInputProps, TextStyle } from 'react-native'
import { useAppearance } from '@/features/appearance/useAppearance'
import { layout, lineWidth, palette, radius, fontSize, spacing } from '@/constants/theme'
import { glow, withAlpha } from '@/utils/glow'

type Props = TextInputProps & { invalid?: boolean }

// Derived from the component itself, so it stays correct across React Native versions
type InputRef = ComponentRef<typeof TextInput>

// Removes the browser's default focus ring on web so only our outline shows
const noWebOutline = Platform.select({
  web: { outlineStyle: 'none' },
  default: {},
}) as unknown as TextStyle

// Thin outlined input with a soft glow in the user's accent color.
// The outline brightens and the glow grows on focus. Turns red when `invalid`.
export const NeonInput = forwardRef<InputRef, Props>(function NeonInput(
  { invalid, style, onFocus, onBlur, ...rest },
  ref
) {
  const { accent } = useAppearance()
  const [focused, setFocused] = useState(false)
  const color = invalid ? palette.danger : accent

  return (
    <TextInput
      ref={ref}
      {...rest}
      style={[
        styles.base,
        { borderColor: focused ? color : withAlpha(color, 0.6) },
        glow(color, focused ? 'focus' : 'soft'),
        noWebOutline,
        style,
      ]}
      placeholderTextColor={palette.muted}
      selectionColor={color}
      maxFontSizeMultiplier={layout.maxFontScale}
      onFocus={(e) => {
        setFocused(true)
        onFocus?.(e)
      }}
      onBlur={(e) => {
        setFocused(false)
        onBlur?.(e)
      }}
    />
  )
})

const styles = StyleSheet.create({
  base: {
    minHeight: layout.controlHeight,
    borderWidth: lineWidth,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: palette.surface,
    color: palette.text,
    fontSize: fontSize.input,
    textAlign: 'center',
  },
})