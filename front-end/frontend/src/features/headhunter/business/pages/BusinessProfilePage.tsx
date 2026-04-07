import React from "react";
import { Button } from "@/shared/ui-primitives/button";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { getDarkClasses } from "@/lib/theme-classes";
import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { BusinessProfileDisplay } from "../components";
import { PageSkeleton } from "@/shared/common-blocks/states/PageSkeleton";
import { ErrorState } from "@/shared/common-blocks/states/ErrorState";
import { ChevronLeft } from "lucide-react"; // Đã import thêm icon giống bên Candidate

/**
 * Business Profile Page (Read-only version)
 * Displays company information set during registration
 */
export const BusinessProfilePage: React.FC = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();

  const { profile, isLoading, errorMessage } = useBusinessProfile();

  return (
    <div className="min-h-screen bg-slate-50/30">
      <Toaster position="top-right" richColors closeButton />

      {/* PHẦN HEADER: Đã đồng bộ giống 100% với trang ProfileEditPage */}
      <div className="mb-12 bg-[#069261] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/60">
                <span>{t("business.breadcrumb.business")}</span>
                <span className="opacity-40">/</span>
                <span>{t("business.breadcrumb.profile")}</span>
              </div>
              
              <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                {t("business.page.title")}
              </h1>
              
              <p className="max-w-2xl text-sm font-medium text-emerald-50/80">
                {t("business.page.description")}
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="hidden items-center gap-2 font-bold uppercase tracking-widest text-white hover:text-slate-300 dark:hover:text-slate-400 hover:bg-transparent md:flex text-[11px] cursor-pointer transition-colors"
            >
              <ChevronLeft size={16} />
              {t("common.back")}
            </Button>
          </div>
        </div>
      </div>

      {/* PHẦN NỘI DUNG CHÍNH */}
      <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
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
            className={`rounded-3xl border overflow-hidden transition-all ${getDarkClasses("border-slate-200 bg-white", "border-slate-700 bg-slate-900 shadow-xl")}`}
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
