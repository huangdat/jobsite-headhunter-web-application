/**
 * API Configuration & Constants
 * ❌ NEVER hardcode URLs, endpoints, or sensitive data
 * ✅ Always use environment variables or constants here
 */

// API Base URLs
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  TIMEOUT: 15000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    VALIDATE_TOKEN: "/auth/token-validate",
    REFRESH_TOKEN: "/auth/refresh-token",
  },
  
  // OTP
  OTP: {
    SEND_SIGNUP: "/otp/send-signup",
    VERIFY_SIGNUP: "/otp/verify-signup",
    SEND_RESET: "/otp/send-reset",
    VERIFY_RESET: "/otp/verify-reset",
  },

  // Account
  ACCOUNT: {
    SIGNUP_CANDIDATE: "/account/signup-candidate",
    SIGNUP_HEADHUNTER: "/account/signup-headhunter",
    SIGNUP_COLLABORATOR: "/account/signup-collaborator",
    GET_PROFILE: "/account/profile",
    UPDATE_PROFILE: "/account/profile",
    CHANGE_PASSWORD: "/account/changeMyPassword",
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

// User Roles
export const USER_ROLES = {
  CANDIDATE: "candidate",
  HEADHUNTER: "headhunter",
  COLLABORATOR: "collaborator",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
