import React, { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import {
  Display,
  SubsectionTitle,
  SmallText,
} from "@/shared/components/typography/Typography";
import type { VerificationStatus as VerificationStatusType } from "../types/business.types";
import { useBusinessVerification } from "../hooks/useBusinessVerification";
import {
  BusinessIdentityForm,
  VerificationStatus,
  SubmittedDocuments,
  ProfileStrengthCard,
  OptimizationTips,
  CompanyBestPractices,
  SuccessBanner,
  ErrorBanner,
} from "../components";
import { PageContainer } from "@/shared/components/layout";

/**
 * Main page for business profile management and verification
 * Layout: 8-column main content + 4-column sidebar
 * States: form-filling → submitted → error
 */
export const BusinessProfilePage: React.FC = () => {
  const { t } = useAppTranslation();
  const {
    // Profile state
    formData,
    verificationSteps,
    documents,
    profileStrength,
    isLoading,
    isSubmitting,
    errorMessage,
    successMessage,

    // Form state
    formErrors,
    touchedFields,

    // Form actions
    handleFieldChange,
    handleFieldBlur,
    submitProfile,

    // UI management
    clearMessages,
  } = useBusinessVerification();

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearMessages]);

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitProfile();
  };

  // Map VerificationStepStatus to VerificationStatus
  const mapStepStatusToVerification = (
    stepStatus?: string
  ): VerificationStatusType => {
    switch (stepStatus) {
      case "completed":
        return "APPROVED";
      case "in_progress":
        return "PENDING";
      default:
        return "PENDING";
    }
  };

  const currentVerificationStatus = useMemo(
    () => mapStepStatusToVerification(verificationSteps?.[0]?.status),
    [verificationSteps]
  );

  // Determine page state
  const isSubmitted = verificationSteps && verificationSteps.length > 0;
  const hasError = errorMessage !== null;
  const hasDocuments = documents && documents.length > 0;

  return (
    <PageContainer variant="white" maxWidth="7xl">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2">
        <SmallText variant="muted">
          {t("business.breadcrumb.business")}
        </SmallText>
        <span className="text-gray-300 dark:text-gray-600">{">"} </span>
        <SmallText weight="bold" className="text-gray-900 dark:text-gray-100">
          {t("business.breadcrumb.profile")}
        </SmallText>
      </nav>

      {/* Header Section */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <Display>{t("business.page.title")}</Display>
          <SmallText variant="muted" className="mt-2">
            {t("business.page.description")}
          </SmallText>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <SmallText weight="medium">
              {t("business.button.documentation")}
            </SmallText>
          </Button>
          <Button>
            <SmallText weight="medium" className="text-white">
              {t("business.button.preview")}
            </SmallText>
          </Button>
        </div>
      </div>
      {/* Error Banner */}
      {hasError && (
        <div className="mb-6">
          <ErrorBanner message={errorMessage || ""} onDismiss={clearMessages} />
        </div>
      )}

      {/* Success Banner */}
      {successMessage && (
        <div className="mb-6">
          <SuccessBanner message={successMessage} onDismiss={clearMessages} />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Main Content (8 columns) */}
        <div className="col-span-12 lg:col-span-8">
          <div className="space-y-8">
            {/* Company Identity Form - Show in default or error state */}
            {!isSubmitted || hasError ? (
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="mb-6">
                  <SubsectionTitle>{t("business.form.title")}</SubsectionTitle>
                  <SmallText variant="muted" className="mt-1">
                    {t("business.form.subtitle")}
                  </SmallText>
                </div>

                <BusinessIdentityForm
                  formData={formData}
                  errors={formErrors}
                  touchedFields={touchedFields}
                  isSubmitting={isSubmitting}
                  onFieldChange={handleFieldChange}
                  onFieldBlur={handleFieldBlur}
                  onSubmit={handleSubmit}
                />
              </div>
            ) : null}

            {/* Verification Timeline - Show in submitted state */}
            {isSubmitted &&
              verificationSteps &&
              verificationSteps.length > 0 && (
                <div className="rounded-lg border border-slate-200 bg-white p-6">
                  <SubsectionTitle className="mb-6">
                    {t("business.verification.title")}
                  </SubsectionTitle>
                  <VerificationStatus
                    currentStatus={currentVerificationStatus}
                  />
                </div>
              )}

            {/* Submitted Documents - Show when documents exist */}
            {hasDocuments && documents && (
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <SubsectionTitle className="mb-6">
                  {t("business.documents.title")}
                </SubsectionTitle>
                <SubmittedDocuments documents={documents} />
              </div>
            )}

            {/* Bottom Sections - Privacy & Best Practices */}
            <div className="grid grid-cols-2 gap-6">
              {/* Privacy Control Card */}
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <SmallText weight="bold" className="text-slate-900">
                      {t("business.privacy.title")}
                    </SmallText>
                    <SmallText variant="muted" className="mt-2">
                      {t("business.privacy.description")}
                    </SmallText>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="mt-4 h-auto p-0 text-emerald-600 hover:text-emerald-700"
                >
                  <SmallText weight="bold" className="text-inherit">
                    {t("business.action.configure")} →
                  </SmallText>
                </Button>
              </div>

              {/* Best Practices Card */}
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <CompanyBestPractices />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (4 columns) */}
        <div className="col-span-12 lg:col-span-4">
          <div className="space-y-6">
            {/* Profile Strength Card */}
            <ProfileStrengthCard strengthData={profileStrength} />

            {/* Optimization Tips Card */}
            <OptimizationTips tips={[]} />

            {/* Premium Services Card */}
            <div className="rounded-lg border border-gray-200 bg-linear-to-b from-gray-900 to-gray-800 p-6 text-white">
              <SubsectionTitle className="text-white">
                {t("business.premium.title")}
              </SubsectionTitle>
              <SmallText variant="muted" className="mt-2 text-gray-300">
                {t("business.premium.description")}
              </SmallText>
              <Button className="mt-4 w-full bg-green-600 hover:bg-green-700">
                <SmallText weight="medium" className="text-white">
                  {t("business.button.upgrade")}
                </SmallText>
              </Button>
            </div>

            {/* Loading State for Verification Check */}
            {isLoading && (
              <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-green-600" />
                  <SmallText variant="muted">
                    {t("business.state.loading")}
                  </SmallText>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default BusinessProfilePage;
