import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useAppTranslation,
  useJobsTranslation,
  useJobDetailQuery,
} from "@/shared/hooks";
import { brandColors } from "@/lib/design-tokens";
import { Breadcrumb } from "@/shared/common-blocks/navigation/Breadcrumb";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Button } from "@/shared/ui-primitives/button";
import { Badge } from "@/shared/ui-primitives/badge";
import { useAuth } from "@/features/auth/context/useAuth";
import { PageContainer } from "@/shared/common-blocks/layout";
import { PageSkeleton, ErrorState } from "@/shared/common-blocks/states";
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

  // Redirect if access is forbidden (job is closed/hidden and not authorized)
  useEffect(() => {
    if (error) {
      const status = (error as any)?.response?.status;
      const statusCode = (error as any)?.status;

      // Check for 403 Forbidden error
      if (status === 403 || statusCode === 403) {
        toast.error(
          t("detail.accessDenied") ||
            "You don't have permission to view this job"
        );
        navigate("/jobs", { replace: true });
      }
    }
  }, [error, navigate, t]);

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
          applications.content?.some(
            (application) => application.jobId === jobId
          ) ?? false
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
      <PageContainer variant="default" maxWidth="5xl">
        <PageSkeleton variant="grid" count={1} />
      </PageContainer>
    );
  }

  if (error || !job || !jobId) {
    return (
      <PageContainer variant="default" maxWidth="4xl">
        <ErrorState
          error={new Error(error?.message || t("detail.unableToLoad"))}
          onRetry={() => window.location.reload()}
          title={error ? t("detail.unableToLoad") : t("detail.notFound")}
        />
      </PageContainer>
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
    <PageContainer variant="default" maxWidth="6xl">
      <Breadcrumb
        items={[
          { label: t("breadcrumb.jobs") || "Jobs", href: "/jobs" },
          { label: job?.title || "" },
        ]}
        className="mb-6"
      />

      <div className="mt-4">
        <Button
          variant="outline"
          size="lg"
          className="px-4 py-2 rounded-lg cursor-pointer"
          onClick={() => navigate("/jobs")}
        >
          {t("detail.backToJobs")}
        </Button>
      </div>

      <div className="rounded-3xl bg-white dark:bg-slate-800 border dark:border-slate-700 p-8 shadow-xl dark:shadow-slate-900/30 mt-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p
              className={`text-sm font-semibold uppercase tracking-wide ${brandColors.primary.text}`}
            >
              {job.companyName ?? t("messages.confidentialCompany")}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
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
              className="flex-1 shadow-lg shadow-brand-primary/30 cursor-pointer"
              onClick={() => {
                if (isAuthenticated) {
                  if (isApplied) {
                    toast.info(tApp("applications.error.alreadyApplied"));
                    return;
                  }
                  navigate(`/jobs/${job.id}/apply`);
                } else {
                  toast.info(
                    tApp("messages.pleaseSignInToApply") ||
                      tApp("messages.pleaseSignInToSaveJobs")
                  );
                  navigate("/login", {
                    state: { from: `/jobs/${job.id}/apply` },
                  });
                }
              }}
              disabled={isApplyLoading || isApplied}
            >
              {isApplied
                ? tApp("applications.status.applied")
                : t("detail.applyNow")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={`flex-1 border-2 cursor-pointer ${
                isSaved
                  ? "border-brand-primary/30 bg-brand-primary/10 text-black hover:bg-brand-primary/20"
                  : "border-slate-200 dark:border-slate-700"
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
            <div
              key={item.label}
              className="rounded-2xl bg-slate-50 dark:bg-slate-700/50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {item.label}
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr] mt-8">
        <div className="rounded-3xl bg-white dark:bg-slate-800 border dark:border-slate-700 p-8 shadow-lg dark:shadow-slate-900/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {t("detail.jobDetailsSection")}
            </h2>
            <p className={`text-sm ${brandColors.primary.text}`}>
              {t("detail.jobCodeLabel")} {job.jobCode}
            </p>
          </div>
          <div className="mt-4 text-slate-600 dark:text-slate-300">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
            >
              {job.description ?? ""}
            </ReactMarkdown>
          </div>

          <div className="mt-8 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t("detail.responsibilities")}
              </h3>
              <div className="mt-3 whitespace-pre-line text-slate-600 dark:text-slate-300">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize]}
                >
                  {job.responsibilities ?? ""}
                </ReactMarkdown>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t("detail.requirements")}
              </h3>
              <div className="mt-3 whitespace-pre-line text-slate-600 dark:text-slate-300">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize]}
                >
                  {job.requirements ?? ""}
                </ReactMarkdown>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t("detail.benefits")}
              </h3>
              <div className="mt-3 whitespace-pre-line text-slate-600 dark:text-slate-300">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize]}
                >
                  {job.benefits ?? ""}
                </ReactMarkdown>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t("detail.requiredSkills")}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills?.length ? (
                  job.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className={`rounded-full bg-brand-primary/10 px-4 py-1 text-sm font-medium ${brandColors.primary.text}`}
                    >
                      {skill.name}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-500 dark:text-slate-400">
                    {t("detail.notAvailable")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl bg-white dark:bg-slate-800 border dark:border-slate-700 p-6 shadow-lg dark:shadow-slate-900/30">
            <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t("detail.companySection")}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
              {job.companyName ?? t("messages.confidentialCompany")}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {job.companyAddress ?? job.addressDetail}
            </p>
            <dl className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {job.companySize && (
                <div className="flex justify-between">
                  <dt>{t("detail.sizeLabel")}</dt>
                  <dd className="font-semibold text-slate-900 dark:text-white">
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
                      className={`font-semibold ${brandColors.primary.text} hover:underline`}
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

          <section className="rounded-3xl bg-white dark:bg-slate-800 border dark:border-slate-700 p-6 shadow-lg dark:shadow-slate-900/30">
            <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t("detail.generalInfoSection")}
            </p>
            <dl className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {generalInfo.map((item) => (
                <div key={item.label} className="flex justify-between">
                  <dt>{item.label}</dt>
                  <dd className="font-semibold text-slate-900 dark:text-white">
                    {item.value || t("detail.notAvailable")}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </aside>
      </div>
    </PageContainer>
  );
}
