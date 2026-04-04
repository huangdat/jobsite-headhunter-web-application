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
    PROFILE STRENGTH (Giữ lại để hiển thị dashboard)
   ============================================ */

export interface StrengthItem {
  id: string;
  label: string; // i18n key
  completed: boolean;
  impact: number;
}

export interface ProfileStrengthData {
  percentage: number;
  items: StrengthItem[];
  lastUpdatedAt: string;
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

export const VERIFICATION_STATUS_COLORS: Record<VerificationStatus, string> = {
  PENDING: "text-amber-600 bg-amber-50 border-amber-200",
  APPROVED: "text-emerald-600 bg-emerald-50 border-emerald-200",
  REJECTED: "text-rose-600 bg-rose-50 border-rose-200",
};
