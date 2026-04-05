import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileForm } from "@/features/candidate/profile/components/ProfileForm";
import { useProfileUpdate } from "@/features/candidate/profile/hooks/useProfileUpdate";
import { useCandidateTranslation } from "@/shared/hooks/useFeatureTranslation";
import { PageContainer } from "@/shared/components/layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function ProfileEditPage() {
  const { t } = useCandidateTranslation();
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-slate-50/30">
      {/* PHẦN HEADER: Bây giờ nó sẽ tràn lề 100% vì không bị bọc bởi container */}
      <div className="mb-12 bg-[#069261] px-8 py-12">
        <div className="mx-auto max-w-7xl">
          {" "}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/60">
                <span>{t("profile.page.eyebrow")}</span>
                <span className="opacity-40">/</span>
                <span>{t("profile.page.candidate")}</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                {t("profile.page.title")}
              </h1>
              <p className="max-w-2xl text-sm font-medium text-emerald-50/80">
                {subtitle}
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="hidden items-center gap-2 font-bold uppercase tracking-widest text-white hover:text-lime-400 hover:bg-transparent md:flex text-[11px] cursor-pointer transition-colors"
            >
              <ChevronLeft size={16} />
              {t("common.back")}
            </Button>
          </div>
        </div>
      </div>

      <PageContainer variant="default" maxWidth="7xl">
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
    </div>
  );
}

export default ProfileEditPage;
