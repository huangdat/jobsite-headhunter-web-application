/**
 * Centralized Enum Definitions
 * All enums here match EXACTLY with backend enum values from Java
 * Source: backend/src/main/java/com/rikkeisoft/backend/enums/
 */

// =============================================================================
// USER & ACCOUNT ENUMS
// =============================================================================

/**
 * User role classification
 * Maps to: Role.java
 */
export const USER_ROLE = {
  ADMIN: "ADMIN",
  HEADHUNTER: "HEADHUNTER",
  COLLABORATOR: "COLLABORATOR",
  CANDIDATE: "CANDIDATE",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

/**
 * Account status in the system
 * Maps to: AccountStatus.java
 */
export const ACCOUNT_STATUS = {
  PENDING: "PENDING", // Account created, awaiting activation
  ACTIVE: "ACTIVE", // Active account
  SUSPENDED: "SUSPENDED", // Temporarily suspended
  DELETED: "DELETED", // Deleted account
} as const;

export type AccountStatus =
  (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];

/**
 * Authentication provider
 * Maps to: AuthProvider.java
 */
export const AUTH_PROVIDER = {
  LOCAL: "LOCAL",
  GOOGLE: "GOOGLE",
  GITHUB: "GITHUB",
  FACEBOOK: "FACEBOOK",
} as const;

export type AuthProvider = (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];

/**
 * User gender
 * Maps to: Gender.java
 */
export const GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

// =============================================================================
// JOB RELATED ENUMS
// =============================================================================

/**
 * Job posting status lifecycle
 * Maps to: JobStatus.java
 */
export const JOB_STATUS = {
  DRAFT: "DRAFT",
  OPEN: "OPEN",
  CLOSED: "CLOSED",
} as const;

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];

/**
 * Employment arrangement type
 * Maps to: WorkingType.java
 */
export const WORKING_TYPE = {
  ONSITE: "ONSITE",
  REMOTE: "REMOTE",
  HYBRID: "HYBRID",
} as const;

export type WorkingType = (typeof WORKING_TYPE)[keyof typeof WORKING_TYPE];

/**
 * Candidate experience level classification
 * Maps to: RankLevel.java
 */
export const RANK_LEVEL = {
  INTERN: "INTERN",
  FRESHER: "FRESHER",
  JUNIOR: "JUNIOR",
  MIDDLE: "MIDDLE",
  SENIOR: "SENIOR",
  LEADER: "LEADER",
  MANAGER: "MANAGER",
} as const;

export type RankLevel = (typeof RANK_LEVEL)[keyof typeof RANK_LEVEL];

/**
 * Company size classification
 * Maps to: CompanyScale.java
 */
export const COMPANY_SCALE = {
  STARTUP: "STARTUP",
  SMALL: "SMALL",
  MEDIUM: "MEDIUM",
  LARGE: "LARGE",
} as const;

export type CompanyScale = (typeof COMPANY_SCALE)[keyof typeof COMPANY_SCALE];

// =============================================================================
// APPLICATION & INTERVIEW ENUMS
// =============================================================================

/**
 * Application status in recruitment pipeline
 * Maps to: ApplicationStatus.java
 */
export const APPLICATION_STATUS = {
  APPLIED: "APPLIED", // Newly applied
  SCREENING: "SCREENING", // Under review
  INTERVIEW: "INTERVIEW", // Interview scheduled
  PASSED: "PASSED", // Hired/Passed
  REJECTED: "REJECTED", // Rejected
  CANCELLED: "CANCELLED", // Cancelled by the candidate
} as const;

export type ApplicationStatus =
  (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];

/**
 * Interview status
 * Maps to: InterviewStatus.java
 * NOTE: Backend uses DONE, not COMPLETED
 */
export const INTERVIEW_STATUS = {
  SCHEDULED: "SCHEDULED",
  DONE: "DONE", // Completed interview
  CANCELLED: "CANCELLED",
} as const;

export type InterviewStatus =
  (typeof INTERVIEW_STATUS)[keyof typeof INTERVIEW_STATUS];

/**
 * Interview type/format
 * Maps to: InterviewType.java
 */
export const INTERVIEW_TYPE = {
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
} as const;

export type InterviewType =
  (typeof INTERVIEW_TYPE)[keyof typeof INTERVIEW_TYPE];

/**
 * Application action type for audit trail
 * Maps to: ApplicationAction.java
 */
export const APPLICATION_ACTION = {
  APPLIED: "APPLIED",
  SCREENED: "SCREENED",
  SCHEDULED_INTERVIEW: "SCHEDULED_INTERVIEW",
  PASSED: "PASSED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
} as const;

export type ApplicationAction =
  (typeof APPLICATION_ACTION)[keyof typeof APPLICATION_ACTION];

/**
 * Commission status
 * Maps to: CommissionStatus.java
 */
export const COMMISSION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  PAID: "PAID",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
} as const;

export type CommissionStatus =
  (typeof COMMISSION_STATUS)[keyof typeof COMMISSION_STATUS];

// =============================================================================
// FORUM & CONTENT ENUMS
// =============================================================================

/**
 * Forum post status
 * Maps to: PostStatus.java
 */
export const POST_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];

/**
 * Reaction type for posts and comments (LinkedIn-style)
 * Maps to: ReactionType.java
 */
export const REACTION_TYPE = {
  LIKE: "LIKE", // Standard thumbs-up approval
  HAHA: "HAHA", // Finding content funny
  CLAP: "CLAP", // Applauding effort
  FLOWER: "FLOWER", // Appreciation/congratulations
  LOVE: "LOVE", // Deep appreciation
  SAD: "SAD", // Expressing sympathy
  ANGRY: "ANGRY", // Expressing displeasure
  WOW: "WOW", // Expressing surprise/admiration
} as const;

export type ReactionType = (typeof REACTION_TYPE)[keyof typeof REACTION_TYPE];

// =============================================================================
// SKILL & CATEGORY ENUMS
// =============================================================================

/**
 * Skill category classification
 * Maps to: SkillCategory.java
 */
export const SKILL_CATEGORY = {
  PROGRAMMING_LANGUAGES: "PROGRAMMING_LANGUAGES",
  FRONTEND_DEVELOPMENT: "FRONTEND_DEVELOPMENT",
  BACKEND_DEVELOPMENT: "BACKEND_DEVELOPMENT",
  DATABASES: "DATABASES",
  DEVOPS_AND_CLOUD: "DEVOPS_AND_CLOUD",
  TESTING: "TESTING",
  VERSION_CONTROL: "VERSION_CONTROL",
  SOFTWARE_ARCHITECTURE_AND_CONCEPTS: "SOFTWARE_ARCHITECTURE_AND_CONCEPTS",
  DATA_AND_AI: "DATA_AND_AI",
} as const;

export type SkillCategory =
  (typeof SKILL_CATEGORY)[keyof typeof SKILL_CATEGORY];

/**
 * Skill proficiency level
 * Note: This may be inferred from backend usage, adjust as needed
 */
export const SKILL_LEVEL = {
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED",
  EXPERT: "EXPERT",
} as const;

export type SkillLevel = (typeof SKILL_LEVEL)[keyof typeof SKILL_LEVEL];

// =============================================================================
// FINANCIAL ENUMS
// =============================================================================

/**
 * Supported currencies
 * Maps to: Currency.java
 */
export const CURRENCY = {
  VND: "VND", // Vietnamese Dong
  USD: "USD", // United States Dollar
} as const;

export type Currency = (typeof CURRENCY)[keyof typeof CURRENCY];

/**
 * Payment/Transaction status
 */
export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

// =============================================================================
// SORTING ENUMS
// =============================================================================

/**
 * Sort direction
 * Maps to: SortDirection.java
 */
export const SORT_DIRECTION = {
  ASC: "ASC",
  DESC: "DESC",
} as const;

export type SortDirection =
  (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION];

/**
 * Application sort fields
 * Maps to: ApplicationSortField.java
 */
export const APPLICATION_SORT_FIELD = {
  CREATED_AT: "CREATED_AT",
  UPDATED_AT: "UPDATED_AT",
  STATUS: "STATUS",
} as const;

export type ApplicationSortField =
  (typeof APPLICATION_SORT_FIELD)[keyof typeof APPLICATION_SORT_FIELD];

// =============================================================================
// OTP & VERIFICATION ENUMS
// =============================================================================

/**
 * OTP token type
 * Maps to: OtpTokenType.java
 */
export const OTP_TOKEN_TYPE = {
  EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
  PASSWORD_RESET: "PASSWORD_RESET",
} as const;

export type OtpTokenType = (typeof OTP_TOKEN_TYPE)[keyof typeof OTP_TOKEN_TYPE];

/**
 * Verification status
 * Maps to: VerificationStatus.java
 */
export const VERIFICATION_STATUS = {
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  FAILED: "FAILED",
} as const;

export type VerificationStatus =
  (typeof VERIFICATION_STATUS)[keyof typeof VERIFICATION_STATUS];

// =============================================================================
// OTHER ENUMS
// =============================================================================

/**
 * Recommendation mode
 * Maps to: RecommendationMode.java
 */
export const RECOMMENDATION_MODE = {
  MANUAL: "MANUAL",
  AUTOMATIC: "AUTOMATIC",
} as const;

export type RecommendationMode =
  (typeof RECOMMENDATION_MODE)[keyof typeof RECOMMENDATION_MODE];

/**
 * Error codes
 * Maps to: ErrorCode.java
 */
export const ERROR_CODE = {
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  INVALID_REQUEST: "INVALID_REQUEST",
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];

/**
 * Helper function to get i18n translation key for any enum value
 * Usage: getEnumI18nKey(APPLICATION_STATUS.APPLIED)
 */
export function getEnumI18nKey(value: string): string {
  const keyMap: Record<string, string> = {
    // Gender
    MALE: "common.gender.male",
    FEMALE: "common.gender.female",
    OTHER: "common.gender.other",

    // Roles
    ADMIN: "common.roles.admin",
    HEADHUNTER: "common.roles.headhunter",
    COLLABORATOR: "common.roles.collaborator",
    CANDIDATE: "common.roles.candidate",

    // Job Status
    DRAFT: "jobs.status.draft",
    OPEN: "jobs.status.open",
    CLOSED: "jobs.status.closed",

    // Working Type
    ONSITE: "jobs.workingType.onsite",
    REMOTE: "jobs.workingType.remote",
    HYBRID: "jobs.workingType.hybrid",

    // Rank Level
    INTERN: "common.rankLevel.intern",
    FRESHER: "common.rankLevel.fresher",
    JUNIOR: "common.rankLevel.junior",
    MIDDLE: "common.rankLevel.middle",
    SENIOR: "common.rankLevel.senior",
    LEADER: "common.rankLevel.leader",
    MANAGER: "common.rankLevel.manager",

    // Application Status
    APPLIED: "applications.status.applied",
    SCREENING: "applications.status.screening",
    INTERVIEW: "applications.status.interview",
    PASSED: "applications.status.passed",
    REJECTED: "applications.status.rejected",
    CANCELLED: "applications.status.cancelled",

    // Interview Status
    SCHEDULED: "applications.interview.status.scheduled",
    DONE: "applications.interview.status.done",

    // Interview Type
    ONLINE: "applications.interview.typeOnline",
    OFFLINE: "applications.interview.typeOffline",

    // Post Status
    PUBLISHED: "forum.postStatus.published",
    ARCHIVED: "forum.postStatus.archived",

    // Reaction Type
    LIKE: "forum.reactions.like",
    HAHA: "forum.reactions.haha",
    CLAP: "forum.reactions.clap",
    FLOWER: "forum.reactions.flower",
    LOVE: "forum.reactions.love",
    SAD: "forum.reactions.sad",
    ANGRY: "forum.reactions.angry",
    WOW: "forum.reactions.wow",

    // Company Scale
    STARTUP: "common.companyScale.startup",
    SMALL: "common.companyScale.small",
    MEDIUM: "common.companyScale.medium",
    LARGE: "common.companyScale.large",

    // Account Status
    PENDING: "common.accountStatus.pending",
    ACTIVE: "common.accountStatus.active",
    SUSPENDED: "common.accountStatus.suspended",
    DELETED: "common.accountStatus.deleted",
  };

  return keyMap[value] || value;
}
