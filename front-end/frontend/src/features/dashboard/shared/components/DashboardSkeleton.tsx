import React from "react";

/**
 * DashboardSkeleton - AC4
 * Hiệu ứng Skeleton xám khi loading dashboard
 */
export const DashboardSkeleton: React.FC<{ count?: number }> = ({
  count = 3,
}) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
  );
};
