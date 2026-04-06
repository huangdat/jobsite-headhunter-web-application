/**
 * VerificationDetailPage
 * PROF-05: Business Verification Admin Module - Page 2
 * URL: /admin/verifications/:verificationId
 *
 * Displays full verification details with approval/rejection flow
 */

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { Breadcrumb } from "@/shared/components/navigation/Breadcrumb";
import { PageContainer } from "@/shared/components/layout";
import { PageSkeleton, ErrorState } from "@/shared/components/states";
import { useVerificationDetail, useRejectModal } from "../hooks";
import { VerificationStatus } from "../types";
import {
  VerificationTimeline,
  AutomatedActionsList,
  DetailsGrid,
  SectionCard,
  ApprovalSuccessBanner,
} from "../components";
import { ChevronLeft } from "lucide-react";

export const VerificationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useAppTranslation();
  const verificationId = id ? parseInt(id, 10) : 0;

  // Fetch verification detail
  const {
    verification,
    isLoading,
    isApproving,
    isRejecting,
    fetchDetail,
    approve,
    reject,
  } = useVerificationDetail();

  // Manage rejection modal state and validation
  const rejectModal = useRejectModal({ minLength: 20, maxLength: 500 });

  useEffect(() => {
    if (verificationId) {
      fetchDetail(verificationId);
    }
  }, [verificationId, fetchDetail]);

  /**
   * Handle approval action
   */
  const handleApprove = async () => {
    try {
      await approve();
    } catch {
      // Error handled by hook
    }
  };

  /**
   * Handle rejection submission
   */
  const handleRejectSubmit = async () => {
    if (!rejectModal.validate()) {
      return;
    }

    try {
      await reject({ reason: rejectModal.reason });
      rejectModal.resetModal();
    } catch {
      // Error handled by hook
    }
  };

  if (isLoading) {
    return (
      <PageContainer variant="default" maxWidth="6xl">
        <PageSkeleton variant="grid" count={1} />
      </PageContainer>
    );
  }

  if (!verification) {
    return (
      <PageContainer variant="default" maxWidth="6xl">
        <ErrorState
          error={new Error(t("verification.errors.notFound"))}
          onRetry={() => fetchDetail(verificationId)}
          title={t("verification.errors.notFound")}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="default" maxWidth="6xl">
      {/* BREADCRUMB NAVIGATION */}
      <Breadcrumb
        items={[
          {
            label: t("breadcrumb.verification") || "Verification",
            href: "/admin/verifications",
          },
          { label: verification?.business?.companyName || "" },
        ]}
        className="mb-6"
      />

      {/* BACK BUTTON */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/admin/verifications")}
        className="mb-4"
      >
        <ChevronLeft size={16} className="mr-2" />
        {t("verification.pages.detail.back")}
      </Button>

      {/* SUCCESS BANNER (conditional) */}
      <ApprovalSuccessBanner
        show={verification.status === VerificationStatus.APPROVED}
        onNext={() => navigate("/admin/verifications")}
      />

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-12 gap-8">
        {/* LEFT: BUSINESS DETAILS (60%) */}
        <div className="col-span-8 space-y-6">
          {/* Company Identity */}
          <SectionCard title={t("verification.cards.businessInfo.identity")}>
            <DetailsGrid
              items={[
                {
                  label: t("verification.fields.companyName"),
                  value: verification.business.companyName,
                },
                {
                  label: t("verification.fields.taxId"),
                  value: (
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded text-sm">
                      {verification.business.taxId}
                    </span>
                  ),
                },
                {
                  label: t("verification.fields.industry"),
                  value: verification.business.industry,
                },
                {
                  label: t("verification.fields.yearEstablished"),
                  value: String(verification.business.yearEstablished),
                },
              ]}
              columns={2}
            />
          </SectionCard>

          {/* Timeline */}
          <VerificationTimeline
            events={verification.timeline}
            isLoading={isLoading}
          />

          {/* Automated Actions */}
          <AutomatedActionsList
            actions={verification.automatedActions}
            isLoading={isLoading}
          />
        </div>

        {/* RIGHT: APPROVAL CARD (35%) */}
        <div className="col-span-4">
          <Card className="p-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white sticky top-6 border border-slate-200 dark:border-slate-700">
            {/* Officer Info */}
            <div className="mb-6">
              <label className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                {t("verification.cards.approvalDetails.officer")}
              </label>
              {verification.approvedBy ? (
                <>
                  <p className="font-semibold text-lg mt-1">
                    {verification.approvedBy.name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {verification.approvedBy.avatarRole}
                  </p>
                </>
              ) : (
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Pending review
                </p>
              )}
            </div>

            {/* Compliance Score */}
            <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
              <label className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                {t("verification.cards.approvalDetails.score")}
              </label>
              <div className="mt-2">
                <div className="text-4xl font-bold">
                  {verification.complianceScore}
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      verification.complianceScore >= 80
                        ? "w-5/6 bg-emerald-500 dark:bg-emerald-600"
                        : verification.complianceScore >= 50
                          ? "w-3/5 bg-amber-500 dark:bg-amber-600"
                          : "w-2/5 bg-red-500 dark:bg-red-600"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {verification.status === VerificationStatus.PENDING && (
              <div className="space-y-2 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <Button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isApproving
                    ? "Approving..."
                    : t("verification.buttons.approve")}
                </Button>
                <Button
                  onClick={rejectModal.open}
                  disabled={isRejecting}
                  variant="outline"
                  className="w-full border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {isRejecting
                    ? "Rejecting..."
                    : t("verification.buttons.reject")}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* REJECT MODAL */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("verification.modal.reject.title")}
            </h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="text-red-600 shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-red-900 text-sm">
                    {t("verification.modal.reject.warning")}
                  </p>
                  <p className="text-sm text-red-800 mt-1">
                    {t("verification.modal.reject.warningText")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                {t("verification.modal.reject.reason")}
              </label>
              <textarea
                placeholder={t("verification.modal.reject.reasonPlaceholder")}
                value={rejectModal.reason}
                onChange={(e) => rejectModal.setReason(e.target.value)}
                className="w-full min-h-24 p-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-primary"
              />
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {rejectModal.reason.length}/500 -{" "}
                {t("verification.modal.reject.reasonHint")}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={rejectModal.close}
                variant="outline"
                className="flex-1"
              >
                {t("verification.buttons.cancel")}
              </Button>
              <Button
                onClick={handleRejectSubmit}
                disabled={isRejecting || rejectModal.reason.length < 20}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {t("verification.modal.reject.submit")}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </PageContainer>
  );
};
