import React from "react";
import { useTranslation } from "react-i18next";
import type { PendingCandidate } from "../../types";
import { dashboardFormatters } from "../../shared/utils/dashboardFormatters";

interface PendingCandidatesProps {
  data: PendingCandidate[] | undefined;
  isLoading?: boolean;
}

/**
 * PendingCandidates - DASH-03 AC2
 * Section bên phải: Danh sách chờ duyệt (Pending Candidates)
 * Hiển thị ứng viên cần theo dõi để tổ chức công việc trong ngày
 */
export const PendingCandidates: React.FC<PendingCandidatesProps> = ({
  data,
  isLoading = false,
}) => {
  const { t } = useTranslation("dashboard");

  if (isLoading) {
    return (
      <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm text-center">
        <p className="text-3xl mb-3">✅</p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
          {t("headhunter.dashboard.pendingCandidates", "Pending Candidates")}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {t(
            "headhunter.dashboard.noPendingCandidates",
            "No candidates awaiting review"
          )}
        </p>
      </div>
    );
  }

  // Group by status
  const pendingCount = data.filter((c) => c.status === "PENDING").length;
  const approvedCount = data.filter((c) => c.status === "APPROVED").length;
  const rejectedCount = data.filter((c) => c.status === "REJECTED").length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
        <span>👥</span>
        {t("headhunter.dashboard.pendingCandidates", "Pending Candidates")}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        <span className="inline-block mr-3">
          ⏳ {pendingCount}{" "}
          {t("headhunter.dashboard.candidateDetails.pending", "Pending Review")}
        </span>
        <span className="inline-block mr-3">
          ✅ {approvedCount}{" "}
          {t("headhunter.dashboard.candidateDetails.approved", "Approved")}
        </span>
        <span className="inline-block">
          ❌ {rejectedCount}{" "}
          {t("headhunter.dashboard.candidateDetails.rejected", "Rejected")}
        </span>
      </p>

      <div className="space-y-3">
        {data.map((candidate) => {
          const statusConfig = {
            PENDING: {
              borderColor: "border-yellow-500 dark:border-yellow-400",
              bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
              badge:
                "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300",
              icon: "⏳",
            },
            APPROVED: {
              borderColor: "border-emerald-500 dark:border-emerald-400",
              bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
              badge:
                "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300",
              icon: "✅",
            },
            REJECTED: {
              borderColor: "border-red-500 dark:border-red-400",
              bgColor: "bg-red-50 dark:bg-red-950/20",
              badge:
                getSemanticClass("danger", "bg", true) +
                " text-red-800 dark:text-red-300",
              icon: "❌",
            },
          };

          const config =
            statusConfig[candidate.status as keyof typeof statusConfig] ||
            statusConfig.PENDING;

          return (
            <div
              key={candidate.id}
              className={`border-l-4 ${config.borderColor} pl-4 py-3 ${config.bgColor} rounded-r-lg`}
            >
              {/* Candidate Name */}
              <p className="font-semibold text-slate-900 dark:text-white text-sm">
                {config.icon} {candidate.name}
              </p>

              {/* Job Title */}
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {candidate.jobTitle}
              </p>

              {/* Submitted Date & Status Badge */}
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {t(
                    "headhunter.dashboard.candidateDetails.submitted",
                    "Submitted"
                  )}
                  : {dashboardFormatters.formatDate(candidate.submittedDate)}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${config.badge}`}
                >
                  {candidate.status === "PENDING"
                    ? t(
                        "headhunter.dashboard.candidateDetails.pending",
                        "Pending"
                      )
                    : candidate.status === "APPROVED"
                      ? t(
                          "headhunter.dashboard.candidateDetails.approved",
                          "Approved"
                        )
                      : t(
                          "headhunter.dashboard.candidateDetails.rejected",
                          "Rejected"
                        )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
