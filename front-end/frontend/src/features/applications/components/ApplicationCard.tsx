import { Card } from "@/shared/ui-primitives/card";
import { Badge } from "@/shared/ui-primitives/badge";
import { Button } from "@/shared/ui-primitives/button";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import {
  SubsectionTitle,
  SmallText,
  Caption,
} from "@/shared/common-blocks/typography/Typography";
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
          <SubsectionTitle className="text-lg">
            {application.jobTitle}
          </SubsectionTitle>
          <SmallText variant="muted" className="mt-1">
            {application.fullName}
          </SmallText>
          {application.email && (
            <SmallText variant="muted">{application.email}</SmallText>
          )}
          <div className="mt-3 flex items-center gap-2">
            <Badge className={statusColor}>{statusLabel}</Badge>
            <Caption>
              {formatDate(application.appliedAt, i18n.language)}
            </Caption>
          </div>
          {application.salaryExpectation && (
            <SmallText variant="muted" className="mt-2">
              {t("applications.form.salaryExpectation")}:{" "}
              {application.salaryExpectation}
            </SmallText>
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

