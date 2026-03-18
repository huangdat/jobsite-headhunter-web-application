import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/shared/components";
import { useAppTranslation } from "@/shared/hooks";
import { useAppForm } from "@/shared/hooks/useAppForm";
import type { UserRole, RegisterFormData } from "../types";
import { sendOtpSignup, checkEmailUsernameExist } from "../services/authApi";
import { toast } from "sonner";
import { useAuth } from "../context/useAuth";
import { extractApiErrorMessage } from "../utils/apiError";
import { createSchemaWithI18n } from "../utils/registerFormSchema";

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

const isValidRole = (role: string): role is UserRole => {
  return ["candidate", "collaborator", "headhunter"].includes(role);
};

const getRoleConfig = (role: UserRole) => {
  const configs = {
    candidate: {
      title: (t: ReturnType<typeof useAppTranslation>["t"]) => t("auth.pages.register.candidate.title"),
      subtitle: (t: ReturnType<typeof useAppTranslation>["t"]) => t("auth.pages.register.candidate.subtitle"),
    },
    collaborator: {
      title: (t: ReturnType<typeof useAppTranslation>["t"]) => t("auth.pages.register.collaborator.title"),
      subtitle: (t: ReturnType<typeof useAppTranslation>["t"]) => t("auth.pages.register.collaborator.subtitle"),
    },
    headhunter: {
      title: (t: ReturnType<typeof useAppTranslation>["t"]) => t("auth.pages.register.headhunter.title"),
      subtitle: (t: ReturnType<typeof useAppTranslation>["t"]) => t("auth.pages.register.headhunter.subtitle"),
    },
  };
  return configs[role];
};

export function RegisterForm({ role = "candidate" }: RegisterFormProps) {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, isInitializing } = useAuth();

  const userRole: UserRole = isValidRole(role) ? role : "candidate";
  const config = getRoleConfig(userRole);

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  const defaultValues: Partial<RegisterFormData> = {
    role: userRole,
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    gender: undefined,
    avatar: undefined,
    taxCode: "",
    websiteUrl: "",
    companyScale: "",
    commissionRate: undefined,
    currentTitle: "",
    yearsOfExperience: undefined,
    expectedSalaryMin: undefined,
    expectedSalaryMax: undefined,
    bio: "",
    city: "",
    openForWork: false,
    agreeToTerms: false,
  };

  // Create schema with i18n messages
  const getSchema = useMemo(() => createSchemaWithI18n(t), [t]);

  const form = useAppForm<RegisterFormData>({
    resolver: yupResolver(getSchema(userRole) as any),
    defaultValues,
  });

  const { handleSubmit, watch, trigger, setError } = form;
  const watchEmail = watch("email");
  const watchUsername = watch("username");

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  useEffect(() => {
    if (!isValidRole(role)) {
      navigate("/select-role", { replace: true });
    }
  }, [role, navigate]);

  // Async validation for email uniqueness
  useEffect(() => {
    if (!watchEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchEmail)) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingDuplicate(true);
      try {
        const exists = await checkEmailUsernameExist(watchEmail);
        if (exists) {
          setError("email", {
            type: "custom",
            message: t("auth.validation.emailExists"),
          });
        }
      } catch (error) {
        setError("email", {
          type: "custom",
          message: t("auth.validation.emailCheckFailed"),
        });
      } finally {
        setIsCheckingDuplicate(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [watchEmail, setError, t]);

  // Async validation for username uniqueness
  useEffect(() => {
    if (
      !watchUsername ||
      watchUsername.length < 8 ||
      !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(watchUsername)
    ) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingDuplicate(true);
      try {
        const exists = await checkEmailUsernameExist(undefined, watchUsername);
        if (exists) {
          setError("username", {
            type: "custom",
            message: t("auth.validation.usernameExists"),
          });
        }
      } catch (error) {
        setError("username", {
          type: "custom",
          message: t("auth.validation.usernameCheckFailed"),
        });
      } finally {
        setIsCheckingDuplicate(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [watchUsername, setError, t]);

  const steps = [
    { number: 1, title: t("auth.steps.account.title"), description: t("auth.steps.account.desc") },
    { number: 2, title: t("auth.steps.personal.title"), description: t("auth.steps.personal.desc") },
    { number: 3, title: t("auth.steps.details.title"), description: t("auth.steps.details.desc") },
  ];

  const validateCurrentStep = async (): Promise<boolean> => {
    const fieldsToValidate = 
      currentStep === 1 
        ? ["username", "email", "password", "confirmPassword"]
        : currentStep === 2
        ? ["fullName", "phone"]
        : userRole === "candidate"
        ? ["currentTitle"]
        : userRole === "headhunter"
        ? ["taxCode"]
        : ["commissionRate"];

    const result = await trigger(fieldsToValidate as any);
    return result;
  };

  const handleNextStep = async () => {
    if (await validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    } else {
      toast.error(t("auth.validation.fixErrors"));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: RegisterFormData) => {
    // Validate final step
    if (currentStep !== steps.length) {
      await handleNextStep();
      return;
    }

    if (isCheckingDuplicate) {
      toast.error(t("auth.validation.waitForValidation"));
      return;
    }

    try {
      // Save registration data to sessionStorage
      const dataToStore = { ...data, avatar: undefined };
      sessionStorage.setItem("pendingRegistration", JSON.stringify(dataToStore));

      if (data.avatar) {
        const reader = new FileReader();
        reader.onloadend = () => {
          sessionStorage.setItem(
            "pendingRegistrationAvatar",
            reader.result as string
          );
        };
        reader.readAsDataURL(data.avatar);
      }

      // Send OTP
      const otpResponse = await Promise.race([
        sendOtpSignup({ email: data.email, tokenType: "SIGN_UP" }),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error("Request timed out after 15s")),
            15000
          )
        ),
      ]);

      toast.success(t("auth.messages.otpSent"));

      navigate("/verify-otp", {
        state: {
          accountId: otpResponse.accountId,
          email: otpResponse.email,
          expiresAt: otpResponse.expiresAt,
        },
      });
    } catch (error: unknown) {
      const errorMessage = extractApiErrorMessage(
        error,
        t("auth.messages.failedToSendOtp")
      );
      toast.error(errorMessage);
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <AuthLayout ctaButton={{ to: "/login", label: t("auth.form.register.signIn") }}>
      <div className="w-full max-w-5xl min-h-125 bg-white rounded-3xl shadow-xl grid md:grid-cols-2 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="bg-linear-to-br from-dark-panel-from to-dark-panel-to text-white p-10 flex flex-col justify-center">
          <h1 className="text-5xl font-bold leading-tight">
            {t("auth.form.register.joinNetwork")} <br />
            <span className="text-lime-400">{t("auth.form.register.professional")}</span> <br />
            Network
          </h1>
          <p className="text-gray-300 mt-1">
            {t("auth.pages.register.subtitle")}
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-6">
          <h2 className="text-3xl font-bold">{config.title(t)}</h2>
          <p className="text-gray-500 mb-3">{config.subtitle(t)}</p>

          <StepIndicator steps={steps} currentStep={currentStep} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <AccountStep
                form={form}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                setShowPassword={setShowPassword}
                setShowConfirmPassword={setShowConfirmPassword}
              />
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && <PersonalStep form={form} />}

            {/* Step 3: Role-Specific Details */}
            {currentStep === 3 && (
              <>
                {userRole === "candidate" && <CandidateDetailsStep form={form} />}
                {userRole === "headhunter" && <HeadhunterDetailsStep form={form} />}
                {userRole === "collaborator" && (
                  <CollaboratorDetailsStep form={form} />
                )}
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  variant="outline"
                  size="xl"
                  className="flex-1 flex justify-center gap-2 border border-lime-500 text-black bg-transparent hover:bg-lime-50 cursor-pointer rounded-2xl"
                >
                  <HiOutlineArrowLeft />
                  {t("auth.buttons.previous")}
                </Button>
              )}

              {currentStep < steps.length ? (
                <Button
                  variant="primary"
                  size="xl"
                  type="button"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  className="flex-1 flex justify-center gap-2 cursor-pointer"
                >
                  {t("auth.buttons.next")}
                  <HiOutlineArrowRight />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="xl"
                  type="submit"
                  disabled={isSubmitting || isCheckingDuplicate}
                  className="flex-1 flex justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? t("auth.buttons.sendingOtp") : t("auth.buttons.createAccount")}
                  <HiOutlineArrowRight />
                </Button>
              )}
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-3">
            {t("auth.pages.register.haveAccount")}{" "}
            <Link
              to="/login"
              className="text-lime-500 font-semibold hover:underline"
            >
              {t("auth.pages.register.signIn")}
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
