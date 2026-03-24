import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchJobs } from "../services/jobsApi";
import type { JobFilterParams, JobListResponse, JobSummary } from "../types";
import { FilterSidebar, JobCard } from "../components";
import { INITIAL_PAGE_SIZE } from "../utils";
// Local constants and UI implementations have been moved to shared components and utils.
// This file now imports `FilterSidebar` and `JobCard` from the central components index.

function SkeletonGrid() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"
        />
      ))}
    </>
  );
}

export function JobListPage() {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [meta, setMeta] = useState<Omit<JobListResponse, "data">>({
    page: 1,
    size: INITIAL_PAGE_SIZE,
    totalElements: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<JobFilterParams>({
    page: 1,
    size: INITIAL_PAGE_SIZE,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    fetchJobs(filters)
      .then((response) => {
        if (!active) return;
        setJobs(response.data);
        setMeta({
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
        });
      })
      .catch(() => {
        if (!active) return;
        setError("Unable to load jobs. Please try again later.");
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [filters]);

  const handlePageChange = (nextPage: number) => {
    setFilters((prev) => ({ ...prev, page: nextPage }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-slate-900 p-10 text-white shadow-lg">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">
            Opportunities for everyone
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight">
            Explore curated jobs that match your strengths.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-emerald-100">
            Filter by keywords, preferred work style, and salary expectations. Save
            your favorite roles or share them with friends.
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
                {error}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {isLoading && <SkeletonGrid />}
              {!isLoading && jobs.length === 0 && (
                <p className="col-span-full rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
                  No jobs found with the selected filters.
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
                <span>
                  Page {meta.page} of {meta.totalPages} — {meta.totalElements} jobs
                </span>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={meta.page === 1}
                    onClick={() => handlePageChange(meta.page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={meta.page === meta.totalPages}
                    onClick={() => handlePageChange(meta.page + 1)}
                  >
                    Next
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
