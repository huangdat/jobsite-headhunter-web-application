import React, { useState } from "react";
import {
  AlertTriangle,
  Lock,
  Trash2,
  CheckCircle,
  XCircle,
  Loader,
} from "lucide-react";

import { useUsersTranslation } from "@/shared/hooks";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";

interface RelatedDataCount {
  applications?: number;
  jobs?: number;
  total: number;
}

export interface DeleteUserModalProps {
  isOpen: boolean;
  userName: string;
  userId: string;
  relatedDataCount: RelatedDataCount;
  onClose: () => void;
  onConfirm: (deleteType: "soft" | "hard", reason?: string) => Promise<void>;
}

type ModalStep =
  | "choice"
  | "reason"
  | "confirmation"
  | "success"
  | "error"
  | "conflict";

interface DeleteSuccess {
  type: "success";
}

interface DeleteError {
  type: "error";
  message: string;
}

interface DeleteConflict {
  type: "conflict";
  conflictCode: string;
}

type DeleteResult = DeleteSuccess | DeleteError | DeleteConflict;

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  userName,
  userId,
  relatedDataCount,
  onClose,
  onConfirm,
}) => {
  const { t } = useUsersTranslation();
  const { t: tCommon } = useAppTranslation();
  const [step, setStep] = useState<ModalStep>("choice");
  const [selectedType, setSelectedType] = useState<"soft" | "hard" | null>(
    null
  );
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DeleteResult | null>(null);

  const handleSelectType = (type: "soft" | "hard") => {
    setSelectedType(type);
    // For soft delete, go to reason input first
    if (type === "soft") {
      setStep("reason");
    } else {
      setStep("confirmation");
    }
  };

  const handleReasonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim() === "") {
      return;
    }
    setStep("confirmation");
  };

  const handleConfirmDelete = async () => {
    if (!selectedType) return;

    setLoading(true);
    try {
      await onConfirm(
        selectedType,
        selectedType === "soft" ? reason : undefined
      );
      setResult({ type: "success" });
      setStep("success");

      // Log audit (AC4)
      console.log("Audit Log: Delete action", {
        adminId: localStorage.getItem("userId"),
        timestamp: new Date().toISOString(),
        targetUserId: userId,
        deleteType: selectedType,
        userName,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : tCommon("common.unknownError");

      // Check if it's a conflict error (AC2 - 409)
      if (
        errorMessage.includes("409") ||
        errorMessage.includes("USER_HAS_RELATED_DATA")
      ) {
        setResult({
          type: "conflict",
          conflictCode: "USER_HAS_RELATED_DATA",
        });
        setStep("conflict");
      } else {
        setResult({
          type: "error",
          message: errorMessage,
        });
        setStep("error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("choice");
    setSelectedType(null);
    setReason("");
    setResult(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  const hasRelatedData = relatedDataCount.total > 0;
  const applications = relatedDataCount.applications || 0;
  const jobs = relatedDataCount.jobs || 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Step 1: Choice */}
        {step === "choice" && (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t("delete.title")}
              </h2>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-900 font-medium">
                {t("delete.selectMethod")}
              </p>
              <p className="text-red-800 text-sm mt-2">
                {t("fields.userInfo")}:{" "}
                <span className="font-semibold">{userName}</span>
              </p>
            </div>

            {/* Related Data Warning */}
            {hasRelatedData && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <p className="font-semibold text-orange-900 mb-3">
                  {t("delete.relatedDataWarning")}
                </p>
                <ul className="space-y-2 text-orange-800 text-sm">
                  {applications > 0 && (
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-600 rounded-full" />
                      {t("delete.applicationsCount")}:{" "}
                      <span className="font-semibold">{applications}</span>
                    </li>
                  )}
                  {jobs > 0 && (
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-600 rounded-full" />
                      {t("delete.jobsCount")}:{" "}
                      <span className="font-semibold">{jobs}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Option 1: Soft Delete */}
            <div
              className={`border-2 rounded-lg p-4 mb-4 cursor-pointer transition ${
                selectedType === "soft"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleSelectType("soft")}
            >
              <div className="flex items-start gap-4">
                <input
                  type="radio"
                  name="deleteType"
                  value="soft"
                  checked={selectedType === "soft"}
                  onChange={() => {}}
                  className="mt-1"
                  aria-label={t("delete.softDeleteOptionAriaLabel")}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">
                      {t("delete.softDeleteTitle")}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {t("delete.softDeleteDesc")}
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {t("delete.softDeleteBenefit1")}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {t("delete.softDeleteBenefit2")}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {t("delete.softDeleteBenefit3")}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Option 2: Hard Delete */}
            <div
              className={`border-2 rounded-lg p-4 mb-6 cursor-pointer transition ${
                selectedType === "hard"
                  ? "border-red-500 bg-red-50"
                  : hasRelatedData
                    ? "border-gray-200 opacity-50 cursor-not-allowed"
                    : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => {
                if (!hasRelatedData) {
                  handleSelectType("hard");
                }
              }}
            >
              <div className="flex items-start gap-4">
                <input
                  type="radio"
                  name="deleteType"
                  value="hard"
                  checked={selectedType === "hard"}
                  onChange={() => {}}
                  disabled={hasRelatedData}
                  className="mt-1"
                  aria-label={t("delete.hardDeleteOptionAriaLabel")}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Trash2 className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold text-gray-900">
                      {t("delete.hardDeleteTitle")}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {t("delete.hardDeleteDesc")}
                  </p>

                  {hasRelatedData && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                      <p className="font-medium">
                        {t("delete.hardDeleteDisabled")}
                      </p>
                      <p className="mt-1">
                        {t("delete.usesSoftDeleteInstead")}
                      </p>
                    </div>
                  )}

                  {!hasRelatedData && (
                    <ul className="mt-3 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        {t("delete.hardDeleteWarning1")}
                      </li>
                      <li className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        {t("delete.hardDeleteWarning2")}
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleClose}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
              >
                {t("buttons.cancel")}
              </button>
              <button
                onClick={() => setStep("confirmation")}
                disabled={!selectedType}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
              >
                {t("buttons.next")}
              </button>
            </div>
          </div>
        )}

        {/* Step 1.5: Soft Delete Reason Input */}
        {step === "reason" && selectedType === "soft" && (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t("delete.softDeleteReasonTitle")}
              </h2>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-900 font-medium">
                {t("delete.softDeleteReasonDesc")}
              </p>
              <p className="text-blue-800 text-sm mt-2">
                {t("fields.userInfo")}:{" "}
                <span className="font-semibold">{userName}</span>
              </p>
            </div>

            <form onSubmit={handleReasonSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t("delete.reasonLabel")}{" "}
                  <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t("delete.reasonPlaceholder")}
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  aria-label={t("delete.reasonLabel")}
                />
                <p className="text-xs text-gray-600 mt-1">
                  {t("delete.reasonHint")}
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setReason("");
                    setSelectedType(null);
                    setStep("choice");
                  }}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  {t("delete.back")}
                </button>
                <button
                  type="submit"
                  disabled={reason.trim() === ""}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                >
                  {t("buttons.next")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Confirmation */}
        {step === "confirmation" && selectedType && (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t("delete.confirmTitle")}
              </h2>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-orange-900 font-medium">
                {selectedType === "soft"
                  ? t("delete.confirmSoftDelete")
                  : t("delete.confirmHardDelete")}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    {t("delete.affectedUser")}
                  </p>
                  <p className="font-semibold text-gray-900">{userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t("delete.userId")}</p>
                  <p className="font-semibold text-gray-900">{userId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {t("delete.deleteMethod")}
                  </p>
                  <p className="font-semibold text-gray-900">
                    {selectedType === "soft"
                      ? t("delete.softDelete")
                      : t("delete.hardDelete")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {t("delete.timestamp")}
                  </p>
                  <p className="font-semibold text-gray-900">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setStep("choice")}
                disabled={loading}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition font-medium"
              >
                {t("delete.back")}
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className={`px-6 py-2 rounded-lg text-white transition font-medium flex items-center gap-2 ${
                  selectedType === "soft"
                    ? "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
                    : "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                }`}
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {loading ? t("delete.processing") : t("delete.confirmAction")}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === "success" && (
          <div className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedType === "soft"
                ? t("delete.successSoftDelete")
                : t("delete.successHardDelete")}
            </h2>
            <p className="text-gray-600 mb-6">
              {selectedType === "soft"
                ? t("delete.successSoftMessage")
                : t("delete.successHardMessage")}
            </p>

            <button
              onClick={handleClose}
              className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium"
            >
              {t("delete.close")}
            </button>
          </div>
        )}

        {/* Step 4: Error */}
        {step === "error" && result?.type === "error" && (
          <div className="p-8 text-center">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("delete.errorTitle")}
            </h2>
            <p className="text-gray-600 mb-4">{result.message}</p>
            <p className="text-sm text-gray-500 mb-6">
              {t("delete.contactSupport")}
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setStep("choice")}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
              >
                {t("delete.tryAgain")}
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800 transition font-medium"
              >
                {t("delete.close")}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Conflict (AC2 - Hard Delete with related data) */}
        {step === "conflict" && (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t("delete.conflictTitle")}
              </h2>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-orange-900 font-medium">
                {t("delete.conflictMessage")}
              </p>
            </div>

            <div className="mb-6">
              <p className="font-semibold text-gray-900 mb-3">
                {t("delete.relatedDataFound")}
              </p>
              <ul className="space-y-2 text-gray-600">
                {applications > 0 && (
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full" />
                    {t("delete.applicationsCount")}:{" "}
                    <span className="font-semibold">{applications}</span>
                  </li>
                )}
                {jobs > 0 && (
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full" />
                    {t("delete.jobsCount")}:{" "}
                    <span className="font-semibold">{jobs}</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-900 text-sm">
                {t("delete.conflictResolution")}
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleClose}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
              >
                {t("delete.close")}
              </button>
              <button
                onClick={() => {
                  setSelectedType("soft");
                  setStep("confirmation");
                }}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
              >
                {t("delete.useSoftDelete")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteUserModal;

