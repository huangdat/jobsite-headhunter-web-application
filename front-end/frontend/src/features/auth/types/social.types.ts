import { type UserRole } from "@/features/auth/types/auth.types";

export type SocialProvider = "GOOGLE" | "LINKEDIN" | "FACEBOOK" | "LOCAL";

/* ---------- API REQUEST ---------- */

export interface SocialRegisterRequest {
  email: string;
  provider: SocialProvider;
  providerId: string;
  role: UserRole;
  fullName: string;
  imageUrl?: string;
}

export interface LinkedInTokenRequest {
  code: string;
  redirectUri: string;
}

export interface GoogleTokenRequest {
  idToken: string;
}

/* ---------- API RESPONSE ---------- */

export interface LinkedInTokenResponse {
  accessToken: string;
  expiresIn: number;
  scope: string;
}

export interface LinkedInUserInfoResponse {
  sub: string;
  email: string;
  fullName: string;
  imageUrl?: string;
}

export interface SocialAuthResponse {
  email: string;
  provider: SocialProvider;
  providerId: string;
  fullName: string;
  imageUrl?: string;
}
