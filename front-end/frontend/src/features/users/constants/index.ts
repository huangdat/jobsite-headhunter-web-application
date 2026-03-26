/**
 * API Endpoints Constants
 *
 * Import from main lib/constants for consistency
 */
export { API_ENDPOINTS } from "@/lib/constants";

/**
 * Account Status Enum
 * Maps to backend AccountStatus: PENDING, ACTIVE, SUSPENDED, DELETED
 */
export const ACCOUNT_STATUS = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED", // Soft Delete: Lock account, keep data
  DELETED: "DELETED", // Hard Delete: Permanently remove from DB
  PENDING: "PENDING",
} as const;

export type AccountStatus =
  (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  USER_ID: "userId",
  AUTH_TOKEN: "accessToken",
};

/**
 * Route Paths
 */
export const ROUTES = {
  USERS_LIST: "/users",
  USER_DETAIL: (id: string) => `/users/${id}`,
  DASHBOARD: "/",
};

/**
 * Delete Action Types
 */
export const DELETE_TYPES = {
  SOFT: "soft",
  HARD: "hard",
} as const;

/**
 * Audit Log Types
 */
export const AUDIT_LOG_ACTIONS = {
  SOFT_DELETE: "SOFT_DELETE",
  HARD_DELETE: "HARD_DELETE",
  LOCK_USER: "LOCK_USER",
  UNLOCK_USER: "UNLOCK_USER",
};

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

/**
 * Error Codes
 */
export const ERROR_CODES = {
  USER_HAS_RELATED_DATA: "USER_HAS_RELATED_DATA",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  SERVER_ERROR: "SERVER_ERROR",
  CANNOT_LOCK_YOURSELF: "CANNOT_LOCK_YOURSELF",
  INSUFFICIENT_PERMISSION: "INSUFFICIENT_PERMISSION",
};

/**
 * Toast Message Duration (ms)
 */
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
};

/**
 * Debounce Delay (ms)
 */
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
};

/**
 * Redirect Delay (ms)
 */
export const REDIRECT_DELAY = {
  IMMEDIATE: 0,
  SHORT: 1500,
  MEDIUM: 2000,
  LONG: 3000,
};
