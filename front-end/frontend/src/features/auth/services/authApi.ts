import { apiClient } from "@/shared/utils/axios";
import type {
  ApiResponse,
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
} from "../types";

export const login = async (data: LoginRequest) => {
  const res = await apiClient.post<ApiResponse<LoginResult>>(
    "/api/auth/login",
    data,
  );

  return res.data.result;
};

export const validateToken = async (data: ValidateTokenRequest) => {
  const res = await apiClient.post<ApiResponse<ValidateTokenResult>>(
    "/api/auth/token-validate",
    data,
  );

  return res.data.result;
};

export const logout = async (data: LogoutRequest) => {
  const res = await apiClient.post<ApiResponse<void>>("/api/auth/logout", data);

  return res.data.result;
};

export const register = async (data: RegisterFormData) => {
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
  let endpoint = "/api/account/signup-candidate"; // default

  if (data.role === "headhunter") {
    endpoint = "/api/account/signup-headhunter";
    formData.append("taxCode", data.taxCode);
    // companyName and addressMain are NOT sent — backend derives them from the taxCode MST lookup
    // Optional headhunter fields
    if (data.websiteUrl) formData.append("websiteUrl", data.websiteUrl);
    if (data.companyScale) formData.append("companyScale", data.companyScale);
  } else if (data.role === "collaborator") {
    endpoint = "/api/account/signup-collaborator";

    // Optional collaborator fields
    if (data.commissionRate !== undefined) {
      formData.append("commissionRate", data.commissionRate.toString());
    }
  } else if (data.role === "candidate") {
    // Optional candidate fields
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

  // Send to correct endpoint with FormData
  const res = await apiClient.post<ApiResponse<AccountResp>>(
    endpoint,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return res.data.result;
};

export const changePassword = async (data: ChangePasswordFormData) => {
  const payload = {
    oldPassword: data.currentPassword,
    newPassword: data.newPassword,
    reNewPassword: data.confirmPassword,
  };

  const res = await apiClient.put<ApiResponse<string>>(
    "/api/account/changeMyPassword",
    payload,
  );

  return res.data.result;
};

// OTP Functions
export const sendOtpSignup = async (data: SendOtpRequest) => {
  const res = await apiClient.post<ApiResponse<OtpSendResp>>(
    "/api/otp/send-signup",
    data,
  );

  return res.data.result;
};

export const verifyOtpSignup = async (data: VerifyOtpRequest) => {
  const res = await apiClient.post<ApiResponse<OtpVerifyResp>>(
    "/api/otp/verify-signup",
    data,
  );

  return res.data.result;
};

export const sendOtpForgotPassword = async (data: SendOtpRequest) => {
  const res = await apiClient.post<ApiResponse<OtpSendResp>>(
    "/api/otp/send-forgot-password",
    data,
  );

  return res.data.result;
};

export const verifyAndResetPassword = async (
  data: VerifyOtpAndResetPasswordRequest,
) => {
  const res = await apiClient.post<ApiResponse<OtpVerifyAndResetPasswordResp>>(
    "/api/otp/verify-and-reset-password",
    data,
  );

  return res.data.result;
};
// API for social login (Google, LinkedIn)
export const getSocialConfig = async () => {
  const res = await apiClient.get<ApiResponse<Record<string, string>>>(
    "/api/auth/social-config",
  );
  return res.data.result;
};

export const googleLogin = async (data: GoogleTokenRequest) => {
  const res = await apiClient.post<
    ApiResponse<LoginResult | SocialAuthResponse>
  >("/api/auth/google/login", data);
  return res.data.result;
};

export const linkedinLogin = async (data: LinkedInTokenRequest) => {
  const res = await apiClient.post<
    ApiResponse<LoginResult | SocialAuthResponse>
  >("/api/auth/linkedin/oauth", data);
  return res.data.result;
};

export const registerSocial = async (data: SocialRegisterRequest) => {
  const res = await apiClient.post<ApiResponse<LoginResult>>(
    "/api/auth/register-social",
    data,
  );
  return res.data.result;
};
