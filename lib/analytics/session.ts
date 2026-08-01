/**
 * Anonymous analytics session identity.
 *
 * Lives in sessionStorage so a tab session stays consistent across navigations
 * without creating a cross-device user profile. Safe no-op on the server.
 */

const SESSION_STORAGE_KEY = "corevia.analytics.sessionId";

function createSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Returns the current analytics session id, creating one when needed. */
export function getAnalyticsSessionId(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  try {
    const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;

    const next = createSessionId();
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, next);
    return next;
  } catch {
    // Private mode / blocked storage — still emit a stable-enough id for the tab.
    return createSessionId();
  }
}
