/**
 * Users List feature constants - Configuration and styling
 * Translation messages are now managed via i18n (useUsersTranslation)
 * Status and Role labels should be retrieved via i18n hooks
 */

// Backend enum values - MUST match backend Role enum
export const USERS_LIST_ROLE_VALUES = [
  "ADMIN",
  "HEADHUNTER",
  "COLLABORATOR",
  "CANDIDATE",
] as const;

// Backend enum values - MUST match backend AccountStatus enum
export const USERS_LIST_STATUS_VALUES = [
  "PENDING",
  "ACTIVE",
  "SUSPENDED",
  "DELETED",
] as const;

export const USERS_LIST_STATUS_COLORS = {
  PENDING: {
    dot: "bg-yellow-400",
    text: "text-yellow-600",
  },
  ACTIVE: {
    dot: "bg-primary",
    text: "text-primary",
  },
  SUSPENDED: {
    dot: "bg-red-400",
    text: "text-red-600",
  },
  DELETED: {
    dot: "bg-slate-400",
    text: "text-slate-600",
  },
} as const;

export const USERS_LIST_PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 25, 50],
} as const;
