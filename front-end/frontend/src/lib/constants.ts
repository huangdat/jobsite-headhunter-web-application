/**
 * API Configuration & Constants
 * ❌ NEVER hardcode URLs, endpoints, or sensitive data
 * ✅ Always use environment variables or constants here
 *
 * NOTE: For better code organization, feature-specific endpoints are defined in:
 * - src/features/auth/api/constants.ts
 * - src/features/jobs/api/constants.ts
 * - src/features/candidate/api/constants.ts
 * - src/features/headhunter/api/constants.ts
 * - src/features/collaborator/api/constants.ts
 * - src/shared/api/constants.ts
 *
 * This file maintains the full API_ENDPOINTS for backward compatibility.
 */

// API Base URLs
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8080/headhunt",
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
    GET_PROFILE: "/api/account/myInfo",
    UPDATE_PROFILE: "/api/account/myInfo",
    CHANGE_PASSWORD: "/api/account/changeMyPassword",
  },

  // Users (Admin Management)
  USERS: {
    GET_ALL: "/api/account",
    GET_BY_ID: "/api/account/{id}",
    SEARCH: "/api/account/search",
    UPDATE_STATUS: "/api/account/status/{id}",
    LOCK: "/api/account/lock/{id}",
    UNLOCK: "/api/account/unlock/{id}",
    DELETE: "/api/account/{id}",
  },

  // Jobs
  JOBS: {
    GET_SKILLS: "/api/skills",
    GET_LIST: "/api/jobs",
    GET_BY_ID: "/api/jobs/{id}",
    GET_MY_JOBS: "/api/jobs/my",
    GET_RECOMMENDED: "/api/jobs/recommended",
    GET_RANDOM_LATEST: "/api/jobs/random-latest",
    GET_SAVED: "/api/jobs/saved",
    CREATE: "/api/jobs",
    UPDATE: "/api/jobs/{id}",
    DELETE_SOFT: "/api/jobs/{id}",
    TOGGLE_STATUS: "/api/jobs/{id}/toggle-job-status",
    SAVE: "/api/jobs/{id}/save",
    REMOVE_SAVED: "/api/jobs/{id}/saved",
  },

  // Business Profiles
  BUSINESS_PROFILE: {
    GET_TOP_10: "/api/business-profile/10-best",
    GET_ALL: "/api/business-profile",
    GET_BY_ID: "/api/business-profile/{id}",
  },

  // Business Verification
  BUSINESS: {
    SUBMIT_PROFILE: "/business/profile/submit",
    GET_STATUS: "/business/profile/status",
    GET_STRENGTH: "/business/profile/strength",
    VALIDATE_FIELD: "/business/validate",
    GET_VERIFICATION_STEPS: "/business/profile/verification-steps",
    GET_DOCUMENTS: "/business/profile/documents",
    DOWNLOAD_DOCUMENT: "/business/profile/documents/{id}/download",
    DELETE_DOCUMENT: "/business/profile/documents/{id}",
    UPDATE_PROFILE: "/business/profile/update",
    GET_OPTIMIZATION_TIPS: "/business/profile/optimization-tips",
  },

  // Collaborator
  COLLABORATOR: {
    GET_COMMISSION_PROFILE: "/api/collaborators/commission/profile",
    UPDATE_COMMISSION_PROFILE: "/api/collaborators/commission/profile",
    GET_COMMISSION_STATS: "/api/collaborators/commission/stats",
    VERIFY_BANKING_INFO: "/api/collaborators/commission/verify-banking",
    REQUEST_PAYOUT: "/api/collaborators/commission/payout",
  },

  // Candidate
  CANDIDATE: {
    CV_UPLOAD: "/api/cv",
    CV_LIST: "/api/cv/myCv",
    CV_DETAIL: "/api/cv/{id}",
    CV_DOWNLOAD: "/api/cv/{id}/download",
    CV_DELETE: "/api/cv/{id}",
    CV_MAKE_ACTIVE: "/api/cv/MyCv",
    PROFILE_STRENGTH: "/api/candidate/profile/strength",
    PRIVACY_SETTINGS: "/api/candidate/profile/privacy",
    APPLY_JOB: "/api/jobs/{jobId}/applications",
    GET_MY_APPLICATIONS: "/api/candidates/me/applications",
  },

  // Headhunter
  HEADHUNTER: {
    GET_JOB_APPLICATIONS: "/api/headhunter/jobs/{jobId}/applications",
    GET_APPLICATION_DETAIL: "/api/headhunter/applications/{id}",
    UPDATE_APPLICATION_STATUS: "/api/headhunter/applications/{id}/status",
    SCHEDULE_INTERVIEW: "/api/headhunter/applications/{id}/interview",
  },

  // Interview
  INTERVIEW: {
    SCHEDULE: "/api/interviews",
    GET_LIST: "/api/interviews",
    GET_DETAIL: "/api/interviews/{id}",
    UPDATE: "/api/interviews/{id}",
    CANCEL: "/api/interviews/{id}/cancel",
  },

  // Forum Categories
  FORUM: {
    CATEGORIES: {
      GET_LIST: "/api/forum/categories",
      GET_BY_ID: "/api/forum/categories/{id}",
      CREATE: "/api/forum/categories",
      UPDATE: "/api/forum/categories/{id}",
      DELETE: "/api/forum/categories/{id}",
      TOGGLE_STATUS: "/api/forum/categories/{id}/toggle-status",
    },
    POSTS: {
      GET_LIST: "/api/forum/posts",
      GET_BY_ID: "/api/forum/posts/{id}",
      CREATE: "/api/forum/posts",
      UPDATE: "/api/forum/posts/{id}",
      DELETE: "/api/forum/posts/{id}",
    },
    UPLOAD_IMAGE: "/api/forum/upload-image",
  },

  // Verification (Admin)
  VERIFICATION: {
    GET_LIST: "/api/admin/verifications",
    GET_DETAIL: "/api/admin/verifications/{id}",
    APPROVE: "/api/admin/verifications/{id}/approve",
    REJECT: "/api/admin/verifications/{id}/reject",
    GET_STATS: "/api/admin/verification-stats",
    GET_EVENTS: "/api/admin/verification-events",
  },
};

// Feature Flags
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
  MAX_FILE_SIZE: 5 * 1024 * 1024,
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

// User Roles
export const USER_ROLES = {
  ADMIN: "ADMIN",
  HEADHUNTER: "HEADHUNTER",
  COLLABORATOR: "COLLABORATOR",
  CANDIDATE: "CANDIDATE",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Job Status
export const JOB_STATUSES = {
  DRAFT: "DRAFT",
  OPEN: "OPEN",
  CLOSED: "CLOSED",
} as const;

export type JobStatus = (typeof JOB_STATUSES)[keyof typeof JOB_STATUSES];

// Account Status
export const ACCOUNT_STATUSES = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  DELETED: "DELETED",
} as const;

export type AccountStatus =
  (typeof ACCOUNT_STATUSES)[keyof typeof ACCOUNT_STATUSES];

// Working Type
export const WORKING_TYPES = {
  ONSITE: "ONSITE",
  REMOTE: "REMOTE",
  HYBRID: "HYBRID",
} as const;

export type WorkingType = (typeof WORKING_TYPES)[keyof typeof WORKING_TYPES];

// OAuth Provider URLs (Giữ lại từ Version 1 & 2)
export const OAUTH_URLS = {
  GOOGLE_AUTH: "https://accounts.google.com/o/oauth2/v2/auth",
  LINKEDIN_AUTH: "https://www.linkedin.com/oauth/v2/authorization",
} as const;

// Admin Features & Routes
export const ADMIN_FEATURES = {
  USERS_MANAGEMENT: "/users",
  USER_CLASSIFICATION: "/users/classification",
  USER_DETAIL: (userId: string) => `/users/${userId}`,
  ENDPOINTS: {
    SEARCH_USERS: "/api/account/search",
    LOCK_USER: (userId: string) => `/api/account/${userId}/lock`,
    UNLOCK_USER: (userId: string) => `/api/account/${userId}/unlock`,
    SOFT_DELETE_USER: (userId: string) => `/api/account/${userId}/soft-delete`,
    HARD_DELETE_USER: (userId: string) => `/api/account/${userId}`,
  },
} as const;
