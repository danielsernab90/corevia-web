/**
 * Core analytics domain types.
 *
 * These shapes are provider-agnostic. UI code never depends on where events
 * are stored — only on {@link trackEvent} and these shared types.
 */

/** Coarse device class used for Command Center segmentation. */
export type DeviceType = "mobile" | "tablet" | "desktop" | "unknown";

/**
 * Arbitrary structured context attached to an event.
 * Prefer stable primitive values so CRM / dashboard queries stay simple.
 */
export type AnalyticsMetadata = Record<
  string,
  string | number | boolean | null | undefined
>;

/**
 * Fully enriched analytics event — the canonical record every provider receives.
 *
 * Required dimensions:
 * - eventName / timestamp / page / language / deviceType / referrer / sessionId
 * - metadata (optional bag for event-specific fields)
 */
export type AnalyticsEvent = {
  eventName: string;
  /** ISO-8601 UTC timestamp. */
  timestamp: string;
  /** Path or logical page id (locale prefix stripped when possible). */
  page: string;
  /** Active UI language / locale (e.g. "en", "es"). */
  language: string;
  deviceType: DeviceType;
  /** document.referrer, or empty string when unavailable. */
  referrer: string;
  /** Sticky anonymous session id for funnel stitching. */
  sessionId: string;
  metadata: AnalyticsMetadata;
};

/**
 * Minimal input accepted by {@link trackEvent}.
 * Environment fields are filled automatically unless explicitly overridden.
 */
export type TrackEventInput = {
  eventName: string;
  metadata?: AnalyticsMetadata;
  /** Override auto-detected page path. */
  page?: string;
  /** Override auto-detected language / locale. */
  language?: string;
};
