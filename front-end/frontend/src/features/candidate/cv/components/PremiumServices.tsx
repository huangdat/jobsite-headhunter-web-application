/**
 * PremiumServices Component
 * Displays premium service offerings (CV Audit, Expert Review)
 */

import React from "react";
import { useCandidateTranslation } from "@/shared/hooks";
import { Button } from "@/components/ui/button";
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
        <Button
          onClick={onAction}
          disabled={isLoading}
          className="w-full mt-4 text-brand-primary bg-white hover:bg-slate-100"
        >
          <span className="material-symbols-outlined text-lg mr-2">
            calendar_today
          </span>
          {t("cv.management.premiumServices.bookAudit")}
        </Button>

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
      <Button
        onClick={onAction}
        disabled={isLoading}
        className="w-full mt-4 text-tertiary bg-white hover:bg-slate-100"
      >
        <span className="material-symbols-outlined text-lg mr-2">
          person_check
        </span>
        {t("cv.management.premiumServices.getReview")}
      </Button>

      {/* Footer */}
      <p className="text-xs opacity-75 text-center mt-4">
        {t("tips.reviewGuide")}
      </p>
    </div>
  );
};

export default PremiumServices;
