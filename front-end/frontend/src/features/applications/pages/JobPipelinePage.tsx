import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/shared/components/layout";
import { ChevronLeft } from "lucide-react";
import {
  MetaText,
  Caption,
  SubsectionTitle,
  SmallText,
} from "@/shared/components/typography/Typography";
import { useAppTranslation, useHeadhunterTranslation } from "@/shared/hooks";
import { PageSkeleton } from "@/shared/components/states";
import { ErrorState } from "@/shared/components/states/ErrorState";
import { useApplications } from "../hooks";
import type { ApplicationStatus } from "../types";
import { APPLICATION_STATUS_LABELS } from "../utils";

const JobPipelineContent: React.FC<{
  jobId?: string;
  jobIdNumber?: number;
}> = ({ jobId, jobIdNumber }) => {
  const navigate = useNavigate();
  const { t } = useAppTranslation();
  const { t: tHeadhunter } = useHeadhunterTranslation();

  const pageSize = 20;

  const { applications, isLoading, error, pagination, fetchApplications } =
    useApplications({
      jobId: jobIdNumber,
      isCandidateView: false,
      autoFetch: false,
    });

  const allStatusValue = "ALL" as const;
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [status, setStatus] = useState<
    ApplicationStatus | typeof allStatusValue
  >(allStatusValue);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
    }, 300);

    return () => {
      window.clearTimeout(debounceTimer);
    };
  }, [keyword]);

  useEffect(() => {
    if (!jobIdNumber) return;
    fetchApplications({
      page,
      size: pageSize,
      status: status === allStatusValue ? undefined : status,
      keyword: debouncedKeyword || undefined,
    });
  }, [
    jobIdNumber,
    page,
    pageSize,
    status,
    debouncedKeyword,
    fetchApplications,
  ]);

  const handleResetFilters = () => {
    setKeyword("");
    setDebouncedKeyword("");
    setStatus(allStatusValue);
    setPage(0);
  };

  const totalCandidates = pagination.totalElements || applications.length;
  const isInitialLoading = isLoading && applications.length === 0;

  if (isInitialLoading) {
    return (
      <PageContainer variant="white" maxWidth="6xl">
        <PageSkeleton variant="list" count={3} />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer variant="white" maxWidth="6xl">
        <ErrorState
          error={new Error(error)}
          onRetry={() => window.location.reload()}
          title={t("applications.errorLoading")}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="white" maxWidth="6xl">
      <PageHeader
        variant="default"
        title={t("headhunter.candidatesList")}
        description={`${t("headhunter.jobIdLabel", { id: jobId })} — ${t("headhunter.candidatesCount", { count: totalCandidates })}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="rounded-xl border-slate-200 dark:border-slate-700 hover:border-lime-500 hover:bg-lime-50 dark:hover:bg-slate-800 font-bold px-5 flex gap-2 cursor-pointer transition-all"
            >
              <ChevronLeft size={18} />
              {t("common.back")}
            </Button>
          </div>
        }
      />

      <div className="mt-6 rounded-3xl border border-slate-100 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.5fr_1fr_auto] md:items-end">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
              {t("applications.filter.search")}
            </label>
            <Input
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value);
                setPage(0);
              }}
              placeholder={t("applications.filter.search")}
              className="bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
              {t("applications.filter.status")}
            </label>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value as ApplicationStatus | typeof allStatusValue);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-full bg-white dark:bg-slate-900">
                <SelectValue placeholder={t("applications.filter.all")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={allStatusValue}>
                  {t("applications.filter.all")}
                </SelectItem>
                {Object.entries(APPLICATION_STATUS_LABELS).map(
                  ([key, labelKey]) => (
                    <SelectItem key={key} value={key}>
                      {t(labelKey)}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="rounded-xl border-slate-200 dark:border-slate-700 hover:border-lime-500 hover:bg-lime-50 dark:hover:bg-slate-800 font-bold px-5"
          >
            {tHeadhunter("filters.actions.clearAll")}
          </Button>
        </div>

        {isLoading && !isInitialLoading && (
          <SmallText variant="muted" className="mt-3">
            {t("common.loading")}
          </SmallText>
        )}
      </div>

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
            {error ? (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <Caption variant="error" className="italic">
                    {error}
                  </Caption>
                </td>
              </tr>
            ) : isInitialLoading ? (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <Caption className="italic">
                    {t("headhunter.loadingApplicants")}
                  </Caption>
                </td>
              </tr>
            ) : applications.length === 0 ? (
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
                    <span className="px-3 py-1 bg-lime-100 text-lime-700 dark:bg-lime-500/20 dark:text-lime-400 rounded-full text-[10px] font-black uppercase tracking-tight">
                      {app.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <Button
                      onClick={() =>
                        navigate(`/headhunter/applications/${app.id}`)
                      }
                      className="bg-slate-700 text-white hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700 shadow-sm shadow-slate-700/20"
                      size="sm"
                    >
                      {t("actions.viewDetails")}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <SmallText variant="muted">
            {t("common.page")} {pagination.page + 1} {t("common.of")}{" "}
            {pagination.totalPages}
          </SmallText>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={pagination.page === 0 || isLoading}
              onClick={() => setPage(pagination.page - 1)}
            >
              {t("common.previous")}
            </Button>
            <Button
              variant="outline"
              disabled={
                pagination.page >= pagination.totalPages - 1 || isLoading
              }
              onClick={() => setPage(pagination.page + 1)}
            >
              {t("common.next")}
            </Button>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export const JobPipelinePage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const jobIdNumber = jobId ? Number(jobId) : undefined;

  return (
    <JobPipelineContent
      key={jobId ?? "unknown"}
      jobId={jobId}
      jobIdNumber={jobIdNumber}
    />
  );
};

export default JobPipelinePage;
