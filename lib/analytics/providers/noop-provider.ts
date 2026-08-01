import type { AnalyticsProvider } from "@/lib/analytics/provider";

/**
 * Silent sink — default production provider until a real destination is wired.
 * Satisfies the AnalyticsProvider contract without side effects.
 */
export class NoopAnalyticsProvider implements AnalyticsProvider {
  readonly name = "noop";

  track(): void {
    // Intentionally empty.
  }
}

export const noopAnalyticsProvider = new NoopAnalyticsProvider();
