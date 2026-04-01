import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { ApplicationCard, ApplicationFilters } from "../components";
import { useApplications, useApplicationFilters } from "../hooks";
import type { ApplicationStatus } from "../types";

interface ApplicationListPageProps {
  jobId?: number;
}

export const ApplicationListPage: React.FC<ApplicationListPageProps> = ({ jobId }) => {
  const navigate = useNavigate();
  const { t } = useAppTranslation();
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);

  const { applications, isLoading, pagination, handlePageChange, handleFilter } =
    useApplications({
      jobId,
      isCandidateView: false,
      autoFetch: true,
    });

  const { filters, handleStatusChange, handleKeywordChange, resetFilters } =
    useApplicationFilters({
      onFilterChange: handleFilter,
    });

  const handleViewDetail = (id: number) => {
    navigate(`/headhunter/applications/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("applications.pipeline")}
          </h1>
          <p className="text-gray-600 mt-2">
            {t("common.total")}: {pagination.totalElements}
          </p>
        </div>

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
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="p-4">
                    <Skeleton className="h-24 w-full" />
                  </Card>
                ))
              ) : applications.length === 0 ? (
                // Empty state
                <Card className="p-8 text-center">
                  <p className="text-gray-500">
                    {t("applications.empty.noCandidates")}
                  </p>
                </Card>
              ) : (
                // Applications list
                applications.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onViewDetail={handleViewDetail}
                    isHeadhunter={true}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {!isLoading && pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {t("common.page")} {pagination.page + 1} {t("common.of")}{" "}
                  {pagination.totalPages}
                </p>
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
          </div>
        </div>
      </div>
    </div>
  );
};