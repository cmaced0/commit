import { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { useAuth } from '@/features/auth/hooks'
import { theme, neonGlow, noWebOutline } from '@/utils/theme'

const CODE_LENGTH = 6 // must match the OTP length set in Supabase
const RESEND_SECONDS = 30

export default function Verify() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { phone } = useLocalSearchParams<{ phone: string }>()
  const { verifyCode, sendCode } = useAuth()

  const [code, setCode] = useState('')
  const [focused, setFocused] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(RESEND_SECONDS)
  const inputRef = useRef<TextInput>(null)

  const prettyPhone = phone
    ? parsePhoneNumberFromString(phone)?.formatNational() ?? phone
    : ''

  // Resend countdown
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const submit = async (value: string) => {
    if (loading || !phone) return
    setLoading(true)
    setError(null)

    const { error: verifyError } = await verifyCode(phone, value)
    setLoading(false)

    if (verifyError) {
      setCode('')
      setError("That code didn't work. Check it and try again.")
      inputRef.current?.focus()
    }
    // On success there's nothing to do here: the session change in AuthProvider
    // flips the route guard and moves the user into the app.
  }

  const onChangeCode = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, CODE_LENGTH)
    setCode(digits)
    if (digits.length === CODE_LENGTH) submit(digits)
  }

  const resend = async () => {
    if (cooldown > 0 || !phone) return
    setError(null)
    const { error: sendError } = await sendCode(phone)
    if (sendError) {
      setError(sendError.message)
      return
    }
    setCooldown(RESEND_SECONDS)
  }

  const canSubmit = code.length === CODE_LENGTH && !loading

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Enter code</Text>
        <Text style={styles.subtitle}>
          We sent a {CODE_LENGTH}-digit code to {prettyPhone}.
        </Text>

        <TextInput
          ref={inputRef}
          style={[styles.input, neonGlow(focused), noWebOutline]}
          value={code}
          onChangeText={onChangeCode}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={'•'.repeat(CODE_LENGTH)}
          placeholderTextColor={theme.muted}
          selectionColor={theme.neon}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          maxLength={CODE_LENGTH}
          editable={!loading}
          autoFocus
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.links}>
          <Pressable onPress={resend} disabled={cooldown > 0} hitSlop={10}>
            <Text style={[styles.link, cooldown > 0 && styles.linkDisabled]}>
              {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
            </Text>
          </Pressable>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Text style={styles.link}>Wrong number?</Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        onPress={() => submit(code)}
        disabled={!canSubmit}
        style={({ pressed }) => [
          styles.button,
          !canSubmit && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={theme.text} />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </Pressable>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: theme.muted,
    fontSize: 16,
    marginBottom: 32,
  },
  input: {
    height: 68,
    borderWidth: 2,
    borderColor: theme.neon,
    borderRadius: 20,
    paddingHorizontal: 20,
    color: theme.text,
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 10,
    textAlign: 'center',
    backgroundColor: 'rgba(176, 38, 255, 0.06)',
  },
  error: {
    color: theme.danger,
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  links: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  link: {
    color: theme.neon,
    fontSize: 15,
    fontWeight: '600',
  },
  linkDisabled: {
    color: theme.muted,
  },
  button: {
    height: 56,
    borderRadius: 20,
    backgroundColor: theme.neon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: theme.text,
    fontSize: 17,
    fontWeight: '700',
  },
})