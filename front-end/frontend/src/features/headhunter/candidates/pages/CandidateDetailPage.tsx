import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui-primitives/button";
import { PageContainer, PageHeader } from "@/shared/common-blocks/layout";
import { ErrorState, PageSkeleton } from "@/shared/common-blocks/states";
import type { CandidateSuggestion } from "../types";
import { getCandidateDetail } from "../services/candidateSearchApi";

interface LocationState {
  candidate?: CandidateSuggestion;
}

export function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const preloaded = (location.state as LocationState | null)?.candidate;

  const {
    data: detail,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["candidate", id],
    queryFn: () => getCandidateDetail(id || ""),
    enabled: Boolean(id),
  });

  const displayName =
    detail?.fullName || preloaded?.fullName || "Candidate Detail";
  const displayTitle = detail?.currentTitle || undefined;
  const displayEmail = detail?.email || preloaded?.email || "-";
  const displayPhone = detail?.phone || preloaded?.phone || "-";
  const skills = preloaded?.skills || [];

  return (
    <PageContainer maxWidth="5xl">
      <div className="mb-4">
        <Button
          type="button"
          variant="ghost"
          className="gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <PageHeader title={displayName} description={displayTitle} />

      {isLoading && <PageSkeleton variant="list" count={2} />}

      {error && (
        <ErrorState
          error={error as Error}
          variant="inline"
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !error && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Contact
            </p>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p>
                <span className="font-semibold">Email:</span> {displayEmail}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {displayPhone}
              </p>
              {detail?.city && (
                <p>
                  <span className="font-semibold">City:</span> {detail.city}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Profile
            </p>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              {detail?.yearsOfExperience !== null &&
                detail?.yearsOfExperience !== undefined && (
                  <p>
                    <span className="font-semibold">Experience:</span>{" "}
                    {detail.yearsOfExperience} years
                  </p>
                )}
              {(detail?.expectedSalaryMin || detail?.expectedSalaryMax) && (
                <p>
                  <span className="font-semibold">Expected Salary:</span>{" "}
                  {detail.expectedSalaryMin ?? "-"} -{" "}
                  {detail.expectedSalaryMax ?? "-"}
                </p>
              )}
              {detail?.openForWork !== null &&
                detail?.openForWork !== undefined && (
                  <p>
                    <span className="font-semibold">Open for work:</span>{" "}
                    {detail.openForWork ? "Yes" : "No"}
                  </p>
                )}
            </div>
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Skills
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
}

