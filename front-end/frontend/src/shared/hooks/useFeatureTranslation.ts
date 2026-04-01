import { useAppTranslation } from "./useAppTranslation";

/**
 * Translation Hooks for 21 Namespaces
 * Each hook provides scoped translations for a specific feature domain
 */

/**
 * Hook for aria feature translations
 * Usage: const { t } = useAriaTranslation();
 * Access: t("someKey") → aria.someKey
 */
export const useAriaTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`aria.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for auth feature translations
 * Usage: const { t } = useAuthTranslation();
 * Access: t("someKey") → auth.someKey
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
 * Hook for business feature translations
 * Usage: const { t } = useBusinessTranslation();
 * Access: t("someKey") → business.someKey
 */
export const useBusinessTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`business.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for candidate feature translations
 * Usage: const { t } = useCandidateTranslation();
 * Access: t("someKey") → candidate.someKey
 */
export const useCandidateTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`candidate.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for commission feature translations
 * Usage: const { t } = useCommissionTranslation();
 * Access: t("someKey") → commission.someKey
 */
export const useCommissionTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`commission.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for cv feature translations
 * Usage: const { t } = useCvTranslation();
 * Access: t("someKey") → cv.someKey
 */
export const useCvTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`cv.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for dialogs feature translations
 * Usage: const { t } = useDialogsTranslation();
 * Access: t("someKey") → dialogs.someKey
 */
export const useDialogsTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`dialogs.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for form feature translations
 * Usage: const { t } = useFormTranslation();
 * Access: t("someKey") → form.someKey
 */
export const useFormTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`form.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for headhunter feature translations
 * Usage: const { t } = useHeadhunterTranslation();
 * Access: t("someKey") → headhunter.someKey
 */
export const useHeadhunterTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`headhunter.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for jobs feature translations
 * Usage: const { t } = useJobsTranslation();
 * Access: t("someKey") → jobs.someKey
 */
export const useJobsTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`jobs.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for messages feature translations
 * Usage: const { t } = useMessagesTranslation();
 * Access: t("someKey") → messages.someKey
 */
export const useMessagesTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`messages.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for pages feature translations
 * Usage: const { t } = usePagesTranslation();
 * Access: t("someKey") → pages.someKey
 */
export const usePagesTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`pages.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for profile feature translations
 * Usage: const { t } = useProfileTranslation();
 * Access: t("someKey") → profile.someKey
 */
export const useProfileTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`profile.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for section feature translations
 * Usage: const { t } = useSectionTranslation();
 * Access: t("someKey") → section.someKey
 */
export const useSectionTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`section.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for statuses feature translations
 * Usage: const { t } = useStatusesTranslation();
 * Access: t("someKey") → statuses.someKey
 */
export const useStatusesTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`statuses.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for users feature translations
 * Usage: const { t } = useUsersTranslation();
 * Access: t("someKey") → users.someKey
 */
export const useUsersTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`users.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for validation feature translations
 * Usage: const { t } = useValidationTranslation();
 * Access: t("someKey") → validation.someKey
 */
export const useValidationTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`validation.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for common translations
 * Usage: const { t } = useCommonTranslation();
 * Access: t("error") → common.error
 */
export const useCommonTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`common.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for footer feature translations
 * Usage: const { t } = useFooterTranslation();
 * Access: t("copyright") → footer.copyright
 */
export const useFooterTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`footer.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for home feature translations
 * Usage: const { t } = useHomeTranslation();
 * Access: t("hero.title") → home.hero.title
 */
export const useHomeTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`home.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Hook for ui feature translations
 * Usage: const { t } = useUiTranslation();
 * Access: t("badges.verified") → ui.badges.verified
 */
export const useUiTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`ui.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * ========== CONVENIENCE ALIASES ==========
 * These hooks are aliases to nested keys within the dialogs namespace
 */

/**
 * Alias Hook for delete dialogs
 * Maps to: dialogs.delete.*
 * Usage: const { t } = useDeleteTranslation();
 * Access: t("title") → dialogs.delete.title
 */
export const useDeleteTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`dialogs.delete.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Alias Hook for lock dialogs
 * Maps to: dialogs.lock.*
 * Usage: const { t } = useLockTranslation();
 * Access: t("title") → dialogs.lock.title
 */
export const useLockTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`dialogs.lock.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

/**
 * Alias Hook for unlock dialogs
 * Maps to: dialogs.unlock.*
 * Usage: const { t } = useUnlockTranslation();
 * Access: t("title") → dialogs.unlock.title
 */
export const useUnlockTranslation = () => {
  const { t, i18n, changeLanguage, currentLanguage } = useAppTranslation();

  return {
    t: (key: string, interpolation?: Record<string, string | number>) =>
      t(`dialogs.unlock.${key}`, interpolation),
    i18n,
    changeLanguage,
    currentLanguage,
  };
};
