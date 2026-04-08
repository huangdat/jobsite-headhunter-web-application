import React from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/shared/ui-primitives/button";
import { useUsersTranslation } from "@/shared/hooks";
import { getSemanticClass } from "@/lib/design-tokens";

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
      bg: getSemanticClass("warning", "bg", true),
      text: getSemanticClass("warning", "text", true),
      label: t("statuses.PENDING"),
    },
    ACTIVE: {
      bg: getSemanticClass("success", "bg", true),
      text: getSemanticClass("success", "text", true),
      label: t("statuses.ACTIVE"),
    },
    SUSPENDED: {
      bg: getSemanticClass("danger", "bg", true),
      text: getSemanticClass("danger", "text", true),
      label: t("statuses.SUSPENDED"),
    },
    DELETED: {
      bg: getSemanticClass("danger", "bg", true),
      text: getSemanticClass("danger", "text", true),
      label: t("statuses.DELETED"),
    },
  };

  const roleConfig = {
    Administrator: {
      color:
        getSemanticClass("info", "bg", true) +
        " " +
        getSemanticClass("info", "text", true),
      icon: "👤",
    },
    Manager: {
      color:
        getSemanticClass("info", "bg", true) +
        " " +
        getSemanticClass("info", "text", true),
      icon: "📊",
    },
    User: {
      color:
        getSemanticClass("info", "bg", true) +
        " " +
        getSemanticClass("info", "text", true),
      icon: "👥",
    },
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
              className={`w-24 h-24 rounded-full border-4 ${getSemanticClass("success", "border", true)} object-cover`}
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
                <CheckCircle
                  className={`w-4 h-4 ${getSemanticClass("success", "text", true)}`}
                />
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
      </div>
    </div>
  );
};

export default UserHeader;
