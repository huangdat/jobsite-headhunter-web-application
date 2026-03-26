const ERROR_CODE_MAP: Record<string, string> = {
  ACCOUNT_NOT_FOUND: "auth.messages.accountNotFound",
  USER_NOT_FOUND: "auth.messages.userNotFound",
  INVALID_CREDENTIALS: "auth.messages.invalidUsernameEmailPassword",
  UNAUTHENTICATED: "auth.messages.unauthorizedRequest",
  FORBIDDEN: "auth.messages.noPermission",
  EMAIL_INVALID: "auth.messages.invalidEmail",
  USERNAME_INVALID: "auth.messages.invalidUsername",
  PASSWORD_INVALID: "auth.messages.passwordNotMeetSecurity",
  OTP_INVALID: "auth.messages.invalidOtpCode",
  OTP_EXPIRED: "auth.messages.otpExpired",
  TOKEN_EXPIRED: "auth.messages.sessionExpired",
  TOKEN_INVALID: "auth.messages.sessionInvalid",
  DATA_INVALID: "auth.messages.dataInvalid",
};

const ASCII_ONLY_REGEX = /^[\u0020-\u007E]+$/;
const VIETNAMESE_NO_ACCENT_REGEX =
  /\b(vui\s*long|khong|khong\s*hop\s*le|khong\s*ton\s*tai|mat\s*khau|tai\s*khoan|dang\s*nhap|xac\s*thuc|that\s*bai|thanh\s*cong)\b/i;

const toCodeKey = (input: string): string =>
  input
    .trim()
    .toUpperCase()
    .replace(/[\s.-]+/g, "_")
    .replace(/[^A-Z0-9_]/g, "");

interface ApiErrorResponse {
  data?: { message?: string };
  status?: number;
}

export const extractApiErrorMessage = (
  error: unknown,
  fallbackMessage: string
): string => {
  let rawMessage = "";

  if (
    error instanceof Error &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: unknown }).response !== null
  ) {
    const response = (error as { response?: ApiErrorResponse })
      .response as ApiErrorResponse;

    rawMessage = response.data?.message?.trim() || "";

    if (!rawMessage && response.status === 401) {
      return "auth.messages.unauthorizedRequest";
    }

    if (!rawMessage && response.status === 404) {
      return "auth.messages.resourceNotFound";
    }
  } else if (error instanceof Error) {
    rawMessage = error.message?.trim() || "";
  }

  if (!rawMessage) {
    return fallbackMessage;
  }

  const codeKey = toCodeKey(rawMessage);
  // eslint-disable-next-line security/detect-object-injection
  if (ERROR_CODE_MAP[codeKey]) {
    // ERROR_CODE_MAP returns i18n keys, return as is
    // eslint-disable-next-line security/detect-object-injection
    return ERROR_CODE_MAP[codeKey];
  }

  const upper = rawMessage.toUpperCase();
  if (
    upper.includes("INTERNAL_SERVER_ERROR") ||
    upper.includes("NULLPOINTER") ||
    upper.includes("STACKTRACE") ||
    upper.includes("SQL") ||
    upper.includes("EXCEPTION")
  ) {
    return fallbackMessage;
  }

  if (upper === "NETWORK ERROR") {
    return "auth.messages.networkError";
  }

  // Keep frontend notifications in English only.
  if (
    !ASCII_ONLY_REGEX.test(rawMessage) ||
    VIETNAMESE_NO_ACCENT_REGEX.test(rawMessage)
  ) {
    return fallbackMessage;
  }

  return rawMessage;
};

export const ERROR_MESSAGES = {
  otpExpired: "auth.messages.otpExpired",
  sessionExpired: "auth.messages.sessionExpired",
  sessionInvalid: "auth.messages.sessionInvalid",
  dataInvalid: "auth.messages.dataInvalid",
  unauthorizedRequest: "auth.messages.unauthorizedRequest",
  resourceNotFound: "auth.messages.resourceNotFound",
  networkError: "auth.messages.networkError",
} as const;
