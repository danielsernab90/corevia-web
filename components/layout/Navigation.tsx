"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { mainNavItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type NavigationProps = {
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
  className?: string;
  id?: string;
  label?: string;
  /** `onDark` for cinematic header; default for light surfaces / mobile drawer. */
  surface?: "default" | "onDark";
};

export function Navigation({
  orientation = "horizontal",
  onNavigate,
  className,
  id,
  label,
  surface = "default",
}: NavigationProps) {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const onDark = surface === "onDark";

  return (
    <nav
      id={id}
      aria-label={label ?? t("main")}
      className={cn(className)}
      data-orientation={orientation}
      data-surface={surface}
    >
      <ul
        className={cn(
          orientation === "horizontal"
            ? "flex items-center gap-0.5"
            : "flex flex-col gap-1"
        )}
      >
        {mainNavItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                onClick={onNavigate}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  orientation === "vertical" &&
                    "block rounded-lg px-3 py-2.5 text-[0.9375rem]",
                  onDark
                    ? isActive
                      ? "text-white"
                      : "text-[#b4c8d5] hover:text-white"
                    : isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  orientation === "vertical" &&
                    !onDark &&
                    "hover:bg-muted/60",
                  isActive &&
                    orientation === "vertical" &&
                    !onDark &&
                    "bg-muted/50 font-semibold",
                  isActive &&
                    orientation === "vertical" &&
                    onDark &&
                    "bg-white/10 font-semibold"
                )}
              >
                {t(item.key)}
                {isActive && orientation === "horizontal" ? (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full",
                      onDark ? "bg-primary" : "bg-primary"
                    )}
                  />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
