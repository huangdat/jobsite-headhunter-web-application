import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import {
  useDeleteTranslation,
  useLockTranslation,
  useUnlockTranslation,
  useUsersTranslation,
} from "@/shared/hooks";
import { useUserDetail } from "@/features/users/detail/hooks/useUserDetail";
import { userMapper } from "@/features/users/utils/userMapper";
import { useDeleteUser } from "@/features/users/actions/delete/hooks";
import { useLockUser } from "@/features/users/actions/lock/hooks/useLockUser";
import { useUnlockUser } from "@/features/users/actions/lock/hooks/useUnlockUser";
import {
  ROUTES,
  REDIRECT_DELAY,
  TOAST_DURATION,
} from "@/features/users/constants";
import {
  UserHeader,
  BasicInfoCard,
  AccountInfoCard,
  LoginHistoryTable,
  DangerZoneCard,
  LoadingSkeletons,
  DeleteConfirmationModal,
} from "@/features/users/detail/components";
import LockUserModal from "@/features/users/actions/lock/components/LockUserModal";
import UnlockUserModal from "@/features/users/actions/lock/components/UnlockUserModal";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "Administrator" | "User" | "Manager";
  username: string;
  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "DELETED";
  joinedDate: string;
  lastLogin: string;
  company?: string;
  biography?: string;
  avatar?: string;
}

interface LoginSession {
  dateTime: string;
  ipAddress: string;
  deviceBrowser: string;
  location: string;
  status: "Successful" | "Failed";
}

const UserDetailPage: React.FC = () => {
  const { t } = useUsersTranslation();
  const { t: tDelete } = useDeleteTranslation();
  const { t: tLock } = useLockTranslation();
  const { t: tUnlock } = useUnlockTranslation();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const {
    data: userDetailData,
    loading,
    error: apiError,
  } = useUserDetail(userId || "");
  const { softDelete, hardDelete } = useDeleteUser();
  const { lock } = useLockUser();
  const { unlock } = useUnlockUser();
  const [user, setUser] = useState<User | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);

  // Toast type constants to avoid hardcoded strings
  const TOAST_SUCCESS = "success" as const;
  const TOAST_ERROR = "error" as const;

  const relatedDataCount = {
    applications: 0,
    jobs: 0,
    total: 0,
  };

  // Map API data to component state
  useEffect(() => {
    if (userDetailData) {
      const mappedUser = userMapper.toDetailModel(userDetailData);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(mappedUser);
      const mappedLoginHistory = userMapper.toLoginSessions(
        userDetailData.loginHistory
      );

      setLoginHistory(mappedLoginHistory);

      setError(null);
    } else if (apiError) {
      setError(apiError);
    }
  }, [userDetailData, apiError]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), TOAST_DURATION.MEDIUM);
  };

  const handleLockAccount = async () => {
    setIsLockModalOpen(true);
  };

  const handleUnlockAccount = async () => {
    setIsUnlockModalOpen(true);
  };

  const handleLockConfirm = async (lockData: {
    reason: string;
    autoUnlockDate?: string;
    sendEmail: boolean;
    logoutCurrentSession: boolean;
  }) => {
    if (!userId || !user) {
      // eslint-disable-next-line custom/no-hardcoded-strings
      showToast(TOAST_ERROR, tLock("errorGeneral"));
      return;
    }

    try {
      await lock({
        userId,
        userName: user.fullName,
        ...lockData,
      });

      showToast(TOAST_SUCCESS, tLock("successLockUser"));
      setIsLockModalOpen(false);

      // Refresh user data
      setTimeout(() => window.location.reload(), REDIRECT_DELAY.MEDIUM);
    } catch {
      // eslint-disable-next-line custom/no-hardcoded-strings
      showToast(TOAST_ERROR, tLock("errorGeneral"));
    }
  };

  const handleUnlockConfirm = async (unlockData: {
    reason: string;
    sendEmail: boolean;
    requirePasswordChange: boolean;
  }) => {
    if (!userId || !user) {
      // eslint-disable-next-line custom/no-hardcoded-strings
      showToast(TOAST_ERROR, tUnlock("errorGeneral"));
      return;
    }

    try {
      await unlock({
        userId,
        userName: user.fullName,
        ...unlockData,
      });

      showToast(TOAST_SUCCESS, tUnlock("successUnlockUser"));
      setIsUnlockModalOpen(false);

      // Refresh user data
      setTimeout(() => window.location.reload(), REDIRECT_DELAY.MEDIUM);
    } catch {
      // eslint-disable-next-line custom/no-hardcoded-strings
      showToast(TOAST_ERROR, tUnlock("errorGeneral"));
    }
  };

  const handleSoftDelete = async () => {
    setIsDeleteModalOpen(true);
  };

  const handleHardDelete = async () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (
    deleteType: "soft" | "hard",
    reason?: string
  ) => {
    if (!userId || !user) {
      // eslint-disable-next-line custom/no-hardcoded-strings
      showToast(TOAST_ERROR, tDelete("errorGeneral"));
      return;
    }

    try {
      if (deleteType === "soft") {
        if (!reason) {
          // eslint-disable-next-line custom/no-hardcoded-strings
          showToast(TOAST_ERROR, tDelete("errorReasonRequired"));
          return;
        }
        await softDelete({ userId, reason });
      } else {
        await hardDelete({ userId });
      }

      // Show success message
      showToast(
        TOAST_SUCCESS,
        deleteType === "soft"
          ? tDelete("successSoftDelete") // eslint-disable-line custom/no-hardcoded-strings
          : tDelete("successHardDelete") // eslint-disable-line custom/no-hardcoded-strings
      );

      // Redirect after deletion
      setTimeout(() => navigate(ROUTES.USERS_LIST), REDIRECT_DELAY.MEDIUM);
    } catch {
      // eslint-disable-next-line custom/no-hardcoded-strings
      showToast(TOAST_ERROR, tDelete("errorGeneral"));
    }
  };

  const isViewingOtherAdmin = user?.role === "Administrator";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-10 w-full">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                aria-label={t("aria.goBack")}
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title={t("aria.goBack")}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">
                  {t("detail.userDetails")}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {t("detail.personalInfo")}
                </p>
              </div>
            </div>
            <button
              aria-label={t("aria.editProfile")}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
            >
              ✎ {t("detail.editProfile")}
            </button>
          </div>

          {isViewingOtherAdmin && (
            <div className="bg-yellow-50 border-t border-yellow-200 w-full">
              <div className="max-w-7xl mx-auto px-8 py-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-900 font-medium">
                    {t("warnings.adminWarning")}
                  </p>
                  <p className="text-yellow-800 text-sm mt-1">
                    {t("warnings.adminWarningDesc")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <LoadingSkeletons />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                aria-label={t("aria.goBack")}
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold">{t("detail.userDetails")}</h1>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900">
                {t("detail.errorLoadingData")}
              </h3>
              <p className="text-red-700 mt-1">
                {error || t("list.noResults")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="bg-white border-b sticky top-0 z-10 w-full">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title={t("aria.goBack")}
              aria-label={t("aria.goBack")}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">{t("detail.userDetails")}</h1>
              <p className="text-gray-600 text-sm mt-1">
                {t("detail.personalInfo")}
              </p>
            </div>
          </div>
        </div>

        {isViewingOtherAdmin && (
          <div className="bg-yellow-50 border-t border-yellow-200 w-full">
            <div className="max-w-7xl mx-auto px-8 py-3 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-900 font-medium">
                  {t("warnings.adminWarning")}
                </p>
                <p className="text-yellow-800 text-sm mt-1">
                  {t("warnings.adminWarningDesc")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg text-white flex items-center gap-2 z-50 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        <UserHeader user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BasicInfoCard user={user} />
          <AccountInfoCard user={user} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {t("sections.loginHistory")}
            </h2>
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 text-sm font-medium bg-transparent border-none cursor-pointer"
            >
              {t("sections.viewAllSessions")}
            </button>
          </div>
          <LoginHistoryTable sessions={loginHistory} />
        </div>

        {!isViewingOtherAdmin && (
          <DangerZoneCard
            onLockAccount={handleLockAccount}
            onUnlockAccount={handleUnlockAccount}
            onSoftDelete={handleSoftDelete}
            onHardDelete={handleHardDelete}
            isOtherAdmin={isViewingOtherAdmin}
            userStatus={user?.status}
          />
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          userName={user?.fullName || ""}
          userId={userId || ""}
          relatedDataCount={relatedDataCount}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
        />

        {/* Lock User Modal */}
        <LockUserModal
          isOpen={isLockModalOpen}
          userName={user?.fullName || ""}
          userId={userId || ""}
          lockReasons={[
            {
              value: "suspicious_activity",
              // eslint-disable-next-line custom/no-hardcoded-strings
              label: tLock("reasonSuspiciousActivity"),
            },
            {
              value: "policy_violation",
              // eslint-disable-next-line custom/no-hardcoded-strings
              label: tLock("reasonPolicyViolation"),
            },
            {
              value: "account_compromise",
              // eslint-disable-next-line custom/no-hardcoded-strings
              label: tLock("reasonAccountCompromise"),
            },
            // eslint-disable-next-line custom/no-hardcoded-strings
            { value: "other", label: tLock("reasonOther") },
          ]}
          onClose={() => setIsLockModalOpen(false)}
          onConfirm={handleLockConfirm}
        />

        {/* Unlock User Modal */}
        <UnlockUserModal
          isOpen={isUnlockModalOpen}
          userName={user?.fullName || ""}
          userId={userId || ""}
          onClose={() => setIsUnlockModalOpen(false)}
          onConfirm={handleUnlockConfirm}
        />
      </div>
    </div>
  );
};

export default UserDetailPage;
