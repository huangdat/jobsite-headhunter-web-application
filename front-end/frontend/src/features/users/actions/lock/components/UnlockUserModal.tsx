import React, { useState } from "react";
import { getSemanticClass } from "@/lib/design-tokens";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader,
  Unlock,
  Mail,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUsersTranslation } from "@/shared/hooks";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";

export interface UnlockUserModalProps {
  isOpen: boolean;
  userName: string;
  userId: string;
  onClose: () => void;
  onConfirm: (unlockData: {
    reason: string;
    sendEmail: boolean;
    requirePasswordChange: boolean;
  }) => Promise<void>;
}

type ModalStep = "form" | "confirmation" | "success" | "error";

interface UnlockSuccess {
  type: "success";
}

interface UnlockError {
  type: "error";
  message: string;
}

type UnlockResult = UnlockSuccess | UnlockError;

const UnlockUserModal: React.FC<UnlockUserModalProps> = ({
  isOpen,
  userName,
  userId,
  onClose,
  onConfirm,
}) => {
  const { t } = useUsersTranslation();
  const { t: tCommon } = useAppTranslation();
  const [step, setStep] = useState<ModalStep>("form");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UnlockResult | null>(null);

  // Form state
  const [reason, setReason] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [requirePasswordChange, setRequirePasswordChange] = useState(true);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirmation");
  };

  const handleConfirmUnlock = async () => {
    setLoading(true);
    try {
      await onConfirm({
        reason,
        sendEmail,
        requirePasswordChange,
      });

      setResult({ type: "success" });
      setStep("success");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : tCommon("common.unknownError");

      setResult({
        type: "error",
        message: errorMessage,
      });
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("form");
    setReason("");
    setSendEmail(true);
    setRequirePasswordChange(true);
    setResult(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Step 1: Unlock Form */}
        {step === "form" && (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Unlock
                className={`w-8 h-8 ${getSemanticClass("success", "icon", true)}`}
              />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("unlock.title")}
              </h2>
            </div>

            <div
              className={`rounded-lg p-4 mb-6 ${getSemanticClass("success", "bg", true)} ${getSemanticClass("success", "border", true)}`}
            >
              <p
                className={`font-medium ${getSemanticClass("success", "text", true)}`}
              >
                {t("unlock.description")}
              </p>
              <p
                className={`text-sm mt-2 ${getSemanticClass("success", "text", true)}`}
              >
                {t("unlock.userInfo")}:{" "}
                <span className="font-semibold">{userName}</span>
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Note: Unlock does not require filling in reason */}

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  {t("unlock.notificationSettings")}
                </p>

                {/* Send Email Checkbox */}
                <div className="flex items-start gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="sendEmail"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className={`mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 ${getSemanticClass("success", "text", true)} ${getSemanticClass("success", "ring", true)} cursor-pointer`}
                  />
                  <label htmlFor="sendEmail" className="flex-1 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {t("unlock.sendEmailLabel")}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {t("unlock.sendEmailDescription")}
                    </p>
                  </label>
                </div>

                {/* Require Password Change Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="requirePasswordChange"
                    checked={requirePasswordChange}
                    onChange={(e) => setRequirePasswordChange(e.target.checked)}
                    className={`mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 ${getSemanticClass("success", "text", true)} ${getSemanticClass("success", "ring", true)} cursor-pointer`}
                  />
                  <label
                    htmlFor="requirePasswordChange"
                    className="flex-1 cursor-pointer"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <KeyRound className="w-4 h-4" />
                      {t("unlock.requirePasswordChangeLabel")}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {t("unlock.requirePasswordChangeDescription")}
                    </p>
                  </label>
                </div>
              </div>

              {/* Security Notice */}
              <div
                className={`rounded-lg p-4 ${getSemanticClass("info", "bg", true)} ${getSemanticClass("info", "border", true)}`}
              >
                <p
                  className={`text-xs ${getSemanticClass("info", "text", true)}`}
                >
                  <strong>{t("unlock.securityNotice")}:</strong>{" "}
                  {t("unlock.securityNoticeDescription")}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" onClick={handleClose}>
                  {t("unlock.cancel")}
                </Button>
                <Button>{t("unlock.next")}</Button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Confirmation */}
        {step === "confirmation" && (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle
                className={`w-8 h-8 ${getSemanticClass("warning", "icon", true)}`}
              />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("unlock.confirmTitle")}
              </h2>
            </div>

            <div
              className={`rounded-lg p-4 mb-6 ${getSemanticClass("warning", "bg", true)} ${getSemanticClass("warning", "border", true)}`}
            >
              <p
                className={`font-medium ${getSemanticClass("warning", "text", true)}`}
              >
                {t("unlock.confirmMessage")}
              </p>
            </div>

            {/* Review Details */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("unlock.affectedUser")}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {userName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("unlock.userId")}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {userId}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("unlock.reason")}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {reason}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("unlock.timestamp")}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    readOnly
                    aria-label={t("unlock.sendEmail")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t("unlock.sendEmail")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={requirePasswordChange}
                    readOnly
                    aria-label={t("unlock.requirePasswordChange")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t("unlock.requirePasswordChange")}
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setStep("form")}
                disabled={loading}
              >
                {t("buttons.back")}
              </Button>
              <Button onClick={handleConfirmUnlock} disabled={loading}>
                {loading && <Loader className="w-4 h-4 animate-spin mr-2" />}
                {loading ? t("unlock.processing") : t("unlock.confirmAction")}
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("unlock.successTitle")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {t("unlock.successMessage")}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              {t("unlock.successDescription")}
            </p>

            <Button onClick={handleClose}>{t("unlock.close")}</Button>
          </div>
        )}

        {/* Step 4: Error */}
        {step === "error" && result?.type === "error" && (
          <div className="p-8 text-center">
            <XCircle
              className={`w-16 h-16 mx-auto mb-4 ${getSemanticClass("danger", "icon", true)}`}
            />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("unlock.errorTitle")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {result.message}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              {t("unlock.errorDescription")}
            </p>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setStep("form")}>
                {t("unlock.tryAgain")}
              </Button>
              <Button variant="outline" onClick={handleClose}>
                {t("unlock.close")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnlockUserModal;
