import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicationsForJob } from "../services/applicationsApi";
import type { Application } from "../types";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";

export const JobPipelinePage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { t } = useAppTranslation(); // Đã gọi hook dịch

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy danh sách
  useEffect(() => {
    const fetchApplications = async () => {
      if (!jobId) return;
      try {
        setLoading(true);
        // Gọi hàm từ file applicationApi.ts của bạn
        const data = await getApplicationsForJob(Number(jobId), {
          page: 0,
          size: 10,
        });
        setApplications(data.content); // data.content là mảng ứng viên
      } catch (error) {
        console.error("Lỗi khi tải danh sách ứng viên:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  if (loading)
    return <div className="p-6">{t("headhunter.loadingApplicants")}</div>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {t("headhunter.candidatesList")} (Job ID: {jobId})
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded hover:bg-slate-100"
        >
          {t("common.back")}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-4 font-semibold text-slate-600">
                {t("columns.candidate")}
              </th>
              <th className="p-4 font-semibold text-slate-600">
                {t("applications.form.email")}
              </th>
              <th className="p-4 font-semibold text-slate-600">
                {t("common.appliedAt")}
              </th>
              <th className="p-4 font-semibold text-slate-600">
                {t("columns.status")}
              </th>
              <th className="p-4 font-semibold text-slate-600">
                {t("columns.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  {t("headhunter.noApplicantsYet")}
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">
                    {app.fullName}
                  </td>
                  <td className="p-4 text-slate-600">{app.email}</td>
                  <td className="p-4 text-slate-600">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {/* Chỗ này nếu muốn đẹp bạn có thể dùng cái <ApplicationStatusBadge /> giống file Detail thay vì thẻ span nhé */}
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/headhunter/applications/${app.id}`)
                      }
                      className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 shadow-sm"
                    >
                      {t("actions.viewDetails")}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
