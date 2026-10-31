import { Platform, TextStyle, ViewStyle } from 'react-native'

// The glow is used on Views (buttons) and on TextInputs. TextStyle extends ViewStyle,
// so typing the result as TextStyle makes it valid for both without casts at the call site.
type GlowStyle = TextStyle

// "#B026FF" + 0.35 -> "rgba(176, 38, 255, 0.35)"
export function withAlpha(hex: string, alpha: number): string {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex)
  if (!m) return hex
  const [r, g, b] = [m[1], m[2], m[3]].map((h) => parseInt(h, 16))
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

type GlowStrength = 'soft' | 'focus'

const GLOW = {
  soft: { opacity: 0.35, radius: 8, elevation: 3 },
  focus: { opacity: 0.55, radius: 14, elevation: 6 },
} as const

// Soft colored glow. Native uses shadow props; web uses boxShadow
// (react-native-web is deprecating the shadow* props).
export function glow(color: string, strength: GlowStrength = 'soft'): GlowStyle {
  const g = GLOW[strength]

  if (Platform.OS === 'web') {
    return { boxShadow: `0 0 ${g.radius}px ${withAlpha(color, g.opacity)}` } as unknown as ViewStyle
  }

  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: g.opacity,
    shadowRadius: g.radius,
    elevation: g.elevation,
  }
}