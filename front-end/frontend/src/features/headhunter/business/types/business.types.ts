/**
 * Business Profile & Verification TypeScript Definitions
 * All types and interfaces for PROF-03 Epic
 */

/* ============================================
   ENUMS & UNION TYPES
   ============================================ */

export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type CompanySize = "STARTUP" | "SMALL" | "MEDIUM" | "LARGE";
export type DocumentType =
  | "business_license"
  | "tax_clearance"
  | "registration_cert"
  | "other";
export type DocumentFileType = "pdf" | "doc" | "docx" | "jpg" | "png";
export type VerificationStepStatus = "completed" | "in_progress" | "pending";
export type StrengthItemStatus = "completed" | "incomplete" | "in_progress";

/* ============================================
   CORE BUSINESS PROFILE
   ============================================ */

export interface BusinessProfile {
  id: string;
  companyName: string;
  taxId: string; // 10 or 13 digits
  companySize: CompanySize;
  website: string; // Valid URL with http/https
  headquartersAddress: string;
  verificationStatus: VerificationStatus;
  submittedAt?: string; // ISO date string
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  logoUrl?: string;
  userId: string; // Recruiter/business user ID
}

/* ============================================
   VERIFICATION & STATUS
   ============================================ */

export interface VerificationStep {
  id: string;
  label: string; // i18n key: 'submitted' | 'admin_review' | 'complete'
  status: VerificationStepStatus;
  completedAt?: string; // ISO date
  estimatedTime?: string; // e.g., "24-48 hours"
  notes?: string;
}

export interface VerificationTimeline {
  steps: VerificationStep[];
  currentStep: number;
  percentageComplete: number;
}

/* ============================================
   DOCUMENTS
   ============================================ */

export interface SubmittedDocument {
  id: string;
  filename: string;
  fileSize: number; // bytes
  fileType: DocumentFileType;
  documentType: DocumentType;
  uploadedAt: string; // ISO date
  verificationStatus: "verified" | "pending_review" | "rejected";
  rejectionReason?: string;
  businessProfileId: string;
}

/* ============================================
   PROFILE STRENGTH
   ============================================ */

export interface StrengthItem {
  id: string;
  label: string; // i18n key
  description?: string;
  completed: boolean;
  impact: number; // percentage contribution (e.g., 5, 10)
  status: StrengthItemStatus;
}

export interface ProfileStrengthData {
  percentage: number;
  items: StrengthItem[];
  nextAction?: string; // i18n key for next recommended action
  lastUpdatedAt: string;
}

/* ============================================
   FORM & VALIDATION
   ============================================ */

export interface BusinessFormData {
  companyName: string;
  taxId: string;
  companySize: CompanySize;
  website: string;
  headquartersAddress: string;
}

export interface BusinessFormErrors {
  companyName?: string;
  taxId?: string;
  companySize?: string;
  website?: string;
  headquartersAddress?: string;
  [key: string]: string | undefined; // Allow dynamic error keys
}

export interface FormValidationResults {
  isValid: boolean;
  errors: BusinessFormErrors;
  touchedFields: Set<keyof BusinessFormData>;
}

/* ============================================
   API RESPONSES
   ============================================ */

export interface SubmitProfileResponse {
  success: boolean;
  message: string;
  profile?: BusinessProfile;
  verificationSteps?: VerificationStep[];
  error?: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

export interface GetProfileStatusResponse {
  profile: BusinessProfile;
  verificationSteps: VerificationStep[];
  documents: SubmittedDocument[];
  profileStrength: ProfileStrengthData;
}

export interface ValidateFieldResponse {
  valid: boolean;
  error?: string;
  suggestions?: string[];
}

/* ============================================
   STATE MANAGEMENT
   ============================================ */

export interface BusinessProfileState {
  // Profile data
  profile: BusinessProfile | null;
  documents: SubmittedDocument[];
  verificationSteps: VerificationStep[];
  profileStrength: ProfileStrengthData | null;

  // Form state
  formData: BusinessFormData;
  formErrors: BusinessFormErrors;
  touchedFields: Set<keyof BusinessFormData>;

  // UI state
  isLoading: boolean;
  isSubmitting: boolean;
  isValidating: boolean;
  successMessage?: string;
  errorMessage?: string;

  // Timestamps
  lastFetchedAt?: string;
  lastSubmittedAt?: string;
}

/* ============================================
   VALIDATION RULES
   ============================================ */

export const VALIDATION_RULES = {
  companyName: {
    minLength: 2,
    maxLength: 255,
    pattern: /^[a-zA-Z0-9\s\-&.,()]+$/, // Allow alphanumeric, spaces, and basic symbols
    required: true,
  },
  taxId: {
    pattern: /^\d{10}$|^\d{13}$/, // 10 or 13 digits only
    required: true,
  },
  website: {
    pattern: /^(https?:\/\/)/, // Must start with http:// or https://
    required: true,
  },
  headquartersAddress: {
    minLength: 10,
    maxLength: 500,
    required: true,
  },
  companySize: {
    options: ["50-100", "100-500", "500-1000", "1000+", "other"],
    required: true,
  },
} as const;

/* ============================================
   ERROR MESSAGES (i18n keys)
   ============================================ */

export const ERROR_MESSAGE_KEYS = {
  companyName: {
    required: "business.validation.company_name_required",
    minLength: "business.validation.company_name_min",
    maxLength: "business.validation.company_name_max",
    pattern: "business.validation.company_name_pattern",
  },
  taxId: {
    required: "business.validation.tax_id_required",
    pattern: "business.validation.tax_id_pattern", // "Mã số thuế phải là 10 hoặc 13 chữ số"
    invalid: "business.validation.tax_id_invalid",
  },
  website: {
    required: "business.validation.website_required",
    pattern: "business.validation.website_pattern", // "Website không hợp lệ (Missing http/https prefix)"
    invalid: "business.validation.website_invalid",
  },
  headquartersAddress: {
    required: "business.validation.address_required",
    minLength: "business.validation.address_min",
    maxLength: "business.validation.address_max",
  },
  companySize: {
    required: "business.validation.company_size_required",
  },
  submission: {
    networkError: "business.error.network",
    serverError: "business.error.server",
    validationError: "business.error.validation",
    timeoutError: "business.error.timeout",
  },
} as const;

/* ============================================
   API REQUEST/RESPONSE TYPES
   ============================================ */

export interface SubmitProfileRequest extends BusinessFormData {
  documents?: File[];
}

export interface ValidateFieldRequest {
  field: keyof BusinessFormData;
  value: string;
}

export interface ValidateFieldRequest2 {
  field: string;
  value: string | number | boolean;
}

/* ============================================
   CONSTANTS
   ============================================ */

export const COMPANY_SIZE_OPTIONS: Record<CompanySize, string> = {
  STARTUP: "business.form.size_startup",
  SMALL: "business.form.size_small",
  MEDIUM: "business.form.size_medium",
  LARGE: "business.form.size_large",
};

export const VERIFICATION_STEP_LABELS: Record<number, string> = {
  0: "business.verification.submitted",
  1: "business.verification.under_review",
  2: "business.verification.approved",
};
