/**
 * CommissionForm Component
 * PROF-04: Collaborator Commission
 * Handles personal and banking information input
 */

import { useState } from "react";
import { useCommissionManagement } from "../hooks/useCommissionManagement";
import { useTranslation } from "react-i18next";

/**
 * CommissionForm Component
 * Displays commission profile form with two sections:
 * - Personal Information
 * - Banking Information
 */
export function CommissionForm() {
  const { t } = useTranslation("commission");
  const {
    formData,
    saving,
    error,
    success,
    clearError,
    updateField,
    saveProfile,
  } = useCommissionManagement();

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData?.fullName?.trim()) {
      errors.fullName = t("form.validation.fullNameRequired");
    }

    if (!formData?.phoneNumber?.trim()) {
      errors.phoneNumber = t("form.validation.phoneNumberRequired");
    } else if (!/^[0-9\-+()\s]+$/.test(formData.phoneNumber)) {
      errors.phoneNumber = t("form.validation.phoneNumberInvalid");
    }

    if (!formData?.bankName?.trim()) {
      errors.bankName = t("form.validation.bankNameRequired");
    }

    if (!formData?.accountNumber?.trim()) {
      errors.accountNumber = t("form.validation.accountNumberRequired");
    }

    if (!formData?.accountHolderName?.trim()) {
      errors.accountHolderName = t("form.validation.accountHolderNameRequired");
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await saveProfile();
  };

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-red-600 shrink-0">
              error
            </span>
            <div>
              <h3 className="font-medium text-red-900">{t("errors.title")}</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                type="button"
                onClick={clearError}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 underline"
              >
                {t("button.dismiss")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-600">
              check_circle
            </span>
            <div>
              <p className="font-medium text-emerald-900">
                {t("success.profileUpdated")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Personal Information Section */}
      <div className="space-y-6">
        <div className="pb-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            {t("form.section.personalInfo")}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t("form.section.personalInfoDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              {t("form.label.fullName")} <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                validationErrors.fullName
                  ? "border-red-300 bg-red-50"
                  : "border-slate-300 bg-white"
              }`}
              placeholder={t("form.placeholder.fullName")}
            />
            {validationErrors.fullName && (
              <p className="text-sm text-red-600 mt-1">
                {validationErrors.fullName}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              {t("form.label.phoneNumber")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                validationErrors.phoneNumber
                  ? "border-red-300 bg-red-50"
                  : "border-slate-300 bg-white"
              }`}
              placeholder={t("form.placeholder.phoneNumber")}
            />
            {validationErrors.phoneNumber && (
              <p className="text-sm text-red-600 mt-1">
                {validationErrors.phoneNumber}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Banking Information Section */}
      <div className="space-y-6">
        <div className="pb-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            {t("form.section.bankingInfo")}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t("form.section.bankingInfoDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bank Name */}
          <div>
            <label
              htmlFor="bankName"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              {t("form.label.bankName")} <span className="text-red-500">*</span>
            </label>
            <input
              id="bankName"
              type="text"
              value={formData.bankName}
              onChange={(e) => updateField("bankName", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                validationErrors.bankName
                  ? "border-red-300 bg-red-50"
                  : "border-slate-300 bg-white"
              }`}
              placeholder={t("form.placeholder.bankName")}
            />
            {validationErrors.bankName && (
              <p className="text-sm text-red-600 mt-1">
                {validationErrors.bankName}
              </p>
            )}
          </div>

          {/* Account Number */}
          <div>
            <label
              htmlFor="accountNumber"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              {t("form.label.accountNumber")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="accountNumber"
              type="text"
              value={formData.accountNumber}
              onChange={(e) => updateField("accountNumber", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                validationErrors.accountNumber
                  ? "border-red-300 bg-red-50"
                  : "border-slate-300 bg-white"
              }`}
              placeholder={t("form.placeholder.accountNumber")}
            />
            {validationErrors.accountNumber && (
              <p className="text-sm text-red-600 mt-1">
                {validationErrors.accountNumber}
              </p>
            )}
          </div>

          {/* Account Holder Name */}
          <div>
            <label
              htmlFor="accountHolderName"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              {t("form.label.accountHolderName")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="accountHolderName"
              type="text"
              value={formData.accountHolderName}
              onChange={(e) => updateField("accountHolderName", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                validationErrors.accountHolderName
                  ? "border-red-300 bg-red-50"
                  : "border-slate-300 bg-white"
              }`}
              placeholder={t("form.placeholder.accountHolderName")}
            />
            {validationErrors.accountHolderName && (
              <p className="text-sm text-red-600 mt-1">
                {validationErrors.accountHolderName}
              </p>
            )}
          </div>

          {/* Swift Code */}
          <div>
            <label
              htmlFor="swiftCode"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              {t("form.label.swiftCode")}
            </label>
            <input
              id="swiftCode"
              type="text"
              value={formData.swiftCode || ""}
              onChange={(e) => updateField("swiftCode", e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              placeholder={t("form.placeholder.swiftCode")}
            />
            <p className="text-xs text-slate-500 mt-1">
              {t("form.help.swiftCode")}
            </p>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-medium rounded-lg transition-colors"
        >
          {saving ? (
            <>
              <span className="animate-spin material-symbols-outlined">
                progress_activity
              </span>
              {t("button.saving")}
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">save</span>
              {t("button.save")}
            </>
          )}
        </button>

        <p className="text-sm text-slate-600">{t("form.help.autoSave")}</p>
      </div>
    </form>
  );
}
