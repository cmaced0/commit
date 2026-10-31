import { useState } from 'react'
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
import { useRouter } from 'expo-router'
import { useAuth } from '@/features/auth/hooks'
import { toE164 } from '../../utils/phone'
import { theme, neonGlow, noWebOutline } from '@/utils/theme'

export default function Login() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { sendCode } = useAuth()

  const [phone, setPhone] = useState('')
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onContinue = async () => {
    if (loading) return
    setError(null)

    const e164 = toE164(phone)
    if (!e164) {
      setError('Enter a valid phone number')
      return
    }

    setLoading(true)
    const { error: sendError } = await sendCode(e164)
    setLoading(false)

    if (sendError) {
      setError(sendError.message)
      return
    }
    router.push({ pathname: '/verify', params: { phone: e164 } })
  }

  const canSubmit = phone.trim().length > 0 && !loading

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Enter your phone number and we'll text you a code.</Text>

        <TextInput
          style={[styles.input, neonGlow(focused), noWebOutline]}
          value={phone}
          onChangeText={setPhone}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={onContinue}
          placeholder="(555) 555-5555"
          placeholderTextColor={theme.muted}
          selectionColor={theme.neon}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          returnKeyType="done"
          autoFocus
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <Pressable
        onPress={onContinue}
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
          <Text style={styles.buttonText}>Continue</Text>
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
    height: 60,
    borderWidth: 2,
    borderColor: theme.neon,
    borderRadius: 20,
    paddingHorizontal: 20,
    color: theme.text,
    fontSize: 18,
    backgroundColor: 'rgba(176, 38, 255, 0.06)',
  },
  error: {
    color: theme.danger,
    fontSize: 14,
    marginTop: 12,
    marginLeft: 8,
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