import React from "react";
import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { getDarkClasses } from "@/lib/theme-classes";
import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { BusinessProfileDisplay } from "../components";
import { PageSkeleton, ErrorState } from "@/shared/components/states";

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
        {isLoading && <PageSkeleton variant="grid" count={1} />}

        {errorMessage && (
          <ErrorState
            error={new Error(errorMessage)}
            onRetry={() => window.location.reload()}
            title={t("business.error.fetch_title")}
          />
        )}

        {!isLoading && !errorMessage && profile && (
          <section
            className={`rounded-3xl border overflow-hidden transition-all ${getDarkClasses("border-slate-200 bg-white shadow-xl shadow-slate-200/50", "border-slate-700 bg-slate-900 shadow-xl shadow-slate-900/50")}`}
          >
            <div className="p-8 md:p-12">
              <BusinessProfileDisplay profile={profile} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BusinessProfilePage;
