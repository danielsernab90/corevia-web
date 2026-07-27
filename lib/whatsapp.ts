import type { AppLocale } from "@/i18n/routing";

/** Shared Corevia WhatsApp Business contact details. */

export const WHATSAPP_DISPLAY_NUMBER = "+57 324 313-5964";

/** Digits-only phone for wa.me (no spaces, plus, or dashes). */
const WHATSAPP_PHONE = "573243135964";

const WHATSAPP_PREFILL: Record<AppLocale, string> = {
  en: "Hi! I'm interested in a custom software project — can we talk?",
  es: "¡Hola! Me interesa un proyecto de software personalizado — ¿podemos hablar?",
};

/**
 * Locale-aware WhatsApp chat URL with a pre-filled message.
 * Pass the active site locale (`en` | `es`) from next-intl.
 */
export function buildWhatsAppLink(locale: AppLocale): string {
  const text = WHATSAPP_PREFILL[locale] ?? WHATSAPP_PREFILL.en;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}
