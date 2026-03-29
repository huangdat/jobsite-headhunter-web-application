import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  AuthLayout,
  PasswordRequirements,
} from "@/shared/components";
import { verifyAndResetPassword } from "@/features/auth/services/authApi";
import { useAuthTranslation, useAppTranslation } from "@/shared/hooks";
import { useAppForm } from "@/shared/hooks/useAppForm";
import { toast } from "sonner";
import type { OtpSendResp } from "@/features/auth/types";
import { MdLockOutline } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BsShieldLock } from "react-icons/bs";

interface ResetPasswordFormData {
  otp: string;
  password: string;
  confirmPassword: string;
}

export function ResetPasswordPage() {
  const { t: tAuth } = useAuthTranslation();
  const { t: tApp } = useAppTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const otpData = location.state as OtpSendResp | null;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const schema = yup.object().shape({
    otp: yup
      .string()
      .required(tAuth("validation.otpCodeRequired"))
      .length(6, tAuth("validation.otpCodeRequired")),
    password: yup
      .string()
      .required(tAuth("validation.passwordRequired"))
      .min(8, tAuth("validation.passwordBetween8and16"))
      .max(16, tAuth("validation.passwordBetween8and16"))
      .matches(/[A-Z]/, tAuth("validation.passwordUppercase"))
      .matches(/[a-z]/, tAuth("validation.passwordLowercase"))
      .matches(/\d/, tAuth("validation.passwordNumber"))
      .matches(/^[a-zA-Z0-9_]+$/, tAuth("validation.passwordSpecialChars")),
    confirmPassword: yup
      .string()
      .required(tAuth("validation.confirmPasswordRequired"))
      .oneOf([yup.ref("password")], tAuth("validation.passwordsDoNotMatch")),
  });

  const form = useAppForm<ResetPasswordFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    watch,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const passwordValue = watch("password");

  // Password requirements validation
  const requirements = {
    minLength: passwordValue.length >= 8 && passwordValue.length <= 16,
    hasUpperCase: /[A-Z]/.test(passwordValue),
    hasLowerCase: /[a-z]/.test(passwordValue),
    hasNumber: /\d/.test(passwordValue),
  };

  // Redirect to forgot password if no OTP data
  useEffect(() => {
    if (!otpData) {
      toast.error(tAuth("messages.invalidResetLink"));
      navigate("/forgot-password");
    }
  }, [otpData, navigate, tAuth]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!otpData) return;

    try {
      const response = await verifyAndResetPassword({
        email: otpData.email,
        code: data.otp,
        tokenType: "FORGOT_PASSWORD",
        newPassword: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (response.status && response.status !== "OK") {
        throw new Error(response.message);
      }

      // Success notification
      toast.success(tAuth("messages.passwordResetSuccess"));

      navigate("/login");
    } catch {
      toast.error(tAuth("messages.failedToResetPassword"));
    }
  };

  return (
    <AuthLayout ctaButton={{ to: "/login", label: tAuth("auth.pages.login") }}>
      <main className="max-w-6xl mx-auto px-4 pt-8 md:pt-12 pb-0">
        <div className="bg-white dark:bg-slate-900 rounded-4xl overflow-hidden flex flex-col md:flex-row shadow-xl border border-slate-100 dark:border-slate-800">
          {/* Left Panel */}
          <div className="md:w-5/12 bg-linear-to-br from-dark-panel-from to-dark-panel-to text-white p-8 flex flex-col justify-center">
            <h1 className="text-5xl font-bold leading-tight">
              {tAuth("pages.resetPassword.title")}
            </h1>

            <p className="text-gray-300 mt-6">
              {tAuth("pages.resetPassword.subtitle")}
            </p>
          </div>

          {/* Right Panel - Form */}
          <div className="md:w-7/12 p-8 md:p-8 bg-white dark:bg-slate-900">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-2">
                {tAuth("pages.resetPassword.formTitle")}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-2">
                {tAuth("pages.resetPassword.instruction")}{" "}
                <span className="font-semibold text-lime-500">
                  {otpData?.email}
                </span>
              </p>
              <p className="text-slate-500 dark:text-slate-400 mb-3">
                {tAuth("pages.resetPassword.instruction2")}
              </p>

              <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
                <FormField
                  label={tAuth("pages.resetPassword.otpLabel")}
                  error={errors.otp?.message}
                >
                  <Input
                    icon={<BsShieldLock />}
                    type="text"
                    placeholder={tAuth("placeholders.otpCode")}
                    {...register("otp")}
                    error={!!errors.otp}
                    maxLength={6}
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label={tApp("password")}
                    error={errors.password?.message}
                  >
                    <Input
                      icon={<MdLockOutline />}
                      type={showPassword ? "text" : "password"}
                      placeholder={tAuth("placeholders.newPassword")}
                      {...register("password")}
                      error={!!errors.password}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="cursor-pointer text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? (
                            <AiOutlineEyeInvisible />
                          ) : (
                            <AiOutlineEye />
                          )}
                        </button>
                      }
                    />
                  </FormField>

                  <FormField
                    label={tAuth("pages.resetPassword.confirmPasswordLabel")}
                    error={errors.confirmPassword?.message}
                  >
                    <Input
                      icon={<MdLockOutline />}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={tAuth("placeholders.confirmPassword")}
                      {...register("confirmPassword")}
                      error={!!errors.confirmPassword}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="cursor-pointer text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? (
                            <AiOutlineEyeInvisible />
                          ) : (
                            <AiOutlineEye />
                          )}
                        </button>
                      }
                    />
                  </FormField>
                </div>

                <PasswordRequirements
                  minLength={requirements.minLength}
                  hasUpperCase={requirements.hasUpperCase}
                  hasLowerCase={requirements.hasLowerCase}
                  hasNumber={requirements.hasNumber}
                />

                <Button
                  variant="primary"
                  size="xl"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting
                    ? tApp("common.loading")
                    : tAuth("pages.resetPassword.submitButton")}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-lime-900 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    arrow_back
                  </span>
                  {tAuth("pages.resetPassword.backButton")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AuthLayout>
  );
}
