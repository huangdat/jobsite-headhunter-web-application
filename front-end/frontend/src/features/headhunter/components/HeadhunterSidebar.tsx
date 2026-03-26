import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BiSolidBriefcase,
  BiSolidFileDoc,
  BiChart,
  BiCog,
  BiHeadphone,
} from "react-icons/bi";

export function HeadhunterSidebar() {
  const { t } = useTranslation("jobs");
  const items = [
    {
      to: "/headhunter/jobs",
      label: t("headhunter.jobPostings"),
      icon: BiSolidBriefcase,
    },
    {
      to: "/headhunter/cv",
      label: t("headhunter.manageCv"),
      icon: BiSolidFileDoc,
    },
    {
      to: "/headhunter/reports",
      label: t("headhunter.recruitmentReport"),
      icon: BiChart,
    },
    {
      to: "/headhunter/services",
      label: t("headhunter.myServices"),
      icon: BiSolidBriefcase,
    },
    {
      to: "/headhunter/promotions",
      label: t("headhunter.promotionCodes"),
      icon: BiSolidBriefcase,
    },
    {
      to: "/headhunter/orders",
      label: t("headhunter.orderTracking"),
      icon: BiSolidFileDoc,
    },
    {
      to: "/headhunter/activity",
      label: t("headhunter.activityLog"),
      icon: BiChart,
    },
    { to: "/settings", label: t("headhunter.accountSettings"), icon: BiCog },
    { to: "/support", label: t("headhunter.supportInbox"), icon: BiHeadphone },
  ];

  const IconComponent = (Icon: React.ComponentType<{ className?: string }>) => (
    <Icon className="w-5 h-5 text-slate-700" />
  );

  return (
    <aside className="w-72 bg-white text-black min-h-screen p-6 shadow-2xl">
      <div className="mb-6 pb-4">
        <div className="text-lg font-bold tracking-wide">
          {t("headhunter.profileTitle")}
        </div>
        <div className="text-xs text-slate-600 mt-1">
          {t("headhunter.profileTitle")}
        </div>
        <div className="mt-4">
          <Link
            to="/headhunter/jobs/new"
            className="inline-block w-full text-center bg-brand-primary text-black py-2 rounded-lg font-semibold hover:bg-brand-hover transition-colors"
          >
            {t("headhunter.postNewJob")}
          </Link>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-900 border border-transparent hover:border-l-4 hover:border-brand-primary] hover:shadow-md transition-all duration-200"
          >
            {it.icon && IconComponent(it.icon)}
            <span>{it.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default HeadhunterSidebar;
