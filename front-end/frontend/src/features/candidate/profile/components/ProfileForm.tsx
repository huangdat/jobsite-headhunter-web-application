import { Button } from "@/components/ui/button";
import { useCandidateTranslation } from "@/shared/hooks/useFeatureTranslation";
import type {
  CandidateProfileFormValues,
  ProfileValidationErrors,
} from "@/features/candidate/profile/types/profile.types";
import { ProfessionalIdentity } from "@/features/candidate/profile/components/ProfessionalIdentity";
import profileBackground from "../../../../../assets/profiles/prof_01_candidate/candidate_profile_my_profile_updated/screen.png";

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
    <div className="space-y-6">
      <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-8">
          <div className="h-8 w-1/3 animate-pulse rounded bg-slate-200" />
          <div className="h-12 animate-pulse rounded bg-slate-100" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 animate-pulse rounded bg-slate-100" />
            <div className="h-12 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="h-36 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="xl:col-span-4 space-y-4">
          <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
        </div>
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

  if (loading) {
    return <ProfileFormSkeleton />;
  }

  const hasValidationError = Object.keys(errors).length > 0;
  const strengthWidthClass =
    profileStrength >= 95
      ? "w-full"
      : profileStrength >= 85
        ? "w-10/12"
        : profileStrength >= 70
          ? "w-9/12"
          : profileStrength >= 55
            ? "w-7/12"
            : profileStrength >= 40
              ? "w-5/12"
              : profileStrength >= 25
                ? "w-3/12"
                : "w-2/12";

  return (
    <div className="space-y-6">
      {saveError ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <span className="material-symbols-outlined text-lg!">report</span>
          <div>
            <p className="font-bold">{t("profile.alerts.saveErrorTitle")}</p>
            <p className="text-sm">{saveError}</p>
          </div>
        </div>
      ) : null}

      {hasValidationError ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <span className="material-symbols-outlined text-lg!">error</span>
          <div>
            <p className="font-bold">
              {t("profile.alerts.validationErrorTitle")}
            </p>
          </div>
        </div>
      ) : null}

      {success ? (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
          <span className="material-symbols-outlined text-lg!">
            check_circle
          </span>
          <div>
            <p className="font-bold">{t("profile.alerts.saveSuccessTitle")}</p>
            <p className="text-sm">{t("profile.alerts.saveSuccessBody")}</p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
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
              {saving
                ? t("profile.actions.saving")
                : t("profile.actions.saveChanges")}
            </Button>
          </div>
        </div>

        <aside className="space-y-4 xl:col-span-4">
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

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-600">
              {t("profile.sidebar.tipsTitle")}
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="material-symbols-outlined text-base! text-emerald-600">
                  check_circle
                </span>
                {t("profile.sidebar.tipOne")}
              </li>
              <li className="flex gap-2">
                <span className="material-symbols-outlined text-base! text-emerald-600">
                  check_circle
                </span>
                {t("profile.sidebar.tipTwo")}
              </li>
              <li className="flex gap-2">
                <span className="material-symbols-outlined text-base! text-slate-400">
                  radio_button_unchecked
                </span>
                {t("profile.sidebar.tipThree")}
              </li>
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-xl">
            <img
              src={profileBackground}
              alt={t("profile.sidebar.insightAlt")}
              className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 to-slate-900/50" />
            <div className="relative z-10 space-y-2">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-300">
                {t("profile.sidebar.insightEyebrow")}
              </p>
              <p className="text-sm font-semibold leading-relaxed text-slate-100">
                {t("profile.sidebar.insightBody")}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
