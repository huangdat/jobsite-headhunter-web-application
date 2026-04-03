/**
 * Loading Spinner Component
 * Consistent loading indicator across the application
 */

import { memo } from "react";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-3",
  lg: "h-12 w-12 border-4",
};

/**
 * LoadingSpinner - Consistent loading indicator
 *
 * @example
 * ```tsx
 * // Inline spinner
 * <LoadingSpinner size="sm" />
 *
 * // With text
 * <LoadingSpinner text="Loading data..." />
 *
 * // Full screen overlay
 * <LoadingSpinner fullScreen text="Processing..." />
 * ```
 */
export const LoadingSpinner = memo<LoadingSpinnerProps>(
  function LoadingSpinner({
    size = "md",
    text,
    fullScreen = false,
    className = "",
  }) {
    const spinner = (
      <div className={`flex items-center gap-3 ${className}`}>
        <div
          className={`animate-spin rounded-full border-slate-300 border-t-slate-600 ${
            // eslint-disable-next-line security/detect-object-injection
            sizeClasses[size]
          }`}
        ></div>
        {text && <span className="text-sm text-slate-600">{text}</span>}
      </div>
    );

    if (fullScreen) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          {spinner}
        </div>
      );
    }

    return spinner;
  }
);

LoadingSpinner.displayName = "LoadingSpinner";
