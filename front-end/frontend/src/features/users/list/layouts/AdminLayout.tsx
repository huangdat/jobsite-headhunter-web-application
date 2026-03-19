import React from "react";
import { useAppTranslation } from "@/shared/hooks";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { t } = useAppTranslation();
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
          <a
            href="/home"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-medium text-sm">
              {t("navigation.dashboard")}
            </span>
          </a>
          <a
            href="/users"
            className="flex items-center gap-3 px-4 py-3 bg-green-500 text-white rounded-xl"
          >
            <span className="material-symbols-outlined">group</span>
            <span className="font-medium text-sm">{t("navigation.users")}</span>
          </a>
          <a
            href="/users/classification"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined">category</span>
            <span className="font-medium text-sm">
              {t("navigation.classification")}
            </span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined">assignment</span>
            <span className="font-medium text-sm">{t("navigation.logs")}</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-medium text-sm">
              {t("navigation.settings")}
            </span>
          </a>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/5 p-4 rounded-xl flex items-center gap-3">
            <div className="size-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-bold">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-white">
                {t("common.adminUserTitle")}
              </p>
              <p className="text-[10px] text-slate-400">
                {t("common.appVersion")}
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
