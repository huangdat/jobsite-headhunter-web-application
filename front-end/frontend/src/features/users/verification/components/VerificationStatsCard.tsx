/**
 * VerificationStatsCard
 * PROF-05: Business Verification Admin Module
 *
 * Displays KPI statistics in a dark card layout
 * - Total Pending
 * - Total Approved
 * - Completion Rate (%)
 */

import React from "react";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import type { VerificationStats } from "../types";

interface VerificationStatsCardProps {
  stats: VerificationStats | null;
  isLoading?: boolean;
}

export const VerificationStatsCard: React.FC<VerificationStatsCardProps> = ({
  stats,
  isLoading = false,
}) => {
  const { t } = useAppTranslation();

  if (isLoading || !stats) {
    return (
      <div className="bg-slate-900 text-white rounded-xl p-6 mb-8 grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <div className="h-4 bg-slate-700 rounded w-20 mb-2" />
            <div className="h-8 bg-slate-700 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white rounded-xl p-6 mb-8 grid grid-cols-3 gap-4">
      {/* Pending */}
      <div>
        <div className="text-sm text-slate-400 mb-1">
          {t("verification.cards.stats.pending")}
        </div>
        <div className="text-3xl font-bold">{stats.currentPending}</div>
        <div className="text-xs text-slate-500 mt-2">
          {t("verification.cards.stats.awaitingReview")}
        </div>
      </div>

      {/* Approved */}
      <div>
        <div className="text-sm text-slate-400 mb-1">
          {t("verification.cards.stats.approved")}
        </div>
        <div
          className={`text-3xl font-bold ${getSemanticClass("success", "text", true)}`}
        >
          {stats.totalApproved}
        </div>
        <div className="text-xs text-slate-500 mt-2">
          {t("verification.cards.stats.successfulApprovals")}
        </div>
      </div>

      {/* Completion Rate */}
      <div>
        <div className="text-sm text-slate-400 mb-1">
          {t("verification.cards.stats.completionRate")}
        </div>
        <div className="text-3xl font-bold text-lime-400">
          {stats.approvalRate}%
        </div>
        <div className="text-xs text-slate-500 mt-2">
          {t("verification.cards.stats.ofTotalSubmissions")}
        </div>
      </div>
    </div>
  );
};
