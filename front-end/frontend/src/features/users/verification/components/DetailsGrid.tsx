/**
 * DetailsGrid
 * PROF-05: Business Verification Admin Module
 *
 * Reusable grid component for displaying key-value pairs
 * - Configurable columns (1, 2, 3, 4)
 * - Label and value layout
 * - Optional icons
 * - Responsive behavior
 */

import React from "react";
import type { LucideIcon } from "lucide-react";

export interface DetailItem {
  label: string;
  value: string | React.ReactNode;
  icon?: LucideIcon;
}

interface DetailsGridProps {
  items: DetailItem[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const DetailsGrid: React.FC<DetailsGridProps> = ({
  items,
  columns = 2,
  className = "",
}) => {
  let gridClassName: string;
  switch (columns) {
    case 1:
      gridClassName = "grid-cols-1";
      break;
    case 3:
      gridClassName = "grid-cols-3";
      break;
    case 4:
      gridClassName = "grid-cols-4";
      break;
    default:
      gridClassName = "grid-cols-2";
  }

  return (
    <div className={`grid ${gridClassName} gap-4 ${className}`}>
      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <div key={index} className="flex flex-col">
            {/* Label */}
            <label className="text-sm text-slate-600 mb-1 flex items-center gap-2">
              {Icon && <Icon size={14} className="text-slate-400" />}
              {item.label}
            </label>

            {/* Value */}
            <p className="font-semibold text-slate-900">{item.value}</p>
          </div>
        );
      })}
    </div>
  );
};

/**
 * SectionTitle - Helper component for section headers
 */
interface SectionTitleProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  icon: Icon,
  title,
  subtitle,
  className = "",
}) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-4">
        {Icon && <Icon className="text-lime-600 shrink-0" size={20} />}
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
    </div>
  );
};
