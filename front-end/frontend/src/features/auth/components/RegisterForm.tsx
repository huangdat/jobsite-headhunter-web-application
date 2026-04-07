import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/shared/components";
import { useAuthTranslation } from "@/shared/hooks";
import { useAppForm } from "@/shared/hooks/useAppForm";
import { useDebounce } from "@/shared/hooks/useDebounce";
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
    commissionRate: 0,
    currentTitle: "",
    yearsOfExperience: 0,
    expectedSalaryMin: 0,
    expectedSalaryMax: 0,
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

  const { watch, trigger, setError, clearErrors } = form;
  const watchEmail = watch("email");
  const watchUsername = watch("username");

  // Debounce email and username to stabilize dependencies
  const debouncedEmail = useDebounce(watchEmail, 500);
  const debouncedUsername = useDebounce(watchUsername, 500);

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
    if (!debouncedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(debouncedEmail)) {
      return;
    }

    const checkEmail = async () => {
      setIsCheckingDuplicate(true);
      try {
        const exists = await checkEmailUsernameExist(debouncedEmail);
        if (exists) {
          setError("email", {
            type: "custom",
            message: t("validation.emailExists"),
          });
        } else {
          // Clear error if email is valid and doesn't exist
          clearErrors("email");
        }
      } catch {
        setError("email", {
          type: "custom",
          message: t("validation.emailCheckFailed"),
        });
      } finally {
        setIsCheckingDuplicate(false);
      }
    };

    checkEmail();
    // Only depend on debouncedEmail - prevents infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedEmail]);

  // Async validation for username uniqueness
  useEffect(() => {
    if (
      !debouncedUsername ||
      debouncedUsername.length < 8 ||
      !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(debouncedUsername)
    ) {
      return;
    }

    const checkUsername = async () => {
      setIsCheckingDuplicate(true);
      try {
        const exists = await checkEmailUsernameExist(
          undefined,
          debouncedUsername
        );
        if (exists) {
          setError("username", {
            type: "custom",
            message: t("validation.usernameExists"),
          });
        } else {
          // Clear error if username is valid and doesn't exist
          clearErrors("username");
        }
      } catch {
        setError("username", {
          type: "custom",
          message: t("validation.usernameCheckFailed"),
        });
      } finally {
        setIsCheckingDuplicate(false);
      }
    };

    checkUsername();
    // Only depend on debouncedUsername - prevents infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedUsername]);

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
          : ["agreeToTerms"]; // All roles must agree to terms

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
          email: otpResponse.email,
          expiresAt: otpResponse.expiresAt,
        },
      });
    } catch (error: unknown) {
      console.error("Registration error:", error);
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

          <form
            onSubmit={form.handleSubmit(
              (data) => {
                console.log("Form values are valid. Starting submission:", data);
                onSubmit(data);
              },
              (errors) => {
                console.error("Form validation errors:", errors);
              }
            )}
            className="space-y-6"
          >
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

                {/* Terms & Conditions Checkbox */}
                <div className="border-t border-slate-200 pt-6">
                  <div className="flex items-start gap-3">
                    <input
                      {...form.register("agreeToTerms")}
                      type="checkbox"
                      id="agreeToTerms"
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                    />
                    <label
                      htmlFor="agreeToTerms"
                      className="text-sm text-slate-700 leading-relaxed cursor-pointer flex-1"
                    >
                      {t("form.register.agreeToTerms")}{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-primary hover:underline font-medium"
                      >
                        {t("form.register.termsOfService")}
                      </a>
                    </label>
                  </div>
                  {form.getError("agreeToTerms") && (
                    <p className={`text-xs mt-2 ${getSemanticClass('danger', 'text', true)}`}>
                      {typeof form.getError("agreeToTerms") === "string"
                        ? form.getError("agreeToTerms")
                        : (
                            form.getError("agreeToTerms") as {
                              message?: string;
                            }
                          )?.message}
                    </p>
                  )}
                </div>
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
