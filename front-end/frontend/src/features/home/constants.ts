/**
 * Home feature constants - Styling, colors, and UI configuration
 * Translation messages are now managed via i18n (useHomeTranslation)
 */

// Job type colors - Map job types to color classes
export const JOB_TYPE_COLORS = {
  "FULL-TIME": {
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  REMOTE: {
    bg: "bg-orange-100",
    text: "text-orange-600",
  },
} as const;

// Match badge colors
export const MATCH_BADGE_COLORS = {
  bg: "bg-green-100",
  text: "text-green-600",
} as const;

// Company logo colors
export const COMPANY_LOGO_COLORS = {
  gradientStart: "from-lime-400",
  gradientEnd: "to-lime-600",
  text: "text-lime-900",
} as const;

// Sizes
export const HOME_SIZES = {
  COMPANY_LOGO_WIDTH: "w-24",
  COMPANY_LOGO_HEIGHT: "h-24",
} as const;

// Icons (if used)
export const HOME_ICONS = {
  CHEVRON_RIGHT: "→",
} as const;
