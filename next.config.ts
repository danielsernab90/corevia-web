import os from "node:os";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * Allow Tailscale / LAN hosts to request /_next/* during `next dev`.
 * Next.js 15 warns; Next.js 16+ blocks without this allowlist.
 */
function lanAndTailscaleDevOrigins(): string[] {
  const origins = new Set<string>();
  for (const entries of Object.values(os.networkInterfaces())) {
    for (const entry of entries ?? []) {
      if (entry.internal || entry.family !== "IPv4") continue;
      origins.add(entry.address);
    }
  }
  for (const host of process.env.ALLOWED_DEV_ORIGINS?.split(",") ?? []) {
    const trimmed = host.trim();
    if (trimmed) origins.add(trimmed);
  }
  return [...origins];
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: lanAndTailscaleDevOrigins(),
};

export default withNextIntl(nextConfig);
