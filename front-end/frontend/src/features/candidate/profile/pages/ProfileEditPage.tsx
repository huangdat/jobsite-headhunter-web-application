import { useMemo } from "react";
import { ProfileForm } from "@/features/candidate/profile/components/ProfileForm";
import { useProfileUpdate } from "@/features/candidate/profile/hooks/useProfileUpdate";
import { useCandidateTranslation } from "@/shared/hooks/useFeatureTranslation";
import { PageContainer } from "@/shared/components/layout";
import {
  Display,
  MetaText,
  SmallText,
} from "@/shared/components/typography/Typography";

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
    <PageContainer variant="default" maxWidth="7xl">
      <div className="mb-6">
        <MetaText>{t("profile.page.eyebrow")}</MetaText>
        <Display size="md" className="mt-1 md:text-5xl">
          {t("profile.page.title")}
        </Display>
        <SmallText variant="muted" className="mt-1">
          {subtitle}
        </SmallText>
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
    </PageContainer>
  );
}

export default ProfileEditPage;
