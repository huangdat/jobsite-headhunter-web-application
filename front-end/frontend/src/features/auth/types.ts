export type UserRole = "candidate" | "collaborator" | "headhunter";

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface BaseRegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface CandidateRegisterFormData extends BaseRegisterFormData {
  role: "candidate";
}

export interface CollaboratorRegisterFormData extends BaseRegisterFormData {
  role: "collaborator";
}

export interface HeadhunterRegisterFormData extends BaseRegisterFormData {
  role: "headhunter";
  companyName: string;
  taxCode: string;
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

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
