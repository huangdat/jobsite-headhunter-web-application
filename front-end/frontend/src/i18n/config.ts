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
