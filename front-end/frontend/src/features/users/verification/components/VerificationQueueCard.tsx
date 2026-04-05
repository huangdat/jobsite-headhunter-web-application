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
      ? "bg-amber-100 text-amber-700"
      : verification.status === "APPROVED"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700";

  const complianceColor =
    verification.complianceScore >= 80
      ? "text-green-700"
      : verification.complianceScore >= 50
        ? "text-amber-700"
        : "text-red-700";

  return (
    <div
      onClick={onClick}
      className="group p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between">
        {/* Left: Company Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">
            {verification.business.companyName}
          </h3>
          <div className="text-sm text-slate-600 mt-1 space-y-1">
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
