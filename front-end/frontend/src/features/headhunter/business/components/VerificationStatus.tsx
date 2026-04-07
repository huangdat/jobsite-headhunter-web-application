/**
 * Verification Status Timeline Component
 * Displays verification progress steps
 */

import React from "react";
import { useBusinessTranslation } from "@/shared/hooks/useFeatureTranslation";
import { getSemanticClass } from "@/lib/design-tokens";
import { CheckCircle2, Circle } from "lucide-react";
import type { VerificationStatus as VerificationStatusType } from "../types/business.types";

export interface VerificationStep {
  status: VerificationStatusType;
  label: string;
  timestamp?: string;
  description?: string;
}

export interface VerificationStatusProps {
  currentStatus: VerificationStatusType;
  steps?: VerificationStep[];
  showDescription?: boolean;
  className?: string;
}

const STATUS_ORDER: VerificationStatusType[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
];

const getStatusIcon = (
  status: VerificationStatusType,
  isCompleted: boolean
) => {
  switch (status) {
    case "APPROVED":
      return (
        <CheckCircle2
          className={`h-10 w-10 ${getSemanticClass("success", "icon")}`}
        />
      );
    case "REJECTED":
      return (
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${getSemanticClass("danger", "bg", true)}`}
        >
          <svg
            className={`h-6 w-6 ${getSemanticClass("danger", "icon")}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      );
    case "PENDING":
    default:
      return isCompleted ? (
        <CheckCircle2
          className={`h-10 w-10 ${getSemanticClass("success", "icon")}`}
        />
      ) : (
        <Circle className="h-10 w-10 text-slate-300" />
      );
  }
};

const getStatusBadgeColor = (status: VerificationStatusType): string => {
  switch (status) {
    case "APPROVED":
      return `${getSemanticClass("success", "bg", true)} ${getSemanticClass("success", "text", true)}`;
    case "REJECTED":
      return `${getSemanticClass("danger", "bg", true)} ${getSemanticClass("danger", "text", true)}`;
    case "PENDING":
    default:
      return "bg-slate-100 text-slate-800";
  }
};

/**
 * Verification Status Timeline Component
 * Shows current verification status and progress through review stages
 */
export const VerificationStatus: React.FC<VerificationStatusProps> = ({
  currentStatus,
  steps,
  showDescription = true,
  className = "",
}) => {
  const { t } = useBusinessTranslation();

  // Default timeline steps if not provided
  const defaultSteps: VerificationStep[] = [
    {
      status: "PENDING",
      label: t("business.verification.submitted"),
      description: t("business.verification.submitted_desc"),
    },
    {
      status: "APPROVED",
      label: t("business.verification.approved"),
      description: t("business.verification.approved_desc"),
    },
  ];

  const timelineSteps = steps || defaultSteps;
  const currentStatusIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {t("business.verification.status")}
          </h3>
          <p className="text-sm text-slate-600">
            {t("business.verification.status_desc")}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${getStatusBadgeColor(currentStatus)}`}
        >
          {t(`business.verification.${currentStatus}`)}
        </span>
      </div>

      {/* Timeline Steps */}
      <div className="space-y-4">
        {timelineSteps.map((step, index) => {
          const isCompleted =
            STATUS_ORDER.indexOf(step.status) < currentStatusIndex;
          const isCurrent = step.status === currentStatus;

          return (
            <div key={step.status} className="flex gap-4">
              {/* Icon */}
              <div className="flex flex-col items-center">
                <div
                  className={`rounded-full p-1 ${
                    isCurrent
                      ? getSemanticClass("warning", "bg", true)
                      : isCompleted
                        ? getSemanticClass("success", "bg", true)
                        : "bg-slate-100"
                  }`}
                >
                  {getStatusIcon(step.status, isCompleted)}
                </div>

                {/* Connector Line */}
                {index < timelineSteps.length - 1 && (
                  <div
                    className={`my-2 w-1 flex-1 min-h-10 ${
                      isCompleted
                        ? getSemanticClass("success", "bg", true)
                        : isCurrent
                          ? getSemanticClass("warning", "bg", true)
                          : "bg-slate-200"
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div
                className={`flex-1 rounded-lg border px-4 py-3 transition-colors ${
                  isCurrent
                    ? `${getSemanticClass("warning", "border", true)} ${getSemanticClass("warning", "bg", true)}`
                    : isCompleted
                      ? `${getSemanticClass("success", "border", true)} ${getSemanticClass("success", "bg", true)}`
                      : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <p
                    className={`font-semibold ${
                      isCurrent
                        ? getSemanticClass("warning", "text", true)
                        : isCompleted
                          ? getSemanticClass("success", "text", true)
                          : "text-slate-700"
                    }`}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full ${getSemanticClass("warning", "bg", true)} px-2 py-1 text-xs font-semibold ${getSemanticClass("warning", "text", true)}`}
                    >
                      <span className="relative flex h-2 w-2">
                        <span
                          className={`absolute inline-flex h-full w-full animate-pulse rounded-full ${getSemanticClass("warning", "text", true)}`}
                        ></span>
                        <span
                          className={`inline-flex h-2 w-2 rounded-full ${getSemanticClass("warning", "text", true)}`}
                        ></span>
                      </span>
                      {t("business.verification.in_progress")}
                    </span>
                  )}
                </div>

                {showDescription && step.description && (
                  <p
                    className={`mt-2 text-sm ${
                      isCurrent
                        ? getSemanticClass("warning", "text", false)
                        : isCompleted
                          ? getSemanticClass("success", "text", false)
                          : "text-slate-600"
                    }`}
                  >
                    {step.description}
                  </p>
                )}

                {step.timestamp && (
                  <p className="mt-2 text-xs text-slate-500">
                    {new Date(step.timestamp).toLocaleDateString()} at{" "}
                    {new Date(step.timestamp).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Box for Current Status */}
      {currentStatus === "REJECTED" && (
        <div
          className={`mt-6 flex gap-3 rounded-lg border p-4 ${getSemanticClass("danger", "border", true)} ${getSemanticClass("danger", "bg", true)}`}
        >
          <svg
            className={`h-6 w-6 shrink-0 ${getSemanticClass("danger", "icon")}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <p
              className={`font-semibold ${getSemanticClass("danger", "text", true)}`}
            >
              {t("business.verification.rejected_title")}
            </p>
            <p
              className={`mt-1 text-sm ${getSemanticClass("danger", "text", false)}`}
            >
              {t("business.verification.rejected_desc")}
            </p>
          </div>
        </div>
      )}

      {currentStatus === "APPROVED" && (
        <div
          className={`mt-6 flex gap-3 rounded-lg border p-4 ${getSemanticClass("success", "border", true)} ${getSemanticClass("success", "bg", true)}`}
        >
          <CheckCircle2
            className={`h-6 w-6 shrink-0 ${getSemanticClass("success", "icon")}`}
          />
          <div className="flex-1">
            <p
              className={`font-semibold ${getSemanticClass("success", "text", true)}`}
            >
              {t("business.verification.approved_title")}
            </p>
            <p
              className={`mt-1 text-sm ${getSemanticClass("success", "text", false)}`}
            >
              {t("business.verification.approved_message")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationStatus;
