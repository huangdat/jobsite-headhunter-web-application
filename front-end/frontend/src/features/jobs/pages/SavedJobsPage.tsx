import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchSavedJobs, removeSavedJob } from "../services/jobsApi";
import type { SavedJob } from "../types";

const formatSalaryRange = (job: SavedJob) => {
  if (job.salaryMin == null || job.salaryMax == null) {
    return "Negotiable";
  }

  try {
    const formatter = new Intl.NumberFormat(
      job.currency === "VND" ? "vi-VN" : "en-US",
      {
        style: "currency",
        currency: job.currency || "USD",
        maximumFractionDigits: job.currency === "VND" ? 0 : 2,
      }
    );

    return `${formatter.format(job.salaryMin)} - ${formatter.format(job.salaryMax)}`;
  } catch {
    return `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} ${job.currency}`;
  }
};

export function SavedJobsPage() {
  const { t } = useTranslation("jobs");
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetchSavedJobs()
      .then((data) => {
        if (!active) return;
        setJobs(data);
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setError(t("jobs.saved.unableToLoadSavedJobs"));
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [t]);

  const handleRemove = async (jobId: number) => {
    setRemovingId(jobId);
    try {
      await removeSavedJob(jobId);
      setJobs((prev) => prev.filter((job) => job.jobId !== jobId));
      toast.success(t("jobs.saved.jobRemovedSuccess"));
    } catch (error) {
      const err = error as Error & {
        response?: { data?: { message: string } };
      };
      console.error("Failed to remove saved job:", err);
      const serverMessage = err?.response?.data?.message || err?.message;
      toast.error(serverMessage || t("jobs.saved.unableToRemoveJob"));
    } finally {
      setRemovingId(null);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-3xl bg-white"
            />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-3xl bg-white p-10 text-center shadow">
          <p className="text-slate-600">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            {t("jobs.saved.tryAgainButton")}
          </Button>
        </div>
      );
    }

    if (jobs.length === 0) {
      return (
        <div className="rounded-3xl bg-white p-10 text-center shadow">
          <p className="text-lg font-semibold text-slate-900">
            {t("jobs.saved.noSavedJobs")}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {t("jobs.saved.emptyStateHint")}
          </p>
          <Button className="mt-6" onClick={() => navigate("/jobs")}>
            {t("jobs.saved.browseJobsButton")}
          </Button>
        </div>
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
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                {job.companyName ?? t("jobs.saved.confidentialCompany")}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                {job.title}
              </h3>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                <span>{job.location}</span>
                <span>
                  {t("jobs.saved.postedText")}{" "}
                  {job.postedDate
                    ? new Date(job.postedDate).toLocaleDateString("en-US")
                    : t("jobs.saved.recentlyPosted")}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <Badge variant="secondary">{job.status}</Badge>
                <span className="font-semibold text-slate-900">
                  {formatSalaryRange(job)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                className="sm:min-w-[calc(140px)]"
                onClick={() => navigate(`/jobs/${job.jobId}`)}
              >
                {t("jobs.saved.viewJobButton")}
              </Button>
              <Button
                variant="ghost"
                className="sm:min-w-[calc(140px)] text-red-600 hover:text-red-700"
                onClick={() => handleRemove(job.jobId)}
                disabled={removingId === job.jobId}
              >
                {removingId === job.jobId
                  ? t("jobs.saved.removingButton")
                  : t("jobs.saved.removeButton")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-slate-50 pb-16 pt-10">
      <div className="mx-auto max-w-6xl space-y-6 px-4">
        <div>
          <p className="text-sm text-slate-500">{t("jobs.saved.breadcrumb")}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            {t("jobs.saved.pageTitle")}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {t("jobs.saved.description")}
          </p>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
