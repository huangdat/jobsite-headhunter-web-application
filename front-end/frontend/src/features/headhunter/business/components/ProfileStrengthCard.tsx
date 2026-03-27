/**
 * Profile Strength Card Component
 * Displays profile completion percentage and strength items
 */

import React, { useMemo } from "react";
import { useBusinessTranslation } from "@/shared/hooks/useFeatureTranslation";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import type {
  ProfileStrengthData,
  StrengthItem,
  StrengthItemStatus,
} from "../types/business.types";

export interface ProfileStrengthCardProps {
  strengthData: ProfileStrengthData | null;
  isLoading?: boolean;
  className?: string;
}

const getStatusIcon = (status: StrengthItemStatus) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
    case "in_progress":
      return (
        <div className="relative flex h-5 w-5 items-center justify-center">
          <div className="absolute h-5 w-5 animate-spin rounded-full border-2 border-amber-300 border-t-amber-600"></div>
        </div>
      );
    case "incomplete":
    default:
      return <Circle className="h-5 w-5 text-slate-300" />;
  }
};

const getStrengthColor = (percentage: number) => {
  if (percentage >= 80) return "text-emerald-600";
  if (percentage >= 60) return "text-amber-600";
  return "text-red-600";
};

const getStrengthBgColor = (percentage: number) => {
  if (percentage >= 80) return "bg-emerald-100";
  if (percentage >= 60) return "bg-amber-100";
  return "bg-red-100";
};

/**
 * Profile Strength Card Component
 * Shows profile completion percentage with breakdown of items
 */
export const ProfileStrengthCard: React.FC<ProfileStrengthCardProps> = ({
  strengthData,
  isLoading = false,
  className = "",
}) => {
  const { t } = useBusinessTranslation();

  const strengthColor = useMemo(
    () => getStrengthColor(strengthData?.percentage || 0),
    [strengthData?.percentage]
  );

  const strengthBgColor = useMemo(
    () => getStrengthBgColor(strengthData?.percentage || 0),
    [strengthData?.percentage]
  );

  if (isLoading) {
    return (
      <div
        className={`rounded-lg border border-slate-200 bg-white p-6 ${className}`}
      >
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 animate-pulse rounded-full bg-slate-200"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200"></div>
            <div className="h-3 w-16 animate-pulse rounded bg-slate-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!strengthData) {
    return (
      <div
        className={`rounded-lg border border-slate-200 bg-white p-6 ${className}`}
      >
        <p className="text-center text-sm text-slate-600">
          {t("business.strength.no_data")}
        </p>
      </div>
    );
  }

  const completedItems = strengthData.items.filter(
    (item) => item.completed
  ).length;
  const totalItems = strengthData.items.length;

  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white p-6 ${className}`}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          {t("business.strength.title")}
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          {t("business.strength.subtitle")}
        </p>
      </div>

      {/* Strength Meter */}
      <div className="mb-6 flex items-center gap-4">
        {/* Circular Progress */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          <svg className="h-24 w-24 -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-200"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${(strengthData.percentage / 100) * 283} 283`}
              className={`transition-all duration-500 ${strengthColor}`}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-2xl font-bold ${strengthColor}`}>
              {Math.round(strengthData.percentage)}%
            </span>
            <span className="text-xs text-slate-600">
              {t("business.strength.complete")}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className={`rounded-lg ${strengthBgColor} p-3`}>
            <p className="text-sm font-semibold text-slate-900">
              {completedItems} {t("business.strength.of")} {totalItems}{" "}
              {t("business.strength.items")}
            </p>
            <p className="mt-1 text-xs text-slate-700">
              {strengthData.percentage >= 80
                ? t("business.strength.excellent")
                : strengthData.percentage >= 60
                  ? t("business.strength.good")
                  : t("business.strength.incomplete")}
            </p>
          </div>
        </div>
      </div>

      {/* Strength Items */}
      <div className="space-y-3 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
          {t("business.strength.breakdown")}
        </p>

        {strengthData.items.map((item: StrengthItem) => (
          <div key={item.id} className="flex items-start gap-3">
            {/* Icon */}
            <div className="mt-0.5 shrink-0">{getStatusIcon(item.status)}</div>

            {/* Item Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={`text-sm font-medium ${item.completed ? "text-slate-900" : "text-slate-700"}`}
                >
                  {t(item.label)}
                </p>
                <span className="shrink-0 text-xs font-semibold text-slate-600">
                  +{item.impact}%
                </span>
              </div>

              {item.description && (
                <p className="mt-1 text-xs text-slate-600">
                  {t(item.description)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Next Action */}
      {strengthData.nextAction && strengthData.percentage < 100 && (
        <div className="mt-6 flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-blue-600" />
          <div>
            <p className="text-sm font-semibold text-blue-900">
              {t("business.strength.next_action")}
            </p>
            <p className="mt-1 text-sm text-blue-800">
              {t(strengthData.nextAction)}
            </p>
          </div>
        </div>
      )}

      {/* Last Updated */}
      {strengthData.lastUpdatedAt && (
        <p className="mt-4 text-xs text-slate-500">
          {t("business.strength.updated")}:{" "}
          {new Date(strengthData.lastUpdatedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default ProfileStrengthCard;

