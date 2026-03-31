import { Badge } from "@/components/ui/badge";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { formatApplicationStatus, APPLICATION_STATUS_COLORS } from "../utils";
import type { ApplicationStatus } from "../types";

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const { t } = useAppTranslation();
  const label = formatApplicationStatus(status, t);
  const color = APPLICATION_STATUS_COLORS[status];

  return <Badge className={`${color} ${className}`}>{label}</Badge>;
};
