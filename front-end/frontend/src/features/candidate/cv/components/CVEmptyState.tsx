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
      <div className="bg-surface-container-low border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-primary-container rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-4xl fill">
              description
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h2 className="text-2xl font-headline font-bold text-on-surface">
            {t("cv.management.empty.headline")}
          </h2>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
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
        <p className="text-xs text-on-surface-variant mt-6">
          {t("cv.management.empty.supported")}
        </p>
      </div>

      {/* Bottom Info Section - 2 Columns */}
      <div className="grid grid-cols-2 gap-6">
        {/* Privacy Control */}
        <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg fill">
              security
            </span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {t("cv.management.bestPractices.privacyTitle")}
            </h3>
          </div>

          <p className="text-sm text-on-surface-variant leading-relaxed">
            Take full command of your visibility. Choose who can view your
            credentials: keep them private, open to all verified recruiters, or
            only visible to targeted executive firms.
          </p>

          <ul className="space-y-2 text-xs text-on-surface-variant">
            <li className="flex gap-2">
              <span className="text-primary shrink-0">→</span>
              <span>You can set specific companies to "Block List"</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary shrink-0">→</span>
              <span>Control exactly what personal data is shared</span>
            </li>
          </ul>
        </div>

        {/* Best Practices */}
        <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg fill">
              verified_user
            </span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {t("cv.management.bestPractices.practicesTitle")}
            </h3>
          </div>

          <ul className="space-y-2 text-xs text-on-surface-variant">
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">•</span>
              <span>
                Optimize your impact. Use clean, professional formatting and
                ensure your executive summary highlights measurable ROI to stand
                out to global search partners.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">•</span>
              <span>
                Focus on the last 10 years of your career path, emphasizing your
                leadership impact and strategic accomplishments.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CVEmptyState;
