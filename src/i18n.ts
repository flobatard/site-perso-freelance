import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import fr from "./locales/fr.json";
import en from "./locales/en.json";

const isServer = typeof window === "undefined";

const instance = isServer
  ? i18n.use(initReactI18next)
  : i18n.use(LanguageDetector).use(initReactI18next);

instance.init({
  fallbackLng: "en",
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detection: {
    order: ["cookie", "localStorage", "navigator"],
    caches: ["cookie", "localStorage"],
    cookieName: "lang",
    cookieOptions: { path: "/", sameSite: "lax", maxAge: 31536000 },
  } as any,
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
});

export default i18n;