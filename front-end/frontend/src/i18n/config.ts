import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import English namespaces
import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enHome from "./locales/en/home.json";
import enNavigation from "./locales/en/navigation.json";
import enUsers from "./locales/en/users.json";
import enJobs from "./locales/en/jobs.json";
import enCandidate from "./locales/en/candidate.json";
import enBusiness from "./locales/en/business.json";
import enCommission from "./locales/en/commission.json";
import enAria from "./locales/en/aria.json";
import enButtons from "./locales/en/buttons.json";
import enDescriptions from "./locales/en/descriptions.json";
import enCheckboxLabels from "./locales/en/checkboxLabels.json";

// Additional English imports
import enBadges from "./locales/en/badges.json";
import enBenefits from "./locales/en/benefits.json";
import enBreadcrumb from "./locales/en/breadcrumb.json";
import enClassification from "./locales/en/classification.json";
import enColumns from "./locales/en/columns.json";
import enCv from "./locales/en/cv.json";
import enDetail from "./locales/en/detail.json";
import enDialogs from "./locales/en/dialogs.json";
import enErrors from "./locales/en/errors.json";
import enFaq from "./locales/en/faq.json";
import enFeaturedJobs from "./locales/en/featuredJobs.json";
import enFilters from "./locales/en/filters.json";
import enFooter from "./locales/en/footer.json";
import enForm from "./locales/en/form.json";
import enHeadhunter from "./locales/en/headhunter.json";
import enHero from "./locales/en/hero.json";
import enHowItWorks from "./locales/en/howItWorks.json";
import enLabels from "./locales/en/labels.json";
import enList from "./locales/en/list.json";
import enLoginStatus from "./locales/en/loginStatus.json";
import enMessages from "./locales/en/messages.json";
import enPages from "./locales/en/pages.json";
import enPlaceholders from "./locales/en/placeholders.json";
import enProfile from "./locales/en/profile.json";
import enRecommendedJobs from "./locales/en/recommendedJobs.json";
import enSearchBar from "./locales/en/searchBar.json";
import enSection from "./locales/en/section.json";
import enSelectOptions from "./locales/en/selectOptions.json";
import enStats from "./locales/en/stats.json";
import enStatuses from "./locales/en/statuses.json";
import enSteps from "./locales/en/steps.json";
import enSuccess from "./locales/en/success.json";
import enTopCompanies from "./locales/en/topCompanies.json";
import enUpload from "./locales/en/upload.json";
import enValidation from "./locales/en/validation.json";
import enWarnings from "./locales/en/warnings.json";

// Import Vietnamese namespaces
import viCommon from "./locales/vi/common.json";
import viAuth from "./locales/vi/auth.json";
import viHome from "./locales/vi/home.json";
import viNavigation from "./locales/vi/navigation.json";
import viUsers from "./locales/vi/users.json";
import viJobs from "./locales/vi/jobs.json";
import viCandidate from "./locales/vi/candidate.json";
import viBusiness from "./locales/vi/business.json";
import viCommission from "./locales/vi/commission.json";
import viAria from "./locales/vi/aria.json";
import viButtons from "./locales/vi/buttons.json";
import viDescriptions from "./locales/vi/descriptions.json";
import viCheckboxLabels from "./locales/vi/checkboxLabels.json";

// Additional Vietnamese imports
import viBadges from "./locales/vi/badges.json";
import viBenefits from "./locales/vi/benefits.json";
import viBreadcrumb from "./locales/vi/breadcrumb.json";
import viClassification from "./locales/vi/classification.json";
import viColumns from "./locales/vi/columns.json";
import viCv from "./locales/vi/cv.json";
import viDetail from "./locales/vi/detail.json";
import viDialogs from "./locales/vi/dialogs.json";
import viErrors from "./locales/vi/errors.json";
import viFaq from "./locales/vi/faq.json";
import viFeaturedJobs from "./locales/vi/featuredJobs.json";
import viFilters from "./locales/vi/filters.json";
import viFooter from "./locales/vi/footer.json";
import viForm from "./locales/vi/form.json";
import viHeadhunter from "./locales/vi/headhunter.json";
import viHero from "./locales/vi/hero.json";
import viHowItWorks from "./locales/vi/howItWorks.json";
import viLabels from "./locales/vi/labels.json";
import viList from "./locales/vi/list.json";
import viLoginStatus from "./locales/vi/loginStatus.json";
import viMessages from "./locales/vi/messages.json";
import viPages from "./locales/vi/pages.json";
import viPlaceholders from "./locales/vi/placeholders.json";
import viProfile from "./locales/vi/profile.json";
import viRecommendedJobs from "./locales/vi/recommendedJobs.json";
import viSearchBar from "./locales/vi/searchBar.json";
import viSection from "./locales/vi/section.json";
import viSelectOptions from "./locales/vi/selectOptions.json";
import viStats from "./locales/vi/stats.json";
import viStatuses from "./locales/vi/statuses.json";
import viSteps from "./locales/vi/steps.json";
import viSuccess from "./locales/vi/success.json";
import viTopCompanies from "./locales/vi/topCompanies.json";
import viUpload from "./locales/vi/upload.json";
import viValidation from "./locales/vi/validation.json";
import viWarnings from "./locales/vi/warnings.json";

const resources = {
  en: {
    translation: {
      ...enCommon,
      ...enAria,
      ...enButtons,
      ...enDescriptions,
      ...enCheckboxLabels,
      home: enHome,
      auth: enAuth,
      navigation: enNavigation,
      users: enUsers,
      jobs: enJobs,
      candidate: enCandidate,
      business: enBusiness,
      commission: enCommission,
      badges: enBadges,
      benefits: enBenefits,
      breadcrumb: enBreadcrumb,
      classification: enClassification,
      columns: enColumns,
      cv: enCv,
      detail: enDetail,
      dialogs: enDialogs,
      errors: enErrors,
      faq: enFaq,
      featuredJobs: enFeaturedJobs,
      filters: enFilters,
      footer: enFooter,
      form: enForm,
      headhunter: enHeadhunter,
      hero: enHero,
      howItWorks: enHowItWorks,
      labels: enLabels,
      list: enList,
      loginStatus: enLoginStatus,
      messages: enMessages,
      pages: enPages,
      placeholders: enPlaceholders,
      profile: enProfile,
      recommendedJobs: enRecommendedJobs,
      searchBar: enSearchBar,
      section: enSection,
      selectOptions: enSelectOptions,
      stats: enStats,
      statuses: enStatuses,
      steps: enSteps,
      success: enSuccess,
      topCompanies: enTopCompanies,
      upload: enUpload,
      validation: enValidation,
      warnings: enWarnings,
    },
  },
  vi: {
    translation: {
      ...viCommon,
      ...viAria,
      ...viButtons,
      ...viDescriptions,
      ...viCheckboxLabels,
      home: viHome,
      auth: viAuth,
      navigation: viNavigation,
      users: viUsers,
      jobs: viJobs,
      candidate: viCandidate,
      business: viBusiness,
      commission: viCommission,
      badges: viBadges,
      benefits: viBenefits,
      breadcrumb: viBreadcrumb,
      classification: viClassification,
      columns: viColumns,
      cv: viCv,
      detail: viDetail,
      dialogs: viDialogs,
      errors: viErrors,
      faq: viFaq,
      featuredJobs: viFeaturedJobs,
      filters: viFilters,
      footer: viFooter,
      form: viForm,
      headhunter: viHeadhunter,
      hero: viHero,
      howItWorks: viHowItWorks,
      labels: viLabels,
      list: viList,
      loginStatus: viLoginStatus,
      messages: viMessages,
      pages: viPages,
      placeholders: viPlaceholders,
      profile: viProfile,
      recommendedJobs: viRecommendedJobs,
      searchBar: viSearchBar,
      section: viSection,
      selectOptions: viSelectOptions,
      stats: viStats,
      statuses: viStatuses,
      steps: viSteps,
      success: viSuccess,
      topCompanies: viTopCompanies,
      upload: viUpload,
      validation: viValidation,
      warnings: viWarnings,
    },
  },
};

// Detect user language from browser or localStorage
const getUserLanguage = (): string => {
  const saved = localStorage.getItem("language");
  if (saved) return saved;
  return navigator.language.split("-")[0] === "vi" ? "vi" : "en";
};

i18n.use(initReactI18next).init({
  resources,
  lng: getUserLanguage(),
  fallbackLng: "en",
  debug: true, // Enable debug mode to log missing keys in console
  ns: ["translation"],
  defaultNS: "translation",
  interpolation: {
    escapeValue: false, // React already handles XSS
  },
});

// Persist language preference
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});

export default i18n;
