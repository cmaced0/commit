import { useContext } from 'react'
import { supabase } from '@/lib/supabase'
import { toE164 } from '@/utils/phone'
import { AuthContext } from './AuthProvider'

type Result = { error: Error | null }

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  const { session, loading } = ctx

  // Step 1: text a code to the number
  const sendCode = async (rawPhone: string): Promise<Result> => {
    const phone = toE164(rawPhone)
    if (!phone) return { error: new Error('Enter a valid phone number') }

    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: { shouldCreateUser: true }, // same flow for sign-up and sign-in
    })
    return { error }
  }

  // Step 2: check the code. On success the session updates in AuthProvider
  // and the route guard moves the user into the app.
  const verifyCode = async (phone: string, token: string): Promise<Result> => {
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' })
    return { error }
  }

  const signOut = async (): Promise<Result> => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return { session, loading, sendCode, verifyCode, signOut }
}