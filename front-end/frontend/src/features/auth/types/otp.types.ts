// OTP Types
export type OtpTokenType = "SIGN_UP" | "FORGOT_PASSWORD";

export interface SendOtpRequest {
  email: string;
  tokenType?: OtpTokenType;
  accountId?: string;
}

export interface OtpSendResp {
  accountId?: string; // Optional - backend may return null
  email: string;
  tokenType: OtpTokenType;
  createdAt: string;
  expiresAt: string;
}

export interface VerifyOtpRequest {
  accountId?: string; // Optional - not required by backend
  email: string;
  code: string;
  tokenType: OtpTokenType;
}

export interface OtpVerifyResp {
  status?: string;
  message: string;
  resetToken?: string;
  resetTokenExpiresAt?: string;
}

// Combined request for verify OTP + reset password
export interface VerifyOtpAndResetPasswordRequest {
  email: string;
  code: string;
  tokenType?: OtpTokenType;
  newPassword: string;
  confirmPassword: string;
}

export interface OtpVerifyAndResetPasswordResp {
  status?: string;
  message: string;
  email?: string;
}
