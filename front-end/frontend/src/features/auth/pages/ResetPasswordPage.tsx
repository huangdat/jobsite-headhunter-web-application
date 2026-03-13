import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  AuthLayout,
  PasswordRequirements,
} from "@/shared/components";
import { verifyAndResetPassword } from "../services/authApi";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { toast } from "sonner";
import type { OtpSendResp } from "../types";
import { extractApiErrorMessage } from "../utils/apiError";
import { MdLockOutline } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BsShieldLock } from "react-icons/bs";

export function ResetPasswordPage() {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const otpData = location.state as OtpSendResp | null;

  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to forgot password if no OTP data
  useEffect(() => {
    if (!otpData) {
      toast.error(t("auth.messages.invalidResetLink"));
      navigate("/forgot-password");
    }
  }, [otpData, navigate, t]);

  // Password requirements validation
  const requirements = {
    minLength: formData.password.length >= 8 && formData.password.length <= 16,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
  };

  const handleChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!otpData) return;

    setIsLoading(true);
    setErrors({});

    // OTP
    if (!formData.otp || formData.otp.length !== 6) {
      newErrors.otp = t("auth.validation.otpCodeRequired");
    }

    // Password
    if (!formData.password) {
      newErrors.password = t("auth.validation.passwordRequired");
    } else if (!Object.values(requirements).every(Boolean)) {
      newErrors.password = t("auth.validation.passwordNotMeetRequirements");
    }

    // Confirm
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("auth.validation.confirmPasswordRequired");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("auth.validation.passwordsDoNotMatch");
    }

    // If there are validation errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // Show only one toast notification
      toast.error(t("auth.validation.fixHighlightedFields"));

      setIsLoading(false);
      return;
    }

    try {
      const response = await verifyAndResetPassword({
        email: otpData.email,
        code: formData.otp,
        tokenType: "FORGOT_PASSWORD",
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.status && response.status !== "OK") {
        throw new Error(response.message);
      }

      // Success notification
      toast.success(t("auth.messages.passwordResetSuccess"));

      navigate("/login");
    } catch (error: unknown) {
      const errorMessage = extractApiErrorMessage(
        error,
        t("auth.messages.failedToResetPassword")
      );

      toast.error(errorMessage);

      setErrors({
        submit: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout ctaButton={{ to: "/login", label: "Sign In" }}>
      <main className="max-w-6xl mx-auto px-4 pt-8 md:pt-12 pb-0">
        <div className="bg-white dark:bg-slate-900 rounded-4xl overflow-hidden flex flex-col md:flex-row shadow-xl border border-slate-100 dark:border-slate-800">
          {/* Left Panel */}
          <div className="md:w-5/12 bg-linear-to-br from-dark-panel-from to-dark-panel-to text-white p-8 flex flex-col justify-center">
            <h1 className="text-5xl font-bold leading-tight">
              {t("auth.pages.resetPassword.title")}
            </h1>

            <p className="text-gray-300 mt-6">
              {t("auth.pages.resetPassword.subtitle")}
            </p>
          </div>

          {/* Right Panel - Form */}
          <div className="md:w-7/12 p-8 md:p-8 bg-white dark:bg-slate-900">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-2">
                {t("auth.pages.resetPassword.formTitle")}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-2">
                {t("auth.pages.resetPassword.instruction")}{" "}
                <span className="font-semibold text-lime-500">
                  {otpData?.email}
                </span>
              </p>
              <p className="text-slate-500 dark:text-slate-400 mb-3">
                {t("auth.pages.resetPassword.instruction2")}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  label={t("auth.pages.resetPassword.otpLabel")}
                  error={errors.otp}
                >
                  <Input
                    icon={<BsShieldLock />}
                    type="text"
                    placeholder={t("auth.placeholders.otpCode")}
                    value={formData.otp}
                    onChange={(e) =>
                      handleChange("otp")(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    error={!!errors.otp}
                    maxLength={6}
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label={t("auth.password")} error={errors.password}>
                    <Input
                      icon={<MdLockOutline />}
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.placeholders.newPassword")}
                      value={formData.password}
                      onChange={(e) => handleChange("password")(e.target.value)}
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
                    label={t("auth.pages.resetPassword.confirmPasswordLabel")}
                    error={errors.confirmPassword}
                  >
                    <Input
                      icon={<MdLockOutline />}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t("auth.placeholders.confirmPassword")}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleChange("confirmPassword")(e.target.value)
                      }
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
                  disabled={isLoading}
                  className="w-full flex justify-center gap-2 cursor-pointer"
                >
                  {isLoading
                    ? t("common.loading")
                    : t("auth.pages.resetPassword.submitButton")}
                </Button>
              </form>

              {errors.submit && (
                <p className="mt-3 text-sm text-red-500 text-center">
                  {errors.submit}
                </p>
              )}

              <div className="mt-4 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-lime-900 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    arrow_back
                  </span>
                  {t("auth.pages.resetPassword.backButton")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AuthLayout>
  );
}
