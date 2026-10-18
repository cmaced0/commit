import { useContext } from 'react'
import { AuthContext } from '../providers/AuthProvider'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const { session, loading } = useContext(AuthContext)
  const sendCode = (phone: string) => supabase.auth.signInWithOtp({ phone })
  const verifyCode = (phone: string, token: string) =>
    supabase.auth.verifyOtp({ phone, token, type: 'sms' })
  const signOut = () => supabase.auth.signOut()
  return { session, loading, sendCode, verifyCode, signOut }
}