"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

/**
 * Icons are driven by the `.dark` class rather than React state so the
 * pre-hydration placeholder matches the theme next-themes already applied.
 */
function ThemeIcons() {
  return (
    <>
      <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute inset-0 m-auto size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </>
  );
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const t = useTranslations("Common");
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        aria-label={t("theme")}
        disabled
        className={cn("relative", className)}
      >
        <ThemeIcons />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label={t("theme")}
            aria-haspopup="menu"
            className={cn("relative", className)}
          />
        }
      >
        <ThemeIcons />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={theme ?? "system"}
          onValueChange={setTheme}
        >
          <DropdownMenuRadioItem value="light">
            <Sun />
            {t("light")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon />
            {t("dark")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor />
            {t("system")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
