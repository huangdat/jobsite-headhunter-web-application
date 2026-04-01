import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import English namespaces (22 consolidated files)
import enAria from "./locales/en/aria.json";
import enAuth from "./locales/en/auth.json";
import enBusiness from "./locales/en/business.json";
import enCandidate from "./locales/en/candidate.json";
import enCommission from "./locales/en/commission.json";
import enCommon from "./locales/en/common.json";
import enCv from "./locales/en/cv.json";
import enDialogs from "./locales/en/dialogs.json";
import enFooter from "./locales/en/footer.json";
import enForm from "./locales/en/form.json";
import enHeadhunter from "./locales/en/headhunter.json";
import enHome from "./locales/en/home.json";
import enJobs from "./locales/en/jobs.json";
import enMessages from "./locales/en/messages.json";
import enPages from "./locales/en/pages.json";
import enProfile from "./locales/en/profile.json";
import enSection from "./locales/en/section.json";
import enStatuses from "./locales/en/statuses.json";
import enUi from "./locales/en/ui.json";
import enUsers from "./locales/en/users.json";
import enValidation from "./locales/en/validation.json";
import enApplications from "./locales/en/applications.json";

// Import Vietnamese namespaces (22 consolidated files)
import viAria from "./locales/vi/aria.json";
import viAuth from "./locales/vi/auth.json";
import viBusiness from "./locales/vi/business.json";
import viCandidate from "./locales/vi/candidate.json";
import viCommission from "./locales/vi/commission.json";
import viCommon from "./locales/vi/common.json";
import viCv from "./locales/vi/cv.json";
import viDialogs from "./locales/vi/dialogs.json";
import viFooter from "./locales/vi/footer.json";
import viForm from "./locales/vi/form.json";
import viHeadhunter from "./locales/vi/headhunter.json";
import viHome from "./locales/vi/home.json";
import viJobs from "./locales/vi/jobs.json";
import viMessages from "./locales/vi/messages.json";
import viPages from "./locales/vi/pages.json";
import viProfile from "./locales/vi/profile.json";
import viSection from "./locales/vi/section.json";
import viStatuses from "./locales/vi/statuses.json";
import viUi from "./locales/vi/ui.json";
import viUsers from "./locales/vi/users.json";
import viValidation from "./locales/vi/validation.json";
import viApplications from "./locales/vi/applications.json";

const resources = {
  en: {
    translation: {
      ...enCommon,
      ...enAria,
      applications: enApplications,
      auth: enAuth,
      business: enBusiness,
      candidate: enCandidate,
      commission: enCommission,
      cv: enCv,
      dialogs: enDialogs,
      footer: enFooter,
      form: enForm,
      headhunter: enHeadhunter,
      home: enHome,
      jobs: enJobs,
      messages: enMessages,
      pages: enPages,
      profile: enProfile,
      section: enSection,
      statuses: enStatuses,
      ui: enUi,
      users: enUsers,
      validation: enValidation,
    },
    candidate: enCandidate,
    profile: enProfile,
    cv: enCv,
  },
  vi: {
    translation: {
      ...viCommon,
      ...viAria,
      applications: viApplications,
      auth: viAuth,
      business: viBusiness,
      candidate: viCandidate,
      commission: viCommission,
      cv: viCv,
      dialogs: viDialogs,
      footer: viFooter,
      form: viForm,
      headhunter: viHeadhunter,
      home: viHome,
      jobs: viJobs,
      messages: viMessages,
      pages: viPages,
      profile: viProfile,
      section: viSection,
      statuses: viStatuses,
      ui: viUi,
      users: viUsers,
      validation: viValidation,
    },
    candidate: viCandidate,
    profile: viProfile,
    cv: viCv,
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
