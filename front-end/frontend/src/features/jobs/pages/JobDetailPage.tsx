import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/context/useAuth";
import {
  fetchJobDetail,
  fetchSavedJobs,
  removeSavedJob,
  saveJobPost,
} from "../services/jobsApi";
import type { JobDetail } from "../types";

const numberFormat = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Job not found");
      setIsLoading(false);
      return;
    }

    const jobId = Number(id);
    if (Number.isNaN(jobId)) {
      setError("Job not found");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetchJobDetail(jobId)
      .then((data) => {
        setJob(data);
        setError(null);
      })
      .catch(() => {
        setError("Unable to load job detail. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!id || !isAuthenticated) {
      setIsSaved(false);
      return;
    }

    const jobId = Number(id);
    if (Number.isNaN(jobId)) {
      setIsSaved(false);
      return;
    }

    let active = true;
    fetchSavedJobs()
      .then((savedJobs) => {
        if (!active) return;
        setIsSaved(savedJobs.some((savedJob) => savedJob.jobId === jobId));
      })
      .catch(() => {
        if (active) {
          setIsSaved(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20">
        <div className="h-52 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-lg text-slate-500">{error ?? "Job not found"}</p>
        <Button
          variant="link"
          className="mt-4"
          onClick={() => navigate("/jobs")}
        >
          Back to listings
        </Button>
      </div>
    );
  }

  const salaryLabel = job.negotiable
    ? "Negotiable"
    : `${numberFormat.format(job.salaryMin)} - ${numberFormat.format(job.salaryMax)} ${job.currency}`;
  const deadlineLabel = job.deadline
    ? new Date(job.deadline).toLocaleDateString("en-US")
    : "Open";

  const overviewItems = [
    { label: "Salary", value: salaryLabel },
    { label: "Location", value: job.location },
    { label: "Experience", value: `${job.experience}+ years` },
    { label: "Working type", value: job.workingType },
    { label: "Headcount", value: `${job.quantity} people` },
    { label: "Deadline", value: deadlineLabel },
  ];

  const generalInfo = [
    { label: "Rank", value: job.rankLevel },
    { label: "Working hours", value: job.workingTime },
    { label: "Status", value: job.status },
    {
      label: "Posted on",
      value: new Date(job.createdAt).toLocaleDateString("en-US"),
    },
  ];

  const handleToggleSaved = async () => {
    if (!job) return;

    if (!isAuthenticated) {
      toast.info("Please sign in to save jobs.");
      navigate("/login");
      return;
    }

    try {
      setIsSaveLoading(true);
      if (isSaved) {
        await removeSavedJob(job.id);
        setIsSaved(false);
        toast.success("Job removed from saved list.");
      } else {
        await saveJobPost(job.id);
        setIsSaved(true);
        toast.success("Job saved.");
      }
    } catch {
      toast.error("Unable to update saved jobs. Please try again.");
    } finally {
      setIsSaveLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 pb-16 pt-10">
      <div className="mx-auto max-w-6xl space-y-8 px-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <button
            className="hover:text-emerald-600"
            onClick={() => navigate("/jobs")}
          >
            Jobs
          </button>
          <span>/</span>
          <span className="text-slate-800">{job.title}</span>
        </div>

        <div className="mt-4">
          <Button
            variant="outline"
            size="lg"
            className="px-4 py-2 rounded-lg"
            onClick={() => navigate("/jobs")}
          >
            Back to jobs
          </Button>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                {job.companyName ?? "Confidential company"}
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                {job.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <Badge variant="secondary">{job.workingType}</Badge>
                <Badge variant="secondary">{job.rankLevel}</Badge>
                <Badge variant="secondary">{job.location}</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="primary"
                size="lg"
                className="flex-1 shadow-lg shadow-emerald-500/30"
                onClick={() => navigate("/login")}
              >
                Apply now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`flex-1 border-2 ${
                  isSaved
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-slate-200"
                }`}
                onClick={handleToggleSaved}
                disabled={isSaveLoading}
              >
                {isSaveLoading ? "Saving..." : isSaved ? "Saved" : "Save job"}
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {overviewItems.map((item) => (
              <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900">
                Job details
              </h2>
              <p className="text-sm text-emerald-600">
                Job code: {job.jobCode}
              </p>
            </div>
            <div className="mt-4 text-slate-600">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
              >
                {job.description ?? ""}
              </ReactMarkdown>
            </div>

            <div className="mt-8 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Responsibilities
                </h3>
                <div className="mt-3 whitespace-pre-line text-slate-600">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                  >
                    {job.responsibilities ?? ""}
                  </ReactMarkdown>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Requirements
                </h3>
                <div className="mt-3 whitespace-pre-line text-slate-600">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                  >
                    {job.requirements ?? ""}
                  </ReactMarkdown>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Benefits
                </h3>
                <div className="mt-3 whitespace-pre-line text-slate-600">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                  >
                    {job.benefits ?? ""}
                  </ReactMarkdown>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Required skills
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills?.length ? (
                    job.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="rounded-full bg-emerald-50 px-4 py-1 text-sm font-medium text-emerald-700"
                      >
                        {skill.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-500">Not available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <section className="rounded-3xl bg-white p-6 shadow-lg">
              <p className="text-sm uppercase tracking-wide text-slate-500">
                Company
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                {job.companyName ?? "Confidential company"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {job.companyAddress ?? job.addressDetail}
              </p>
              <dl className="mt-4 space-y-3 text-sm text-slate-600">
                {job.companySize && (
                  <div className="flex justify-between">
                    <dt>Size</dt>
                    <dd className="font-semibold text-slate-900">
                      {job.companySize}
                    </dd>
                  </div>
                )}
                {job.companyWebsite && (
                  <div className="flex justify-between">
                    <dt>Website</dt>
                    <dd>
                      <a
                        href={job.companyWebsite}
                        className="font-semibold text-emerald-600"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {job.companyWebsite}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-lg">
              <p className="text-sm uppercase tracking-wide text-slate-500">
                General info
              </p>
              <dl className="mt-4 space-y-3 text-sm text-slate-600">
                {generalInfo.map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <dt>{item.label}</dt>
                    <dd className="font-semibold text-slate-900">
                      {item.value || "Not available"}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
