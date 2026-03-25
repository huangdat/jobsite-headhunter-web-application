/**
 * API Configuration & Constants
 * ❌ NEVER hardcode URLs, endpoints, or sensitive data
 * ✅ Always use environment variables or constants here
 */

// API Base URLs
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/headhunt",
  TIMEOUT: 15000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    VALIDATE_TOKEN: "/api/auth/token-validate",
    REFRESH_TOKEN: "/api/auth/refresh-token",
    SOCIAL_CONFIG: "/api/auth/social-config",
    GOOGLE_LOGIN: "/api/auth/google/login",
    LINKEDIN_LOGIN: "/api/auth/linkedin/oauth",
    REGISTER_SOCIAL: "/api/auth/register-social",
    CHECK_EMAIL_USERNAME: "/api/account/check-email-username-exist",
  },
  
  // OTP
  OTP: {
    SEND_SIGNUP: "/api/otp/send-signup",
    VERIFY_SIGNUP: "/api/otp/verify-signup",
    SEND_FORGOT_PASSWORD: "/api/otp/send-forgot-password",
    VERIFY_AND_RESET: "/api/otp/verify-and-reset-password",
  },

  // Account
  ACCOUNT: {
    SIGNUP_CANDIDATE: "/api/account/signup-candidate",
    SIGNUP_HEADHUNTER: "/api/account/signup-headhunter",
    SIGNUP_COLLABORATOR: "/api/account/signup-collaborator",
    GET_PROFILE: "/api/account/profile",
    UPDATE_PROFILE: "/api/account/profile",
    CHANGE_PASSWORD: "/api/account/changeMyPassword",
    SEARCH: "/api/account/search", // Admin: Search/Classification - requires ADMIN role
  },

  // Jobs
  JOBS: {
    GET_RECOMMENDED: "/api/jobs/recommended",
    GET_RANDOM_LATEST: "/api/jobs/random-latest",
    GET_BY_ID: "/api/jobs/{id}",
    GET_SAVED: "/api/jobs/saved",
  },

  // Business Profiles
  BUSINESS_PROFILE: {
    GET_TOP_10: "/api/business-profile/10-best",
    GET_ALL: "/api/business-profile",
    GET_BY_ID: "/api/business-profile/{id}",
  },

  // Add more endpoints as needed
};

// Feature Flags (for A/B testing, feature toggles)
export const FEATURE_FLAGS = {
  ENABLE_SOCIAL_LOGIN: import.meta.env.VITE_ENABLE_SOCIAL_LOGIN === "true",
  ENABLE_OTP_VERIFICATION:
    import.meta.env.VITE_ENABLE_OTP_VERIFICATION === "true",
  ENABLE_2FA: import.meta.env.VITE_ENABLE_2FA === "true",
  MAINTENANCE_MODE: import.meta.env.VITE_MAINTENANCE_MODE === "true",
};

// UI Constants
export const UI_CONSTANTS = {
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  PAGINATION_SIZE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
};

// Validation Rules
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 32,
    PATTERN: /^[a-zA-Z][a-zA-Z0-9_]*$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 16,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9_]+$/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PHONE: {
    PATTERN: /^0[3-9]\d{8,9}$/,
  },
};

// User Roles - MUST match backend Role enum (UPPERCASE)
// Use types from features/users/types/user.types.ts for type safety
export const USER_ROLES = {
  ADMIN: "ADMIN",
  HEADHUNTER: "HEADHUNTER",
  COLLABORATOR: "COLLABORATOR",
  CANDIDATE: "CANDIDATE",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Job Status - MUST match backend JobStatus enum
export const JOB_STATUSES = {
  DRAFT: "DRAFT",
  OPEN: "OPEN",
  CLOSED: "CLOSED",
} as const;

export type JobStatus = (typeof JOB_STATUSES)[keyof typeof JOB_STATUSES];

// User Account Status - MUST match backend AccountStatus enum
export const ACCOUNT_STATUSES = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  DELETED: "DELETED",
} as const;

export type AccountStatus =
  (typeof ACCOUNT_STATUSES)[keyof typeof ACCOUNT_STATUSES];

// Working Type - MUST match backend WorkingType enum
export const WORKING_TYPES = {
  ONSITE: "ONSITE",
  REMOTE: "REMOTE",
  HYBRID: "HYBRID",
} as const;

export type WorkingType = (typeof WORKING_TYPES)[keyof typeof WORKING_TYPES];

// Admin Features & Routes
export const ADMIN_FEATURES = {
  // Admin Dashboard Routes
  USERS_MANAGEMENT: "/users",
  USER_CLASSIFICATION: "/users/classification",
  USER_DETAIL: (userId: string) => `/users/${userId}`,

  // Admin-only API Endpoints (require SCOPE_ADMIN authority)
  ENDPOINTS: {
    SEARCH_USERS: "/api/account/search", // Search & Classification feature
    LOCK_USER: (userId: string) => `/api/account/${userId}/lock`,
    UNLOCK_USER: (userId: string) => `/api/account/${userId}/unlock`,
    SOFT_DELETE_USER: (userId: string) => `/api/account/${userId}/soft-delete`,
    HARD_DELETE_USER: (userId: string) => `/api/account/${userId}`,
  },
} as const;
