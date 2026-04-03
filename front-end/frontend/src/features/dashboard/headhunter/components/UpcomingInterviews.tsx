import React from "react";
import { useTranslation } from "react-i18next";
import type { UpcomingInterview } from "../../types";
import { dashboardFormatters } from "../../shared/utils/dashboardFormatters";

interface UpcomingInterviewsProps {
  data: UpcomingInterview[] | undefined;
  isLoading?: boolean;
}

/**
 * UpcomingInterviews - DASH-03 AC2
 * Section bên phải: Lịch phỏng vấn sắp tới
 * Hiển thị đầy đủ thông tin: Tên ứng viên, Job, Giờ, Địa điểm
 */
export const UpcomingInterviews: React.FC<UpcomingInterviewsProps> = ({
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
        <p className="text-3xl mb-3">📅</p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
          {t("headhunter.dashboard.upcomingInterviews", "Upcoming Interviews")}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {t(
            "headhunter.dashboard.noUpcomingInterviews",
            "No interviews scheduled"
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <span>📅</span>
        {t("headhunter.dashboard.upcomingInterviews", "Upcoming Interviews")}
      </h3>
      <div className="space-y-4">
        {data.map((interview) => (
          <div
            key={interview.id}
            className="border-l-4 border-emerald-500 dark:border-emerald-400 pl-4 py-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-r-lg"
          >
            {/* Candidate Name */}
            <p className="font-semibold text-slate-900 dark:text-white text-sm">
              {interview.candidateName}
            </p>

            {/* Job Title */}
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              <span className="inline-block mr-2">💼</span>
              {interview.jobTitle}
            </p>

            {/* Time & Location */}
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div>
                <p className="text-slate-500 dark:text-slate-500">
                  {t("headhunter.dashboard.interviewDetails.time", "Time")}
                </p>
                <p className="text-slate-900 dark:text-slate-200 font-medium">
                  {dashboardFormatters.formatDate(interview.scheduledDate)} ·{" "}
                  {interview.scheduledTime}
                </p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-500">
                  {t(
                    "headhunter.dashboard.interviewDetails.type",
                    "Interview Type"
                  )}
                </p>
                <p className="text-slate-900 dark:text-slate-200 font-medium">
                  {interview.interviewType || "Technical"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
