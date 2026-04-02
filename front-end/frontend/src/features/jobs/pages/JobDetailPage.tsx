import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppTranslation, useJobsTranslation, useJobDetailQuery } from "@/shared/hooks";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/context/useAuth";
import {
  fetchSavedJobs,
  removeSavedJob,
  saveJobPost,
} from "../services/jobsApi";
import { getCandidateApplications } from "@/features/applications/services/applicationsApi";
import { formatSalaryRange } from "../utils";

export function JobDetailPage() {
  const { t } = useJobsTranslation();
  const { t: tApp } = useAppTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isApplyLoading, setIsApplyLoading] = useState(false);

  // Validate and parse job ID
  const jobId = useMemo(() => {
    if (!id) return null;
    const parsed = Number(id);
    return Number.isNaN(parsed) ? null : parsed;
  }, [id]);

  // React Query handles loading and error states automatically
  const { data: job, isLoading, error } = useJobDetailQuery(jobId);

  // Fetch saved jobs status when authenticated
  useEffect(() => {
    if (!jobId || !isAuthenticated || !job) {
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
  }, [jobId, isAuthenticated, job]);

  useEffect(() => {
    if (!jobId || !isAuthenticated || !job) {
      setIsApplied(false);
      return;
    }

    let active = true;
    setIsApplyLoading(true);

    getCandidateApplications({ page: 0, size: 100 })
      .then((applications) => {
        if (!active) return;
        setIsApplied(
          applications.content?.some((application) => application.jobId === jobId) ??
            false
        );
      })
      .catch(() => {
        if (active) {
          setIsApplied(false);
        }
      })
      .finally(() => {
        if (active) {
          setIsApplyLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [jobId, isAuthenticated, job]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20">
        <div className="h-52 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  if (error || !job || !jobId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-lg text-slate-500">
          {error ? t("detail.unableToLoad") : t("detail.notFound")}
        </p>
        <Button
          variant="link"
          className="mt-4"
          onClick={() => navigate("/jobs")}
        >
          {t("detail.backToListings")}
        </Button>
      </div>
    );
  }

  const salaryLabel = job.negotiable
    ? t("detail.salaryNegotiable")
    : formatSalaryRange(job.salaryMin, job.salaryMax, job.currency);
  const deadlineLabel = job.deadline
    ? new Date(job.deadline).toLocaleDateString("en-US")
    : t("detail.salaryOpen");

  const overviewItems = [
    { label: t("detail.salary"), value: salaryLabel },
    { label: t("detail.location"), value: job.location },
    { label: t("detail.experience"), value: `${job.experience}+ years` },
    { label: t("detail.workingType"), value: job.workingType },
    { label: t("detail.headcount"), value: `${job.quantity} people` },
    { label: t("detail.deadline"), value: deadlineLabel },
  ];

  const generalInfo = [
    { label: t("detail.rank"), value: job.rankLevel },
    { label: t("detail.workingHours"), value: job.workingTime },
    { label: t("detail.status"), value: job.status },
    {
      label: t("detail.postedOn"),
      value: new Date(job.createdAt).toLocaleDateString("en-US"),
    },
  ];

  const handleToggleSaved = async () => {
    if (!job) return;

    if (!isAuthenticated) {
      toast.info(t("messages.pleaseSignInToSaveJobs"));
      navigate("/login");
      return;
    }

    try {
      setIsSaveLoading(true);
      if (isSaved) {
        await removeSavedJob(job.id);
        setIsSaved(false);
        toast.success(t("messages.jobRemovedFromSaved"));
      } else {
        await saveJobPost(job.id);
        setIsSaved(true);
        toast.success(t("messages.jobSaved"));
      }
    } catch {
      toast.error(t("messages.unableToUpdateSavedJobs"));
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
            {t("list.pageTitle")}
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
            {t("detail.backToJobs")}
          </Button>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                {job.companyName ?? t("messages.confidentialCompany")}
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
                onClick={() => {
                  if (isAuthenticated) {
                    if (isApplied) {
                      toast.info(tApp("applications.error.alreadyApplied"));
                      return;
                    }
                    navigate(`/jobs/${job.id}/apply`);
                  } else {
                    toast.info("Please sign in to apply for this job");
                    navigate("/login", {
                      state: { from: `/jobs/${job.id}/apply` },
                    });
                  }
                }}
                disabled={isApplyLoading || isApplied}
              >
                {isApplied ? tApp("applications.status.applied") : t("detail.applyNow")}
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
                {isSaveLoading
                  ? t("detail.saving")
                  : isSaved
                    ? t("detail.saved")
                    : t("detail.saveJob")}
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
                {t("detail.jobDetailsSection")}
              </h2>
              <p className="text-sm text-emerald-600">
                {t("detail.jobCodeLabel")} {job.jobCode}
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
                  {t("detail.responsibilities")}
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
                  {t("detail.requirements")}
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
                  {t("detail.benefits")}
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
                  {t("detail.requiredSkills")}
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
                    <p className="text-slate-500">{t("detail.notAvailable")}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl bg-white p-6 shadow-lg">
              <p className="text-sm uppercase tracking-wide text-slate-500">
                {t("detail.companySection")}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                {job.companyName ?? t("messages.confidentialCompany")}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {job.companyAddress ?? job.addressDetail}
              </p>
              <dl className="mt-4 space-y-3 text-sm text-slate-600">
                {job.companySize && (
                  <div className="flex justify-between">
                    <dt>{t("detail.sizeLabel")}</dt>
                    <dd className="font-semibold text-slate-900">
                      {job.companySize}
                    </dd>
                  </div>
                )}
                {job.companyWebsite && (
                  <div className="flex justify-between">
                    <dt>{t("detail.websiteLabel")}</dt>
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
                {t("detail.generalInfoSection")}
              </p>
              <dl className="mt-4 space-y-3 text-sm text-slate-600">
                {generalInfo.map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <dt>{item.label}</dt>
                    <dd className="font-semibold text-slate-900">
                      {item.value || t("detail.notAvailable")}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-lg">
              <p className="text-sm uppercase tracking-wide text-slate-500">Contact</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{job.headhunterName ?? "Recruiter not available"}</p>
              <p className="text-sm text-slate-500">{job.companyAddress ?? job.addressDetail}</p>
              <Button
                variant="primary"
                size="lg"
                className="mt-6 w-full justify-center shadow-lg shadow-slate-900/20"
                onClick={() => navigate("/login")}
              >
                Send CV to recruiter
              </Button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
