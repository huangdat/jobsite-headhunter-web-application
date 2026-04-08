import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { getSemanticClass } from "@/lib/design-tokens";
import {
  useJobsTranslation,
  useSavedJobsQuery,
  useRemoveSavedJobMutation,
} from "@/shared/hooks";
import {
  SmallText,
  MetaText,
  SubsectionTitle,
} from "@/shared/common-blocks/typography/Typography";
import { useAuth } from "@/features/auth/context/useAuth";
import { Button } from "@/shared/ui-primitives/button";
import { Badge } from "@/shared/ui-primitives/badge";
import { formatSalaryRange } from "../utils";
import { PageContainer, PageHeader } from "@/shared/common-blocks/layout";
import { PageSkeleton, ErrorState } from "@/shared/common-blocks/states";
import { EmptyState } from "@/shared/common-blocks/EmptyState";
import { Bookmark } from "lucide-react";

// Helper function to extract error message from API errors
const getErrorMessage = (err: Error, fallback: string): string => {
  const apiError = err as unknown as {
    response?: { data?: { message?: string } };
  };
  return apiError?.response?.data?.message || err?.message || fallback;
};

export function SavedJobsPage() {
  const { t } = useJobsTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // React Query: fetch and cache saved jobs
  const {
    data: jobs = [],
    isLoading,
    error,
    refetch: refetchSavedJobs,
  } = useSavedJobsQuery(isAuthenticated);

  // Force refetch saved jobs when entering page to get fresh data
  useEffect(() => {
    if (isAuthenticated) {
      refetchSavedJobs();
    }
  }, [isAuthenticated, refetchSavedJobs]);

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
      return <PageSkeleton variant="list" count={3} />;
    }

    if (error) {
      return (
        <ErrorState
          variant="card"
          title={t("saved.unableToLoadSavedJobs")}
          onRetry={() => window.location.reload()}
        />
      );
    }

    if (jobs.length === 0) {
      return (
        <EmptyState
          icon={Bookmark}
          title={t("saved.noSavedJobs")}
          description={t("saved.emptyStateHint")}
          actionLabel={t("saved.browseJobsButton")}
          onAction={() => navigate("/jobs")}
        />
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
              <MetaText className={getSemanticClass("success", "text", true)}>
                {job.companyName ?? t("saved.confidentialCompany")}
              </MetaText>
              <SubsectionTitle className="mt-1">{job.title}</SubsectionTitle>
              <div className="mt-2 flex flex-wrap gap-3">
                <SmallText variant="muted">{job.location}</SmallText>
                <SmallText variant="muted">
                  {t("saved.postedText")}{" "}
                  {job.postedDate
                    ? new Date(job.postedDate).toLocaleDateString("en-US")
                    : t("saved.recentlyPosted")}
                </SmallText>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Badge variant="secondary">{job.status}</Badge>
                <SmallText weight="bold" className="text-slate-900">
                  {formatSalaryRange(
                    job.salaryMin,
                    job.salaryMax,
                    job.currency
                  )}
                </SmallText>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                className="sm:min-w-[calc(140px)] cursor-pointer"
                onClick={() => navigate(`/jobs/${job.jobId}`)}
              >
                {t("saved.viewJobButton")}
              </Button>
              <Button
                variant="ghost"
                className={`sm:min-w-[calc(140px)] ${getSemanticClass("danger", "text", true)} hover:${getSemanticClass("danger", "text", true)} cursor-pointer`}
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
    <PageContainer variant="white">
      <PageHeader
        variant="default"
        title={t("saved.pageTitle")}
        description={t("saved.description")}
      />

      {renderContent()}
    </PageContainer>
  );
}
