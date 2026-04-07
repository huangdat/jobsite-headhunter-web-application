import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui-primitives/button";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { SmallText } from "@/shared/common-blocks/typography/Typography";
import { ApplicationCard, ApplicationFilters } from "../components";
import { useApplications, useApplicationFilters } from "../hooks";
import { PageContainer, PageHeader } from "@/shared/common-blocks/layout";
import { PageSkeleton } from "@/shared/common-blocks/states";
import { ErrorState } from "@/shared/common-blocks/states/ErrorState";
import { EmptyState } from "@/shared/common-blocks/EmptyState";
import { FileText } from "lucide-react";

interface ApplicationListPageProps {
  jobId?: number;
}

export const ApplicationListPage: React.FC<ApplicationListPageProps> = ({
  jobId,
}) => {
  const navigate = useNavigate();
  const { t } = useAppTranslation();

  const {
    applications,
    isLoading,
    error,
    pagination,
    handlePageChange,
    handleFilter,
    refetch,
  } = useApplications({
    jobId,
    isCandidateView: false,
    autoFetch: true,
  });

  const { handleStatusChange, handleKeywordChange, resetFilters } =
    useApplicationFilters({
      onFilterChange: handleFilter,
    });

  const handleViewDetail = (id: number) => {
    navigate(`/headhunter/applications/${id}`);
  };

  return (
    <PageContainer variant="white">
      <PageHeader
        variant="default"
        title={t("applications.pipeline")}
        description={`${t("common.total")}: ${pagination.totalElements}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ApplicationFilters
            onFilterChange={(keyword, status) => {
              handleKeywordChange(keyword);
              if (status) {
                handleStatusChange(status);
              }
            }}
            onReset={resetFilters}
          />
        </div>

        {/* Applications List */}
        <div className="lg:col-span-3">
          {/* Error State */}
          {error && (
            <ErrorState
              error={new Error(error)}
              onRetry={() => refetch()}
              variant="inline"
            />
          )}

          {/* Loading State */}
          {!error && isLoading && <PageSkeleton variant="list" count={3} />}

          {/* Empty State */}
          {!isLoading && applications.length === 0 && (
            <EmptyState
              icon={FileText}
              title={t("applications.empty.noCandidates")}
              description={t("applications.empty.description")}
            />
          )}

          {/* Applications List */}
          {!isLoading && applications.length > 0 && (
            <>
              <div className="space-y-4">
                {applications.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onViewDetail={handleViewDetail}
                    isHeadhunter={true}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <SmallText variant="muted">
                    {t("common.page")} {pagination.page + 1} {t("common.of")}{" "}
                    {pagination.totalPages}
                  </SmallText>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={pagination.page === 0}
                      onClick={() => handlePageChange(pagination.page - 1)}
                    >
                      {t("common.previous")}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={pagination.page === pagination.totalPages - 1}
                      onClick={() => handlePageChange(pagination.page + 1)}
                    >
                      {t("common.next")}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

