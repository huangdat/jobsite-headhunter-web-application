/**
 * Dark Mode & Theme Utility Functions
 *
 * Helper functions for consistent dark mode implementation across components.
 * Use these instead of hardcoding Tailwind classes with dark: variants.
 *
 * @module theme-classes
 */

/**
 * Get dark mode pair of classes
 * Combines light mode class with dark mode variant
 *
 * @param lightClass - Light mode class (e.g., 'bg-white')
 * @param darkClass - Dark mode class without 'dark:' prefix (e.g., 'bg-slate-900')
 * @param opacity - Optional opacity value (0-100)
 * @returns CSS class string with dark mode support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <div className={getDarkClasses('bg-white', 'bg-slate-900')} />
 * // Output: 'bg-white dark:bg-slate-900'
 *
 * // With opacity
 * <div className={getDarkClasses('bg-white', 'bg-slate-900', 50)} />
 * // Output: 'bg-white/50 dark:bg-slate-900/50'
 * ```
 */
export const getDarkClasses = (
  lightClass: string,
  darkClass: string,
  opacity?: number
): string => {
  if (opacity !== undefined) {
    return `${lightClass}/${opacity} dark:${darkClass}/${opacity}`;
  }
  return `${lightClass} dark:${darkClass}`;
};

/**
 * Get consistent card styling
 * Card background + border + dark mode support
 *
 * @param withBorder - Include border styling (default: true)
 * @param withShadow - Include shadow styling (default: false)
 * @returns CSS class string for card styling
 *
 * @example
 * ```tsx
 * <div className={getCardClasses()}>
 *   Card content
 * </div>
 *
 * <div className={getCardClasses(false, true)}>
 *   Card with shadow, no border
 * </div>
 * ```
 */
export const getCardClasses = (
  withBorder = true,
  withShadow = false
): string => {
  const base = getDarkClasses("bg-white", "bg-slate-800");
  const border = withBorder
    ? getDarkClasses("border border-slate-200", "border-slate-700")
    : "";
  const shadow = withShadow ? "shadow-sm" : "";
  return `${base} ${border} ${shadow}`.trim();
};

/**
 * Get consistent text color by variant
 * Text color + dark mode variant
 *
 * @param variant - Text variant: 'primary' | 'secondary' | 'muted' | 'disabled'
 * @returns CSS class string for text color
 *
 * @example
 * ```tsx
 * <p className={getTextClasses('primary')}>Primary text</p>
 * <p className={getTextClasses('secondary')}>Secondary text</p>
 * <p className={getTextClasses('muted')}>Muted text</p>
 * ```
 */
export const getTextClasses = (
  variant: "primary" | "secondary" | "muted" | "disabled" = "primary"
): string => {
  const variants = {
    primary: getDarkClasses("text-slate-900", "text-slate-100"),
    secondary: getDarkClasses("text-slate-600", "text-slate-400"),
    muted: getDarkClasses("text-slate-500", "text-slate-500"),
    disabled: getDarkClasses("text-slate-400", "text-slate-600"),
  };
  return variants[variant];
};

/**
 * Get consistent background color by variant
 * Background color + dark mode variant
 *
 * @param variant - Background variant: 'light' | 'light-alt' | 'card' | 'disabled'
 * @returns CSS class string for background color
 *
 * @example
 * ```tsx
 * <div className={getBgClasses('light')}>Light background</div>
 * <div className={getBgClasses('card')}>Card background</div>
 * ```
 */
export const getBgClasses = (
  variant: "light" | "lightAlt" | "card" | "disabled" = "light"
): string => {
  const variants = {
    light: getDarkClasses("bg-white", "bg-slate-900"),
    lightAlt: getDarkClasses("bg-slate-50", "bg-slate-900"),
    card: getDarkClasses("bg-white", "bg-slate-800"),
    disabled: getDarkClasses("bg-slate-100", "bg-slate-800"),
  };
  return variants[variant];
};

/**
 * Get consistent border color by variant
 * Border color + dark mode variant
 *
 * @param variant - Border variant: 'light' | 'medium' | 'dark'
 * @returns CSS class string for border color
 *
 * @example
 * ```tsx
 * <div className={'border ' + getBorderClasses('light')}>Light border</div>
 * <div className={'border ' + getBorderClasses('medium')}>Medium border</div>
 * ```
 */
export const getBorderClasses = (
  variant: "light" | "medium" | "dark" = "light"
): string => {
  const variants = {
    light: getDarkClasses("border-slate-200", "border-slate-700"),
    medium: getDarkClasses("border-slate-300", "border-slate-600"),
    dark: getDarkClasses("border-slate-400", "border-slate-500"),
  };
  return variants[variant];
};

/**
 * Get consistent hover state colors
 * Hover background + dark mode variant
 *
 * @param colorBase - Color base: 'slate' | 'slate-gray' (default: 'slate')
 * @returns CSS class string for hover states
 *
 * @example
 * ```tsx
 * <button className={getHoverClasses()}>Hover me</button>
 * ```
 */
export const getHoverClasses = (colorBase = "slate"): string => {
  return getDarkClasses(
    `hover:bg-${colorBase}-100`,
    `hover:bg-${colorBase}-900`
  );
};

/**
 * Get input styling with dark mode
 * Combined styling for form inputs (border + bg + text)
 *
 * @param hasError - Add error state styling (default: false)
 * @returns CSS class string for input styling
 *
 * @example
 * ```tsx
 * <input className={getInputClasses()} />
 * <input className={getInputClasses(true)} />  // With error
 * ```
 */
export const getInputClasses = (hasError = false): string => {
  const base = "rounded-md border px-3 py-2 text-sm transition-colors";
  const border = hasError
    ? getDarkClasses(
        "border-red-300 focus:border-red-500",
        "border-red-700 focus:border-red-600"
      )
    : getDarkClasses(
        "border-slate-300 focus:border-slate-500",
        "border-slate-600 focus:border-slate-400"
      );
  const bg = getDarkClasses("bg-white", "bg-slate-900");
  const text = getDarkClasses(
    "text-slate-900 placeholder-slate-400",
    "text-slate-100 placeholder-slate-500"
  );
  const ring = getDarkClasses("focus:ring-slate-200", "focus:ring-slate-700");

  return `${base} ${border} ${bg} ${text} focus:outline-none focus:ring-2 ${ring}`;
};

/**
 * Get divider styling
 * Divider with dark mode support
 *
 * @returns CSS class string for divider
 *
 * @example
 * ```tsx
 * <div className={getDividerClasses()}>
 *   Divider
 * </div>
 * ```
 */
export const getDividerClasses = (): string => {
  return getDarkClasses("bg-slate-200", "bg-slate-700");
};

/**
 * Get focus ring styling
 * Focus ring with dark mode support
 *
 * @returns CSS class string for focus ring
 *
 * @example
 * ```tsx
 * <button className={'focus:ring-2 ' + getFocusRingClasses()}>
 *   Click me
 * </button>
 * ```
 */
export const getFocusRingClasses = (): string => {
  return getDarkClasses("focus:ring-slate-300", "focus:ring-slate-600");
};

/**
 * Get opacity class
 * Utility to add opacity with dark mode considerations
 *
 * @param baseColor - Base color class (e.g., 'bg-white')
 * @param opacity - Opacity value (0-100)
 * @returns CSS class string with opacity
 *
 * @example
 * ```tsx
 * <div className={getOpacityClass('bg-white', 50)}>
 *   50% opacity
 * </div>
 * ```
 */
export const getOpacityClass = (baseColor: string, opacity: number): string => {
  return `${baseColor}/${opacity}`;
};

/**
 * Get skeleton/loading state styling
 * Animated background for loading skeletons
 *
 * @returns CSS class string for skeleton
 *
 * @example
 * ```tsx
 * <div className={getSkeletonClasses()}>
 *   Loading...
 * </div>
 * ```
 */
export const getSkeletonClasses = (): string => {
  return getDarkClasses(
    "bg-slate-200 animate-pulse",
    "bg-slate-700 animate-pulse"
  );
};
