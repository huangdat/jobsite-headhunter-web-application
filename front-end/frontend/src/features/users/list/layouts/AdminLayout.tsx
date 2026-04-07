import React, { useMemo } from "react";
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

  /**
   * Get available admin features based on user role
   */
  const adminFeatures = useMemo(() => {
    return getAdminFeatures(user?.role);
  }, [user?.role]);

  /**
   * Check if a route is currently active
   * Fix: Distinguish between /users (list) vs /users/classification or /users/:userId
   */
  const isRouteActive = (route: string): boolean => {
    const pathname = window.location.pathname;

    if (route === "/admin/users") {
      // Only active on /admin/users or /admin/users?... (not on child routes)
      return (
        pathname === "/admin/users" || !!pathname.match(/^\/admin\/users\?/)
      );
    }

    if (route === "/admin/users/classification") {
      // Active on /admin/users/classification exactly
      return pathname === "/admin/users/classification";
    }

    // Default exact match
    return pathname === route;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] hidden md:flex flex-col text-slate-300">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-brand-primary p-1.5 rounded-lg">
            <MdOutlineHandshake className="text-black text-lg" />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-white">
            Job
            <span className="text-brand-primary">Site</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 py-4">
          {/* Home / Dashboard */}
          <a
            href="/home"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-medium text-sm">
              {t("navigation.dashboard")}
            </span>
          </a>

          {/* Admin Features (Dynamic) */}
          {adminFeatures.map((feature: AdminFeature) => (
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
              <span className="material-symbols-outlined">{feature.icon}</span>
              <span className="font-medium text-sm">{t(feature.labelKey)}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};
