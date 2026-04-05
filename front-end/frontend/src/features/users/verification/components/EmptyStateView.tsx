/**
 * EmptyStateView
 * PROF-05: Business Verification Admin Module
 *
 * Displays empty state for list/grid views
 * - Icon/illustration
 * - Title and description
 * - Primary and secondary action buttons
 * - Consistent styling across feature
 */

import React from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateViewProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyStateView: React.FC<EmptyStateViewProps> = ({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-3xl ${className}`}
    >
      {/* Icon */}
      {Icon && <Icon className="w-16 h-16 text-slate-300 mb-4 opacity-50" />}

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-slate-600 max-w-sm mb-6">{description}</p>
      )}

      {/* Action Buttons */}
      {(primaryAction || secondaryAction) && (
        <div className="flex gap-3">
          {secondaryAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
          {primaryAction && (
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
