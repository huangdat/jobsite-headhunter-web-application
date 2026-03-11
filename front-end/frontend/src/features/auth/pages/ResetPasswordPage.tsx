import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  AuthLayout,
  PasswordRequirements,
} from "@/shared/components";
import { verifyOtpForgotPassword, resetPassword } from "../services/authApi";
import { toast } from "sonner";
import type { OtpSendResp } from "../types";

export function ResetPasswordPage() {
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
      toast.error("Invalid reset link. Please request a new password reset.");
      navigate("/forgot-password");
    }
  }, [otpData, navigate]);

  // Password requirements validation
  const requirements = {
    minLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
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

    if (!otpData) return;

    setIsLoading(true);
    setErrors({});

    // Validation
    if (!formData.otp || formData.otp.length !== 6) {
      const errorMsg = "Please enter a valid 6-digit OTP code";
      setErrors({ otp: errorMsg });
      toast.error(errorMsg);
      setIsLoading(false);
      return;
    }

    if (!Object.values(requirements).every(Boolean)) {
      const errorMsg = "Password does not meet requirements";
      setErrors({ password: errorMsg });
      toast.error(errorMsg);
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      const errorMsg = "Passwords do not match";
      setErrors({ confirmPassword: errorMsg });
      toast.error(errorMsg);
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Verify OTP and get reset token
      const verifyResponse = await verifyOtpForgotPassword({
        accountId: otpData.accountId,
        email: otpData.email,
        code: formData.otp,
        tokenType: "FORGOT_PASSWORD",
      });

      if (!verifyResponse.resetToken) {
        throw new Error("Failed to verify OTP. No reset token received.");
      }

      // Step 2: Reset password using the reset token
      await resetPassword({
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        token: verifyResponse.resetToken,
      });

      // Success notification
      toast.success("Password reset successful! You can now login.");

      navigate("/login");
    } catch (error: unknown) {
      let errorMessage = "Failed to reset password. Please try again.";

      if (
        error instanceof Error &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null
      ) {
        const response = error.response as {
          data?: { message?: string };
        };
        errorMessage = response.data?.message || errorMessage;
      }

      // Error notification
      toast.error(errorMessage);

      setErrors({
        submit: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      navLinks={[
        { to: "#", label: "Home" },
        { to: "#", label: "How it works" },
        { to: "#", label: "Rewards" },
      ]}
      ctaButton={{ to: "/select-role", label: "Sign Up" }}
      showFooter={false}
    >
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white dark:bg-slate-900 rounded-4xl overflow-hidden flex flex-col md:flex-row shadow-xl border border-slate-100 dark:border-slate-800">
          {/* Left Panel */}
          <div className="md:w-5/12 bg-linear-to-br from-[#0A1F16] to-[#050D0A] p-12 flex flex-col justify-between text-white relative overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none radial-dot-pattern"></div>

            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                <span className="material-symbols-outlined text-brand-primary">
                  security
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Unlock Your <br />
                <span className="text-brand-primary">Earning Potential</span>
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed max-w-sm mb-12">
                Your security is our priority. Create a strong password to
                protect your earnings and referrals.
              </p>

              {/* Social Proof Card */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex -space-x-3">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuABqlsvx6yZKfSnftA9Q2pU5FhkX-HgGSa6Y6gVX5288goI_6QfB28E5atvv4bVqoAoQmoZojZljsD9E-HnURxRo7pS0LpBO_yFrwErsmK6onRJe-E3tSnQYYk81Ni3ja9E8nek5sfQMgLqPvdWAM382R9VaDGxq7Bx6xsPQ3GRaMk0sokF5beAUhEIN1u6sFA4h9qryLo0tTIBI3MvSBU9A22TQW0WE35Fi5HkNMmEah7DOW0P2gGwknoSVbh8DH1D-jyJvLCWp4Y"
                      alt="Active user"
                      className="w-10 h-10 rounded-full border-2 border-slate-800"
                    />
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrGFYjfvCx9VTzgFbISWHa4x-dovk2yi6zo-HX_XPSiqq9dZ-8zjK0hqJdzg3mkd_8XVKnNgjSg1M5grdNyd45T3m7nKo6OzXhBQ2nJ0sGgf34CThoRvsdbcFjVg7cScFUXE9MvPlOc_X4tFaumfcJ8jsaSEc0aa1Cq8StK3_ly0HR0sL7L2iXr88de_9EZmpbG_52aKSghBVFGVqWYYvrfbz7-_qS4NBlZFa60-efifFVfNfUMWkue1ZP0EhOX6iMG1Zfct2ViEA"
                      alt="Active user"
                      className="w-10 h-10 rounded-full border-2 border-slate-800"
                    />
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9v813yZs4c_n_9ftsSu_SxqHicYHC-Wp8xd361akoojexbr4IWjAwGvEYL6JOyICXevf_xRMAAEGMa6mw47JM8WLUGgDD0_qZrbfSOAGTVneGA4ZBMojk4ZpwmZv-3tjQubCKfflANEsaIpThvkJ7EydfLSWW3eoz6LN5WLEuKp6llJkfM67PyAZ6QVTpyR3Zh-6e9UlDs3mbYkGKecaUKG5L67aBg11_HqgDfI40siFxxO9lM4tpW0ESKE4vy5myXbonTnEGnAU"
                      alt="Active user"
                      className="w-10 h-10 rounded-full border-2 border-slate-800"
                    />
                    <div className="w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center text-xs font-bold">
                      +5k
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-300">
                    Join 5,000+ Professionals
                  </span>
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-video">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz_qmyk466XBK6tnSpzCfNeX1MGRUor1hkZ5YNJtfB-1DtZNr0-2QSWKDHAsWjXLJ8LCLxc0wJiRaVYSgio1IIExn-eCkTLqxgTm1Ked8Zke4BEL-RMq_i0rtCYLBWriZd0JbJ7zks9e_NJzm_fqATytYOs-mUm2joMW5jC0D7Ee064Q0npbzhvtPuGfQMBqigNYsFgQhSDZgLvPvNv37J9FtQIKOdCfvvs2fFHbH8nZxu0nhdVLAAdUHU4a-wx0ybAs69JAR06lk"
                    alt="Professional meeting"
                    className="w-full h-full object-cover grayscale brightness-75"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-yellow-500 text-xl">
                  stars
                </span>
                <span className="text-sm font-medium text-slate-300">
                  Platinum Tier Rewards
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-primary text-xl">
                  verified_user
                </span>
                <span className="text-sm font-medium text-slate-300">
                  Verified Professional Network
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="md:w-7/12 p-8 md:p-14 bg-white dark:bg-slate-900">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-2">Set New Password</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-2">
                Enter the OTP code sent to{" "}
                <span className="font-semibold text-brand-primary">
                  {otpData?.email}
                </span>
              </p>
              <p className="text-slate-500 dark:text-slate-400 mb-10">
                Then create a new, strong password for your account.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                <FormField label="OTP Code" error={errors.otp}>
                  <Input
                    icon="pin"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={formData.otp}
                    onChange={(e) =>
                      handleChange("otp")(
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    error={!!errors.otp}
                    maxLength={6}
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="New Password" error={errors.password}>
                    <Input
                      icon="lock"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleChange("password")(e.target.value)}
                      error={!!errors.password}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="material-symbols-outlined text-slate-400 text-lg hover:text-slate-600"
                        >
                          {showPassword ? "visibility" : "visibility_off"}
                        </button>
                      }
                    />
                  </FormField>

                  <FormField
                    label="Confirm Password"
                    error={errors.confirmPassword}
                  >
                    <Input
                      icon="lock"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
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
                          className="material-symbols-outlined text-slate-400 text-lg hover:text-slate-600"
                        >
                          {showConfirmPassword
                            ? "visibility"
                            : "visibility_off"}
                        </button>
                      }
                    />
                  </FormField>
                </div>

                <PasswordRequirements
                  minLength={requirements.minLength}
                  hasUpperCase={requirements.hasUpperCase}
                  hasSpecialChar={requirements.hasSpecialChar}
                  hasNumber={requirements.hasNumber}
                />

                <Button
                  type="submit"
                  icon="published_with_changes"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>

              <div className="mt-10 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-brand-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    arrow_back
                  </span>
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center pb-8">
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <Link
              to="#"
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="#"
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Help Center
            </Link>
          </div>
        </footer>
      </main>
    </AuthLayout>
  );
}
