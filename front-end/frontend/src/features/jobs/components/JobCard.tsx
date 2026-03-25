import { useMemo, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Badge } from "@/components/ui/badge";
import type { JobSummary } from "../types";
import { formatSalary, formatDeadlineDate } from "../utils";

interface JobCardProps {
  job: JobSummary & { negotiable?: boolean };
}

export function JobCard({ job }: JobCardProps) {
  const navigate = useNavigate();

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

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      className="rounded-2xl border border-emerald-100/70 bg-white/80 p-5 shadow-sm shadow-emerald-50 transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none cursor-pointer"
      aria-label={`View job ${job.title}`}
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
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
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
            Apply before {deadlineLabel}
          </span>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
          #{job.jobCode}
        </span>
        <span className="text-sm font-semibold text-emerald-600">View details →</span>
      </div>
    </div>
  );
}
