import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import vi from "./locales/vi.json";

const resources = {
  en: { translation: en },
  vi: { translation: vi },
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
  debug: false,
  interpolation: {
    escapeValue: false, // React already handles XSS
  },
});

// Persist language preference
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});

export default i18n;
