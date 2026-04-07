import React, { useState } from "react";
import {
  AlertTriangle,
  Lock,
  Trash2,
  CheckCircle,
  XCircle,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUsersTranslation } from "@/shared/hooks";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { useAuthUser } from "@/shared/hooks/useAuthUser";
import { getSemanticClass } from "@/lib/design-tokens";

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
  const { userId: currentUserId } = useAuthUser();
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
        adminId: currentUserId,
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
              <AlertTriangle
                className={`w-8 h-8 ${getSemanticClass("danger", "icon", true)}`}
              />
              <h2 className="text-2xl font-bold text-gray-900">
                {t("delete.title")}
              </h2>
            </div>

            <div
              className={`rounded-lg p-4 mb-6 ${getSemanticClass("danger", "bg", true)} ${getSemanticClass("danger", "border", true)}`}
            >
              <p
                className={`font-medium ${getSemanticClass("danger", "text", true)}`}
              >
                {t("delete.selectMethod")}
              </p>
              <p
                className={`text-sm mt-2 ${getSemanticClass("danger", "text", true)}`}
              >
                {t("fields.userInfo")}:{" "}
                <span className="font-semibold">{userName}</span>
              </p>
            </div>

            {/* Related Data Warning */}
            {hasRelatedData && (
              <div
                className={`rounded-lg p-4 mb-6 ${getSemanticClass("warning", "bg", true)} ${getSemanticClass("warning", "border", true)}`}
              >
                <p
                  className={`font-semibold mb-3 ${getSemanticClass("warning", "text", true)}`}
                >
                  {t("delete.relatedDataWarning")}
                </p>
                <ul
                  className={`space-y-2 text-sm ${getSemanticClass("warning", "text", true)}`}
                >
                  {applications > 0 && (
                    <li className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${getSemanticClass("warning", "bg", true)}`}
                      />
                      {t("delete.applicationsCount")}:{" "}
                      <span className="font-semibold">{applications}</span>
                    </li>
                  )}
                  {jobs > 0 && (
                    <li className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${getSemanticClass("warning", "bg", true)}`}
                      />
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
                    <Lock
                      className={`w-5 h-5 ${getSemanticClass("info", "icon", true)}`}
                    />
                    <h3 className="font-semibold text-gray-900">
                      {t("delete.softDeleteTitle")}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {t("delete.softDeleteDesc")}
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle
                        className={`w-4 h-4 ${getSemanticClass("success", "icon", true)}`}
                      />
                      {t("delete.softDeleteBenefit1")}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle
                        className={`w-4 h-4 ${getSemanticClass("success", "icon", true)}`}
                      />
                      {t("delete.softDeleteBenefit2")}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle
                        className={`w-4 h-4 ${getSemanticClass("success", "icon", true)}`}
                      />
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
                  ? `${getSemanticClass("danger", "border", true).split(" ")[0]} ${getSemanticClass("danger", "bg", true)}`
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
                    <Trash2
                      className={`w-5 h-5 ${getSemanticClass("danger", "icon", true)}`}
                    />
                    <h3 className="font-semibold text-gray-900">
                      {t("delete.hardDeleteTitle")}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {t("delete.hardDeleteDesc")}
                  </p>

                  {hasRelatedData && (
                    <div
                      className={`mt-3 p-3 rounded text-sm ${getSemanticClass("warning", "bg", true)} ${getSemanticClass("warning", "border", true)} ${getSemanticClass("warning", "text", true)}`}
                    >
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
                      <li
                        className={`flex items-center gap-2 ${getSemanticClass("danger", "text", true)}`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                        {t("delete.hardDeleteWarning1")}
                      </li>
                      <li
                        className={`flex items-center gap-2 ${getSemanticClass("danger", "text", true)}`}
                      >
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
              <Button variant="outline" onClick={handleClose}>
                {t("buttons.cancel")}
              </Button>
              <Button
                onClick={() => setStep("confirmation")}
                disabled={!selectedType}
              >
                {t("buttons.next")}
              </Button>
            </div>
          </div>
        )}

        {/* Step 1.5: Soft Delete Reason Input */}
        {step === "reason" && selectedType === "soft" && (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock
                className={`w-8 h-8 ${getSemanticClass("info", "icon", true)}`}
              />
              <h2 className="text-2xl font-bold text-gray-900">
                {t("delete.softDeleteReasonTitle")}
              </h2>
            </div>

            <div
              className={`rounded-lg p-4 mb-6 ${getSemanticClass("info", "bg", true)} ${getSemanticClass("info", "border", true)}`}
            >
              <p
                className={`font-medium ${getSemanticClass("info", "text", true)}`}
              >
                {t("delete.softDeleteReasonDesc")}
              </p>
              <p
                className={`text-sm mt-2 ${getSemanticClass("info", "text", true)}`}
              >
                {t("fields.userInfo")}:{" "}
                <span className="font-semibold">{userName}</span>
              </p>
            </div>

            <form onSubmit={handleReasonSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t("delete.reasonLabel")}{" "}
                  <span className={getSemanticClass("danger", "text", true)}>
                    *
                  </span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t("delete.reasonPlaceholder")}
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
                  aria-label={t("delete.reasonLabel")}
                />
                <p className="text-xs text-gray-600 mt-1">
                  {t("delete.reasonHint")}
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setReason("");
                    setSelectedType(null);
                    setStep("choice");
                  }}
                >
                  {t("delete.back")}
                </Button>
                <Button
                  onClick={handleReasonSubmit}
                  disabled={reason.trim() === ""}
                >
                  {t("buttons.next")}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Confirmation */}
        {step === "confirmation" && selectedType && (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle
                className={`w-8 h-8 ${getSemanticClass("warning", "icon", true)}`}
              />
              <h2 className="text-2xl font-bold text-gray-900">
                {t("delete.confirmTitle")}
              </h2>
            </div>

            <div
              className={`rounded-lg p-4 mb-6 ${getSemanticClass("warning", "bg", true)} ${getSemanticClass("warning", "border", true)}`}
            >
              <p
                className={`font-medium ${getSemanticClass("warning", "text", true)}`}
              >
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
              <Button
                variant="outline"
                onClick={() => setStep("choice")}
                disabled={loading}
              >
                {t("delete.back")}
              </Button>
              <Button
                variant={selectedType === "soft" ? "default" : "destructive"}
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading && <Loader className="w-4 h-4 animate-spin mr-2" />}
                {loading ? t("delete.processing") : t("delete.confirmAction")}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === "success" && (
          <div className="p-8 text-center">
            <CheckCircle
              className={`w-16 h-16 mx-auto mb-4 ${getSemanticClass("success", "icon", true)}`}
            />
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

            <Button onClick={handleClose}>{t("delete.close")}</Button>
          </div>
        )}

        {/* Step 4: Error */}
        {step === "error" && result?.type === "error" && (
          <div className="p-8 text-center">
            <XCircle
              className={`w-16 h-16 mx-auto mb-4 ${getSemanticClass("danger", "icon", true)}`}
            />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("delete.errorTitle")}
            </h2>
            <p className="text-gray-600 mb-4">{result.message}</p>
            <p className="text-sm text-gray-500 mb-6">
              {t("delete.contactSupport")}
            </p>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setStep("choice")}>
                {t("delete.tryAgain")}
              </Button>
              <Button variant="outline" onClick={handleClose}>
                {t("delete.close")}
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Conflict (AC2 - Hard Delete with related data) */}
        {step === "conflict" && (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle
                className={`w-8 h-8 ${getSemanticClass("warning", "icon", true)}`}
              />
              <h2 className="text-2xl font-bold text-gray-900">
                {t("delete.conflictTitle")}
              </h2>
            </div>

            <div
              className={`rounded-lg p-4 mb-6 ${getSemanticClass("warning", "bg", true)} ${getSemanticClass("warning", "border", true)}`}
            >
              <p
                className={`font-medium ${getSemanticClass("warning", "text", true)}`}
              >
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
                    <span
                      className={`w-2 h-2 rounded-full ${getSemanticClass("danger", "bg", true)}`}
                    />
                    {t("delete.applicationsCount")}:{" "}
                    <span className="font-semibold">{applications}</span>
                  </li>
                )}
                {jobs > 0 && (
                  <li className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${getSemanticClass("danger", "bg", true)}`}
                    />
                    {t("delete.jobsCount")}:{" "}
                    <span className="font-semibold">{jobs}</span>
                  </li>
                )}
              </ul>
            </div>

            <div
              className={`rounded-lg p-4 mb-6 ${getSemanticClass("info", "bg", true)} ${getSemanticClass("info", "border", true)}`}
            >
              <p
                className={`text-sm ${getSemanticClass("info", "text", true)}`}
              >
                {t("delete.conflictResolution")}
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleClose}>
                {t("delete.close")}
              </Button>
              <Button
                onClick={() => {
                  setSelectedType("soft");
                  setStep("confirmation");
                }}
              >
                {t("delete.useSoftDelete")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteUserModal;
