/**
 * CVErrorBanner Component
 * Displays error messages for CV upload or operations
 */

import React from "react";
import { useCandidateTranslation } from "@/shared/hooks";
import type { CVErrorBannerProps } from "../types";

export const CVErrorBanner: React.FC<CVErrorBannerProps> = ({
  error,
  details,
  onDismiss,
  onRetry,
}) => {
  const { t } = useCandidateTranslation();

  if (!error) return null;

  return (
    <div className="bg-on-error border-l-4 border-error p-5 rounded-xl flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Error Icon */}
      <div className="bg-error rounded-full p-1 shrink-0 mt-0.5">
        <span className="material-symbols-outlined text-error text-lg fill">
          error
        </span>
      </div>

      {/* Error Content */}
      <div className="flex-1">
        <p className="text-on-error font-bold text-sm">{t(error) || error}</p>
        {details && (
          <p className="text-on-error/80 text-sm mt-1">
            {t(details) || details}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-error hover:text-error/80 transition-colors p-1"
            title={t("cv.management.validation.retry")}
            aria-label={t("cv.management.validation.retry")}
          >
            <span className="material-symbols-outlined text-base">refresh</span>
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-error hover:text-error/80 transition-colors p-1"
            title={t("cv.management.validation.dismiss")}
            aria-label={t("cv.management.validation.dismiss")}
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CVErrorBanner;
