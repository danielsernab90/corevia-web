"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { Navigation } from "@/components/layout/Navigation";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  brandLabel: string;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const DRAWER_MS = 0.28;

/**
 * Premium right-side navigation drawer.
 * Never full-bleed — leaves page visible; responsive width via min()/clamp.
 */
export function MobileMenu({ open, onClose, brandLabel }: MobileMenuProps) {
  const t = useTranslations("Navigation");
  const tCommon = useTranslations("Common");
  const tFooter = useTranslations("Footer");
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const year = new Date().getFullYear();
  const duration = reduceMotion ? 0 : DRAWER_MS;

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  const handleBackdropClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = originalOverflow;
      previouslyFocused.current?.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 min-[1200px]:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration, ease: "easeInOut" }}
          onClick={handleBackdropClick}
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onKeyDown={handleKeyDown}
            onClick={(event) => event.stopPropagation()}
            className={cn(
              "absolute inset-y-0 right-0 flex h-dvh flex-col",
              "border-l border-border/80 bg-background/95 shadow-[-12px_0_40px_rgb(11_15_25/0.12)] backdrop-blur-xl",
              "rounded-l-2xl",
              "w-[min(85vw,340px)]",
              "md:w-[min(90vw,420px)]",
              "lg:w-[min(420px,35vw)]"
            )}
            initial={reduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduceMotion ? undefined : { x: "100%" }}
            transition={{ duration, ease: "easeInOut" }}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
              <Logo label={brandLabel} />
              <Button
                ref={closeButtonRef}
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t("closeMenu")}
                onClick={onClose}
              >
                <X />
              </Button>
            </div>

            <p id={titleId} className="sr-only">
              {t("mobileNav")}
            </p>

            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 py-6">
              <Navigation
                orientation="vertical"
                onNavigate={onClose}
                label={t("mobileNav")}
                className="w-full"
              />

              <Link
                href="/book-consultation"
                onClick={onClose}
                className={cn(
                  buttonVariants({ size: "cta" }),
                  "mt-2 w-full justify-center whitespace-normal text-center"
                )}
              >
                {t("primaryCta")}
              </Link>
            </div>

            <div className="mt-auto shrink-0 space-y-4 border-t border-border px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-caption font-medium text-muted-foreground">
                  {tCommon("language")}
                </span>
                <LanguageSwitcher />
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-caption font-medium text-muted-foreground">
                  {tCommon("theme")}
                </span>
                <ThemeToggle />
              </div>

              <p className="pt-1 text-caption text-muted-foreground">
                {tFooter("copyright", { year })}
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
