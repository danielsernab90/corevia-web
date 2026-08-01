import type { AnalyticsProvider } from "@/lib/analytics/provider";
import type { AnalyticsEvent } from "@/lib/analytics/types";

/**
 * Development / debugging provider. Logs enriched events to the browser console.
 * Swap out via {@link configureAnalytics} — UI code never imports this class.
 */
export class ConsoleAnalyticsProvider implements AnalyticsProvider {
  readonly name = "console";

  track(event: AnalyticsEvent): void {
    // Group keeps noisy metadata collapsed while still inspectable.
    console.info(`[analytics:${event.eventName}]`, event);
  }
}

export const consoleAnalyticsProvider = new ConsoleAnalyticsProvider();
