import { useMemo } from "react";
import { ProfileForm } from "@/features/candidate/profile/components/ProfileForm";
import { useProfileUpdate } from "@/features/candidate/profile/hooks/useProfileUpdate";
import { useCandidateTranslation } from "@/shared/hooks/useFeatureTranslation";

export function ProfileEditPage() {
  const { t } = useCandidateTranslation();
  const profileModel = useProfileUpdate();

  const subtitle = useMemo(() => {
    if (profileModel.saving) {
      return t("profile.page.subtitleSaving");
    }

    if (profileModel.success) {
      return t("profile.page.subtitleSuccess");
    }

    return t("profile.page.subtitleDefault");
  }, [profileModel.saving, profileModel.success, t]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              {t("profile.page.eyebrow")}
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              {t("profile.page.title")}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>

        <ProfileForm
          values={profileModel.draft}
          errors={profileModel.errors}
          loading={profileModel.loading}
          saving={profileModel.saving}
          success={profileModel.success}
          saveError={profileModel.saveError || profileModel.fetchError}
          dirty={profileModel.dirty}
          profileStrength={profileModel.profileStrength}
          onFieldChange={profileModel.updateField}
          onDiscard={profileModel.discardChanges}
          onSave={async () => {
            await profileModel.saveChanges();
          }}
        />
      </div>
    </main>
  );
}

export default ProfileEditPage;
