import React from "react";
import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { getDarkClasses } from "@/lib/theme-classes";
import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { BusinessProfileDisplay } from "../components";

/**
 * Business Profile Page (Read-only version)
 * Displays company information set during registration
 */
export const BusinessProfilePage: React.FC = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();

  const { profile, isLoading, errorMessage } = useBusinessProfile();

  return (
    <div
      className={getDarkClasses(
        "min-h-screen bg-slate-50",
        "min-h-screen bg-slate-950"
      )}
    >
      <Toaster position="top-right" richColors closeButton />

      {/* Header Profile */}
      <div
        className={`relative h-40 ${getDarkClasses("bg-linear-to-r from-slate-700 to-slate-800", "bg-linear-to-r from-slate-900 to-slate-950")}`}
      >
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:20px_20px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative h-full flex flex-col justify-end pb-8">
          <div className="mb-4 flex items-center justify-between">
            <nav
              className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] ${getDarkClasses("text-slate-600", "text-slate-400")}`}
            >
              <span>{t("business.breadcrumb.business")}</span>
              <span>/</span>
              <span className="text-white">
                {t("business.breadcrumb.profile")}
              </span>
            </nav>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest 
              h-auto p-1 cursor-pointer transition-colors ${getDarkClasses("text-slate-700 hover:text-slate-900", "text-slate-300 hover:text-slate-100")}`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {t("common.back")}
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1
                className={`text-4xl font-black tracking-tight ${getDarkClasses("text-slate-900", "text-white")}`}
              >
                {t("business.page.title")}
              </h1>
              <p
                className={`mt-2 max-w-2xl font-medium opacity-90 text-sm italic ${getDarkClasses("text-slate-700", "text-slate-300")}`}
              >
                {t("business.page.description")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8 pt-8">
        <section
          className={`rounded-3xl border overflow-hidden transition-all min-h-[400px] ${getDarkClasses("border-slate-200 bg-white shadow-xl shadow-slate-200/50", "border-slate-700 bg-slate-900 shadow-xl shadow-slate-900/50")}`}
        >
          {isLoading ? (
            // Loading state
            <div className="flex h-[400px] items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div
                  className={`h-12 w-12 animate-spin rounded-full border-4 ${getDarkClasses("border-slate-200 border-t-slate-700", "border-slate-700 border-t-slate-300")}`}
                />
                <p
                  className={`text-xs font-bold uppercase tracking-widest animate-pulse ${getDarkClasses("text-slate-400", "text-slate-500")}`}
                >
                  {t("business.state.loading")}
                </p>
              </div>
            </div>
          ) : errorMessage ? (
            // Error state
            <div className="p-12 text-center space-y-4">
              <div
                className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center ${getDarkClasses("bg-rose-50 text-rose-500", "bg-rose-900/20 text-rose-400")}`}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3
                className={`text-xl font-bold ${getDarkClasses("text-slate-900", "text-slate-100")}`}
              >
                {t("business.error.fetch_title")}
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto">{errorMessage}</p>
            </div>
          ) : profile ? (
            <div className="p-8 md:p-12">
              <BusinessProfileDisplay profile={profile} />
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default BusinessProfilePage;
