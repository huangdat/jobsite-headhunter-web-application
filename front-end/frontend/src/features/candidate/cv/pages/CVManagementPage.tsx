/**
 * CVManagementPage Component
 * Main CV Management page - integrates all CV components
 */

import React, { useEffect } from "react";
import { useCandidateTranslation } from "@/shared/hooks";
import { PageContainer } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation/Breadcrumb";
import {
  CVErrorBanner,
  CVEmptyState,
  CVList,
  CVUploadZone,
  ProfileStrengthIndicator,
  CVOptimizationTips,
  CVBestPractices,
  PremiumServices,
} from "../components";
import { useCVManagement } from "../hooks";
import { Display, SmallText } from "@/shared/components/typography/Typography";

export const CVManagementPage: React.FC = () => {
  const { t } = useCandidateTranslation();
  const {
    state,
    uploadFile,
    deleteFile,
    downloadFile,
    makeFileActive,
    clearError,
    refreshData,
  } = useCVManagement();

  // Log state for debugging
  useEffect(() => {
    console.log("CV Management State:", state);
  }, [state]);

  const hasFiles = state.files.length > 0;

  return (
    <PageContainer variant="default" maxWidth="6xl">
      {/* Breadcrumbs & Page Title */}
      <div className="mb-8">
        <Breadcrumb
          items={[
            { label: t("breadcrumb.dashboard") || "Dashboard", href: "/" },
            { label: t("candidate.cv") || "CV Management" },
          ]}
          className="mb-4"
        />
        {/* Page Title */}
        <Display size="md" className="tracking-tight">
          {t("cv.management.title")}
        </Display>
      </div>

      {/* Main Content Grid: 8 cols main + 4 cols sidebar */}
      <div className="grid grid-cols-12 gap-8">
        {/* Main Content Area (col-span-8) */}
        <div className="col-span-8 space-y-6">
          {/* Error Banner */}
          {state.error && (
            <CVErrorBanner
              error={state.error}
              onDismiss={clearError}
              onRetry={() => {
                clearError();
                refreshData();
              }}
            />
          )}

          {/* Empty or List View */}
          {!hasFiles ? (
            <CVEmptyState
              onUpload={() => {
                const input = document.getElementById(
                  "cv-file-input"
                ) as HTMLInputElement;
                input?.click();
              }}
            />
          ) : (
            <>
              {/* Success Banner */}
              {!state.error && state.files.length > 0 && (
                <div className="bg-primary-container/20 border-l-4 border-primary p-5 rounded-xl flex items-start gap-4 shadow-sm">
                  <div className="bg-primary rounded-full p-1 shrink-0">
                    <span className="material-symbols-outlined text-white text-xs fill">
                      check
                    </span>
                  </div>
                  <div>
                    <SmallText
                      weight="bold"
                      className="text-on-primary-container"
                    >
                      {t("cv.management.success.banner")}
                    </SmallText>
                    {state.files[0] && (
                      <SmallText
                        variant="muted"
                        className="text-on-primary-container/80 mt-0.5"
                      >
                        {state.files[0].filename}
                        {t("cv.management.success.bannerDetail").replace(
                          "{{filename}}",
                          ""
                        )}
                      </SmallText>
                    )}
                  </div>
                </div>
              )}

              {/* Active Resumes List */}
              <CVList
                files={state.files}
                isLoading={state.isLoading}
                maxFiles={state.config.maxResumes}
                onView={(fileId) => {
                  console.log("View file:", fileId);
                }}
                onDownload={downloadFile}
                onDelete={deleteFile}
                onMakeActive={makeFileActive}
              />

              {/* Add Another Version Upload Zone */}
              {state.files.length < state.config.maxResumes && (
                <section className="space-y-3">
                  <h2 className="text-lg font-headline font-bold text-slate-900 dark:text-white">
                    {t("cv.management.success.addAnother")}
                  </h2>
                  <CVUploadZone
                    isLoading={state.isUploading}
                    onUpload={async (files: File[]) => {
                      if (files.length > 0) {
                        await uploadFile(files[0]);
                      }
                    }}
                    supportedFormats={state.config.supportedFormats}
                    maxFileSize={state.config.maxFileSize}
                    error={state.error}
                  />
                </section>
              )}
            </>
          )}
        </div>

        {/* Right Sidebar (col-span-4) */}
        <div className="col-span-4 space-y-6 h-fit sticky top-24">
          {/* Profile Strength Card */}
          <ProfileStrengthIndicator
            percentage={state.profile.strength.percentage}
            items={state.profile.strength.items}
            isLoading={state.isLoading}
          />

          {/* CV Optimization Tips */}
          <CVOptimizationTips isLoading={state.isLoading} />

          {/* Premium Services - CV Audit */}
          <PremiumServices
            section="booking"
            onAction={() => {
              console.log("Booking CV audit");
            }}
          />
        </div>
      </div>

      {/* Bottom Sections: Privacy + Best Practices (Full Width) */}
      <div className="mt-12">
        <CVBestPractices section="best_practices" isLoading={state.isLoading} />
      </div>

      {/* Hidden File Input */}
      <input
        id="cv-file-input"
        type="file"
        accept={state.config.supportedFormats.map((f) => `.${f}`).join(",")}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length > 0) {
            uploadFile(files[0]);
          }
        }}
        className="hidden"
        aria-label={t("cv.management.upload.selectFile")}
      />
    </PageContainer>
  );
};

export default CVManagementPage;
