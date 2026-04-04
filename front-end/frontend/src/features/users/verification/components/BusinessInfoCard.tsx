/**
 * BusinessInfoCard
 * PROF-05: Business Verification Admin Module
 *
 * Reusable card component for displaying business information
 * - Icon + title header
 * - Key-value pairs
 * - Ghost border style with optional background
 */

import React from "react";
import type { LucideIcon } from "lucide-react";

interface BusinessInfoCardProps {
  title: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
}

export const BusinessInfoCard: React.FC<BusinessInfoCardProps> = ({
  title,
  icon: Icon,
  children,
  className = "",
}) => {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white/50 p-6 backdrop-blur-sm ${className}`}
    >
      {/* Header with Icon & Title */}
      <div className="flex items-center gap-3 mb-4">
        {Icon && <Icon className="text-lime-600 shrink-0" size={20} />}
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>

      {/* Content */}
      <div className="space-y-3 text-sm">{children}</div>
    </div>
  );
};

/**
 * InfoRow - Helper component for key-value pairs
 */
interface InfoRowProps {
  label: string;
  value: string | React.ReactNode;
  icon?: LucideIcon;
}

export const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  icon: Icon,
}) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-2 flex-1">
        {Icon && <Icon className="text-slate-400 shrink-0 mt-0.5" size={16} />}
        <span className="text-slate-600">{label}</span>
      </div>
      <span className="font-medium text-slate-900 text-right">{value}</span>
    </div>
  );
};
