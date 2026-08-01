import type { AnalyticsEvent } from "@/lib/analytics/types";

/**
 * Dependency-inversion seam for analytics destinations.
 *
 * Implementations may write to:
 * - Console (local debugging)
 * - Internal HTTP API / custom database
 * - Google Analytics / PostHog / Mixpanel / etc.
 *
 * UI code never depends on this interface — only the analytics runtime does.
 */
export interface AnalyticsProvider {
  /** Stable id for logs and composite fan-out debugging. */
  readonly name: string;

  /**
   * Persist or forward a fully enriched event.
   * May be sync or async; failures must not throw into UI call sites.
   */
  track(event: AnalyticsEvent): void | Promise<void>;
}
