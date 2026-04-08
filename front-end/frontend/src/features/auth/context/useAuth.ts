import { useContext } from "react";
import { useTranslation } from "react-i18next";

import { AuthContext } from "@/features/auth/context/AuthContext";

export function useAuth() {
  const { t } = useTranslation();
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(t("auth.messages.useAuthError"));
  }

  return context;
}
