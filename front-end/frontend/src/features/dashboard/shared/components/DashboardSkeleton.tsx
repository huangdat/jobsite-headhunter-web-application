import React from "react";

/**
 * DashboardSkeleton
 * Loading placeholder component with animated skeleton
 * Supports dark mode for consistent styling
 */
export const DashboardSkeleton: React.FC<{
  count?: number;
  height?: string;
}> = ({ count = 3, height = "h-32" }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${height} bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse`}
        />
      ))}
    </div>
  );
};
