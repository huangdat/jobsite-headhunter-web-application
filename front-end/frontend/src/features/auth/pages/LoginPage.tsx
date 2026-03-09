import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, AuthLayout, SocialLoginButtons } from "@/shared/components";
import { AnimatedCheckbox } from "../components/AnimatedCheckbox";
import { useLogin } from "../hooks";
import { toast } from "sonner";

import { MdAccountCircle, MdLockOutline } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { HiOutlineArrowRight } from "react-icons/hi";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    formData,
    errors,
    isLoading,
    handleSubmit,
    handleChange,
    loadRememberedEmail,
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  // Handle state from registration redirect
  useEffect(() => {
    const state = location.state as { email?: string; message?: string } | null;
    
    if (state?.email) {
      // Pre-fill username/email from registration (field name is 'email' but can contain username)
      handleChange("email")(state.email);
    }
    
    if (state?.message) {
      // Show success message from registration
      toast.success(state.message);
      
      // Clear state to prevent showing again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, handleChange]);

  // Load remembered login (username or email) on component mount
  useEffect(() => {
    loadRememberedEmail();
  }, [loadRememberedEmail]);

  // Check if user is already logged in
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // User is already authenticated, redirect to home
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <AuthLayout
      navLinks={[{ to: "#", label: "Home" }]}
      ctaButton={{ to: "/select-role", label: "Sign Up" }}
    >
      <div className="w-full max-w-5xl min-h-[calc(600px)] bg-white rounded-3xl shadow-xl grid md:grid-cols-2 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="bg-linear-to-br from-dark-panel-from to-dark-panel-to text-white p-10 flex flex-col justify-center">
          <h1 className="text-5xl font-bold leading-tight">
            Find Talent. <br />
            Earn Rewards.
          </h1>

          <p className="text-gray-300 mt-6">
            Join JobSite’s professional referral network and connect great
            talent with top companies.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-10">
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>

          <p className="text-gray-500 mb-8">
            Enter your credentials to access your account.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(formData);
            }}
            className="space-y-6"
          >
            {/* USERNAME OR EMAIL */}
            <FormField label="Username or Email" error={errors.email}>
              <Input
                icon={<MdAccountCircle />}
                type="text"
                placeholder="john_doe123 or email@company.com"
                value={formData.email}
                onChange={(e) => handleChange("email")(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">
                Enter your username or email address
              </p>
            </FormField>

            {/* PASSWORD */}
            <FormField label="Password" error={errors.password}>
              <Input
                icon={<MdLockOutline />}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange("password")(e.target.value)}
                rightIcon={
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
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

            {/* REMEMBER */}
            <div className="flex justify-between items-center text-sm mt-4">
              <AnimatedCheckbox
                checked={formData.rememberMe ?? false}
                onChange={(value: boolean) => handleChange("rememberMe")(value)}
                label="Remember me"
              />

              <Link to="/forgot-password" className="text-lime-500">
                Forgot password?
              </Link>
            </div>

            {/* SIGN IN */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center gap-2 cursor-pointer"
            >
              <HiOutlineArrowRight />
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            {/* DIVIDER */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-sm text-gray-400">or continue with</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* SOCIAL LOGIN */}
            <SocialLoginButtons
              onGoogleClick={() => console.log("Google login")}
              onLinkedInClick={() => console.log("LinkedIn login")}
            />
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
