import { apiClient } from "@/shared/utils/axios";
import type {
  ApiResponse,
  LoginRequest,
  LoginResult,
  ValidateTokenRequest,
  ValidateTokenResult,
  LogoutRequest,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  ChangePasswordFormData,
} from "../types";

export const login = async (data: LoginRequest) => {
  const res = await apiClient.post<ApiResponse<LoginResult>>("/api/auth/login", data);

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
  const res = await apiClient.post<ApiResponse<string>>("/api/auth/logout", data);

  return res.data.result;
};

export const register = async (data: RegisterFormData) => {
  const res = await apiClient.post<ApiResponse<LoginResult>>(
    "/api/auth/register",
    data,
  );

  return res.data.result;
};

export const forgotPassword = async (data: ForgotPasswordFormData) => {
  const res = await apiClient.post<ApiResponse<string>>(
    "/api/auth/forgot-password",
    data,
  );

  return res.data.result;
};

export const resetPassword = async (data: ResetPasswordFormData & { token: string }) => {
  const res = await apiClient.post<ApiResponse<string>>(
    "/api/auth/reset-password",
    data,
  );

  return res.data.result;
};

export const changePassword = async (data: ChangePasswordFormData) => {
  const res = await apiClient.post<ApiResponse<string>>(
    "/api/auth/change-password",
    data,
  );

  return res.data.result;
};
