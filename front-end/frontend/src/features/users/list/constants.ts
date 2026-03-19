/**
 * Users List feature constants - Configuration and styling
 * Translation messages are now managed via i18n (useUsersTranslation)
 * Status and Role labels should be retrieved via i18n hooks
 */

export const USERS_LIST_STATUS_VALUES = ["Active", "Inactive"] as const;

export const USERS_LIST_STATUS_COLORS = {
  Active: {
    dot: "bg-primary",
    text: "text-primary",
  },
  Inactive: {
    dot: "bg-slate-400",
    text: "text-slate-400",
  },
} as const;

export const USERS_LIST_PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 25, 50],
} as const;

export const USERS_LIST_ROLE_VALUES = [
  "Admin",
  "Manager",
  "Editor",
  "Viewer",
] as const;

export const USERS_LIST_COMPANY_VALUES = [
  "TechFlow Inc.",
  "Lunar Creative",
  "Nexus Solutions",
] as const;
