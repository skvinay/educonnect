import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    resources: {
      en: { translation: {} },  // English
      hi: { translation: {} },  // Hindi ✅
      bn: { translation: {} },  // Bengali ✅
      te: { translation: {} },  // Telugu ✅
      mr: { translation: {} },  // Marathi ✅
      ta: { translation: {} },  // Tamil ✅
      ur: { translation: {} },  // Urdu ✅
      gu: { translation: {} },  // Gujarati ✅
      kn: { translation: {} },  // Kannada ✅
      ml: { translation: {} },  // Malayalam ✅
      or: { translation: {} },  // Odia ✅
      pa: { translation: {} },  // Punjabi ✅
      as: { translation: {} },  // Assamese ✅
      ne: { translation: {} },  // Nepali ✅
      sd: { translation: {} },  // Sindhi ✅
      sa: { translation: {} },  // Sanskrit ✅
    },
  });

export default i18n;
