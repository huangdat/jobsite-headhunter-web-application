import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/shared/components";
import type { UserRole, RegisterFormData } from "../types";
import { sendOtpSignup } from "../services/authApi";
import { toast } from "sonner";

import { StepIndicator } from "./StepIndicator";
import { AccountStep } from "./AccountStep";
import { PersonalStep } from "./PersonalStep";
import { CandidateDetailsStep } from "./CandidateDetailsStep";
import { HeadhunterDetailsStep } from "./HeadhunterDetailsStep";
import { CollaboratorDetailsStep } from "./CollaboratorDetailsStep";

import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";

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
    username: "",
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    taxCode: "",
    password: "",
    confirmPassword: "",
    gender: "" as "MALE" | "FEMALE" | "OTHER" | "",
    avatar: undefined as File | undefined,
    // Headhunter optional fields
    websiteUrl: "",
    addressMain: "",
    companyScale: "",
    // Collaborator optional fields
    commissionRate: undefined as number | undefined,
    // Candidate optional fields
    currentTitle: "",
    yearsOfExperience: undefined as number | undefined,
    expectedSalaryMin: undefined as number | undefined,
    expectedSalaryMax: undefined as number | undefined,
    bio: "",
    city: "",
    openForWork: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Password requirements validation
  const passwordRequirements = {
    minLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
  };

  const steps = [
    { number: 1, title: "Account", description: "Login credentials" },
    { number: 2, title: "Personal", description: "Your information" },
    { number: 3, title: "Details", description: "Additional info" },
  ];

  // Check if user is already logged in
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    // Step 1: Account Information
    if (step === 1) {
      // Username validation
      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
      } else if (
        formData.username.length < 8 ||
        formData.username.length > 32
      ) {
        newErrors.username = "Username must be between 8 and 32 characters";
      } else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(formData.username)) {
        newErrors.username =
          "Username must start with a letter and contain only letters, numbers, and underscores";
      }

      // Email validation
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      // Password validation
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (!Object.values(passwordRequirements).every(Boolean)) {
        newErrors.password = "Password does not meet requirements";
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    // Step 2: Personal Information
    if (step === 2) {
      // Full name validation
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      } else if (formData.fullName.trim().length < 2) {
        newErrors.fullName = "Full name must be at least 2 characters";
      }

      // Phone validation
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^[0-9]{10,15}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
        newErrors.phone = "Please enter a valid phone number (10-15 digits)";
      }
    }

    // Step 3: Role-specific Information
    if (step === 3) {
      // Headhunter specific validation
      if (userRole === "headhunter") {
        if (!formData.companyName.trim()) {
          newErrors.companyName = "Company name is required";
        }
        if (!formData.taxCode.trim()) {
          newErrors.taxCode = "Tax code is required";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = (): boolean => {
    // Validate all steps
    return validateStep(1) && validateStep(2) && validateStep(3);
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    } else {
      toast.error("Please fix the errors before continuing");
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleChange =
    (field: string) =>
    (value: string | boolean | File | null | number | undefined) => {
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

    if (currentStep < steps.length) {
      if (validateStep(currentStep)) {
        setCurrentStep((prev) => prev + 1);
      } else {
        toast.error("Please fix the errors before continuing");
      }
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Build type-safe register data based on role
      let registerData: RegisterFormData;

      if (userRole === "headhunter") {
        registerData = {
          role: "headhunter" as const,
          username: formData.username,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          gender: formData.gender || undefined,
          avatar: formData.avatar,
          agreeToTerms: true,
          companyName: formData.companyName,
          taxCode: formData.taxCode,
          // Optional fields
          websiteUrl: formData.websiteUrl || undefined,
          addressMain: formData.addressMain || undefined,
          companyScale: formData.companyScale || undefined,
        };
      } else if (userRole === "collaborator") {
        registerData = {
          role: "collaborator" as const,
          username: formData.username,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          gender: formData.gender || undefined,
          avatar: formData.avatar,
          agreeToTerms: true,
          // Optional fields
          commissionRate: formData.commissionRate,
        };
      } else {
        registerData = {
          role: "candidate" as const,
          username: formData.username,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          gender: formData.gender || undefined,
          avatar: formData.avatar,
          agreeToTerms: true,
          // Optional fields
          currentTitle: formData.currentTitle || undefined,
          yearsOfExperience: formData.yearsOfExperience,
          expectedSalaryMin: formData.expectedSalaryMin,
          expectedSalaryMax: formData.expectedSalaryMax,
          bio: formData.bio || undefined,
          city: formData.city || undefined,
          openForWork: formData.openForWork,
        };
      }

      // Save registration data to sessionStorage (for use after OTP verification)
      // Note: Avatar file cannot be serialized, need special handling
      const dataToStore = {
        ...registerData,
        avatar: undefined, // Will handle avatar separately
      };
      sessionStorage.setItem(
        "pendingRegistration",
        JSON.stringify(dataToStore),
      );

      // If avatar exists, convert to base64 for storage
      if (formData.avatar) {
        const reader = new FileReader();
        reader.onloadend = () => {
          sessionStorage.setItem(
            "pendingRegistrationAvatar",
            reader.result as string,
          );
        };
        reader.readAsDataURL(formData.avatar);
      }

      // Send OTP to email
      const otpResponse = await sendOtpSignup({
        email: formData.email,
        tokenType: "SIGN_UP",
      });

      toast.success("OTP has been sent to your email!");

      // Redirect to OTP verification page
      navigate("/verify-otp", {
        state: {
          accountId: otpResponse.accountId,
          email: otpResponse.email,
          expiresAt: otpResponse.expiresAt,
        },
      });
    } catch (error: unknown) {
      // Extract error details from response
      let errorMessage = "Failed to send OTP. Please try again.";
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

      console.error("OTP send error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout ctaButton={{ to: "/login", label: "Sign In" }}>
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
        <div className="p-6">
          <h2 className="text-3xl font-bold">{config.title}</h2>

          <p className="text-gray-500 mb-3">{config.subtitle}</p>

          {/* Step Indicator */}
          <StepIndicator steps={steps} currentStep={currentStep} />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <AccountStep
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                setShowPassword={setShowPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                passwordRequirements={passwordRequirements}
              />
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <PersonalStep
                formData={formData}
                errors={errors}
                handleChange={handleChange}
              />
            )}

            {/* Step 3: Role-Specific Details */}
            {currentStep === 3 && (
              <>
                {userRole === "candidate" && (
                  <CandidateDetailsStep
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                  />
                )}

                {userRole === "headhunter" && (
                  <HeadhunterDetailsStep
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                  />
                )}

                {userRole === "collaborator" && (
                  <CollaboratorDetailsStep
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                  />
                )}
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={handlePrevStep}
                  variant="outline"
                  size="xl"
                  className="flex-1 flex justify-center gap-2 border border-lime-500 text-black bg-transparent hover:bg-lime-50 cursor-pointer rounded-2xl"
                >
                  <HiOutlineArrowLeft />
                  Previous
                </Button>
              )}

              {currentStep < steps.length ? (
                <Button
                  variant="primary"
                  size="xl"
                  type="submit"
                  className="flex-1 flex justify-center gap-2 cursor-pointer"
                >
                  Next
                  <HiOutlineArrowRight />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="xl"
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                  <HiOutlineArrowRight />
                </Button>
              )}
            </div>
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
