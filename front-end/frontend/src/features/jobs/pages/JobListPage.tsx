import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useJobsTranslation, useJobsQuery } from "@/shared/hooks";
import { Button } from "@/shared/ui-primitives/button";
import type { JobFilterParams, JobSummary } from "../types";
import { FilterSidebar, JobCard } from "../components";
import { INITIAL_PAGE_SIZE } from "../utils";
import { getJobs } from "../services/jobsApi";
import { jobKeys } from "@/shared/utils/queryKeys";
import { PageContainer, PageHeader } from "@/shared/common-blocks/layout";
import { PageSkeleton, ErrorState } from "@/shared/common-blocks/states";
import { Briefcase } from "lucide-react";
import { EmptyState } from "@/shared/common-blocks/EmptyState";

export function JobListPage() {
  const { t } = useJobsTranslation();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<JobFilterParams>({
    page: 1,
    size: INITIAL_PAGE_SIZE,
  });

  // React Query handles caching, loading, and error states automatically
  const { data: response, isLoading, error } = useJobsQuery(filters);

  const jobs = response?.data ?? [];
  const meta = response
    ? {
        page: response.page,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
      }
    : { page: 1, size: INITIAL_PAGE_SIZE, totalElements: 0, totalPages: 1 };

  const handlePageChange = (nextPage: number) => {
    setFilters((prev) => ({ ...prev, page: nextPage }));
  };

  // P2-8: Prefetch next page for instant pagination
  useEffect(() => {
    if (!isLoading && meta.page < meta.totalPages) {
      const nextPageFilters = { ...filters, page: meta.page + 1 };
      queryClient.prefetchQuery({
        queryKey: jobKeys.list(nextPageFilters),
        queryFn: () => getJobs(nextPageFilters),
        staleTime: 1000 * 60 * 2, // Match DYNAMIC_DATA_CONFIG
      });
    }
  }, [filters, meta.page, meta.totalPages, isLoading, queryClient]);

  return (
    <PageContainer>
      <PageHeader
        variant="gradient"
        title={t("list.hero.title")}
        description={t("list.hero.description")}
      />

      {/* Error State */}
      {error && (
        <ErrorState
          error={error as Error}
          variant="inline"
          title={t("list.unableToLoad")}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar Filters */}
        <FilterSidebar filters={filters} onFilterChange={setFilters} />

        {/* Jobs Grid */}
        <div className="lg:col-span-3">
          {/* Loading State */}
          {isLoading && <PageSkeleton variant="grid" columns={2} count={6} />}

          {/* Empty State */}
          {!isLoading && jobs.length === 0 && !error && (
            <EmptyState
              icon={Briefcase}
              title={t("list.noJobsFound")}
              description={t("list.hero.subtitle")}
            />
          )}

          {/* Jobs Grid */}
          {!isLoading && jobs.length > 0 && (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job as JobSummary & { negotiable?: boolean }}
                  />
                ))}
              </div>

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between rounded-2xl border border-slate-100 bg-white/70 px-6 py-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                  <span>{t("list.pagination")}</span>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={meta.page === 1}
                      onClick={() => handlePageChange(meta.page - 1)}
                    >
                      {t("list.previousPage")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={meta.page === meta.totalPages}
                      onClick={() => handlePageChange(meta.page + 1)}
                    >
                      {t("list.nextPage")}
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
}

