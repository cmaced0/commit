import { ComponentRef, useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useRouter } from 'expo-router'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { Screen } from '@/components/ui/Screen'
import { NeonInput } from '@/components/ui/NeonInput'
import { NeonButton } from '@/components/ui/NeonButton'
import { useAppearance } from '@/features/appearance/useAppearance'
import { useAuth } from '@/features/auth/hooks'
import { authErrorMessage } from '@/features/auth/errors'
import { useCooldown } from '@/hooks/useCooldown'
import { fontSize, layout, palette, spacing } from '@/constants/theme'

const CODE_LENGTH = 6 // must match the OTP length set in Supabase
const RESEND_SECONDS = 30

type InputRef = ComponentRef<typeof TextInput>

export default function Verify() {
  const router = useRouter()
  const { secondary } = useAppearance()
  const { pendingPhone, verifyCode, sendCode } = useAuth()

  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // A text was just sent on the login screen, so the wait starts immediately
  const cooldown = useCooldown(RESEND_SECONDS)
  const inputRef = useRef<InputRef>(null)

  // Refs (not state) so a fast double-tap can't verify twice or resend twice
  // before React re-renders. Every text costs money.
  const submitting = useRef(false)
  const resending = useRef(false)

  // The number lives in memory only. If it's gone (page refresh on web, or this
  // screen opened directly), there is nothing to verify: go back to login.
  useEffect(() => {
    if (!pendingPhone) router.replace('/login')
  }, [pendingPhone, router])

  const prettyPhone = pendingPhone
    ? parsePhoneNumberFromString(pendingPhone)?.formatNational() ?? pendingPhone
    : ''

  const submit = async (value: string) => {
    if (submitting.current || value.length !== CODE_LENGTH) return

    submitting.current = true
    setLoading(true)
    setError(null)

    try {
      const { error: verifyError } = await verifyCode(value)
      if (verifyError) {
        setCode('')
        setError(authErrorMessage(verifyError))
        inputRef.current?.focus()
      }
      // On success there's nothing to do here: the session change in AuthProvider
      // flips the route guard and moves the user into the app.
    } finally {
      submitting.current = false
      setLoading(false)
    }
  }

  const onChangeCode = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, CODE_LENGTH)
    setCode(digits)
    if (error) setError(null)
    if (digits.length === CODE_LENGTH) submit(digits)
  }

  const resend = async () => {
    if (resending.current || cooldown.active || !pendingPhone) return

    resending.current = true
    setError(null)

    try {
      const { error: sendError } = await sendCode(pendingPhone)
      if (sendError) {
        setError(authErrorMessage(sendError))
        return
      }
      cooldown.start(RESEND_SECONDS)
    } finally {
      resending.current = false
    }
  }

  // Nothing to show while the redirect above runs
  if (!pendingPhone) return null

  return (
    <Screen>
      {/* Top: brand */}
      <View style={styles.header}>
        <Text style={styles.brand} maxFontSizeMultiplier={layout.maxFontScale}>
          Commit
        </Text>
      </View>

      {/* Middle: title, hint, code input, links */}
      <View style={styles.middle}>
        <Text
          style={styles.title}
          accessibilityRole="header"
          maxFontSizeMultiplier={layout.maxFontScale}
        >
          Enter code
        </Text>
        <Text style={styles.subtitle} maxFontSizeMultiplier={layout.maxFontScale}>
          We sent a {CODE_LENGTH}-digit code to {prettyPhone}.
        </Text>

        <NeonInput
          ref={inputRef}
          style={styles.codeInput}
          value={code}
          onChangeText={onChangeCode}
          invalid={!!error}
          placeholder={'•'.repeat(CODE_LENGTH)}
          accessibilityLabel="Verification code"
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          maxLength={CODE_LENGTH}
          editable={!loading}
          autoFocus
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

        {/* Links use the secondary color so they read as lesser actions */}
        <View style={styles.links}>
          <Pressable
            onPress={resend}
            disabled={cooldown.active}
            hitSlop={10}
            accessibilityRole="button"
          >
            <Text
              style={[styles.link, { color: cooldown.active ? palette.muted : secondary }]}
              maxFontSizeMultiplier={layout.maxFontScale}
            >
              {cooldown.active ? `Resend code in ${cooldown.seconds}s` : 'Resend code'}
            </Text>
          </Pressable>
          <Pressable onPress={() => router.back()} hitSlop={10} accessibilityRole="button">
            <Text
              style={[styles.link, { color: secondary }]}
              maxFontSizeMultiplier={layout.maxFontScale}
            >
              Wrong number?
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Bottom: verify */}
      <NeonButton
        label="Verify"
        onPress={() => submit(code)}
        loading={loading}
        disabled={code.length !== CODE_LENGTH}
      />
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
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: palette.muted,
    fontSize: fontSize.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  // Larger, spaced-out digits for the one-time code
  codeInput: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 10,
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
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
  },
})