/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
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
  const [viewingApp, setViewingApp] = useState<Application | null>(null);

  const { applications, isLoading, pagination, handlePageChange } =
    useApplications({
      isCandidateView: true,
      autoFetch: true,
    });

  const stats = {
    total: pagination.totalElements,
    applied: applications.filter((a) => (a.status as string) === "APPLIED")
      .length,
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 text-slate-900">
      <div className="container mx-auto max-w-4xl px-4">
        {/* HEADER */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t("applications.myApplications")}
            </h1>
            <p className="text-slate-500 text-sm">
              {t("applications.subtitle")}
            </p>
          </div>
          <div className="flex gap-2">
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
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))
          ) : applications.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-3xl text-slate-400">
              <Search className="mx-auto mb-4 opacity-20" size={40} />
              <p>{t("applications.empty.noApplications")}</p>
            </div>
          ) : (
            applications.map((app) => (
              <Card
                key={app.id}
                onClick={() => setViewingApp(app)}
                className="group p-5 rounded-xl border-slate-200/60 shadow-sm hover:border-lime-400 transition-all cursor-pointer bg-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-lime-600 transition-colors">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{app.jobTitle}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />{" "}
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-lime-600 font-medium">
                          {t("applications.candidateView")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <ApplicationStatusBadge status={app.status} />
                    <ChevronRight
                      size={16}
                      className="ml-auto mt-2 text-slate-300 group-hover:text-lime-500 transition-all"
                    />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {!isLoading && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-between items-center text-sm font-medium text-slate-500">
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
      </div>

      {/* DETAIL MODAL */}
      {viewingApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
          <ModalContent app={viewingApp} onClose={() => setViewingApp(null)} />
        </div>
      )}
    </div>
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
    <Card className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border-none animate-in zoom-in-95 duration-200 text-slate-900">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="font-bold text-xl">{app.jobTitle}</h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        <div className="flex justify-between text-sm border-b pb-4">
          <div className="space-y-1">
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              {t("columns.status")}
            </p>
            <ApplicationStatusBadge status={app.status} />
          </div>
          <div className="text-right space-y-1">
            <p className="text-slate-400 text-[10px] uppercase font-bold italic tracking-wider">
              {t("common.appliedAt")}
            </p>
            <p className="font-medium text-slate-700">
              {new Date(app.appliedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {app.status === "INTERVIEW" && (
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-center text-blue-700 font-bold text-sm">
              <span className="flex items-center gap-2">
                <Calendar size={14} /> {t("applications.interview.title")}
              </span>
              <span className="text-[10px] bg-blue-100 px-2 py-0.5 rounded font-mono">
                #{interview?.interviewCode}
              </span>
            </div>

            {isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : interview ? (
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
                <div className="space-y-1">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    {t("applications.interview.time")}
                  </p>
                  <p className="font-semibold">
                    {formatDate(interview.scheduledAt, i18n.language)}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    {t("applications.interview.duration")}
                  </p>
                  <p className="font-semibold flex items-center justify-end gap-1">
                    <Clock size={12} />{" "}
                    {formatDuration(interview.durationMinutes)}
                  </p>
                </div>
                <div className="col-span-2 pt-2 border-t border-blue-100/50">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    {t("applications.interview.location")}
                  </p>
                  {interview.interviewType === "ONLINE" ? (
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-600 text-xs truncate w-full justify-start hover:no-underline font-medium"
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
                      <MapPin size={14} className="text-red-400" />{" "}
                      {interview.location}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                {t("applications.empty.noInterviewDetails")}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <p className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1 tracking-wider">
            <FileText size={12} /> {t("applications.form.coverLetter")}
          </p>
          <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 leading-relaxed italic border border-slate-100">
            {app.coverLetter || t("applications.empty.noCoverLetter")}
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={onClose}
            className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-xl py-5 transition-all cursor-pointer"
          >
            {t("common.close")}
          </Button>
        </div>
      </div>
    </Card>
  );
};

const StatCard = ({ label, value, icon, color }: any) => (
  <div className="bg-white border rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-sm border-slate-100">
    <div
      className={`p-1.5 rounded-md ${color === "lime" ? "bg-lime-50 text-lime-600" : "bg-amber-50 text-amber-600"}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-[9px] uppercase font-bold text-slate-400 leading-none mb-0.5 tracking-wider">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-800 leading-none">{value}</p>
    </div>
  </div>
);
