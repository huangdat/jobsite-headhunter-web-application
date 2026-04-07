/**
 * ApprovalSuccessBanner
 * PROF-05: Business Verification Admin Module
 *
 * Displays success message when verification is approved
 * - Conditional rendering based on status
 * - Auto-dismiss after 8 seconds
 * - Dismissible action
 * - Next action buttons
 */

import React, { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { Button } from "@/components/ui/button";
import { getSemanticClass } from "@/lib/design-tokens";

interface ApprovalSuccessBannerProps {
  show?: boolean;
  onDismiss?: () => void;
  onNext?: () => void;
  autoHideDelay?: number;
}

export const ApprovalSuccessBanner: React.FC<ApprovalSuccessBannerProps> = ({
  show = true,
  onDismiss,
  onNext,
  autoHideDelay = 8000,
}) => {
  const { t } = useAppTranslation();
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (!isVisible || !show) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, autoHideDelay);

    return () => clearTimeout(timer);
  }, [isVisible, show, autoHideDelay, onDismiss]);

  if (!isVisible || !show) return null;

  return (
    <div
      className={`${getSemanticClass("success", "bg", true)} border-l-4 ${getSemanticClass("success", "border", true)} rounded-lg p-4 mb-6`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Success Message */}
        <div className="flex items-start gap-3 flex-1">
          <CheckCircle
            className={
              getSemanticClass("success", "text", true) + " shrink-0 mt-0.5"
            }
            size={20}
          />
          <div>
            <h3
              className={
                "font-semibold " + getSemanticClass("success", "text", true)
              }
            >
              {t("verification.approval.success")}
            </h3>
            <p
              className={
                "text-sm " + getSemanticClass("success", "text", true) + " mt-1"
              }
            >
              {t("verification.approval.successMessage")}
            </p>
          </div>
        </div>

        {/* Dismiss Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsVisible(false);
            onDismiss?.();
          }}
          className={
            getSemanticClass("success", "text", true) +
            " hover:" +
            getSemanticClass("success", "text", true) +
            " shrink-0"
          }
          title={t("verification.approval.dismiss")}
          aria-label={t("verification.approval.dismiss")}
        >
          <X size={20} />
        </Button>
      </div>

      {/* Action Buttons */}
      {onNext && (
        <div className="mt-4 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setIsVisible(false);
              onDismiss?.();
            }}
          >
            {t("verification.approval.viewLog")}
          </Button>
          <Button
            size="sm"
            className={
              getSemanticClass("success", "bg", true) +
              " hover:" +
              getSemanticClass("success", "bg", true)
            }
            onClick={() => {
              setIsVisible(false);
              onNext();
            }}
          >
            {t("verification.approval.nextApplication")}
          </Button>
        </div>
      )}
    </div>
  );
};
