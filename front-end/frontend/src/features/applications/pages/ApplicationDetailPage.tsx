import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/shared/ui-primitives/card";
import { Button } from "@/shared/ui-primitives/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/shared/ui-primitives/alert-dialog";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { getSemanticClass } from "@/lib/design-tokens";
import {
  Display,
  SmallText,
  MetaText,
  BodyText,
} from "@/shared/common-blocks/typography/Typography";
import {
  InterviewScheduleModal,
  InterviewDetailModal,
  ApplicationStatusBadge,
} from "../components";
import { useInterviewSchedule } from "../hooks";
import { Breadcrumb } from "@/shared/common-blocks/navigation/Breadcrumb";
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
import { PageContainer } from "@/shared/common-blocks/layout";
import { PageSkeleton } from "@/shared/common-blocks/states";
import { ErrorState } from "@/shared/common-blocks/states/ErrorState";

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useAppTranslation();

  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null
  );
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showInterviewDetail, setShowInterviewDetail] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [isRejectingPending, setIsRejectingPending] = useState(false);

  const applicationId = id ? parseInt(id, 10) : 0;

  const { isSubmitting, handleSubmit } = useInterviewSchedule({
    applicationId,
    onSuccess: (interview) => {
      setShowInterviewModal(false);

      setApplication((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: "INTERVIEW" as Application["status"],
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
        setError(null);
        const data = await getApplicationDetail(applicationId);
        setApplication(data);
      } catch (err) {
        const errorObj =
          err instanceof Error ? err : new Error(t("common.error"));
        setError(errorObj);
        toast.error(t("common.error"));
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
      return { ...prev, status: status as Application["status"] };
    });

    try {
      const updated = await updateApplicationStatus(
        application.id,
        status as Application["status"]
      );
      if (updated) setApplication(updated);
      toast.success(t(successKey));
    } catch {
      toast.error(t("applications.error.updateStatus"));
    }
  };

  const handleOpenRejectConfirm = () => {
    setShowRejectConfirm(true);
  };

  const handleConfirmReject = async () => {
    setIsRejectingPending(true);
    try {
      await handleStatusUpdate("REJECTED", "applications.success.rejected");
      setShowRejectConfirm(false);
    } finally {
      setIsRejectingPending(false);
    }
  };

  if (isLoading)
    return (
      <PageContainer variant="white" maxWidth="4xl">
        <PageSkeleton variant="grid" count={1} />
      </PageContainer>
    );

  if (error)
    return (
      <PageContainer variant="white" maxWidth="4xl">
        <ErrorState
          error={error}
          onRetry={() => window.location.reload()}
          title={t("applications.errorLoading")}
        />
      </PageContainer>
    );

  if (!application)
    return (
      <PageContainer variant="white" maxWidth="4xl">
        <ErrorState
          error={new Error(t("common.notFound"))}
          onRetry={() => navigate("/my-applications")}
          title={t("applications.notFound")}
        />
      </PageContainer>
    );

  const LabelWithIcon = ({
    children,
    icon: Icon,
  }: {
    children: React.ReactNode;
    icon?: React.ReactNode;
  }) => (
    <MetaText className="flex items-center gap-2 mb-1">
      {Icon}
      {children}
    </MetaText>
  );

  return (
    <PageContainer variant="white" maxWidth="4xl">
      <Breadcrumb
        items={[
          {
            label: t("breadcrumb.applications") || "Applications",
            href: "/applications",
          },
          { label: application?.fullName || "" },
        ]}
        className="mb-6"
      />

      <div className="flex justify-between items-end mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center text-black">
            <User size={28} />
          </div>
          <div>
            <Display className="uppercase">{application.fullName}</Display>
            <SmallText variant="muted" weight="bold" className="italic mt-1">
              {application.jobTitle}
            </SmallText>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="rounded-xl border-gray-200 hover:border-brand-primary hover:bg-brand-primary/10 px-5 flex gap-2 cursor-pointer transition-all"
        >
          <ChevronLeft size={18} />
          <SmallText weight="bold">{t("common.back")}</SmallText>
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="p-8 rounded-[2rem] border-gray-100 shadow-sm bg-white grid md:grid-cols-3 gap-8">
          <div className="space-y-1">
            <LabelWithIcon icon={<Mail size={14} />}>
              {t("applications.form.email")}
            </LabelWithIcon>
            <SmallText weight="bold">{application.email}</SmallText>
          </div>
          <div className="space-y-1">
            <LabelWithIcon icon={<Phone size={14} />}>
              {t("applications.form.phone")}
            </LabelWithIcon>
            <SmallText weight="bold">{application.phone}</SmallText>
          </div>
          <div className="space-y-1">
            <LabelWithIcon icon={<Wallet size={14} />}>
              {t("applications.form.salaryExpectation")}
            </LabelWithIcon>
            <SmallText weight="bold" className="text-brand-primary">
              {application.salaryExpectation || "---"}
            </SmallText>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 rounded-[2rem] border-gray-100 shadow-sm bg-white">
            <MetaText className="mb-1">{t("columns.status")}</MetaText>
            <div className="mt-2 flex items-center gap-3">
              <ApplicationStatusBadge status={application.status} />
            </div>
            <MetaText className="mt-4">
              {t("common.appliedAt")}:{" "}
              {formatDate(application.appliedAt, i18n.language)}
            </MetaText>
          </Card>

          <Card className="p-8 rounded-[2rem] border-gray-100 shadow-sm bg-white flex flex-col justify-between">
            <LabelWithIcon icon={<FileText size={14} />}>
              {t("common.viewCV")}
            </LabelWithIcon>
            {application.cvSnapshotUrl ? (
              <Button
                variant="outline"
                className="rounded-xl border-gray-200 hover:border-brand-primary transition-all cursor-pointer w-full mt-2"
                asChild
              >
                <a
                  href={application.cvSnapshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SmallText weight="bold">
                    {t("common.downloadCV") || "Open CV File"}
                  </SmallText>
                </a>
              </Button>
            ) : (
              <SmallText variant="muted" className="italic mt-2">
                {t("common.noCVAttached") || "No CV attached"}
              </SmallText>
            )}
          </Card>
        </div>

        {application.coverLetter && (
          <Card className="p-8 rounded-[2rem] border-gray-100 shadow-sm bg-white">
            <MetaText className="mb-1">
              {t("applications.form.coverLetter")}
            </MetaText>
            <BodyText className="whitespace-pre-wrap mt-4 bg-gray-50/50 dark:bg-gray-900/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 italic">
              "{application.coverLetter}"
            </BodyText>
          </Card>
        )}

        {application.interviews && application.interviews.length > 0 && (
          <div className="space-y-4">
            <LabelWithIcon icon={<Calendar size={14} />}>
              {t("applications.interview.title")}
            </LabelWithIcon>
            <div className="grid gap-3">
              {application.interviews.map((interview, index) => {
                if (!interview) return null;
                return (
                  <div
                    key={interview.id || index}
                    className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between hover:border-brand-primary transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedInterview(interview);
                      setShowInterviewDetail(true);
                    }}
                  >
                    <div>
                      <SmallText weight="bold">
                        {interview.scheduledAt
                          ? formatDate(interview.scheduledAt, i18n.language)
                          : "---"}
                      </SmallText>
                      <MetaText className="mt-1">
                        Code: {interview.interviewCode || "N/A"}
                      </MetaText>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer text-brand-primary hover:bg-transparent hover:text-brand-primary p-0"
                    >
                      <MetaText className="text-brand-primary">
                        {t("common.view")}
                      </MetaText>
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
                variant="brand-primary"
                size="xl"
                className="flex-1 cursor-pointer"
              >
                <MetaText className="text-white font-bold">
                  {t("common.approve") || "Approve"}
                </MetaText>
              </Button>
              <Button
                variant="outline"
                onClick={handleOpenRejectConfirm}
                className={`flex-1 h-12 rounded-xl transition-all cursor-pointer border ${getSemanticClass("danger", "border", true)} ${getSemanticClass("danger", "text", true)} hover:${getSemanticClass("danger", "bg", true)}`}
              >
                <MetaText className={getSemanticClass("danger", "text", true)}>
                  {t("common.reject")}
                </MetaText>
              </Button>
            </>
          )}

          {application.status === "SCREENING" && (
            <>
              <Button
                onClick={() => setShowInterviewModal(true)}
                variant="brand-primary"
                size="xl"
                className="flex-1 cursor-pointer"
              >
                <MetaText className="text-white font-bold">
                  {t("applications.interview.title")}
                </MetaText>
              </Button>
              <Button
                variant="outline"
                onClick={handleOpenRejectConfirm}
                className={`flex-1 h-12 rounded-xl transition-all cursor-pointer border ${getSemanticClass("danger", "border", true)} ${getSemanticClass("danger", "text", true)} hover:${getSemanticClass("danger", "bg", true)}`}
              >
                <MetaText className={getSemanticClass("danger", "text", true)}>
                  {t("common.reject")}
                </MetaText>
              </Button>
            </>
          )}

          {application.status === "INTERVIEW" && (
            <>
              <Button
                onClick={() =>
                  handleStatusUpdate("PASSED", "applications.success.hired")
                }
                variant="brand-primary"
                size="xl"
                className="flex-1 cursor-pointer"
              >
                <MetaText className="text-white font-bold">
                  {t("applications.status.passed")}
                </MetaText>
              </Button>
              <Button
                variant="outline"
                onClick={handleOpenRejectConfirm}
                className={`flex-1 h-12 rounded-xl transition-all cursor-pointer border ${getSemanticClass("danger", "border", true)} ${getSemanticClass("danger", "text", true)} hover:${getSemanticClass("danger", "bg", true)}`}
              >
                <MetaText className={getSemanticClass("danger", "text", true)}>
                  {t("common.reject")}
                </MetaText>
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

      <AlertDialog open={showRejectConfirm} onOpenChange={setShowRejectConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("applications.confirm.rejectTitle") || "Confirm Rejection"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("applications.confirm.rejectDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel className="cursor-pointer ">
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReject}
              disabled={isRejectingPending}
              className="bg-red-600 cursor-pointer hover:bg-red-700 text-white"
            >
              {isRejectingPending
                ? t("common.processing") || "Processing..."
                : t("common.reject")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
};
