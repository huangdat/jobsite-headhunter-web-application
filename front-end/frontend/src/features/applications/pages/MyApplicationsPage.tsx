import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { InterviewDetailModal, ApplicationStatusBadge } from "../components";
import { useApplications } from "../hooks";
import type { Interview, Application } from "../types";
import {
  Briefcase,
  Calendar,
  Building2,
  ChevronRight,
  Search,
  Clock,
  CheckCircle2,
  X,
  FileText,
  MapPin,
} from "lucide-react";

export const MyApplicationsPage: React.FC = () => {
  const { t } = useAppTranslation();
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null
  );
  const [showInterviewDetail, setShowInterviewDetail] = useState(false);
  const [viewingApp, setViewingApp] = useState<Application | null>(null);

  const { applications, isLoading, pagination, handlePageChange } =
    useApplications({
      isCandidateView: true,
      autoFetch: true,
    });

  const handleViewInterview = (e: React.MouseEvent, app: Application) => {
    e.stopPropagation();
    if (app?.interviews && app.interviews.length > 0) {
      setSelectedInterview(app.interviews[0]);
      setShowInterviewDetail(true);
    }
  };

  const stats = {
    total: pagination.totalElements,
    pending: applications.filter((a) => (a.status as string) === "SUBMITTED")
      .length,
    interview: applications.filter((a) => a.status === "INTERVIEW").length,
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10">
      <div className="container mx-auto max-w-4xl px-4">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {t("applications.myApplications")}
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              {t("applications.subtitle")}
            </p>
          </div>

          <div className="flex gap-3">
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm flex items-center gap-3">
              <div className="p-2 bg-lime-50 text-lime-600 rounded-lg">
                <Briefcase size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  {t("common.total")}
                </p>
                <p className="font-bold text-slate-700">{stats.total}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  {t("applications.status.applied")}
                </p>
                <p className="font-bold text-slate-700">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="space-y-5">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6 rounded-2xl border-none shadow-sm">
                <div className="flex gap-4">
                  <Skeleton className="h-16 w-16 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </Card>
            ))
          ) : applications.length === 0 ? (
            <Card className="p-16 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-transparent">
              <div className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                <Search size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {t("applications.empty.noApplications")}
              </h3>
              <Button className="bg-lime-400 hover:bg-lime-500 text-black px-8 py-6 rounded-2xl font-bold shadow-lg shadow-lime-400/20 transition-all">
                {t("common.browseJobs")}
              </Button>
            </Card>
          ) : (
            applications.map((app) => (
              <Card
                key={app.id}
                onClick={() => setViewingApp(app)}
                className="group p-0 rounded-2xl border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white cursor-pointer"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6 flex gap-5">
                    <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-lime-100 group-hover:text-lime-600 transition-colors shrink-0">
                      <Building2 size={32} />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-slate-800 group-hover:text-lime-600 transition-colors flex items-center gap-2">
                        {app.jobTitle}
                        <ChevronRight
                          size={18}
                          className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-lime-600"
                        />
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-[13px] font-medium text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar size={15} className="text-slate-400" />
                          <span>
                            {t("common.appliedAt")}:{" "}
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-lime-700 bg-lime-100 px-2 py-0.5 rounded-md">
                          <CheckCircle2 size={14} />
                          <span>{t("applications.candidateView")}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 md:w-56 p-6 flex md:flex-col justify-between items-center md:items-end border-t md:border-t-0 md:border-l border-slate-100">
                    <ApplicationStatusBadge status={app.status} />
                    {app.interviews && app.interviews.length > 0 ? (
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-lime-500 text-black hover:bg-lime-600 rounded-xl px-4 shadow-md transition-all active:scale-95"
                        onClick={(e) => handleViewInterview(e, app)}
                      >
                        <Calendar className="mr-2" size={14} />
                        {t("applications.status.interview")}
                      </Button>
                    ) : (
                      <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                        {t("applications.inProgress")}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {!isLoading && pagination.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-sm font-bold text-slate-500">
              {t("common.page")}{" "}
              <span className="text-slate-900">{pagination.page + 1}</span>{" "}
              {t("common.of")} {pagination.totalPages}
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                disabled={pagination.page === 0}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                {t("common.previous")}
              </Button>
              <Button
                variant="outline"
                className="border-slate-200 font-bold text-slate-700 hover:bg-lime-50 hover:border-lime-200 rounded-xl px-6"
                disabled={pagination.page === pagination.totalPages - 1}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                {t("common.next")}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {viewingApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 pb-2 flex justify-between items-start border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {viewingApp.jobTitle}
                </h2>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  {t("actions.viewDetails")}
                </p>
              </div>
              <button
                onClick={() => setViewingApp(null)}
                className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="flex gap-12">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                    {t("columns.status")}
                  </p>
                  <ApplicationStatusBadge status={viewingApp.status} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                    {t("common.appliedAt")}
                  </p>
                  <p className="font-bold text-slate-700 flex items-center gap-2">
                    <Clock size={16} className="text-lime-500" />
                    {new Date(viewingApp.appliedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <FileText size={16} className="text-lime-600" />{" "}
                  {t("applications.form.coverLetter")}
                </h4>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    {viewingApp.coverLetter || t("applications.empty.noCV")}
                  </p>
                </div>
              </div>

              {viewingApp.interviews && viewingApp.interviews.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Calendar size={16} className="text-lime-600" />{" "}
                    {t("applications.interview.title")}
                  </h4>
                  <div className="bg-lime-50 rounded-2xl p-5 border border-lime-100 border-l-4 border-l-lime-400">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-lime-800 font-medium">
                          {t("applications.interview.scheduledAt")}:
                        </span>
                        <span className="font-bold text-slate-700">
                          {new Date(
                            viewingApp.interviews[0].scheduledAt
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm pt-2 border-t border-lime-200">
                        <span className="text-lime-800 font-medium">
                          {t("applications.interview.location")}:
                        </span>
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          <MapPin size={14} />{" "}
                          {viewingApp.interviews[0].location ||
                            "Contact Hiring Team"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {selectedInterview && (
        <InterviewDetailModal
          isOpen={showInterviewDetail}
          interview={selectedInterview}
          onClose={() => setShowInterviewDetail(false)}
        />
      )}
    </div>
  );
};
