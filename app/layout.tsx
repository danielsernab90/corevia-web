import type { ReactNode } from "react";

type RootLayoutProps = {
  children: ReactNode;
};

/**
 * Root layout is intentionally passthrough.
 * Locale-aware `<html>` / `<body>` live in `app/[locale]/layout.tsx`.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return children;
}
