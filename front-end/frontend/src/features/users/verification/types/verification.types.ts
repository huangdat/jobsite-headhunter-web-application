/**
 * Business Verification Types & Enums
 * PROF-05: Business Verification Admin Module
 */

// ============================================================================
// ENUMS (using const as const pattern for erasable syntax)
// ============================================================================

export const VerificationStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
export type VerificationStatus =
  (typeof VerificationStatus)[keyof typeof VerificationStatus];

export const DocumentStatus = {
  VERIFIED: "VERIFIED",
  LOCKED: "LOCKED",
  PENDING: "PENDING",
} as const;
export type DocumentStatus =
  (typeof DocumentStatus)[keyof typeof DocumentStatus];

export const AutomatedActionStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;
export type AutomatedActionStatus =
  (typeof AutomatedActionStatus)[keyof typeof AutomatedActionStatus];

export const AutomatedActionType = {
  CRM_ENTRY: "CRM_ENTRY",
  PORTAL_CREDENTIALS: "PORTAL_CREDENTIALS",
  SLACK_ALERT: "SLACK_ALERT",
  EMAIL_NOTIFICATION: "EMAIL_NOTIFICATION",
  SMS_NOTIFICATION: "SMS_NOTIFICATION",
} as const;
export type AutomatedActionType =
  (typeof AutomatedActionType)[keyof typeof AutomatedActionType];

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Business metadata for verification
 */
export interface Business {
  id: number;
  companyName: string;
  taxId: string;
  website?: string;
  email: string;
  phone: string;
  industry: string;
  employeeCount: number;
  yearEstablished: number;
  description?: string;
  logoUrl?: string;
  hq?: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
}

/**
 * Document submitted as part of verification
 */
export interface Document {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number; // bytes
  mimeType: string;
  category: string; // "LICENSE", "TAX_CERTIFICATE", "BUSINESS_REGISTRATION", etc
  status: DocumentStatus;
  uploadedAt: string; // ISO datetime
  verifiedAt?: string; // ISO datetime
  verifiedBy?: string; // Officer ID/name
  notes?: string;
}

/**
 * Timeline event for audit trail
 */
export interface TimelineEvent {
  id: number;
  eventType: string; // "SUBMITTED", "REVIEWED", "APPROVED", "REJECTED"
  timestamp: string; // ISO datetime
  actor?: string; // Officer name/ID
  actorRole?: string; // "ADMIN", "REVIEWER", "SYSTEM"
  description: string;
  metadata?: Record<string, string | number | boolean>; // Additional context
}

/**
 * Verification checklist item
 */
export interface ChecklistItem {
  id: number;
  title: string; // i18n key
  description?: string; // i18n key
  isCompleted: boolean;
  completedAt?: string; // ISO datetime
  completedBy?: string; // Officer name/ID
  order: number; // Display order
}

/**
 * Automated action executed during verification
 */
export interface AutomatedAction {
  id: number;
  type: AutomatedActionType;
  status: AutomatedActionStatus;
  initiatedAt: string; // ISO datetime
  completedAt?: string; // ISO datetime
  errorMessage?: string;
  metadata?: Record<string, string | number | boolean>; // Action-specific data
}

/**
 * Complete verification record
 */
export interface Verification {
  id: number;
  business: Business;
  status: VerificationStatus;
  submittedAt: string; // ISO datetime
  submittedBy: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  documents: Document[];
  timeline: TimelineEvent[];
  checklist: ChecklistItem[];
  automatedActions: AutomatedAction[];
  complianceScore: number; // 0-100
  approvedAt?: string; // ISO datetime
  approvedBy?: {
    id: string;
    name: string;
    email: string;
    avatarRole: string; // e.g., "Senior Verification Officer"
  };
  rejectedAt?: string; // ISO datetime
  rejectedBy?: string; // Officer name/ID
  rejectionReason?: string;
  canReapplyAt?: string; // ISO datetime (7 days after rejection)
  notes?: string[];
}

/**
 * Verification statistics for dashboard KPIs
 */
export interface VerificationStats {
  totalSubmitted: number;
  totalApproved: number;
  totalRejected: number;
  currentPending: number;
  approvalRate: number; // 0-100 percentage
  avgComplianceScore: number; // 0-100
  averageProcessingTimeHours: number;
}

/**
 * Recent activity event
 */
export interface RecentEvent {
  id: number;
  businessName: string;
  businessId: number;
  action: string; // "APPROVED", "REJECTED", "SUBMITTED"
  actor?: string; // Officer name
  timestamp: string; // ISO datetime
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Pagination wrapper for list responses
 */
export interface PaginatedVerifications {
  content: Verification[];
  number: number; // Current page (0-indexed)
  size: number; // Page size
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

/**
 * Request payload for approving a verification
 */
export interface ApprovalRequest {
  notes?: string;
}

/**
 * Request payload for rejecting a verification
 */
export interface RejectionRequest {
  reason: string; // 20-500 characters
  notes?: string;
}

/**
 * Filters for verification list queries
 */
export interface VerificationFilters {
  status?: VerificationStatus;
  minComplianceScore?: number;
  maxComplianceScore?: number;
  industry?: string;
  submittedAfter?: string; // ISO date
  submittedBefore?: string; // ISO date
  search?: string; // Search by company name or tax ID
  sortBy?: "submittedAt" | "complianceScore" | "name"; // Sort field
  sortOrder?: "asc" | "desc";
  page?: number; // 0-indexed
  size?: number; // Page size
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  result: T;
  timestamp: string;
  status: number;
}
