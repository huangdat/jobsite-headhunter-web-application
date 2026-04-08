import { Link, useLocation } from "react-router-dom";
import { useAppTranslation } from "@/shared/hooks";
import { useAuth } from "@/features/auth/context/useAuth";
import { getSemanticClass } from "@/lib/design-tokens";
import {
  getAdminFeatures,
  type AdminFeature,
} from "@/features/users/config/adminFeaturesConfig";
import { useMemo } from "react";

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onItemClick?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed = false,
  onItemClick,
}) => {
  const { t } = useAppTranslation();
  const { user } = useAuth();
  const location = useLocation();

  const adminFeatures = useMemo(() => {
    return getAdminFeatures(user?.role);
  }, [user?.role]);

  const isRouteActive = (route: string): boolean => {
    const pathname = location.pathname;
    if (route === "/admin/users") {
      return (
        pathname === "/admin/users" || !!pathname.match(/^\/admin\/users\?/)
      );
    }
    if (route === "/admin/users/classification") {
      return pathname === "/admin/users/classification";
    }
    return pathname === route;
  };

  const menuItems = [
    {
      label: t("navigation.dashboard"),
      route: "/admin/dashboard",
      icon: "dashboard",
    },
    ...adminFeatures
      .filter((f: AdminFeature) => f.route !== "/admin/logs")
      .map((feature: AdminFeature) => ({
        label: t(feature.labelKey),
        route: feature.route,
        icon: feature.icon,
      })),
  ];

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white text-slate-700 flex-col overflow-y-auto border-r border-slate-200 z-40 transition-transform duration-300 flex ${
        isCollapsed ? "-translate-x-full" : "translate-x-0"
      }`}
    >
      <nav className="flex-1 px-3 py-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.route}
            to={item.route}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
              isRouteActive(item.route)
                ? getSemanticClass("success", "bg", true) + " text-black"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <span className="material-symbols-outlined text-lg flex-shrink-0">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
