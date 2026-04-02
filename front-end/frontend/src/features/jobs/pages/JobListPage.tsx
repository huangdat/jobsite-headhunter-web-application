import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useJobsTranslation, useJobsQuery } from "@/shared/hooks";
import { Button } from "@/components/ui/button";
import type { JobFilterParams, JobSummary } from "../types";
import { FilterSidebar, JobCard } from "../components";
import { INITIAL_PAGE_SIZE } from "../utils";
import { getJobs } from "../services/jobsApi";
import { jobKeys } from "@/shared/utils/queryKeys";

function SkeletonGrid() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"
        />
      ))}
    </>
  );
}

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-3xl bg-linear-to-br from-emerald-500 to-slate-900 p-10 text-white shadow-lg">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">
            {t("list.hero.subtitle")}
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight">
            {t("list.hero.title")}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-emerald-100">
            {t("list.hero.description")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 pb-10">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar Filters */}
          <FilterSidebar filters={filters} onFilterChange={setFilters} />

          {/* Jobs Grid */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive">
                {t("list.unableToLoad")}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {isLoading && <SkeletonGrid />}
              {!isLoading && jobs.length === 0 && (
                <p className="col-span-full rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
                  {t("list.noJobsFound")}
                </p>
              )}
              {!isLoading &&
                jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job as JobSummary & { negotiable?: boolean }}
                  />
                ))}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && !isLoading && (
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
          </div>
        </div>
      </div>
    </div>
  );
}
