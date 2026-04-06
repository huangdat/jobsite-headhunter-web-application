import { useMemo, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Badge } from "@/components/ui/badge";
import type { JobSummary } from "../types";
import { formatSalary, formatDeadlineDate } from "../utils";
import { getJobDetail } from "../services/jobsApi";
import { jobKeys } from "@/shared/utils/queryKeys";
import { SmallText, Caption } from "@/shared/components/typography/Typography";

interface JobCardProps {
  job: JobSummary & { negotiable?: boolean };
}

export function JobCard({ job }: JobCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deadlineLabel = useMemo(() => {
    return formatDeadlineDate(job.deadline);
  }, [job.deadline]);

  const handleNavigate = () => navigate(`/jobs/${job.id}`);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigate();
    }
  };

  // P2-7: Prefetch job detail on hover for instant navigation
  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: jobKeys.detail(job.id),
      queryFn: () => getJobDetail(job.id),
      staleTime: 1000 * 60 * 10, // Match SEMI_STATIC_DATA_CONFIG
    });
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      className="rounded-2xl border border-emerald-100/70 bg-white/80 p-5 shadow-sm shadow-emerald-50 transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none cursor-pointer"
      aria-label={t("list.viewJobLabel", { title: job.title })}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <SmallText weight="semibold" className="block text-lg">
            {job.title}
          </SmallText>
          {job.headhunterName && (
            <SmallText variant="muted" className="block">
              {job.headhunterName}
            </SmallText>
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
          {job.city ?? "Flexible"}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
          {formatSalary(job)}
        </span>
        {deadlineLabel && (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800 dark:bg-amber-900/30 dark:text-amber-100">
            {t("list.applyBefore")} {deadlineLabel}
          </span>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <Caption className="uppercase tracking-[0.2em] text-slate-400">
          #{job.jobCode}
        </Caption>
        <SmallText weight="semibold" className="text-lime-500">
          {t("list.viewDetails")}
        </SmallText>
      </div>
    </div>
  );
}
