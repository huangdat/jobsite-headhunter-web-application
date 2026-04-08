import React from "react";
import { useUsersTranslation } from "@/shared/hooks";
import type { UserStatus } from "@/features/users/types/user.types";
import { UserListLoading } from "./UserListLoading";

export interface UserTableRow {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  role: string;
  status: UserStatus;
  company: string;
}

interface UserListTableProps {
  users: UserTableRow[];
  isLoading?: boolean;
  onViewDetails?: (userId: string) => void;
  onLockUser?: (userId: string) => void;
  onUnlockUser?: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
}

export const UserListTable: React.FC<UserListTableProps> = ({
  users,
  isLoading = false,
  onViewDetails,
  onLockUser,
  onUnlockUser,
  onDeleteUser,
}) => {
  const { t } = useUsersTranslation();

  if (isLoading) {
    return <UserListLoading />;
  }

  const handleLockClick = (userId: string, status: UserStatus) => {
    if (status === "SUSPENDED") {
      onUnlockUser?.(userId);
    } else {
      onLockUser?.(userId);
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400";
      case "HEAD HUNTER":
      case "HEAD_HUNTER":
        return "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400";
      case "CANDIDATE":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
      case "COLLABORATOR":
        return "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case "ACTIVE":
        return {
          text: "text-emerald-600 dark:text-emerald-400",
          dot: "bg-emerald-500",
        };
      case "SUSPENDED":
        return { text: "text-rose-600 dark:text-rose-400", dot: "bg-rose-500" };
      case "PENDING":
        return {
          text: "text-amber-600 dark:text-amber-400",
          dot: "bg-amber-500",
        };
      default:
        return {
          text: "text-slate-500 dark:text-slate-400",
          dot: "bg-slate-400",
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[35%]">
              {t("columns.user")}
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[15%]">
              {t("columns.role")}
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[20%]">
              {t("columns.status")}
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right w-[30%]">
              {t("columns.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {users.map((user) => {
            const statusStyles = getStatusColor(user.status);

            return (
              <tr
                key={user.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
              >
                <td
                  className={`px-6 py-4 ${
                    user.status === "SUSPENDED" ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role
                      ? t(`roles.${user.role}`)
                      : t("common.noDataAvailable")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div
                    className={`flex items-center gap-1.5 text-xs font-bold ${statusStyles.text}`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${statusStyles.dot}`}
                    />
                    {t(`statuses.${user.status.toLowerCase()}`)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewDetails?.(user.id)}
                      className="p-1.5 text-slate-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-lg transition-all"
                      title={t("actions.viewDetails")}
                    >
                      <span className="material-symbols-outlined text-lg">
                        visibility
                      </span>
                    </button>
                    <button
                      onClick={() => handleLockClick(user.id, user.status)}
                      className={`p-1.5 rounded-lg transition-all ${
                        user.status === "SUSPENDED"
                          ? "text-amber-600 bg-amber-50 dark:bg-amber-500/20"
                          : "text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/20"
                      }`}
                      title={
                        user.status === "SUSPENDED"
                          ? t("actions.unlockAccount")
                          : t("actions.lockAccount")
                      }
                    >
                      <span className="material-symbols-outlined text-lg">
                        {user.status === "SUSPENDED" ? "lock_open" : "lock"}
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};