import { isAuthError } from '@supabase/supabase-js'

// Turns an error into something safe to show the user.
// Raw backend messages can leak details (provider names, internal limits),
// so Supabase errors are mapped to fixed, friendly text.
// Our own validation errors (plain Error objects) are already user-facing.
export function authErrorMessage(error: Error): string {
  if (!isAuthError(error)) return error.message

  const code = (error as { code?: string }).code

  switch (code) {
    case 'over_sms_send_rate_limit':
    case 'over_request_rate_limit':
      return 'Too many attempts. Please wait a minute and try again.'
    case 'otp_expired':
      return 'That code has expired. Request a new one.'
    case 'validation_failed':
    case 'sms_send_failed':
      return "We couldn't text that number. Check it and try again."
    default:
      return 'Something went wrong. Please try again.'
  }
}