import type { AnalyticsEventName } from "@/lib/analytics/event-names";
import { enrichAnalyticsEvent } from "@/lib/analytics/enrich";
import type { AnalyticsProvider } from "@/lib/analytics/provider";
import { consoleAnalyticsProvider } from "@/lib/analytics/providers/console-provider";
import { noopAnalyticsProvider } from "@/lib/analytics/providers/noop-provider";
import type { AnalyticsMetadata, TrackEventInput } from "@/lib/analytics/types";

/**
 * Analytics runtime singleton.
 *
 * Components depend only on {@link trackEvent}. Destination wiring happens
 * exclusively through {@link configureAnalytics} (Open/Closed — add providers
 * without touching call sites).
 */

let activeProvider: AnalyticsProvider = createDefaultAnalyticsProvider();

/**
 * Default sink:
 * - development → console (inspect events while building)
 * - production → noop until Command Center / third-party providers are wired
 */
export function createDefaultAnalyticsProvider(): AnalyticsProvider {
  if (process.env.NODE_ENV === "development") {
    return consoleAnalyticsProvider;
  }
  return noopAnalyticsProvider;
}

/**
 * Replace the active analytics destination(s).
 *
 * Future wiring example (app bootstrap / layout effect — not UI feature code):
 * ```ts
 * import { configureAnalytics, createCompositeAnalyticsProvider } from "@/lib/analytics";
 * import { HttpAnalyticsProvider } from "@/lib/analytics/providers/http-provider";
 *
 * configureAnalytics(
 *   createCompositeAnalyticsProvider(
 *     new HttpAnalyticsProvider({ endpoint: "/api/analytics" }),
 *     // new GoogleAnalyticsProvider({ measurementId: "G-XXXX" }),
 *     // new PostHogAnalyticsProvider({ apiKey: "phc_..." }),
 *   )
 * );
 * ```
 */
export function configureAnalytics(provider: AnalyticsProvider): void {
  activeProvider = provider;
}

/** Current provider — mainly for tests / diagnostics. */
export function getAnalyticsProvider(): AnalyticsProvider {
  return activeProvider;
}

/**
 * Record a user / product event.
 *
 * This is the ONLY analytics API UI components should call.
 *
 * @example
 * ```ts
 * import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
 *
 * trackEvent(AnalyticsEvents.WHATSAPP_CLICKED, { intent: "card" });
 *
 * // Or with explicit overrides:
 * trackEvent({
 *   eventName: AnalyticsEvents.CONSULTATION_SUBMITTED,
 *   page: "/book-consultation",
 *   language: "es",
 *   metadata: { leadSource: "businessCard" },
 * });
 * ```
 */
export function trackEvent(
  eventNameOrInput: AnalyticsEventName | string | TrackEventInput,
  metadata?: AnalyticsMetadata
): void {
  // Never let analytics break product UX.
  try {
    const input = normalizeTrackInput(eventNameOrInput, metadata);
    if (!input.eventName.trim()) return;

    const event = enrichAnalyticsEvent(input);
    void Promise.resolve(activeProvider.track(event)).catch((error) => {
      console.error("[analytics] trackEvent provider failure:", error);
    });
  } catch (error) {
    console.error("[analytics] trackEvent failed:", error);
  }
}

function normalizeTrackInput(
  eventNameOrInput: AnalyticsEventName | string | TrackEventInput,
  metadata?: AnalyticsMetadata
): TrackEventInput {
  if (typeof eventNameOrInput === "string") {
    return { eventName: eventNameOrInput, metadata };
  }
  return {
    ...eventNameOrInput,
    metadata: {
      ...(eventNameOrInput.metadata ?? {}),
      ...(metadata ?? {}),
    },
  };
}
