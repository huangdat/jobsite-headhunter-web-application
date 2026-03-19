/**
 * API Endpoints Constants
 */
/**
 * API Endpoints Constants
 *
 * Sort format (for searchUsers):
 *   - Single: "name,asc"
 *   - Multiple: "name,asc;createdAt,desc"
 *   - Separator: semicolon (;)
 */
export const API_ENDPOINTS = {
  USERS: {
    BASE: "/api/account",
    GET_ALL: "/api/account",
    GET_BY_ID: (id: string) => `/api/account/${id}`,
    SEARCH: "/api/account/search",
    SOFT_DELETE: (id: string) => `/api/account/${id}/soft-delete`,
    HARD_DELETE: (id: string) => `/api/account/${id}`,
  },
};

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
