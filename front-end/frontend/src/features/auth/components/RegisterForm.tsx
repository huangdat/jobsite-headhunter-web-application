import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/shared/components";
import { useAuthTranslation } from "@/shared/hooks";
import { useAppForm } from "@/shared/hooks/useAppForm";
import type {
  RegistrationUserRole,
  RegisterFormData,
} from "@/features/auth/types";
import {
  sendOtpSignup,
  checkEmailUsernameExist,
} from "@/features/auth/services/authApi";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/useAuth";
import { extractApiErrorMessage } from "@/features/auth/utils/apiError";
import { createSchemaWithI18n } from "@/features/auth/utils/registerFormSchema";
import { useStepValidation } from "@/features/auth/hooks/useStepValidation";

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

// Validate user role during registration (form uses lowercase for UI)
const isValidRole = (role: string): role is RegistrationUserRole => {
  return ["candidate", "collaborator", "headhunter"].includes(
    role.toLowerCase()
  );
};

const getRoleConfig = (role: RegistrationUserRole) => {
  const configs = {
    candidate: {
      title: (t: ReturnType<typeof useAuthTranslation>["t"]) =>
        t("pages.register.candidate.title"),
      subtitle: (t: ReturnType<typeof useAuthTranslation>["t"]) =>
        t("pages.register.candidate.subtitle"),
    },
    collaborator: {
      title: (t: ReturnType<typeof useAuthTranslation>["t"]) =>
        t("pages.register.collaborator.title"),
      subtitle: (t: ReturnType<typeof useAuthTranslation>["t"]) =>
        t("pages.register.collaborator.subtitle"),
    },
    headhunter: {
      title: (t: ReturnType<typeof useAuthTranslation>["t"]) =>
        t("pages.register.headhunter.title"),
      subtitle: (t: ReturnType<typeof useAuthTranslation>["t"]) =>
        t("pages.register.headhunter.subtitle"),
    },
  };
  // eslint-disable-next-line security/detect-object-injection
  return configs[role];
};

export function RegisterForm({ role = "candidate" }: RegisterFormProps) {
  const { t } = useAuthTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, isInitializing } = useAuth();

  const userRole: RegistrationUserRole = isValidRole(role) ? role : "candidate";
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(getSchema(userRole)) as any,
    defaultValues,
  });

  const { watch, trigger, setError } = form;
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
            message: t("validation.emailExists"),
          });
        }
      } catch {
        setError("email", {
          type: "custom",
          message: t("validation.emailCheckFailed"),
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
            message: t("validation.usernameExists"),
          });
        }
      } catch {
        setError("username", {
          type: "custom",
          message: t("validation.usernameCheckFailed"),
        });
      } finally {
        setIsCheckingDuplicate(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [watchUsername, setError, t]);

  const steps = [
    {
      number: 1,
      title: t("steps.account.title"),
      description: t("steps.account.desc"),
    },
    {
      number: 2,
      title: t("steps.personal.title"),
      description: t("steps.personal.desc"),
    },
    {
      number: 3,
      title: t("steps.details.title"),
      description: t("steps.details.desc"),
    },
  ];

  // Get validation state for current step
  const { isNextButtonDisabled, isSubmitButtonDisabled } = useStepValidation(
    form,
    currentStep,
    userRole,
    isCheckingDuplicate
  );

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

    const result = await trigger(
      fieldsToValidate as unknown as Parameters<typeof trigger>[0]
    );
    return result;
  };

  const handleNextStep = async () => {
    if (await validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    } else {
      toast.error(t("validation.fixErrors"));
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
      toast.error(t("validation.waitForValidation"));
      return;
    }

    try {
      // Save registration data to sessionStorage
      const dataToStore = { ...data, avatar: undefined };
      sessionStorage.setItem(
        "pendingRegistration",
        JSON.stringify(dataToStore)
      );

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
            () => reject(new Error(t("messages.requestTimedOut"))),
            15000
          )
        ),
      ]);

      toast.success(t("messages.otpSent"));

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
        t("messages.failedToSendOtp")
      );
      toast.error(errorMessage);
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <AuthLayout ctaButton={{ to: "/login", label: t("form.register.signIn") }}>
      <div className="w-full max-w-5xl min-h-125 bg-white rounded-3xl shadow-xl grid md:grid-cols-2 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="bg-linear-to-br from-dark-panel-from to-dark-panel-to text-white p-10 flex flex-col justify-center">
          <h1 className="text-5xl font-bold leading-tight">
            {t("form.register.joinNetwork")} <br />
            <span className="text-brand-primary">
              {t("form.register.professional")}
            </span>{" "}
            <br />
            Network
          </h1>
          <p className="text-gray-300 mt-1">{t("pages.register.subtitle")}</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-6">
          <h2 className="text-3xl font-bold">{config.title(t)}</h2>
          <p className="text-gray-500 mb-3">{config.subtitle(t)}</p>

          <StepIndicator steps={steps} currentStep={currentStep} />

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                {userRole === "candidate" && (
                  <CandidateDetailsStep form={form} />
                )}
                {userRole === "headhunter" && (
                  <HeadhunterDetailsStep form={form} />
                )}
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
                  className="flex-1 flex justify-center gap-2 border border-brand-primary text-black bg-transparent hover:bg-brand-primary/10 cursor-pointer rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiOutlineArrowLeft />
                  {t("buttons.previous")}
                </Button>
              )}

              {currentStep < steps.length ? (
                <Button
                  variant="primary"
                  size="xl"
                  type="button"
                  onClick={handleNextStep}
                  disabled={isNextButtonDisabled}
                  className="flex-1 flex justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("buttons.next")}
                  <HiOutlineArrowRight />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="xl"
                  type="submit"
                  disabled={isSubmitButtonDisabled}
                  className="flex-1 flex justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? t("buttons.sendingOtp")
                    : t("buttons.createAccount")}
                  <HiOutlineArrowRight />
                </Button>
              )}
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-3">
            {t("pages.register.haveAccount")}{" "}
            <Link
              to="/login"
              className="text-brand-primary font-semibold hover:underline"
            >
              {t("pages.register.signIn")}
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
