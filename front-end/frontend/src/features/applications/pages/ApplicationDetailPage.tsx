import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import {
  InterviewScheduleModal,
  InterviewDetailModal,
  ApplicationStatusBadge,
} from "../components";
import { useInterviewSchedule } from "../hooks";
import { formatDate } from "../utils";
import {
  getApplicationDetail,
  updateApplicationStatus,
} from "../services/applicationsApi";
import type { Application, Interview } from "../types";
import { toast } from "sonner";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  Wallet,
  FileText,
  Calendar,
} from "lucide-react";

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useAppTranslation();

  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null
  );
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showInterviewDetail, setShowInterviewDetail] = useState(false);

  const applicationId = id ? parseInt(id, 10) : 0;

  const { isSubmitting, handleSubmit } = useInterviewSchedule({
    applicationId,
    onSuccess: (interview) => {
      setShowInterviewModal(false);

      setApplication((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: "INTERVIEW" as any,
          interviews:
            interview && interview.scheduledAt
              ? [...(prev.interviews || []), interview]
              : prev.interviews,
        };
      });

      if (!interview || !interview.scheduledAt) {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    },
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const data = await getApplicationDetail(applicationId);
        setApplication(data);
      } catch (error) {
        toast.error(t("common.error"));
        navigate("/headhunter/applications");
      } finally {
        setIsLoading(false);
      }
    };
    if (applicationId) fetchDetail();
  }, [applicationId, navigate, t]);

  const handleStatusUpdate = async (status: string, successKey: string) => {
    if (!application) return;

    setApplication((prev) => {
      if (!prev) return prev;
      return { ...prev, status: status as any };
    });

    try {
      const updated = await updateApplicationStatus(
        application.id,
        status as any
      );
      if (updated) setApplication(updated);
      toast.success(t(successKey));
    } catch (error) {
      toast.error(t("applications.error.updateStatus") || t("common.error"));
    }
  };

  if (isLoading)
    return (
      <div className="max-w-4xl mx-auto p-10">
        <Skeleton className="h-96 w-full rounded-[2rem]" />
      </div>
    );

  if (!application)
    return (
      <div className="p-20 text-center text-gray-400 font-bold">
        {t("common.notFound")}
      </div>
    );

  const labelStyle =
    "text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2";

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-lime-400 flex items-center justify-center text-white">
            <User size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
              {application.fullName}
            </h1>
            <p className="text-gray-500 font-bold italic mt-1">
              {application.jobTitle}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="rounded-xl border-gray-200 hover:border-lime-400 hover:bg-lime-50 font-bold px-5 flex gap-2 cursor-pointer transition-all"
        >
          <ChevronLeft size={18} />
          {t("common.back")}
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="p-8 rounded-[2rem] border-gray-100 shadow-sm bg-white grid md:grid-cols-3 gap-8">
          <div className="space-y-1">
            <label className={labelStyle}>
              <Mail size={14} /> {t("applications.form.email")}
            </label>
            <p className="font-bold text-gray-700">{application.email}</p>
          </div>
          <div className="space-y-1">
            <label className={labelStyle}>
              <Phone size={14} /> {t("applications.form.phone")}
            </label>
            <p className="font-bold text-gray-700">{application.phone}</p>
          </div>
          <div className="space-y-1">
            <label className={labelStyle}>
              <Wallet size={14} /> {t("applications.form.salaryExpectation")}
            </label>
            <p className="font-bold text-lime-600">
              {application.salaryExpectation || "---"}
            </p>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 rounded-[2rem] border-gray-100 shadow-sm bg-white">
            <label className={labelStyle}>{t("columns.status")}</label>
            <div className="mt-2 flex items-center gap-3">
              <ApplicationStatusBadge status={application.status} />
              <span className="font-bold text-gray-700 uppercase text-sm">
                {t(`applications.status.${application.status.toLowerCase()}`)}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold mt-4 uppercase tracking-widest">
              {t("common.appliedAt")}:{" "}
              {formatDate(application.appliedAt, i18n.language)}
            </p>
          </Card>

          <Card className="p-8 rounded-[2rem] border-gray-100 shadow-sm bg-white flex flex-col justify-between">
            <label className={labelStyle}>
              <FileText size={14} /> {t("common.viewCV")}
            </label>
            {application.cvSnapshotUrl ? (
              <Button
                variant="outline"
                className="rounded-xl border-gray-200 font-bold hover:border-lime-400 transition-all cursor-pointer w-full mt-2"
                asChild
              >
                <a
                  href={application.cvSnapshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open CV File
                </a>
              </Button>
            ) : (
              <p className="text-gray-400 italic text-sm">No CV attached</p>
            )}
          </Card>
        </div>

        {application.coverLetter && (
          <Card className="p-8 rounded-[2rem] border-gray-100 shadow-sm bg-white">
            <label className={labelStyle}>
              {t("applications.form.coverLetter")}
            </label>
            <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-wrap mt-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 italic">
              "{application.coverLetter}"
            </p>
          </Card>
        )}

        {application.interviews && application.interviews.length > 0 && (
          <div className="space-y-4">
            <label className={labelStyle + " px-2"}>
              <Calendar size={14} /> {t("applications.interview.title")}
            </label>
            <div className="grid gap-3">
              {application.interviews.map((interview, index) => {
                if (!interview) return null;
                return (
                  <div
                    key={interview.id || index}
                    className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between hover:border-lime-400 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedInterview(interview);
                      setShowInterviewDetail(true);
                    }}
                  >
                    <div>
                      <p className="font-bold text-gray-800">
                        {interview.scheduledAt
                          ? formatDate(interview.scheduledAt, i18n.language)
                          : "---"}
                      </p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                        Code: {interview.interviewCode || "N/A"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-bold text-xs cursor-pointer text-lime-600 uppercase tracking-widest hover:bg-transparent hover:text-lime-600 p-0"
                    >
                      {t("common.view")}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 pt-4">
          {application.status === "APPLIED" && (
            <>
              <Button
                onClick={() =>
                  handleStatusUpdate(
                    "SCREENING",
                    "applications.success.reviewed"
                  )
                }
                className="flex-1 bg-lime-400 hover:bg-lime-500 text-white font-bold h-12 rounded-xl transition-all cursor-pointer uppercase text-xs tracking-widest"
              >
                {t("common.approve") || "Approve"}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  handleStatusUpdate(
                    "REJECTED",
                    "applications.success.rejected"
                  )
                }
                className="flex-1 border-red-200 text-red-500 hover:bg-red-50 font-bold h-12 rounded-xl transition-all cursor-pointer uppercase text-xs tracking-widest"
              >
                {t("common.reject")}
              </Button>
            </>
          )}

          {application.status === "SCREENING" && (
            <>
              <Button
                onClick={() => setShowInterviewModal(true)}
                className="flex-1 bg-lime-400 hover:bg-lime-500 text-white font-bold h-12 rounded-xl transition-all cursor-pointer uppercase text-xs tracking-widest"
              >
                {t("applications.interview.title")}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  handleStatusUpdate(
                    "REJECTED",
                    "applications.success.rejected"
                  )
                }
                className="flex-1 border-red-200 text-red-500 hover:bg-red-50 font-bold h-12 rounded-xl transition-all cursor-pointer uppercase text-xs tracking-widest"
              >
                {t("common.reject")}
              </Button>
            </>
          )}

          {application.status === "INTERVIEW" && (
            <>
              <Button
                onClick={() =>
                  handleStatusUpdate("PASSED", "applications.success.hired")
                }
                className="flex-1 bg-lime-400 hover:bg-lime-500 text-white font-bold h-12 rounded-xl transition-all cursor-pointer uppercase text-xs tracking-widest"
              >
                {t("applications.status.passed")}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  handleStatusUpdate(
                    "REJECTED",
                    "applications.success.rejected"
                  )
                }
                className="flex-1 border-red-200 text-red-500 hover:bg-red-50 font-bold h-12 rounded-xl transition-all cursor-pointer uppercase text-xs tracking-widest"
              >
                {t("common.reject")}
              </Button>
            </>
          )}
        </div>
      </div>

      <InterviewScheduleModal
        isOpen={showInterviewModal}
        onClose={() => setShowInterviewModal(false)}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
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
