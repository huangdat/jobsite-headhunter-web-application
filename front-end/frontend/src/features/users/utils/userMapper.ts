import type { UserDetail } from "../types/user.types";
import type { UserTableRow } from "../list/components/UserListTable";

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
      status: user.status === "ACTIVE" ? "Active" : "Inactive",
      company: user.company || "",
      isLocked: user.status === "LOCKED",
    };
  },

  /**
   * Map array of UserDetail to UserTableRow
   */
  toTableRows: (users: UserDetail[]): UserTableRow[] => {
    return users.map(userMapper.toTableRow);
  },
};
