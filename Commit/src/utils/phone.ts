import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js'

// Returns E.164 (e.g. "+14152127777") or null if the number isn't a valid number.
// Validation is strict, so fake numbers like 555-xxx-xxxx are rejected.
export function toE164(input: string, defaultCountry: 'US' = 'US'): string | null {
  const parsed = parsePhoneNumberFromString(input, defaultCountry)
  return parsed?.isValid() ? parsed.number : null
}

// Formats a phone number as the user types: "4152127777" -> "(415) 212-7777".
// `prev` is the text before this change, used to make backspace work: without it,
// deleting a formatting character like ")" would re-format to the same text
// and the user could never delete past it.
export function formatPhoneInput(next: string, prev: string): string {
  const clean = (s: string) => s.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '')

  const prevRaw = clean(prev)
  let raw = clean(next)

  const deleting = next.length < prev.length
  if (deleting && raw === prevRaw) raw = raw.slice(0, -1)

  // US numbers: at most 11 digits (with a leading 1). International (+): E.164 max of 15.
  raw = raw.slice(0, raw.startsWith('+') ? 16 : 11)

  return new AsYouType('US').input(raw)
}