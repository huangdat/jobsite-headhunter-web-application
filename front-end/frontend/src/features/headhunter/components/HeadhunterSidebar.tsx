import { NavLink } from "react-router-dom";
import { useJobsTranslation } from "@/shared/hooks";
import { BiHomeAlt, BiPlusCircle, BiCheckShield } from "react-icons/bi";
import { getDarkClasses, getTextClasses } from "@/lib/theme-classes";

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

  // Consistent sidebar styling with dark mode
  const sidebarBg = getDarkClasses("bg-white", "bg-slate-900");
  const sidebarText = getTextClasses("primary");
  const sidebarBorder = getDarkClasses("border-slate-100", "border-slate-700");

  return (
    <aside
      className={`w-72 ${sidebarBg} ${sidebarText} min-h-screen p-6 flex flex-col border-r ${sidebarBorder}`}
    >
      <nav className="flex-1 space-y-2 mt-4">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end
            onClick={onItemClick}
            className={({ isActive }) => {
              if (isActive) {
                const activeBg = getDarkClasses("bg-slate-200", "bg-slate-700");
                const activeBorder = getDarkClasses(
                  "border-slate-400",
                  "border-slate-600"
                );
                return `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 border ${activeBg} ${getTextClasses("primary")} ${activeBorder} shadow-sm`;
              }
              return `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 border ${getTextClasses("secondary")} border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100`;
            }}
          >
            {({ isActive }) => (
              <>
                <it.icon
                  className={`w-5 h-5 transition-colors ${
                    isActive
                      ? "text-slate-900 dark:text-slate-100"
                      : "text-slate-500 dark:text-slate-400"
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
