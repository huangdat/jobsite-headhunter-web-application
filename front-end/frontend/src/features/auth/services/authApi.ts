import { apiCall, apiPost, apiGet, apiPut } from "@/shared/api/apiWrapper";
import { API_ENDPOINTS } from "@/lib/constants";
import type {
  LoginRequest,
  LoginResult,
  ValidateTokenRequest,
  ValidateTokenResult,
  LogoutRequest,
  RegisterFormData,
  ChangePasswordFormData,
  AccountResp,
  SendOtpRequest,
  OtpSendResp,
  VerifyOtpRequest,
  OtpVerifyResp,
  VerifyOtpAndResetPasswordRequest,
  OtpVerifyAndResetPasswordResp,
  GoogleTokenRequest,
  LinkedInTokenRequest,
  SocialAuthResponse,
  SocialRegisterRequest,
} from "@/features/auth/types";

/**
 * Authentication Service
 * Handles login, registration, OTP verification, and password reset
 */

/**
 * Login with email and password
 * POST /api/auth/login
 */
export const login = async (data: LoginRequest): Promise<LoginResult> => {
  return apiPost<LoginResult>(API_ENDPOINTS.AUTH.LOGIN, data, {
    service: "auth",
    action: "login",
  });
};

/**
 * Validate authentication token
 * POST /api/auth/validate-token
 */
export const validateToken = async (
  data: ValidateTokenRequest
): Promise<ValidateTokenResult> => {
  return apiPost<ValidateTokenResult>(API_ENDPOINTS.AUTH.VALIDATE_TOKEN, data, {
    service: "auth",
    action: "validateToken",
    silent: true, // Don't show error toast for validation calls
  });
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = async (data: LogoutRequest): Promise<void> => {
  return apiPost<void>(API_ENDPOINTS.AUTH.LOGOUT, data, {
    service: "auth",
    action: "logout",
  });
};

/**
 * Register new user account
 * Supports multiple roles: candidate, collaborator, headhunter
 * POST /api/account/signup/{role}
 */
export const register = async (
  data: RegisterFormData
): Promise<AccountResp> => {
  // Create FormData instead of sending JSON
  const formData = new FormData();

  // Common fields for all roles
  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("rePassword", data.confirmPassword); // Backend expects 'rePassword'
  formData.append("fullName", data.fullName);
  formData.append("phone", data.phone);

  // Optional common fields
  if (data.gender) {
    formData.append("gender", data.gender);
  }

  if (data.avatar) {
    formData.append("avatar", data.avatar);
  }

  // Role-specific fields and endpoint
  let endpoint = API_ENDPOINTS.ACCOUNT.SIGNUP_CANDIDATE; // default

  if (data.role === "headhunter") {
    endpoint = API_ENDPOINTS.ACCOUNT.SIGNUP_HEADHUNTER;
    formData.append("taxCode", data.taxCode);
    if (data.websiteUrl) formData.append("websiteUrl", data.websiteUrl);
    if (data.companyScale) formData.append("companyScale", data.companyScale);
  } else if (data.role === "collaborator") {
    endpoint = API_ENDPOINTS.ACCOUNT.SIGNUP_COLLABORATOR;
    if (data.commissionRate !== undefined) {
      formData.append("commissionRate", data.commissionRate.toString());
    }
  } else if (data.role === "candidate") {
    if (data.currentTitle) formData.append("currentTitle", data.currentTitle);
    if (data.yearsOfExperience !== undefined) {
      formData.append("yearsOfExperience", data.yearsOfExperience.toString());
    }
    if (data.expectedSalaryMin !== undefined) {
      formData.append("expectedSalaryMin", data.expectedSalaryMin.toString());
    }
    if (data.expectedSalaryMax !== undefined) {
      formData.append("expectedSalaryMax", data.expectedSalaryMax.toString());
    }
    if (data.bio) formData.append("bio", data.bio);
    if (data.city) formData.append("city", data.city);
    if (data.openForWork !== undefined) {
      formData.append("openForWork", data.openForWork.toString());
    }
  }

  return apiCall<AccountResp>({
    endpoint,
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    context: { service: "auth", action: "register" },
  });
};

/**
 * Change password for authenticated user
 * PUT /api/account/change-password
 */
export const changePassword = async (
  data: ChangePasswordFormData
): Promise<string> => {
  const payload = {
    oldPassword: data.currentPassword,
    newPassword: data.newPassword,
    reNewPassword: data.confirmPassword,
  };

  return apiPut<string>(API_ENDPOINTS.ACCOUNT.CHANGE_PASSWORD, payload, {
    service: "auth",
    action: "changePassword",
  });
};

/**
 * Get authenticated user's profile information
 * GET /api/account/profile
 */
export const getMyInfo = async (): Promise<AccountResp> => {
  return apiGet<AccountResp>(API_ENDPOINTS.ACCOUNT.GET_PROFILE, undefined, {
    service: "auth",
    action: "getMyInfo",
  });
};

/**
 * OTP Functions
 */

/**
 * Send OTP for signup
 * POST /api/otp/send/signup
 */
export const sendOtpSignup = async (
  data: SendOtpRequest
): Promise<OtpSendResp> => {
  return apiPost<OtpSendResp>(API_ENDPOINTS.OTP.SEND_SIGNUP, data, {
    service: "auth",
    action: "sendOtpSignup",
  });
};

/**
 * Verify OTP for signup
 * POST /api/otp/verify/signup
 */
export const verifyOtpSignup = async (
  data: VerifyOtpRequest
): Promise<OtpVerifyResp> => {
  return apiPost<OtpVerifyResp>(API_ENDPOINTS.OTP.VERIFY_SIGNUP, data, {
    service: "auth",
    action: "verifyOtpSignup",
  });
};

/**
 * Send OTP for forgot password
 * POST /api/otp/send/forgot-password
 */
export const sendOtpForgotPassword = async (
  data: SendOtpRequest
): Promise<OtpSendResp> => {
  return apiPost<OtpSendResp>(API_ENDPOINTS.OTP.SEND_FORGOT_PASSWORD, data, {
    service: "auth",
    action: "sendOtpForgotPassword",
  });
};

/**
 * Verify OTP and reset password
 * POST /api/otp/verify/reset-password
 */
export const verifyAndResetPassword = async (
  data: VerifyOtpAndResetPasswordRequest
): Promise<OtpVerifyAndResetPasswordResp> => {
  return apiPost<OtpVerifyAndResetPasswordResp>(
    API_ENDPOINTS.OTP.VERIFY_AND_RESET,
    data,
    {
      service: "auth",
      action: "verifyAndResetPassword",
    }
  );
};

/**
 * Social Authentication Functions
 */

/**
 * Get social login configuration
 * GET /api/auth/social/config
 */
export const getSocialConfig = async (): Promise<Record<string, string>> => {
  return apiGet<Record<string, string>>(
    API_ENDPOINTS.AUTH.SOCIAL_CONFIG,
    undefined,
    {
      service: "auth",
      action: "getSocialConfig",
    }
  );
};

/**
 * Google login
 * POST /api/auth/google/login
 */
export const googleLogin = async (
  data: GoogleTokenRequest
): Promise<LoginResult | SocialAuthResponse> => {
  return apiPost<LoginResult | SocialAuthResponse>(
    API_ENDPOINTS.AUTH.GOOGLE_LOGIN,
    data,
    {
      service: "auth",
      action: "googleLogin",
    }
  );
};

/**
 * LinkedIn login
 * POST /api/auth/linkedin/login
 */
export const linkedinLogin = async (
  data: LinkedInTokenRequest
): Promise<LoginResult | SocialAuthResponse> => {
  return apiPost<LoginResult | SocialAuthResponse>(
    API_ENDPOINTS.AUTH.LINKEDIN_LOGIN,
    data,
    {
      service: "auth",
      action: "linkedinLogin",
    }
  );
};

/**
 * Social account registration
 * POST /api/auth/social/register
 */
export const registerSocial = async (
  data: SocialRegisterRequest
): Promise<LoginResult> => {
  return apiPost<LoginResult>(API_ENDPOINTS.AUTH.REGISTER_SOCIAL, data, {
    service: "auth",
    action: "registerSocial",
  });
};

/**
 * Check if email or username already exists
 * POST /api/auth/check-email-username?email={email}&username={username}
 *
 * @param email - Email address to check (optional)
 * @param username - Username to check (optional)
 * @returns true if exists, false if not exists
 */
export const checkEmailUsernameExist = async (
  email?: string,
  username?: string
): Promise<boolean> => {
  const queryParams: Record<string, string> = {};
  if (email) queryParams.email = email;
  if (username) queryParams.username = username;

  return apiPost<boolean>(
    API_ENDPOINTS.AUTH.CHECK_EMAIL_USERNAME,
    undefined,
    {
      service: "auth",
      action: "checkEmailUsernameExist",
      silent: true, // Don't show error toast for validation calls
    },
    {
      params: queryParams,
    }
  );
};
