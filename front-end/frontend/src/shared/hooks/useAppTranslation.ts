import { useTranslation } from "react-i18next";
import { useMemo } from "react";

/**
 * Language display names mapping
 * No need to add to i18n JSON files - hardcoded for simplicity
 */
const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  vi: "Vietnamese",
};

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
      nativeName: LANGUAGE_NAMES[i18n.language] || i18n.language,
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
