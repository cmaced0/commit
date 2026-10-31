import { useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '@/components/ui/Screen'
import { NeonInput } from '@/components/ui/NeonInput'
import { NeonButton } from '@/components/ui/NeonButton'
import { useAuth } from '@/features/auth/hooks'
import { authErrorMessage } from '@/features/auth/errors'
import { formatPhoneInput, toE164 } from '@/utils/phone'
import { fontSize, layout, palette, spacing } from '@/constants/theme'

export default function Login() {
  const router = useRouter()
  const { sendCode } = useAuth()

  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // A ref (not state) so a fast double-tap can't send two texts before
  // React has re-rendered with loading = true. Every text costs money.
  const submitting = useRef(false)

  const e164 = toE164(phone)

  const onNext = async () => {
    if (submitting.current) return
    if (!e164) {
      setError('Enter a valid phone number')
      return
    }

    submitting.current = true
    setLoading(true)
    setError(null)

    try {
      const { error: sendError } = await sendCode(e164)
      if (sendError) {
        setError(authErrorMessage(sendError))
        return
      }
      router.push({ pathname: '/verify', params: { phone: e164 } })
    } finally {
      submitting.current = false
      setLoading(false)
    }
  }

  return (
    <Screen>
      {/* Top: brand */}
      <View style={styles.header}>
        <Text style={styles.brand} maxFontSizeMultiplier={layout.maxFontScale}>
          Commit
        </Text>
      </View>

      {/* Middle: title with the input directly underneath, centered on the screen */}
      <View style={styles.middle}>
        <Text
          style={styles.title}
          accessibilityRole="header"
          maxFontSizeMultiplier={layout.maxFontScale}
        >
          Login
        </Text>

        <NeonInput
          value={phone}
          onChangeText={(text) => {
            setPhone((prev) => formatPhoneInput(text, prev))
            if (error) setError(null)
          }}
          onSubmitEditing={onNext}
          invalid={!!error}
          placeholder="Phone number"
          accessibilityLabel="Phone number"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          autoCorrect={false}
          spellCheck={false}
          maxLength={20}
          returnKeyType="done"
          editable={!loading}
        />

        {/* Reserved space so the layout doesn't jump when an error appears */}
        <View style={styles.errorSlot}>
          {error ? (
            <Text
              style={styles.error}
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
              maxFontSizeMultiplier={layout.maxFontScale}
            >
              {error}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Bottom: next */}
      <NeonButton label="Next" onPress={onNext} loading={loading} disabled={!e164} />
    </Screen>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  brand: {
    color: palette.text,
    fontSize: fontSize.brand,
    fontWeight: '700',
    letterSpacing: 1,
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: palette.text,
    fontSize: fontSize.title,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  errorSlot: {
    minHeight: 44,
    paddingTop: spacing.sm,
    alignItems: 'center',
  },
  error: {
    color: palette.danger,
    fontSize: 14,
    textAlign: 'center',
  },
})