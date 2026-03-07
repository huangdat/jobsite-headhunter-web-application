import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login } from "../services/authApi";
import type { LoginFormData } from "../types";

const REMEMBERED_EMAIL_KEY = "rememberedEmail";

export const useLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (data: LoginFormData): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    // Email validation
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      const response = await login({
        username: data.email,
        password: data.password,
      });

      // Store token to localStorage
      if (response?.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);

        // Handle remember me
        if (data.rememberMe) {
          localStorage.setItem(REMEMBERED_EMAIL_KEY, data.email);
        } else {
          localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        }

        // Success Notification
        toast.success("Welcome Back! Login Successful.");

        navigate("/");
      }
    } catch (error: unknown) {
      // Extract error details from response
      let errorMessage = "Login failed. Please try again.";
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

        errorMessage = response.data?.message || errorMessage;

        // Categorize error based on message or status code
        const messageLower = errorMessage.toLowerCase();

        if (
          messageLower.includes("email") ||
          messageLower.includes("not found") ||
          messageLower.includes("does not exist") ||
          messageLower.includes("user not found") ||
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

      // Error Notification
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

      // Clear remembered email immediately when unchecking remember me
      if (field === "rememberMe" && value === false) {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }
    };

  const loadRememberedEmail = () => {
    const rememberedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
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
