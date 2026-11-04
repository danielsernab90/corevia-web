"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";

import { MobileMenu } from "@/components/layout/MobileMenu";
import { Navigation } from "@/components/layout/Navigation";
import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { requestOpenBooking } from "@/lib/booking-events";
import { cn } from "@/lib/utils";

/** Full top-nav from this width up — collapses earlier under browser zoom. */
const DESKTOP_NAV_MQ = "(min-width: 1200px)";

export function Header() {
  const t = useTranslations("Navigation");
  const tCommon = useTranslations("Common");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const onBookConsultationPage = pathname === "/book-consultation";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_NAV_MQ);

    const syncDesktop = () => {
      if (media.matches) {
        setMenuOpen(false);
      }
    };

    syncDesktop();
    media.addEventListener("change", syncDesktop);
    return () => media.removeEventListener("change", syncDesktop);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b border-white/10 pt-[env(safe-area-inset-top)] text-secondary-foreground transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-[var(--ease-out-soft)]",
          scrolled
            ? "bg-[#07121e]/90 shadow-[0_8px_32px_rgb(7_18_30/0.35)] backdrop-blur-xl"
            : "bg-[#07121e]/95 backdrop-blur-xl"
        )}
      >
        <Container
          size="xl"
          className="grid h-16 min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:gap-4 min-[1200px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
        >
          <div className="min-w-0 justify-self-start">
            <Logo label={tCommon("brand")} priority surface="onDark" />
          </div>

          <Navigation
            surface="onDark"
            className="hidden justify-self-center min-[1200px]:block"
          />

          <div className="flex min-w-0 items-center justify-end gap-1.5 justify-self-end sm:gap-2">
            <div className="hidden items-center gap-1.5 min-[1200px]:flex">
              <LanguageSwitcher surface="onDark" />
              <ThemeToggle className="border-white/20 bg-transparent text-secondary-foreground hover:bg-white/10 hover:text-secondary-foreground" />
            </div>

            {onBookConsultationPage ? (
              <Button
                type="button"
                size="sm"
                className="hidden min-[1200px]:inline-flex"
                onClick={requestOpenBooking}
              >
                {t("primaryCta")}
              </Button>
            ) : (
              <Link
                href="/book-consultation"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "hidden min-[1200px]:inline-flex"
                )}
              >
                {t("primaryCta")}
              </Link>
            )}

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="border-white/20 bg-transparent text-secondary-foreground hover:bg-white/10 hover:text-secondary-foreground min-[1200px]:hidden"
              aria-label={t("openMenu")}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen(true)}
            >
              <Menu />
            </Button>
          </div>
        </Container>
      </header>

      <div id={menuId}>
        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          brandLabel={tCommon("brand")}
        />
      </div>
    </>
  );
}
