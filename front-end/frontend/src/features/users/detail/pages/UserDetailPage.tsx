import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
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
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock data
        const mockUser: User = {
          id: userId || "812345",
          fullName: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 234 567 890",
          role: "User",
          username: "jdoe_admin",
          status: "ACTIVE",
          joinedDate: "January 12, 2023",
          lastLogin: "October 24, 2023 09:15",
          company: "JobSite Corp",
          biography:
            "Experienced system administrator managing cloud infrastructure and enterprise user directories for the past 8 years.",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        };

        const mockLoginHistory: LoginSession[] = [
          {
            dateTime: "Oct 24, 2023 09:15",
            ipAddress: "192.168.1.45",
            deviceBrowser: "Chrome (macOS)",
            location: "San Francisco, US",
            status: "Successful",
          },
          {
            dateTime: "Oct 23, 2023 18:42",
            ipAddress: "192.168.1.45",
            deviceBrowser: "Safari (iOS)",
            location: "San Francisco, US",
            status: "Successful",
          },
          {
            dateTime: "Oct 21, 2023 11:20",
            ipAddress: "119.45.21.9",
            deviceBrowser: "Firefox (Windows)",
            location: "New York, US",
            status: "Failed Attempt",
          },
        ];

        setUser(mockUser);
        setLoginHistory(mockLoginHistory);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to load user details";
        setError(errorMsg);
        showToast("error", "Error loading user information");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetail();
    }
  }, [userId]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLockAccount = async () => {
    if (window.confirm("Are you sure you want to lock this account?")) {
      try {
        console.log("Locking account:", userId);
        showToast("success", "Account has been locked");
      } catch (err) {
        showToast("error", "Unable to lock account");
      }
    }
  };

  const handleSoftDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to soft delete this account? Data will be kept for 30 days."
      )
    ) {
      try {
        console.log("Soft deleting account:", userId);
        showToast(
          "success",
          "Account has been deleted (can be recovered within 30 days)"
        );
      } catch (err) {
        showToast("error", "Unable to delete account");
      }
    }
  };

  const handleHardDelete = async () => {
    if (
      window.confirm(
        "⚠️ ARE YOU SURE? This action cannot be undone! All data will be permanently deleted."
      )
    ) {
      try {
        console.log("Hard deleting account:", userId);
        showToast("success", "Account has been permanently deleted");
        setTimeout(() => navigate("/users"), 2000);
      } catch (err) {
        showToast("error", "Unable to delete account");
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
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">User Details</h1>
                <p className="text-gray-600 text-sm mt-1">
                  View information, permissions and login history
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium">
              ✎ Edit Profile
            </button>
          </div>

          {isViewingOtherAdmin && (
            <div className="bg-yellow-50 border-t border-yellow-200 w-full">
              <div className="max-w-7xl mx-auto px-8 py-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-900 font-medium">
                    This user is an Admin
                  </p>
                  <p className="text-yellow-800 text-sm mt-1">
                    Sensitive actions have been disabled to protect the
                    Administrator account.
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
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold">User Details</h1>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900">Error Loading Data</h3>
              <p className="text-red-700 mt-1">{error || "User not found"}</p>
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
              title="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">User Details</h1>
              <p className="text-gray-600 text-sm mt-1">
                View information, permissions and login history
              </p>
            </div>
          </div>
        </div>

        {isViewingOtherAdmin && (
          <div className="bg-yellow-50 border-t border-yellow-200 w-full">
            <div className="max-w-7xl mx-auto px-8 py-3 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-900 font-medium">
                  This user is an Admin
                </p>
                <p className="text-yellow-800 text-sm mt-1">
                  Sensitive actions have been disabled to protect the
                  Administrator account.
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
              🛡️ Login History
            </h2>
            <a
              href="#"
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              View all sessions
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
