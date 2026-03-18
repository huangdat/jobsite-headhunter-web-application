import React from "react";
import { Lock } from "lucide-react";

interface AccountInfoCardProps {
  user: {
    username: string;
    role: "Administrator" | "User" | "Manager";
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    joinedDate: string;
    lastLogin: string;
  };
}

const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ user }) => {
  const statusConfig = {
    ACTIVE: { bg: "bg-green-100", text: "text-green-800", label: "Active" },
    INACTIVE: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: "Inactive",
    },
    SUSPENDED: {
      bg: "bg-red-100",
      text: "text-red-800",
      label: "Suspended",
    },
  };

  const status = statusConfig[user.status];

  const roleConfig = {
    Administrator: "bg-purple-100 text-purple-800",
    Manager: "bg-blue-100 text-blue-800",
    User: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
        <Lock className="w-5 h-5 text-blue-500" />
        Account Information
      </h2>

      <div className="space-y-0">
        <div className="flex justify-between items-center py-3 px-0 border-b border-gray-200">
          <label className="text-sm font-medium text-gray-600">
            Username
          </label>
          <span className="text-gray-900 font-medium">{user.username}</span>
        </div>

        <div className="flex justify-between items-center py-3 px-0 border-b border-gray-200">
          <label className="text-sm font-medium text-gray-600">Role</label>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${roleConfig[user.role]}`}
          >
            {user.role}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 px-0 border-b border-gray-200">
          <label className="text-sm font-medium text-gray-600">
            Status
          </label>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
          >
            {status.label}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 px-0 border-b border-gray-200">
          <label className="text-sm font-medium text-gray-600">Created Date</label>
          <span className="text-gray-900 font-medium">{user.joinedDate}</span>
        </div>

        <div className="flex justify-between items-center py-3 px-0">
          <label className="text-sm font-medium text-gray-600">
            Last Login
          </label>
          <span className="text-gray-900 font-medium">{user.lastLogin}</span>
        </div>
      </div>
    </div>
  );
};

export default AccountInfoCard;
