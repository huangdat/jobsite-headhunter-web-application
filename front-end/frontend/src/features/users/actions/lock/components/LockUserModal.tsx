import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader,
  Lock,
  Calendar,
  Mail,
  LogOut,
} from "lucide-react";

import { useUsersTranslation } from "@/shared/hooks";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";

interface LockReasonOption {
  value: string;
  label: string;
}

export interface LockUserModalProps {
  isOpen: boolean;
  userName: string;
  userId: string;
  lockReasons: LockReasonOption[];
  onClose: () => void;
  onConfirm: (lockData: {
    reason: string;
    autoUnlockDate?: string;
    sendEmail: boolean;
    logoutCurrentSession: boolean;
  }) => Promise<void>;
}

type ModalStep =
  | "form"
  | "other-reason"
  | "confirmation"
  | "success"
  | "error"
  | "permission-error";

interface LockSuccess {
  type: "success";
}

interface LockError {
  type: "error";
  message: string;
}

interface LockPermissionError {
  type: "permission-error";
  errorCode: string;
}

type LockResult = LockSuccess | LockError | LockPermissionError;

const LockUserModal: React.FC<LockUserModalProps> = ({
  isOpen,
  userName,
  userId,
  lockReasons,
  onClose,
  onConfirm,
}) => {
  const { t } = useUsersTranslation();
  const { t: tCommon } = useAppTranslation();
  const [step, setStep] = useState<ModalStep>("form");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LockResult | null>(null);

  // Form state
  const [reason, setReason] = useState("");
  const [otherReasonText, setOtherReasonText] = useState("");
  const [autoUnlockDate, setAutoUnlockDate] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [logoutCurrentSession, setLogoutCurrentSession] = useState(true);

  const canProceed = reason.trim() !== "";

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceed) return;

    // If reason is "other", navigate to other-reason input screen
    if (reason === "other") {
      setStep("other-reason");
    } else {
      setStep("confirmation");
    }
  };

  const handleOtherReasonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otherReasonText.trim() === "") return;

    // Update reason with the custom text
    setReason(otherReasonText);
    setStep("confirmation");
  };

  const handleConfirmLock = async () => {
    setLoading(true);
    try {
      await onConfirm({
        reason,
        autoUnlockDate: autoUnlockDate || undefined,
        sendEmail,
        logoutCurrentSession,
      });

      setResult({ type: "success" });
      setStep("success");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : tCommon("common.unknownError");

      // Check for permission errors (AC3)
      if (
        errorMessage.includes("CANNOT_LOCK_YOURSELF") ||
        errorMessage.includes("409")
      ) {
        setResult({
          type: "permission-error",
          errorCode: "CANNOT_LOCK_YOURSELF",
        });
        setStep("permission-error");
      } else if (errorMessage.includes("INSUFFICIENT_PERMISSION")) {
        setResult({
          type: "permission-error",
          errorCode: "INSUFFICIENT_PERMISSION",
        });
        setStep("permission-error");
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
    setStep("form");
    setReason("");
    setOtherReasonText("");
    setAutoUnlockDate("");
    setSendEmail(true);
    setLogoutCurrentSession(true);
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
        {/* Step 1: Lock Form */}
        {step === "form" && (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("lock.title")}
              </h2>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
              <p className="text-amber-900 dark:text-amber-200 font-medium">
                {t("lock.selectReason")} *
              </p>
              <p className="text-amber-800 dark:text-amber-300 text-sm mt-2">
                {t("lock.userInfo")}:{" "}
                <span className="font-semibold">{userName}</span>
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Lock Reason - Required */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {t("lock.reasonLabel")}{" "}
                  <span className="text-red-600">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  aria-label={t("lock.reasonLabel")}
                >
                  <option value="">{t("lock.selectReasonPlaceholder")}</option>
                  {lockReasons.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Auto Unlock Date - Optional */}
              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t("lock.autoUnlockDateLabel")}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({t("lock.optional")})
                  </span>
                </label>
                <input
                  type="datetime-local"
                  value={autoUnlockDate}
                  onChange={(e) => setAutoUnlockDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  placeholder={t("lock.autoUnlockDatePlaceholder")}
                  aria-label={t("lock.autoUnlockDateLabel")}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t("lock.autoUnlockDateHint")}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  {t("lock.notificationSettings")}
                </p>

                {/* Send Email Checkbox */}
                <div className="flex items-start gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="sendEmail"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    aria-label={t("lock.sendEmailLabel")}
                  />
                  <label htmlFor="sendEmail" className="flex-1 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {t("lock.sendEmailLabel")}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {t("lock.sendEmailDescription")}
                    </p>
                  </label>
                </div>

                {/* Logout Current Session Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="logoutCurrentSession"
                    checked={logoutCurrentSession}
                    onChange={(e) => setLogoutCurrentSession(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    aria-label={t("lock.logoutSessionLabel")}
                  />
                  <label
                    htmlFor="logoutCurrentSession"
                    className="flex-1 cursor-pointer"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      {t("lock.logoutSessionLabel")}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {t("lock.logoutSessionDescription")}
                    </p>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
                >
                  {t("lock.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={!canProceed}
                  className="px-6 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                >
                  {t("lock.next")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 1.5: Other Reason Input */}
        {step === "other-reason" && (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("lock.otherReasonTitle")}
              </h2>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-blue-900 dark:text-blue-200 font-medium">
                {t("lock.otherReasonDesc")}
              </p>
              <p className="text-blue-800 dark:text-blue-300 text-sm mt-2">
                {t("lock.userInfo")}:{" "}
                <span className="font-semibold">{userName}</span>
              </p>
            </div>

            <form onSubmit={handleOtherReasonSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {t("lock.reasonLabel")}{" "}
                  <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={otherReasonText}
                  onChange={(e) => setOtherReasonText(e.target.value)}
                  placeholder={t("lock.otherReasonPlaceholder")}
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  aria-label={t("lock.reasonLabel")}
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {t("lock.otherReasonHint")}
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setOtherReasonText("");
                    setReason("");
                    setStep("form");
                  }}
                  className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
                >
                  {t("lock.back")}
                </button>
                <button
                  type="submit"
                  disabled={otherReasonText.trim() === ""}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                >
                  {t("lock.next")}
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
                {t("lock.confirmTitle")}
              </h2>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
              <p className="text-orange-900 dark:text-orange-200 font-medium">
                {t("lock.confirmMessage")}
              </p>
            </div>

            {/* Review Details */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("lock.affectedUser")}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {userName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("lock.userId")}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {userId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("lock.reason")}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {lockReasons.find((r) => r.value === reason)?.label ||
                      reason}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("lock.timestamp")}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>

              {autoUnlockDate && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("lock.autoUnlockDate")}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(autoUnlockDate).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    readOnly
                    aria-label={t("lock.sendEmail")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t("lock.sendEmail")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={logoutCurrentSession}
                    readOnly
                    aria-label={t("lock.logoutSession")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t("lock.logoutSession")}
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
                {t("lock.back")}
              </button>
              <button
                onClick={handleConfirmLock}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:bg-amber-400 transition font-medium flex items-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {loading ? t("lock.processing") : t("lock.confirmAction")}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === "success" && (
          <div className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("lock.successTitle")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {t("lock.successMessage")}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              {t("lock.successDescription")}
            </p>

            <button
              onClick={handleClose}
              className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium"
            >
              {t("lock.close")}
            </button>
          </div>
        )}

        {/* Step 4: Error */}
        {step === "error" && result?.type === "error" && (
          <div className="p-8 text-center">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("lock.errorTitle")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {result.message}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              {t("lock.errorDescription")}
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setStep("form")}
                className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
              >
                {t("lock.tryAgain")}
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-2 rounded-lg bg-gray-700 dark:bg-gray-600 text-white hover:bg-gray-800 dark:hover:bg-gray-700 transition font-medium"
              >
                {t("lock.close")}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Permission Error */}
        {step === "permission-error" && result?.type === "permission-error" && (
          <div className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {result.errorCode === "CANNOT_LOCK_YOURSELF"
                ? t("lock.errorCannotLockYourself")
                : t("lock.errorInsufficientPermission")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {result.errorCode === "CANNOT_LOCK_YOURSELF"
                ? t("lock.errorCannotLockYourselfDescription")
                : t("lock.errorInsufficientPermissionDescription")}
            </p>

            <button
              onClick={handleClose}
              className="px-6 py-2 rounded-lg bg-gray-700 dark:bg-gray-600 text-white hover:bg-gray-800 dark:hover:bg-gray-700 transition font-medium"
            >
              {t("lock.close")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LockUserModal;
