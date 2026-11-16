import { ReactNode, useState } from 'react'
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native'
import Svg, { Path, Polygon, Rect } from 'react-native-svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppearance } from '@/features/appearance/useAppearance'
import { cabinet, fontSize, layout, lineWidth, palette, spacing } from '@/constants/theme'
import { cabinetGeometry } from '@/utils/cabinetGeometry'
import { mix } from '@/utils/color'
import { withAlpha } from '@/utils/glow'

type Props = {
  title: string
  left?: ReactNode // top-left slot (profile button)
  right?: ReactNode // top-right slot (options button)
  deck?: ReactNode // bottom slot. The plate is always drawn; its content is optional.
  children: ReactNode // the center panel
}

// The panel color: the primary blended into the marble gray. It is OPAQUE on purpose.
// Anything that paints over the panel (like the Stack inside it) must use this same
// color, because a transparent screen lets the navigator's own default (white) through.
export function usePanelFill() {
  const { primary } = useAppearance()
  return mix(palette.bg, primary, cabinet.panelTint)
}

// Glow passes drawn under the sharp line. Every line (panel outline and the four legs)
// is the same path drawn with the same passes, so width and glow strength always match.
const GLOW_PASSES = [
  { width: 9, alpha: 0.1 },
  { width: 5, alpha: 0.22 },
] as const

// The arcade-cabinet shell: a marquee on top with the title, a rounded center panel
// for the page, and a control deck on the bottom. It has no product logic, so whatever
// sits in the slots is decided by the layout that uses it. The frame never scrolls;
// pages scroll inside the panel.
export function CabinetFrame({ title, left, right, deck, children }: Props) {
  const insets = useSafeAreaInsets()
  const { primary } = useAppearance()
  const panelFill = usePanelFill()
  const [size, setSize] = useState({ w: 0, h: 0 })

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    setSize((s) => (s.w === width && s.h === height ? s : { w: width, h: height }))
  }

  const g =
    size.w > 0 && size.h > 0
      ? cabinetGeometry({
          width: size.w,
          height: size.h,
          insetTop: insets.top + spacing.sm,
          insetBottom: insets.bottom + spacing.sm,
          panelWidthRatio: cabinet.panelWidthRatio,
          marqueeShare: cabinet.marqueeFlex,
          panelShare: cabinet.panelFlex,
          deckShare: cabinet.deckFlex,
          radius: cabinet.panelRadius,
          joinAngle: cabinet.joinAngle,
        })
      : null

  // Marquee and deck content line up with the panel's width, so it never touches a leg
  const slot = g ? { left: g.panel.x + spacing.sm, width: g.panel.w - spacing.sm * 2 } : null

  return (
    <View style={[styles.root, { paddingLeft: insets.left, paddingRight: insets.right }]}>
      <View style={styles.column} onLayout={onLayout}>
        {/* Layer 1: fills (marquee, deck, panel) */}
        {g ? (
          <View style={styles.layer}>
            <Svg width={size.w} height={size.h}>
              <Polygon points={g.marqueePoints} fill={palette.bgRaised} />
              <Polygon points={g.deckPoints} fill={palette.bgRaised} />
              <Rect
                x={g.panel.x}
                y={g.panel.y}
                width={g.panel.w}
                height={g.panel.h}
                rx={g.panel.r}
                ry={g.panel.r}
                fill={panelFill}
              />
            </Svg>
          </View>
        ) : null}

        {/* Layer 2: content */}
        {g && slot ? (
          <View
            style={[
              styles.slot,
              slot,
              { top: g.marqueeZone.top, height: g.marqueeZone.bottom - g.marqueeZone.top },
            ]}
          >
            <View style={styles.marqueeRow}>
              <View style={styles.side}>{left}</View>
              <Text
                style={[styles.title, { textShadowColor: primary }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                accessibilityRole="header"
                maxFontSizeMultiplier={layout.maxFontScale}
              >
                {title}
              </Text>
              <View style={[styles.side, styles.sideRight]}>{right}</View>
            </View>
          </View>
        ) : null}

        {g && slot ? (
          <View
            style={[
              styles.slot,
              slot,
              {
                top: g.deckZone.top,
                height: g.deckZone.bottom - g.deckZone.top,
                justifyContent: 'center',
              },
            ]}
          >
            {deck}
          </View>
        ) : null}

        {/* The page. Always rendered so the navigator inside never remounts. */}
        <View
          style={[
            styles.panelContent,
            g
              ? {
                  left: g.panel.x + lineWidth,
                  top: g.panel.y + lineWidth,
                  width: g.panel.w - lineWidth * 2,
                  height: g.panel.h - lineWidth * 2,
                  borderRadius: Math.max(0, g.panel.r - lineWidth),
                  backgroundColor: panelFill,
                }
              : styles.hidden,
          ]}
        >
          {children}
        </View>

        {/* Layer 3: lines, above the content so the glow also shows on the inner side */}
        {g ? (
          <View style={styles.layer}>
            <Svg width={size.w} height={size.h}>
              {GLOW_PASSES.map((pass) => (
                <Path
                  key={pass.width}
                  d={g.linePath}
                  fill="none"
                  stroke={withAlpha(primary, pass.alpha)}
                  strokeWidth={pass.width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
              <Path
                d={g.linePath}
                fill="none"
                stroke={primary}
                strokeWidth={lineWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  column: {
    flex: 1,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  // Drawing layers sit over the whole column and never take touches
  layer: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
  slot: {
    position: 'absolute',
  },
  marqueeRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    width: 44,
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    color: palette.text,
    fontSize: fontSize.brand - 4,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  panelContent: {
    position: 'absolute',
    overflow: 'hidden',
  },
  hidden: {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  },
})