import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
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
      setApplication((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          interviews: [...(prev.interviews || []), interview],
        };
      });
      setShowInterviewModal(false);
      toast.error(t("common.error"));
    },
  });

  // Fetch application detail
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

    if (applicationId) {
      fetchDetail();
    }
  }, [applicationId, navigate, t]);

  const handleApproveApplication = async () => {
    if (!application) return;
    try {
      const updated = await updateApplicationStatus(
        application.id,
        "SCREENING"
      );
      setApplication(updated);
      toast.success(t("applications.success.reviewed"));
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const handleRejectApplication = async () => {
    if (!application) return;
    try {
      const updated = await updateApplicationStatus(application.id, "REJECTED");
      setApplication(updated);
      toast.success(t("applications.success.rejected"));
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const handleHireCandidate = async () => {
    if (!application) return;
    try {
      const updated = await updateApplicationStatus(application.id, "PASSED");
      setApplication(updated);
      toast.success(t("applications.success.hired"));
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-3xl">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-3xl">
          <p className="text-gray-500">{t("common.notFound")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-3xl">
        {/* Back Button */}
        <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
          {t("common.back")}
        </Button>

        {/* Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{application.fullName}</h1>
              <p className="text-gray-600 mt-2">{application.jobTitle}</p>
              <div className="mt-4">
                <ApplicationStatusBadge status={application.status} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{t("common.appliedAt")}</p>
              <p className="font-semibold">
                {formatDate(application.appliedAt, i18n.language)}
              </p>
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {t("common.contactInfo")}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">
                {t("applications.form.email")}
              </label>
              <p className="font-medium">{application.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">
                {t("applications.form.phone")}
              </label>
              <p className="font-medium">{application.phone}</p>
            </div>
            {application.salaryExpectation && (
              <div>
                <label className="text-sm text-gray-600">
                  {t("applications.form.salaryExpectation")}
                </label>
                <p className="font-medium">{application.salaryExpectation}</p>
              </div>
            )}
          </div>
        </Card>

        {/* CV & Cover Letter */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {t("applications.form.selectCV")}
          </h2>
          {application.cvSnapshotUrl && (
            <Button variant="outline" asChild>
              <a
                href={application.cvSnapshotUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                📄 {t("common.viewCV")}
              </a>
            </Button>
          )}

          {application.coverLetter && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">
                {t("applications.form.coverLetter")}
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {application.coverLetter}
              </p>
            </div>
          )}
        </Card>

        {/* Interviews */}
        {application.interviews && application.interviews.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {t("applications.interview.title")}
            </h2>
            <div className="space-y-3">
              {application.interviews.map((interview) => (
                <div
                  key={interview.id}
                  className="border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setSelectedInterview(interview);
                    setShowInterviewDetail(true);
                  }}
                >
                  <div>
                    <p className="font-medium">
                      {formatDate(interview.scheduledAt, i18n.language)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Code: {interview.interviewCode}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    {t("common.view")}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">{t("common.actions")}</h2>
          <div className="flex flex-wrap gap-3">
            {(application.status as string) === "SUBMITTED" && (
              <>
                <Button
                  onClick={handleApproveApplication}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {t("applications.status.screening")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRejectApplication}
                  className="flex-1"
                >
                  {t("common.reject")}
                </Button>
              </>
            )}

            {(application.status as string) === "HEADHUNTER_ACCEPTED" && (
              <>
                <Button
                  onClick={() => setShowInterviewModal(true)}
                  className="flex-1"
                >
                  {t("applications.interview.title")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRejectApplication}
                  className="flex-1"
                >
                  {t("common.reject")}
                </Button>
              </>
            )}

            {application.status === "INTERVIEW" && (
              <>
                <Button onClick={handleHireCandidate} className="flex-1">
                  {t("applications.status.passed")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRejectApplication}
                  className="flex-1"
                >
                  {t("common.reject")}
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Modals */}
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
