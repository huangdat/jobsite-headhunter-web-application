import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import {
  ApplicationCard,
  InterviewDetailModal,
  ApplicationStatusBadge,
} from "../components";
import { useApplications } from "../hooks";
import type { Interview } from "../types";

export const MyApplicationsPage: React.FC = () => {
  const { t } = useAppTranslation();
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null
  );
  const [showInterviewDetail, setShowInterviewDetail] = useState(false);

  const { applications, isLoading, pagination, handlePageChange } =
    useApplications({
      isCandidateView: true,
      autoFetch: true,
    });

  const handleViewInterview = (applicationId: number) => {
    const app = applications.find((a) => a.id === applicationId);
    if (app?.interviews && app.interviews.length > 0) {
      setSelectedInterview(app.interviews[0]);
      setShowInterviewDetail(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("applications.myApplications")}
          </h1>
          <p className="text-gray-600 mt-2">
            {t("common.total")}: {pagination.totalElements}
          </p>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-24 w-full" />
              </Card>
            ))
          ) : applications.length === 0 ? (
            // Empty state
            <Card className="p-8 text-center">
              <p className="text-gray-500 mb-4">
                {t("applications.empty.noApplications")}
              </p>
              <Button variant="outline">{t("common.browseJobs")}</Button>
            </Card>
          ) : (
            // Applications list
            applications.map((app) => (
              <Card key={app.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{app.jobTitle}</h3>
                    <div className="mt-3 flex items-center gap-2">
                      <ApplicationStatusBadge status={app.status} />
                      <span className="text-xs text-gray-500">
                        {t("common.appliedAt")}:{" "}
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {app.interviews && app.interviews.length > 0 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleViewInterview(app.id)}
                    >
                      {t("applications.interview.title")}
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {!isLoading && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {t("common.page")} {pagination.page + 1} {t("common.of")}{" "}
              {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={pagination.page === 0}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                {t("common.previous")}
              </Button>
              <Button
                variant="outline"
                disabled={pagination.page === pagination.totalPages - 1}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                {t("common.next")}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Interview Detail Modal */}
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
