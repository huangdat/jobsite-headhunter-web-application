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
import { JobListPage } from "@/features/jobs/pages/JobListPage";
import { JobCreatePage } from "@/features/jobs/pages/JobCreatePage";
import { JobDetailPage } from "@/features/jobs/pages/JobDetailPage";
import { SavedJobsPage } from "@/features/jobs/pages/SavedJobsPage";
import { JobEditPage } from "@/features/jobs/pages/JobEditPage";
import { JobManagePage } from "@/features/jobs/pages/JobManagePage";
import { ApplicantsPage } from "@/features/headhunter/pages/ApplicantsPage";
import { JobsHubPage } from "@/features/headhunter/pages/JobsHubPage";
import { MainLayout } from "@/shared/layouts/MainLayout";
import { AdminOnlyRoute } from "@/features/auth/components/AdminOnlyRoute";
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
      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/jobs" element={<JobListPage />} />
          <Route
            path="/jobs/my"
            element={
              <ProtectedRoute allowedRoles={["headhunter", "admin"]}>
                <JobManagePage />
              </ProtectedRoute>
            }
          />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute>
              <SavedJobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/headhunter/jobs/new"
          element={
            <ProtectedRoute allowedRoles={["headhunter", "admin"]}>
              <JobCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/headhunter/jobs"
          element={
            <ProtectedRoute allowedRoles={["headhunter", "admin"]}>
              <JobsHubPage />
            </ProtectedRoute>
          }
        />
          <Route
            path="/headhunter/jobs/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["headhunter", "admin"]}>
                <JobEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/headhunter/applicants"
            element={
              <ProtectedRoute allowedRoles={["headhunter", "admin"]}>
                <ApplicantsPage />
              </ProtectedRoute>
            }
          />
      </Route>
      <Route path="/home" element={<HomePage />} />
      <Route
        path="/users"
        element={
          <AdminOnlyRoute>
            <AdminLayout>
              <UserListPage />
            </AdminLayout>
          </AdminOnlyRoute>
        }
      />
      <Route
        path="/users/classification"
        element={
          <AdminOnlyRoute>
            <AdminLayout>
              <UserClassificationPage />
            </AdminLayout>
          </AdminOnlyRoute>
        }
      />
      <Route
        path="/users/:userId"
        element={
          <AdminOnlyRoute>
            <AdminLayout>
              <UserDetailPage />
            </AdminLayout>
          </AdminOnlyRoute>
        }
      />
    </Routes>
  );
}
