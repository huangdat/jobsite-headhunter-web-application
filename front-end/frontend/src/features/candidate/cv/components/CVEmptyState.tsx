/**
 * CVEmptyState Component
 * Displays empty state when no CVs have been uploaded
 */

import React from "react";
import { useCandidateTranslation } from "@/shared/hooks";
import type { CVEmptyStateProps } from "../types";

export const CVEmptyState: React.FC<CVEmptyStateProps> = ({ onUpload }) => {
  const { t } = useCandidateTranslation();

  return (
    <div className="space-y-6">
      {/* Main Empty State Card */}
      <div className="bg-slate-50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-primary-container rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-600 text-4xl fill">
              description
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h2 className="text-2xl font-headline font-bold text-slate-900">
            {t("cv.management.empty.headline")}
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            {t("cv.management.empty.description")}
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={onUpload}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-dim transition-colors text-sm"
        >
          <span className="material-symbols-outlined">upload</span>
          {t("cv.management.empty.button")}
        </button>

        {/* Supported Formats Info */}
        <p className="text-xs text-slate-600 mt-6">
          {t("cv.management.empty.supported")}
        </p>
      </div>

      {/* Bottom Info Section - 2 Columns */}
      <div className="grid grid-cols-2 gap-6">
        {/* Privacy Control */}
        <div className="bg-slate-50 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-lg fill">
              security
            </span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600">
              {t("cv.management.bestPractices.privacyTitle")}
            </h3>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            {t("candidate.tips.privacyTip1")}
          </p>

          <ul className="space-y-2 text-xs text-slate-600">
            {([] as string[])?.map(
              (item: string, index: number) => (
                <li key={index} className="flex gap-2">
                  <span className="text-emerald-600 shrink-0">→</span>
                  <span>{item}</span>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Best Practices */}
        <div className="bg-slate-50 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-lg fill">
              verified_user
            </span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600">
              {t("cv.management.bestPractices.practicesTitle")}
            </h3>
          </div>

          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex gap-2">
              <span className="text-emerald-600 font-bold shrink-0">•</span>
              <span>{t("candidate.tips.privacyTip2")}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 font-bold shrink-0">•</span>
              <span>{t("candidate.tips.privacyTip3")}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CVEmptyState;

