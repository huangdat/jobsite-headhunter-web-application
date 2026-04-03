import { Button } from "@/components/ui/button";
import { useCandidateTranslation } from "@/shared/hooks/useFeatureTranslation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Circle,
  Lightbulb,
  Info,
  FileUp,
  FileText, // Import thêm icon để hiển thị file CV
} from "lucide-react";
import type {
  CandidateProfileFormValues,
  ProfileValidationErrors,
} from "@/features/candidate/profile/types/profile.types";
import { ProfessionalIdentity } from "@/features/candidate/profile/components/ProfessionalIdentity";
import { profileApi } from "@/features/candidate/profile/services/profileApi";

interface ProfileFormProps {
  values: CandidateProfileFormValues;
  errors: ProfileValidationErrors;
  loading: boolean;
  saving: boolean;
  success: boolean;
  saveError: string | null;
  dirty: boolean;
  profileStrength: number;
  onFieldChange: <K extends keyof CandidateProfileFormValues>(
    field: K,
    value: CandidateProfileFormValues[K]
  ) => void;
  onDiscard: () => void;
  onSave: () => Promise<void>;
}

const ProfileFormSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-2 overflow-hidden rounded-full bg-slate-200" />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-4 w-1/3 rounded bg-slate-200 mb-4" />
        <div className="h-3 w-2/3 rounded bg-slate-200 mb-6" />
        <div className="h-9 w-28 rounded-lg bg-slate-200" />
      </div>
    </div>
  );
};

export function ProfileForm({
  values,
  errors,
  loading,
  saving,
  success,
  saveError,
  dirty,
  profileStrength,
  onFieldChange,
  onDiscard,
  onSave,
}: ProfileFormProps) {
  const { t } = useCandidateTranslation();
  const [isUploading, setIsUploading] = useState(false);

  if (loading) {
    return <ProfileFormSkeleton />;
  }

  const hasValidationError = Object.values(errors).some(Boolean);
  const hasCV = !!values.cvUrl;

  const strengthWidthClass =
    profileStrength >= 100
      ? "w-full"
      : profileStrength >= 75
        ? "w-9/12"
        : profileStrength >= 50
          ? "w-6/12"
          : profileStrength >= 25
            ? "w-3/12"
            : "w-2/12";

  return (
    <div className="space-y-6">
      {/* Alert Thông báo lỗi Save */}
      {saveError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-bold">{t("profile.alerts.saveErrorTitle")}</p>
            <p className="text-sm">{saveError}</p>
          </div>
        </div>
      )}

      {/* Alert Lỗi Validation */}
      {hasValidationError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-bold">
              {t("profile.alerts.validationErrorTitle")}
            </p>
          </div>
        </div>
      )}

      {/* Alert Thành công khi Save Profile */}
      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
          <CheckCircle2 className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-bold">{t("profile.alerts.saveSuccessTitle")}</p>
            <p className="text-sm">{t("profile.alerts.saveSuccessBody")}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Main content */}
        <div className="xl:col-span-8">
          <ProfessionalIdentity
            values={values}
            errors={errors}
            disabled={saving}
            onFieldChange={onFieldChange}
          />

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <Button
              variant="outline"
              size="lg"
              disabled={!dirty || saving}
              className="h-11 border-slate-300 px-6 font-bold text-slate-700"
              onClick={onDiscard}
            >
              {t("profile.actions.discardChanges")}
            </Button>
            <Button
              variant="primary"
              size="lg"
              disabled={!dirty || saving}
              className="h-11 w-auto px-8 text-sm"
              onClick={() => void onSave()}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("profile.actions.saving")}
                </>
              ) : (
                t("profile.actions.saveChanges")
              )}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 xl:col-span-4">
          {/* Profile Strength */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">
                {t("profile.sidebar.strengthTitle")}
              </h3>
              <span
                className={`text-sm font-black ${
                  profileStrength < 60 ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {profileStrength}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full transition-all ${
                  profileStrength < 60 ? "bg-red-500" : "bg-emerald-500"
                } ${strengthWidthClass}`}
              />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              {t("profile.sidebar.strengthHint")}
            </p>
          </div>

          {/* CV Management Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileUp className="h-4 w-4 text-slate-500" />
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">
                {t("cv.management.title")}
              </h3>
            </div>

            {hasCV ? (
              <div className="mb-6 p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 flex items-center justify-between group transition-all">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <FileText size={24} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-700 truncate">
                      {values.cvUrl
                        ? decodeURIComponent(
                            values.cvUrl.split("/").pop()?.split("?")[0] || ""
                          )
                        : values.fullName
                          ? `${values.fullName}_CV.pdf`
                          : "My_Resume.pdf"}
                    </p>
                    <a
                      href={values.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline flex items-center gap-1 mt-0.5"
                    >
                      {t("common.view") || "View Document"}
                    </a>
                  </div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              </div>
            ) : (
              <p className="text-sm text-slate-600 mb-6 italic">
                {t("cv.management.empty.description")}
              </p>
            )}

            <input
              aria-label={t("cv.management.empty.button") || "Upload CV"}
              id="profile-cv-input"
              type="file"
              accept=".pdf,.doc,.docx,.rtf"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setIsUploading(true);

                try {
                  const url = await profileApi.uploadCV(file);
                  if (url) {
                    onFieldChange("cvUrl" as const, url);

                    toast.success(
                      t("cv.management.success.banner") ||
                        "Upload temporary success. Please save!"
                    );
                  } else {
                    toast.error(t("cv.management.error.banner"));
                  }
                } catch (err) {
                  console.error("Upload error", err);
                  toast.error(t("cv.management.error.banner"));
                } finally {
                  setIsUploading(false);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />

            <div className="flex items-center gap-3">
              <Button
                variant={hasCV ? "outline" : "primary"}
                size="sm"
                className={`h-11 px-6 font-bold cursor-pointer rounded-xl shadow-md transition-all active:scale-95 flex-1 ${
                  !hasCV
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                }`}
                onClick={() =>
                  document.getElementById("profile-cv-input")?.click()
                }
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("cv.management.messages.uploading")}
                  </>
                ) : hasCV ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t("cv.management.success.addAnother")}
                  </>
                ) : (
                  <>
                    <FileUp className="mr-2 h-4 w-4" />
                    {t("cv.management.empty.button")}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Profile Tips */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">
                {t("profile.sidebar.tipsTitle")}
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                {t("profile.sidebar.tipOne")}
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                {t("profile.sidebar.tipTwo")}
              </li>
              <li className="flex gap-2">
                <Circle className="h-4 w-4 text-slate-400 shrink-0" />
                {t("profile.sidebar.tipThree")}
              </li>
            </ul>
          </div>

          {/* Insight Card */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-50 to-emerald-100 p-6 shadow-sm">
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-emerald-700" />
                <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
                  {t("profile.sidebar.insightEyebrow")}
                </p>
              </div>
              <p className="text-sm font-semibold leading-relaxed text-emerald-900">
                {t("profile.sidebar.insightBody")}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
