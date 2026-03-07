import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/shared/components";
import type { UserRole, RegisterFormData } from "../types";
import { register } from "../services/authApi";
import { toast } from "sonner";

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

  // Check if user is already logged in
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10,15}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits)";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Headhunter specific validation
    if (userRole === "headhunter") {
      if (!formData.companyName.trim()) {
        newErrors.companyName = "Company name is required";
      }
      if (!formData.taxCode.trim()) {
        newErrors.taxCode = "Tax code is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string) => (value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      let registerData: RegisterFormData;

      // Build type-safe register data based on role
      if (userRole === "headhunter") {
        registerData = {
          role: "headhunter" as const,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          agreeToTerms: true,
          companyName: formData.companyName,
          taxCode: formData.taxCode,
        };
      } else if (userRole === "collaborator") {
        registerData = {
          role: "collaborator" as const,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          agreeToTerms: true,
        };
      } else {
        registerData = {
          role: "candidate" as const,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          agreeToTerms: true,
        };
      }

      const result = await register(registerData);

      // Save token and redirect
      if (result?.accessToken) {
        localStorage.setItem("accessToken", result.accessToken);
        
        // Success notification
        toast.success("Account created successfully! Welcome aboard.");
        
        // Redirect to home page
        navigate("/");
      }
    } catch (error: unknown) {
      // Extract error details from response
      let errorMessage = "Registration failed. Please try again.";
      let errorField: string | null = null;

      if (
        error instanceof Error &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null
      ) {
        const response = error.response as {
          status?: number;
          data?: { message?: string };
        };

        errorMessage = response.data?.message || errorMessage;

        // Categorize error based on message
        const messageLower = errorMessage.toLowerCase();

        if (messageLower.includes("email")) {
          errorField = "email";
        } else if (messageLower.includes("phone")) {
          errorField = "phone";
        } else if (messageLower.includes("password")) {
          errorField = "password";
        }
      }

      // Error notification
      toast.error(errorMessage);

      // Set form error for the appropriate field
      if (errorField) {
        setErrors({ [errorField]: errorMessage });
      } else {
        setErrors({ submit: errorMessage });
      }

      console.error("Registration error:", error);
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
