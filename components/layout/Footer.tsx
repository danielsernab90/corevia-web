import { getLocale, getTranslations } from "next-intl/server";

import { FacebookIcon } from "@/components/icons/facebook-icon";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Container } from "@/components/layout/container";
import { Divider } from "@/components/shared/divider";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { footerNav, verifiedSocialLinks } from "@/lib/navigation";
import {
  WHATSAPP_DISPLAY_NUMBER,
  buildWhatsAppLink,
} from "@/lib/whatsapp";

export async function Footer() {
  const t = await getTranslations("Footer");
  const tCommon = await getTranslations("Common");
  const tSocial = await getTranslations("Social");
  const locale = (await getLocale()) as AppLocale;
  const year = new Date().getFullYear();
  const whatsappHref = buildWhatsAppLink(locale);

  const columns = [
    {
      title: t("explore"),
      links: footerNav.company.map((item) => ({
        href: item.href,
        label: t(item.key),
      })),
    },
    {
      title: t("services"),
      links: footerNav.services.map((item) => ({
        href: item.href,
        label: t(item.key),
      })),
    },
    {
      title: t("resources"),
      links: footerNav.resources.map((item) => ({
        href: item.href,
        label: t(item.key),
      })),
    },
  ] as const;

  const socialIcon = {
    instagram: InstagramIcon,
    facebook: FacebookIcon,
  } as const;

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#07121e] pb-[env(safe-area-inset-bottom)] text-secondary-foreground">
      <Container size="xl" className="py-section-sm md:py-section">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1.85fr]">
          <div className="max-w-sm space-y-5">
            <Logo label={tCommon("brand")} surface="onDark" />
            <p className="font-sans text-caption text-[#94aab8]">
              {t("tagline")}
            </p>
            <div className="space-y-2 text-sm text-[#94aab8]">
              <p>{t("serviceArea")}</p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#94aab8] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <WhatsAppIcon className="size-4 text-[#25D366]" />
                <span>{WHATSAPP_DISPLAY_NUMBER}</span>
              </a>
            </div>
            <ul className="flex flex-wrap gap-2 pt-1">
              {verifiedSocialLinks.map((item) => {
                const Icon = socialIcon[item.key];
                return (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={tSocial(item.key)}
                      className="inline-flex size-10 items-center justify-center rounded-lg border border-white/10 text-[#b4c8d5] transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <Icon className="size-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title} className="space-y-3">
                <p className="text-caption font-semibold tracking-wide text-white uppercase">
                  {column.title}
                </p>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-9 items-center text-sm text-[#94aab8] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Divider className="my-8 border-white/10" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption text-[#718391]">
            {t("copyright", { year })}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/privacy"
              className="inline-flex min-h-9 items-center px-1 text-caption text-[#94aab8] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/terms"
              className="inline-flex min-h-9 items-center px-1 text-caption text-[#94aab8] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {t("terms")}
            </Link>
            <LanguageSwitcher surface="onDark" />
            <ThemeToggle className="border-white/20 bg-transparent text-secondary-foreground hover:bg-white/10 hover:text-secondary-foreground" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
