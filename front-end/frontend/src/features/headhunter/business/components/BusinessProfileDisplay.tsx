/**
 * Business Profile Display Component (Read-Only)
 * Shows company information that was set during account creation
 * Information cannot be edited after registration
 */

import { getSemanticClass } from "@/lib/design-tokens";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import type { BusinessProfile } from "../types/business.types";

export interface BusinessProfileDisplayProps {
  profile: BusinessProfile | null;
  isLoading?: boolean;
}

/**
 * Display business profile information in read-only mode
 */
export const BusinessProfileDisplay: React.FC<BusinessProfileDisplayProps> = ({
  profile,
  isLoading = false,
}) => {
  const { t } = useAppTranslation();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 bg-slate-100/50 rounded-3xl border border-dashed border-slate-300">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand-primary" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {t("business.state.loading")}
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className={`flex flex-col items-center gap-3 py-12 rounded-3xl border ${getSemanticClass("warning", "bg", true)} ${getSemanticClass("warning", "border", true)}`}
      >
        <svg
          className={`w-8 h-8 ${getSemanticClass("warning", "icon", true)}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0v-2"
          />
        </svg>
        <p
          className={`text-sm font-semibold ${getSemanticClass("warning", "text", true)}`}
        >
          {t("business.error.no_profile")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <div className="mb-6 flex items-center gap-3">
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
            <p className="text-xs text-slate-500 mt-1">
              {t("business.profile.read_only_note")}
            </p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Company Name */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
            {t("business.form.company_name")}
          </label>
          <p className="text-base font-medium text-slate-900">
            {profile.companyName}
          </p>
        </div>

        {/* Tax Code */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
            {t("business.form.tax_id")}
          </label>
          <p className="text-base font-medium text-slate-900 font-mono">
            {profile.taxCode || <span className="text-slate-400">-</span>}
          </p>
        </div>

        {/* Website */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
            {t("business.form.website")}
          </label>
          {profile.websiteUrl ? (
            <a
              href={profile.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium text-brand-primary hover:underline break-all"
            >
              {profile.websiteUrl}
            </a>
          ) : (
            <span className="text-slate-400">-</span>
          )}
        </div>

        {/* Company Scale */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
            {t("business.form.company_size")}
          </label>
          <p className="text-base font-medium text-slate-900">
            {profile.companyScale || <span className="text-slate-400">-</span>}
          </p>
        </div>

        {/* Address - spans 2 columns on desktop */}
        <div className="md:col-span-2 bg-slate-50 rounded-lg p-4 border border-slate-200">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
            {t("business.form.headquarters_address")}
          </label>
          <p className="text-base font-medium text-slate-900 wrap-break-word">
            {profile.addressMain || <span className="text-slate-400">-</span>}
          </p>
        </div>

        {/* Verification Status - spans 2 columns on desktop */}
        <div
          className={`md:col-span-2 rounded-lg p-4 border ${getSemanticClass("success", "bg", true)} ${getSemanticClass("success", "border", true)}`}
        >
          <label
            className={`block text-xs font-semibold uppercase tracking-wide ${getSemanticClass("success", "text", true)} mb-2`}
          >
            {t("business.verification.status")}
          </label>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                profile.verificationStatus === "PENDING"
                  ? getSemanticClass("warning", "bg", true) +
                    " " +
                    getSemanticClass("warning", "text", true)
                  : profile.verificationStatus === "APPROVED"
                    ? getSemanticClass("success", "bg", true) +
                      " " +
                      getSemanticClass("success", "text", true)
                    : getSemanticClass("danger", "bg", true) +
                      " " +
                      getSemanticClass("danger", "text", true)
              }`}
            >
              {t(
                `business.verification.status_${profile.verificationStatus?.toLowerCase()}`
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div
        className={`relative overflow-hidden rounded-2xl p-6 border ${getSemanticClass("info", "bg", true)} ${getSemanticClass("info", "border", true)}`}
      >
        <div className="flex gap-3">
          <svg
            className={`w-5 h-5 shrink-0 mt-0.5 ${getSemanticClass("info", "icon", true)}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p
              className={`text-sm font-semibold ${getSemanticClass("info", "text", true)}`}
            >
              {t("business.profile.info_title")}
            </p>
            <p
              className={`text-xs ${getSemanticClass("info", "text", true)} mt-1`}
            >
              {t("business.profile.info_description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileDisplay;
