import { Badge } from "@/shared/ui-primitives/badge";
import { getStatusBadgeClass } from "@/lib/design-tokens";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { formatApplicationStatus } from "../utils";
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
  const statusClass = getStatusBadgeClass(status as string);

  return (
    <Badge
      variant="outline"
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm transition-colors ${statusClass} ${className}`}
    >
      {label}
    </Badge>
  );
};

