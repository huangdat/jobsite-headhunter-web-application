import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, FormField } from "@/shared/ui";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add validation logic
    if (
      Object.values(requirements).every(Boolean) &&
      formData.password === formData.confirmPassword
    ) {
      console.log("Password reset:", formData);
      navigate("/reset-password/success");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-[#39FF14] p-1.5 rounded-lg">
            <span className="material-symbols-outlined text-black text-lg font-bold">
              handshake
            </span>
          </div>
          <span className="text-xl font-bold tracking-tight">JobSite</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="#"
            className="text-sm font-medium hover:text-[#39FF14] transition-colors"
          >
            Home
          </Link>
          <Link
            to="#"
            className="text-sm font-medium hover:text-[#39FF14] transition-colors"
          >
            How it works
          </Link>
          <Link
            to="#"
            className="text-sm font-medium hover:text-[#39FF14] transition-colors"
          >
            Rewards
          </Link>
          <Link
            to="/select-role"
            className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-2 rounded-full text-sm font-semibold"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white dark:bg-slate-900 rounded-4xl overflow-hidden flex flex-col md:flex-row shadow-xl border border-slate-100 dark:border-slate-800">
          {/* Left Panel */}
          <div className="md:w-5/12 bg-linear-to-br from-[#0A1F16] to-[#050D0A] p-12 flex flex-col justify-between text-white relative overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none radial-dot-pattern"></div>

            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                <span className="material-symbols-outlined text-[#39FF14]">
                  security
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Unlock Your <br />
                <span className="text-[#39FF14]">Earning Potential</span>
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
                <span className="material-symbols-outlined text-[#39FF14] text-xl">
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
              <p className="text-slate-500 dark:text-slate-400 mb-10">
                Create a new, strong password for your account.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
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

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Password Requirements
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <li className="flex items-center gap-2 text-sm text-slate-500">
                      <span
                        className={`material-symbols-outlined text-lg ${
                          requirements.minLength
                            ? "text-[#39FF14]"
                            : "text-slate-300"
                        }`}
                      >
                        {requirements.minLength
                          ? "check_circle"
                          : "radio_button_unchecked"}
                      </span>
                      At least 8 characters
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-500">
                      <span
                        className={`material-symbols-outlined text-lg ${
                          requirements.hasUpperCase
                            ? "text-[#39FF14]"
                            : "text-slate-300"
                        }`}
                      >
                        {requirements.hasUpperCase
                          ? "check_circle"
                          : "radio_button_unchecked"}
                      </span>
                      One uppercase letter
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-500">
                      <span
                        className={`material-symbols-outlined text-lg ${
                          requirements.hasSpecialChar
                            ? "text-[#39FF14]"
                            : "text-slate-300"
                        }`}
                      >
                        {requirements.hasSpecialChar
                          ? "check_circle"
                          : "radio_button_unchecked"}
                      </span>
                      One special character
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-500">
                      <span
                        className={`material-symbols-outlined text-lg ${
                          requirements.hasNumber
                            ? "text-[#39FF14]"
                            : "text-slate-300"
                        }`}
                      >
                        {requirements.hasNumber
                          ? "check_circle"
                          : "radio_button_unchecked"}
                      </span>
                      One numeric digit
                    </li>
                  </ul>
                </div>

                <Button type="submit" icon="published_with_changes">
                  Update Password
                </Button>
              </form>

              <div className="mt-10 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#39FF14] transition-colors"
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
          <p className="text-xs text-slate-400">
            © 2024 ReferralPortal Inc. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
