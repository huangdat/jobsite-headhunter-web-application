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

  return rawMessage;
};
