import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, AuthLayout } from "@/shared/components";
import type { ForgotPasswordFormData } from "../types";
import { forgotPassword } from "../services/authApi";

import { MdOutlineMail } from "react-icons/md";

export function ForgotPasswordPage() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });

  const [errors, setErrors] = useState<Partial<ForgotPasswordFormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      await forgotPassword(formData);
      setIsSubmitted(true);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrors({
        email: err.response?.data?.message || "Failed to send reset link",
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
      navLinks={[{ to: "#", label: "Home" }]}
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
            {!isSubmitted ? (
              <>
                <h2 className="text-3xl font-bold mb-2">Reset Your Password</h2>

                <p className="text-slate-500 mb-8">
                  Enter the email associated with your account.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <FormField label="Email Address" error={errors.email}>
                    <div className="mb-4">
                      <Input
                        icon={<MdOutlineMail />}
                        type="email"
                        placeholder="name@company.com"
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
                    {isLoading ? "Sending..." : "Send Reset Link"}
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
              </>
            ) : (
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-brand-primary text-5xl">
                      mark_email_read
                    </span>
                  </div>
                </div>

                <h2 className="text-3xl font-bold mb-4">Check Your Email</h2>

                <p className="text-slate-500 mb-8">
                  We have sent a password reset link to your email.
                </p>

                <Link
                  to="/login"
                  className="gradient-btn w-full py-3 text-black font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/25"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Back to Login
                </Link>

                <p className="text-sm text-slate-500 mt-6">
                  Didn't receive the email?{" "}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-brand-primary font-bold hover:underline"
                  >
                    Resend
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </AuthLayout>
  );
}
