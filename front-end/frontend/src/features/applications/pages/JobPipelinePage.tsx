import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicationsForJob } from "../services/applicationsApi";
import type { Application } from "../types";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/shared/components/layout";
import { ChevronLeft } from "lucide-react";
import {
  MetaText,
  Caption,
  SubsectionTitle,
  SmallText,
} from "@/shared/components/typography/Typography";

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
            className="rounded-xl border-slate-200 dark:border-slate-700 hover:border-lime-500 hover:bg-lime-50 dark:hover:bg-slate-800 font-bold px-5 flex gap-2 cursor-pointer transition-all"
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
              <th className="p-5">
                <MetaText as="span">{t("columns.candidate")}</MetaText>
              </th>
              <th className="p-5">
                <MetaText as="span">{t("applications.form.email")}</MetaText>
              </th>
              <th className="p-5">
                <MetaText as="span">{t("common.appliedAt")}</MetaText>
              </th>
              <th className="p-5">
                <MetaText as="span">{t("columns.status")}</MetaText>
              </th>
              <th className="p-5 text-right">
                <MetaText as="span">{t("columns.actions")}</MetaText>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <Caption className="italic">
                    {t("headhunter.noApplicantsYet")}
                  </Caption>
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-brand-primary/5 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td className="p-5">
                    <SubsectionTitle className="text-base font-semibold">
                      {app.fullName}
                    </SubsectionTitle>
                  </td>
                  <td className="p-5">
                    <SmallText variant="muted" weight="medium">
                      {app.email}
                    </SmallText>
                  </td>
                  <td className="p-5 text-slate-500 dark:text-slate-400">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="p-5">
                    {/* Đổi màu Badge sang Lime */}
                    <span className="px-3 py-1 bg-lime-100 text-lime-700 dark:bg-lime-500/20 dark:text-lime-400 rounded-full text-[10px] font-black uppercase tracking-tight">
                      {app.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    {/* Đổi nút View Details sang nền Lime chữ đen chuẩn bài */}
                    <button
                      onClick={() =>
                        navigate(`/headhunter/applications/${app.id}`)
                      }
                      className="px-4 py-2 bg-lime-400 text-slate-900 rounded-xl text-xs font-bold hover:bg-lime-500 transition-all cursor-pointer active:scale-95 shadow-sm shadow-lime-500/20"
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
