import { supabase } from '@/lib/supabase'
import { toE164 } from '@/lib/phone'

export const sendCode = async (rawPhone: string) => {
    const phone = toE164(rawPhone)
    if (!phone) return {error: new Error('Enter a valid phone number.') }
    supabase.auth.signInWithOtp({ phone, options: { shouldCreateUser : true} })
}
    

export const verifyCode = (phone: string, token: string) =>
    supabase.auth.verifyOtp({ phone, token, type: 'sms' })

export const signOut = () => supabase.auth.signOut()