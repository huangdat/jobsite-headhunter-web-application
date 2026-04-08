import React from "react";
import { Lock } from "lucide-react";
import { useUsersTranslation } from "@/shared/hooks";
import { getSemanticClass } from "@/lib/design-tokens";

interface AccountInfoCardProps {
  user: {
    username: string;
    role: "Administrator" | "User" | "Manager";
    status: "PENDING" | "ACTIVE" | "SUSPENDED" | "DELETED";
    joinedDate: string;
    lastLogin: string;
  };
}

const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ user }) => {
  const { t } = useUsersTranslation();
  const statusConfig = {
    PENDING: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      label: t("statuses.PENDING"),
    },
    ACTIVE: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: t("statuses.ACTIVE"),
    },
    SUSPENDED: {
      bg: "bg-red-100",
      text: "text-red-800",
      label: t("statuses.SUSPENDED"),
    },
    DELETED: {
      bg: "bg-slate-100",
      text: "text-slate-800",
      label: t("statuses.DELETED"),
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
        <Lock className={`w-5 h-5 ${getSemanticClass("info", "icon", true)}`} />
        {t("detail.accountInformation")}
      </h2>

      <div className="space-y-0">
        <div className="flex justify-between items-center py-3 px-0 border-b border-gray-200">
          <label className="text-sm font-medium text-gray-600">
            {t("detail.username")}
          </label>
          <span className="text-gray-900 font-medium">{user.username}</span>
        </div>

        <div className="flex justify-between items-center py-3 px-0 border-b border-gray-200">
          <label className="text-sm font-medium text-gray-600">
            {t("detail.role")}
          </label>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${roleConfig[user.role]}`}
          >
            {user.role}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 px-0 border-b border-gray-200">
          <label className="text-sm font-medium text-gray-600">
            {t("detail.status")}
          </label>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
          >
            {status.label}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 px-0 border-b border-gray-200">
          <label className="text-sm font-medium text-gray-600">
            {t("detail.createdDate")}
          </label>
          <span className="text-gray-900 font-medium">{user.joinedDate}</span>
        </div>

        <div className="flex justify-between items-center py-3 px-0">
          <label className="text-sm font-medium text-gray-600">
            {t("detail.lastLogin")}
          </label>
          <span className="text-gray-900 font-medium">{user.lastLogin}</span>
        </div>
      </div>
    </div>
  );
};

export default AccountInfoCard;
