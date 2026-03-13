const ERROR_CODE_MAP: Record<string, string> = {
  ACCOUNT_NOT_FOUND: "Account not found.",
  USER_NOT_FOUND: "User not found.",
  INVALID_CREDENTIALS: "Invalid username/email or password.",
  UNAUTHENTICATED: "Unauthorized request. Please sign in again.",
  FORBIDDEN: "You do not have permission to perform this action.",
  EMAIL_INVALID: "Please enter a valid email address.",
  USERNAME_INVALID: "Please enter a valid username.",
  PASSWORD_INVALID: "Password does not meet security requirements.",
  OTP_INVALID: "The OTP code is invalid.",
  OTP_EXPIRED: "The OTP code has expired. Please request a new one.",
  TOKEN_EXPIRED: "Your session has expired. Please sign in again.",
  TOKEN_INVALID: "Your session is invalid. Please sign in again.",
  DATA_INVALID: "Submitted data is invalid. Please review and try again.",
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

export const extractApiErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  let rawMessage = "";

  if (
    error instanceof Error &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null
  ) {
    const response = error.response as {
      data?: { message?: string };
      status?: number;
    };

    rawMessage = response.data?.message?.trim() || "";

    if (!rawMessage && response.status === 401) {
      return "Unauthorized request. Please sign in again.";
    }

    if (!rawMessage && response.status === 404) {
      return "Requested resource was not found.";
    }
  } else if (error instanceof Error) {
    rawMessage = error.message?.trim() || "";
  }

  if (!rawMessage) {
    return fallbackMessage;
  }

  const codeKey = toCodeKey(rawMessage);
  if (ERROR_CODE_MAP[codeKey]) {
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
    return "Cannot connect to server. Please check your connection and try again.";
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
