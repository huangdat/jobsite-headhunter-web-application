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
    icon: "text-amber-600 dark:text-amber-400",
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
    icon: "text-red-600 dark:text-red-400",
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
  semantic: "success" | "warning" | "danger",
  type: "bg" | "text" | "border" | "icon",
  includeDark = true
): string => {
  // eslint-disable-next-line security/detect-object-injection
  const color = brandColors[semantic];

  if (!includeDark) {
    // eslint-disable-next-line security/detect-object-injection
    return color[type];
  }

  // Combine light and dark mode classes
  if (type === "bg") {
    return `${color.bg} ${color.bgDark || ""}`.trim();
  }
  if (type === "text") {
    return `${color.text} ${color.textDark || ""}`.trim();
  }
  if (type === "border") {
    return `${color.border} ${color.borderDark || ""}`.trim();
  }
  if (type === "icon") {
    return color.icon || color.text;
  }

  // eslint-disable-next-line security/detect-object-injection
  return color[type];
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
