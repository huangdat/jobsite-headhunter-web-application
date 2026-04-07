import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSemanticClass } from "@/lib/design-tokens";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { PageContainer, PageHeader } from "@/shared/components/layout";
import { PageSkeleton } from "@/shared/components/states/PageSkeleton";
import { ErrorState } from "@/shared/components/states/ErrorState";
import { ApplicationStatusBadge } from "../components";
import { useApplications, useInterviewSchedule } from "../hooks";
import { formatDate, formatDuration } from "../utils";
import type { Application } from "../types";
import {
  Briefcase,
  Calendar,
  Building2,
  ChevronRight,
  Search,
  Clock,
  X,
  FileText,
  MapPin,
  Video,
} from "lucide-react";

export const MyApplicationsPage: React.FC = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const [viewingApp, setViewingApp] = useState<Application | null>(null);

  const {
    applications,
    isLoading,
    error,
    pagination,
    handlePageChange,
    refetch,
  } = useApplications({
    isCandidateView: true,
    autoFetch: true,
  });

  const stats = {
    total: pagination.totalElements,
    applied: applications.filter((a) => (a.status as string) === "APPLIED")
      .length,
    interviewing: applications.filter(
      (a) => (a.status as string) === "INTERVIEW"
    ).length,
    rejected: applications.filter((a) => (a.status as string) === "REJECTED")
      .length,
  };

  return (
    <PageContainer variant="default" maxWidth="4xl">
      <div className="mb-6 flex items-center justify-between">
        <PageHeader
          variant="default"
          title={t("applications.myApplications")}
          description={t("applications.subtitle")}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t("common.back")}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <StatCard
          label={t("common.total")}
          value={stats.total}
          icon={<Briefcase size={14} />}
          color="lime"
        />
        <StatCard
          label={t("applications.status.applied")}
          value={stats.applied}
          icon={<Clock size={14} />}
          color="amber"
        />
        <StatCard
          label={t("applications.status.interviewing") || "Interviewing"}
          value={stats.interviewing}
          icon={<Video size={14} />}
          color="blue"
        />
        <StatCard
          label={t("applications.status.rejected") || "Rejected"}
          value={stats.rejected}
          icon={<X size={14} />}
          color="red"
        />
      </div>

      <div className="space-y-4">
        {error && (
          <ErrorState
            error={new Error(error)}
            onRetry={() => refetch()}
            variant="inline"
          />
        )}

        {!error && isLoading && <PageSkeleton variant="list" count={3} />}

        {!error && !isLoading && applications.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl text-slate-400 dark:text-slate-500 dark:border-slate-700">
            <Search className="mx-auto mb-4 opacity-20" size={40} />
            <p>{t("applications.empty.noApplications")}</p>
          </div>
        ) : (
          applications.map((app) => (
            <Card
              key={app.id}
              onClick={() => setViewingApp(app)}
              className="group p-5 rounded-xl border-slate-200/60 dark:border-slate-700 shadow-sm hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer bg-white dark:bg-slate-800"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors">
                      {app.jobTitle}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">
                        |
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                        {t("applications.candidateView")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <ApplicationStatusBadge status={app.status} />
                  <ChevronRight
                    size={16}
                    className="ml-auto mt-2 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-all"
                  />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {!isLoading && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-between items-center text-sm font-medium text-slate-500 dark:text-slate-400">
          <span>
            {t("common.page")} {pagination.page + 1} / {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 0}
            >
              {t("common.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages - 1}
            >
              {t("common.next")}
            </Button>
          </div>
        </div>
      )}

      {viewingApp && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
          <ModalContent app={viewingApp} onClose={() => setViewingApp(null)} />
        </div>
      )}
    </PageContainer>
  );
};

const ModalContent: React.FC<{
  app: Application;
  onClose: () => void;
}> = ({ app, onClose }) => {
  const { t, i18n } = useAppTranslation();
  const { interviews, isLoading } = useInterviewSchedule({
    applicationId: app.id,
    autoFetch: app.status === "INTERVIEW",
  });

  const interview = interviews[0];

  return (
    <Card className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border-none animate-in zoom-in-95 duration-200 text-slate-900 dark:text-white">
      <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
        <h2 className="font-bold text-xl">{app.jobTitle}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
          aria-label={t("common.actions.close")}
        >
          <X size={20} />
        </Button>
      </div>

      <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        <div className="flex justify-between text-sm border-b dark:border-slate-700 pb-4">
          <div className="space-y-1">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              {t("columns.status")}
            </p>
            <ApplicationStatusBadge status={app.status} />
          </div>
          <div className="text-right space-y-1">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold italic tracking-wider">
              {t("common.appliedAt")}
            </p>
            <p className="font-medium text-slate-700 dark:text-slate-300">
              {new Date(app.appliedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {app.status === "INTERVIEW" && (
          <div
            className={`rounded-xl p-4 space-y-4 border ${getSemanticClass("info", "bg", true)} ${getSemanticClass("info", "border", true)}`}
          >
            <div
              className={`flex justify-between items-center font-bold text-sm ${getSemanticClass("info", "text", true)}`}
            >
              <span className="flex items-center gap-2">
                <Calendar size={14} /> {t("applications.interview.title")}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono ${getSemanticClass("info", "bg", true)}`}
              >
                #{interview?.interviewCode}
              </span>
            </div>

            {isLoading ? (
              <div className="h-20 w-full rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
            ) : interview ? (
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-700 dark:text-slate-300">
                <div className="space-y-1">
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    {t("applications.interview.time")}
                  </p>
                  <p className="font-semibold">
                    {formatDate(interview.scheduledAt, i18n.language)}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    {t("applications.interview.duration")}
                  </p>
                  <p className="font-semibold flex items-center justify-end gap-1">
                    <Clock size={12} />{" "}
                    {formatDuration(interview.durationMinutes)}
                  </p>
                </div>
                <div
                  className={`col-span-2 pt-2 border-t ${getSemanticClass("info", "border", true)}`}
                >
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                    {t("applications.interview.location")}
                  </p>
                  {interview.interviewType === "ONLINE" ? (
                    <Button
                      variant="link"
                      className={`p-0 h-auto text-xs truncate w-full justify-start hover:no-underline font-medium ${getSemanticClass("info", "text", true)}`}
                      asChild
                    >
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Video size={14} className="mr-1.5" />{" "}
                        {interview.meetingLink}
                      </a>
                    </Button>
                  ) : (
                    <p className="text-xs font-medium flex items-center gap-1">
                      <MapPin
                        size={14}
                        className={getSemanticClass("danger", "icon", true)}
                      />
                      {interview.location}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                {t("applications.empty.noInterviewDetails")}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1 tracking-wider">
            <FileText size={12} /> {t("applications.form.coverLetter")}
          </p>
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic border border-slate-100 dark:border-slate-700">
            {app.coverLetter || t("applications.empty.noCoverLetter")}
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={onClose}
            className="w-full bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 font-bold rounded-xl py-5 transition-all cursor-pointer"
          >
            {t("common.close")}
          </Button>
        </div>
      </div>
    </Card>
  );
};

const StatCard: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "lime" | "amber" | "blue" | "red";
}> = ({ label, value, icon, color }) => {
  const colorClasses = {
    lime: `${getSemanticClass("success", "bg", true)} ${getSemanticClass("success", "text", true)}`,
    amber: `${getSemanticClass("warning", "bg", true)} ${getSemanticClass("warning", "text", true)}`,
    blue: `${getSemanticClass("info", "bg", true)} ${getSemanticClass("info", "text", true)}`,
    red: `${getSemanticClass("danger", "bg", true)} ${getSemanticClass("danger", "text", true)}`,
  };

  return (
    <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-sm">
      <div className={`p-1.5 rounded-md ${colorClasses[color]}`}>{icon}</div>
      <div>
        <p className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 leading-none mb-0.5 tracking-wider">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">
          {value}
        </p>
      </div>
    </div>
  );
};
