/**
 * Utility Functions for Verification
 * PROF-05: Business Verification Admin Module
 */

import {
  VerificationStatus,
  DocumentStatus,
} from "../types/verification.types";

/**
 * Format verification status for UI display (returns i18n key)
 */
export const getVerificationStatusKey = (
  status: VerificationStatus
): string => {
  switch (status) {
    case VerificationStatus.PENDING:
      return "verification.status.pending";
    case VerificationStatus.APPROVED:
      return "verification.status.approved";
    case VerificationStatus.REJECTED:
      return "verification.status.rejected";
    default:
      return "common.unknown";
  }
};

/**
 * Get status badge color/styling class for verification
 */
export const getVerificationStatusColor = (
  status: VerificationStatus
): string => {
  switch (status) {
    case VerificationStatus.PENDING:
      return "bg-amber-100 text-amber-700 border-amber-200";
    case VerificationStatus.APPROVED:
      return "bg-green-100 text-green-700 border-green-200";
    case VerificationStatus.REJECTED:
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

/**
 * Format document status for UI display (returns i18n key)
 */
export const getDocumentStatusKey = (status: DocumentStatus): string => {
  switch (status) {
    case DocumentStatus.VERIFIED:
      return "verification.document.verified";
    case DocumentStatus.LOCKED:
      return "verification.document.locked";
    case DocumentStatus.PENDING:
      return "verification.document.pending";
    default:
      return "common.unknown";
  }
};

/**
 * Get document status icon class
 */
export const getDocumentStatusIcon = (status: DocumentStatus): string => {
  switch (status) {
    case DocumentStatus.VERIFIED:
      return "check_circle";
    case DocumentStatus.LOCKED:
      return "lock";
    case DocumentStatus.PENDING:
      return "schedule";
    default:
      return "help";
  }
};

/**
 * Get compliance score level (Low/Medium/High)
 */
export const getComplianceLevel = (score: number): string => {
  if (score >= 80) return "verification.compliance.high";
  if (score >= 50) return "verification.compliance.medium";
  return "verification.compliance.low";
};

/**
 * Get compliance score color
 */
export const getComplianceLevelColor = (score: number): string => {
  if (score >= 80) return "text-green-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
};

/**
 * Format relative time (e.g., "2 hours ago")
 * Returns simple format without i18n
 */
export const formatRelativeTime = (isoDateTime: string): string => {
  try {
    const date = new Date(isoDateTime);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  } catch {
    return isoDateTime;
  }
};

/**
 * Format date to readable format (e.g., "Oct 24, 2024")
 */
export const formatDateShort = (isoDateTime: string): string => {
  try {
    return new Date(isoDateTime).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return isoDateTime;
  }
};

/**
 * Format file size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const getSizeLabel = (index: number): string => {
    switch (index) {
      case 0:
        return "B";
      case 1:
        return "KB";
      case 2:
        return "MB";
      case 3:
        return "GB";
      case 4:
        return "TB";
      default:
        return "B";
    }
  };

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = Math.max(0, Math.min(i, 4));
  const sizeString = getSizeLabel(size);
  const value = (bytes / Math.pow(k, size)).toFixed(2);

  return value.concat(" ").concat(sizeString);
};

/**
 * Check if verification can be reapplied (after rejection with 7-day cooldown)
 */
export const canReapply = (canReapplyAt?: string): boolean => {
  if (!canReapplyAt) return false;
  return new Date() > new Date(canReapplyAt);
};

/**
 * Get days remaining until reapply is allowed
 */
export const getDaysUntilReapply = (canReapplyAt?: string): number => {
  if (!canReapplyAt) return 0;
  const now = new Date();
  const reapplyDate = new Date(canReapplyAt);
  const diffMs = reapplyDate.getTime() - now.getTime();
  return Math.ceil(diffMs / 86400000); // Convert ms to days
};
