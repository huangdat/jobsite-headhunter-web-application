import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/shared/ui-primitives/button";
import { Input } from "@/shared/ui-primitives/input";
import { FormField, AuthLayout } from "@/shared/common-blocks";
import { useAuthTranslation, useAppTranslation } from "@/shared/hooks";
import { useAppForm } from "@/shared/hooks/useAppForm";
import type { ForgotPasswordFormData } from "@/features/auth/types";
import { sendOtpForgotPassword } from "@/features/auth/services/authApi";
import { toast } from "sonner";
import {
  Display,
  PageTitle,
  BodyText,
  SmallText,
} from "@/shared/common-blocks/typography/Typography";

import { MdOutlineMail } from "react-icons/md";

export function ForgotPasswordPage() {
  const { t: tAuth } = useAuthTranslation();
  const { t: tApp } = useAppTranslation();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup
      .string()
      .required(tApp("validation.emailRequired"))
      .email(tApp("validation.invalidEmail")),
  });

  const form = useAppForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await sendOtpForgotPassword({
        email: data.email,
        tokenType: "FORGOT_PASSWORD",
      });

      toast.success(tAuth("messages.otpSent"));

      // Navigate to reset password page with OTP data
      navigate("/reset-password", {
        state: {
          email: response.email,
          accountId: response.accountId,
          expiresAt: response.expiresAt,
        },
      });
    } catch {
      toast.error(tAuth("messages.failedSendOtp"));
    }
  };

  return (
    <AuthLayout
      ctaButton={{ to: "/login", label: tAuth("pages.login.label") }}
      className="overflow-x-hidden"
    >
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="w-full bg-white dark:bg-slate-900 rounded-4xl overflow-hidden flex flex-col md:flex-row shadow-xl border border-slate-100 dark:border-slate-800">
          {/* LEFT PANEL */}
          <div className="md:w-5/12 bg-linear-to-br from-dark-panel-from to-dark-panel-to p-10 text-white">
            <Display size="sm" className="mb-6 text-white">
              {tAuth("pages.forgotPassword.title")} <br />
              <span className="text-brand-primary">
                {tAuth("pages.forgotPassword.titleHighlight")}
              </span>
            </Display>

            <BodyText variant="muted" className="mb-10 text-slate-400">
              {tAuth("pages.forgotPassword.subtitle")}
            </BodyText>

            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-brand-primary">
                lock_reset
              </span>
              <span>{tAuth("pages.forgotPassword.feature1")}</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-brand-primary">
                verified_user
              </span>
              <span>{tAuth("pages.forgotPassword.feature2")}</span>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="md:w-7/12 p-10">
            <PageTitle className="mb-2 text-3xl">
              {tAuth("pages.forgotPassword.formTitle")}
            </PageTitle>

            <BodyText variant="muted" className="mb-8">
              {tAuth("pages.forgotPassword.formSubtitle")}
            </BodyText>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <FormField label={tAuth("pages.forgotPassword.emailLabel")}>
                <Input
                  icon={<MdOutlineMail />}
                  type="email"
                  placeholder={tAuth("placeholders.resetEmail")}
                  {...register("email")}
                />
              </FormField>

              <Button
                type="submit"
                icon="send"
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {isSubmitting
                  ? tAuth("common.sendingOtp")
                  : tAuth("common.sendOtp")}
              </Button>
            </form>

            <p className="text-center mt-8">
              <SmallText variant="muted" className="block mb-1">
                {tAuth("pages.forgotPassword.rememberPassword")}{" "}
              </SmallText>
              <Link
                to="/login"
                className="text-brand-primary font-medium hover:underline"
              >
                {tAuth("pages.forgotPassword.signInLink")}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </AuthLayout>
  );
}


