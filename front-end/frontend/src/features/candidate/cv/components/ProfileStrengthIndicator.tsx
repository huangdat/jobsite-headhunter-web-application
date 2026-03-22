/**
 * ProfileStrengthIndicator Component
 * Displays profile strength percentage with progress bar and completion items
 */

import React from "react";
import { useCandidateTranslation } from "@/shared/hooks";
import type { ProfileStrengthIndicatorProps } from "../types";

export const ProfileStrengthIndicator: React.FC<
  ProfileStrengthIndicatorProps
> = ({ percentage, items, isLoading = false }) => {
  const { t } = useCandidateTranslation();

  const getStrengthColor = (percent: number) => {
    if (percent < 40) return "bg-error";
    if (percent < 70) return "bg-yellow-500";
    return "bg-primary";
  };

  const getStrengthTextColor = (percent: number) => {
    if (percent < 40) return "text-error";
    if (percent < 70) return "text-yellow-600";
    return "text-primary";
  };

  if (isLoading) {
    return (
      <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
        <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-32 animate-pulse" />
        <div className="h-2 bg-slate-300 dark:bg-slate-700 rounded w-full animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-full animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low rounded-xl p-6 space-y-6">
      {/* Header with Percentage */}
      <div className="flex items-baseline justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          {t("cv.management.profileStrength.title")}
        </h3>
        <div className="flex items-baseline gap-1">
          <span
            className={`text-3xl font-bold font-headline ${getStrengthTextColor(percentage)}`}
          >
            {percentage}
          </span>
          <span className="text-sm text-on-surface-variant">%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${getStrengthColor(percentage)} transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Completion Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-surface hover:bg-surface-variant transition-colors"
          >
            {/* Status Icon */}
            <div className="flex-0 mt-0.5">
              {item.completed ? (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xs fill">
                    check
                  </span>
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
              )}
            </div>

            {/* Item Content */}
            <div className="flex-1">
              <p
                className={`text-sm ${
                  item.completed
                    ? "text-on-surface font-medium"
                    : "text-on-surface-variant"
                }`}
              >
                {t(item.label)}
              </p>
            </div>

            {/* Impact Badge */}
            {item.impact > 0 && (
              <div className="flex-0 text-xs font-semibold text-slate-500 dark:text-slate-400">
                +{item.impact}%
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Message */}
      {percentage < 100 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-sm align-middle mr-2 fill">
            info
          </span>
          <span className="text-slate-600 dark:text-slate-300">
            Complete remaining items to improve your profile visibility.
          </span>
        </div>
      )}
    </div>
  );
};

export default ProfileStrengthIndicator;
