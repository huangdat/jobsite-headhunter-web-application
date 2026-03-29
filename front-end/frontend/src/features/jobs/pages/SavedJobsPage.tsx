import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useJobsTranslation,
  useSavedJobsQuery,
  useRemoveSavedJobMutation,
} from "@/shared/hooks";
import { useAuth } from "@/features/auth/context/useAuth";

// Helper function to extract error message from API errors
const getErrorMessage = (err: Error, fallback: string): string => {
  const apiError = err as unknown as {
    response?: { data?: { message?: string } };
  };
  return apiError?.response?.data?.message || err?.message || fallback;
};

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatSalaryRange } from "../utils";

export function SavedJobsPage() {
  const { t } = useJobsTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // React Query: fetch and cache saved jobs
  const {
    data: jobs = [],
    isLoading,
    error,
  } = useSavedJobsQuery(isAuthenticated);

  // Mutation: remove a saved job
  const removeJobMutation = useRemoveSavedJobMutation();

  const handleRemove = (jobId: number) => {
    removeJobMutation.mutate(jobId, {
      onSuccess: () => {
        toast.success(t("saved.jobRemovedSuccess"));
      },
      onError: (err: Error) => {
        toast.error(getErrorMessage(err, t("saved.unableToRemoveJob")));
      },
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-3xl bg-white"
            />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-3xl bg-white p-10 text-center shadow">
          <p className="text-slate-600">
            {t("saved.unableToLoadSavedJobs")}
          </p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            {t("saved.tryAgainButton")}
          </Button>
        </div>
      );
    }

    if (jobs.length === 0) {
      return (
        <div className="rounded-3xl bg-white p-10 text-center shadow">
          <p className="text-lg font-semibold text-slate-900">
            {t("saved.noSavedJobs")}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {t("saved.emptyStateHint")}
          </p>
          <Button className="mt-6" onClick={() => navigate("/jobs")}>
            {t("saved.browseJobsButton")}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.jobId}
            className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                {job.companyName ?? t("saved.confidentialCompany")}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                {job.title}
              </h3>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                <span>{job.location}</span>
                <span>
                  {t("saved.postedText")}{" "}
                  {job.postedDate
                    ? new Date(job.postedDate).toLocaleDateString("en-US")
                    : t("saved.recentlyPosted")}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <Badge variant="secondary">{job.status}</Badge>
                <span className="font-semibold text-slate-900">
                  {formatSalaryRange(
                    job.salaryMin,
                    job.salaryMax,
                    job.currency
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                className="sm:min-w-[calc(140px)]"
                onClick={() => navigate(`/jobs/${job.jobId}`)}
              >
                {t("saved.viewJobButton")}
              </Button>
              <Button
                variant="ghost"
                className="sm:min-w-[calc(140px)] text-red-600 hover:text-red-700"
                onClick={() => handleRemove(job.jobId)}
                disabled={removeJobMutation.isPending}
              >
                {removeJobMutation.isPending
                  ? t("saved.removingButton")
                  : t("saved.removeButton")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-slate-50 pb-16 pt-10">
      <div className="mx-auto max-w-6xl space-y-6 px-4">
        <div>
          <p className="text-sm text-slate-500">{t("saved.breadcrumb")}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            {t("saved.pageTitle")}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {t("saved.description")}
          </p>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}

