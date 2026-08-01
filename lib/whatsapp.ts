import type { AppLocale } from "@/i18n/routing";

/** Shared Corevia WhatsApp Business contact details. */

export const WHATSAPP_DISPLAY_NUMBER = "+57 324 313-5964";

/** Digits-only phone for wa.me (no spaces, plus, or dashes). */
const WHATSAPP_PHONE = "573243135964";

type WhatsAppIntent = "default" | "referral" | "card";

const WHATSAPP_PREFILL: Record<WhatsAppIntent, Record<AppLocale, string>> = {
  default: {
    en: "Hi! I'm interested in a custom software project — can we talk?",
    es: "¡Hola! Me interesa un proyecto de software personalizado — ¿podemos hablar?",
  },
  referral: {
    en: "Hi, I came from a referral and want to learn more",
    es: "Hola, vengo de una referencia y quiero saber más",
  },
  card: {
    en: "Hi! I scanned your Corevia business card and want to learn more.",
    es: "¡Hola! Escaneé su tarjeta de Corevia y quiero saber más.",
  },
};

/**
 * Locale-aware WhatsApp chat URL with a pre-filled message.
 * Pass the active site locale (`en` | `es`) from next-intl.
 */
export function buildWhatsAppLink(
  locale: AppLocale,
  options?: { intent?: WhatsAppIntent }
): string {
  const intent = options?.intent ?? "default";
  const text =
    WHATSAPP_PREFILL[intent][locale] ?? WHATSAPP_PREFILL[intent].en;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}
