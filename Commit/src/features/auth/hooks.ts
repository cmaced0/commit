import { useContext } from 'react'
import { supabase } from '@/lib/supabase'
import { toE164 } from '@/utils/phone'
import { AuthContext } from './AuthProvider'

// Every function returns { error } on EVERY path (including success), so screens can
// always destructure it safely.
type Result = { error: Error | null }

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  const { session, loading, pendingPhone, setPendingPhone } = ctx

  // Step 1: text a code to the number. On success the number is kept in memory
  // so the verify screen (and its resend button) can use it without a URL parameter.
  const sendCode = async (rawPhone: string): Promise<Result> => {
    const phone = toE164(rawPhone)
    if (!phone) return { error: new Error('Enter a valid phone number') }

    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: { shouldCreateUser: true }, // same flow for sign-up and sign-in
    })
    if (!error) setPendingPhone(phone)
    return { error }
  }

  // Step 2: check the code against the number from step 1. On success the session
  // updates in AuthProvider and the route guard moves the user into the app.
  const verifyCode = async (token: string): Promise<Result> => {
    if (!pendingPhone) return { error: new Error('Start over and enter your number again') }
    const { error } = await supabase.auth.verifyOtp({ phone: pendingPhone, token, type: 'sms' })
    return { error }
  }

  const signOut = async (): Promise<Result> => {
    const { error } = await supabase.auth.signOut()
    setPendingPhone(null)
    return { error }
  }

  return { session, loading, pendingPhone, sendCode, verifyCode, signOut }
}