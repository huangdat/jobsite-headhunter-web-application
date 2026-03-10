/**
 * Authentication Types
 *
 * IMPORTANT - Login vs Registration Field Names:
 *
 * LoginFormData.email:
 *   - Contains username OR email (despite field name)
 *   - Sent to backend as 'username' field
 *   - Example: user types "john_doe123" → stored in email field → sent as username
 *
 * RegisterFormData:
 *   - Has separate 'username' and 'email' fields (correct naming)
 *   - confirmPassword → mapped to 'rePassword' when sending to backend
 */

export type UserRole = "candidate" | "collaborator" | "headhunter";

export interface LoginFormData {
  email: string; // NOTE: Contains username OR email (see note above)
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
  // Optional candidate-specific fields
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
  // Optional collaborator-specific fields
  commissionRate?: number;
}

export interface HeadhunterRegisterFormData extends BaseRegisterFormData {
  role: "headhunter";
  companyName: string;
  taxCode: string;
  // Optional headhunter-specific fields
  websiteUrl?: string;
  addressMain?: string;
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

// Additional types for API requests and responses
export interface ApiResponse<T> {
  status: string;
  message: string;
  result: T;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  authenticated: boolean;
}

export interface ValidateTokenRequest {
  token: string;
}

export interface ValidateTokenResult {
  valid: boolean;
  id: string;
  username: string;
  role: string;
  status: string;
}

export interface LogoutRequest {
  token: string;
}

// Response from backend when registering an account
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

// OTP Types
export type OtpTokenType = "SIGNUP" | "FORGOT_PASSWORD";

export interface SendOtpRequest {
  email: string;
  tokenType?: OtpTokenType;
  accountId?: string;
}

export interface OtpSendResp {
  accountId: string;
  email: string;
  tokenType: OtpTokenType;
  createdAt: string;
  expiresAt: string;
}

export interface VerifyOtpRequest {
  accountId: string;
  email: string;
  code: string;
  tokenType: OtpTokenType;
}

export interface OtpVerifyResp {
  status: string;
  message: string;
  resetToken?: string;
  resetTokenExpiresAt?: string;
}

// Combined request for verify OTP + reset password
export interface VerifyOtpAndResetPasswordRequest {
  accountId: string;
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}
