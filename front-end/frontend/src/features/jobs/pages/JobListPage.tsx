import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchJobs } from "../services/jobsApi";
import {
  getExperiencePresets,
  getSalaryPresets,
} from "../constants/filterPresets";
import type { JobFilterParams, JobListResponse, JobSummary } from "../types";

const INITIAL_PAGE_SIZE = 12;

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const formatSalary = (job: JobSummary) => {
  if (job.salaryMin && job.salaryMax) {
    return `${currencyFormatter.format(job.salaryMin)} - ${currencyFormatter.format(job.salaryMax)} ${job.currency}`;
  }

  if (job.salaryMin) {
    return `${currencyFormatter.format(job.salaryMin)} ${job.currency}`;
  }

  return "Contact for salary";
};

const MILLION = 1_000_000;

// Sidebar Filter Component
function FilterSidebar({
  filters,
  onFilterChange,
}: {
  filters: JobFilterParams;
  onFilterChange: (filters: JobFilterParams) => void;
}) {
  const [keyword, setKeyword] = useState(filters.keyword ?? "");
  const typingTimeoutRef = useRef<number | null>(null);
  const [experienceValue, setExperienceValue] = useState("ALL");
  const [salaryPreset, setSalaryPreset] = useState("ALL");
  const [customSalaryMin, setCustomSalaryMin] = useState("");
  const [customSalaryMax, setCustomSalaryMax] = useState("");

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = window.setTimeout(() => {
      onFilterChange({ ...filters, keyword: value || undefined, page: 1 });
    }, 400);
  };

  useEffect(
    () => () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    const nextKeyword = filters.keyword ?? "";
    if (nextKeyword !== keyword) {
      setKeyword(nextKeyword);
    }
  }, [filters.keyword, keyword]);

  useEffect(() => {
    const currentMin =
      typeof filters.experienceMin === "number"
        ? filters.experienceMin
        : undefined;
    const currentMax =
      typeof filters.experienceMax === "number"
        ? filters.experienceMax
        : undefined;

    if (currentMin === undefined && currentMax === undefined) {
      if (experienceValue !== "ALL") {
        setExperienceValue("ALL");
      }
      return;
    }

    const match = EXPERIENCE_PRESETS.find(
      (option) => option.min === currentMin && option.max === currentMax
    );
    if (match && experienceValue !== match.value) {
      setExperienceValue(match.value);
    }
  }, [filters.experienceMin, filters.experienceMax, experienceValue]);

  useEffect(() => {
    if (filters.negotiable) {
      if (salaryPreset !== "NEGOTIABLE") {
        setSalaryPreset("NEGOTIABLE");
      }
      if (customSalaryMin || customSalaryMax) {
        setCustomSalaryMin("");
        setCustomSalaryMax("");
      }
      return;
    }

    const currentMin =
      typeof filters.salaryMin === "number" ? filters.salaryMin : undefined;
    const currentMax =
      typeof filters.salaryMax === "number" ? filters.salaryMax : undefined;

    if (currentMin === undefined && currentMax === undefined) {
      if (salaryPreset !== "ALL") {
        setSalaryPreset("ALL");
      }
      if (customSalaryMin || customSalaryMax) {
        setCustomSalaryMin("");
        setCustomSalaryMax("");
      }
      return;
    }

    const match = SALARY_PRESETS.find(
      (option) =>
        !option.negotiable &&
        option.min === currentMin &&
        option.max === currentMax
    );

    if (match) {
      if (salaryPreset !== match.value) {
        setSalaryPreset(match.value);
      }
      if (customSalaryMin || customSalaryMax) {
        setCustomSalaryMin("");
        setCustomSalaryMax("");
      }
      return;
    }

    setSalaryPreset("CUSTOM");
    setCustomSalaryMin(currentMin ? String(currentMin / MILLION) : "");
    setCustomSalaryMax(currentMax ? String(currentMax / MILLION) : "");
  }, [
    filters.salaryMin,
    filters.salaryMax,
    filters.negotiable,
    salaryPreset,
    customSalaryMin,
    customSalaryMax,
  ]);

  const handleExperienceChange = (value: string) => {
    setExperienceValue(value);
    const selected = EXPERIENCE_PRESETS.find(
      (option) => option.value === value
    );
    onFilterChange({
      ...filters,
      experienceMin: selected?.min,
      experienceMax: selected?.max,
      page: 1,
    });
  };

  const handleSalaryPresetChange = (value: string) => {
    setSalaryPreset(value);
    setCustomSalaryMin("");
    setCustomSalaryMax("");
    const selected = SALARY_PRESETS.find((option) => option.value === value);
    onFilterChange({
      ...filters,
      salaryMin: selected?.min,
      salaryMax: selected?.max,
      negotiable: selected?.negotiable ?? undefined,
      page: 1,
    });
  };

  const handleCustomSalaryApply = () => {
    if (!customSalaryMin && !customSalaryMax) {
      handleSalaryPresetChange("ALL");
      return;
    }

    const minValue = customSalaryMin
      ? Number(customSalaryMin) * MILLION
      : undefined;
    const maxValue = customSalaryMax
      ? Number(customSalaryMax) * MILLION
      : undefined;

    if ((minValue ?? 0) > (maxValue ?? Infinity)) {
      return;
    }

    setSalaryPreset("CUSTOM");
    onFilterChange({
      ...filters,
      salaryMin: minValue,
      salaryMax: maxValue,
      negotiable: undefined,
      page: 1,
    });
  };

  const handleWorkingTypeChange = (type: string) => {
    onFilterChange({
      ...filters,
      workingType: type === "" ? undefined : (type as any),
      page: 1,
    });
  };

  const handleRankLevelChange = (rank: string) => {
    onFilterChange({
      ...filters,
      rankLevel: rank === "" ? undefined : (rank as any),
      page: 1,
    });
  };

  const handleReset = () => {
    setKeyword("");
    setExperienceValue("ALL");
    setSalaryPreset("ALL");
    setCustomSalaryMin("");
    setCustomSalaryMax("");
    onFilterChange({
      page: 1,
      size: INITIAL_PAGE_SIZE,
    });
  };

  return (
    <aside className="sticky top-20 h-fit space-y-6 rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      {/* Keyword Search */}
      <div>
        <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
          {t("jobs.list.filters.keyword")}
        </h3>
        <Input
          value={keyword}
          onChange={(e) => handleKeywordChange(e.target.value)}
          placeholder={t("jobs.list.filters.keywordPlaceholder")}
          className="text-sm"
        />
      </div>

      {/* Working Type Filter */}
      <div>
        <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
          {t("jobs.list.filters.workingType")}
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="workingType"
              value=""
              checked={!filters.workingType}
              onChange={(e) => handleWorkingTypeChange(e.target.value)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              {t("jobs.list.filters.allTypes")}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="workingType"
              value="ONSITE"
              checked={filters.workingType === "ONSITE"}
              onChange={(e) => handleWorkingTypeChange(e.target.value)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              {t("jobs.list.filters.onsite")}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="workingType"
              value="REMOTE"
              checked={filters.workingType === "REMOTE"}
              onChange={(e) => handleWorkingTypeChange(e.target.value)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              {t("jobs.list.filters.remote")}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="workingType"
              value="HYBRID"
              checked={filters.workingType === "HYBRID"}
              onChange={(e) => handleWorkingTypeChange(e.target.value)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              {t("jobs.list.filters.hybrid")}
            </span>
          </label>
        </div>
      </div>

      {/* Rank Level Filter */}
      <div>
        <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
          {t("jobs.list.filters.rankLevel")}
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rankLevel"
              value=""
              checked={!filters.rankLevel}
              onChange={(e) => handleRankLevelChange(e.target.value)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              {t("jobs.list.filters.allLevels")}
            </span>
          </label>
          {[
            "INTERN",
            "FRESHER",
            "JUNIOR",
            "MIDDLE",
            "SENIOR",
            "LEADER",
            "MANAGER",
          ].map((level) => (
            <label
              key={level}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="rankLevel"
                value={level}
                checked={filters.rankLevel === level}
                onChange={(e) => handleRankLevelChange(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {level.charAt(0) + level.slice(1).toLowerCase()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Filter */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {t("jobs.list.filters.experience")}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {EXPERIENCE_PRESETS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 rounded-xl border border-slate-100 px-3 py-2 text-sm text-slate-700 hover:border-emerald-300 dark:border-slate-700 dark:text-slate-200"
            >
              <input
                type="radio"
                name="experience"
                value={option.value}
                checked={experienceValue === option.value}
                onChange={(e) => handleExperienceChange(e.target.value)}
                className="h-4 w-4"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Salary Filter */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {t("jobs.list.filters.salary")}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {SALARY_PRESETS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 rounded-xl border border-slate-100 px-3 py-2 text-sm text-slate-700 hover:border-emerald-300 dark:border-slate-700 dark:text-slate-200"
            >
              <input
                type="radio"
                name="salary"
                value={option.value}
                checked={salaryPreset === option.value}
                onChange={(e) => handleSalaryPresetChange(e.target.value)}
                className="h-4 w-4"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              value={customSalaryMin}
              onChange={(e) => setCustomSalaryMin(e.target.value)}
              placeholder={t("jobs.list.filters.fromMillion")}
              className="text-sm"
            />
            <span className="text-slate-400">-</span>
            <Input
              type="number"
              min="0"
              value={customSalaryMax}
              onChange={(e) => setCustomSalaryMax(e.target.value)}
              placeholder={t("jobs.list.filters.toMillion")}
              className="text-sm"
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={handleCustomSalaryApply}
          >
            {t("jobs.list.filters.applyCustomRange")}
          </Button>
        </div>
      </div>

      {/* Reset Button */}
      <Button variant="ghost" className="w-full" onClick={handleReset}>
        {t("jobs.list.filters.clearAllFilters")}
      </Button>
    </aside>
  );
}

function JobCard({ job }: { job: JobSummary & { negotiable?: boolean } }) {
  const navigate = useNavigate();
  const deadlineLabel = useMemo(() => {
    if (!job.deadline) return null;
    const deadline = new Date(job.deadline);
    return deadline.toLocaleDateString();
  }, [job.deadline]);

  const handleNavigate = () => navigate(`/jobs/${job.id}`);
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigate();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      className="rounded-2xl border border-emerald-100/70 bg-white/80 p-5 shadow-sm shadow-emerald-50 transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none cursor-pointer"
      aria-label={t("jobs.list.viewJobLabel", { title: job.title })}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {job.title}
          </h3>
          {job.headhunterName && (
            <p className="text-sm text-slate-500">{job.headhunterName}</p>
          )}
        </div>
        <Badge variant="secondary" className="uppercase tracking-wide">
          {job.workingType}
        </Badge>
      </div>
      <div className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
        >
          {job.description ?? ""}
        </ReactMarkdown>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-400">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
          {job.city ?? t("jobs.list.flexible")}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
          {formatSalary(job)}
        </span>
        {deadlineLabel && (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800 dark:bg-amber-900/30 dark:text-amber-100">
            {t("jobs.list.applyBefore", { deadline: deadlineLabel })}
          </span>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
          #{job.jobCode}
        </span>
        <span className="text-sm font-semibold text-emerald-600">
          {t("jobs.list.viewDetails")}
        </span>
      </div>
    </div>
  );
}

export function JobListPage() {
  const { t } = useTranslation("jobs");
  const navigate = useNavigate();
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

  // Generate filter presets with i18n translations
  const EXPERIENCE_PRESETS = useMemo(() => getExperiencePresets(t), [t]);
  const SALARY_PRESETS = useMemo(() => getSalaryPresets(t), [t]);

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
                <span>
                  {t("jobs.list.pagination", {
                    page: meta.page,
                    totalPages: meta.totalPages,
                    totalElements: meta.totalElements,
                  })}
                </span>
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
