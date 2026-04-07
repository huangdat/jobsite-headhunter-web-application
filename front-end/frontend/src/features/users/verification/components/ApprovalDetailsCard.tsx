/**
 * ApprovalDetailsCard
 * PROF-05: Business Verification Admin Module
 *
 * Sticky approval workflow card with:
 * - Officer information
 * - Compliance score with progress bar
 * - Automated actions checklist
 * - Action buttons (Approve/Reject)
 */

import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { Button } from "@/components/ui/button";
import type { Verification } from "../types";
import { getSemanticClass } from "@/lib/design-tokens";

interface ApprovalDetailsCardProps {
  verification: Verification;
  onApprove?: () => void;
  onReject?: () => void;
  isApproving?: boolean;
  isRejecting?: boolean;
  isReadOnly?: boolean;
}

export const ApprovalDetailsCard: React.FC<ApprovalDetailsCardProps> = ({
  verification,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false,
  isReadOnly = false,
}) => {
  const { t } = useAppTranslation();

  // Determine score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return getSemanticClass("success", "text", true);
    if (score >= 50) return getSemanticClass("warning", "text", true);
    return getSemanticClass("danger", "text", true);
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-green-500 to-green-400";
    if (score >= 50) return "bg-gradient-to-r from-amber-500 to-amber-400";
    return "bg-gradient-to-r from-red-500 to-red-400";
  };

  const canApprove =
    !isReadOnly && verification.status === "PENDING" && !isApproving;
  const canReject =
    !isReadOnly && verification.status === "PENDING" && !isRejecting;

  return (
    <div className="bg-slate-900 rounded-xl p-6 text-white space-y-6 h-fit sticky top-4">
      {/* Officer Info Section */}
      <div>
        <label className="text-xs text-slate-400 uppercase">
          {t("verification.cards.approvalDetails.officer")}
        </label>
        <div className="mt-3">
          <p className="font-semibold">
            {verification.approvedBy?.name || "-"}
          </p>
          <p className="text-sm text-slate-400">
            {verification.approvedBy?.avatarRole || "-"}
          </p>
          {verification.approvedAt && (
            <p className="text-xs text-slate-500 mt-2">
              {new Date(verification.approvedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Compliance Score */}
      <div className="pb-6 border-b border-slate-700">
        <label className="text-xs text-slate-400 uppercase">
          {t("verification.cards.approvalDetails.complianceScore")}
        </label>
        <div className="mt-3">
          <div
            className={`text-4xl font-bold ${getScoreColor(verification.complianceScore)}`}
          >
            {verification.complianceScore}
            <span className="text-lg text-slate-400">%</span>
          </div>

          {/* Progress Bar */}
          <div className="bg-slate-700 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className={`h-full ${getProgressColor(verification.complianceScore)} transition-all duration-500`}
              style={{ width: `${verification.complianceScore}%` }}
            />
          </div>

          {/* Score Level */}
          <p className="text-xs text-slate-400 mt-2">
            {verification.complianceScore >= 80
              ? t("verification.cards.approvalDetails.highScore")
              : verification.complianceScore >= 50
                ? t("verification.cards.approvalDetails.mediumScore")
                : t("verification.cards.approvalDetails.lowScore")}
          </p>
        </div>
      </div>

      {/* Automated Actions */}
      <div className="pb-6 border-b border-slate-700">
        <label className="text-xs text-slate-400 uppercase">
          {t("verification.cards.approvalDetails.automatedActions")}
        </label>
        <div className="space-y-2 mt-3">
          {verification.automatedActions &&
          verification.automatedActions.length > 0 ? (
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            verification.automatedActions.map((action: any) => (
              <div key={action.id} className="flex items-center gap-2 text-sm">
                <CheckCircle
                  size={16}
                  className={
                    action.status === "COMPLETED"
                      ? getSemanticClass("success", "text", true)
                      : "text-slate-600"
                  }
                />
                <span
                  className={
                    action.status === "COMPLETED"
                      ? "text-slate-300"
                      : "text-slate-500"
                  }
                >
                  {action.type} -{" "}
                  <span className="text-xs">{action.status.toLowerCase()}</span>
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              {t("verification.cards.approvalDetails.noActions")}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {!isReadOnly && verification.status === "PENDING" ? (
        <div className="space-y-2 pt-2">
          <Button
            onClick={onApprove}
            disabled={!canApprove}
            className="w-full bg-linear-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium"
          >
            {isApproving
              ? t("verification.cards.approvalDetails.approving")
              : t("verification.cards.approvalDetails.approve")}
          </Button>
          <Button
            onClick={onReject}
            disabled={!canReject}
            variant="outline"
            className="w-full border-slate-600 text-white hover:bg-slate-800"
          >
            {isRejecting
              ? t("verification.cards.approvalDetails.rejecting")
              : t("verification.cards.approvalDetails.reject")}
          </Button>
        </div>
      ) : (
        <div className="pt-2 flex items-center gap-2 text-sm text-slate-400 bg-slate-800 rounded-lg p-3">
          <AlertCircle size={16} />
          <span>
            {verification.status === "APPROVED"
              ? t("verification.cards.approvalDetails.alreadyApproved")
              : t("verification.cards.approvalDetails.alreadyRejected")}
          </span>
        </div>
      )}
    </div>
  );
};
