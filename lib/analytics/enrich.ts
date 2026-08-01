import {
  detectDeviceType,
  getAnalyticsLanguage,
  getAnalyticsPage,
  getAnalyticsReferrer,
} from "@/lib/analytics/context";
import { getAnalyticsSessionId } from "@/lib/analytics/session";
import type {
  AnalyticsEvent,
  AnalyticsMetadata,
  TrackEventInput,
} from "@/lib/analytics/types";

/**
 * Builds a complete {@link AnalyticsEvent} from a minimal track call.
 * Centralizes enrichment so providers never re-implement context collection.
 */
export function enrichAnalyticsEvent(input: TrackEventInput): AnalyticsEvent {
  const metadata: AnalyticsMetadata = { ...(input.metadata ?? {}) };

  return {
    eventName: input.eventName,
    timestamp: new Date().toISOString(),
    page: input.page ?? getAnalyticsPage(),
    language: input.language ?? getAnalyticsLanguage(),
    deviceType: detectDeviceType(),
    referrer: getAnalyticsReferrer(),
    sessionId: getAnalyticsSessionId(),
    metadata,
  };
}
