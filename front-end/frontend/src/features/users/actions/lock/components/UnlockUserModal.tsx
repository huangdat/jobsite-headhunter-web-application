import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader,
  Unlock,
  Mail,
  KeyRound,
} from "lucide-react";
import { useUsersTranslation } from "@/shared/hooks";

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
        error instanceof Error ? error.message : "Unknown error";

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
              <Unlock className="w-8 h-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("unlock.title")}
              </h2>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
              <p className="text-green-900 dark:text-green-200 font-medium">
                {t("unlock.description")}
              </p>
              <p className="text-green-800 dark:text-green-300 text-sm mt-2">
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
                    className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500 cursor-pointer"
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
                    className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500 cursor-pointer"
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
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-xs text-blue-900 dark:text-blue-200">
                  <strong>{t("unlock.securityNotice")}:</strong>{" "}
                  {t("unlock.securityNoticeDescription")}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
                >
                  {t("unlock.cancel")}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium"
                >
                  {t("unlock.next")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Confirmation */}
        {step === "confirmation" && (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("unlock.confirmTitle")}
              </h2>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
              <p className="text-orange-900 dark:text-orange-200 font-medium">
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
              <button
                onClick={() => setStep("form")}
                disabled={loading}
                className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition font-medium"
              >
                {t("unlock.back")}
              </button>
              <button
                onClick={handleConfirmUnlock}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 transition font-medium flex items-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {loading ? t("unlock.processing") : t("unlock.confirmAction")}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === "success" && (
          <div className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("unlock.successTitle")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {t("unlock.successMessage")}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              {t("unlock.successDescription")}
            </p>

            <button
              onClick={handleClose}
              className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium"
            >
              {t("unlock.close")}
            </button>
          </div>
        )}

        {/* Step 4: Error */}
        {step === "error" && result?.type === "error" && (
          <div className="p-8 text-center">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
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
              <button
                onClick={() => setStep("form")}
                className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
              >
                {t("unlock.tryAgain")}
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-2 rounded-lg bg-gray-700 dark:bg-gray-600 text-white hover:bg-gray-800 dark:hover:bg-gray-700 transition font-medium"
              >
                {t("unlock.close")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnlockUserModal;
