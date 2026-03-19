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
import { HomePage } from "@/features/home/pages/HomePage";
import { UserListPage } from "@/features/users/list";
import { UserClassificationPage } from "@/features/users/classification";
import { AdminLayout } from "@/features/users/list/layouts/AdminLayout";
import { GuestOnlyRoute } from "@/features/auth/components/GuestOnlyRoute";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { UserDetailPage } from "@/features/users/detail";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route
        path="/login"
        element={
          <GuestOnlyRoute>
            <LoginPage />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/select-role"
        element={
          <GuestOnlyRoute>
            <SelectRolePage />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/register/:role"
        element={
          <GuestOnlyRoute>
            <RegisterPage />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/verify-otp"
        element={
          <GuestOnlyRoute>
            <OTPVerificationPage />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/forgot-password/"
        element={
          <GuestOnlyRoute>
            <ForgotPasswordPage />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <GuestOnlyRoute>
            <ResetPasswordPage />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/reset-password/success"
        element={
          <GuestOnlyRoute>
            <ResetPasswordSuccessPage />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />
      <Route path="/home" element={<HomePage />} />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <UserListPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/classification"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <UserClassificationPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:userId"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <UserDetailPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
