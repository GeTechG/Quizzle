import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import de from "./locales/de.json";
import en from "./locales/en.json";
import ru from "./locales/ru.json";

export const SUPPORTED_LANGUAGES = [
    {code: "de", label: "Deutsch", flag: "🇩🇪"},
    {code: "en", label: "English", flag: "🇬🇧"},
    {code: "ru", label: "Русский", flag: "🇷🇺"},
];

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            de: {translation: de},
            en: {translation: en},
            ru: {translation: ru},
        },
        fallbackLng: "de",
        supportedLngs: SUPPORTED_LANGUAGES.map(l => l.code),
        detection: {
            order: ["localStorage", "navigator"],
            lookupLocalStorage: "quizzle_lang",
            caches: ["localStorage"],
        },
        interpolation: {escapeValue: false},
        returnNull: false,
    });

export default i18n;
