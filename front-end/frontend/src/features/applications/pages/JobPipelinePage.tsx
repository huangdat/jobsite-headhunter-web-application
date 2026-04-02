import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicationsForJob } from "../services/applicationsApi";
import type { Application } from "../types";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export const JobPipelinePage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { t } = useAppTranslation();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!jobId) return;
      try {
        setLoading(true);
        const data = await getApplicationsForJob(Number(jobId), {
          page: 0,
          size: 20,
        });
        setApplications(data.content);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error(t("common.error"));
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [jobId, t]);

  if (loading)
    return (
      <div className="p-8 text-slate-500 animate-pulse">
        {t("headhunter.loadingApplicants")}
      </div>
    );

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-end mb-8 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            {t("headhunter.candidatesList")}
          </h1>
          <p className="text-slate-500 font-medium italic mt-1">
            {t("headhunter.jobIdLabel", { id: jobId })} —{" "}
            <span className="text-lime-600 font-bold">
              {t("headhunter.candidatesCount", { count: applications.length })}
            </span>
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="rounded-xl border-slate-200 hover:border-lime-400 hover:bg-lime-50 font-bold px-5 flex gap-2 cursor-pointer transition-all"
        >
          <ChevronLeft size={18} />
          {t("common.back")}
        </Button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-5 font-black text-[11px] text-slate-400 uppercase tracking-wider">
                {t("columns.candidate")}
              </th>
              <th className="p-5 font-black text-[11px] text-slate-400 uppercase tracking-wider">
                {t("applications.form.email")}
              </th>
              <th className="p-5 font-black text-[11px] text-slate-400 uppercase tracking-wider">
                {t("common.appliedAt")}
              </th>
              <th className="p-5 font-black text-[11px] text-slate-400 uppercase tracking-wider">
                {t("columns.status")}
              </th>
              <th className="p-5 font-black text-[11px] text-slate-400 uppercase tracking-wider text-right">
                {t("columns.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {applications.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-12 text-center text-slate-400 font-medium italic"
                >
                  {t("headhunter.noApplicantsYet")}
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-lime-50/20 transition-colors"
                >
                  <td className="p-5 font-bold text-slate-800">
                    {app.fullName}
                  </td>
                  <td className="p-5 text-slate-500 font-medium">
                    {app.email}
                  </td>
                  <td className="p-5 text-slate-500">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-lime-100 text-lime-700 rounded-full text-[10px] font-black uppercase tracking-tight">
                      {app.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={() =>
                        navigate(`/headhunter/applications/${app.id}`)
                      }
                      className="px-4 py-2 bg-lime-300 text-black rounded-xl text-xs font-bold hover:bg-lime-400 hover:text-black transition-all cursor-pointer active:scale-95"
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

export default JobPipelinePage;
