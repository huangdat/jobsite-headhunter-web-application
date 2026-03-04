import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input, FormField } from "@/shared/ui";
import type { UserRole } from "../types";

interface RegisterFormProps {
  role?: string;
}

const getRoleConfig = (role: UserRole) => {
  const configs = {
    candidate: {
      icon: "person_search",
      title: "Create Candidate Account",
      subtitle: "Take the next step in your career journey.",
      benefits: [
        { icon: "verified_user", text: "Direct Access to Decision Makers" },
        { icon: "workspace_premium", text: "Premium Career Opportunities" },
      ],
    },
    collaborator: {
      icon: "trending_up",
      title: "Create Collaborator Account",
      subtitle: "Start your journey as a strategic referral partner today.",
      benefits: [
        { icon: "stars", text: "High-Commission Rewards" },
        { icon: "verified_user", text: "Exclusive Talent Network" },
      ],
    },
    headhunter: {
      icon: "trending_up",
      title: "Create Headhunter Account",
      subtitle: "Start your journey as a strategic referral partner today.",
      benefits: [
        { icon: "stars", text: "Platinum Tier Rewards" },
        { icon: "verified_user", text: "Verified Professional Network" },
      ],
    },
  };
  return configs[role];
};

export function RegisterForm({ role = "candidate" }: RegisterFormProps) {
  const userRole = role as UserRole;
  const config = getRoleConfig(userRole);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    taxCode: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string) => (value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    // Add validation logic
    console.log("Registration attempt:", { ...formData, role: userRole });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 dark:bg-slate-950">
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
            to="/login"
            className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-2 rounded-full text-sm font-semibold"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="w-full bg-white dark:bg-slate-900 rounded-4xl overflow-hidden flex flex-col md:flex-row shadow-xl border border-slate-100 dark:border-slate-800">
          {/* Left Panel */}
          <div className="md:w-5/12 bg-linear-to-br from-[#0A1F16] to-[#050D0A] p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-white relative overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none radial-dot-pattern"></div>

            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                <span className="material-symbols-outlined text-[#39FF14]">
                  {config.icon}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Unlock Your <br />
                <span className="text-[#39FF14]">Earning Potential</span>
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed max-w-sm mb-12">
                {userRole === "candidate"
                  ? "Connect with top companies and get rewarded for your skills. Join our elite network of professional candidates today."
                  : "Join our exclusive network of professional partners. Refer top talent and earn competitive rewards for every successful placement."}
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
                    Join 5,000+{" "}
                    {userRole === "candidate"
                      ? "Candidates"
                      : userRole === "headhunter"
                        ? "Headhunters"
                        : "Collaborators"}
                  </span>
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-video">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz_qmyk466XBK6tnSpzCfNeX1MGRUor1hkZ5YNJtfB-1DtZNr0-2QSWKDHAsWjXLJ8LCLxc0wJiRaVYSgio1IIExn-eCkTLqxgTm1Ked8Zke4BEL-RMq_i0rtCYLBWriZd0JbJ7zks9e_NJzm_fqATytYOs-mUm2joMW5jC0D7Ee064Q0npbzhvtPuGfQMBqigNYsFgQhSDZgLvPvNv37J9FtQIKOdCfvvs2fFHbH8nZxu0nhdVLAAdUHU4a-wx0ybAs69JAR06lk"
                    alt="Team collaboration"
                    className="w-full h-full object-cover grayscale brightness-75"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12 flex flex-col gap-4">
              {config.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-xl ${
                      benefit.icon === "stars"
                        ? "text-yellow-500"
                        : "text-[#39FF14]"
                    }`}
                  >
                    {benefit.icon}
                  </span>
                  <span className="text-sm font-medium text-slate-300">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="md:w-7/12 p-6 sm:p-8 lg:p-10 bg-white dark:bg-slate-900">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold mb-2">{config.title}</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                {config.subtitle}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <FormField label="Full Name" error={errors.fullName}>
                  <Input
                    icon="person"
                    type="text"
                    placeholder={
                      userRole === "candidate" ? "Jane Cooper" : "Johnathan Doe"
                    }
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName")(e.target.value)}
                    error={!!errors.fullName}
                  />
                </FormField>

                <FormField label="Work Email" error={errors.email}>
                  <Input
                    icon="email"
                    type="email"
                    placeholder={
                      userRole === "candidate"
                        ? "jane@company.com"
                        : "john@company.com"
                    }
                    value={formData.email}
                    onChange={(e) => handleChange("email")(e.target.value)}
                    error={!!errors.email}
                  />
                </FormField>

                {userRole === "headhunter" && (
                  <FormField label="Company Name" error={errors.companyName}>
                    <Input
                      icon="business"
                      type="text"
                      placeholder="Enterprise Inc."
                      value={formData.companyName}
                      onChange={(e) =>
                        handleChange("companyName")(e.target.value)
                      }
                      error={!!errors.companyName}
                    />
                  </FormField>
                )}

                <div
                  className={
                    userRole === "headhunter"
                      ? "grid grid-cols-1 md:grid-cols-2 gap-5"
                      : ""
                  }
                >
                  <FormField label="Phone Number" error={errors.phone}>
                    <Input
                      icon="call"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone")(e.target.value)}
                      error={!!errors.phone}
                    />
                  </FormField>

                  {userRole === "headhunter" && (
                    <FormField label="Tax Code (MST)" error={errors.taxCode}>
                      <Input
                        icon="tag"
                        type="text"
                        placeholder="0123456789"
                        value={formData.taxCode}
                        onChange={(e) =>
                          handleChange("taxCode")(e.target.value)
                        }
                        error={!!errors.taxCode}
                      />
                    </FormField>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="Password" error={errors.password}>
                    <Input
                      icon="lock"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
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
                      icon="lock_reset"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••••••"
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

                <div className="flex items-start gap-3 py-2">
                  <div className="mt-0.5">
                    <input
                      id="terms"
                      type="checkbox"
                      className="w-4 h-4 rounded text-[#39FF14] focus:ring-[#39FF14]/20 border-slate-300 dark:bg-slate-800 dark:border-slate-700"
                      checked={formData.agreeToTerms}
                      onChange={(e) =>
                        handleChange("agreeToTerms")(e.target.checked)
                      }
                    />
                  </div>
                  <label
                    htmlFor="terms"
                    className="text-xs text-slate-500 dark:text-slate-400 leading-normal"
                  >
                    I agree to the{" "}
                    <Link
                      to="#"
                      className="text-slate-900 dark:text-slate-200 font-bold hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="#"
                      className="text-slate-900 dark:text-slate-200 font-bold hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>

                <Button type="submit" icon="person_add">
                  Register Account
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-4 text-slate-500">
                    Or sign in with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <Button variant="social">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhjLuaY45yLfcaVt7AdF5EzYffLkOi9xrX6Kp4riUC_gX6ulnmQHY1ulFMvidyMYKB4VBYWTIZ4ZHwPDIhxD9ILREPjMyEfHALHP3j9i6SZErcia74LMwcORE6H495G6BCSyZ0y8j79Wa5nkZuHoWwzGIF7jKjFnEMv5vAyZwCbk6qcBhpcLlhYcdFY4aeAgeLOGFylz_0wFhc52JqMBSq0IlBlqrtuf0rpcELHUD1G-KgdSxqpNOo8Kf5ZuiCkh1Ns2hvhQqJzqI"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <span>Google</span>
                </Button>
                <Button variant="social">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfQ_M6946U_kbMwus3sL8tlI71mLm9x8Jo4zvVgO_lhmQBduNHcnYulqDpFXJRRclI5Ds78ibSTXtV1_gVbaFVmz6Lann3JxXzVSHmnLe8-ZZRemblWcw2pr0uiK41OCznRbQBCTpMgQZsFReJl2e9o-MoqoA_dTTx0N3YmP_pCw50gweia385qIHDtMcTCn_B7aDMG92oyxxLR_2OQaWukoAuDkBHqk1hvYba350izouDMnjZTwvSSxF5_gBzYezPjK3TtZwwlqY"
                    alt="LinkedIn"
                    className="w-5 h-5"
                  />
                  <span>LinkedIn</span>
                </Button>
              </div>

              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#39FF14] font-bold hover:underline"
                >
                  Sign in here
                </Link>
              </p>
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
