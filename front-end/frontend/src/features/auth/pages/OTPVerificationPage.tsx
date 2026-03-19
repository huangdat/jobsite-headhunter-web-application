import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/shared/components";
import { useAuthTranslation } from "@/shared/hooks";
import { sendOtpSignup, verifyOtpSignup, register } from "../services/authApi";
import { toast } from "sonner";
import { MdOutlineMail, MdTimer } from "react-icons/md";
import type { RegisterFormData } from "../types";
import { extractApiErrorMessage } from "../utils/apiError";

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

  // All hooks must be declared before any conditional return (Rules of Hooks)
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no state
  useEffect(() => {
    if (!state) {
      navigate("/select-role", { replace: true });
    }
  }, [state, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Guard: render nothing while redirect is in-flight (must come after all hooks)
  if (!state) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
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

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error(t("validation.enterAllDigits"));
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Verify OTP
      const otpResponse = await verifyOtpSignup({
        accountId: state.accountId,
        email: state.email,
        code: otpCode,
        tokenType: "SIGN_UP",
      });

      if (otpResponse.status && otpResponse.status !== "OK") {
        throw new Error(otpResponse.message || "OTP verification failed.");
      }

      toast.success(t("messages.emailVerified"));

      // Step 2: Get registration data from sessionStorage
      const registrationDataStr = sessionStorage.getItem("pendingRegistration");
      if (!registrationDataStr) {
        throw new Error("Registration data not found. Please register again.");
      }

      const registrationData = JSON.parse(
        registrationDataStr
      ) as RegisterFormData;

      // Step 3: Restore avatar if exists
      const avatarBase64 = sessionStorage.getItem("pendingRegistrationAvatar");
      if (avatarBase64) {
        // Convert base64 back to File
        const response = await fetch(avatarBase64);
        const blob = await response.blob();
        const file = new File([blob], "avatar.jpg", { type: blob.type });
        registrationData.avatar = file;
      }

      // Step 4: Call register API to create account
      await register(registrationData);

      // Step 5: Clean up sessionStorage
      sessionStorage.removeItem("pendingRegistration");
      sessionStorage.removeItem("pendingRegistrationAvatar");

      setTimeout(() => {
        navigate("/login", {
          state: {
            email: registrationData.username, // Pass username to pre-fill login form
            message:
              "Registration completed! Please login with your username and password.",
          },
        });
      }, 1500);
    } catch (error: unknown) {
      const errorMessage = extractApiErrorMessage(
        error,
        "Registration failed. Please try again."
      );
      toast.error(errorMessage);

      // If registration data is missing, redirect back to register
      if (errorMessage.includes("Registration data not found")) {
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
      setTimeLeft(300); // Reset timer to 5 minutes
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: unknown) {
      const errorMessage = extractApiErrorMessage(
        error,
        "Failed to resend OTP"
      );
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (otp.join("").length === 6 && !isLoading) {
      handleVerify();
    }
  }, [otp]);

  if (!state) return null;

  return (
    <AuthLayout ctaButton={{ to: "/login", label: "Sign In" }}>
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Verify Your Email
          </h1>
          <p className="text-slate-600 mt-2">
            We've sent a 6-digit code to your email
          </p>
        </div>

        <div className="space-y-6">
          {/* Email Display */}
          <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
            <MdOutlineMail className="text-emerald-600" size={18} />
            <span className="font-medium">{state.email}</span>
          </div>

          {/* OTP Input */}
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
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-semibold border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                autoFocus={index === 0}
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>

          {/* Timer */}
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
              Code expires in {formatTime(timeLeft)}
            </span>
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={
              isLoading ||
              otp.join("").length !== 6 ||
              otp.join("").length === 6
            }
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || otp.join("").length === 6
              ? "Verifying..."
              : "Verify Email"}
          </Button>

          {/* Resend OTP */}
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={isLoading || isResending || timeLeft > 240} // Can resend after 1 minute
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed underline"
            >
              {isResending ? "Sending..." : "Resend Code"}
            </button>
            {timeLeft > 240 && (
              <p className="text-xs text-slate-500 mt-1">
                Available in {formatTime(timeLeft - 240)}
              </p>
            )}
          </div>

          {/* Back to Register */}
          <div className="text-center pt-4 border-t">
            <button
              onClick={() => navigate("/select-role")}
              disabled={isLoading || isResending}
              className="text-sm text-slate-600 hover:text-slate-800"
            >
              {t("auth.buttons.backToRegistration")}
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
