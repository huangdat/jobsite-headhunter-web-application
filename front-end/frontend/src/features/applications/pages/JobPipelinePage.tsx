import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicationsForJob } from "../services/applicationsApi";
import type { Application } from "../types";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/shared/components/layout";
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
      <PageContainer variant="white" maxWidth="6xl">
        <div className="p-8 text-slate-500 dark:text-slate-400 animate-pulse">
          {t("headhunter.loadingApplicants")}
        </div>
      </PageContainer>
    );

  return (
    <PageContainer variant="white" maxWidth="6xl">
      <PageHeader
        variant="default"
        title={t("headhunter.candidatesList")}
        description={`${t("headhunter.jobIdLabel", { id: jobId })} — ${t("headhunter.candidatesCount", { count: applications.length })}`}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="rounded-xl border-slate-200 dark:border-slate-700 hover:border-brand-primary hover:bg-lime-50 dark:hover:bg-slate-800 font-bold px-5 flex gap-2 cursor-pointer transition-all"
          >
            <ChevronLeft size={18} />
            {t("common.back")}
          </Button>
        }
      />

      <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
              <th className="p-5 font-black text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t("columns.candidate")}
              </th>
              <th className="p-5 font-black text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t("applications.form.email")}
              </th>
              <th className="p-5 font-black text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t("common.appliedAt")}
              </th>
              <th className="p-5 font-black text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t("columns.status")}
              </th>
              <th className="p-5 font-black text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">
                {t("columns.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
            {applications.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-12 text-center text-slate-400 dark:text-slate-500 font-medium italic"
                >
                  {t("headhunter.noApplicantsYet")}
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-lime-50/20 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td className="p-5 font-bold text-slate-800 dark:text-white">
                    {app.fullName}
                  </td>
                  <td className="p-5 text-slate-500 dark:text-slate-400 font-medium">
                    {app.email}
                  </td>
                  <td className="p-5 text-slate-500 dark:text-slate-400">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-tight">
                      {app.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={() =>
                        navigate(`/headhunter/applications/${app.id}`)
                      }
                      className="px-4 py-2 bg-brand-primary text-black rounded-xl text-xs font-bold hover:bg-lime-400 hover:text-black transition-all cursor-pointer active:scale-95 dark:bg-brand-primary dark:hover:bg-lime-400"
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
    </PageContainer>
  );
};

export default JobPipelinePage;
