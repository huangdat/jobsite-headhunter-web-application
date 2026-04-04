/**
 * Business Identity Form Component
 * Main form for entering/editing company information
 */

import React, { useMemo } from "react";
import { useBusinessTranslation } from "@/shared/hooks/useFeatureTranslation";
import type { BusinessFormData } from "../types/business.types";
import { COMPANY_SIZE_OPTIONS } from "../types/business.types";
import { FormValidationError } from "./FormValidationErrors";

export interface BusinessIdentityFormProps {
  formData: BusinessFormData;
  errors: Record<string, string | undefined>;
  touchedFields: Set<keyof BusinessFormData>;
  isLoading?: boolean;
  isSubmitting?: boolean;
  isReadOnly?: boolean;
  showValidationErrors?: boolean;
  onFieldChange: (fieldName: keyof BusinessFormData, value: string) => void;
  onFieldBlur: (fieldName: keyof BusinessFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
}

/**
 * Business Identity Form Component
 * 2-column grid with 5 company information fields
 */
export const BusinessIdentityForm: React.FC<BusinessIdentityFormProps> = ({
  formData,
  errors,
  touchedFields,
  isLoading = false,
  isSubmitting = false,
  isReadOnly = false,
  showValidationErrors = true,
  onFieldChange,
  onFieldBlur,
  onSubmit,
  submitButtonText = "business.form.submit",
  cancelButtonText = "business.form.cancel",
  onCancel,
}) => {
  const { t } = useBusinessTranslation();
  const isDisabled = isLoading || isSubmitting || isReadOnly;

  // Memoize company size options
  const companySizeOptions = useMemo(
    () =>
      Object.entries(COMPANY_SIZE_OPTIONS).map(([value, label]) => ({
        value,
        label: t(label),
      })),
    [t]
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Section Header */}
      <div>
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary">
            <svg
              className="h-6 w-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.5a2 2 0 00-1 .267M7 21H5a2 2 0 01-2-2v-4a2 2 0 012-2h2.5"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {t("business.form.company_identity")}
            </h3>
            <p className="text-sm text-slate-600">
              {t("business.form.company_identity_desc")}
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Column 1 */}
        <div className="space-y-6">
          {/* Company Name Field */}
          <div>
            <label
              htmlFor="companyName"
              className="block text-xs font-semibold uppercase tracking-wide text-slate-700"
            >
              {t("business.form.company_name")}
            </label>
            <input
              id="companyName"
              type="text"
              value={formData.companyName}
              onChange={(e) => onFieldChange("companyName", e.target.value)}
              onBlur={(e) => onFieldBlur("companyName", e.target.value)}
              disabled={isDisabled}
              placeholder={t("business.form.company_name_placeholder")}
              className={`mt-2 block w-full rounded-lg border px-4 py-3 text-sm transition-colors ${
                errors.companyName && touchedFields.has("companyName")
                  ? "border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 bg-white text-slate-900 focus:border-brand-primary focus:ring-brand-primary"
              } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
              required
            />
            {showValidationErrors && (
              <FormValidationError
                error={errors.companyName}
                touched={touchedFields.has("companyName")}
              />
            )}
          </div>

          {/* Company Size Field */}
          <div>
            <label
              htmlFor="companySize"
              className="block text-xs font-semibold uppercase tracking-wide text-slate-700"
            >
              {t("business.form.company_size")}
            </label>
            <select
              id="companySize"
              value={formData.companySize}
              onChange={(e) => onFieldChange("companySize", e.target.value)}
              onBlur={(e) => onFieldBlur("companySize", e.target.value)}
              disabled={isDisabled}
              className={`mt-2 block w-full rounded-lg border px-4 py-3 text-sm transition-colors ${
                errors.companySize && touchedFields.has("companySize")
                  ? "border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 bg-white text-slate-900 focus:border-brand-primary focus:ring-brand-primary"
              } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <option value="">-- {t("business.form.select_size")} --</option>
              {companySizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {showValidationErrors && (
              <FormValidationError
                error={errors.companySize}
                touched={touchedFields.has("companySize")}
              />
            )}
          </div>

          {/* Address Field */}
          <div>
            <label
              htmlFor="address"
              className="block text-xs font-semibold uppercase tracking-wide text-slate-700"
            >
              {t("business.form.headquarters_address")}
            </label>
            <input
              id="address"
              type="text"
              value={formData.headquartersAddress}
              onChange={(e) =>
                onFieldChange("headquartersAddress", e.target.value)
              }
              onBlur={(e) => onFieldBlur("headquartersAddress", e.target.value)}
              disabled={isDisabled}
              placeholder={t("business.form.address_placeholder")}
              className={`mt-2 block w-full rounded-lg border px-4 py-3 text-sm transition-colors ${
                errors.headquartersAddress &&
                touchedFields.has("headquartersAddress")
                  ? "border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 bg-white text-slate-900 focus:border-brand-primary focus:ring-brand-primary"
              } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
              required
            />
            {showValidationErrors && (
              <FormValidationError
                error={errors.headquartersAddress}
                touched={touchedFields.has("headquartersAddress")}
              />
            )}
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          {/* Tax ID Field */}
          <div>
            <label
              htmlFor="taxId"
              className="block text-xs font-semibold uppercase tracking-wide text-slate-700"
            >
              {t("business.form.tax_id")}
            </label>
            <input
              id="taxId"
              type="text"
              value={formData.taxId}
              onChange={(e) => onFieldChange("taxId", e.target.value)}
              onBlur={(e) => onFieldBlur("taxId", e.target.value)}
              disabled={isDisabled}
              placeholder={t("business.form.tax_id_placeholder")}
              pattern="[0-9]{10,13}"
              maxLength={13}
              className={`mt-2 block w-full rounded-lg border px-4 py-3 text-sm transition-colors ${
                errors.taxId && touchedFields.has("taxId")
                  ? "border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 bg-white text-slate-900 focus:border-brand-primary focus:ring-brand-primary"
              } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
              required
            />
            {showValidationErrors && (
              <FormValidationError
                error={errors.taxId}
                touched={touchedFields.has("taxId")}
              />
            )}
          </div>

          {/* Website Field */}
          <div>
            <label
              htmlFor="website"
              className="block text-xs font-semibold uppercase tracking-wide text-slate-700"
            >
              {t("business.form.website")}
            </label>
            <input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => onFieldChange("website", e.target.value)}
              onBlur={(e) => onFieldBlur("website", e.target.value)}
              disabled={isDisabled}
              placeholder={t("business.form.website_placeholder")}
              className={`mt-2 block w-full rounded-lg border px-4 py-3 text-sm transition-colors ${
                errors.website && touchedFields.has("website")
                  ? "border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 bg-white text-slate-900 focus:border-brand-primary focus:ring-brand-primary"
              } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
              required
            />
            {showValidationErrors && (
              <FormValidationError
                error={errors.website}
                touched={touchedFields.has("website")}
              />
            )}
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isDisabled}
          className={`flex-1 rounded-lg cursor-pointer px-6 py-3 font-semibold text-white transition-colors ${
            isDisabled
              ? "cursor-not-allowed bg-slate-400"
              : "bg-brand-primary text-black hover:bg-brand-hover active:bg-brand-hover"
          }`}
        >
          {isSubmitting && (
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          )}
          {isSubmitting ? t("business.form.submitting") : t(submitButtonText)}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isDisabled}
            className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t(cancelButtonText)}
          </button>
        )}
      </div>
    </form>
  );
};

export default BusinessIdentityForm;
