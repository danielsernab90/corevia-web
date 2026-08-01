import type { AnalyticsProvider } from "@/lib/analytics/provider";
import type { AnalyticsEvent } from "@/lib/analytics/types";

export type HttpAnalyticsProviderOptions = {
  /**
   * Absolute or relative endpoint that accepts POST JSON {@link AnalyticsEvent}.
   * Example: "/api/analytics" once the Internal API route exists.
   */
  endpoint: string;
  /** Optional static headers (e.g. auth) for the ingest API. */
  headers?: HeadersInit;
  /**
   * When true (default), uses `navigator.sendBeacon` when available so events
   * still flush during page unload / navigation.
   */
  useSendBeacon?: boolean;
};

/**
 * Transport provider for a Custom Database / Internal API destination.
 *
 * This does NOT create the API route — it only defines how the client will
 * forward enriched events once `/api/analytics` (or another ingest URL) exists.
 *
 * Wire it later:
 * ```ts
 * configureAnalytics(
 *   createCompositeAnalyticsProvider(
 *     new HttpAnalyticsProvider({ endpoint: "/api/analytics" }),
 *     // new PostHogAnalyticsProvider(...),
 *   )
 * );
 * ```
 */
export class HttpAnalyticsProvider implements AnalyticsProvider {
  readonly name = "http";

  private readonly endpoint: string;
  private readonly headers: HeadersInit;
  private readonly useSendBeacon: boolean;

  constructor(options: HttpAnalyticsProviderOptions) {
    this.endpoint = options.endpoint;
    this.headers = options.headers ?? { "Content-Type": "application/json" };
    this.useSendBeacon = options.useSendBeacon ?? true;
  }

  async track(event: AnalyticsEvent): Promise<void> {
    if (typeof window === "undefined") return;

    const body = JSON.stringify(event);

    if (
      this.useSendBeacon &&
      typeof navigator.sendBeacon === "function" &&
      // sendBeacon cannot set custom headers; only use it for the default JSON case.
      isDefaultJsonHeaders(this.headers)
    ) {
      const blob = new Blob([body], { type: "application/json" });
      const queued = navigator.sendBeacon(this.endpoint, blob);
      if (queued) return;
    }

    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: this.headers,
      body,
      keepalive: true,
    });

    if (!response.ok) {
      throw new Error(
        `[analytics:http] ${response.status} ${response.statusText}`
      );
    }
  }
}

function isDefaultJsonHeaders(headers: HeadersInit): boolean {
  if (headers instanceof Headers) {
    const entries = [...headers.entries()];
    return (
      entries.length === 1 &&
      entries[0]?.[0].toLowerCase() === "content-type" &&
      entries[0][1].includes("application/json")
    );
  }

  if (Array.isArray(headers)) {
    return (
      headers.length === 1 &&
      headers[0]?.[0].toLowerCase() === "content-type" &&
      String(headers[0][1]).includes("application/json")
    );
  }

  const keys = Object.keys(headers);
  if (keys.length !== 1) return false;
  const key = keys[0];
  if (!key || key.toLowerCase() !== "content-type") return false;
  return String(headers[key as keyof typeof headers]).includes(
    "application/json"
  );
}
