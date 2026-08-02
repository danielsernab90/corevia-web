/**
 * Official Calendly booking event for the consultation modal embed.
 *
 * Keep this in sync with `NEXT_PUBLIC_CALENDLY_URL` in Vercel / `.env.local`.
 * The live event slug is `10-15min` (HTTP 200). The old `30min` slug 404s.
 */
export const CALENDLY_BOOKING_URL =
  "https://calendly.com/danielserna_techsolutions/10-15min";

const STALE_CALENDLY_SLUGS = ["/30min"] as const;

/**
 * URL used by the Calendly iframe embed.
 * Prefers `NEXT_PUBLIC_CALENDLY_URL` when it points at a live event; otherwise
 * falls back to {@link CALENDLY_BOOKING_URL} so a stale Vercel env cannot
 * break production (e.g. leftover `…/30min`).
 */
export function getCalendlyBookingUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() ?? "";
  if (!fromEnv) return CALENDLY_BOOKING_URL;

  try {
    const pathname = new URL(fromEnv).pathname.replace(/\/$/, "");
    if (STALE_CALENDLY_SLUGS.some((slug) => pathname.endsWith(slug))) {
      return CALENDLY_BOOKING_URL;
    }
  } catch {
    return CALENDLY_BOOKING_URL;
  }

  return fromEnv;
}
