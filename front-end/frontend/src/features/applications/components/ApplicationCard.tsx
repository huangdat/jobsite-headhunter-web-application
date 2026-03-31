import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import {
  formatDate,
  formatApplicationStatus,
  APPLICATION_STATUS_COLORS,
} from "../utils";
import type { Application } from "../types";

interface ApplicationCardProps {
  application: Application;
  onViewDetail?: (id: number) => void;
  onViewInterview?: (id: number) => void;
  isHeadhunter?: boolean;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onViewDetail,
  onViewInterview,
  isHeadhunter = false,
}) => {
  const { t, i18n } = useAppTranslation();
  const statusLabel = formatApplicationStatus(application.status, t);
  const statusColor = APPLICATION_STATUS_COLORS[application.status];

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{application.jobTitle}</h3>
          <p className="text-sm text-gray-600 mt-1">{application.fullName}</p>
          {application.email && (
            <p className="text-sm text-gray-500">{application.email}</p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <Badge className={statusColor}>{statusLabel}</Badge>
            <span className="text-xs text-gray-500">
              {formatDate(application.appliedAt, i18n.language)}
            </span>
          </div>
          {application.salaryExpectation && (
            <p className="text-sm text-gray-600 mt-2">
              {t("applications.form.salaryExpectation")}:{" "}
              {application.salaryExpectation}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {isHeadhunter && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetail?.(application.id)}
            >
              {t("common.view")}
            </Button>
          )}
          {application.interviews && application.interviews.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewInterview?.(application.id)}
            >
              {t("applications.interview.title")}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
