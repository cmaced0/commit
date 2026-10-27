import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function toE164(input: string, defaultCountry: 'US'='US') {
    const parsed = parsePhoneNumberFromString(input, defaultCountry)
    return parsed?.isValid() ? parsed.number : null
}