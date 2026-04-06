import React from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUsersTranslation } from "@/shared/hooks";

interface UserHeaderProps {
  user: {
    fullName: string;
    role: "Administrator" | "User" | "Manager";
    status: "PENDING" | "ACTIVE" | "SUSPENDED" | "DELETED";
    id: string;
    joinedDate: string;
    avatar?: string;
  };
}

const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
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

  const roleConfig = {
    Administrator: { color: "bg-purple-100 text-purple-800", icon: "👤" },
    Manager: { color: "bg-blue-100 text-blue-800", icon: "📊" },
    User: { color: "bg-gray-100 text-gray-800", icon: "👥" },
  };

  const status = statusConfig[user.status];
  const role = roleConfig[user.role];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start gap-3 flex-row sm:flex-col">
        {/* Avatar + Info */}
        <div className="flex items-start gap-6 flex-1">
          <div className="flex-0">
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-24 h-24 rounded-full border-4 border-green-300 object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl font-bold">{user.fullName}</h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${role.color}`}
              >
                {role.icon} {user.role}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                >
                  {status.label}
                </span>
              </div>
              <span className="text-gray-600 text-sm">
                {t("detail.id")}: {user.id}
              </span>
              <span className="text-gray-600 text-sm">
                {t("detail.joinedDate")}: {user.joinedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 flex-0 lg:w-full lg:mt-4">
          <Button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium whitespace-nowrap">
            ✎ {t("detail.editProfile")}
          </Button>
          <Button
            variant="outline"
            className="px-4 py-2 font-medium whitespace-nowrap"
          >
            📥 {t("detail.exportData")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
