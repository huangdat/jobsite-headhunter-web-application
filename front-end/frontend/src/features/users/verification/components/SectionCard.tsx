/**
 * SectionCard
 * PROF-05: Business Verification Admin Module
 *
 * Wrapper component for organizing content sections
 * - Card with consistent styling
 * - Optional header with title and icon
 * - Children content area
 * - Optional footer
 * - Consistent spacing
 */

import React from "react";
import type { LucideIcon } from "lucide-react";
import { getSemanticClass } from "@/lib/design-tokens";

interface SectionCardProps {
  title?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "error";
  isLoading?: boolean;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon: Icon,
  children,
  footer,
  className = "",
  variant = "default",
  isLoading = false,
}) => {
  let variantClasses: string;
  switch (variant) {
    case "success":
      variantClasses = "bg-green-50 border-green-200";
      break;
    case "warning":
      variantClasses = "bg-amber-50 border-amber-200";
      break;
    case "error":
      variantClasses = `${getSemanticClass("danger", "bg", true)} ${getSemanticClass("danger", "border", true)}`;
      break;
    default:
      variantClasses = "bg-white border-slate-200";
  }

  return (
    <div className={`rounded-xl border ${variantClasses} ${className}`}>
      {/* Header */}
      {title && (
        <div className="px-6 pt-6 pb-4 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="text-lime-600 shrink-0" size={20} />}
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {title}
            </h3>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`${title ? "px-6 py-4" : "p-6"}`}>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-4 bg-slate-200 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          children
        )}
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-slate-200/50 bg-slate-50">
          {footer}
        </div>
      )}
    </div>
  );
};
