import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthTranslation } from "@/shared/hooks";
import { getSemanticClass } from "@/lib/design-tokens";
import { ErrorState } from "@/shared/common-blocks/states/ErrorState";
import {
  sendOtpSignup,
  verifyOtpSignup,
} from "@/features/auth/services/authApi";
import { toast } from "sonner";
import { MdOutlineMail, MdTimer } from "react-icons/md";
import type { RegisterFormData } from "@/features/auth/types";
import { extractApiErrorMessage } from "@/features/auth/utils/apiError";
import { AuthLayout } from "@/shared/common-blocks";
import { Button } from "@/shared/ui-primitives/button";
import {
  SectionTitle,
  BodyText,
  SmallText,
  Caption,
} from "@/shared/common-blocks/typography/Typography";

interface LocationState {
  accountId?: string;
  email: string;
  expiresAt: string;
}

export function OTPVerificationPage() {
  const { t } = useAuthTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!state) {
      navigate("/select-role", { replace: true });
    }
  }, [state, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleVerifyOtp = async (otpCode: string) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const otpResponse = await verifyOtpSignup({
        accountId: state!.accountId,
        email: state!.email,
        code: otpCode,
        tokenType: "SIGN_UP",
      });

      if (otpResponse.status && otpResponse.status !== "OK") {
        throw new Error(
          otpResponse.message || t("messages.otpVerificationFailed")
        );
      }

      toast.success(t("messages.emailVerified"));

      const registrationDataStr = sessionStorage.getItem("pendingRegistration");
      let username = "user";

      if (registrationDataStr) {
        try {
          const registrationData = JSON.parse(
            registrationDataStr
          ) as RegisterFormData;
          username = registrationData.username;
        } catch {
          // Silently ignore parsing errors - optional data
        }
      }

      sessionStorage.removeItem("pendingRegistration");
      sessionStorage.removeItem("pendingRegistrationAvatar");

      setTimeout(() => {
        navigate("/login", {
          state: {
            email: username,
            message: t("messages.registrationCompleted"),
          },
        });
      }, 1500);
    } catch (error: unknown) {
      const errorMessage = extractApiErrorMessage(
        error,
        t("messages.registrationFailed")
      );
      toast.error(errorMessage);
      setGeneralError(errorMessage);

      if (
        errorMessage.includes(t("messages.registrationDataNotFoundGeneric"))
      ) {
        setTimeout(() => {
          navigate("/select-role");
        }, 2000);
      } else {
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const otpCode = otp.join("");
    if (otpCode.length === 6) {
      handleVerifyOtp(otpCode);
    }
  }, [otp]);

  if (!state) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setGeneralError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (!/^\d{6}$/.test(pastedData)) {
      toast.error(t("validation.invalidOtp"));
      return;
    }

    const newOtp = pastedData.split("");
    setOtp(newOtp);
    inputRefs.current[5]?.focus();
  };

  const handleResend = async () => {
    setIsResending(true);
    setGeneralError(null);

    try {
      await sendOtpSignup({
        email: state.email,
        tokenType: "SIGN_UP",
      });

      toast.success(t("messages.otpResent"));
      setTimeLeft(300);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: unknown) {
      const errorMessage = extractApiErrorMessage(
        error,
        t("messages.failedToResendOtp")
      );
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout ctaButton={{ to: "/login", label: t("buttons.signIn") }}>
      <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <SectionTitle>{t("pages.otpVerification.title")}</SectionTitle>
          <BodyText variant="muted" className="mt-2">
            {t("pages.otpVerification.subtitle")}
          </BodyText>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2">
            <MdOutlineMail className="text-brand-primary" size={18} />
            <SmallText weight="medium">{state.email}</SmallText>
          </div>

          {generalError && (
            <ErrorState
              variant="card"
              title={
                t("pages.otpVerification.verificationFailed") ||
                "Xác thực thất bại"
              }
              message={generalError}
              className={`mb-4 ${getSemanticClass("danger", "bg", true)} border ${getSemanticClass("danger", "border", true)}`}
            />
          )}

          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={isLoading}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-semibold border-2 border-slate-300 
                dark:border-slate-600 rounded-lg focus:border-brand-primary focus:outline-none 
                focus:ring-2 focus:ring-brand-primary/20 dark:focus:ring-brand-primary/30 
                transition-all dark:bg-slate-800 dark:text-white disabled:opacity-50"
                autoFocus={index === 0}
                aria-label={t("pages.otpVerification.otpDigit", {
                  digit: index + 1,
                })}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-sm">
            <MdTimer
              className={
                timeLeft <= 60
                  ? getSemanticClass("danger", "icon", true)
                  : "text-slate-500 dark:text-slate-400"
              }
              size={18}
            />
            <span
              className={
                timeLeft <= 60
                  ? `${getSemanticClass("danger", "text", true)} font-semibold`
                  : "text-slate-600 dark:text-slate-400"
              }
            >
              {t("pages.otpVerification.codeExpiresIn")} {formatTime(timeLeft)}
            </span>
          </div>

          <Button
            onClick={() => {
              const otpCode = otp.join("");
              if (otpCode.length === 6) {
                handleVerifyOtp(otpCode);
              }
            }}
            disabled={isLoading || otp.join("").length !== 6}
            variant="brand-primary"
            size="xl"
            className="w-full disabled:opacity-50"
          >
            {isLoading
              ? t("buttons.connecting")
              : t("pages.otpVerification.verifyEmail")}
          </Button>

          <div className="text-center">
            <SmallText variant="muted" className="mb-2">
              {t("pages.otpVerification.didNotReceiveCode")}
            </SmallText>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-brand-primary hover:text-brand-hover font-medium disabled:opacity-50"
              onClick={handleResend}
              disabled={isLoading || isResending || timeLeft > 240}
            >
              {isResending
                ? t("buttons.sendingOtp")
                : t("pages.otpVerification.resendCode")}
            </Button>
            {timeLeft > 240 && (
              <Caption className="mt-1">
                {t("pages.otpVerification.availableIn")}{" "}
                {formatTime(timeLeft - 240)}
              </Caption>
            )}
          </div>

          <div className="text-center pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-slate-600 hover:text-slate-800 font-medium"
              onClick={() => navigate("/select-role")}
              disabled={isLoading || isResending}
            >
              {t("buttons.backToRegistration")}
            </Button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}


