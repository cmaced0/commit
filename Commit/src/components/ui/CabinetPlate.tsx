import { ReactNode, useState } from 'react'
import { LayoutChangeEvent, StyleSheet, View } from 'react-native'
import Svg, { Polygon } from 'react-native-svg'
import { useAppearance } from '@/features/appearance/useAppearance'
import { cabinet, lineWidth, palette, spacing } from '@/constants/theme'
import { withAlpha } from '@/utils/glow'

type Props = {
  // marquee: wide edge on top, narrow edge on the bottom (touches the center panel)
  // deck:    narrow edge on top (touches the center panel), wide edge on the bottom
  variant: 'marquee' | 'deck'
  grow: number // flex share of the page height
  children?: ReactNode
}

const PAD = 3 // keeps the outer glow strokes inside the drawing area

// A trapezoid plate drawn with SVG, outlined in the primary color. A shadow on a
// View can't follow a slanted shape, so the glow is faked with two wider, fainter
// strokes under the sharp 1px line. That also renders the same on iOS, Android and web.
export function CabinetPlate({ variant, grow, children }: Props) {
  const { primary } = useAppearance()
  const [size, setSize] = useState({ w: 0, h: 0 })

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    setSize((s) => (s.w === width && s.h === height ? s : { w: width, h: height }))
  }

  const { w, h } = size
  // How far each slanted side sits from the page edge where it meets the center panel
  const inset = (w * (1 - cabinet.panelWidthRatio)) / 2

  const corners =
    variant === 'marquee'
      ? [[PAD, PAD], [w - PAD, PAD], [w - inset, h - 0.5], [inset, h - 0.5]]
      : [[inset, 0.5], [w - inset, 0.5], [w - PAD, h - PAD], [PAD, h - PAD]]
  const points = corners.map(([x, y]) => `${x},${y}`).join(' ')

  return (
    <View style={[styles.plate, { flex: grow }]} onLayout={onLayout}>
      {w > 0 ? (
        <Svg width={w} height={h} style={StyleSheet.absoluteFill} pointerEvents="none">
          <Polygon points={points} fill={palette.bgRaised} />
          <Polygon
            points={points}
            fill="none"
            stroke={withAlpha(primary, 0.12)}
            strokeWidth={6}
            strokeLinejoin="round"
          />
          <Polygon
            points={points}
            fill="none"
            stroke={withAlpha(primary, 0.25)}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <Polygon
            points={points}
            fill="none"
            stroke={primary}
            strokeWidth={lineWidth}
            strokeLinejoin="round"
          />
        </Svg>
      ) : null}

      {/* Content stays inside the narrow edge so it never crosses a slanted side */}
      <View style={[styles.content, { paddingHorizontal: inset + spacing.md }]}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  plate: {
    width: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
})