import { useEffect, useState } from "react";
import { useJobsTranslation } from "@/shared/hooks/useFeatureTranslation";
import { Button } from "@/components/ui/button";
import { getJobs } from "../services/jobsApi";
import type { JobFilterParams, JobListResponse, JobSummary } from "../types";
import { FilterSidebar, JobCard } from "../components";
import { INITIAL_PAGE_SIZE } from "../utils";

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
  // const navigate = useNavigate(); // Unused
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
  // EXPERIENCE_PRESETS and SALARY_PRESETS are unused and removed

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    setError(null);

    getJobs(filters)
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
        setError(t("jobs.list.unableToLoad"));
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [filters, t]);

  const handlePageChange = (nextPage: number) => {
    setFilters((prev) => ({ ...prev, page: nextPage }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-3xl bg-linear-to-br from-emerald-500 to-slate-900 p-10 text-white shadow-lg">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">
            {t("jobs.list.hero.subtitle")}
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight">
            {t("jobs.list.hero.title")}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-emerald-100">
            {t("jobs.list.hero.description")}
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
                  {t("jobs.list.noJobsFound")}
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
                <span>{t("jobs.list.pagination")}</span>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={meta.page === 1}
                    onClick={() => handlePageChange(meta.page - 1)}
                  >
                    {t("jobs.list.previousPage")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={meta.page === meta.totalPages}
                    onClick={() => handlePageChange(meta.page + 1)}
                  >
                    {t("jobs.list.nextPage")}
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
