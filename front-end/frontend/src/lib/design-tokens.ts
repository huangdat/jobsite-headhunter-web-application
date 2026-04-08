/**
 * Design Token Utilities
 *
 * Centralized brand color management for consistent theming.
 * Use these utilities instead of hardcoded Tailwind color classes.
 *
 * @module design-tokens
 * @see src/index.css for CSS variable definitions
 */

/**
 * Intent mapping - Define color intent to semantic meaning
 * Maps abstract intents to concrete color palettes
 */
export const intentMap = {
  primary: "brand-primary", // Main CTAs, highlights
  secondary: "slate-600", // Secondary actions
  success: "emerald-600", // Confirmations, positive feedback
  warning: "amber-600", // Alerts, cautions
  danger: "red-600", // Errors, destructive actions
  neutral: "slate-500", // Neutral text, borders
} as const;

/**
 * Dark mode pair helper
 * Combines light and dark class variants
 *
 * @example
 * getDarkPair('bg-white', 'bg-slate-900') → 'bg-white dark:bg-slate-900'
 */
export const getDarkPair = (lightClass: string, darkClass: string): string => {
  return `${lightClass} dark:${darkClass}`;
};

/**
 * Theme helpers - Common color combinations with dark mode support
 * Use these for consistent styling across light and dark modes
 */
export const themeHelpers = {
  // Base background colors
  bg: {
    light: "bg-white dark:bg-slate-900",
    lightAlt: "bg-slate-50 dark:bg-slate-900",
    card: "bg-white dark:bg-slate-800",
    hover: "hover:bg-slate-50 dark:hover:bg-slate-700",
    disabled: "bg-slate-100 dark:bg-slate-800",
  },

  // Text colors
  text: {
    primary: "text-slate-900 dark:text-slate-100",
    secondary: "text-slate-600 dark:text-slate-400",
    muted: "text-slate-500 dark:text-slate-500",
    inverse: "text-white dark:text-slate-900",
    disabled: "text-slate-400 dark:text-slate-600",
  },

  // Border colors
  border: {
    light: "border-slate-200 dark:border-slate-700",
    medium: "border-slate-300 dark:border-slate-600",
    dark: "border-slate-400 dark:border-slate-500",
  },

  // Dividers
  divider: "divide-slate-200 dark:divide-slate-700",

  // Shadow/Ring
  ring: "ring-slate-200 dark:ring-slate-700",
} as const;

/**
 * Brand color tokens
 * Based on CSS variables defined in src/index.css
 */
export const brandColors = {
  /**
   * Primary brand colors
   * Use for CTAs, highlights, and primary brand elements
   */
  primary: {
    bg: "bg-brand-primary",
    text: "text-brand-primary",
    border: "border-brand-primary",
    hover: "hover:bg-brand-hover",
    ring: "ring-brand-primary",
    // With opacity variants
    bgOpacity: (opacity: number) => `bg-brand-primary/${opacity}`,
    borderOpacity: (opacity: number) => `border-brand-primary/${opacity}`,
  },

  /**
   * Semantic success colors
   * Use for success states, confirmations, positive feedback
   * Keeps emerald for semantic meaning
   */
  success: {
    bg: "bg-emerald-50",
    bgDark: "dark:bg-emerald-900/30",
    text: "text-emerald-600",
    textDark: "dark:text-emerald-400",
    border: "border-emerald-200",
    borderDark: "dark:border-emerald-900/50",
    icon: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-500",
    ringDark: "dark:ring-emerald-400",
  },

  /**
   * Semantic warning colors
   * Use for warnings, caution states
   */
  warning: {
    bg: "bg-amber-50",
    bgDark: "dark:bg-amber-900/30",
    text: "text-amber-600",
    textDark: "dark:text-amber-400",
    border: "border-amber-200",
    borderDark: "dark:border-amber-900/50",
    icon: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-500",
    ringDark: "dark:ring-amber-400",
  },

  /**
   * Semantic error/danger colors
   * Use for errors, destructive actions
   */
  danger: {
    bg: "bg-red-50",
    bgDark: "dark:bg-red-900/30",
    text: "text-red-600",
    textDark: "dark:text-red-400",
    border: "border-red-200",
    borderDark: "dark:border-red-900/50",
    icon: "text-red-600 dark:text-red-400",
    ring: "ring-red-500",
    ringDark: "dark:ring-red-400",
  },

  /**
   * Semantic info colors
   * Use for informational messages, neutral information
   */
  info: {
    bg: "bg-blue-50",
    bgDark: "dark:bg-blue-900/20",
    text: "text-blue-600",
    textDark: "dark:text-blue-400",
    border: "border-blue-100",
    borderDark: "dark:border-blue-800",
    icon: "text-blue-600 dark:text-blue-400",
    ring: "ring-blue-500",
    ringDark: "dark:ring-blue-400",
  },
} as const;

/**
 * Get brand color class with dark mode support
 *
 * @param type - Type of style (bg, text, border)
 * @param variant - Color variant (default: 'primary')
 * @param includeDark - Include dark mode classes (default: false)
 *
 * @example
 * ```tsx
 * <button className={getBrandClass('bg')}>
 *   Primary CTA
 * </button>
 *
 * <span className={getBrandClass('text', 'primary', true)}>
 *   Brand text with dark mode
 * </span>
 * ```
 */
export const getBrandClass = (
  type: "bg" | "text" | "border" | "ring",
  variant: "primary" | "hover" = "primary",
  includeDark = false
): string => {
  if (variant === "hover") {
    return "hover:bg-brand-hover";
  }

  // eslint-disable-next-line security/detect-object-injection
  const baseClass = brandColors.primary[type];

  // Dark mode variants (if needed in future)
  if (includeDark && type === "bg") {
    return `${baseClass} dark:bg-brand-primary`;
  }

  return baseClass;
};

/**
 * Get semantic color classes
 *
 * @param semantic - Semantic meaning
 * @param type - Type of style
 * @param includeDark - Include dark mode classes
 *
 * @example
 * ```tsx
 * <div className={getSemanticClass('success', 'bg', true)}>
 *   Success message
 * </div>
 * ```
 */
export const getSemanticClass = (
  semantic: "success" | "warning" | "danger" | "info",
  type: "bg" | "text" | "border" | "icon" | "ring",
  includeDark = true
): string => {
  // eslint-disable-next-line security/detect-object-injection
  const color = brandColors[semantic];

  if (type === "bg") {
    return includeDark ? `${color.bg} ${color.bgDark || ""}`.trim() : color.bg;
  }
  if (type === "text") {
    return includeDark
      ? `${color.text} ${color.textDark || ""}`.trim()
      : color.text;
  }
  if (type === "border") {
    return includeDark
      ? `${color.border} ${color.borderDark || ""}`.trim()
      : color.border;
  }
  if (type === "icon") {
    const iconClass = (color as Record<string, string>).icon;
    return iconClass || color.text;
  }
  if (type === "ring") {
    const ringClass = (color as Record<string, string>).ring;
    return includeDark
      ? `${ringClass} ${(color as Record<string, string>).ringDark || ""}`.trim()
      : ringClass;
  }

  return "";
};

/**
 * Common button class combinations
 * Pre-built for common use cases
 */
export const buttonClasses = {
  primary: "bg-brand-primary hover:bg-brand-hover text-black font-bold",
  primaryOutline:
    "border-brand-primary text-brand-primary hover:bg-brand-primary/10",
  success: "bg-emerald-600 hover:bg-emerald-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
} as const;

/**
 * Common badge class combinations
 */
export const badgeClasses = {
  primary: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
  success:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
  warning:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
  danger:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
} as const;

/**
 * Application/Verification Status Color Tokens
 * Semantic colors for different application and verification statuses
 * Used in badges, cards, timeline, and status indicators
 */
export const statusColors = {
  /**
   * SUBMITTED status - Initial application submission
   * Visual: Amber/Warning to indicate pending review
   */
  SUBMITTED: {
    bg: "bg-amber-50",
    bgDark: "dark:bg-amber-900/30",
    text: "text-amber-700",
    textDark: "dark:text-amber-400",
    border: "border-amber-200",
    borderDark: "dark:border-amber-900/50",
  },

  /**
   * SCREENING status - Application under screening
   * Visual: Amber to indicate in-progress review
   */
  SCREENING: {
    bg: "bg-amber-50",
    bgDark: "dark:bg-amber-900/30",
    text: "text-amber-700",
    textDark: "dark:text-amber-400",
    border: "border-amber-200",
    borderDark: "dark:border-amber-900/50",
  },

  /**
   * HEADHUNTER_ACCEPTED status - Headhunter accepted the candidate
   * Visual: Amber (in-progress)
   */
  HEADHUNTER_ACCEPTED: {
    bg: "bg-amber-50",
    bgDark: "dark:bg-amber-900/30",
    text: "text-amber-700",
    textDark: "dark:text-amber-400",
    border: "border-amber-200",
    borderDark: "dark:border-amber-900/50",
  },

  /**
   * INTERVIEW status - Candidate moved to interview stage
   * Visual: Emerald bold to indicate significant progress
   */
  INTERVIEW: {
    bg: "bg-emerald-500",
    bgDark: "dark:bg-emerald-600",
    text: "text-white",
    textDark: "dark:text-emerald-100",
    border: "border-emerald-600",
    borderDark: "dark:border-emerald-700",
  },

  /**
   * PASSED/ACCEPTED status - Candidate passed or was accepted
   * Visual: Emerald success state
   */
  PASSED: {
    bg: "bg-emerald-50",
    bgDark: "dark:bg-emerald-900/30",
    text: "text-emerald-700",
    textDark: "dark:text-emerald-400",
    border: "border-emerald-200",
    borderDark: "dark:border-emerald-900/50",
  },

  /**
   * ACCEPTED alias for PASSED
   */
  ACCEPTED: {
    bg: "bg-emerald-50",
    bgDark: "dark:bg-emerald-900/30",
    text: "text-emerald-700",
    textDark: "dark:text-emerald-400",
    border: "border-emerald-200",
    borderDark: "dark:border-emerald-900/50",
  },

  /**
   * REJECTED status - Application rejected
   * Visual: Red danger state
   */
  REJECTED: {
    bg: "bg-red-100",
    bgDark: "dark:bg-red-900/40",
    text: "text-red-700",
    textDark: "dark:text-red-300",
    border: "border-red-300",
    borderDark: "dark:border-red-700",
  },

  /**
   * Default/Unknown status
   * Visual: Neutral slate
   */
  DEFAULT: {
    bg: "bg-slate-100",
    bgDark: "dark:bg-slate-800",
    text: "text-slate-600",
    textDark: "dark:text-slate-400",
    border: "border-slate-200",
    borderDark: "dark:border-slate-700",
  },
} as const;

/**
 * Pre-built status badge classes
 * Maps status to complete badge styling (bg + text + border + dark variants)
 */
export const statusBadgeClasses = {
  SUBMITTED: `${statusColors.SUBMITTED.bg} ${statusColors.SUBMITTED.bgDark} ${statusColors.SUBMITTED.text} ${statusColors.SUBMITTED.textDark} ${statusColors.SUBMITTED.border} ${statusColors.SUBMITTED.borderDark}`,
  SCREENING: `${statusColors.SCREENING.bg} ${statusColors.SCREENING.bgDark} ${statusColors.SCREENING.text} ${statusColors.SCREENING.textDark} ${statusColors.SCREENING.border} ${statusColors.SCREENING.borderDark}`,
  HEADHUNTER_ACCEPTED: `${statusColors.HEADHUNTER_ACCEPTED.bg} ${statusColors.HEADHUNTER_ACCEPTED.bgDark} ${statusColors.HEADHUNTER_ACCEPTED.text} ${statusColors.HEADHUNTER_ACCEPTED.textDark} ${statusColors.HEADHUNTER_ACCEPTED.border} ${statusColors.HEADHUNTER_ACCEPTED.borderDark}`,
  INTERVIEW: `${statusColors.INTERVIEW.bg} ${statusColors.INTERVIEW.bgDark} ${statusColors.INTERVIEW.text} ${statusColors.INTERVIEW.textDark} ${statusColors.INTERVIEW.border} ${statusColors.INTERVIEW.borderDark}`,
  PASSED: `${statusColors.PASSED.bg} ${statusColors.PASSED.bgDark} ${statusColors.PASSED.text} ${statusColors.PASSED.textDark} ${statusColors.PASSED.border} ${statusColors.PASSED.borderDark}`,
  ACCEPTED: `${statusColors.ACCEPTED.bg} ${statusColors.ACCEPTED.bgDark} ${statusColors.ACCEPTED.text} ${statusColors.ACCEPTED.textDark} ${statusColors.ACCEPTED.border} ${statusColors.ACCEPTED.borderDark}`,
  REJECTED: `${statusColors.REJECTED.bg} ${statusColors.REJECTED.bgDark} ${statusColors.REJECTED.text} ${statusColors.REJECTED.textDark} ${statusColors.REJECTED.border} ${statusColors.REJECTED.borderDark}`,
  DEFAULT: `${statusColors.DEFAULT.bg} ${statusColors.DEFAULT.bgDark} ${statusColors.DEFAULT.text} ${statusColors.DEFAULT.textDark} ${statusColors.DEFAULT.border} ${statusColors.DEFAULT.borderDark}`,
} as const;

/**
 * Get status badge classes dynamically
 *
 * Maps application/verification status to appropriate badge styling.
 * Includes full dark mode support.
 *
 * @param status - Application or verification status
 * @param fallbackType - Which style property to return if status not found ('full' | 'bg' | 'text' | 'border')
 * @returns CSS class string with light and dark mode variants
 *
 * @example
 * ```tsx
 * <Badge className={getStatusBadgeClass('PASSED')}>
 *   Application Passed
 * </Badge>
 *
 * // Get only background color
 * <div className={getStatusBadgeClass('REJECTED', 'bg')}>
 * ```
 */
export const getStatusBadgeClass = (
  status: string,
  fallbackType: "full" | "bg" | "text" | "border" = "full"
): string => {
  // Normalize status to uppercase
  const normalizedStatus = (status || "DEFAULT").toUpperCase();

  const statusColor =
    statusColors[normalizedStatus as keyof typeof statusColors];

  if (!statusColor) {
    // Fallback to DEFAULT if status not found

    const defaultColor = statusColors.DEFAULT;
    if (fallbackType === "bg") {
      return `${defaultColor.bg} ${defaultColor.bgDark}`.trim();
    }
    if (fallbackType === "text") {
      return `${defaultColor.text} ${defaultColor.textDark}`.trim();
    }
    if (fallbackType === "border") {
      return `${defaultColor.border} ${defaultColor.borderDark}`.trim();
    }
    // full
    return `${defaultColor.bg} ${defaultColor.bgDark} ${defaultColor.text} ${defaultColor.textDark} ${defaultColor.border} ${defaultColor.borderDark}`.trim();
  }

  // Return requested style type
  if (fallbackType === "bg") {
    return `${statusColor.bg} ${statusColor.bgDark}`.trim();
  }
  if (fallbackType === "text") {
    return `${statusColor.text} ${statusColor.textDark}`.trim();
  }
  if (fallbackType === "border") {
    return `${statusColor.border} ${statusColor.borderDark}`.trim();
  }

  // Return full classes (bg + text + border + dark variants)
  return `${statusColor.bg} ${statusColor.bgDark} ${statusColor.text} ${statusColor.textDark} ${statusColor.border} ${statusColor.borderDark}`.trim();
};
