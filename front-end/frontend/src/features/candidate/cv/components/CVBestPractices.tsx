/**
 * CVBestPractices Component
 * Displays CV best practices and privacy control information
 */

import React from "react";
import { useCandidateTranslation } from "@/shared/hooks";
import type { CVBestPracticesProps } from "../types";

export const CVBestPractices: React.FC<CVBestPracticesProps> = ({
  section = "best_practices",
  isLoading = false,
}) => {
  const { t } = useCandidateTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-slate-50 rounded-xl p-6 space-y-4">
            <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-40 animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div
                  key={j}
                  className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Privacy Control Section
  if (section === "privacy") {
    return (
      <div className="grid grid-cols-2 gap-6">
        {/* Privacy Control */}
        <div className="bg-slate-50 rounded-xl p-6 space-y-4">
          {/* Icon & Title */}
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-lg fill">
              security
            </span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600">
              {t("cv.management.bestPractices.privacyTitle")}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-900 leading-relaxed">
            {t("cv.management.bestPractices.privacyDesc")}
          </p>

          {/* Privacy Items */}
          <ul className="space-y-2">
            {/* Fallback items */}
            {t("cv.management.bestPractices.privacyItems", {
              returnObjects: true,
            })?.map((item: string, index: number) => (
              <li key={index} className="flex gap-2 text-sm text-slate-600">
                <span className="text-emerald-600 font-bold flex-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Best Practices */}
        <div className="bg-slate-50 rounded-xl p-6 space-y-4">
          {/* Icon & Title */}
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-lg fill">
              verified_user
            </span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600">
              {t("cv.management.bestPractices.practicesTitle")}
            </h3>
          </div>

          {/* Best Practice Items */}
          <ul className="space-y-3">
            {t("cv.management.bestPractices.practicesItems", {
              returnObjects: true,
            })?.map((item: string, index: number) => (
              <li key={index} className="flex gap-2 text-sm text-slate-600">
                <span className="text-emerald-600 font-bold flex-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Default Best Practices Section (Full width)
  return (
    <div className="bg-slate-50 rounded-xl p-6 space-y-6">
      {/* Section divided into 2 columns */}
      <div className="grid grid-cols-2 gap-8">
        {/* Privacy Control Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-lg fill">
              security
            </span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600">
              {t("cv.management.bestPractices.privacyTitle")}
            </h3>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            {t("cv.management.bestPractices.privacyDesc")}
          </p>

          <ul className="space-y-2 text-sm">
            {t("cv.management.bestPractices.privacyItems", {
              returnObjects: true,
            })?.map((item: string, index: number) => (
              <li key={index} className="flex gap-2 text-slate-600">
                <span className="text-emerald-600 flex-0">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Best Practices Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-lg fill">
              verified_user
            </span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600">
              {t("cv.management.bestPractices.practicesTitle")}
            </h3>
          </div>

          <ul className="space-y-2 text-sm">
            <li className="flex gap-2 text-slate-600">
              <span className="text-emerald-600 font-bold flex-0">•</span>
              <span>{t("candidate.tips.bestPracticeTip1")}</span>
            </li>
            <li className="flex gap-2 text-slate-600">
              <span className="text-emerald-600 font-bold flex-0">•</span>
              <span>{t("candidate.tips.bestPracticeTip2")}</span>
            </li>
            <li className="flex gap-2 text-slate-600">
              <span className="text-emerald-600 font-bold flex-0">•</span>
              <span>{t("candidate.tips.bestPracticeTip3")}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CVBestPractices;
