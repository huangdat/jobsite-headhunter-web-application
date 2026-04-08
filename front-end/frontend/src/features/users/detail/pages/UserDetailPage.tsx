import React, { useState, useEffect } from "react";
import { getSemanticClass } from "@/lib/design-tokens";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import {
  SubsectionTitle,
  SmallText,
} from "@/shared/common-blocks/typography/Typography";
import { useUsersTranslation } from "@/shared/hooks";
import { useUserDetail } from "@/features/users/detail/hooks/useUserDetail";
import { userMapper } from "@/features/users/utils/userMapper";
import { useDeleteUser } from "@/features/users/actions/delete/hooks";
import { useLockUser } from "@/features/users/actions/lock/hooks/useLockUser";
import { useUnlockUser } from "@/features/users/actions/lock/hooks/useUnlockUser";
import { PageContainer } from "@/shared/common-blocks/layout";
import { PageSkeleton } from "@/shared/common-blocks/states";
import { ErrorState } from "@/shared/common-blocks/states/ErrorState";
import {
  ROUTES,
  REDIRECT_DELAY,
  TOAST_DURATION,
} from "@/features/users/constants";
import {
  UserHeader,
  BasicInfoCard,
  AccountInfoCard,
  DangerZoneCard,
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

const UserDetailPage: React.FC = () => {
  const { t } = useUsersTranslation();
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
      showToast(TOAST_ERROR, t("lock.errorGeneral"));
      return;
    }

    try {
      await lock({
        userId,
        userName: user.fullName,
        ...lockData,
      });

      showToast(TOAST_SUCCESS, t("lock.successLockUser"));
      setIsLockModalOpen(false);

      // Refresh user data
      setTimeout(() => window.location.reload(), REDIRECT_DELAY.MEDIUM);
    } catch {
      showToast(TOAST_ERROR, t("lock.errorGeneral"));
    }
  };

  const handleUnlockConfirm = async (unlockData: {
    reason: string;
    sendEmail: boolean;
    requirePasswordChange: boolean;
  }) => {
    if (!userId || !user) {
      showToast(TOAST_ERROR, t("unlock.errorGeneral"));
      return;
    }

    try {
      await unlock({
        userId,
        userName: user.fullName,
        ...unlockData,
      });

      showToast(TOAST_SUCCESS, t("unlock.successUnlockUser"));
      setIsUnlockModalOpen(false);

      // Refresh user data
      setTimeout(() => window.location.reload(), REDIRECT_DELAY.MEDIUM);
    } catch {
      showToast(TOAST_ERROR, t("unlock.errorGeneral"));
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (
    deleteType: "soft" | "hard",
    reason?: string
  ) => {
    if (!userId || !user) {
      showToast(TOAST_ERROR, t("delete.errorGeneral"));
      return;
    }

    try {
      if (deleteType === "soft") {
        if (!reason) {
          showToast(TOAST_ERROR, t("delete.errorReasonRequired"));
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
          ? t("delete.successSoftDelete")
          : t("delete.successHardDelete")
      );

      // Redirect after deletion
      setTimeout(() => navigate(ROUTES.USERS_LIST), REDIRECT_DELAY.MEDIUM);
    } catch {
      showToast(TOAST_ERROR, t("delete.errorGeneral"));
    }
  };

  const isViewingOtherAdmin = user?.role === "Administrator";

  if (loading && !user) {
    return <PageSkeleton variant="grid" count={1} />;
  }

  if (error || !user) {
    return (
      <ErrorState
        error={new Error(error || t("list.noResults"))}
        onRetry={() => window.location.reload()}
        title={t("detail.errorLoadingData")}
      />
    );
  }

  return (
    <PageContainer variant="white" maxWidth="7xl">
      <div className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 sticky top-0 z-10 w-full -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8">
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition text-slate-900 dark:text-white"
              title={t("aria.goBack")}
              aria-label={t("aria.goBack")}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t("detail.userDetails")}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                {t("detail.personalInfo")}
              </p>
            </div>
          </div>
        </div>

        {isViewingOtherAdmin && (
          <div
            className={`border-t ${getSemanticClass("warning", "bg", true)} ${getSemanticClass("warning", "border", true)} w-full -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8`}
          >
            <div className="py-3 flex items-start gap-3">
              <AlertCircle
                className={`w-5 h-5 shrink-0 mt-0.5 ${getSemanticClass("warning", "icon", true)}`}
              />
              <div>
                <p
                  className={`font-medium ${getSemanticClass("warning", "text", true)}`}
                >
                  {t("warnings.adminWarning")}
                </p>
                <p
                  className={`text-sm mt-1 ${getSemanticClass("warning", "text", true)}`}
                >
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
            toast.type === "success"
              ? `${getSemanticClass("success", "bg", true)}`
              : "bg-red-500 dark:bg-red-600"
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

      <div className="py-8 space-y-6">
        <UserHeader user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BasicInfoCard user={user} />
          <AccountInfoCard user={user} />
        </div>

        {!isViewingOtherAdmin && (
          <DangerZoneCard
            onLockAccount={handleLockAccount}
            onUnlockAccount={handleUnlockAccount}
            onDeleteAccount={handleDeleteAccount}
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
              label: t("lock.reasonSuspiciousActivity"),
            },
            {
              value: "policy_violation",
              label: t("lock.reasonPolicyViolation"),
            },
            {
              value: "account_compromise",
              label: t("lock.reasonAccountCompromise"),
            },
            { value: "other", label: t("lock.reasonOther") },
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
    </PageContainer>
  );
};

export default UserDetailPage;
