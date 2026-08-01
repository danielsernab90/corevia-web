"use client";

import { BriefcaseBusiness, CalendarCheck2, LayoutGrid } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ComponentType } from "react";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { useBooking } from "@/components/sections/book-consultation/booking-provider";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import {
  SectionReveal,
  Stagger,
  StaggerItem,
} from "@/components/shared/motion";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { brandColors } from "@/lib/design-tokens";
import { coreviaIconProps } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const actionKeys = ["book", "whatsapp", "services", "work"] as const;

type ActionKey = (typeof actionKeys)[number];

const actionIcons: Record<
  ActionKey,
  ComponentType<{ className?: string }>
> = {
  book: CalendarCheck2,
  whatsapp: WhatsAppIcon,
  services: LayoutGrid,
  work: BriefcaseBusiness,
};

export function EmpezarActions() {
  const t = useTranslations("Empezar.actions");
  const locale = useLocale() as AppLocale;
  const whatsappHref = buildWhatsAppLink(locale, { intent: "card" });
  const { openBooking } = useBooking();

  return (
    <Section
      tone="surface"
      spacing="tight"
      aria-labelledby="empezar-actions-heading"
    >
      <Container size="xl">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <Heading
            id="empezar-actions-heading"
            size="h2"
            align="center"
            className="tracking-tight glow-text-brand-soft"
          >
            {t("title")}
          </Heading>
          <p className="mt-4 font-sans text-body-lg text-muted-foreground">
            {t("description")}
          </p>
        </SectionReveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:gap-8">
          {actionKeys.map((key) => {
            const Icon = actionIcons[key];
            const title = t(`items.${key}.title`);
            const description = t(`items.${key}.description`);
            const isPrimary = key === "book";

            const className = cn(
              "group flex h-full flex-col rounded-2xl border p-6 text-left transition-[border-color,background-color,box-shadow,transform] duration-200 sm:p-7",
              "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              isPrimary
                ? "border-primary/25 bg-card shadow-[0_0_28px_rgb(22_82_240/0.14)] hover:border-primary/40"
                : "border-border bg-card hover:border-primary/25 hover:bg-background"
            );

            const content = (
              <>
                <span
                  className="inline-flex size-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: brandColors.primarySoft,
                    color: brandColors.primary,
                  }}
                >
                  {key === "whatsapp" ? (
                    <WhatsAppIcon className="size-5" />
                  ) : (
                    <Icon className="size-5" {...coreviaIconProps} />
                  )}
                </span>
                <h3 className="mt-5 font-sans text-lg font-semibold tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </>
            );

            return (
              <StaggerItem key={key}>
                {key === "book" ? (
                  <button
                    type="button"
                    onClick={openBooking}
                    className={cn(className, "w-full cursor-pointer")}
                  >
                    {content}
                  </button>
                ) : key === "whatsapp" ? (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    href={key === "services" ? "/services" : "/work"}
                    className={className}
                  >
                    {content}
                  </Link>
                )}
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </Section>
  );
}
