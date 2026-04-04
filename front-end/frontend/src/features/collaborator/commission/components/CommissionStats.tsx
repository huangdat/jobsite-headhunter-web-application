/**
 * CommissionStats Component
 * PROF-04: Collaborator Commission
 * Displays commission statistics in sidebar
 */

import { useCommissionTranslation } from "@/shared/hooks/useFeatureTranslation";
import type { CommissionStats } from "../types/commission.types";

interface CommissionStatsProps {
  stats: CommissionStats | null;
  onRequestPayout?: (
    amount: number
  ) => Promise<{ success: boolean; payoutId: string }>;
}

/**
 * CommissionStats Component
 * Displays commission earnings, referrals, and payout information
 */
export function CommissionStats({
  stats,
  onRequestPayout,
}: CommissionStatsProps) {
  const { t } = useCommissionTranslation();

  if (!stats) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-slate-200 rounded-lg animate-pulse"></div>
        <div className="h-20 bg-slate-200 rounded-lg animate-pulse"></div>
        <div className="h-20 bg-slate-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Total Earnings Card */}
      <div className="bg-linear-to-br from-brand-primary/10 to-brand-primary/20 border border-brand-primary/30 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-brand-primary mb-1">
              {t("stats.totalEarnings")}
            </p>
            <p className="text-2xl font-bold text-black">
              {formatCurrency(stats.totalEarnings)}
            </p>
            <p className="text-xs text-brand-primary/80 mt-2">
              {t("stats.lifetimeTotal")}
            </p>
          </div>
          <div className="p-3 bg-brand-primary/30 rounded-lg">
            <span className="material-symbols-outlined text-brand-primary">
              trending_up
            </span>
          </div>
        </div>
      </div>

      {/* Pending vs Paid Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Pending Commissions */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-600 mb-1">{t("stats.pending")}</p>
          <p className="text-xl font-bold text-slate-900">
            {formatCurrency(stats.pendingCommissions)}
          </p>
          <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
            <span className="material-symbols-outlined text-sm">schedule</span>
            {t("stats.processingDays")}
          </div>
        </div>

        {/* Paid Commissions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-600 mb-1">{t("stats.paid")}</p>
          <p className="text-xl font-bold text-blue-900">
            {formatCurrency(stats.paidCommissions)}
          </p>
          <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
            <span className="material-symbols-outlined text-sm">
              check_circle
            </span>
            {t("stats.completed")}
          </div>
        </div>
      </div>

      {/* Referrals & Jobs Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Referrals */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-600 mb-1">{t("stats.referrals")}</p>
          <p className="text-2xl font-bold text-slate-900">
            {stats.referralsCount}
          </p>
          <p className="text-xs text-slate-600 mt-2">
            {t("stats.referralsHint")}
          </p>
        </div>

        {/* Active Jobs */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-600 mb-1">{t("stats.activeJobs")}</p>
          <p className="text-2xl font-bold text-slate-900">
            {stats.activeJobsReferred}
          </p>
          <p className="text-xs text-slate-600 mt-2">
            {t("stats.ongoingJobs")}
          </p>
        </div>
      </div>

      {/* Commission Rate */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600 mb-1">
              {t("stats.commissionRate")}
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {stats.commissionRate}%
            </p>
          </div>
          <div className="inline-style-alert text-right text-xs text-slate-600">
            <p>{t("stats.rateInfo")}</p>
          </div>
        </div>
      </div>

      {/* Conversion Rate (if available) */}
      {stats.conversionRate !== undefined && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 mb-1">
                {t("stats.conversionRate")}
              </p>
              <p className="text-lg font-bold text-slate-900">
                {stats.conversionRate}%
              </p>
              <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-brand-primary h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(stats.conversionRate, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payout Button */}
      {onRequestPayout && stats.pendingCommissions > 0 && (
        <button
          onClick={() => onRequestPayout(stats.pendingCommissions)}
          variant="brand-primary"
          className="w-full px-4 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">account_balance</span>
          {t("button.requestPayout")}
        </button>
      )}

      {/* Empty State */}
      {stats.totalEarnings === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <span className="material-symbols-outlined text-blue-600 mx-auto block mb-2">
            info
          </span>
          <p className="text-sm text-blue-700">{t("stats.noEarningsYet")}</p>
        </div>
      )}
    </div>
  );
}
