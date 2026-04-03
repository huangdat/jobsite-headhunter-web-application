/**
 * Generic Empty State Component
 * Used when no data is available
 */

import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Inbox, Search, FileX, AlertCircle } from "lucide-react";

export type EmptyStateVariant = "default" | "search" | "error" | "no-data";

export interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title: string;
  description?: string;
  icon?: React.ElementType;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const variantConfig = {
  default: {
    icon: Inbox,
    iconColor: "text-slate-400",
  },
  search: {
    icon: Search,
    iconColor: "text-slate-400",
  },
  "no-data": {
    icon: FileX,
    iconColor: "text-slate-400",
  },
  error: {
    icon: AlertCircle,
    iconColor: "text-red-400",
  },
};

/**
 * EmptyState - Display when no data is available
 *
 * @example
 * ```tsx
 * <EmptyState
 *   variant="search"
 *   title="No results found"
 *   description="Try adjusting your search or filters"
 *   actionLabel="Clear filters"
 *   onAction={handleClearFilters}
 * />
 * ```
 */
export const EmptyState = memo<EmptyStateProps>(function EmptyState({
  variant = "default",
  title,
  description,
  icon: CustomIcon,
  actionLabel,
  onAction,
  className = "",
}) {
  // eslint-disable-next-line security/detect-object-injection
  const config = variantConfig[variant];
  const Icon = CustomIcon || config.icon;

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
    >
      <div
        className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100`}
      >
        <Icon className={`h-10 w-10 ${config.iconColor}`} />
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-slate-600 text-center max-w-md mb-6">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  );
});

EmptyState.displayName = "EmptyState";
