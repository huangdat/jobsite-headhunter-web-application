/**
 * Business Verification Feature Index
 * PROF-05: Business Verification Admin Module
 *
 * Central export point for all verification-related types, services, hooks, and components
 */

// ============================================================================
// TYPES & ENUMS
// ============================================================================

export type {
  Business,
  Document,
  TimelineEvent,
  ChecklistItem,
  AutomatedAction,
  Verification,
  VerificationStats,
  RecentEvent,
  PaginatedVerifications,
  ApprovalRequest,
  RejectionRequest,
  VerificationFilters,
  ApiResponse,
} from "./types";

export {
  VerificationStatus,
  DocumentStatus,
  AutomatedActionStatus,
  AutomatedActionType,
} from "./types";

// ============================================================================
// SERVICES
// ============================================================================

export {
  getVerifications,
  getVerificationDetail,
  approveVerification,
  rejectVerification,
  getVerificationStats,
  getRecentEvents,
} from "./services/verificationApi";

// ============================================================================
// HOOKS
// ============================================================================

export { useVerifications } from "./hooks/useVerifications";
export type { UseVerificationsReturn } from "./hooks/useVerifications";

export { useVerificationDetail } from "./hooks/useVerificationDetail";
export type { UseVerificationDetailReturn } from "./hooks/useVerificationDetail";

export { useVerificationStats } from "./hooks/useVerificationStats";
export type { UseVerificationStatsReturn } from "./hooks/useVerificationStats";

export { useRecentEvents } from "./hooks/useRecentEvents";
export type { UseRecentEventsReturn } from "./hooks/useRecentEvents";

// ============================================================================
// UTILITIES
// ============================================================================

export {
  getVerificationStatusKey,
  getVerificationStatusColor,
  getDocumentStatusKey,
  getDocumentStatusIcon,
  getComplianceLevel,
  getComplianceLevelColor,
  formatRelativeTime,
  formatDateShort,
  formatFileSize,
  canReapply,
  getDaysUntilReapply,
} from "./utils/verificationUtils";

// ============================================================================
// COMPONENTS (Phase 3)
// ============================================================================

export { VerificationStatsCard } from "./components";
export { VerificationQueueCard } from "./components";
export { BusinessInfoCard, InfoRow } from "./components";
export { BusinessDetailView } from "./components";
export { ContactInfoCard } from "./components";
export { DocumentsList } from "./components";
export { VerificationChecklistCard } from "./components";
export { ApprovalDetailsCard } from "./components";

// ============================================================================
// PAGES (Phase 2)
// ============================================================================

export { VerificationListPage } from "./pages/VerificationListPage";
export { VerificationDetailPage } from "./pages/VerificationDetailPage";
