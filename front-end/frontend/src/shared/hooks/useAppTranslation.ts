import { useTranslation } from "react-i18next";
import { useMemo } from "react";

/**
 * Hook to use translations throughout the app
 * Usage: const { t, i18n } = useAppTranslation();
 */
export const useAppTranslation = () => {
  const { t, i18n } = useTranslation("translation");

  const changeLanguage = (lng: string) => {
    void i18n.changeLanguage(lng);
  };

  const currentLanguage = useMemo(
    () => ({
      code: i18n.language,
      nativeName: i18n.language === "vi" ? "Tiếng Việt" : "English",
    }),
    [i18n.language]
  );

  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage,
  };
};
