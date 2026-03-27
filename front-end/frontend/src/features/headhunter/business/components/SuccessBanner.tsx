/**
 * Success Banner Component
 * Displays green success notification with checkmark
 */

import React, { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import { useBusinessTranslation } from "@/shared/hooks/useFeatureTranslation";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";

export interface SuccessBannerProps {
  message?: string;
  detail?: string;
  messageKey?: string; // i18n key
  detailKey?: string;
  onDismiss?: () => void;
  autoHideDuration?: number; // ms, 0 = no auto-hide
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Success Banner Component
 * Shows success message with green background, checkmark, and optional dismiss
 */
export const SuccessBanner: React.FC<SuccessBannerProps> = ({
  message,
  detail,
  messageKey = "business.success.message",
  detailKey,
  onDismiss,
  autoHideDuration = 5000,
  action,
}) => {
  const { t } = useBusinessTranslation();
  const { t: tApp } = useAppTranslation();
  const [visible, setVisible] = React.useState(true);

  // Auto-hide if duration set
  useEffect(() => {
    if (autoHideDuration && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, onDismiss]);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  if (!visible) return null;

  return (
    <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
      <div className="flex gap-4">
        {/* Icon */}
        <div className="shrink-0">
          <CheckCircle className="h-6 w-6 text-emerald-600" />
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Title */}
          <h3 className="font-semibold text-emerald-900">
            {message || t(messageKey)}
          </h3>

          {/* Detail */}
          {detail && <p className="mt-1 text-sm text-emerald-700">{detail}</p>}
          {detailKey && (
            <p className="mt-1 text-sm text-emerald-700">{t(detailKey)}</p>
          )}

          {/* Action button */}
          {action && (
            <button
              onClick={action.onClick}
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="shrink-0 text-emerald-400 hover:text-emerald-600 transition-colors"
          aria-label={tApp("dismiss")}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Left accent border */}
      <div className="absolute bottom-0 left-0 top-0 w-1 bg-emerald-600 rounded-l-lg" />
    </div>
  );
};

export default SuccessBanner;
