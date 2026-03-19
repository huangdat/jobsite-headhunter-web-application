import { useAppTranslation } from "./useAppTranslation";

/**
 * Hook for users feature translations
 * Usage: const { t } = useUsersTranslation();
 * Access: t("list.pageTitle"), t("filters.filterRole"), etc.
 */
export const useUsersTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string) => t(`users.${key}`),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for jobs feature translations
 * Usage: const { t } = useJobsTranslation();
 * Access: t("list.pageTitle"), t("filters.filterStatus"), etc.
 */
export const useJobsTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string) => t(`jobs.${key}`),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for auth feature translations
 * Usage: const { t } = useAuthTranslation();
 */
export const useAuthTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string) => t(`auth.${key}`),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for home feature translations
 * Usage: const { t } = useHomeTranslation();
 */
export const useHomeTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string) => t(`home.${key}`),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};
