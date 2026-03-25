/**
 * Optimization Tips Component
 * Displays actionable tips to improve profile strength
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { Lightbulb, ChevronRight } from "lucide-react";

export interface OptimizationTip {
  id: string;
  title: string; // i18n key
  description: string; // i18n key
  impact: number; // percentage boost
  priority: "high" | "medium" | "low";
  actionLabel?: string; // i18n key
  onAction?: () => void;
}

export interface OptimizationTipsProps {
  tips?: OptimizationTip[];
  isLoading?: boolean;
  className?: string;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "border-red-200 bg-red-50";
    case "medium":
      return "border-amber-200 bg-amber-50";
    case "low":
    default:
      return "border-blue-200 bg-blue-50";
  }
};

const getPriorityBadgeColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    case "low":
    default:
      return "bg-blue-100 text-blue-800";
  }
};

/**
 * Default optimization tips
 */
const DEFAULT_TIPS: OptimizationTip[] = [
  {
    id: "tip_1",
    title: "business.optimization.complete_profile",
    description: "business.optimization.complete_profile_desc",
    impact: 15,
    priority: "high",
  },
  {
    id: "tip_2",
    title: "business.optimization.add_document",
    description: "business.optimization.add_document_desc",
    impact: 25,
    priority: "high",
  },
  {
    id: "tip_3",
    title: "business.optimization.verify_info",
    description: "business.optimization.verify_info_desc",
    impact: 20,
    priority: "medium",
  },
  {
    id: "tip_4",
    title: "business.optimization.add_photos",
    description: "business.optimization.add_photos_desc",
    impact: 10,
    priority: "medium",
  },
  {
    id: "tip_5",
    title: "business.optimization.social_links",
    description: "business.optimization.social_links_desc",
    impact: 10,
    priority: "low",
  },
];

/**
 * Optimization Tips Component
 * Provides actionable recommendations to improve profile strength
 */
export const OptimizationTips: React.FC<OptimizationTipsProps> = ({
  tips = DEFAULT_TIPS,
  isLoading = false,
  className = "",
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div
        className={`rounded-lg border border-slate-200 bg-white p-6 ${className}`}
      >
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-lg bg-slate-100"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const highPriorityTips = tips.filter((tip) => tip.priority === "high");
  const otherTips = tips.filter((tip) => tip.priority !== "high");

  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white p-6 ${className}`}
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
          <Lightbulb className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {t("business.optimization.title", "Optimization Tips")}
          </h3>
          <p className="text-xs text-slate-600">
            {t(
              "business.optimization.subtitle",
              "Quick ways to boost your profile"
            )}
          </p>
        </div>
      </div>

      {/* Tips List */}
      <div className="space-y-3">
        {/* High Priority Tips */}
        {highPriorityTips.length > 0 && (
          <>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-700">
              {t("business.optimization.start_here", "Start Here")}
            </p>
            {highPriorityTips.slice(0, 2).map((tip) => (
              <div
                key={tip.id}
                className={`flex items-start gap-3 rounded-lg border p-4 transition-colors hover:shadow-md ${getPriorityColor(tip.priority)}`}
              >
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">
                      {t(tip.title, tip.title)}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${getPriorityBadgeColor(tip.priority)}`}
                    >
                      +{tip.impact}%
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-700">
                    {t(tip.description, tip.description)}
                  </p>

                  {tip.onAction && (
                    <button
                      onClick={tip.onAction}
                      className="mt-2 flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-slate-700"
                    >
                      {t(
                        tip.actionLabel || "common.take_action",
                        "Take Action"
                      )}
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Other Tips */}
        {otherTips.length > 0 && (
          <>
            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-700">
              {t("business.optimization.additional", "Additional")}
            </p>
            {otherTips.slice(0, 2).map((tip) => (
              <div
                key={tip.id}
                className={`flex items-start gap-3 rounded-lg border p-3 text-sm transition-colors hover:shadow-md ${getPriorityColor(tip.priority)}`}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-slate-900">
                      {t(tip.title, tip.title)}
                    </p>
                    <span className="shrink-0 text-xs font-semibold text-slate-600">
                      +{tip.impact}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-700">
                    {t(tip.description, tip.description)}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-xs font-medium text-blue-900">
          💡{" "}
          {t(
            "business.optimization.info",
            "Each completed action increases your profile visibility to recruiters"
          )}
        </p>
      </div>
    </div>
  );
};

export default OptimizationTips;
