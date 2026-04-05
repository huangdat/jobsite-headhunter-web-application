/**
 * Custom Hooks for Business Verification
 * PROF-05: Business Verification Admin Module
 *
 * Hooks are organized by domain:
 * - useVerifications: List queries and pagination
 * - useVerificationDetail: Single verification detail with approval/rejection
 * - useVerificationStats: KPI statistics and metrics
 * - useRecentEvents: Recent activity/events feed
 */

// These will be created in Phase 2 (Custom Hooks)
// Placeholder exports for type safety

export type { UseVerificationsReturn } from "./useVerifications";
export { useVerifications } from "./useVerifications";

export type { UseVerificationDetailReturn } from "./useVerificationDetail";
export { useVerificationDetail } from "./useVerificationDetail";

export type { UseVerificationStatsReturn } from "./useVerificationStats";
export { useVerificationStats } from "./useVerificationStats";

export type { UseRecentEventsReturn } from "./useRecentEvents";
export { useRecentEvents } from "./useRecentEvents";
