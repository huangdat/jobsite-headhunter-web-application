/**
 * VerificationQueueCard
 * PROF-05: Business Verification Admin Module
 *
 * Displays individual verification item in queue/list
 * - Company name and tax ID
 * - Status badge
 * - Compliance score
 * - Submission date
 * - Clickable for navigation
 */

import React from "react";
import { Calendar } from "lucide-react";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import type { Verification } from "../types";
import { getSemanticClass } from "@/lib/design-tokens";

interface VerificationQueueCardProps {
  verification: Verification;
  onClick?: () => void;
}

export const VerificationQueueCard: React.FC<VerificationQueueCardProps> = ({
  verification,
  onClick,
}) => {
  const { t } = useAppTranslation();

  const statusColor =
    verification.status === "PENDING"
      ? `${getSemanticClass("warning", "bg", true)} ${getSemanticClass("warning", "text", true)}`
      : verification.status === "APPROVED"
        ? `${getSemanticClass("success", "bg", true)} ${getSemanticClass("success", "text", true)}`
        : `${getSemanticClass("danger", "bg", true)} ${getSemanticClass("danger", "text", true)}`;

  const complianceColor =
    verification.complianceScore >= 80
      ? getSemanticClass("success", "text", true)
      : verification.complianceScore >= 50
        ? getSemanticClass("warning", "text", true)
        : getSemanticClass("danger", "text", true);

  return (
    <div
      onClick={onClick}
      className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 hover:shadow-md dark:hover:shadow-slate-900/50 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between">
        {/* Left: Company Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">
            {verification.business.companyName}
          </h3>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 space-y-1">
            <p>
              {t("verification.fields.taxId")}: {verification.business.taxId}
            </p>
            <p className="flex items-center gap-2 mt-2">
              <Calendar size={14} />
              {t("verification.cards.queueItem.submitted")}{" "}
              {new Date(verification.submittedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Right: Status & Score */}
        <div className="text-right">
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}
          >
            {t(
              verification.status === "PENDING"
                ? "verification.status.pending"
                : verification.status === "APPROVED"
                  ? "verification.status.approved"
                  : "verification.status.rejected"
            )}
          </div>
          <div className={`text-sm ${complianceColor} mt-2 font-semibold`}>
            {verification.complianceScore}%{" "}
            {t("verification.fields.complianceScore")}
          </div>
        </div>
      </div>
    </div>
  );
};
