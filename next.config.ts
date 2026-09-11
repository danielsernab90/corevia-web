import os from "node:os";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * Allow LAN hosts to request /_next/* during `next dev`.
 * Next.js 15 warns; Next.js 16+ blocks without this allowlist.
 */
function lanDevOrigins(): string[] {
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
  allowedDevOrigins: lanDevOrigins(),
  serverExternalPackages: ["better-sqlite3"],
  async headers() {
    return [
      {
        // Cinematic MP4/poster are the LCP interaction for first visits.
        // Long cache cuts cold-start stalls from repeated full revalidation.
        source: "/cinematic/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
