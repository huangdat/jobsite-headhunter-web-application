import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { useUsersTranslation } from "@/shared/hooks";
import { useUserDetail } from "../hooks/useUserDetail";
import { userMapper } from "../../utils/userMapper";
import UserHeader from "../components/UserHeader";
import BasicInfoCard from "../components/BasicInfoCard";
import AccountInfoCard from "../components/AccountInfoCard";
import LoginHistoryTable from "../components/LoginHistoryTable";
import DangerZoneCard from "../components/DangerZoneCard";
import LoadingSkeletons from "../components/LoadingSkeletons";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "Administrator" | "User" | "Manager";
  username: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
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
  status: "Successful" | "Failed Attempt";
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
  const [user, setUser] = useState<User | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Map API data to component state
  useEffect(() => {
    if (userDetailData) {
      const mappedUser = userMapper.toDetailModel(userDetailData);
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
    setTimeout(() => setToast(null), 3000);
  };

  const handleLockAccount = async () => {
    if (window.confirm(t("confirmations.lockAccount"))) {
      try {
        console.log("Locking account:", userId);
        showToast("success", t("messages.lockSuccess"));
      } catch (err) {
        showToast("error", t("messages.lockError"));
      }
    }
  };

  const handleSoftDelete = async () => {
    if (window.confirm(t("confirmations.softDelete"))) {
      try {
        console.log("Soft deleting account:", userId);
        showToast("success", t("messages.softDeleteSuccess"));
      } catch (err) {
        showToast("error", t("messages.softDeleteError"));
      }
    }
  };

  const handleHardDelete = async () => {
    if (window.confirm(t("confirmations.hardDelete"))) {
      try {
        console.log("Hard deleting account:", userId);
        showToast("success", t("messages.hardDeleteSuccess"));
        setTimeout(() => navigate("/users"), 2000);
      } catch (err) {
        showToast("error", t("messages.hardDeleteError"));
      }
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
            <a
              href="#"
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              {t("sections.viewAllSessions")}
            </a>
          </div>
          <LoginHistoryTable sessions={loginHistory} />
        </div>

        {!isViewingOtherAdmin && (
          <DangerZoneCard
            onLockAccount={handleLockAccount}
            onSoftDelete={handleSoftDelete}
            onHardDelete={handleHardDelete}
            isOtherAdmin={isViewingOtherAdmin}
          />
        )}
      </div>
    </div>
  );
};

export default UserDetailPage;
