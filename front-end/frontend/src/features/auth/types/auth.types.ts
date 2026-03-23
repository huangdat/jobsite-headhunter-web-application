// User roles for REGISTRATION FORM (lowercase - used during form flow)
export type RegistrationUserRole = "candidate" | "collaborator" | "headhunter";

// User roles for AUTHENTICATED USER from backend (uppercase - from API response)
export type UserRole = "ADMIN" | "HEADHUNTER" | "COLLABORATOR" | "CANDIDATE";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}

/**
 * Authentication Types
 */

export interface LoginFormData {
  email: string; // username OR email
  password: string;
  rememberMe?: boolean;
}

export interface BaseRegisterFormData {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  avatar?: File;
  agreeToTerms: boolean;
}

export interface CandidateRegisterFormData extends BaseRegisterFormData {
  role: "candidate";
  currentTitle?: string;
  yearsOfExperience?: number;
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  bio?: string;
  city?: string;
  openForWork?: boolean;
}

export interface CollaboratorRegisterFormData extends BaseRegisterFormData {
  role: "collaborator";
  commissionRate?: number;
}

export interface HeadhunterRegisterFormData extends BaseRegisterFormData {
  role: "headhunter";
  taxCode: string;
  websiteUrl?: string;
  companyScale?: string;
}

export type RegisterFormData =
  | CandidateRegisterFormData
  | CollaboratorRegisterFormData
  | HeadhunterRegisterFormData;

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
/* ---------- API REQUEST ---------- */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ValidateTokenRequest {
  token: string;
}

export interface LogoutRequest {
  token: string;
}

/* ---------- API RESPONSE ---------- */

export interface LoginResult {
  accessToken: string;
  refreshToken?: string;
  authenticated: boolean;
}

export interface ValidateTokenResult {
  valid: boolean;
  id: string;
  username: string;
  role: string;
  status: string;
}

export interface AccountResp {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  imageUrl?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  authProvider: "LOCAL" | "GOOGLE" | "FACEBOOK";
  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "DELETED";
  roles: string[];
  createdAt: string;
  updatedAt: string;
}
