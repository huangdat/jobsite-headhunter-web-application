import { Link } from "react-router-dom";
import { useAuthTranslation } from "@/shared/hooks";
import { AuthLayout } from "@/shared/components";
import {
  Display,
  SectionTitle,
  BodyText,
  SmallText,
} from "@/shared/components/typography/Typography";

export function ResetPasswordSuccessPage() {
  const { t } = useAuthTranslation();
  return (
    <AuthLayout ctaButton={{ to: "/login", label: t("buttons.signIn") }}>
      <main className="max-w-5xl mx-auto px-4 pt-12">
        <div className="bg-white dark:bg-slate-900 rounded-4xl overflow-hidden flex flex-col md:flex-row shadow-xl border border-slate-100 dark:border-slate-800">
          {/* Left Panel */}
          <div className="md:w-5/12 bg-linear-to-br from-dark-panel-from to-dark-panel-to p-12 flex flex-col justify-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                <span className="material-symbols-outlined text-brand-primary text-3xl">
                  security
                </span>
              </div>

              <Display size="md" className="mb-6">
                {t("pages.resetPasswordSuccess.titleLeft")} <br />
                <span className="text-brand-primary">
                  {t("pages.resetPasswordSuccess.titleHighlight")}
                </span>
              </Display>

              <BodyText className="text-gray-300 leading-relaxed max-w-sm">
                {t("pages.resetPasswordSuccess.subtitleLeft")}
              </BodyText>

              <div className="mt-12 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-400">
                    check_circle
                  </span>
                  <SmallText className="text-slate-300">
                    {t("pages.resetPasswordSuccess.checkItem1")}
                  </SmallText>
                </div>

                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-brand-primary">
                    shield
                  </span>
                  <SmallText className="text-slate-300">
                    {t("pages.resetPasswordSuccess.checkItem2")}
                  </SmallText>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Success Message */}
          <div className="md:w-7/12 p-8 md:p-14 bg-white dark:bg-slate-900 flex items-center">
            <div className="max-w-md mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-7xl text-brand-primary success-icon-glow">
                    check_circle
                  </span>
                </div>
              </div>
              <SectionTitle className="mb-4">
                {t("pages.resetPasswordSuccess.title")}
              </SectionTitle>
              <BodyText className="mb-10 leading-relaxed">
                {t("pages.resetPasswordSuccess.subtitle")}
              </BodyText>
              <Link
                to="/login"
                className="success-button-gradient w-full py-4 text-black font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 mb-8"
              >
                <span className="material-symbols-outlined text-xl">login</span>
                {t("pages.resetPasswordSuccess.signInButton")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </AuthLayout>
  );
}
