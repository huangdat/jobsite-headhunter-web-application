import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/shared/components";
import type { UserRole } from "../types";
import { register } from "../services/authApi";

import { CandidateRegister } from "./CandidateRegister";
import { CollaboratorRegister } from "./CollaboratorRegister";
import { HeadhunterRegister } from "./HeadhunterRegister";

import { HiOutlineArrowRight } from "react-icons/hi";

interface RegisterFormProps {
  role?: string;
}

const getRoleConfig = (role: UserRole) => {
  const configs = {
    candidate: {
      title: "Create Candidate Account",
      subtitle: "Start your career journey with top companies.",
    },
    collaborator: {
      title: "Create Collaborator Account",
      subtitle: "Refer top talent and earn commission.",
    },
    headhunter: {
      title: "Create Headhunter Account",
      subtitle: "Join our professional recruitment network.",
    },
  };

  return configs[role];
};

export function RegisterForm({ role = "candidate" }: RegisterFormProps) {
  const userRole = role as UserRole;
  const config = getRoleConfig(userRole);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    taxCode: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string) => (value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const registerData: any = {
        role: userRole,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreeToTerms: true,
      };

      // Add headhunter specific fields
      if (userRole === "headhunter") {
        registerData.companyName = formData.companyName;
        registerData.taxCode = formData.taxCode;
      }

      const result = await register(registerData);

      // Save token and redirect
      localStorage.setItem("accessToken", result.accessToken);
      navigate("/login");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrors({
        submit: err.response?.data?.message || "Registration failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      navLinks={[{ to: "#", label: "Home" }]}
      ctaButton={{ to: "/login", label: "Sign In" }}
    >
        <div className="w-full max-w-5xl min-h-125 bg-white rounded-3xl shadow-xl grid md:grid-cols-2 overflow-hidden">
          {/* LEFT PANEL */}
          <div className="bg-linear-to-br from-dark-panel-from to-dark-panel-to text-white p-10 flex flex-col justify-center">
            <h1 className="text-5xl font-bold leading-tight">
              Join Our <br />
              <span className="text-lime-400">Professional</span> <br />
              Network
            </h1>

            <p className="text-gray-300 mt-1">
              Create your account and start earning opportunities today.
            </p>
          </div>

          {/* RIGHT PANEL */}
          <div className="p-6 overflow-y-auto">
            <h2 className="text-3xl font-bold">{config.title}</h2>

            <p className="text-gray-500 mb-3">{config.subtitle}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {userRole === "candidate" && (
                <CandidateRegister
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  showPassword={showPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowPassword={setShowPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                />
              )}

              {userRole === "collaborator" && (
                <CollaboratorRegister
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  showPassword={showPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowPassword={setShowPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                />
              )}

              {userRole === "headhunter" && (
                <HeadhunterRegister
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  showPassword={showPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowPassword={setShowPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                />
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center gap-2 cursor-pointer"
              >
                <HiOutlineArrowRight />
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-3">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-lime-500 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
    </AuthLayout>
  );
}
