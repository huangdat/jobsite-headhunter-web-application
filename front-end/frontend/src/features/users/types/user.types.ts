export interface LoginHistory {
  id: number;
  loginAt: string;
  ip: string;
  device: string;
  location: string;
  status: "SUCCESS" | "FAILED";
}

export type UserRole = "ADMIN" | "RECRUITER" | "CANDIDATE";

export type UserStatus = "ACTIVE" | "LOCKED";

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

  loginHistory: LoginHistory[];
}
