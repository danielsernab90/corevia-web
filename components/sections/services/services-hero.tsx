"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function ServicesHero() {
  const t = useTranslations("Services.hero");
  const locale = useLocale() as AppLocale;
  const whatsappHref = buildWhatsAppLink(locale);
  const reduceMotion = useReducedMotion();

  const scrollToInquiry = () => {
    document
      .getElementById("services-inquiry")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Section
      tone="dark"
      spacing="none"
      aria-labelledby="services-hero-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,#13334a_0%,transparent_40%),linear-gradient(145deg,#07121e,#10283b)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_55%)]"
      />

      <Container
        size="xl"
        className="relative flex min-h-[min(72dvh,38rem)] flex-col justify-center py-16 md:py-20"
      >
        <motion.div
          className="relative z-10 max-w-3xl"
          initial={reduceMotion ? "visible" : "hidden"}
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p
            variants={staggerItem}
            className="text-caption font-semibold tracking-[0.16em] text-primary uppercase"
          >
            {t("eyebrow")}
          </motion.p>
          <motion.h1
            id="services-hero-heading"
            variants={staggerItem}
            className="mt-5 font-display text-hero tracking-tight text-secondary-foreground glow-text-white-soft"
          >
            {t.rich("title", {
              accent: (chunks) => (
                <span className="text-primary">{chunks}</span>
              ),
              br: () => <br />,
            })}
          </motion.h1>
          <motion.p
            variants={staggerItem}
            className="mt-6 max-w-xl font-sans text-body-lg text-[#b3c7d5]"
          >
            {t("description")}
          </motion.p>
          <motion.p
            variants={staggerItem}
            className="mt-4 max-w-lg font-sans text-sm leading-relaxed text-[#8ea8b9]"
          >
            {t("pricingNote")}
          </motion.p>
          <motion.div
            variants={staggerItem}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <Button
              type="button"
              size="cta"
              className="w-full sm:w-auto"
              onClick={scrollToInquiry}
            >
              {t("primaryCta")}
            </Button>
            <Link
              href="/work"
              className={cn(
                buttonVariants({ variant: "outline", size: "cta" }),
                "w-full border-white/25 bg-transparent text-secondary-foreground hover:bg-white/10 hover:text-secondary-foreground sm:w-auto"
              )}
            >
              {t("secondaryCta")}
            </Link>
          </motion.div>
          <motion.a
            variants={staggerItem}
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm text-[#8ea8b9] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <WhatsAppIcon className="size-4 text-[#25D366]" />
            {t("whatsappCta")}
          </motion.a>
        </motion.div>
      </Container>
    </Section>
  );
}
