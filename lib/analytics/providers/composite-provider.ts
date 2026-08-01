import type { AnalyticsProvider } from "@/lib/analytics/provider";
import type { AnalyticsEvent } from "@/lib/analytics/types";

/**
 * Fan-out provider — send the same event to multiple destinations
 * (e.g. Internal API + PostHog) without changing any `trackEvent()` call sites.
 */
export class CompositeAnalyticsProvider implements AnalyticsProvider {
  readonly name = "composite";

  constructor(private readonly providers: readonly AnalyticsProvider[]) {}

  async track(event: AnalyticsEvent): Promise<void> {
    const results = await Promise.allSettled(
      this.providers.map(async (provider) => {
        try {
          await provider.track(event);
        } catch (error) {
          console.error(
            `[analytics] Provider "${provider.name}" failed:`,
            error
          );
          throw error;
        }
      })
    );

    // Surface aggregate failures for diagnostics; never throw to UI callers.
    const rejected = results.filter((result) => result.status === "rejected");
    if (rejected.length > 0) {
      console.error(
        `[analytics] ${rejected.length}/${results.length} provider(s) failed for "${event.eventName}".`
      );
    }
  }
}

export function createCompositeAnalyticsProvider(
  ...providers: AnalyticsProvider[]
): CompositeAnalyticsProvider {
  return new CompositeAnalyticsProvider(providers);
}
