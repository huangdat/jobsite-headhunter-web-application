export interface LoginHistory {
  id: number;
  loginAt: string;
  ip: string;
  device: string;
  location: string;
  status: "SUCCESS" | "FAILED";
}

// User roles - MUST match backend Role enum
export type UserRole = "ADMIN" | "HEADHUNTER" | "COLLABORATOR" | "CANDIDATE";

// Account status - MUST match backend AccountStatus enum
export type UserStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "DELETED";

export interface UserDetail {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string | null;
  bio?: string;
  avatar?: string;

  username: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;

  loginHistory?: LoginHistory[];
}
