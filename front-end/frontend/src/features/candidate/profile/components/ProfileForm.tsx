import { getSemanticClass } from "@/lib/design-tokens";
import { useCandidateTranslation } from "@/shared/hooks/useFeatureTranslation";
import { Button } from "@/shared/ui-primitives/button";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
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
  onFieldChange: <K extends keyof CandidateProfileFormValues>(
    field: K,
    value: CandidateProfileFormValues[K]
  ) => void;
  onDiscard: () => void;
  onSave: () => Promise<void>;
  profileStrength?: number;
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

  return (
    <div className="space-y-6">
      {saveError && (
        <div
          className={`flex items-start gap-3 rounded-xl border ${getSemanticClass("danger", "border", true)} ${getSemanticClass("danger", "bg", true)} p-4 ${getSemanticClass("danger", "text", true)}`}
        >
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-bold">{t("profile.alerts.saveErrorTitle")}</p>
            <p className="text-sm">{saveError}</p>
          </div>
        </div>
      )}

      {hasValidationError && (
        <div
          className={`flex items-start gap-3 rounded-xl border ${getSemanticClass("danger", "border", true)} ${getSemanticClass("danger", "bg", true)} p-4 ${getSemanticClass("danger", "text", true)}`}
        >
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-bold">
              {t("profile.alerts.validationErrorTitle")}
            </p>
          </div>
        </div>
      )}

      {success && (
        <div
          className={`flex items-start gap-3 rounded-xl p-4 ${getSemanticClass("success", "border", true)} ${getSemanticClass("success", "bg", true)} ${getSemanticClass("success", "text", true)}`}
        >
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
              className="h-11 border-slate-300 px-6 font-bold text-slate-700 cursor-pointer"
              onClick={onDiscard}
            >
              {t("profile.actions.discardChanges")}
            </Button>
            <Button
              variant="primary"
              size="lg"
              disabled={!dirty || saving}
              className="h-11 w-auto px-8 text-sm cursor-pointer"
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
          {/* CV Management Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileUp className="h-4 w-4 text-slate-500" />
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">
                {t("cv.management.title")}
              </h3>
            </div>

            {hasCV ? (
              <div
                className={`mb-6 p-4 rounded-2xl flex items-center justify-between group transition-all border ${getSemanticClass("success", "border", true)} ${getSemanticClass("success", "bg", true)}`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getSemanticClass("success", "bg", true)} ${getSemanticClass("success", "icon", true)}`}
                  >
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
                      {t("cv.management.fileList.actions.view")}
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

                    toast.success(t("cv.management.success.banner"));
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
                    ? "bg-brand-primary hover:bg-brand-hover text-black"
                    : "border-slate-300 text-black hover:bg-slate-100"
                }`}
                onClick={() =>
                  document.getElementById("profile-cv-input")?.click()
                }
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("candidate.cv.management.messages.uploading")}
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
        </aside>
      </div>
    </div>
  );
}

