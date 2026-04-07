/**
 * Error Banner Component
 * Displays red error notification with warning icon
 */

import React, { useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { useBusinessTranslation } from "@/shared/hooks/useFeatureTranslation";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { getSemanticClass } from "@/lib/design-tokens";

export interface ErrorBannerProps {
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
 * Error Banner Component
 * Shows error message with red background, warning icon, and optional dismiss
 */
export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  detail,
  messageKey = "business.error.validation",
  detailKey,
  onDismiss,
  autoHideDuration = 0, // No auto-hide for errors by default
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
    <div
      className={`relative mb-6 rounded-lg border p-4 shadow-sm ${getSemanticClass("danger", "border", true)} ${getSemanticClass("danger", "bg", true)}`}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div className="shrink-0">
          <AlertCircle
            className={`h-6 w-6 ${getSemanticClass("danger", "icon")}`}
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Title */}
          <h3
            className={`font-semibold ${getSemanticClass("danger", "text", true)}`}
          >
            {message || t(messageKey)}
          </h3>

          {/* Detail */}
          {detail && (
            <p
              className={`mt-1 text-sm ${getSemanticClass("danger", "text", false)}`}
            >
              {detail}
            </p>
          )}
          {detailKey && (
            <p
              className={`mt-1 text-sm ${getSemanticClass("danger", "text", false)}`}
            >
              {t(detailKey)}
            </p>
          )}

          {/* Action button */}
          {action && (
            <button
              onClick={action.onClick}
              className={`mt-3 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white transition-colors ${getSemanticClass("danger", "type", true)}`}
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className={`shrink-0 transition-colors ${getSemanticClass("danger", "text", false)} hover:opacity-75`}
          aria-label={tApp("dismiss")}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Left accent border */}
      <div
        className={`absolute bottom-0 left-0 top-0 w-1 rounded-l-lg ${getSemanticClass("danger", "bg", true)}`}
      />
    </div>
  );
};

export default ErrorBanner;
