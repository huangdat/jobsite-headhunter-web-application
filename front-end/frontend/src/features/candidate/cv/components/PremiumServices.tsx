/**
 * PremiumServices Component
 * Displays premium service offerings (CV Audit, Expert Review)
 */

import React from "react";
import { useCandidateTranslation } from "@/shared/hooks";
import type { PremiumServicesProps } from "../types";

export const PremiumServices: React.FC<PremiumServicesProps> = ({
  section = "booking",
  onAction,
  isLoading = false,
}) => {
  const { t } = useCandidateTranslation();

  if (isLoading) {
    return (
      <div className="bg-slate-800 dark:bg-slate-900 rounded-xl p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-40" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-700 rounded" />
          <div className="h-3 bg-slate-700 rounded w-5/6" />
        </div>
        <div className="h-10 bg-slate-700 rounded w-32" />
      </div>
    );
  }

  // CV Audit Section (Green background)
  if (section === "booking") {
    return (
      <div className="bg-linear-to-br from-primary to-primary-dim rounded-xl p-6 space-y-4 text-white shadow-lg">
        {/* Header */}
        <h3 className="text-xs font-bold uppercase tracking-widest opacity-90">
          {t("cv.management.premiumServices.premiumTitle")}
        </h3>

        {/* Title */}
        <h2 className="text-lg font-headline font-bold">
          {t("cv.management.premiumServices.auditTitle")}
        </h2>

        {/* Description */}
        <p className="text-sm opacity-90 leading-relaxed">
          {t("cv.management.premiumServices.auditDesc")}
        </p>

        {/* CTA Button */}
        <button
          onClick={onAction}
          className="w-full mt-4 px-4 py-3 bg-white text-brand-primary font-bold rounded-lg hover:bg-slate-100 transition-colors text-sm flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">
            calendar_today
          </span>
          {t("cv.management.premiumServices.bookAudit")}
        </button>

        {/* Footer */}
        <p className="text-xs opacity-75 text-center mt-4">
          {t("tips.auditGuide")}
        </p>
      </div>
    );
  }

  // Expert Review Section (Cyan background)
  return (
    <div className="bg-linear-to-br from-tertiary-fixed to-tertiary rounded-xl p-6 space-y-4 text-white shadow-lg">
      {/* Header */}
      <h3 className="text-xs font-bold uppercase tracking-widest opacity-90">
        {t("cv.management.premiumServices.premiumTitle")}
      </h3>

      {/* Title */}
      <h2 className="text-lg font-headline font-bold">
        {t("cv.management.premiumServices.reviewTitle")}
      </h2>

      {/* Description */}
      <p className="text-sm opacity-90 leading-relaxed">
        {t("cv.management.premiumServices.reviewDesc")}
      </p>

      {/* CTA Button */}
      <button
        onClick={onAction}
        className="w-full mt-4 px-4 py-3 bg-white text-tertiary font-bold rounded-lg hover:bg-slate-100 transition-colors text-sm flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-lg">person_check</span>
        {t("cv.management.premiumServices.getReview")}
      </button>

      {/* Footer */}
      <p className="text-xs opacity-75 text-center mt-4">
        {t("tips.reviewGuide")}
      </p>
    </div>
  );
};

export default PremiumServices;
