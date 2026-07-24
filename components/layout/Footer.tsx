import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Divider } from "@/components/shared/divider";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Logo } from "@/components/shared/logo";
import { Text } from "@/components/shared/text";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Link } from "@/i18n/navigation";
import { footerNav } from "@/lib/navigation";

export async function Footer() {
  const t = await getTranslations("Footer");
  const tCommon = await getTranslations("Common");
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t("company"),
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
    {
      title: t("contact"),
      links: footerNav.contact.map((item) => ({
        href: item.href,
        label: t(item.key),
      })),
    },
  ] as const;

  return (
    <footer className="mt-auto border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] text-foreground">
      <Container size="xl" className="py-section-sm md:py-section">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm space-y-4">
            <Logo label={tCommon("brand")} />
            <Text tone="muted" size="caption">
              {t("tagline")}
            </Text>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title} className="space-y-3">
                <p className="text-caption font-semibold tracking-wide text-foreground uppercase">
                  {column.title}
                </p>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-9 items-center text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
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

        <Divider className="my-8" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption text-muted-foreground">
            {t("copyright", { year })}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/privacy"
              className="inline-flex min-h-9 items-center px-1 text-caption text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/terms"
              className="inline-flex min-h-9 items-center px-1 text-caption text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {t("terms")}
            </Link>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </footer>
  );
}
