import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, AuthLayout } from "@/shared/components";
import { useAuthTranslation } from "@/shared/hooks";
import type { ForgotPasswordFormData } from "../types";
import { sendOtpForgotPassword } from "../services/authApi";
import { toast } from "sonner";
import { extractApiErrorMessage } from "../utils/apiError";

import { MdOutlineMail } from "react-icons/md";

export function ForgotPasswordPage() {
  const { t } = useAuthTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });

  const [errors, setErrors] = useState<Partial<ForgotPasswordFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<ForgotPasswordFormData> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) {
      toast.error(t("messages.invalidEmail"));
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await sendOtpForgotPassword({
        email: formData.email,
        tokenType: "FORGOT_PASSWORD",
      });

      toast.success(t("messages.otpSent"));

      // Navigate to reset password page with OTP data
      navigate("/reset-password", {
        state: {
          email: response.email,
          accountId: response.accountId,
          expiresAt: response.expiresAt,
        },
      });
    } catch (error: unknown) {
      const errorMessage = extractApiErrorMessage(
        error,
        "Failed to send OTP. Please try again.",
      );

      toast.error(errorMessage);

      setErrors({
        email: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (value: string) => {
    setFormData({ email: value });
    if (errors.email) {
      setErrors({});
    }
  };

  return (
    <AuthLayout
      ctaButton={{ to: "/login", label: "Sign In" }}
      className="overflow-x-hidden"
    >
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="w-full bg-white dark:bg-slate-900 rounded-4xl overflow-hidden flex flex-col md:flex-row shadow-xl border border-slate-100 dark:border-slate-800">
          {/* LEFT PANEL */}
          <div className="md:w-5/12 bg-linear-to-br from-dark-panel-from to-dark-panel-to p-10 text-white">
            <h1 className="text-4xl font-bold mb-6">
              Forgot Your <br />
              <span className="text-brand-primary">Password?</span>
            </h1>

            <p className="text-slate-400 mb-10">
              No worries. Enter your email and we will send you a password reset
              link.
            </p>

            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-brand-primary">
                lock_reset
              </span>
              <span>Secure Password Recovery</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-brand-primary">
                verified_user
              </span>
              <span>Protected Account Access</span>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="md:w-7/12 p-10">
            <h2 className="text-3xl font-bold mb-2">Reset Your Password</h2>

            <p className="text-slate-500 mb-8">
              Enter the email associated with your account and we'll send you an
              OTP code.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <FormField label="Email Address" error={errors.email}>
                <div className="mb-4">
                  <Input
                    icon={<MdOutlineMail />}
                    type="email"
                    placeholder={t("placeholders.resetEmail")}
                    value={formData.email}
                    onChange={(e) => handleChange(e.target.value)}
                  />
                </div>
              </FormField>

              <Button
                type="submit"
                icon="send"
                disabled={isLoading}
                className="cursor-pointer"
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-8">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-lime-500 font-bold hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </AuthLayout>
  );
}
