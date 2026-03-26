/**
 * CVOptimizationTips Component
 * Displays CV optimization tips and recommendations
 */

import React from "react";
import { useCandidateTranslation } from "@/shared/hooks";
import type { CVOptimizationTipsProps, OptimizationTip } from "../types";

export const CVOptimizationTips: React.FC<CVOptimizationTipsProps> = ({
  tips,
  isLoading = false,
}) => {
  const { t } = useCandidateTranslation();

  // Default tips if not provided
  const defaultTips: OptimizationTip[] = [
    {
      id: "add-keywords",
      title: "cv.management.tips.addKeywords",
      description: "cv.management.tips.addKeywordsDesc",
      icon: "label",
    },
    {
      id: "tailor-roles",
      title: "cv.management.tips.tailorRoles",
      description: "cv.management.tips.tailorRolesDesc",
      icon: "target",
    },
  ];

  const displayTips = tips || defaultTips;

  if (isLoading) {
    return (
      <div className="bg-slate-50 rounded-xl p-6 space-y-4">
        <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-40 animate-pulse" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-32 animate-pulse" />
              <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-full animate-pulse" />
              <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-5/6 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 rounded-xl p-6 space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-emerald-600 text-3xl fill">
          lightbulb
        </span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600">
          {t("cv.management.tips.title")}
        </h3>
      </div>

      {/* Tips List */}
      <div className="space-y-4">
        {displayTips.map((tip) => (
          <div
            key={tip.id}
            className="p-4 rounded-lg bg-white hover:bg-white-variant transition-colors"
          >
            {/* Tip Header */}
            <div className="flex items-start gap-3 mb-2">
              {tip.icon && (
                <span className="material-symbols-outlined text-emerald-600 text-lg flex-0 mt-0.5">
                  {tip.icon}
                </span>
              )}
              <h4 className="text-sm font-bold text-slate-900">
                {t(tip.title)}
              </h4>
            </div>

            {/* Tip Description */}
            <p className="text-xs text-slate-600 leading-relaxed ml-7">
              {t(tip.description)}
            </p>

            {/* Completed Badge */}
            {tip.completed && (
              <div className="mt-3 ml-7">
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-emerald-300/20 rounded px-2 py-1">
                  <span className="material-symbols-outlined text-emerald-600 text-sm fill">
                    check_circle
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">
                    Completed
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      {displayTips.length > 0 && (
        <div className="pt-4 border-t border-surface-variant">
          <p className="text-xs text-slate-600 text-center">
            {t("candidate.tips.optimizationTitle")}
          </p>
        </div>
      )}
    </div>
  );
};

export default CVOptimizationTips;
