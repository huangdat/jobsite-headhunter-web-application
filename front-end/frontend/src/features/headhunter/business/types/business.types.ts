/**
 * Business Profile & Verification TypeScript Definitions
 * Updated for Read-only mode & Swagger API compatibility
 */

/* ============================================
    ENUMS & UNION TYPES
   ============================================ */

export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type CompanyScale =
  | "Startup (1-10 employees)"
  | "Small (10-50 employees)"
  | "Medium (50-200 employees)"
  | "Large (200+ employees)";

export const COMPANY_SIZE_OPTIONS: Record<string, string> = {
  STARTUP: "business.form.size_startup",
  SMALL: "business.form.size_small",
  MEDIUM: "business.form.size_medium",
  LARGE: "business.form.size_large",
};

/* ============================================
    CORE BUSINESS PROFILE (Updated to match Swagger)
   ============================================ */

export interface BusinessAccount {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  imageUrl?: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  currentTitle?: string;
  status: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BusinessProfile {
  id: number;
  companyName: string;
  taxCode: string;
  websiteUrl: string;
  addressMain: string;
  companyScale: string;
  verificationStatus: VerificationStatus;
  noteByAdmin?: string;
  accounts?: BusinessAccount[];
}

/* ============================================
    FORM TYPES & VALIDATION
   ============================================ */

export interface BusinessFormData {
  companyName: string;
  taxId: string;
  website: string;
  companySize: string;
  headquartersAddress: string;
}

export interface BusinessFormErrors extends Record<string, string | undefined> {
  companyName?: string | undefined;
  taxId?: string | undefined;
  website?: string | undefined;
  companySize?: string | undefined;
  headquartersAddress?: string | undefined;
}

export const ERROR_MESSAGE_KEYS = {
  companyName: {
    required: "business.form.errors.companyName.required",
    minLength: "business.form.errors.companyName.minLength",
    maxLength: "business.form.errors.companyName.maxLength",
    pattern: "business.form.errors.companyName.pattern",
  },
  taxId: {
    required: "business.form.errors.taxId.required",
    pattern: "business.form.errors.taxId.pattern",
    invalid: "business.form.errors.taxId.invalid",
  },
  website: {
    required: "business.form.errors.website.required",
    invalid: "business.form.errors.website.invalid",
    minLength: "business.form.errors.website.minLength",
    pattern: "business.form.errors.website.pattern",
  },
  companySize: {
    required: "business.form.errors.companySize.required",
  },
  headquartersAddress: {
    required: "business.form.errors.headquartersAddress.required",
    minLength: "business.form.errors.headquartersAddress.minLength",
    maxLength: "business.form.errors.headquartersAddress.maxLength",
  },
} as const;

/* ============================================
    PROFILE STRENGTH (Giữ lại để hiển thị dashboard)
   ============================================ */

export type StrengthItemStatus = "completed" | "in_progress" | "incomplete";

export interface StrengthItem {
  id: string;
  label: string; // i18n key
  description?: string; // i18n key
  completed: boolean;
  status?: StrengthItemStatus;
  impact: number;
}

export interface ProfileStrengthData {
  percentage: number;
  items: StrengthItem[];
  lastUpdatedAt: string;
  nextAction?: string; // i18n key
}

/**
 * Submitted document (for business verification/profile)
 */
export interface SubmittedDocument {
  id: string;
  fileName?: string;
  filename?: string; // Alias for fileName
  fileUrl: string;
  fileSize: number; // bytes
  mimeType: string;
  category?: string;
  documentType?: string; // "LICENSE", "TAX_CERTIFICATE", "BUSINESS_REGISTRATION", etc
  uploadedAt: string; // ISO datetime
  status?: "VERIFIED" | "PENDING" | "REJECTED";
  verificationStatus?: "verified" | "pending" | "rejected"; // Alias for status
  notes?: string;
}

/* ============================================
    STATE MANAGEMENT (Simplified for Read-only)
   ============================================ */

export interface BusinessProfileState {
  profile: BusinessProfile | null;
  profileStrength: ProfileStrengthData | null;
  isLoading: boolean;
  errorMessage?: string;
  lastFetchedAt?: string;
}

/* ============================================
    CONSTANTS
   ============================================ */

/**
 * Verification status colors
 * @deprecated Use getStatusBadgeClass() from @/lib/design-tokens instead
 * This constant is kept for backward compatibility but should not be used in new code
 *
 * Replaced by design-tokens.ts statusColors which includes dark mode support
 */
export const VERIFICATION_STATUS_COLORS: Record<VerificationStatus, string> = {
  PENDING:
    "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-900/50",
  APPROVED:
    "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-900/50",
  REJECTED:
    "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-900/50",
};
