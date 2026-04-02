import { Badge } from "@/components/ui/badge";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { formatApplicationStatus } from "../utils"; // Bỏ cái colors cũ đi
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

  const getLimeColor = (s: string) => {
    switch (s.toUpperCase()) {
      case "SUBMITTED":
        return "bg-lime-100 text-lime-700 border-lime-200 hover:bg-lime-100";
      case "SCREENING":
      case "HEADHUNTER_ACCEPTED":
        return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100";
      case "INTERVIEW":
        return "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600";
      case "PASSED":
      case "ACCEPTED":
        return "bg-lime-500 text-black font-bold border-lime-600 hover:bg-lime-500";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200 hover:bg-red-100";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100";
    }
  };

  return (
    <Badge
      variant="outline"
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm transition-colors ${getLimeColor(status as string)} ${className}`}
    >
      {label}
    </Badge>
  );
};
