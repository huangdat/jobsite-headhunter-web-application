import { NavLink } from "react-router-dom";
import { useJobsTranslation } from "@/shared/hooks";
import { BiHomeAlt, BiPlusCircle, BiCheckShield } from "react-icons/bi";

interface HeadhunterSidebarProps {
  onItemClick?: () => void;
}

export function HeadhunterSidebar({ onItemClick }: HeadhunterSidebarProps) {
  const { t } = useJobsTranslation();

  const items = [
    {
      to: "/home",
      label: t("headhunter.home"),
      icon: BiHomeAlt,
    },
    {
      to: "/headhunter/jobs/new",
      label: t("headhunter.postNewJob"),
      icon: BiPlusCircle,
    },
    {
      to: "/headhunter/jobs",
      label: t("headhunter.approveApplications"),
      icon: BiCheckShield,
    },
  ];

  return (
    <aside className="w-72 bg-white text-black min-h-screen p-6 flex flex-col">
      <nav className="flex-1 space-y-2 mt-4">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end
            onClick={onItemClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border border-transparent
              ${
                isActive
                  ? "bg-brand-primary/20 text-brand-primary shadow-sm border-brand-primary/30 ring-1 ring-brand-primary/10"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <it.icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-brand-primary" : "text-slate-400"
                  }`}
                />
                <span>{it.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default HeadhunterSidebar;
