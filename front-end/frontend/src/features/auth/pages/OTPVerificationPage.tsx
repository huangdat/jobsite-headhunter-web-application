import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthTranslation } from "@/shared/hooks";
import {
  sendOtpSignup,
  verifyOtpSignup,
  register,
} from "@/features/auth/services/authApi";
import { toast } from "sonner";
import { MdOutlineMail, MdTimer } from "react-icons/md";
import type { RegisterFormData } from "@/features/auth/types";
import { extractApiErrorMessage } from "@/features/auth/utils/apiError";
import { AuthLayout } from "@/shared/components";
import { Button } from "@/components/ui/button";

interface LocationState {
  accountId: string;
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

  useEffect(() => {
    if (otp.join("").length === 6 && !isLoading) {
      const timer = setTimeout(async () => {
        const otpCode = otp.join("");

        if (otpCode.length !== 6) {
          toast.error(t("validation.enterAllDigits"));
          return;
        }

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

          const registrationDataStr = sessionStorage.getItem(
            "pendingRegistration"
          );
          if (!registrationDataStr) {
            throw new Error(t("messages.registrationDataNotFound"));
          }

          const registrationData = JSON.parse(
            registrationDataStr
          ) as RegisterFormData;

          const avatarBase64 = sessionStorage.getItem(
            "pendingRegistrationAvatar"
          );
          if (avatarBase64) {
            const response = await fetch(avatarBase64);
            const blob = await response.blob();
            const file = new File([blob], "avatar.jpg", { type: blob.type });
            registrationData.avatar = file;
          }

          await register(registrationData);

          sessionStorage.removeItem("pendingRegistration");
          sessionStorage.removeItem("pendingRegistrationAvatar");

          setTimeout(() => {
            navigate("/login", {
              state: {
                email: registrationData.username,
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
        } finally {
          setIsLoading(false);
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [otp, isLoading, state, t, navigate]);

  if (!state) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    // eslint-disable-next-line security/detect-object-injection
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // eslint-disable-next-line security/detect-object-injection
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

    try {
      await sendOtpSignup({
        email: state.email,
        tokenType: "SIGN_UP",
        accountId: state.accountId,
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
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            {t("pages.otpVerification.title")}
          </h1>
          <p className="text-slate-600 mt-2">
            {t("pages.otpVerification.subtitle")}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
            <MdOutlineMail className="text-emerald-600" size={18} />
            <span className="font-medium">{state.email}</span>
          </div>

          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  // eslint-disable-next-line security/detect-object-injection
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-semibold border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                autoFocus={index === 0}
                aria-label={t("pages.otpVerification.otpDigit", {
                  digit: index + 1,
                })}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-sm">
            <MdTimer
              className={timeLeft <= 60 ? "text-red-600" : "text-slate-500"}
              size={18}
            />
            <span
              className={
                timeLeft <= 60 ? "text-red-600 font-semibold" : "text-slate-600"
              }
            >
              {t("pages.otpVerification.codeExpiresIn")} {formatTime(timeLeft)}
            </span>
          </div>

          <Button
            onClick={() => {
              const otpCode = otp.join("");
              if (otpCode.length === 6) {
                setIsLoading(true);
                verifyOtpSignup({
                  accountId: state.accountId,
                  email: state.email,
                  code: otpCode,
                  tokenType: "SIGN_UP",
                })
                  .then(() => {
                    setIsLoading(false);
                  })
                  .catch((error) => {
                    toast.error(
                      extractApiErrorMessage(
                        error,
                        t("messages.registrationFailed")
                      )
                    );
                    setIsLoading(false);
                  });
              }
            }}
            disabled={
              isLoading ||
              otp.join("").length !== 6 ||
              otp.join("").length === 6
            }
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || otp.join("").length === 6
              ? t("buttons.connecting")
              : t("pages.otpVerification.verifyEmail")}
          </Button>

          <div className="text-center">
            <p className="text-sm text-slate-600 mb-2">
              {t("pages.otpVerification.didNotReceiveCode")}
            </p>
            <button
              onClick={handleResend}
              disabled={isLoading || isResending || timeLeft > 240}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed underline"
            >
              {isResending
                ? t("buttons.sendingOtp")
                : t("pages.otpVerification.resendCode")}
            </button>
            {timeLeft > 240 && (
              <p className="text-xs text-slate-500 mt-1">
                {t("pages.otpVerification.availableIn")}{" "}
                {formatTime(timeLeft - 240)}
              </p>
            )}
          </div>

          <div className="text-center pt-4 border-t">
            <button
              onClick={() => navigate("/select-role")}
              disabled={isLoading || isResending}
              className="text-sm text-slate-600 hover:text-slate-800"
            >
              {t("buttons.backToRegistration")}
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
