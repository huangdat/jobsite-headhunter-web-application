/**
 * Generic Empty State Component
 * Used when no data is available
 */

import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Inbox, Search, FileX, AlertCircle } from "lucide-react";
import { SubsectionTitle, SmallText } from "./typography/Typography";
import { getSemanticClass } from "@/lib/design-tokens";

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
    iconColor: getSemanticClass("danger", "text", true),
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

      <SubsectionTitle className="mb-2">{title}</SubsectionTitle>

      {description && (
        <SmallText variant="muted" className="text-center max-w-md mb-6">
          {description}
        </SmallText>
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
