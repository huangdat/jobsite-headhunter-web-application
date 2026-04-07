import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

// Auth pages (eager load - critical path)
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
import { useAuth } from "@/features/auth/context/useAuth";
import { GuestOnlyRoute } from "@/features/auth/components/GuestOnlyRoute";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { AdminOnlyRoute } from "@/features/auth/components/AdminOnlyRoute";
import { MainLayout } from "@/shared/layouts/MainLayout";
import { AdminLayout } from "@/features/users/list/layouts/AdminLayout";
import { ForumAdminLayout } from "@/shared/layouts/ForumAdminLayout";
import { PageLoader } from "@/shared/common-blocks/PageLoader";

// Lazy-loaded pages (code splitting for better performance)
const HomePage = lazy(() =>
  import("@/features/home/pages/HomePage").then((m) => ({
    default: m.HomePage,
  }))
);

const CompanyDetailPage = lazy(() =>
  import("@/features/company/detail/pages/CompanyDetailPage").then((m) => ({
    default: m.CompanyDetailPage,
  }))
);
const UserListPage = lazy(() =>
  import("@/features/users/list").then((m) => ({ default: m.UserListPage }))
);
const UserClassificationPage = lazy(() =>
  import("@/features/users/classification").then((m) => ({
    default: m.UserClassificationPage,
  }))
);
const AdminDashboardPage = lazy(() =>
  import("@/features/users/dashboard/pages").then((m) => ({
    default: m.AdminDashboardPage,
  }))
);
const UserDetailPage = lazy(() =>
  import("@/features/users/detail").then((m) => ({ default: m.UserDetailPage }))
);

// Jobs (lazy)
const JobListPage = lazy(() =>
  import("@/features/jobs/pages/JobListPage").then((m) => ({
    default: m.JobListPage,
  }))
);
const JobCreatePage = lazy(() =>
  import("@/features/jobs/pages/JobCreatePage").then((m) => ({
    default: m.JobCreatePage,
  }))
);
const JobDetailPage = lazy(() =>
  import("@/features/jobs/pages/JobDetailPage").then((m) => ({
    default: m.JobDetailPage,
  }))
);
const SavedJobsPage = lazy(() =>
  import("@/features/jobs/pages/SavedJobsPage").then((m) => ({
    default: m.SavedJobsPage,
  }))
);
const JobEditPage = lazy(() =>
  import("@/features/jobs/pages/JobEditPage").then((m) => ({
    default: m.JobEditPage,
  }))
);
const JobManagePage = lazy(() =>
  import("@/features/jobs/pages/JobManagePage").then((m) => ({
    default: m.JobManagePage,
  }))
);

// Headhunter (lazy)
const ApplicantsPage = lazy(() =>
  import("@/features/headhunter/pages/ApplicantsPage").then((m) => ({
    default: m.ApplicantsPage,
  }))
);
const JobsHubPage = lazy(() =>
  import("@/features/headhunter/pages/JobsHubPage").then((m) => ({
    default: m.JobsHubPage,
  }))
);
const BusinessProfilePage = lazy(() =>
  import("@/features/headhunter/business/pages").then((m) => ({
    default: m.BusinessProfilePage,
  }))
);
const CandidateDetailPage = lazy(() =>
  import("@/features/headhunter/candidates/pages/CandidateDetailPage").then(
    (m) => ({
      default: m.CandidateDetailPage,
    })
  )
);

// Applications (lazy)
const ApplyJobPage = lazy(() =>
  import("@/features/applications/pages/ApplyJobPage").then((m) => ({
    default: m.ApplyJobPage,
  }))
);
const MyApplicationsPage = lazy(() =>
  import("@/features/applications/pages/MyApplicationsPage").then((m) => ({
    default: m.MyApplicationsPage,
  }))
);
const ApplicationListPage = lazy(() =>
  import("@/features/applications/pages/ApplicationListPage").then((m) => ({
    default: m.ApplicationListPage,
  }))
);
const ApplicationDetailPage = lazy(() =>
  import("@/features/applications/pages/ApplicationDetailPage").then((m) => ({
    default: m.ApplicationDetailPage,
  }))
);
const JobPipelinePage = lazy(() =>
  import("@/features/applications/pages/JobPipelinePage").then((m) => ({
    default: m.JobPipelinePage,
  }))
);

// Candidate (lazy)
const ProfileEditPage = lazy(() =>
  import("@/features/candidate/profile/pages/ProfileEditPage").then((m) => ({
    default: m.ProfileEditPage,
  }))
);
const CVManagementPage = lazy(() =>
  import("@/features/candidate/cv/pages/CVManagementPage").then((m) => ({
    default: m.CVManagementPage,
  }))
);

// Collaborator (lazy)
const CommissionProfilePage = lazy(() =>
  import("@/features/collaborator/commission/pages").then((m) => ({
    default: m.CommissionProfilePage,
  }))
);

// Forum (lazy)
const PostListPage = lazy(() =>
  import("@/features/forum/public/list/pages/PostListPage").then((m) => ({
    default: m.PostListPage,
  }))
);
const PostDetailPage = lazy(() =>
  import("@/features/forum/public/detail/pages/PostDetailPage").then((m) => ({
    default: m.PostDetailPage,
  }))
);
const PostManagementPage = lazy(() =>
  import("@/features/forum/admin/posts/pages/PostManagementPage").then((m) => ({
    default: m.PostManagementPage,
  }))
);
const CategoryManagementPage = lazy(() =>
  import("@/features/forum/admin/categories/pages/CategoryManagementPage").then(
    (m) => ({ default: m.CategoryManagementPage })
  )
);

// Verification (lazy - PROF-05)
const VerificationListPage = lazy(() =>
  import("@/features/users/verification/pages").then((m) => ({
    default: m.VerificationListPage,
  }))
);
const VerificationDetailPage = lazy(() =>
  import("@/features/users/verification/pages").then((m) => ({
    default: m.VerificationDetailPage,
  }))
);

export function AppRouter() {
  function RoleRedirect() {
    const { isAuthenticated, isInitializing, user } = useAuth();

    if (isInitializing) return null;

    if (!isAuthenticated) return <Navigate to="/home" replace />;

    const role = user?.role ? user.role.toString().toLowerCase() : null;
    if (role === "headhunter")
      return <Navigate to="/headhunter/jobs" replace />;
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/home" replace />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Root redirect (role-aware) */}
        <Route path="/" element={<RoleRedirect />} />

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
          <Route
            path="/headhunter/candidates/:id"
            element={
              <ProtectedRoute allowedRoles={["HEADHUNTER", "ADMIN"]}>
                <CandidateDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/headhunter/jobs/:jobId/applications"
            element={
              <ProtectedRoute allowedRoles={["headhunter", "admin"]}>
                <JobPipelinePage />
              </ProtectedRoute>
            }
          />
          <Route path="/forum-posts" element={<PostListPage />} />
          <Route path="/forum-posts/:id" element={<PostDetailPage />} />
        </Route>
        <Route
          path="/home"
          element={<Navigate to="/headhunter/jobs" replace />}
        />

        {/* PROF-06: Company Detail (public - add when ready) */}
        <Route path="/companies/:id" element={<CompanyDetailPage />} />

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
        {/* Redirect base /headhunter to jobs hub so 'Tin tuyển dụng' loads by default */}
        <Route
          path="/headhunter"
          element={<Navigate to="/headhunter/jobs" replace />}
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

        {/* EPIC 7: Forum Management */}
        <Route
          path="/admin/forum"
          element={
            <AdminOnlyRoute>
              <ForumAdminLayout />
            </AdminOnlyRoute>
          }
        >
          <Route path="categories" element={<CategoryManagementPage />} />
          <Route path="posts" element={<PostManagementPage />} />
        </Route>

        {/* ==================== APPLICATIONS ROUTES (EPIC 5) ==================== */}

        {/* APPL-01: Candidate Apply for Job */}
        <Route
          path="/jobs/:jobId/apply"
          element={
            <ProtectedRoute allowedRoles={["CANDIDATE"]}>
              <ApplyJobPage />
            </ProtectedRoute>
          }
        />

        {/* APPL-07: Candidate My Applications */}
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute allowedRoles={["CANDIDATE"]}>
              <MyApplicationsPage />
            </ProtectedRoute>
          }
        />

        {/* APPL-02: Headhunter Applications List */}
        <Route
          path="/headhunter/applications"
          element={
            <ProtectedRoute allowedRoles={["headhunter", "admin"]}>
              <ApplicationListPage />
            </ProtectedRoute>
          }
        />

        {/* APPL-03, APPL-04, APPL-05: Headhunter Application Detail */}
        <Route
          path="/headhunter/applications/:id"
          element={
            <ProtectedRoute allowedRoles={["headhunter", "admin"]}>
              <ApplicationDetailPage />
            </ProtectedRoute>
          }
        />

        {/* PROF-05: Admin Verification */}
        <Route
          path="/admin/verifications"
          element={
            <AdminOnlyRoute>
              <AdminLayout>
                <VerificationListPage />
              </AdminLayout>
            </AdminOnlyRoute>
          }
        />
        <Route
          path="/admin/verifications/:id"
          element={
            <AdminOnlyRoute>
              <AdminLayout>
                <VerificationDetailPage />
              </AdminLayout>
            </AdminOnlyRoute>
          }
        />

        {/* ==================== PUBLIC FORUM ROUTES (EPIC 7) ==================== */}

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
    </Suspense>
  );
}
