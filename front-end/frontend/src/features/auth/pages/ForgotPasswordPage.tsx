import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, AuthLayout } from "@/shared/components";
import { useAuthTranslation, useAppTranslation } from "@/shared/hooks";
import { useAppForm } from "@/shared/hooks/useAppForm";
import type { ForgotPasswordFormData } from "@/features/auth/types";
import { sendOtpForgotPassword } from "@/features/auth/services/authApi";
import { toast } from "sonner";

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
      ctaButton={{ to: "/login", label: tAuth("auth.pages.login") }}
      className="overflow-x-hidden"
    >
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="w-full bg-white dark:bg-slate-900 rounded-4xl overflow-hidden flex flex-col md:flex-row shadow-xl border border-slate-100 dark:border-slate-800">
          {/* LEFT PANEL */}
          <div className="md:w-5/12 bg-linear-to-br from-dark-panel-from to-dark-panel-to p-10 text-white">
            <h1 className="text-4xl font-bold mb-6">
              {tAuth("pages.forgotPassword.title")} <br />
              <span className="text-brand-primary">
                {tAuth("pages.forgotPassword.titleHighlight")}
              </span>
            </h1>

            <p className="text-slate-400 mb-10">
              {tAuth("pages.forgotPassword.subtitle")}
            </p>

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
            <h2 className="text-3xl font-bold mb-2">
              {tAuth("pages.forgotPassword.formTitle")}
            </h2>

            <p className="text-slate-500 mb-8">
              {tAuth("pages.forgotPassword.formSubtitle")}
            </p>

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

            <p className="text-center text-sm text-slate-500 mt-8">
              {tAuth("pages.forgotPassword.rememberPassword")}{" "}
              <Link
                to="/login"
                className="text-lime-500 font-bold hover:underline"
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
