/**
 * Verified CoreVia customer-facing contact numbers.
 * Do not invent office addresses or unverified channels here.
 */

export const COLOMBIA_WHATSAPP_DISPLAY = "+57 324 313-5964";
export const COLOMBIA_WHATSAPP_E164_DIGITS = "573243135964";

/** U.S. voice / contact line (click-to-call). */
export const US_PHONE_DISPLAY = "+1 470-683-2542";
export const US_PHONE_E164_DIGITS = "14706832542";

export function buildUsTelLink(): string {
  return `tel:+${US_PHONE_E164_DIGITS}`;
}
