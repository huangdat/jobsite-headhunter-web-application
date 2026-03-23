/**
 * Verification Status Timeline Component
 * Displays verification progress steps
 */

import React from "react";
import { useTranslation } from "react-i18next";
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
      return <CheckCircle2 className="h-10 w-10 text-emerald-600" />;
    case "REJECTED":
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
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
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
      ) : (
        <Circle className="h-10 w-10 text-slate-300" />
      );
  }
};

const getStatusBadgeColor = (status: VerificationStatusType): string => {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-100 text-emerald-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
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
  const { t } = useTranslation();

  // Default timeline steps if not provided
  const defaultSteps: VerificationStep[] = [
    {
      status: "PENDING",
      label: t("business.verification.submitted", "Submitted"),
      description: t(
        "business.verification.submitted_desc",
        "Your profile is waiting for review"
      ),
    },
    {
      status: "APPROVED",
      label: t("business.verification.approved", "Approved"),
      description: t(
        "business.verification.approved_desc",
        "Profile verification complete"
      ),
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
            {t("business.verification.status", "Verification Status")}
          </h3>
          <p className="text-sm text-slate-600">
            {t(
              "business.verification.status_desc",
              "Track your profile verification progress"
            )}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${getStatusBadgeColor(currentStatus)}`}
        >
          {t(`business.verification.${currentStatus}`, currentStatus)}
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
                  className={`rounded-full p-1 ${isCurrent ? "bg-emerald-100" : isCompleted ? "bg-emerald-100" : "bg-slate-100"}`}
                >
                  {getStatusIcon(step.status, isCompleted)}
                </div>

                {/* Connector Line */}
                {index < timelineSteps.length - 1 && (
                  <div
                    className={`my-2 w-1 flex-1 min-h-10 ${
                      isCompleted
                        ? "bg-emerald-600"
                        : isCurrent
                          ? "bg-amber-400"
                          : "bg-slate-200"
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div
                className={`flex-1 rounded-lg border px-4 py-3 transition-colors ${
                  isCurrent
                    ? "border-amber-200 bg-amber-50"
                    : isCompleted
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <p
                    className={`font-semibold ${isCurrent ? "text-amber-900" : isCompleted ? "text-emerald-900" : "text-slate-700"}`}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 px-2 py-1 text-xs font-semibold text-amber-800">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-amber-600"></span>
                        <span className="inline-flex h-2 w-2 rounded-full bg-amber-600"></span>
                      </span>
                      {t("business.verification.in_progress", "In Progress")}
                    </span>
                  )}
                </div>

                {showDescription && step.description && (
                  <p
                    className={`mt-2 text-sm ${isCurrent ? "text-amber-800" : isCompleted ? "text-emerald-800" : "text-slate-600"}`}
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
        <div className="mt-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <svg
            className="h-6 w-6 shrink-0 text-red-600"
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
            <p className="font-semibold text-red-900">
              {t(
                "business.verification.rejected_title",
                "Verification Rejected"
              )}
            </p>
            <p className="mt-1 text-sm text-red-800">
              {t(
                "business.verification.rejected_desc",
                "Your profile was rejected. Please review the feedback and resubmit with corrections."
              )}
            </p>
          </div>
        </div>
      )}

      {currentStatus === "APPROVED" && (
        <div className="mt-6 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" />
          <div className="flex-1">
            <p className="font-semibold text-emerald-900">
              {t("business.verification.approved_title", "Profile Approved")}
            </p>
            <p className="mt-1 text-sm text-emerald-800">
              {t(
                "business.verification.approved_message",
                "Your business profile is now verified and visible to candidates."
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationStatus;
