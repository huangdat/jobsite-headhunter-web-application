import type { UserDetail } from "../types/user.types";
import type { UserTableRow } from "../list/components/UserListTable";

// Types for UserDetailPage
interface UserDetailModel {
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

export const userMapper = {
  /**
   * Map UserDetail to UserTableRow for table display
   */
  toTableRow: (user: UserDetail): UserTableRow => {
    return {
      id: user.id,
      name: user.fullName,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      company: user.company || "",
    };
  },

  /**
   * Map array of UserDetail to UserTableRow
   */
  toTableRows: (users: UserDetail[]): UserTableRow[] => {
    return users.map(userMapper.toTableRow);
  },

  /**
   * Map UserDetail to UserDetailModel for detail page
   */
  toDetailModel: (user: UserDetail): UserDetailModel => {
    const roleMap: Record<string, "Administrator" | "User" | "Manager"> = {
      ADMIN: "Administrator",
      RECRUITER: "Manager",
      CANDIDATE: "User",
    };

    const statusMap: Record<string, "ACTIVE" | "INACTIVE" | "SUSPENDED"> = {
      ACTIVE: "ACTIVE",
      LOCKED: "SUSPENDED",
    };

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || "",
      role: roleMap[user.role] || "User",
      username: user.username,
      status: statusMap[user.status] || "INACTIVE",
      joinedDate: new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      lastLogin: user.loginHistory?.[0]?.loginAt
        ? new Date(user.loginHistory[0].loginAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Never",
      company: user.company || undefined,
      biography: user.bio || undefined,
      avatar: user.avatar,
    };
  },

  /**
   * Map UserDetail login history to LoginSession array
   */
  toLoginSessions: (
    loginHistory: UserDetail["loginHistory"]
  ): LoginSession[] => {
    return loginHistory.map((log) => ({
      dateTime: new Date(log.loginAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      ipAddress: log.ip,
      deviceBrowser: log.device,
      location: log.location,
      status: log.status === "SUCCESS" ? "Successful" : "Failed Attempt",
    }));
  },
};
