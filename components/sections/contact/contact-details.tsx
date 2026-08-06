"use client";

import { Clock3, MapPin, MessageSquare } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { FacebookIcon } from "@/components/icons/facebook-icon";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Heading } from "@/components/shared/heading";
import type { AppLocale } from "@/i18n/routing";
import { brandColors } from "@/lib/design-tokens";
import { coreviaIconProps } from "@/lib/icons";
import { cn } from "@/lib/utils";
import {
  WHATSAPP_DISPLAY_NUMBER,
  buildWhatsAppLink,
} from "@/lib/whatsapp";

const INSTAGRAM_HREF = "https://www.instagram.com/corevia_software/";
const INSTAGRAM_HANDLE = "@corevia_software";
const FACEBOOK_HREF = "https://www.facebook.com/coreviasoftware/";
const FACEBOOK_LABEL = "CoreVia";

const WHATSAPP_BRAND = "#25D366";
const INSTAGRAM_BRAND = "#C13584";
const FACEBOOK_BRAND = "#1877F2";

const textDetailItems = [
  { key: "location", Icon: MapPin },
  { key: "response", Icon: MessageSquare },
  { key: "hours", Icon: Clock3 },
] as const;

function hexToRgbChannels(hex: string): string {
  const raw = hex.replace("#", "");
  const n = Number.parseInt(raw, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** Soft ambient halo — same intensity for every badge (subtle polish, not neon). */
function badgeGlow(brandHex: string): string {
  const rgb = hexToRgbChannels(brandHex);
  // Tuned near glow-brand-soft / glow-consultation-visual, scaled for size-10 badges
  return `0 0 14px rgb(${rgb} / 0.34), 0 0 28px rgb(${rgb} / 0.18)`;
}

function infoBadgeStyle() {
  return {
    backgroundColor: brandColors.primarySoft,
    color: brandColors.primary,
    // Brand blue #1652F0 — same family as glow-brand-soft / hero glows
    boxShadow: badgeGlow(brandColors.primary),
  } as const;
}

function socialBadgeStyle(brandHex: string) {
  return {
    backgroundColor: `color-mix(in srgb, ${brandHex} 14%, white)`,
    color: brandHex,
    boxShadow: badgeGlow(brandHex),
  } as const;
}

const linkClassName =
  "mt-1 inline-block text-sm leading-relaxed text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline";

type ContactDetailsProps = {
  headingId?: string;
  className?: string;
  /** Center intro text (used on the referral page). */
  align?: "start" | "center";
};

/**
 * Shared “Get in Touch” contact info block used on Contact and Referral.
 * Copy comes from `Contact.details` so EN/ES stay in sync via locale.
 */
export function ContactDetails({
  headingId = "contact-details-heading",
  className,
  align = "start",
}: ContactDetailsProps) {
  const t = useTranslations("Contact");
  const locale = useLocale() as AppLocale;
  const whatsappHref = buildWhatsAppLink(locale);
  const centered = align === "center";

  return (
    <div className={cn(centered && "mx-auto max-w-md text-center", className)}>
      <p
        className={cn(
          "text-caption font-semibold tracking-[0.12em] text-primary uppercase",
          centered && "text-center"
        )}
      >
        {t("details.eyebrow")}
      </p>
      <Heading
        id={headingId}
        size="h2"
        align={centered ? "center" : "left"}
        className="mt-3 tracking-tight glow-text-brand-soft"
      >
        {t("details.title")}
      </Heading>
      <p
        className={cn(
          "mt-4 font-sans text-body-lg text-muted-foreground",
          !centered && "max-w-md"
        )}
      >
        {t("details.framing")}
      </p>

      <ul
        className={cn(
          "mt-8 space-y-5",
          centered && "mx-auto inline-block max-w-full text-left"
        )}
      >
        {textDetailItems.map(({ key, Icon }) => (
          <li key={key} className="flex gap-3">
            <span
              className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl"
              style={infoBadgeStyle()}
            >
              <Icon className="size-5" {...coreviaIconProps} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {t(`details.items.${key}.label`)}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {t(`details.items.${key}.value`)}
              </p>
            </div>
          </li>
        ))}

        <li className="flex gap-3">
          <span
            className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl"
            style={socialBadgeStyle(WHATSAPP_BRAND)}
          >
            <WhatsAppIcon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {t("details.items.whatsapp.label")}
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              {WHATSAPP_DISPLAY_NUMBER}
            </a>
          </div>
        </li>

        <li className="flex gap-3">
          <span
            className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl"
            style={socialBadgeStyle(INSTAGRAM_BRAND)}
          >
            <InstagramIcon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {t("details.items.instagram.label")}
            </p>
            <a
              href={INSTAGRAM_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              {INSTAGRAM_HANDLE}
            </a>
          </div>
        </li>

        <li className="flex gap-3">
          <span
            className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl"
            style={socialBadgeStyle(FACEBOOK_BRAND)}
          >
            <FacebookIcon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {t("details.items.facebook.label")}
            </p>
            <a
              href={FACEBOOK_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              {FACEBOOK_LABEL}
            </a>
          </div>
        </li>
      </ul>
    </div>
  );
}
