import { Routes, Route, Navigate } from "react-router-dom";

import {
  LoginPage,
  SelectRolePage,
  RegisterPage,
  OTPVerificationPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  ResetPasswordSuccessPage,
  ChangePasswordPage,
} from "@/features/auth/pages";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/select-role" element={<SelectRolePage />} />
      <Route path="/register/:role" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OTPVerificationPage />} />
      <Route path="/forgot-password/" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/reset-password/success"
        element={<ResetPasswordSuccessPage />}
      />
      <Route path="/change-password" element={<ChangePasswordPage />} />
    </Routes>
  );
}
