import { apiClient } from "@/shared/utils/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { cachedApiCall } from "@/shared/utils/apiCache";
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
} from "@/features/auth/types";

export const login = async (data: LoginRequest) => {
  const res = await apiClient.post<ApiResponse<LoginResult>>(
    API_ENDPOINTS.AUTH.LOGIN,
    data
  );

  return res.data.result;
};

export const validateToken = async (data: ValidateTokenRequest) => {
  return cachedApiCall(
    `validate-token-${data.token}`,
    async () => {
      const res = await apiClient.post<ApiResponse<ValidateTokenResult>>(
        API_ENDPOINTS.AUTH.VALIDATE_TOKEN,
        data
      );
      return res.data.result;
    },
    { ttl: 60000 } // Cache for 1 minute
  );
};

export const logout = async (data: LogoutRequest) => {
  const res = await apiClient.post<ApiResponse<void>>(
    API_ENDPOINTS.AUTH.LOGOUT,
    data
  );

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
  let endpoint = API_ENDPOINTS.ACCOUNT.SIGNUP_CANDIDATE; // default

  if (data.role === "headhunter") {
    endpoint = API_ENDPOINTS.ACCOUNT.SIGNUP_HEADHUNTER;
    formData.append("taxCode", data.taxCode);
    // companyName and addressMain are NOT sent — backend derives them from the taxCode MST lookup
    // Optional headhunter fields
    if (data.websiteUrl) formData.append("websiteUrl", data.websiteUrl);
    if (data.companyScale) formData.append("companyScale", data.companyScale);
  } else if (data.role === "collaborator") {
    endpoint = API_ENDPOINTS.ACCOUNT.SIGNUP_COLLABORATOR;

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
    }
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
    API_ENDPOINTS.ACCOUNT.CHANGE_PASSWORD,
    payload
  );

  return res.data.result;
};

// OTP Functions
export const sendOtpSignup = async (data: SendOtpRequest) => {
  const res = await apiClient.post<ApiResponse<OtpSendResp>>(
    API_ENDPOINTS.OTP.SEND_SIGNUP,
    data
  );

  return res.data.result;
};

export const verifyOtpSignup = async (data: VerifyOtpRequest) => {
  const res = await apiClient.post<ApiResponse<OtpVerifyResp>>(
    API_ENDPOINTS.OTP.VERIFY_SIGNUP,
    data
  );

  return res.data.result;
};

export const sendOtpForgotPassword = async (data: SendOtpRequest) => {
  const res = await apiClient.post<ApiResponse<OtpSendResp>>(
    API_ENDPOINTS.OTP.SEND_FORGOT_PASSWORD,
    data
  );

  return res.data.result;
};

export const verifyAndResetPassword = async (
  data: VerifyOtpAndResetPasswordRequest
) => {
  const res = await apiClient.post<ApiResponse<OtpVerifyAndResetPasswordResp>>(
    API_ENDPOINTS.OTP.VERIFY_AND_RESET,
    data
  );

  return res.data.result;
};
// API for social login (Google, LinkedIn)
export const getSocialConfig = async () => {
  const res = await apiClient.get<ApiResponse<Record<string, string>>>(
    API_ENDPOINTS.AUTH.SOCIAL_CONFIG
  );
  return res.data.result;
};

export const googleLogin = async (data: GoogleTokenRequest) => {
  const res = await apiClient.post<
    ApiResponse<LoginResult | SocialAuthResponse>
  >(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, data);
  return res.data.result;
};

export const linkedinLogin = async (data: LinkedInTokenRequest) => {
  const res = await apiClient.post<
    ApiResponse<LoginResult | SocialAuthResponse>
  >(API_ENDPOINTS.AUTH.LINKEDIN_LOGIN, data);
  return res.data.result;
};

export const registerSocial = async (data: SocialRegisterRequest) => {
  const res = await apiClient.post<ApiResponse<LoginResult>>(
    API_ENDPOINTS.AUTH.REGISTER_SOCIAL,
    data
  );
  return res.data.result;
};

// Check if email or username already exists
export const checkEmailUsernameExist = async (
  email?: string,
  username?: string
): Promise<boolean> => {
  const params = new URLSearchParams();
  if (email) params.append("email", email);
  if (username) params.append("username", username);

  // Replace post method instead of get to match backend api design
  const res = await apiClient.post<ApiResponse<boolean>>(
    `${API_ENDPOINTS.AUTH.CHECK_EMAIL_USERNAME}?${params.toString()}`
  );

  return res.data.result;
};
