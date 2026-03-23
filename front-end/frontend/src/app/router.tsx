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
import { AdminDashboardPage } from "@/features/users/dashboard/pages";
import { AdminLayout } from "@/features/users/list/layouts/AdminLayout";
import { GuestOnlyRoute } from "@/features/auth/components/GuestOnlyRoute";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { AdminOnlyRoute } from "@/features/auth/components/AdminOnlyRoute";
import { UserDetailPage } from "@/features/users/detail";

// PROF-01: Candidate Profile
import { ProfileEditPage } from "@/features/candidate/profile/pages/ProfileEditPage";

// PROF-02: CV Management
import { CVManagementPage } from "@/features/candidate/cv/pages/CVManagementPage";

// PROF-03: Headhunter Business
import { BusinessProfilePage } from "@/features/headhunter/business/pages";

// PROF-04: Collaborator Commission
import { CommissionProfilePage } from "@/features/collaborator/commission/pages";

// PROF-05: Admin Verification (add when ready)
// import { VerificationPage } from "@/features/users/verification/pages";

// PROF-06: Company Detail (add when ready)
// import { CompanyDetailPage } from "@/features/company/detail/pages";

export function AppRouter() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* ==================== AUTH ROUTES ==================== */}
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

      {/* ==================== PUBLIC ROUTES ==================== */}
      <Route path="/home" element={<HomePage />} />

      {/* PROF-06: Company Detail (public - add when ready) */}
      {/* <Route path="/companies/:id" element={<CompanyDetailPage />} /> */}

      {/* ==================== CANDIDATE ROUTES ==================== */}
      {/* PROF-01: Candidate Profile */}
      <Route
        path="/candidate/profile"
        element={
          <ProtectedRoute allowedRoles={["CANDIDATE"]}>
            <ProfileEditPage />
          </ProtectedRoute>
        }
      />
      {/* Keep old route for backward compatibility */}
      <Route
        path="/profile"
        element={<Navigate to="/candidate/profile" replace />}
      />

      {/* PROF-02: CV Management */}
      <Route
        path="/candidate/cv"
        element={
          <ProtectedRoute allowedRoles={["CANDIDATE"]}>
            <CVManagementPage />
          </ProtectedRoute>
        }
      />

      {/* ==================== HEADHUNTER ROUTES ==================== */}
      {/* PROF-03: Headhunter Business */}
      <Route
        path="/headhunter/business"
        element={
          <ProtectedRoute allowedRoles={["HEADHUNTER"]}>
            <BusinessProfilePage />
          </ProtectedRoute>
        }
      />
      {/* Keep old route for backward compatibility */}
      <Route
        path="/business"
        element={<Navigate to="/headhunter/business" replace />}
      />

      {/* ==================== COLLABORATOR ROUTES ==================== */}
      {/* PROF-04: Collaborator Commission */}
      <Route
        path="/collaborator/commission"
        element={
          <ProtectedRoute allowedRoles={["COLLABORATOR"]}>
            <CommissionProfilePage />
          </ProtectedRoute>
        }
      />

      {/* ==================== ADMIN ROUTES ==================== */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminOnlyRoute>
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          </AdminOnlyRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminOnlyRoute>
            <AdminLayout>
              <UserListPage />
            </AdminLayout>
          </AdminOnlyRoute>
        }
      />
      <Route
        path="/admin/users/classification"
        element={
          <AdminOnlyRoute>
            <AdminLayout>
              <UserClassificationPage />
            </AdminLayout>
          </AdminOnlyRoute>
        }
      />
      <Route
        path="/admin/users/:userId"
        element={
          <AdminOnlyRoute>
            <AdminLayout>
              <UserDetailPage />
            </AdminLayout>
          </AdminOnlyRoute>
        }
      />

      {/* PROF-05: Admin Verification (add when ready) */}
      {/* <Route
        path="/admin/verifications"
        element={
          <AdminOnlyRoute>
            <AdminLayout>
              <VerificationPage />
            </AdminLayout>
          </AdminOnlyRoute>
        }
      /> */}

      {/* Keep old routes for backward compatibility */}
      <Route
        path="/users"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route
        path="/users/list"
        element={<Navigate to="/admin/users" replace />}
      />
      <Route
        path="/users/classification"
        element={<Navigate to="/admin/users/classification" replace />}
      />
    </Routes>
  );
}
