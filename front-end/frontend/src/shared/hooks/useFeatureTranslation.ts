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
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`auth.${key}`, interpolation),
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

/**
 * Hook for candidate feature translations
 * Usage: const { t } = useCandidateTranslation();
 */
export const useCandidateTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string) => t(`candidate.${key}`),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for admin features translations
 * Usage: const { t } = useAdminFeaturesTranslation();
 */
export const useAdminFeaturesTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string) => t(`adminFeatures.${key}`),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for business feature translations
 * Usage: const { t } = useBusinessTranslation();
 */
export const useBusinessTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string) => t(`business.${key}`),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for commission feature translations
 * Usage: const { t } = useCommissionTranslation();
 */
export const useCommissionTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string) => t(`commission.${key}`),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for navigation translations
 * Usage: const { t } = useNavigationTranslation();
 */
export const useNavigationTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string) => t(`navigation.${key}`),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};
