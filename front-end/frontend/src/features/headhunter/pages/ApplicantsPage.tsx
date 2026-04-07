import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getSemanticClass } from "@/lib/design-tokens";
import { PageContainer, PageHeader } from "@/shared/components/layout";
import { ErrorState, PageSkeleton } from "@/shared/components/states";
import { EmptyState } from "@/shared/components/EmptyState";
import { getErrorMessage } from "@/shared/api/errorHandler";
import { useHeadhunterTranslation } from "@/shared/hooks";
import { CANDIDATE_FILTER_QUERY_KEYS } from "@/features/headhunter/api/constants";
import { CandidateFilterPanel } from "@/features/headhunter/candidates/components/CandidateFilterPanel";
import { CandidateFilterTag } from "@/features/headhunter/candidates/components/CandidateFilterTag";
import { CandidatePagination } from "@/features/headhunter/candidates/components/CandidatePagination";
import {
  CANDIDATE_INDUSTRY_OPTIONS,
  CANDIDATE_LOCATION_OPTIONS,
  CANDIDATE_STATUS_OPTIONS,
  createDefaultCandidateFilters,
  type CandidateAccount,
  type CandidateAccountStatus,
  type CandidateFilterParams,
  type CandidateFilterStatus,
} from "@/features/headhunter/candidates/types";
import { filterCandidates } from "@/features/headhunter/candidates/services/candidateFilterApi";
import { Briefcase } from "lucide-react";

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 12;
const RATE_LIMIT_WINDOW_MS = 60_000;

const normalizeList = (values: string[]) => {
  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value, index, self) => self.indexOf(value) === index);
};

const parseNumberParam = (params: URLSearchParams, key: string) => {
  const raw = params.get(key);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseDateParam = (params: URLSearchParams, key: string) => {
  const raw = params.get(key);
  return raw ? raw : null;
};

const parseSearchParams = (params: URLSearchParams) => {
  const filters = createDefaultCandidateFilters();
  const statusValues = new Set(
    CANDIDATE_STATUS_OPTIONS.map((option) => option.value)
  );
  const locationValues = new Set(
    CANDIDATE_LOCATION_OPTIONS.map((option) => option.value)
  );
  const industryValues = new Set(
    CANDIDATE_INDUSTRY_OPTIONS.map((option) => option.value)
  );

  filters.statuses = normalizeList(params.getAll("status")).filter((value) =>
    statusValues.has(value)
  ) as CandidateFilterStatus[];
  filters.locations = normalizeList(params.getAll("locations")).filter(
    (value) => locationValues.has(value)
  );
  filters.industries = normalizeList(params.getAll("industries")).filter(
    (value) => industryValues.has(value)
  );
  filters.experienceMin = parseNumberParam(params, "expMin");
  filters.experienceMax = parseNumberParam(params, "expMax");
  filters.registeredFrom = parseDateParam(
    params,
    CANDIDATE_FILTER_QUERY_KEYS.REGISTERED_FROM
  );
  filters.registeredTo = parseDateParam(
    params,
    CANDIDATE_FILTER_QUERY_KEYS.REGISTERED_TO
  );

  const pageParam = parseNumberParam(params, "page");
  const sizeParam = parseNumberParam(params, "size");

  return {
    filters,
    page: pageParam && pageParam > 0 ? pageParam : DEFAULT_PAGE,
    size: sizeParam && sizeParam > 0 ? sizeParam : DEFAULT_SIZE,
  };
};

const normalizeFilters = (filters: CandidateFilterParams) => {
  return {
    ...filters,
    statuses: [...filters.statuses].sort(),
    locations: [...filters.locations].sort(),
    industries: [...filters.industries].sort(),
    educationLevels: [...filters.educationLevels].sort(),
  };
};

const areFiltersEqual = (
  left: CandidateFilterParams,
  right: CandidateFilterParams
) => {
  return (
    JSON.stringify(normalizeFilters(left)) ===
    JSON.stringify(normalizeFilters(right))
  );
};

const buildSearchParams = (
  filters: CandidateFilterParams,
  page: number,
  size: number
) => {
  const params = new URLSearchParams();

  filters.statuses.forEach((status) => params.append("status", status));
  filters.locations.forEach((location) => params.append("locations", location));
  filters.industries.forEach((industry) =>
    params.append("industries", industry)
  );

  if (filters.experienceMin !== null) {
    params.set("expMin", String(filters.experienceMin));
  }
  if (filters.experienceMax !== null) {
    params.set("expMax", String(filters.experienceMax));
  }
  if (filters.registeredFrom) {
    params.set(
      CANDIDATE_FILTER_QUERY_KEYS.REGISTERED_FROM,
      filters.registeredFrom
    );
  }
  if (filters.registeredTo) {
    params.set(CANDIDATE_FILTER_QUERY_KEYS.REGISTERED_TO, filters.registeredTo);
  }

  params.set("page", String(page));
  params.set("size", String(size));

  return params;
};

const isAbortError = (error: unknown) => {
  const maybe = error as { name?: string; code?: string };
  return (
    maybe?.name === "CanceledError" ||
    maybe?.name === "AbortError" ||
    maybe?.code === "ERR_CANCELED"
  );
};

const getStatusTone = (status?: CandidateAccountStatus | null) => {
  switch (status) {
    case "ACTIVE":
      return `${getSemanticClass("success", "border", true)} ${getSemanticClass("success", "bg", true)} ${getSemanticClass("success", "text", true)}`;
    case "PENDING":
      return `${getSemanticClass("warning", "border", true)} ${getSemanticClass("warning", "bg", true)} ${getSemanticClass("warning", "text", true)}`;
    case "SUSPENDED":
      return `${getSemanticClass("danger", "border", true)} ${getSemanticClass("danger", "bg", true)} ${getSemanticClass("danger", "text", true)}`;
    case "DELETED":
      return "border-slate-200 bg-slate-100 text-slate-500";
    default:
      return "border-slate-200 bg-slate-100 text-slate-500";
  }
};

export function ApplicantsPage() {
  const { t } = useHeadhunterTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialRef = useRef(parseSearchParams(searchParams));

  const [filters, setFilters] = useState<CandidateFilterParams>(
    initialRef.current.filters
  );
  const [page, setPage] = useState(initialRef.current.page);
  const [size, setSize] = useState(initialRef.current.size);
  const [candidates, setCandidates] = useState<CandidateAccount[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitUntil, setRateLimitUntil] = useState<number | null>(null);

  const applyFilters = useCallback((nextFilters: CandidateFilterParams) => {
    setFilters(nextFilters);
    setPage(DEFAULT_PAGE);
  }, []);

  useEffect(() => {
    const parsed = parseSearchParams(searchParams);

    if (!areFiltersEqual(parsed.filters, filters)) {
      setFilters(parsed.filters);
    }
    if (parsed.page !== page) {
      setPage(parsed.page);
    }
    if (parsed.size !== size) {
      setSize(parsed.size);
    }
  }, [searchParams, filters, page, size]);

  useEffect(() => {
    const params = buildSearchParams(filters, page, size);
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [filters, page, size, searchParams, setSearchParams]);

  useEffect(() => {
    if (rateLimitUntil && Date.now() < rateLimitUntil) {
      setLoading(false);
      setError(t("filters.messages.rateLimited"));
      return;
    }

    if (rateLimitUntil && Date.now() >= rateLimitUntil) {
      setRateLimitUntil(null);
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const run = async () => {
      try {
        const response = await filterCandidates({
          status: filters.statuses,
          locations: filters.locations,
          industries: filters.industries,
          expMin: filters.experienceMin,
          expMax: filters.experienceMax,
          registeredFrom: filters.registeredFrom,
          registeredTo: filters.registeredTo,
          page,
          size,
          signal: controller.signal,
        });

        setCandidates(response.items);
        setTotalElements(response.total);
        setTotalPages(response.totalPages);
        setError(null);
      } catch (err) {
        if (isAbortError(err)) return;
        const status = (err as { response?: { status?: number } })?.response
          ?.status;
        if (status === 429) {
          setRateLimitUntil(Date.now() + RATE_LIMIT_WINDOW_MS);
          setError(t("filters.messages.rateLimited"));
        } else {
          setError(getErrorMessage(err, t("filters.messages.loadFailed")));
        }
        setCandidates([]);
        setTotalElements(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    void run();

    return () => {
      controller.abort();
    };
  }, [filters, page, size, t, rateLimitUntil]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.statuses.length > 0 ||
      filters.locations.length > 0 ||
      filters.industries.length > 0 ||
      filters.experienceMin !== null ||
      filters.experienceMax !== null ||
      filters.registeredFrom !== null ||
      filters.registeredTo !== null
    );
  }, [filters]);

  const getOptionLabel = useCallback(
    (options: { value: string; labelKey: string }[], value: string) => {
      const match = options.find((option) => option.value === value);
      return match ? t(match.labelKey) : value;
    },
    [t]
  );

  const formatExperienceTag = useCallback(
    (min: number | null, max: number | null) => {
      if (min !== null && max !== null) {
        return t("filters.tags.experienceRange")
          .replace("{{min}}", String(min))
          .replace("{{max}}", String(max));
      }
      if (min !== null) {
        return t("filters.tags.experienceMin").replace("{{min}}", String(min));
      }
      if (max !== null) {
        return t("filters.tags.experienceMax").replace("{{max}}", String(max));
      }
      return "";
    },
    [t]
  );

  const formatRegisteredTag = useCallback(
    (from: string | null, to: string | null) => {
      if (from && to) {
        return t("filters.tags.registeredRange")
          .replace("{{from}}", from)
          .replace("{{to}}", to);
      }
      if (from) {
        return t("filters.tags.registeredFrom").replace("{{from}}", from);
      }
      if (to) {
        return t("filters.tags.registeredTo").replace("{{to}}", to);
      }
      return "";
    },
    [t]
  );

  const activeTags = useMemo(() => {
    const tags: Array<{
      key: string;
      label: string;
      value: string;
      onRemove: () => void;
    }> = [];

    filters.statuses.forEach((status) => {
      tags.push({
        key: `status-${status}`,
        label: t("filters.tags.status"),
        value: getOptionLabel(CANDIDATE_STATUS_OPTIONS, status),
        onRemove: () =>
          applyFilters({
            ...filters,
            statuses: filters.statuses.filter((item) => item !== status),
          }),
      });
    });

    filters.locations.forEach((location) => {
      tags.push({
        key: `location-${location}`,
        label: t("filters.tags.location"),
        value: getOptionLabel(CANDIDATE_LOCATION_OPTIONS, location),
        onRemove: () =>
          applyFilters({
            ...filters,
            locations: filters.locations.filter((item) => item !== location),
          }),
      });
    });

    filters.industries.forEach((industry) => {
      tags.push({
        key: `industry-${industry}`,
        label: t("filters.tags.industry"),
        value: getOptionLabel(CANDIDATE_INDUSTRY_OPTIONS, industry),
        onRemove: () =>
          applyFilters({
            ...filters,
            industries: filters.industries.filter((item) => item !== industry),
          }),
      });
    });

    if (filters.experienceMin !== null || filters.experienceMax !== null) {
      tags.push({
        key: "experience",
        label: t("filters.tags.experience"),
        value: formatExperienceTag(
          filters.experienceMin,
          filters.experienceMax
        ),
        onRemove: () =>
          applyFilters({
            ...filters,
            experienceMin: null,
            experienceMax: null,
          }),
      });
    }

    if (filters.registeredFrom || filters.registeredTo) {
      tags.push({
        key: "registered",
        label: t("filters.tags.registered"),
        value: formatRegisteredTag(
          filters.registeredFrom,
          filters.registeredTo
        ),
        onRemove: () =>
          applyFilters({
            ...filters,
            registeredFrom: null,
            registeredTo: null,
          }),
      });
    }

    return tags;
  }, [
    applyFilters,
    filters,
    formatExperienceTag,
    formatRegisteredTag,
    getOptionLabel,
    t,
  ]);

  const headerDescription = t("candidateList.summary").replace(
    "{{count}}",
    String(totalElements)
  );

  const handleClearFilters = () => {
    applyFilters(createDefaultCandidateFilters());
  };

  const handleViewCandidate = (candidate: CandidateAccount) => {
    navigate(`/headhunter/candidates/${candidate.id}`, {
      state: {
        candidate: {
          id: candidate.id,
          fullName: candidate.fullName || "",
          email: candidate.email || "",
          phone: candidate.phone || "",
        },
      },
    });
  };

  return (
    <PageContainer>
      <PageHeader
        variant="gradient"
        title={t("candidates")}
        description={headerDescription}
      />

      <div className="grid gap-6 lg:grid-cols-4">
        <CandidateFilterPanel filters={filters} onFilterChange={applyFilters} />

        <div className="lg:col-span-3">
          {activeTags.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {activeTags.map((tag) => (
                <CandidateFilterTag
                  key={tag.key}
                  label={tag.label}
                  value={tag.value}
                  onRemove={tag.onRemove}
                />
              ))}
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  {t("filters.actions.clearAll")}
                </Button>
              )}
            </div>
          )}

          {loading && <PageSkeleton variant="grid" columns={2} count={6} />}

          {!loading && error && (
            <ErrorState
              variant="inline"
              title={t("filters.messages.loadFailed")}
              message={error}
              onRetry={() => applyFilters({ ...filters })}
            />
          )}

          {!loading && !error && candidates.length === 0 && (
            <EmptyState
              icon={Briefcase}
              title={t("filters.messages.empty")}
              description={t("applicantPageInfo")}
              actionLabel={
                hasActiveFilters ? t("filters.actions.clearAll") : undefined
              }
              onAction={hasActiveFilters ? handleClearFilters : undefined}
            />
          )}

          {!loading && !error && candidates.length > 0 && (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                {candidates.map((candidate) => {
                  const statusLabel = candidate.status
                    ? getOptionLabel(CANDIDATE_STATUS_OPTIONS, candidate.status)
                    : null;
                  const experienceLabel =
                    candidate.yearsOfExperience !== null &&
                    candidate.yearsOfExperience !== undefined
                      ? t("candidateList.experience").replace(
                          "{{years}}",
                          String(candidate.yearsOfExperience)
                        )
                      : null;
                  const registeredLabel = candidate.createdAt
                    ? t("candidateList.registered").replace(
                        "{{date}}",
                        new Date(candidate.createdAt).toLocaleDateString()
                      )
                    : null;

                  return (
                    <div
                      key={candidate.id}
                      className={`rounded-2xl ${getSemanticClass("success", "border", true)} bg-white/80 p-5 shadow-sm shadow-emerald-50 transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {candidate.fullName ||
                              t("candidateList.unknownName")}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {candidate.currentTitle ||
                              t("candidateList.noTitle")}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                            {candidate.email && <span>{candidate.email}</span>}
                            {candidate.phone && <span>{candidate.phone}</span>}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className={`border ${getSemanticClass("success", "text", true)} hover:${getSemanticClass("success", "bg", true).split(" ")[0]}`}
                          onClick={() => handleViewCandidate(candidate)}
                        >
                          {t("candidateList.viewProfile")}
                        </Button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        {statusLabel && (
                          <span
                            className={`rounded-full border px-2.5 py-1 font-semibold ${getStatusTone(
                              candidate.status
                            )}`}
                          >
                            {statusLabel}
                          </span>
                        )}
                        {candidate.city && (
                          <span
                            className={`rounded-full ${getSemanticClass("success", "bg", true)} px-3 py-1 ${getSemanticClass("success", "text", true)}`}
                          >
                            {candidate.city}
                          </span>
                        )}
                        {experienceLabel && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                            {experienceLabel}
                          </span>
                        )}
                        {candidate.openForWork && (
                          <span
                            className={`rounded-full ${getSemanticClass("success", "border", true)} ${getSemanticClass("success", "bg", true)} px-2.5 py-1 ${getSemanticClass("success", "text", true)}`}
                          >
                            {t("candidateList.openForWork")}
                          </span>
                        )}
                        {registeredLabel && (
                          <span
                            className={`rounded-full ${getSemanticClass("warning", "bg", true)} px-3 py-1 text-amber-800 dark:text-amber-100`}
                          >
                            {registeredLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-8">
                  <CandidatePagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={totalElements}
                    itemsPerPage={size}
                    onPageChange={setPage}
                    onItemsPerPageChange={(nextSize) => {
                      setSize(nextSize);
                      setPage(DEFAULT_PAGE);
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default ApplicantsPage;
