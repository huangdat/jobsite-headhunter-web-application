/**
 * VerificationDetailPage
 * PROF-05: Business Verification Admin Module - Page 2
 * URL: /admin/verifications/:verificationId
 *
 * Displays full verification details with approval/rejection flow
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { PageContainer } from "@/shared/components/layout";
import { useVerificationDetail } from "../hooks";
import { VerificationStatus } from "../types";
import {
  ChevronLeft,
  MapPin,
  Mail,
  Phone,
  Globe,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export const VerificationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useAppTranslation();
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>("");
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
    if (rejectReason.length < 20) {
      toast.error(t("verification.modal.reject.reasonMinLength"));
      return;
    }
    if (rejectReason.length > 500) {
      toast.error(t("verification.modal.reject.reasonMaxLength"));
      return;
    }

    try {
      await reject({ reason: rejectReason });
      setShowRejectModal(false);
      setRejectReason("");
    } catch {
      // Error handled by hook
    }
  };

  if (isLoading) {
    return (
      <PageContainer variant="default" maxWidth="6xl">
        <Skeleton className="h-10 w-40 mb-8" />
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
          <div className="col-span-4">
            <Skeleton className="h-60 w-full rounded-xl" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!verification) {
    return (
      <PageContainer variant="default" maxWidth="6xl">
        <div className="text-center py-20">
          <AlertCircle className="mx-auto mb-4 opacity-40" size={40} />
          <p className="text-lg text-slate-600">
            {t("verification.errors.notFound")}
          </p>
          <Button
            variant="default"
            className="mt-4"
            onClick={() => navigate("/admin/verifications")}
          >
            {t("verification.pages.detail.back")}
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="default" maxWidth="6xl">
      {/* BREADCRUMB & BACK */}
      <button
        onClick={() => navigate("/admin/verifications")}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
      >
        <ChevronLeft size={16} />
        {t("verification.pages.detail.back")}
      </button>

      {/* SUCCESS BANNER (conditional) */}
      {verification.status === VerificationStatus.APPROVED && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-green-900">
                {t("verification.approval.success")}
              </h3>
              <p className="text-sm text-green-800 mt-1">
                {t("verification.approval.successMessage")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-12 gap-8">
        {/* LEFT: BUSINESS DETAILS (60%) */}
        <div className="col-span-8 space-y-6">
          {/* Company Identity */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {t("verification.cards.businessInfo.identity")}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600">
                  {t("verification.fields.companyName")}
                </label>
                <p className="font-semibold">
                  {verification.business.companyName}
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-600">
                  {t("verification.fields.taxId")}
                </label>
                <p className="font-mono bg-slate-100 px-3 py-1 rounded text-sm">
                  {verification.business.taxId}
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-600">
                  {t("verification.fields.industry")}
                </label>
                <p className="font-semibold">
                  {verification.business.industry}
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-600">
                  {t("verification.fields.yearEstablished")}
                </label>
                <p className="font-semibold">
                  {verification.business.yearEstablished}
                </p>
              </div>
            </div>
          </Card>

          {/* Operations & Contact */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {t("verification.cards.businessInfo.operations")}
            </h2>
            <div className="space-y-3">
              {verification.business.website && (
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-slate-600" />
                  <a
                    href={verification.business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {verification.business.website}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-slate-600" />
                <span>{verification.business.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-slate-600" />
                <span>{verification.business.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-slate-600" />
                <span>{verification.business.employeeCount} employees</span>
              </div>
              {verification.business.hq && (
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-slate-600 mt-1" />
                  <span>
                    {verification.business.hq.address},{" "}
                    {verification.business.hq.city}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {t("verification.timeline.title")}
            </h2>
            <div className="space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {verification.timeline.map((event: any, idx: number) => (
                <div key={event.id} className="relative pb-4">
                  {idx < verification.timeline.length - 1 && (
                    <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-slate-200" />
                  )}
                  <div className="flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-green-600 shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-sm">{event.eventType}</p>
                      <p className="text-xs text-slate-600 mt-1">
                        {new Date(event.timestamp).toLocaleString()}
                        {event.actor && ` - ${event.actor}`}
                      </p>
                      {event.description && (
                        <p className="text-sm text-slate-700 mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT: APPROVAL CARD (35%) */}
        <div className="col-span-4">
          <Card className="p-6 bg-slate-900 text-white sticky top-6">
            {/* Officer Info */}
            <div className="mb-6">
              <label className="text-xs text-slate-400 uppercase">
                {t("verification.cards.approvalDetails.officer")}
              </label>
              {verification.approvedBy ? (
                <>
                  <p className="font-semibold text-lg mt-1">
                    {verification.approvedBy.name}
                  </p>
                  <p className="text-sm text-slate-400">
                    {verification.approvedBy.actorRole}
                  </p>
                </>
              ) : (
                <p className="text-slate-400 text-sm mt-1">Pending review</p>
              )}
            </div>

            {/* Compliance Score */}
            <div className="mb-6 pb-6 border-b border-slate-700">
              <label className="text-xs text-slate-400 uppercase">
                {t("verification.cards.approvalDetails.score")}
              </label>
              <div className="mt-2">
                <div className="text-4xl font-bold">
                  {verification.complianceScore}
                </div>
                <div className="h-2 bg-slate-600 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      verification.complianceScore >= 80
                        ? "w-5/6 bg-green-500"
                        : verification.complianceScore >= 50
                          ? "w-3/5 bg-amber-500"
                          : "w-2/5 bg-red-500"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Automated Actions */}
            <div className="mb-6">
              <label className="text-xs text-slate-400 uppercase">
                {t("verification.cards.approvalDetails.automatedActions")}
              </label>
              <div className="space-y-2 mt-3">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {verification.automatedActions.map((action: any) => (
                  <div
                    key={action.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <CheckCircle
                      size={16}
                      className={
                        action.status === "COMPLETED"
                          ? "text-green-400"
                          : action.status === "FAILED"
                            ? "text-red-400"
                            : "text-slate-500"
                      }
                    />
                    <span>{action.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {verification.status === VerificationStatus.PENDING && (
              <div className="space-y-2 mt-6 pt-6 border-t border-slate-700">
                <Button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isApproving
                    ? "Approving..."
                    : t("verification.buttons.approve")}
                </Button>
                <Button
                  onClick={() => setShowRejectModal(true)}
                  disabled={isRejecting}
                  variant="outline"
                  className="w-full bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
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
      {showRejectModal && (
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
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full min-h-24 p-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-600 mt-1">
                {rejectReason.length}/500 -{" "}
                {t("verification.modal.reject.reasonHint")}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                variant="outline"
                className="flex-1"
              >
                {t("verification.buttons.cancel")}
              </Button>
              <Button
                onClick={handleRejectSubmit}
                disabled={isRejecting || rejectReason.length < 20}
                className="flex-1 bg-red-600 hover:bg-red-700"
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
