import React, { useMemo } from "react";
import { useHomeTranslation, useCommonTranslation } from "@/shared/hooks";
import { useAuth } from "@/features/auth/context/useAuth";
import {
  getAdminFeatures,
  type AdminFeature,
} from "@/features/users/config/adminFeaturesConfig";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { t: tNav } = useHomeTranslation();
  const { t: tCommon } = useCommonTranslation();
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

    if (route === "/users") {
      // Only active on /users or /users?... (not on child routes like /users/classification or /users/:id)
      return pathname === "/users" || !!pathname.match(/^\/users\?/);
    }

    if (route === "/users/classification") {
      // Active on /users/classification exactly
      return pathname === "/users/classification";
    }

    // Default exact match
    return pathname === route;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] hidden md:flex flex-col text-slate-300">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-green-500 p-2 rounded-lg text-white">
            <span className="material-symbols-outlined">shield_person</span>
          </div>
          <h1 className="font-bold text-xl tracking-tight text-white">
            Job<span className="text-green-500">Site</span>
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
              {tNav("navigation.dashboard")}
            </span>
          </a>

          {/* Admin Features (Dynamic) */}
          {adminFeatures.map((feature: AdminFeature) => (
            <a
              key={feature.id}
              href={feature.route}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isRouteActive(feature.route)
                  ? "bg-green-500 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
              title={
                feature.description ? tNav(feature.description) : undefined
              }
            >
              <span className="material-symbols-outlined">{feature.icon}</span>
              <span className="font-medium text-sm">
                {tNav(feature.labelKey)}
              </span>
            </a>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/5 p-4 rounded-xl flex items-center gap-3">
            <div className="size-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-bold">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-white">
                {tCommon("adminUserTitle")}
              </p>
              <p className="text-[10px] text-slate-400">
                {tCommon("appVersion")}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};
