import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login } from "../services/authApi";
import type { LoginFormData } from "../types";
import { useAuth } from "../context/useAuth";
import { useAppTranslation } from "@/shared/hooks";
import { extractApiErrorMessage } from "../utils/apiError";

const REMEMBERED_LOGIN_KEY = "rememberedLogin"; // Stores username or email

export const useLogin = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { t } = useAppTranslation();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (data: LoginFormData): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    // Username or Email validation
    if (!data.email.trim()) {
      newErrors.email = "Username or email is required";
    } else {
      const input = data.email.trim();
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
      const isUsername = /^[a-zA-Z][a-zA-Z0-9_]{7,31}$/.test(input);

      if (!isEmail && !isUsername) {
        newErrors.email = "Please enter a valid username";
      }
    }

    // Password validation
    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (data: LoginFormData) => {
    // Validate form before submitting
    if (!validateForm(data)) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Send username/email as 'username' field (backend expects username)
      const response = await login({
        username: data.email, // This field contains username or email
        password: data.password,
      });

      if (response?.authenticated && response.accessToken) {
        await signIn(response.accessToken);

        // Handle remember me - store username or email
        if (data.rememberMe) {
          localStorage.setItem(REMEMBERED_LOGIN_KEY, data.email);
        } else {
          localStorage.removeItem(REMEMBERED_LOGIN_KEY);
        }

        // Success Notification
        toast.success(t("messages.signedInSuccess"));

        navigate("/home");
        return;
      }

      throw new Error("Authentication failed.");
    } catch (error: unknown) {
      const errorMessage = extractApiErrorMessage(
        error,
        "Unable to sign in right now. Please try again.",
      );
      let errorField: "email" | "password" | "general" = "general";

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

        const responseMessage = response.data?.message || errorMessage;

        // Categorize error based on message or status code
        const messageLower = responseMessage.toLowerCase();

        if (
          messageLower.includes("email") ||
          messageLower.includes("username") ||
          messageLower.includes("not found") ||
          messageLower.includes("does not exist") ||
          messageLower.includes("user not found") ||
          messageLower.includes("account not found") ||
          response.status === 404
        ) {
          errorField = "email";
        } else if (
          messageLower.includes("password") ||
          messageLower.includes("incorrect") ||
          messageLower.includes("invalid credentials") ||
          messageLower.includes("wrong password") ||
          response.status === 401
        ) {
          errorField = "password";
        }
      }

      toast.error(errorMessage);

      // Set form error for the appropriate field
      if (errorField === "email") {
        setErrors({ email: errorMessage });
      } else if (errorField === "password") {
        setErrors({ password: errorMessage });
      } else {
        setErrors({ email: errorMessage });
      }

      console.error("Login detail error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange =
    (field: keyof LoginFormData) => (value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (field !== "rememberMe" && errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }

      // Clear remembered login immediately when unchecking remember me
      if (field === "rememberMe" && value === false) {
        localStorage.removeItem(REMEMBERED_LOGIN_KEY);
      }
    };

  const loadRememberedEmail = () => {
    const rememberedLogin = localStorage.getItem(REMEMBERED_LOGIN_KEY);
    if (rememberedLogin) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedLogin, // Field name is 'email' but contains username or email
        rememberMe: true,
      }));
    }
  };

  return {
    formData,
    errors,
    isLoading,
    handleSubmit,
    handleChange,
    loadRememberedEmail,
  };
};
