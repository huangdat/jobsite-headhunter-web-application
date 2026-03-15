import { useState, useCallback, useRef, useEffect } from "react";
import { checkEmailUsernameExist } from "../services/authApi";

interface CheckState {
  isLoading: boolean;
  error: string | null;
  isDuplicate: boolean;
}

interface UseDuplicateCheckReturn {
  emailCheck: CheckState;
  usernameCheck: CheckState;
  checkEmail: (email: string) => void;
  checkUsername: (username: string) => void;
}

export function useDuplicateCheck(): UseDuplicateCheckReturn {
  const [emailCheck, setEmailCheck] = useState<CheckState>({
    isLoading: false,
    error: null,
    isDuplicate: false,
  });

  const [usernameCheck, setUsernameCheck] = useState<CheckState>({
    isLoading: false,
    error: null,
    isDuplicate: false,
  });

  const checkEmail = useCallback(async (email: string) => {
    if (!email.trim()) {
      setEmailCheck({ isLoading: false, error: null, isDuplicate: false });
      return;
    }
    setEmailCheck({ isLoading: true, error: null, isDuplicate: false });
    try {
      const exists = await checkEmailUsernameExist(email);
      setEmailCheck({
        isLoading: false,
        error: exists ? "Email already exists" : null,
        isDuplicate: exists,
      });
    } catch (err) {
      setEmailCheck({
        isLoading: false,
        error: "Failed to check email",
        isDuplicate: false,
      });
    }
  }, []);

  const checkUsername = useCallback(async (username: string) => {
    if (!username.trim()) {
      setUsernameCheck({ isLoading: false, error: null, isDuplicate: false });
      return;
    }
    setUsernameCheck({ isLoading: true, error: null, isDuplicate: false });
    try {
      const exists = await checkEmailUsernameExist(undefined, username);
      setUsernameCheck({
        isLoading: false,
        error: exists ? "Username already taken" : null,
        isDuplicate: exists,
      });
    } catch (err) {
      setUsernameCheck({
        isLoading: false,
        error: "Failed to check username",
        isDuplicate: false,
      });
    }
  }, []);

  return {
    emailCheck,
    usernameCheck,
    checkEmail,
    checkUsername,
  };
}
