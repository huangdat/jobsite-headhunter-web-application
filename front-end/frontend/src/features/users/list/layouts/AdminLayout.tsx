import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { MdOutlineHandshake } from "react-icons/md";
import { useAppTranslation } from "@/shared/hooks";
import { useAuth } from "@/features/auth/context/useAuth";
import { getSemanticClass } from "@/lib/design-tokens";
import {
  getAdminFeatures,
  type AdminFeature,
} from "@/features/users/config/adminFeaturesConfig";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
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

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-[#111827] hidden md:flex flex-col text-slate-300">
        <a href="/home" className="hover:opacity-80 transition-opacity">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-brand-primary p-1.5 rounded-lg">
              <MdOutlineHandshake className="text-black text-lg" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-white">
              Job
              <span className="text-brand-primary">Site</span>
            </h1>
          </div>
        </a>

        <nav className="flex-1 px-4 space-y-2 py-4">
          <a
            href="/home"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="font-medium text-sm">Home</span>
          </a>

          <a
            href="/admin/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              isRouteActive("/admin/dashboard")
                ? getSemanticClass("success", "bg", true) +
                  " text-black font-semibold"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-medium text-sm">
              {t("navigation.dashboard")}
            </span>
          </a>

          {adminFeatures
            .filter((feature: AdminFeature) => feature.route !== "/admin/logs")
            .map((feature: AdminFeature) => (
              <a
                key={feature.id}
                href={feature.route}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isRouteActive(feature.route)
                    ? getSemanticClass("success", "bg", true) +
                      " text-black font-semibold"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
                title={feature.description ? t(feature.description) : undefined}
              >
                <span className="material-symbols-outlined">
                  {feature.icon}
                </span>
                <span className="font-medium text-sm">
                  {t(feature.labelKey)}
                </span>
              </a>
            ))}
        </nav>
      </aside>

      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};
